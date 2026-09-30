import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin/auth'
import { updateWarrantyStatus, getWarrantyRegistrations } from '@/lib/db'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const warranties = await getWarrantyRegistrations()
  return NextResponse.json({ warranties })
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { id, status, notes } = body
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })
    }

    const ok = await updateWarrantyStatus(id, status, notes)
    if (!ok) {
      return NextResponse.json({ error: 'Warranty record not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update warranty' }, { status: 500 })
  }
}
