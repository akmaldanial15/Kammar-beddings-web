import { NextResponse } from 'next/server'
import { getAffiliateSession } from '@/lib/affiliate/auth'
import { getAffiliateOrders, getAffiliateById } from '@/lib/db'

export async function GET() {
  const sessionAffiliate = await getAffiliateSession()

  if (!sessionAffiliate) {
    return NextResponse.json({ error: 'Unauthorized affiliate session' }, { status: 401 })
  }

  // Refetch fresh data from db in case admin updated notes or stats
  const freshAffiliate = (await getAffiliateById(sessionAffiliate.id)) || sessionAffiliate
  const orders = await getAffiliateOrders(freshAffiliate.code)

  // Map orders to restricted/safe view for affiliate (don't leak customer sensitive address, etc.)
  const sanitizedOrders = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    createdAt: o.createdAt,
    subtotalSen: o.subtotalSen,
    totalSen: o.totalSen,
    paymentStatus: o.paymentStatus,
    fulfillmentStatus: o.fulfillmentStatus,
    affiliateCommissionSen: o.affiliateCommissionSen || 0,
    itemCount: o.items.reduce((acc, it) => acc + it.quantity, 0),
    itemsSummary: o.items.map((it) => `${it.productName} (${it.sizeName || 'Standard'}) x${it.quantity}`).join(', '),
  }))

  return NextResponse.json({
    affiliate: {
      id: freshAffiliate.id,
      code: freshAffiliate.code,
      name: freshAffiliate.name,
      email: freshAffiliate.email,
      phone: freshAffiliate.phone,
      bankName: freshAffiliate.bankName,
      bankAccountNumber: freshAffiliate.bankAccountNumber,
      commissionType: freshAffiliate.commissionType,
      commissionRate: freshAffiliate.commissionRate,
      totalSalesCount: freshAffiliate.totalSalesCount || 0,
      totalSalesRevenueSen: freshAffiliate.totalSalesRevenueSen || 0,
      totalCommissionSen: freshAffiliate.totalCommissionSen || 0,
      adminNotes: freshAffiliate.adminNotes || '',
      createdAt: freshAffiliate.createdAt,
    },
    orders: sanitizedOrders,
  })
}
