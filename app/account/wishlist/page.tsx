import React from 'react'
import { Metadata } from 'next'
import { getProducts } from '@/lib/db'
import { WishlistClient } from './WishlistClient'

export const metadata: Metadata = {
  title: 'My Wishlist & Saved Sleep Essentials | KAMAAR Beddings Malaysia',
  description:
    'Review your curated bedroom wish list, compare handcrafted natural latex mattresses, and easily transfer items into your shopping bag.',
}

export default async function WishlistPage() {
  const products = await getProducts({ status: 'published' })

  return (
    <div className="bg-cream min-h-screen py-12 md:py-20 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Editorial Heading */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            Curated Bedroom Sanctuary
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-forest-dark">
            My Saved Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-secondary">
            Your personal selection of luxury handcrafted mattresses, ergonomic pillows, and organic bedding essentials.
          </p>
        </div>

        <WishlistClient allProducts={products} />
      </div>
    </div>
  )
}
