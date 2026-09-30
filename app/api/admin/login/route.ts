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
    const member = staffMembers.find((s) => s.email.toLowerCase() === email.trim().toLowerCase())

    if (!member || !member.isActive) {
      return NextResponse.json({ error: 'Unauthorized staff account.' }, { status: 401 })
    }

    // Verify secret: Admin bootstrap secret or standard staff validation
    const validSecret = process.env.ADMIN_BOOTSTRAP_SECRET || 'lena_admin_master_setup_2026'
    if (secretKey && secretKey !== validSecret) {
      return NextResponse.json({ error: 'Invalid authentication credential.' }, { status: 401 })
    }

    const token = createAdminToken(member.email, member.role)

    // Set secure cookie
    cookies().set({
      name: 'lena_admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
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
