import React from 'react'
import { getWarrantyRegistrations } from '@/lib/db'
import { WarrantiesClient } from './WarrantiesClient'

export const dynamic = 'force-dynamic'

export default async function AdminWarrantiesPage() {
  const warranties = await getWarrantyRegistrations()

  return (
    <div className="p-6 md:p-10 space-y-8 animate-fade-in">
      <div>
        <h1 className="font-serif text-3xl font-bold text-forest-dark">Warranty Registrations & Claims</h1>
        <p className="text-sm text-secondary mt-1">
          Review customer digital warranty submissions, verify official invoices, and confirm 10–15 year structural warranties.
        </p>
      </div>

      <WarrantiesClient initialWarranties={warranties} />
    </div>
  )
}
