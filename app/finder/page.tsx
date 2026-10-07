import React from 'react'
import { Metadata } from 'next'
import { getProducts } from '@/lib/db'
import { FinderClient } from './FinderClient'

export const metadata: Metadata = {
  title: 'Kuis Pemilihan Tilam & Kelengkapan Tidur | KAMAAR Beddings',
  description: 'Jawab soalan 60 saat untuk mencari tilam toto, tilam kekabu tradisi, tilam bujang asrama atau tilam lipat yang paling sesuai dengan keperluan dan ruang anda.',
}

export default async function FinderPage() {
  const products = await getProducts({ status: 'published' })

  return <FinderClient products={products} />
}
