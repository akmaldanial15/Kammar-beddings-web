import React from 'react'
import { Metadata } from 'next'
import { getProducts } from '@/lib/db'
import { CompareClient } from './CompareClient'

export const metadata: Metadata = {
  title: 'Bandingkan Tilam & Kelengkapan Tidur | KAMAAR Beddings',
  description: 'Bandingkan spesifikasi tilam toto, kekabu asli tradisi, tilam asrama dan tilam lipat bersebelahan. Bandingkan jenis isian, ketebalan, saiz dan harga kilang.',
}

export default async function ComparePage() {
  const allProducts = await getProducts({ status: 'published' })

  return <CompareClient allProducts={allProducts} />
}
