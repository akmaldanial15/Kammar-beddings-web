import { NextRequest, NextResponse } from 'next/server'
import { submitAppointment } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customerName, customerEmail, customerPhone, showroomId, preferredDate, preferredTime, notes } = body

    if (!customerName || !customerEmail || !customerPhone || !showroomId || !preferredDate) {
      return NextResponse.json(
        { error: 'Please fill in name, email, phone, studio location, and date.' },
        { status: 400 }
      )
    }

    const apt = await submitAppointment({
      customerName,
      customerEmail,
      customerPhone,
      showroomId,
      preferredDate,
      preferredTime: preferredTime || '2:00 PM',
      notes: notes || '',
    })

    return NextResponse.json({ success: true, appointment: apt })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to book appointment' }, { status: 500 })
  }
}
