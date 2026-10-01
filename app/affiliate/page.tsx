import { redirect } from 'next/navigation'
import { getAffiliateSession } from '@/lib/affiliate/auth'
import { getAffiliateById, getAffiliateOrders } from '@/lib/db'
import { AffiliatePortalClient } from './AffiliatePortalClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Papan Pemuka Ejen Affiliate | KAMAAR Beddings Malaysia',
  description: 'Pantau komisen terkumpul, pautan rujukan eksklusif, dan nota pentadbir rakan niaga KAMAAR Beddings.',
}

export const dynamic = 'force-dynamic'

export default async function AffiliateDashboardPage() {
  const sessionAffiliate = await getAffiliateSession()

  if (!sessionAffiliate) {
    redirect('/affiliate/login')
  }

  // Refetch fresh from db
  const affiliate = (await getAffiliateById(sessionAffiliate.id)) || sessionAffiliate
  const orders = await getAffiliateOrders(affiliate.code)

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

  return <AffiliatePortalClient affiliate={affiliate} initialOrders={sanitizedOrders} />
}
