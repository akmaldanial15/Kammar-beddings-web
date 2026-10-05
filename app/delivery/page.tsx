import React from 'react'
import { Metadata } from 'next'
import { DeliveryClient } from './DeliveryClient'

export const metadata: Metadata = {
  title: 'Shipping & Bulky Delivery Policy | KAMAAR Beddings Malaysia',
  description:
    'Learn about our complimentary White-Glove delivery, bedroom setup, postcode timelines, and bulky freight logistics across Peninsular and East Malaysia.',
}

export default function DeliveryPage() {
  return (
    <div className="bg-cream min-h-screen py-12 md:py-20 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Editorial Heading */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            White-Glove Logistics
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-forest-dark tracking-tight">
            Shipping & Bulky In-Home Delivery
          </h1>
          <p className="text-sm md:text-base text-secondary leading-relaxed">
            From our artisan atelier in Selangor to your bedroom. Every luxury mattress is transported securely with dedicated two-person white-glove setup and full packaging removal at zero additional charge across Peninsular Malaysia.
          </p>
        </div>

        <DeliveryClient />
      </div>
    </div>
  )
}
