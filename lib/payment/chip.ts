import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { PaymentProvider, CreatePaymentSessionParams, PaymentSessionResult } from './provider'

function getChipConfig() {
  let brandId = process.env.CHIP_BRAND_ID || '80f8627e-70ab-4804-8c58-1288765fc004'
  let secretKey = process.env.CHIP_SECRET_KEY || 'tAzDwpi6wy7ih44rBH0ekLLV2aoaXe5kE7l3WYtfLFbJBvH0u5i-wlUyVTBBUStVFlqw1tYFiiRVtKZcmguaoA=='
  let publicKey = process.env.CHIP_PUBLIC_KEY || ''

  if (!brandId || !secretKey) {
    try {
      const envPath = path.join(process.cwd(), '.env')
      if (fs.existsSync(envPath)) {
        const raw = fs.readFileSync(envPath, 'utf8')
        const brandMatch = raw.match(/^CHIP_BRAND_ID=(.*)$/m)
        const secretMatch = raw.match(/^CHIP_SECRET_KEY=(.*)$/m)
        const publicMatch = raw.match(/^CHIP_PUBLIC_KEY=(.*)$/m)
        if (brandMatch && brandMatch[1].trim()) brandId = brandMatch[1].trim()
        if (secretMatch && secretMatch[1].trim()) secretKey = secretMatch[1].trim()
        if (publicMatch && publicMatch[1].trim()) publicKey = publicMatch[1].trim()
      }
    } catch (_) {}
  }

  const isReal =
    Boolean(brandId) &&
    Boolean(secretKey) &&
    !secretKey.includes('demo') &&
    !secretKey.includes('mock')

  return { brandId, secretKey, publicKey, isReal }
}

export class ChipPaymentProvider implements PaymentProvider {
  name = 'chip'

  async createCheckoutSession(params: CreatePaymentSessionParams): Promise<PaymentSessionResult> {
    let appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined)

    if (!appUrl && params.successUrl) {
      try {
        const u = new URL(params.successUrl)
        appUrl = u.origin
      } catch (_) {}
    }
    if (!appUrl) appUrl = 'http://localhost:3000'

    const { brandId, secretKey, isReal } = getChipConfig()

    // If live/sandbox CHIP credentials are provided
    if (isReal) {
      try {
        const isLocalOrCustomPort = appUrl.includes('localhost') || /:\d+/.test(appUrl)
        const callbackUrl = isLocalOrCustomPort ? undefined : `${appUrl}/api/webhooks/chip`

        const purchasePayload: any = {
          success_redirect: params.successUrl,
          failure_redirect: params.cancelUrl,
          cancel_redirect: params.cancelUrl,
          creator_agent: 'KAMAAR Beddings',
          reference: params.orderId,
          platform: 'web',
          brand_id: brandId,
          client: {
            email: params.customerEmail,
            full_name: params.customerName,
            phone: params.customerPhone || undefined,
          },
          purchase: {
            currency: 'MYR',
            products: params.items.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.unitPriceSen, // in sen (cents)
            })),
            total_override: params.amountSen,
          },
        }

        if (callbackUrl) {
          purchasePayload.success_callback = callbackUrl
        }

        const res = await fetch('https://gate.chip-in.asia/api/v1/purchases/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${secretKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(purchasePayload),
        })

        if (res.ok) {
          const data = await res.json()
          if (data && data.checkout_url) {
            return {
              sessionId: data.id || `chip_${Date.now()}`,
              checkoutUrl: data.checkout_url,
              provider: 'chip',
            }
          }
        } else {
          const errText = await res.text()
          console.error('CHIP API responded with error:', res.status, errText)
        }
      } catch (err) {
        console.error('CHIP API connection error:', err)
      }
    }

    // Development / Sandbox Simulator Fallback (Allows testing without credentials)
    const methodParam = params.preferredMethod ? `&method=${params.preferredMethod}` : '&method=fpx'
    const simulatorUrl = `${appUrl}/checkout/sandbox-pay/${params.orderId}?gateway=chip${methodParam}`

    return {
      sessionId: `chip_sim_${params.orderId}`,
      checkoutUrl: simulatorUrl,
      provider: 'chip_sandbox_simulator',
    }
  }

  async verifyWebhook(
    rawBody: string,
    signature: string
  ): Promise<{ isValid: boolean; eventType?: string; eventId?: string; payload?: any; orderId?: string }> {
    try {
      const { publicKey, isReal } = getChipConfig()
      // If CHIP Public Key is configured, verify X-Signature (RSA-SHA256)
      if (publicKey && signature) {
        try {
          const verifier = crypto.createVerify('RSA-SHA256')
          verifier.update(rawBody)
          const isVerified = verifier.verify(publicKey, signature, 'base64')
          if (!isVerified && isReal) {
            console.warn('CHIP RSA-SHA256 signature verification failed')
            return { isValid: false }
          }
        } catch (verErr) {
          console.warn('CHIP signature verification error:', verErr)
        }
      }

      const data = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody

      // In production with CHIP, reference contains orderId
      const orderId = data.reference || data.order_id || data.metadata?.orderId
      const status = data.status || data.event_type

      const isPaid =
        status === 'paid' ||
        status === 'cleared' ||
        status === 'purchase.paid' ||
        data.event_type === 'purchase.paid'

      if (isPaid) {
        return {
          isValid: true,
          eventType: 'purchase.paid',
          eventId: data.id || `chip_evt_${Date.now()}`,
          orderId,
          payload: data,
        }
      }

      if (status === 'failed' || status === 'cancelled' || status === 'expired') {
        return {
          isValid: true,
          eventType: 'purchase.failed',
          eventId: data.id || `chip_evt_${Date.now()}`,
          orderId,
          payload: data,
        }
      }

      return {
        isValid: true,
        eventType: status || 'purchase.updated',
        eventId: data.id,
        orderId,
        payload: data,
      }
    } catch (err: any) {
      console.error('CHIP Webhook parsing error:', err)
      return { isValid: false }
    }
  }

  async getPurchase(purchaseId: string): Promise<any> {
    const { secretKey } = getChipConfig()
    if (!secretKey || !purchaseId) return null
    try {
      const res = await fetch(`https://gate.chip-in.asia/api/v1/purchases/${purchaseId}/`, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      })
      if (res.ok) {
        return await res.json()
      }
    } catch (err) {
      console.error('CHIP getPurchase error:', err)
    }
    return null
  }

  async findPurchaseByReference(reference: string): Promise<any> {
    const { secretKey } = getChipConfig()
    if (!secretKey || !reference) return null
    try {
      const res = await fetch(
        `https://gate.chip-in.asia/api/v1/purchases/?reference=${encodeURIComponent(reference)}`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      )
      if (res.ok) {
        const data = await res.json()
        if (data && Array.isArray(data.results) && data.results.length > 0) {
          return data.results[0]
        }
        if (data && Array.isArray(data) && data.length > 0) {
          return data[0]
        }
      }
    } catch (err) {
      console.error('CHIP findPurchaseByReference error:', err)
    }
    return null
  }
}

export const chipProvider = new ChipPaymentProvider()
