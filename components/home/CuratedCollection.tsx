'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Product } from '@/types'
import { ProductCard } from '@/components/product/ProductCard'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface CuratedCollectionProps {
  products: Product[]
}

export function CuratedCollection({ products }: CuratedCollectionProps) {
  const { t } = useLanguage()
  const [activeFilter, setActiveFilter] = useState<'all' | 'toto' | 'gulung' | 'kekabu' | 'bantal' | 'selimut'>('all')

  const filteredProducts = products.filter((p) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'toto') return p.categoryId === 'cat-tilam-toto' || p.slug?.includes('toto')
    if (activeFilter === 'gulung') return p.categoryId === 'cat-tilam-gulung' || p.slug?.includes('gulung')
    if (activeFilter === 'kekabu') return p.categoryId === 'cat-tilam-kekabu' || p.slug?.includes('kekabu')
    if (activeFilter === 'bantal') return p.categoryId?.startsWith('cat-bantal') || p.slug?.includes('bantal')
    if (activeFilter === 'selimut') return p.categoryId === 'cat-selimut' || p.slug?.includes('selimut')
    return true
  })

  return (
    <section className="py-16 sm:py-24 bg-cream-light border-y border-borderLight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-gold-dark flex items-center space-x-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>KOLEKSI KAMAAR</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest">
              KOLEKSI KAMAAR PALING LARIS &amp; PILIHAN RAMAI
            </h2>
            <p className="text-sm sm:text-base text-charcoal-muted mt-2 max-w-xl font-sans uppercase text-xs sm:text-sm tracking-wide">
              DIHASILKAN OLEH TENAGA MAHIR TEMPATAN MENGGUNAKAN BAHAN BERKUALITI TINGGI, DENGAN KAWALAN KUALITI TELITI DAN HARGA TERBAIK DI PASARAN.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-2 mt-6 md:mt-0 overflow-x-auto pb-2 md:pb-0">
            {[
              { id: 'all', label: 'Semua Koleksi' },
              { id: 'toto', label: 'Tilam Toto (Paling Laris)' },
              { id: 'gulung', label: 'Tilam Gulung' },
              { id: 'kekabu', label: 'Kekabu Asli' },
              { id: 'bantal', label: 'Bantal Tidur & Peluk' },
              { id: 'selimut', label: 'Selimut' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeFilter === tab.id
                    ? 'bg-forest text-warmwhite shadow-sm'
                    : 'bg-warmwhite text-charcoal-muted hover:text-forest border border-borderLight'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/collections/tilam-toto"
            className="inline-flex items-center space-x-2 px-8 py-3.5 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold uppercase tracking-wider rounded-lg shadow-card transition-all hover:scale-105"
          >
            <span>Terokai Semua Koleksi Tilam Toto &amp; Produk Kilang</span>
            <ArrowRight className="w-4 h-4 text-gold" />
          </Link>
        </div>
      </div>
    </section>
  )
}
