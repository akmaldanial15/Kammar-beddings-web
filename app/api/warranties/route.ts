import { NextRequest, NextResponse } from 'next/server'
import { submitWarranty, getWarrantyRegistrations, getWarrantiesByCustomerEmail } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  const invoice = searchParams.get('invoice')

  if (email) {
    const list = await getWarrantiesByCustomerEmail(email)
    return NextResponse.json({ warranties: list })
  }

  if (invoice) {
    const all = await getWarrantyRegistrations()
    const found = all.find((w) => w.invoiceNumber.toLowerCase() === invoice.toLowerCase())
    return NextResponse.json({ warranty: found || null })
  }

  return NextResponse.json({ error: 'Provide email or invoice query' }, { status: 400 })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      customerName,
      customerEmail,
      customerPhone,
      productName,
      purchaseDate,
      deliveryDate,
      retailer,
      invoiceNumber,
    } = body

    if (!customerName || !customerEmail || !invoiceNumber || !productName) {
      return NextResponse.json(
        { error: 'Customer name, email, invoice number, and product model are required.' },
        { status: 400 }
      )
    }

    const reg = await submitWarranty({
      customerName,
      customerEmail,
      customerPhone: customerPhone || '',
      productName,
      purchaseDate: purchaseDate || new Date().toISOString().split('T')[0],
      deliveryDate: deliveryDate || new Date().toISOString().split('T')[0],
      retailer: retailer || 'LENA SLEEP Official Online Atelier',
      invoiceNumber,
    })

    return NextResponse.json({ success: true, registration: reg })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit warranty' }, { status: 500 })
  }
}
