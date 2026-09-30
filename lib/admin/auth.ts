import { cookies } from 'next/headers'
import { getStaffMembers } from '@/lib/db'
import { StaffRole, StaffMember } from '@/types'

const ADMIN_COOKIE_NAME = 'lena_admin_token'

export async function getAdminSession(): Promise<StaffMember | null> {
  const cookieStore = cookies()
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value

  if (!token) return null

  try {
    const [email, role] = Buffer.from(token, 'base64').toString('utf-8').split(':')
    const staffList = await getStaffMembers()
    const member = staffList.find((s) => s.email === email && s.role === role && s.isActive)
    return member || null
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
