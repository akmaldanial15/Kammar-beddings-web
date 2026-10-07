import React from 'react'
import { getShowrooms } from '@/lib/db'
import { ShowroomsClient } from './ShowroomsClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kilang & Jualan Gudang | TUNAS SINAR JAYA ENTERPRISE (KAMAAR BEDDINGS)',
  description:
    'Kunjungi kilang dan gudang simpanan utama kami di Tasek Gelugor, Pulau Pinang. Cuba sendiri tilam toto empuk, tilam lipat, dan bantal gebu pada harga jualan terus dari kilang.',
}

export const dynamic = 'force-dynamic'

export default async function ShowroomsPage() {
  const showrooms = await getShowrooms()

  return (
    <div className="bg-cream min-h-screen py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            Jualan Gudang & Pengilangan
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-forest-dark">
            Kilang & Stor Utama Kami
          </h1>
          <p className="text-sm md:text-base text-secondary">
            Alami sendiri kualiti tekstil buatan anak tempatan di tapak operasi kami di Tasek Gelugor. Dapatkan tilam toto, tilam lipat, bantal gebu dan set comforter terus dari lantai pengeluaran kilang tanpa orang tengah.
          </p>
        </div>

        <ShowroomsClient showrooms={showrooms} />
      </div>
    </div>
  )
}
