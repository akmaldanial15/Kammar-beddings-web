import { NextResponse } from 'next/server'
import { getWebsiteConfig } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const config = await getWebsiteConfig()
    return NextResponse.json({ config }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to load website config' }, { status: 500 })
  }
}
