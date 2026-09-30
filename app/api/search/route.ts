import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    if (!query.trim()) {
      return NextResponse.json({ products: [] })
    }

    const products = await getProducts({ search: query.trim() })
    return NextResponse.json({ products: products.slice(0, 8) })
  } catch (err) {
    console.error('Search API error:', err)
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 })
  }
}
