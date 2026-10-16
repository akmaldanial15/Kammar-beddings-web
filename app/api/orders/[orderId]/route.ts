import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getOrderById, updateOrderStatus, upsertOrder } from '@/lib/db'
import { chipProvider } from '@/lib/payment/chip'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    let order = await getOrderById(params.orderId)

    // Check cookie fallback if not found in db
    if (!order) {
      try {
        const cookieStore = cookies()
        const rawCookie =
          cookieStore.get(`kamaar_order_${params.orderId}`) ||
          cookieStore.get('kamaar_last_order')
        if (rawCookie?.value) {
          const decoded = Buffer.from(rawCookie.value, 'base64').toString('utf-8')
          const parsed = JSON.parse(decoded)
          if (parsed) {
            parsed.id = params.orderId
            order = await upsertOrder(parsed)
          }
        }
      } catch (_) {}
    }

    // Auto verify with CHIP if not paid
    if (order && order.paymentStatus !== 'paid') {
      const pid = order.paymentId
      let purchase = pid ? await chipProvider.getPurchase(pid) : null
      if (!purchase) {
        purchase = await chipProvider.findPurchaseByReference(params.orderId)
      }
      if (purchase && (purchase.status === 'paid' || purchase.status === 'cleared')) {
        await updateOrderStatus(
          order.id,
          {
            paymentStatus: 'paid',
            fulfillmentStatus: 'processing',
            paymentId: purchase.id || order.paymentId,
          },
          'order_get_sync'
        )
        const refreshed = await getOrderById(params.orderId)
        if (refreshed) order = refreshed
      }
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    return NextResponse.json({ order })
  } catch (err) {
    console.error('Error fetching order:', err)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

