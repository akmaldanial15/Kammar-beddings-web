import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { AFFILIATE_COOKIE_NAME } from '@/lib/affiliate/auth'

export async function POST() {
  cookies().delete(AFFILIATE_COOKIE_NAME)
  return NextResponse.json({ success: true })
}
