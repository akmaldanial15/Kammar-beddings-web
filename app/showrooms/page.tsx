import React from 'react'
import { getShowrooms } from '@/lib/db'
import { ShowroomsClient } from './ShowroomsClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Showroom Studios & Sleep Testing | KAMAAR Beddings Malaysia',
  description:
    'Visit KAMAAR Beddings galleries in Bangsar, Damansara, Penang, and Johor Bahru. Book a private 1-on-1 mattress consultation with our certified sleep ergonomists.',
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
            Physical Experience
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-forest-dark">
            Our Sleep Studios & Experiential Galleries
          </h1>
          <p className="text-sm md:text-base text-secondary">
            Feel the natural cooling of organic Malaysian latex, test individual pocket spring responsiveness, and discover your ideal spine alignment with a private fitting.
          </p>
        </div>

        <ShowroomsClient showrooms={showrooms} />
      </div>
    </div>
  )
}
