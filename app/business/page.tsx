import React from 'react'
import { BusinessClient } from './BusinessClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tempahan Pukal (OEM), Asrama & Pembekalan Kerajaan | Tunas Sinar Jaya Enterprise',
  description:
    'Pengilangan produk tekstil, pengeluaran jenama sendiri (OEM), pembekalan agensi kerajaan dan tempahan borong asrama/homestay terus dari kilang Tunas Sinar Jaya di Tasek Gelugor.',
}

export default function BusinessPage() {
  return (
    <div className="bg-cream min-h-screen py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-dark font-bold">
            Perkhidmatan Pengilangan &amp; Pemborongan
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-forest">
            Tempahan Pukal, Projek OEM &amp; Pembekalan Kerajaan
          </h1>
          <p className="text-sm md:text-base text-charcoal-muted leading-relaxed">
            TUNAS SINAR JAYA ENTERPRISE bersedia membekalkan produk jahitan tekstil berkualiti tinggi — Tilam Toto, Tilam Bujang Asrama, Bantal Gebu, Tilam Kekabu, dan Cadar berzip untuk asrama sekolah, maahad tahfiz, homestay, agensi kerajaan serta sektor swasta.
          </p>
        </div>

        <BusinessClient />
      </div>
    </div>
  )
}
