import React from 'react'
import { getAffiliates } from '@/lib/db'
import { AffiliatesClient } from './AffiliatesClient'

export const dynamic = 'force-dynamic'

export default async function AdminAffiliatesPage() {
  const affiliates = await getAffiliates()

  return (
    <div className="p-3.5 sm:p-6 md:p-10 space-y-5 sm:space-y-8">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-dark">Affiliates & Referral Agents</h1>
        <p className="text-xs sm:text-sm text-secondary mt-1">
          Pantau dan uruskan ejen affiliate KAMAAR, pautan rujukan khas, statistik jualan, dan pembayaran komisen.
        </p>
      </div>

      <AffiliatesClient initialAffiliates={affiliates} />
    </div>
  )
}
