import React from 'react'
import { Metadata } from 'next'
import { getProducts } from '@/lib/db'
import { CompareClient } from './CompareClient'

export const metadata: Metadata = {
  title: 'Compare Mattresses | KAMAAR Beddings Malaysia',
  description: 'Compare up to 3 handcrafted natural latex and hybrid mattresses side by side. Compare firmness, thickness, Malaysian dimensions, and warranties.',
}

export default async function ComparePage() {
  const allProducts = await getProducts({ status: 'published' })

  return <CompareClient allProducts={allProducts} />
}
