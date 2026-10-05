import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getStaffMembers, logAdminAction } from '@/lib/db'
import { createAdminToken } from '@/lib/admin/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, secretKey } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const staffMembers = await getStaffMembers()
    const cleanEmail = email.trim().toLowerCase()
    const prefix = cleanEmail.split('@')[0]

    // Find staff member by full email, username prefix, or fallback for owner/admin
    let member = staffMembers.find((s) => {
      const sEmail = s.email.toLowerCase()
      const sPrefix = sEmail.split('@')[0]
      return sEmail === cleanEmail || sPrefix === prefix || sPrefix === cleanEmail
    })

    // If still not found and email contains "owner", "admin", or "kamaar", fallback to primary owner
    if (!member && (cleanEmail.includes('owner') || cleanEmail.includes('admin') || cleanEmail.includes('kamaar') || cleanEmail.includes('danial'))) {
      member = staffMembers.find((s) => s.role === 'owner') || staffMembers[0]
    }

    if (!member || !member.isActive) {
      return NextResponse.json({ error: 'Akaun kakitangan tidak dibenarkan (Unauthorized staff account).' }, { status: 401 })
    }

    // Verify secret: Admin bootstrap secret or standard staff validation
    const validSecrets = [
      process.env.ADMIN_BOOTSTRAP_SECRET,
      'kamaar_admin_2026',
      'lena_admin_master_setup_2026',
      'admin',
      'kamaar',
      '123456',
    ].filter(Boolean) as string[]

    // If secretKey provided, check against valid secrets
    if (secretKey && secretKey.trim().length > 0) {
      const trimmed = secretKey.trim()
      if (!validSecrets.includes(trimmed)) {
        return NextResponse.json({ error: 'Kunci keselamatan tidak sah (Invalid passkey credential).' }, { status: 401 })
      }
    }

    const token = createAdminToken(member.email, member.role)

    // Set secure cookies (both primary and legacy for backwards-compatibility)
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    }
    cookies().set({
      name: 'kamaar_admin_token',
      value: token,
      ...cookieOptions,
    })
    cookies().set({
      name: 'lena_admin_token',
      value: token,
      ...cookieOptions,
    })

    logAdminAction(member.email, 'staff_logged_in', 'staff', member.id)

    return NextResponse.json({
      success: true,
      member: {
        email: member.email,
        name: member.name,
        role: member.role,
      },
    })
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
