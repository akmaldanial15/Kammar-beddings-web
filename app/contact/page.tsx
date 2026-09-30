import React from 'react'
import { ContactClient } from './ContactClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Concierge & Customer Care | KAMAAR Beddings Malaysia',
  description:
    'Reach KAMAAR Beddings customer concierge for product advice, order status inquiries, custom sizes, or delivery scheduling.',
}

export default function ContactPage() {
  return (
    <div className="bg-cream min-h-screen py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            At Your Service
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-forest-dark">
            Concierge & Client Care
          </h1>
          <p className="text-sm md:text-base text-secondary">
            Whether you need personalized firmness recommendations or delivery logistics assistance, our Malaysian bedding consultants are ready to assist.
          </p>
        </div>

        <ContactClient />
      </div>
    </div>
  )
}
