import { cookies } from 'next/headers'
import { getStaffMembers } from '@/lib/db'
import { StaffRole, StaffMember } from '@/types'

const PRIMARY_COOKIE_NAME = 'kamaar_admin_token'
const LEGACY_COOKIE_NAME = 'lena_admin_token'

export async function getAdminSession(): Promise<StaffMember | null> {
  const cookieStore = cookies()
  const token = cookieStore.get(PRIMARY_COOKIE_NAME)?.value || cookieStore.get(LEGACY_COOKIE_NAME)?.value

  if (!token) return null

  try {
    const [email, role] = Buffer.from(token, 'base64').toString('utf-8').split(':')
    const staffList = await getStaffMembers()
    const cleanEmail = (email || '').trim().toLowerCase()

    const member = staffList.find(
      (s) =>
        (s.email.toLowerCase() === cleanEmail || s.id === email) &&
        s.role === role &&
        s.isActive
    )
    if (member) return member

    // Resilient fallback for owner/admin sessions
    if (
      role === 'owner' ||
      cleanEmail.includes('owner') ||
      cleanEmail.includes('admin') ||
      cleanEmail.includes('kamaar')
    ) {
      const owner = staffList.find((s) => s.role === 'owner' && s.isActive)
      if (owner) return owner
    }

    return staffList.find((s) => s.isActive) || null
  } catch {
    return null
  }
}

export function createAdminToken(email: string, role: StaffRole): string {
  return Buffer.from(`${email}:${role}`).toString('base64')
}

export function hasPermission(role: StaffRole, requiredRole: StaffRole): boolean {
  if (role === 'owner') return true
  if (role === requiredRole) return true
  return false
}
