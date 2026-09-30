import React from 'react'
import { Metadata } from 'next'
import { getProducts } from '@/lib/db'
import { FinderClient } from './FinderClient'

export const metadata: Metadata = {
  title: 'Mattress Finder Quiz | KAMAAR Beddings Malaysia',
  description: 'Take our 60-second interactive sleep assessment to find the ideal organic natural latex or hybrid mattress for your body and sleeping style.',
}

export default async function FinderPage() {
  const products = await getProducts({ status: 'published' })

  return <FinderClient products={products} />
}
