import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getOrderById, updateOrderStatus, upsertOrder } from '@/lib/db'
import { chipProvider } from '@/lib/payment/chip'
import { Order } from '@/types'

export const dynamic = 'force-dynamic'

async function handleRefresh(orderId: string, orderSnapshot?: any, paymentId?: string) {
  let order: Order | null = await getOrderById(orderId)

  // 1. If not found in DB, check client snapshot passed in request body
  if (!order && orderSnapshot && typeof orderSnapshot === 'object') {
    try {
      const candidate: Order = { ...orderSnapshot, id: orderId }
      order = await upsertOrder(candidate)
    } catch (e) {
      console.warn('Failed to upsert client snapshot:', e)
    }
  }

  // 2. If still not found, check server cookies
  if (!order) {
    try {
      const cookieStore = cookies()
      const rawCookie =
        cookieStore.get(`kamaar_order_${orderId}`) ||
        cookieStore.get('kamaar_last_order')
      if (rawCookie?.value) {
        const decoded = Buffer.from(rawCookie.value, 'base64').toString('utf-8')
        const parsed = JSON.parse(decoded)
        if (parsed) {
          parsed.id = orderId
          order = await upsertOrder(parsed)
        }
      }
    } catch (cookieErr) {
      console.warn('Failed to parse cookie in refresh route:', cookieErr)
    }
  }

  // 3. Check CHIP payment gateway
  let purchase: any = null
  const effectivePaymentId = paymentId || order?.paymentId

  if (effectivePaymentId) {
    purchase = await chipProvider.getPurchase(effectivePaymentId)
  }

  // If purchase not found by paymentId, search by orderId reference in CHIP
  if (!purchase) {
    purchase = await chipProvider.findPurchaseByReference(orderId)
  }

  const isPurchasePaid = purchase && (purchase.status === 'paid' || purchase.status === 'cleared')

  // 4. If order exists and payment is now confirmed paid:
  if (order) {
    if (isPurchasePaid && order.paymentStatus !== 'paid') {
      await updateOrderStatus(
        order.id,
        {
          paymentStatus: 'paid',
          fulfillmentStatus: 'processing',
          paymentId: purchase?.id || effectivePaymentId,
        },
        'manual_refresh_api'
      )
      const refreshed = await getOrderById(orderId)
      if (refreshed) order = refreshed
    }

    const isPaid = order.paymentStatus === 'paid'
    const res = NextResponse.json({
      success: true,
      isPaid,
      order,
      message: isPaid
        ? 'Alhamdulillah! Bayaran telah disahkan berjaya.'
        : 'Status bayaran masih dalam proses perbankan. Sila cuba lagi sebentar.',
      paymentStatus: order.paymentStatus,
      checkedAt: new Date().toISOString(),
    })

    // Store in cookie backup for Vercel edge consistency
    try {
      const orderPayload = Buffer.from(JSON.stringify(order)).toString('base64')
      res.cookies.set(`kamaar_order_${order.id}`, orderPayload, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: false,
      })
      res.cookies.set('kamaar_last_order', orderPayload, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: false,
      })
    } catch (_) {}

    return res
  }

  // 5. If order STILL not found in DB, but CHIP has authoritative purchase record:
  if (purchase) {
    const isPaid = isPurchasePaid
    const reconstructed: Order = {
      id: orderId,
      orderNumber: `LENA-2026-${Date.now().toString().slice(-4)}`,
      customerEmail: purchase.client?.email || 'customer@kamaarbeddings.com.my',
      customerName: purchase.client?.full_name || 'Pelanggan KAMAAR',
      customerPhone: purchase.client?.phone || '',
      shippingAddress: {
        fullName: purchase.client?.full_name || 'Pelanggan KAMAAR',
        phone: purchase.client?.phone || '',
        addressLine1: purchase.client?.street_address || 'Alamat Pesanan',
        city: purchase.client?.city || 'Tasek Gelugor',
        state: purchase.client?.state || 'Pulau Pinang',
        postcode: purchase.client?.zip_code || '13300',
        country: 'Malaysia',
      },
      billingAddress: {
        fullName: purchase.client?.full_name || 'Pelanggan KAMAAR',
        phone: purchase.client?.phone || '',
        addressLine1: purchase.client?.street_address || 'Alamat Pesanan',
        city: purchase.client?.city || 'Tasek Gelugor',
        state: purchase.client?.state || 'Pulau Pinang',
        postcode: purchase.client?.zip_code || '13300',
        country: 'Malaysia',
      },
      subtotalSen: purchase.purchase?.total || 0,
      discountSen: 0,
      shippingSen: 0,
      taxSen: 0,
      totalSen: purchase.purchase?.total || 0,
      paymentStatus: isPaid ? 'paid' : 'unpaid',
      fulfillmentStatus: isPaid ? 'processing' : 'unfulfilled',
      paymentProvider: 'chip',
      paymentId: purchase.id,
      items: (purchase.purchase?.products || []).map((p: any, idx: number) => ({
        id: `item-${Date.now()}-${idx}`,
        orderId,
        variantId: `var-${idx}`,
        productName: p.name || 'KAMAAR Premium Mattress',
        sizeName: 'Standard',
        sku: 'KAMAAR-PROD',
        unitPriceSen: p.price || 0,
        quantity: p.quantity || 1,
        lineTotalSen: (p.price || 0) * (p.quantity || 1),
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const savedOrder = await upsertOrder(reconstructed)

    const res = NextResponse.json({
      success: true,
      isPaid,
      order: savedOrder,
      message: isPaid
        ? 'Pesanan berjaya dipulihkan & bayaran disahkan daripada gerbang CHIP.'
        : 'Pesanan berjaya dikesan di gerbang bayaran, menanti kelulusan bank.',
      paymentStatus: savedOrder.paymentStatus,
      checkedAt: new Date().toISOString(),
    })

    try {
      const orderPayload = Buffer.from(JSON.stringify(savedOrder)).toString('base64')
      res.cookies.set(`kamaar_order_${savedOrder.id}`, orderPayload, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: false,
      })
      res.cookies.set('kamaar_last_order', orderPayload, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: false,
      })
    } catch (_) {}

    return res
  }

  return NextResponse.json({
    success: false,
    isPaid: false,
    order: null,
    message: 'Rekod pesanan belum tersedia di pangkalan data pelayan. Sila cuba lagi atau hubungi concierge.',
  })
}

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const { searchParams } = new URL(request.url)
  const paymentId = searchParams.get('payment_id') || undefined
  return handleRefresh(params.orderId, undefined, paymentId)
}

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const body = await request.json().catch(() => ({}))
    const { orderSnapshot, paymentId } = body || {}
    return handleRefresh(params.orderId, orderSnapshot, paymentId)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Ralat semasa menyemak status bayaran.' }, { status: 500 })
  }
}
