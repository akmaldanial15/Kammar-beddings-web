import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin/auth'
import { saveProduct, deleteProduct, getProductById } from '@/lib/db'
import { Product } from '@/types'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized staff access' }, { status: 401 })
  }

  if (session.role !== 'owner' && session.role !== 'catalog_manager') {
    return NextResponse.json({ error: 'Forbidden: Insufficient privileges to modify catalog' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const product = body.product as Product
    if (!product || !product.id || !product.name || !product.slug) {
      return NextResponse.json({ error: 'Missing mandatory product fields (id, name, slug)' }, { status: 400 })
    }

    const saved = await saveProduct(product, session.email)
    return NextResponse.json({ success: true, product: saved })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save product' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized staff access' }, { status: 401 })
  }

  if (session.role !== 'owner') {
    return NextResponse.json({ error: 'Only owners can archive products' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing product ID' }, { status: 400 })
  }

  const ok = await deleteProduct(id, session.email)
  if (!ok) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true, message: 'Product archived successfully' })
}
