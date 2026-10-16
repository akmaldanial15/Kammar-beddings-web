import { NextResponse } from 'next/server'
import { getCoupons } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const coupons = await getCoupons()
    const now = new Date().toISOString()
    const active = coupons
      .filter((c) => c.isActive && now >= c.startsAt && now <= c.endsAt)
      .map((c) => ({
        id: c.id,
        code: c.code,
        description: c.description,
        discountType: c.discountType,
        discountValue: c.discountValue,
        minSpendSen: c.minSpendSen,
        maxDiscountSen: c.maxDiscountSen,
        customTitle: c.customTitle,
        customBadge: c.customBadge,
        showOnHomepage: c.showOnHomepage,
        featuredOrder: c.featuredOrder,
      }))
    return NextResponse.json(active)
  } catch (err) {
    console.error('Failed to get active coupons:', err)
    return NextResponse.json([], { status: 500 })
  }
}
