import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin/auth'
import { getShowrooms, saveShowroom, deleteShowroom, getAppointments, updateAppointmentStatus } from '@/lib/db'
import { Showroom } from '@/types'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const showrooms = await getShowrooms()
  const appointments = await getAppointments()
  return NextResponse.json({ showrooms, appointments })
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (session.role !== 'owner' && session.role !== 'content_editor') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const showroom = body.showroom as Showroom
    if (!showroom.id) {
      showroom.id = `shw-${Date.now()}`
    }
    const saved = await saveShowroom(showroom, session.email)
    return NextResponse.json({ success: true, showroom: saved })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save showroom' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { appointmentId, status } = body
    if (!appointmentId || !status) {
      return NextResponse.json({ error: 'Missing appointmentId or status' }, { status: 400 })
    }

    const ok = await updateAppointmentStatus(appointmentId, status)
    return NextResponse.json({ success: ok })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update appointment' }, { status: 500 })
  }
}
