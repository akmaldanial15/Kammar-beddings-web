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

  if (affiliate && affiliate.isActive) {
    const maxAge = 30 * 24 * 60 * 60 // 30 days
    response.cookies.set('kamaar_ref', cleanCode, {
      path: '/',
      maxAge,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false,
    })
    response.cookies.set('kamaar_ref_name', encodeURIComponent(affiliate.name), {
      path: '/',
      maxAge,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false,
    })
  }

  return response
}
