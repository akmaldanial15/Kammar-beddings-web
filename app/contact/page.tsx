import React from 'react'
import { ContactClient } from './ContactClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hubungi Kami | TUNAS SINAR JAYA ENTERPRISE (KAMAAR BEDDINGS)',
  description:
    'Hubungi pengurusan dan khidmat pelanggan kilang Tunas Sinar Jaya Enterprise (Kamaar Beddings) di Tasek Gelugor, Pulau Pinang. Pertanyaan produk tilam toto, tilam lipat, bantal dan borong asrama.',
}

export default function ContactPage() {
  return (
    <div className="bg-cream min-h-screen py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            Khidmat Pelanggan & Kilang
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-forest-dark">
            Hubungi Tunas Sinar Jaya
          </h1>
          <p className="text-sm md:text-base text-secondary">
            Sama ada anda ingin membuat tempahan tilam toto, tilam lipat, bantal gebu secara runcit atau membuat tempahan borong untuk asrama dan homestay, pihak pengurusan kilang kami sentiasa bersedia membantu anda.
          </p>
        </div>

        <ContactClient />
      </div>
    </div>
  )
}
