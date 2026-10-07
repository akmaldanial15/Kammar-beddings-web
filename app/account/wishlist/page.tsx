import React from 'react'
import { Metadata } from 'next'
import { getProducts } from '@/lib/db'
import { WishlistClient } from './WishlistClient'

export const metadata: Metadata = {
  title: 'Senarai Hajat Saya | KAMAAR Beddings Malaysia',
  description:
    'Semak senarai pilihan tilam toto, kekabu asli, bantal gebu dan tekstil kegemaran anda sebelum membuat pesanan terus dari kilang.',
}

export default async function WishlistPage() {
  const products = await getProducts({ status: 'published' })

  return (
    <div className="bg-cream min-h-screen py-12 md:py-20 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Editorial Heading */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            Pilihan Simpanan Peribadi
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-forest-dark">
            Senarai Hajat Saya
          </h1>
          <p className="text-xs sm:text-sm text-secondary">
            Simpanan produk tilam toto, kekabu asli tradisi, bantal gebu, dan tekstil pilihan anda dari kilang Tunas Sinar Jaya.
          </p>
        </div>

        <WishlistClient allProducts={products} />
      </div>
    </div>
  )
}
