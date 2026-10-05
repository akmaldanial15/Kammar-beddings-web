import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin/auth'
import { updateSiteSettings, getSiteSettings } from '@/lib/db'
import { SiteSettings } from '@/types'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const settings = await getSiteSettings()
  return NextResponse.json({ settings })
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (session.role !== 'owner') {
    return NextResponse.json({ error: 'Forbidden: Only owners can modify store settings' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const settings = body.settings as Partial<SiteSettings>
    const updated = await updateSiteSettings(settings, session.email)

    if (body.adminName && typeof body.adminName === 'string') {
      const { updateStaffMemberName } = await import('@/lib/db')
      await updateStaffMemberName(session.email, body.adminName)
    }

    return NextResponse.json({ success: true, settings: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update settings' }, { status: 500 })
  }
}
