import { NextRequest, NextResponse } from 'next/server'
import { chipProvider } from '@/lib/payment/chip'
import { updateOrderStatus, getOrderById } from '@/lib/db'

// Idempotency cache for processed event IDs
const processedEventIds = new Set<string>()

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-signature') || ''

    // Verify webhook signature & payload
    const verification = await chipProvider.verifyWebhook(rawBody, signature)
    if (!verification.isValid) {
      return NextResponse.json({ error: 'Invalid CHIP webhook signature' }, { status: 400 })
    }

    const { eventType, eventId, payload, orderId } = verification

    // Idempotency check: avoid double processing
    if (eventId && processedEventIds.has(eventId)) {
      return NextResponse.json({ message: 'CHIP event already processed' }, { status: 200 })
    }
    if (eventId) processedEventIds.add(eventId)

    // Handle payment events from CHIP
    if (eventType === 'purchase.paid' || payload?.status === 'paid' || payload?.status === 'cleared') {
      const targetOrderId = orderId || payload?.reference || payload?.order_id
      if (targetOrderId) {
        const order = await getOrderById(targetOrderId)
        if (order) {
          await updateOrderStatus(
            targetOrderId,
            {
              paymentStatus: 'paid',
              fulfillmentStatus: 'processing',
              paymentId: payload?.id || eventId,
            },
            'chip_webhook'
          )
        }
      }
    } else if (eventType === 'purchase.failed' || payload?.status === 'failed') {
      const targetOrderId = orderId || payload?.reference
      if (targetOrderId) {
        await updateOrderStatus(
          targetOrderId,
          {
            paymentStatus: 'failed',
          },
          'chip_webhook'
        )
      }
    }

    return NextResponse.json({ received: true, eventId })
  } catch (err: any) {
    console.error('CHIP webhook error:', err)
    return NextResponse.json({ error: 'CHIP webhook processing failed' }, { status: 500 })
  }
}
