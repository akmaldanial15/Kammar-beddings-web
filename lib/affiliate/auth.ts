import { cookies } from 'next/headers'
import { getAffiliateById } from '@/lib/db'
import { Affiliate } from '@/types'

export const AFFILIATE_COOKIE_NAME = 'kamaar_affiliate_token'

export async function getAffiliateSession(): Promise<Affiliate | null> {
  const cookieStore = cookies()
  const token = cookieStore.get(AFFILIATE_COOKIE_NAME)?.value

  if (!token) return null

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [id, code] = decoded.split(':')
    if (!id || !code) return null

    const affiliate = await getAffiliateById(id)
    if (!affiliate || !affiliate.isActive || affiliate.code.toUpperCase() !== code.toUpperCase()) {
      return null
    }

    return affiliate
  } catch {
    return null
  }
}

export function createAffiliateToken(id: string, code: string): string {
  return Buffer.from(`${id}:${code.toUpperCase()}`).toString('base64')
}
