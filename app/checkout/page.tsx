import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { CheckoutClient } from './CheckoutClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Secure Checkout | KAMAAR Beddings Malaysia',
  description: 'Review your order, enter delivery details, and pay securely via Stripe Checkout.',
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center p-8">
          <div className="text-center font-serif text-lg text-forest-dark animate-pulse">
            Loading Secure Atelier Checkout...
          </div>
        </div>
      }
    >
      <CheckoutClient />
    </Suspense>
  )
}
