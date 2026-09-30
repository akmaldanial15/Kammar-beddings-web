import React from 'react'
import { AccountClient } from './AccountClient'
import { getProducts } from '@/lib/db'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Customer Atelier & Order Tracking | KAMAAR Beddings Malaysia',
  description:
    'Track your handcrafted mattress delivery, view official tax receipts, and access your 10-year digital warranty certificates.',
}

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const products = await getProducts({ status: 'published' })

  return (
    <div className="bg-cream min-h-screen py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            Customer Atelier Portal
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-forest-dark">
            My Sleep Sanctuary
          </h1>
          <p className="text-sm text-secondary">
            Manage your purchases, monitor white-glove courier status, and verify warranty protection.
          </p>
        </div>

        <AccountClient allProducts={products} />
      </div>
    </div>
  )
}
