import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin/auth'
import { updateAffiliate, deleteAffiliate, getAffiliateById } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params
  try {
    const updates = await request.json()
    const updated = await updateAffiliate(id, updates, session.email)
    if (!updated) {
      return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 })
    }
    return NextResponse.json({ affiliate: updated })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 400 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params
  const success = await deleteAffiliate(id, session.email)
  if (!success) {
    return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
