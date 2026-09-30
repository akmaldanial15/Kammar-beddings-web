import { NextRequest, NextResponse } from 'next/server'
import { addReview } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, customerName, rating, title, content, isVerifiedPurchase } = body

    if (!productId || !customerName || !rating || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const review = await addReview({
      productId,
      customerName,
      rating: Number(rating),
      title: title || '',
      content,
      isVerifiedPurchase: Boolean(isVerifiedPurchase),
    })

    return NextResponse.json(review)
  } catch (err) {
    console.error('Error adding review:', err)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}
