import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin/auth'
import {
  getAffiliateById,
  getAffiliates,
  getAffiliateOrders,
  deleteOrder,
  deleteAffiliateOrders,
} from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized staff access' }, { status: 401 })
  }

  const { id } = params
  const affiliates = await getAffiliates()
  const affiliate =
    affiliates.find((a) => a.id === id || a.code.toUpperCase() === id.toUpperCase()) ||
    (await getAffiliateById(id))

  if (!affiliate) {
    return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 })
  }

  const orders = await getAffiliateOrders(affiliate.code)
  const sanitized = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    createdAt: o.createdAt,
    customerName: o.customerName,
    subtotalSen: o.subtotalSen,
    totalSen: o.totalSen,
    paymentStatus: o.paymentStatus,
    fulfillmentStatus: o.fulfillmentStatus,
    affiliateCommissionSen: o.affiliateCommissionSen || 0,
    itemCount: o.items.reduce((acc, it) => acc + it.quantity, 0),
    itemsSummary: o.items
      .map((it) => `${it.productName} (${it.sizeName || 'Standard'}) x${it.quantity}`)
      .join(', '),
  }))

  return NextResponse.json({
    affiliate,
    orders: sanitized,
  })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized staff access' }, { status: 401 })
  }

  const { id } = params
  const affiliates = await getAffiliates()
  const affiliate =
    affiliates.find((a) => a.id === id || a.code.toUpperCase() === id.toUpperCase()) ||
    (await getAffiliateById(id))

  if (!affiliate) {
    return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const { orderId, clearAll } = body

    if (clearAll) {
      const res = await deleteAffiliateOrders(affiliate.code, session.email)
      const freshAffiliate = await getAffiliateById(affiliate.id)
      return NextResponse.json({
        success: true,
        message: `Semua ${res.count} pesanan rujukan untuk ejen ${affiliate.name} berjaya dipadam.`,
        affiliate: freshAffiliate || affiliate,
        orders: [],
      })
    }

    if (orderId) {
      const res = await deleteOrder(orderId, session.email)
      if (!res.success) {
        return NextResponse.json({ error: res.message }, { status: 400 })
      }

      const freshAffiliate = await getAffiliateById(affiliate.id)
      const freshOrders = await getAffiliateOrders(affiliate.code)
      const sanitized = freshOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        createdAt: o.createdAt,
        customerName: o.customerName,
        subtotalSen: o.subtotalSen,
        totalSen: o.totalSen,
        paymentStatus: o.paymentStatus,
        fulfillmentStatus: o.fulfillmentStatus,
        affiliateCommissionSen: o.affiliateCommissionSen || 0,
        itemCount: o.items.reduce((acc, it) => acc + it.quantity, 0),
        itemsSummary: o.items
          .map((it) => `${it.productName} (${it.sizeName || 'Standard'}) x${it.quantity}`)
          .join(', '),
      }))

      return NextResponse.json({
        success: true,
        message: res.message,
        affiliate: freshAffiliate || affiliate,
        orders: sanitized,
      })
    }

    return NextResponse.json(
      { error: 'Sila nyatakan orderId atau clearAll untuk memadam pesanan.' },
      { status: 400 }
    )
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Gagal memadam pesanan affiliate.' },
      { status: 500 }
    )
  }
}
