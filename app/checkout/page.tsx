import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { getPaymentSettings, getSiteSettings, getProducts } from '@/lib/db'
import { CheckoutClient } from './CheckoutClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Secure 1-Page Checkout | KAMAAR Beddings Malaysia',
  description: 'Review your order, enter delivery details, and pay securely via Malaysian Payment Gateways.',
}

export default async function CheckoutPage() {
  const [paymentSettings, siteSettings, products] = await Promise.all([
    getPaymentSettings(),
    getSiteSettings(),
    getProducts({ status: 'published' }),
  ])

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
      <CheckoutClient
        initialPaymentSettings={paymentSettings}
        initialSiteSettings={siteSettings}
        availableProducts={products}
      />
    </Suspense>
  )
}
