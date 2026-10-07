import React from 'react'
import { Metadata } from 'next'
import { TrialClient } from './TrialClient'

export const metadata: Metadata = {
  title: 'Jaminan Kepuasan Kilang 14 Hari | KAMAAR Beddings Malaysia',
  description:
    'Jaminan kepuasan pelanggan terus dari kilang Tunas Sinar Jaya Enterprise. Pertukaran 1-ke-1 jika terdapat sebarang kecacatan jahitan atau kerosakan fabrik.',
}

export default function TrialPage() {
  return (
    <div className="bg-cream min-h-screen py-12 md:py-20 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Editorial Heading */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            Jaminan Mutu & Ketulenan Kilang
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-forest-dark tracking-tight">
            Jaminan Kepuasan & Pertukaran 14 Hari
          </h1>
          <p className="text-sm md:text-base text-secondary leading-relaxed">
            Kepuasan anda keutamaan kami. Setiap tilam toto, kekabu asli dan tekstil KAMAAR diperiksa ketat sebelum keluar dari kilang kami di Tasek Gelugor. Nikmati jaminan pertukaran tanpa rungutan sekiranya terdapat sebarang kecacatan jahitan kilang.
          </p>
        </div>

        <TrialClient />
      </div>
    </div>
  )
}
