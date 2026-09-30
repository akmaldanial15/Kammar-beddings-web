import { NextRequest, NextResponse } from 'next/server'
import { submitBusinessEnquiry } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { companyName, contactName, email, phone, businessType, estimatedQuantity, message } = body

    if (!companyName || !contactName || !email || !message) {
      return NextResponse.json(
        { error: 'Company name, contact person, email, and project scope are required.' },
        { status: 400 }
      )
    }

    const item = await submitBusinessEnquiry({
      companyName,
      contactName,
      email,
      phone: phone || '',
      businessType: businessType || 'Hospitality / Boutique Hotel',
      estimatedQuantity: estimatedQuantity || '10-50 units',
      message,
    })

    return NextResponse.json({ success: true, enquiry: item })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit business enquiry' }, { status: 500 })
  }
}
