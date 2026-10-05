import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin/auth'
import {
  getPaymentSettings,
  updatePaymentSettings,
  savePaymentMethod,
  deletePaymentMethod,
  reorderPaymentMethods,
} from '@/lib/db'
import { PaymentMethodConfig } from '@/types'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const paymentSettings = await getPaymentSettings()
  return NextResponse.json({ success: true, paymentSettings })
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { action } = body

    if (action === 'save_method') {
      const { method } = body as { method: PaymentMethodConfig }
      if (!method || !method.id || !method.name) {
        return NextResponse.json({ error: 'Maklumat kaedah pembayaran tidak lengkap.' }, { status: 400 })
      }
      const saved = await savePaymentMethod(method, session.email)
      const paymentSettings = await getPaymentSettings()
      return NextResponse.json({ success: true, method: saved, paymentSettings })
    }

    if (action === 'toggle_enabled') {
      const { id, enabled } = body
      if (!id) {
        return NextResponse.json({ error: 'ID kaedah pembayaran diperlukan.' }, { status: 400 })
      }
      const paymentSettings = await getPaymentSettings()
      const method = paymentSettings.methods.find((m) => m.id === id)
      if (!method) {
        return NextResponse.json({ error: 'Kaedah pembayaran tidak dijumpai.' }, { status: 404 })
      }
      method.enabled = Boolean(enabled)
      await savePaymentMethod(method, session.email)
      const updated = await getPaymentSettings()
      return NextResponse.json({ success: true, paymentSettings: updated })
    }

    if (action === 'reorder') {
      const { orderedIds } = body as { orderedIds: string[] }
      if (!Array.isArray(orderedIds)) {
        return NextResponse.json({ error: 'Senarai ID susunan tidak sah.' }, { status: 400 })
      }
      const methods = await reorderPaymentMethods(orderedIds, session.email)
      const paymentSettings = await getPaymentSettings()
      return NextResponse.json({ success: true, methods, paymentSettings })
    }

    if (action === 'update_settings') {
      const { settings } = body
      const updated = await updatePaymentSettings(settings, session.email)
      return NextResponse.json({ success: true, paymentSettings: updated })
    }

    return NextResponse.json({ error: 'Tindakan tidak sah (Invalid action).' }, { status: 400 })
  } catch (error: any) {
    console.error('Error in /api/admin/payments:', error)
    return NextResponse.json({ error: error.message || 'Gagal mengemas kini tetapan pembayaran.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID kaedah pembayaran diperlukan.' }, { status: 400 })
  }

  const success = await deletePaymentMethod(id, session.email)
  const paymentSettings = await getPaymentSettings()
  return NextResponse.json({ success, paymentSettings })
}
