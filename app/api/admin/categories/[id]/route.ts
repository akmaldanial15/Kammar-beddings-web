import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin/auth'
import { updateCategory, deleteCategory } from '@/lib/db'

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
    const updated = await updateCategory(id, updates, session.email)
    if (!updated) {
      return NextResponse.json({ error: 'Kategori tidak ditemui.' }, { status: 404 })
    }
    return NextResponse.json({ category: updated })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal mengemas kini kategori.' }, { status: 400 })
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
  const success = await deleteCategory(id, session.email)
  if (!success) {
    return NextResponse.json({ error: 'Kategori tidak ditemui.' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
