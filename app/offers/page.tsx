import React from 'react'
import { Metadata } from 'next'
import { getCoupons, getProducts } from '@/lib/db'
import { OffersClient } from './OffersClient'

export const metadata: Metadata = {
  title: 'Vouchers & Mattress Offers | KAMAAR Beddings Malaysia',
  description: 'Discover active promotional vouchers, bundle discounts, and complimentary natural latex gifts on luxury mattresses.',
}

export default async function OffersPage() {
  const [coupons, products] = await Promise.all([
    getCoupons(),
    getProducts({ status: 'published' }),
  ])

  return <OffersClient coupons={coupons} eligibleProducts={products} />
}
