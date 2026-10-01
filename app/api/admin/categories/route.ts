import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin/auth'
import { getCategories, createCategory } from '@/lib/db'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const categories = await getCategories()
  return NextResponse.json({ categories })
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, slug, description, imageUrl, displayOrder, showInNav, hasMegaMenu, badge, customUrl, isActive } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Nama kategori dan slug diperlukan.' }, { status: 400 })
    }

    const newCategory = await createCategory(
      {
        name: name.trim(),
        slug: slug.trim(),
        description: description?.trim() || '',
        imageUrl: imageUrl?.trim() || '',
        displayOrder: Number(displayOrder) || 1,
        showInNav: showInNav !== undefined ? Boolean(showInNav) : true,
        hasMegaMenu: Boolean(hasMegaMenu),
        badge: badge?.trim() || '',
        customUrl: customUrl?.trim() || '',
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
      session.email
    )

    return NextResponse.json({ category: newCategory }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal mencipta kategori.' }, { status: 400 })
  }
}
