import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin/auth'
import { updateOrderStatus, processRefund, getOrderById } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized staff access' }, { status: 401 })
  }

  const order = await getOrderById(params.orderId)
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  return NextResponse.json({ order })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized staff access' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { fulfillmentStatus, paymentStatus, carrier, trackingNumber, internalNotes } = body

    const updated = await updateOrderStatus(
      params.orderId,
      {
        ...(fulfillmentStatus && { fulfillmentStatus }),
        ...(paymentStatus && { paymentStatus }),
        ...(carrier !== undefined && { carrier }),
        ...(trackingNumber !== undefined && { trackingNumber }),
        ...(internalNotes !== undefined && { internalNotes }),
      },
      session.email
    )

    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, order: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized staff access' }, { status: 401 })
  }

  // Refunds require owner or order_manager
  if (session.role !== 'owner' && session.role !== 'order_manager') {
    return NextResponse.json({ error: 'Forbidden: Insufficient privileges to issue refunds' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { amountSen, reason } = body

    if (!amountSen || typeof amountSen !== 'number' || !reason) {
      return NextResponse.json(
        { error: 'Missing required refund fields: amountSen (number), reason (string)' },
        { status: 400 }
      )
    }

    const res = await processRefund(params.orderId, amountSen, reason, session.email)
    if (!res.success) {
      return NextResponse.json({ error: res.message }, { status: 400 })
    }

    const updatedOrder = await getOrderById(params.orderId)
    return NextResponse.json({ success: true, message: res.message, order: updatedOrder })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to process refund' }, { status: 500 })
  }
}
