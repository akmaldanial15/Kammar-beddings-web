import React from 'react'
import { getPaymentSettings } from '@/lib/db'
import { PaymentsClient } from './PaymentsClient'

export const dynamic = 'force-dynamic'

export default async function AdminPaymentsPage() {
  const paymentSettings = await getPaymentSettings()

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-6 max-w-7xl mx-auto animate-fade-in font-sans">
      <PaymentsClient initialSettings={paymentSettings} />
    </div>
  )
}
