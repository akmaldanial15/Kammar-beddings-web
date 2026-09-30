import { NextRequest, NextResponse } from 'next/server'
import { submitContactEnquiry } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
    }

    const item = await submitContactEnquiry({
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Inquiry',
      message,
    })

    return NextResponse.json({ success: true, enquiry: item })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit contact enquiry' }, { status: 500 })
  }
}
