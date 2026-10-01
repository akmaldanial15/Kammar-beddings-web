import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getAffiliateByIdentifier } from '@/lib/db'
import { createAffiliateToken, AFFILIATE_COOKIE_NAME } from '@/lib/affiliate/auth'

export async function POST(request: NextRequest) {
  try {
    const { identifier, passcode } = await request.json()

    if (!identifier || typeof identifier !== 'string') {
      return NextResponse.json({ error: 'Sila masukkan Kod Affiliate atau Emel berdaftar anda.' }, { status: 400 })
    }

    const cleanIdentifier = identifier.trim()
    const affiliate = await getAffiliateByIdentifier(cleanIdentifier)

    if (!affiliate || !affiliate.isActive) {
      return NextResponse.json(
        { error: 'Akaun affiliate tidak ditemui atau tidak aktif. Sila hubungi admin.' },
        { status: 401 }
      )
    }

    // Passcode validation:
    // 1. Matches configured accessKey
    // 2. Or matches affiliate code itself (default convenience)
    // 3. Or matches clean phone digits
    const cleanPasscode = (passcode || '').trim()
    const codeMatch = cleanPasscode.toUpperCase() === affiliate.code.toUpperCase()
    const keyMatch = affiliate.accessKey ? cleanPasscode === affiliate.accessKey : false
    const phoneDigits = affiliate.phone.replace(/\D/g, '')
    const passDigits = cleanPasscode.replace(/\D/g, '')
    const phoneMatch = passDigits.length >= 4 && phoneDigits.endsWith(passDigits)

    const isValid = codeMatch || keyMatch || phoneMatch || !cleanPasscode // if passcode empty and only identifier was entered, or valid key

    if (!isValid) {
      return NextResponse.json(
        { error: 'Kunci akses / Kod pengesahan tidak sah. Sila semak semula.' },
        { status: 401 }
      )
    }

    const token = createAffiliateToken(affiliate.id, affiliate.code)

    cookies().set({
      name: AFFILIATE_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 14, // 14 days
    })

    return NextResponse.json({
      success: true,
      affiliate: {
        id: affiliate.id,
        code: affiliate.code,
        name: affiliate.name,
        email: affiliate.email,
        phone: affiliate.phone,
        bankName: affiliate.bankName,
        bankAccountNumber: affiliate.bankAccountNumber,
        commissionType: affiliate.commissionType,
        commissionRate: affiliate.commissionRate,
        totalSalesCount: affiliate.totalSalesCount || 0,
        totalSalesRevenueSen: affiliate.totalSalesRevenueSen || 0,
        totalCommissionSen: affiliate.totalCommissionSen || 0,
        adminNotes: affiliate.adminNotes || '',
      },
    })
  } catch (err: any) {
    console.error('Affiliate login error:', err)
    return NextResponse.json({ error: 'Ralat semasa log masuk ejen.' }, { status: 500 })
  }
}
