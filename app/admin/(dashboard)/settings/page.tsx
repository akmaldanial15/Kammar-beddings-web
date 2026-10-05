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
    <SettingsClient
      initialSettings={settings}
      currentAdminName={session?.name || 'Kamaar Admin'}
      currentAdminEmail={session?.email || 'admin@kamaarbeddings.com'}
    />
  )
}
