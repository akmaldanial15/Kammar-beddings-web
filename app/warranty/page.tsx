import React from 'react'
import { getProducts } from '@/lib/db'
import { WarrantyClient } from './WarrantyClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '10-Year Mattress Warranty Registration | KAMAAR Beddings Malaysia',
  description:
    'Register your handcrafted Malaysian LENA mattress for our 10 to 15-year comprehensive structural warranty. Instant digital certification and claims support.',
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
            Guaranteed Craftsmanship
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-forest-dark">
            10-Year Comprehensive Warranty Registration
          </h1>
          <p className="text-sm md:text-base text-secondary max-w-2xl mx-auto">
            Every KAMAAR mattress is engineered with high-density natural latex, tempered pocket springs, and reinforced edge guards. Register your purchase within 30 days of delivery to activate your digital guarantee.
          </p>
        </div>

        <WarrantyClient mattressOptions={mattressNames} />
      </div>
    </div>
  )
}
