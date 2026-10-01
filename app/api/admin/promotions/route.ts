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
    const rawCoupon = body.coupon as Partial<Coupon>

    if (!rawCoupon || !rawCoupon.code || !rawCoupon.discountType || typeof rawCoupon.discountValue !== 'number') {
      return NextResponse.json({ error: 'Sila lengkapkan maklumat wajib kod promosi' }, { status: 400 })
    }

    const coupon: Coupon = {
      id: rawCoupon.id || `cpn-${Date.now()}`,
      code: rawCoupon.code.trim().toUpperCase(),
      description: rawCoupon.description?.trim() || '',
      discountType: rawCoupon.discountType,
      discountValue: rawCoupon.discountValue,
      minSpendSen: Number(rawCoupon.minSpendSen) || 0,
      maxDiscountSen: rawCoupon.maxDiscountSen !== undefined ? Number(rawCoupon.maxDiscountSen) : undefined,
      usageLimit: rawCoupon.usageLimit ? Number(rawCoupon.usageLimit) : undefined,
      usageCount: Number(rawCoupon.usageCount) || 0,
      perCustomerLimit: rawCoupon.perCustomerLimit ? Number(rawCoupon.perCustomerLimit) : 1,
      startsAt: rawCoupon.startsAt || new Date().toISOString(),
      endsAt: rawCoupon.endsAt || new Date(Date.now() + 365 * 86400000).toISOString(),
      isActive: rawCoupon.isActive !== undefined ? Boolean(rawCoupon.isActive) : true,
      // Extended controls
      showOnHomepage: Boolean(rawCoupon.showOnHomepage),
      featuredOrder: Number(rawCoupon.featuredOrder) || 1,
      customTitle: rawCoupon.customTitle?.trim() || undefined,
      customBadge: rawCoupon.customBadge?.trim() || undefined,
      customerRestriction: rawCoupon.customerRestriction || 'all',
      applicableCategory: rawCoupon.applicableCategory || 'all',
    }

    const saved = await saveCoupon(coupon, session.email)
    return NextResponse.json({ success: true, coupon: saved })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal menyimpan kupon' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (session.role !== 'owner' && session.role !== 'catalog_manager') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { id, updates } = body

    if (!id || !updates || typeof updates !== 'object') {
      return NextResponse.json({ error: 'ID kupon atau maklumat kemaskini tidak sah' }, { status: 400 })
    }

    const coupons = await getCoupons()
    const existing = coupons.find((c) => c.id === id)
    if (!existing) {
      return NextResponse.json({ error: 'Kupon tidak ditemui' }, { status: 404 })
    }

    const updatedCoupon: Coupon = {
      ...existing,
      ...updates,
      id: existing.id, // prevent id overwrite
    }

    const saved = await saveCoupon(updatedCoupon, session.email)
    return NextResponse.json({ success: true, coupon: saved })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal mengemas kini kupon' }, { status: 500 })
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
