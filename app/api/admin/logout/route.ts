import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  cookies().delete('lena_admin_token')
  return NextResponse.json({ success: true })
}
