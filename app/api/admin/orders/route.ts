import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin/auth'
import { getOrders, deleteOrder, deleteOrders, clearAllOrders } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized staff access' }, { status: 401 })
  }

  const orders = await getOrders(true)
  return NextResponse.json({ orders })
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized staff access' }, { status: 401 })
  }

  try {
    const url = new URL(req.url)
    const singleId = url.searchParams.get('id')
    const isAllParam = url.searchParams.get('all') === 'true'

    if (isAllParam) {
      const res = await clearAllOrders(session.email)
      return NextResponse.json(res)
    }

    if (singleId) {
      const res = await deleteOrder(singleId, session.email)
      if (!res.success) {
        return NextResponse.json({ error: res.message }, { status: 400 })
      }
      return NextResponse.json({ success: true, message: res.message })
    }

    const body = await req.json().catch(() => null)
    if (body?.clearAll || body?.ids === 'all') {
      const res = await clearAllOrders(session.email)
      return NextResponse.json(res)
    }

    if (body && Array.isArray(body.ids) && body.ids.length > 0) {
      const res = await deleteOrders(body.ids, session.email)
      return NextResponse.json(res)
    }

    return NextResponse.json(
      { error: 'Parameter id atau senarai ids diperlukan' },
      { status: 400 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Ralat berlaku semasa memadam pesanan' },
      { status: 500 }
    )
  }
}
