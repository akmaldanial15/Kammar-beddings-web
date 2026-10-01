import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin/auth'
import { reorderCategories } from '@/lib/db'

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { orderedIds } = await request.json()
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: 'orderedIds array diperlukan.' }, { status: 400 })
    }

    const categories = await reorderCategories(orderedIds, session.email)
    return NextResponse.json({ success: true, categories })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal menyusun semula kategori.' }, { status: 400 })
  }
}
