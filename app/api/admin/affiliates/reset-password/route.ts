import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin/auth'
import { adminResetAffiliatePassword } from '@/lib/db'

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized staff session' }, { status: 401 })
  }

  try {
    const { affiliateId, newPasscode, adminNote } = await request.json()

    if (!affiliateId || !newPasscode) {
      return NextResponse.json(
        { error: 'ID Ejen dan Kata Laluan Baharu diperlukan.' },
        { status: 400 }
      )
    }

    const cleanPasscode = String(newPasscode).trim()
    if (cleanPasscode.length < 4) {
      return NextResponse.json(
        { error: 'Kata laluan mestilah sekurang-kurangnya 4 aksara.' },
        { status: 400 }
      )
    }

    const updated = await adminResetAffiliatePassword(
      affiliateId,
      cleanPasscode,
      adminNote,
      session.email
    )

    if (!updated) {
      return NextResponse.json({ error: 'Akaun ejen tidak ditemui.' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: `Kata laluan bagi ejen ${updated.name} (${updated.code}) berjaya diset semula kepada "${cleanPasscode}".`,
      affiliate: updated,
    })
  } catch (err: any) {
    console.error('Admin reset affiliate password error:', err)
    return NextResponse.json(
      { error: err.message || 'Gagal menetapkan kata laluan ejen.' },
      { status: 500 }
    )
  }
}
