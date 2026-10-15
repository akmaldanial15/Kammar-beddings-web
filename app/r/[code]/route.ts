import { NextRequest, NextResponse } from 'next/server'
import { getAffiliateByCode } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const rawCode = params.code || ''
  const cleanCode = rawCode.trim().toUpperCase()

  const origin = request.nextUrl.origin || 'http://localhost:3000'
  const redirectUrl = new URL(`/?ref=${encodeURIComponent(cleanCode)}`, origin)

  // Verify affiliate exists
  const affiliate = await getAffiliateByCode(cleanCode)

  const response = NextResponse.redirect(redirectUrl)

  // Clear legacy persistent cookies so affiliate tracking remains strictly tab-session based via ?ref=
  response.cookies.delete('kamaar_ref')
  response.cookies.delete('kamaar_ref_name')

  return response
}
