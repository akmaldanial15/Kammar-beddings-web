import React from 'react'
import { BusinessClient } from './BusinessClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hospitality & Commercial Bedding Procurement | KAMAAR Beddings Malaysia',
  description:
    'Custom mattress manufacturing and bulk sleep systems for luxury boutique hotels, wellness resorts, and interior design firms across Southeast Asia.',
}

export default function BusinessPage() {
  return (
    <div className="bg-cream min-h-screen py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            Hospitality & Commercial
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-forest-dark">
            Elevate Your Hotel Guest Sleep Experience
          </h1>
          <p className="text-sm md:text-base text-secondary">
            KAMAAR Beddings partners with leading boutique hotels, eco-resorts, and residential developments across Malaysia to engineer custom, durable, natural latex bedding.
          </p>
        </div>

        <BusinessClient />
      </div>
    </div>
  )
}
