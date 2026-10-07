import React from 'react'
import { getProducts } from '@/lib/db'
import { WarrantyClient } from './WarrantyClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jaminan Kualiti Kilang & Pendaftaran Produk | KAMAAR Beddings',
  description:
    'Daftar pembelian tilam toto, tilam kekabu, tilam asrama dan bantal gebu anda untuk jaminan kualiti jahitan terus dari kilang Tunas Sinar Jaya Enterprise.',
}

export default async function WarrantyPage() {
  const products = await getProducts({ status: 'published' })
  const mattressNames = products.map((p) => p.name)

  return (
    <div className="bg-cream min-h-screen py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Editorial Heading */}
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            Jaminan Mutu Kilang Tunas Sinar Jaya
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-forest-dark">
            Pendaftaran & Semakan Jaminan Produk
          </h1>
          <p className="text-sm md:text-base text-secondary max-w-2xl mx-auto">
            Setiap tilam toto, kekabu asli tradisi, dan kelengkapan tidur KAMAAR dihasilkan dengan standard jahitan industri dan gentian Asian Polyester Fibre bermutu tinggi. Daftarkan invois pesanan anda untuk sokongan servis kilang.
          </p>
        </div>

        <WarrantyClient mattressOptions={mattressNames} />
      </div>
    </div>
  )
}
