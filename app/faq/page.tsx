import React from 'react'
import { FaqClient } from './FaqClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Soalan Lazim (FAQ) & Maklumat Kilang | KAMAAR Beddings Malaysia',
  description:
    'Jawapan lengkap mengenai tempahan tilam toto, kekabu asli, tilam bujang asrama, penghantaran lori kilang, tempahan pukal dan jualan gudang Tunas Sinar Jaya Enterprise.',
}

export default function FaqPage() {
  return (
    <div className="bg-cream min-h-screen py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            Pusat Maklumat Kilang & Pembeli
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-forest-dark">
            Soalan Lazim (FAQ)
          </h1>
          <p className="text-sm md:text-base text-secondary max-w-xl mx-auto">
            Ketahui lebih lanjut mengenai keistimewaan tilam toto Asian fibre, kekabu tradisi, tempahan borong asrama, dan penghantaran terus dari kilang kami di Tasek Gelugor.
          </p>
        </div>

        <FaqClient />
      </div>
    </div>
  )
}
