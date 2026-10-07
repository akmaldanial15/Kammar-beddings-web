import React from 'react'
import { Metadata } from 'next'
import { CareGuideClient } from './CareGuideClient'

export const metadata: Metadata = {
  title: 'Panduan Penjagaan Tilam Toto & Tekstil Kilang | KAMAAR Beddings',
  description:
    'Panduan lengkap penjagaan tilam toto Asian fibre, tilam kekabu asli tradisi, tilam lipat berzip, dan bantal gebu keluaran kilang Tunas Sinar Jaya Enterprise Tasek Gelugor.',
}

export default function CareGuidePage() {
  return (
    <div className="bg-cream min-h-screen py-12 md:py-20 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Editorial Heading */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            Ketahanan & Kualiti Fabrik Kilang
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-forest-dark tracking-tight">
            Panduan Penjagaan Tilam Toto & Tekstil Rumah
          </h1>
          <p className="text-sm md:text-base text-secondary leading-relaxed">
            Dihasilkan dengan kepakaran Unit Jahitan & Isian Tunas Sinar Jaya Enterprise di Tasek Gelugor. Ikuti panduan penjagaan praktikal ini agar tilam toto, kekabu asli dan bantal anda kekal gebu, anjal, bersih dan tahan bertahun-tahun.
          </p>
        </div>

        <CareGuideClient />
      </div>
    </div>
  )
}
