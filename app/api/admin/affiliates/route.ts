import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin/auth'
import { getAffiliates, createAffiliate } from '@/lib/db'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const affiliates = await getAffiliates()
  return NextResponse.json({ affiliates })
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, code, email, phone, bankName, bankAccountNumber, commissionType, commissionRate } = body

    if (!name || !code) {
      return NextResponse.json({ error: 'Name and affiliate code are required' }, { status: 400 })
    }

    const newAffiliate = await createAffiliate(
      {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        email: email?.trim() || '',
        phone: phone?.trim() || '',
        bankName: bankName?.trim() || 'Maybank',
        bankAccountNumber: bankAccountNumber?.trim() || '',
        commissionType: commissionType || 'percentage',
        commissionRate: Number(commissionRate) || 10,
        isActive: true,
      },
      session.email
    )

    return NextResponse.json({ affiliate: newAffiliate }, { status: 201 })
  } catch (err: any) {
    console.error('Failed to create affiliate:', err)
    return NextResponse.json({ error: err.message || 'Failed to create affiliate' }, { status: 400 })
  }
}
