import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin/auth'
import { updateVariantStock } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized staff access' }, { status: 401 })
  }

  if (session.role !== 'owner' && session.role !== 'catalog_manager' && session.role !== 'order_manager') {
    return NextResponse.json({ error: 'Forbidden: Insufficient privileges' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { variantId, newQuantity, reason } = body

    if (!variantId || typeof newQuantity !== 'number' || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields: variantId, newQuantity (number), reason (string)' },
        { status: 400 }
      )
    }

    const success = await updateVariantStock(variantId, newQuantity, reason, session.email)
    if (!success) {
      return NextResponse.json({ error: 'Variant not found in catalog' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Stock quantity updated successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update stock' }, { status: 500 })
  }
}
