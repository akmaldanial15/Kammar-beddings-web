import React from 'react'
import { getSiteSettings } from '@/lib/db'
import { getAdminSession } from '@/lib/admin/auth'
import { SettingsClient } from './SettingsClient'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const [settings, session] = await Promise.all([
    getSiteSettings(),
    getAdminSession(),
  ])

  return (
    <div className="p-6 md:p-10 space-y-8 animate-fade-in">
      <div>
        <h1 className="font-serif text-3xl font-bold text-forest-dark">Store Identity & Configuration</h1>
        <p className="text-sm text-secondary mt-1">
          Customize brand name, storefront announcement banner, concierge contact channels, admin profile, and free delivery thresholds.
        </p>
      </div>

      <SettingsClient
        initialSettings={settings}
        currentAdminName={session?.name || 'Kamaar Admin'}
        currentAdminEmail={session?.email || 'admin@kamaarbeddings.com'}
      />
    </div>
  )
}
