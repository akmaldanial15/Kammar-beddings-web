import { NextRequest, NextResponse } from 'next/server'
import {
  getAffiliateByIdentifier,
  requestAffiliatePasswordReset,
  verifyAffiliatePasswordResetOtp,
} from '@/lib/db'

// Masking helpers for privacy & security
function maskEmail(email: string): string {
  const parts = email.split('@')
  if (parts.length !== 2) return email
  const name = parts[0]
  const domain = parts[1]
  const maskedName = name.length <= 2 ? `${name[0]}*` : `${name[0]}***${name[name.length - 1]}`
  return `${maskedName}@${domain}`
}

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 6) return phone
  return `${phone.slice(0, 7)}*** ${phone.slice(-4)}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, identifier, method, otp } = body

    if (!identifier || typeof identifier !== 'string') {
      return NextResponse.json({ error: 'Sila masukkan Kod Affiliate atau Emel berdaftar anda.' }, { status: 400 })
    }

    const cleanIdentifier = identifier.trim()
    const affiliate = await getAffiliateByIdentifier(cleanIdentifier)

    if (!affiliate || !affiliate.isActive) {
      return NextResponse.json(
        { error: 'Akaun ejen tidak ditemui atau tidak aktif. Sila semak semula kod atau emel anda.' },
        { status: 404 }
      )
    }

    // ACTION 1: LOOKUP
    if (action === 'lookup') {
      return NextResponse.json({
        success: true,
        affiliate: {
          id: affiliate.id,
          name: affiliate.name,
          code: affiliate.code,
          maskedEmail: maskEmail(affiliate.email),
          maskedPhone: maskPhone(affiliate.phone),
        },
      })
    }

    // ACTION 2: SEND OTP
    if (action === 'send_otp') {
      const selectedMethod: 'email' | 'phone' = method === 'phone' ? 'phone' : 'email'
      const result = await requestAffiliatePasswordReset(cleanIdentifier, selectedMethod)

      if (!result) {
        return NextResponse.json({ error: 'Gagal menjana kod pengesahan.' }, { status: 500 })
      }

      const dest =
        selectedMethod === 'email'
          ? maskEmail(result.affiliate.email)
          : maskPhone(result.affiliate.phone)

      return NextResponse.json({
        success: true,
        message: `Kod OTP 6-digit telah dihantar ke ${dest}. Sila masukkan kod untuk pengesahan.`,
        demoOtp: result.otp, // Returned for easy instant testing & simulation
        method: selectedMethod,
        destination: dest,
      })
    }

    // ACTION 3: VERIFY OTP
    if (action === 'verify_otp') {
      if (!otp || typeof otp !== 'string') {
        return NextResponse.json({ error: 'Sila masukkan kod OTP 6-digit.' }, { status: 400 })
      }

      const verifyResult = await verifyAffiliatePasswordResetOtp(cleanIdentifier, otp)

      if (!verifyResult.success || !verifyResult.affiliate) {
        return NextResponse.json({ error: verifyResult.error || 'Kod OTP tidak sah.' }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        message:
          'Pengesahan identiti berjaya! Permintaan set semula kata laluan anda telah didaftarkan ke Admin Atelier KAMAAR.',
        affiliate: {
          name: verifyResult.affiliate.name,
          code: verifyResult.affiliate.code,
          requestedAt: verifyResult.affiliate.passwordResetRequestedAt,
        },
      })
    }

    return NextResponse.json({ error: 'Tindakan (action) tidak sah.' }, { status: 400 })
  } catch (err: any) {
    console.error('Affiliate reset request error:', err)
    return NextResponse.json({ error: 'Ralat pelayan semasa memproses permintaan reset kata laluan.' }, { status: 500 })
  }
}
