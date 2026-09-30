import { NextRequest, NextResponse } from 'next/server'
import { getOrdersByCustomerEmail, getOrderByNumber } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  const orderNumber = searchParams.get('orderNumber')

  if (orderNumber) {
    const order = await getOrderByNumber(orderNumber)
    return NextResponse.json({ order })
  }

  if (email) {
    const orders = await getOrdersByCustomerEmail(email)
    return NextResponse.json({ orders })
  }

  return NextResponse.json({ error: 'Please supply email or orderNumber' }, { status: 400 })
}
