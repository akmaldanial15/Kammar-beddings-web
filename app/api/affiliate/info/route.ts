import { NextRequest, NextResponse } from 'next/server'
import { getAffiliateByCode } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ isValid: false, error: 'Code is required' }, { status: 400 })
  }

  const clean = code.trim().toUpperCase()
  const affiliate = await getAffiliateByCode(clean)

  if (!affiliate || !affiliate.isActive) {
    return NextResponse.json({ isValid: false, code: clean }, { status: 404 })
  }

  return NextResponse.json({
    isValid: true,
    code: affiliate.code,
    name: affiliate.name,
    commissionType: affiliate.commissionType,
    commissionRate: affiliate.commissionRate,
  })
}
