import React from 'react'
import { getCoupons } from '@/lib/db'
import { PromotionsClient } from './PromotionsClient'

export const dynamic = 'force-dynamic'

export default async function AdminPromotionsPage() {
  const coupons = await getCoupons()

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="font-serif text-3xl font-bold text-forest-dark">Promotions & Vouchers</h1>
        <p className="text-sm text-secondary mt-1">
          Configure seasonal discount codes, minimum order thresholds, and redemption caps.
        </p>
      </div>

      <PromotionsClient initialCoupons={coupons} />
    </div>
  )
}
