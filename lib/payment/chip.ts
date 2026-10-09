import crypto from 'crypto'
import { PaymentProvider, CreatePaymentSessionParams, PaymentSessionResult } from './provider'

const chipBrandId = process.env.CHIP_BRAND_ID || ''
const chipSecretKey = process.env.CHIP_SECRET_KEY || ''
const chipPublicKey = process.env.CHIP_PUBLIC_KEY || ''

// Check whether real CHIP API keys are configured
const isRealChipConfigured =
  Boolean(chipBrandId) &&
  Boolean(chipSecretKey) &&
  !chipSecretKey.includes('demo') &&
  !chipSecretKey.includes('mock')

export class ChipPaymentProvider implements PaymentProvider {
  name = 'chip'

  async createCheckoutSession(params: CreatePaymentSessionParams): Promise<PaymentSessionResult> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // If live/sandbox CHIP credentials are provided
    if (isRealChipConfigured) {
      try {
        const purchasePayload = {
          success_redirect: params.successUrl,
          failure_redirect: params.cancelUrl,
          cancel_redirect: params.cancelUrl,
          success_callback: `${appUrl}/api/webhooks/chip`,
          creator_agent: 'KAMAAR Beddings (Tunas Sinar Jaya Enterprise)',
          reference: params.orderId,
          platform: 'web',
          brand_id: chipBrandId,
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
          },
        }

        const res = await fetch('https://gate.chip-in.asia/api/v1/purchases/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${chipSecretKey}`,
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
      // If CHIP Public Key is configured, verify X-Signature (RSA-SHA256)
      if (chipPublicKey && signature) {
        try {
          const verifier = crypto.createVerify('RSA-SHA256')
          verifier.update(rawBody)
          const isVerified = verifier.verify(chipPublicKey, signature, 'base64')
          if (!isVerified && isRealChipConfigured) {
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
}

export const chipProvider = new ChipPaymentProvider()
