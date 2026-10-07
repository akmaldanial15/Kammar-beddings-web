import React from 'react'
import { getAuditLogs } from '@/lib/db'
import { AuditsClient } from './AuditsClient'

export const dynamic = 'force-dynamic'

export default async function AdminAuditsPage() {
  const logs = await getAuditLogs()

  return (
    <div className="p-4 sm:p-6 md:p-10 space-y-6 animate-fade-in">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-dark">
          Administrative Audit Trail
        </h1>
        <p className="text-xs sm:text-sm text-secondary mt-1">
          Rekod jejak audit operasi untuk pengesahan staf, pelarasan katalog, pergerakan stok, dan pesanan.
        </p>
      </div>

      <AuditsClient initialLogs={logs} />
    </div>
  )
}

