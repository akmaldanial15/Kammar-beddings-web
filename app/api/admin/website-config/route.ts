import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin/auth'
import { getWebsiteConfig, updateWebsiteConfig } from '@/lib/db'
import { WebsiteConfig } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const config = await getWebsiteConfig()
  return NextResponse.json({ config })
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Owners and content editors can modify website aesthetics & visual content
  if (session.role !== 'owner' && session.role !== 'content_editor') {
    return NextResponse.json({ error: 'Forbidden: Insufficient privileges' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const config = body.config as Partial<WebsiteConfig>
    if (!config) {
      return NextResponse.json({ error: 'Config payload is required' }, { status: 400 })
    }

    const updated = await updateWebsiteConfig(config, session.email)
    return NextResponse.json({ success: true, config: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update website config' }, { status: 500 })
  }
}
