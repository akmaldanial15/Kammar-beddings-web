import { NextRequest, NextResponse } from 'next/server'
import { stripeProvider } from '@/lib/payment/stripe'
import { updateOrderStatus, getOrderById } from '@/lib/db'

// Set of processed webhook IDs in-memory + database
const processedEventIds = new Set<string>()

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('stripe-signature') || ''

    // Verify signature
    const verification = await stripeProvider.verifyWebhook(rawBody, signature)
    if (!verification.isValid) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
    }

    const { eventType, eventId, payload, orderId } = verification

    // Idempotency check: ignore duplicate events
    if (eventId && processedEventIds.has(eventId)) {
      return NextResponse.json({ message: 'Event already processed' }, { status: 200 })
    }
    if (eventId) processedEventIds.add(eventId)

    // Handle payment events
    if (eventType === 'checkout.session.completed' || eventType === 'payment_intent.succeeded') {
      const targetOrderId = orderId || payload?.client_reference_id || payload?.metadata?.orderId
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
            'stripe_webhook'
          )
        }
      }
    } else if (eventType === 'payment_intent.payment_failed') {
      const targetOrderId = orderId || payload?.metadata?.orderId
      if (targetOrderId) {
        await updateOrderStatus(
          targetOrderId,
          {
            paymentStatus: 'failed',
          },
          'stripe_webhook'
        )
      }
    }

    return NextResponse.json({ received: true, eventId })
  } catch (err: any) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
