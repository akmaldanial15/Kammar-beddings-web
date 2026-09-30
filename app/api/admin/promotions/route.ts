import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin/auth'
import { saveCoupon, deleteCoupon, getCoupons } from '@/lib/db'
import { Coupon } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const coupons = await getCoupons()
  return NextResponse.json({ coupons })
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (session.role !== 'owner' && session.role !== 'catalog_manager') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const coupon = body.coupon as Coupon

    if (!coupon || !coupon.code || !coupon.discountType || typeof coupon.discountValue !== 'number') {
      return NextResponse.json({ error: 'Missing mandatory coupon fields' }, { status: 400 })
    }

    if (!coupon.id) {
      coupon.id = `cpn-${Date.now()}`
      coupon.usageCount = 0
    }

    const saved = await saveCoupon(coupon, session.email)
    return NextResponse.json({ success: true, coupon: saved })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save coupon' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (session.role !== 'owner') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing coupon ID' }, { status: 400 })
  }

  const ok = await deleteCoupon(id, session.email)
  return NextResponse.json({ success: ok })
}
