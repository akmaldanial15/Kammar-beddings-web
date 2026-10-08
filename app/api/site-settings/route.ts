import { NextResponse } from 'next/server'
import { getSiteSettings } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const settings = await getSiteSettings()
    return NextResponse.json(
      { settings },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to load site settings' }, { status: 500 })
  }
}
