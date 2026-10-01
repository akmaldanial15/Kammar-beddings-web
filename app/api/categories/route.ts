import { NextResponse } from 'next/server'
import { getNavCategories, getCategories } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const navCategories = await getNavCategories()
    return NextResponse.json({ categories: navCategories })
  } catch (err: any) {
    console.error('Failed to get nav categories:', err)
    // Fallback to all categories
    const all = await getCategories()
    return NextResponse.json({ categories: all })
  }
}
