import { NextRequest, NextResponse } from 'next/server'
import { validateCoupon } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, subtotalSen } = body

    if (!code) {
      return NextResponse.json({ isValid: false, message: 'Please enter a coupon code.' })
    }

    const result = await validateCoupon(code, subtotalSen || 0)
    return NextResponse.json(result)
  } catch (err) {
    console.error('Coupon validation error:', err)
    return NextResponse.json({ isValid: false, message: 'Failed to validate coupon.' }, { status: 500 })
  }
}
