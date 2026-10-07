import React from 'react'
import { Metadata } from 'next'
import { getCoupons, getProducts } from '@/lib/db'
import { OffersClient } from './OffersClient'

export const metadata: Metadata = {
  title: 'Tawaran Istimewa & Baucar Kilang | KAMAAR Beddings Malaysia',
  description: 'Dapatkan promosi harga kilang, diskaun baucar dan hadiah percuma bantal gebu untuk pembelian tilam toto, kekabu asli dan tekstil Tunas Sinar Jaya Enterprise.',
}

export default async function OffersPage() {
  const [coupons, products] = await Promise.all([
    getCoupons(),
    getProducts({ status: 'published' }),
  ])

  return <OffersClient coupons={coupons} eligibleProducts={products} />
}
