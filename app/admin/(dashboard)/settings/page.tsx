import React from 'react'
import { getSiteSettings } from '@/lib/db'
import { SettingsClient } from './SettingsClient'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings()

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-forest-dark">Store Identity & Configuration</h1>
        <p className="text-sm text-secondary mt-1">
          Customize brand name, storefront announcement banner, concierge contact channels, and free delivery thresholds.
        </p>
      </div>

      <SettingsClient initialSettings={settings} />
    </div>
  )
}
