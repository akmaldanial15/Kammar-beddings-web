import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin/auth'
import { getAuditLogs, deleteAuditLog, deleteAuditLogs, clearAuditLogs, logAdminAction } from '@/lib/db'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const logs = await getAuditLogs()
  return NextResponse.json({ logs, total: logs.length, maxLimit: 100 })
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const url = new URL(req.url)
    const singleId = url.searchParams.get('id')
    const clearAllParam = url.searchParams.get('all') === 'true'

    // Option 1: Kosongkan semua log (melalui URL param ?all=true)
    if (clearAllParam) {
      await clearAuditLogs()
      logAdminAction(session.email, 'audit_trail_cleared', 'audit_logs', undefined, {
        note: 'Semua rekod audit dikosongkan oleh admin',
      })
      return NextResponse.json({
        success: true,
        message: 'Semua rekod audit trail berjaya dikosongkan.',
      })
    }

    // Option 2: Padam 1 rekod tertentu (melalui URL param ?id=xxx)
    if (singleId) {
      const deleted = await deleteAuditLog(singleId)
      if (deleted) {
        return NextResponse.json({
          success: true,
          message: 'Rekod audit log berjaya dipadam.',
        })
      }
      return NextResponse.json({ error: 'Rekod log tidak dijumpai' }, { status: 404 })
    }

    // Option 3: Semak JSON body jika dihantar
    let body: any = null
    try {
      body = await req.json()
    } catch {
      // Tiada json body
    }

    if (body) {
      if (body.all === true) {
        await clearAuditLogs()
        logAdminAction(session.email, 'audit_trail_cleared', 'audit_logs', undefined, {
          note: 'Semua rekod audit dikosongkan oleh admin',
        })
        return NextResponse.json({
          success: true,
          message: 'Semua rekod audit trail berjaya dikosongkan.',
        })
      }

      if (Array.isArray(body.ids) && body.ids.length > 0) {
        const count = await deleteAuditLogs(body.ids)
        return NextResponse.json({
          success: true,
          count,
          message: `${count} rekod audit log berjaya dipadam.`,
        })
      }
    }

    return NextResponse.json(
      { error: 'Parameter id, ids atau all diperlukan untuk pemadaman' },
      { status: 400 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Ralat berlaku semasa memadam audit log' },
      { status: 500 }
    )
  }
}
