import { NextRequest, NextResponse } from 'next/server'
import { getOrderById } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const order = await getOrderById(params.orderId)
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    return NextResponse.json({ order })
  } catch (err) {
    console.error('Error fetching order:', err)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}
