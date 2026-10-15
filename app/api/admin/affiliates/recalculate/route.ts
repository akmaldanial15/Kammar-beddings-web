import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin/auth'
import { recalculateAffiliateStats, getAffiliates } from '@/lib/db'

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    let body: any = {}
    try {
      body = await request.json()
    } catch (_) {}

    const { affiliateId } = body
    const result = await recalculateAffiliateStats(affiliateId)
    const allAffiliates = await getAffiliates()

    return NextResponse.json({
      success: true,
      message: `Statistik bagi ${result.updatedCount} ejen affiliate berjaya dikira semula dari rekod pesanan terkini.`,
      affiliates: allAffiliates,
    })
  } catch (err: any) {
    console.error('Failed to recalculate affiliate stats:', err)
    return NextResponse.json({ error: err.message || 'Gagal mengira semula statistik affiliate' }, { status: 500 })
  }
}
