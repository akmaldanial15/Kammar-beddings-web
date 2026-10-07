import React from 'react'
import { Metadata } from 'next'
import { CartClient } from './CartClient'

export const metadata: Metadata = {
  title: 'Troli Pembelian | KAMAAR Beddings Malaysia',
  description: 'Semak pilihan tilam toto, tilam kekabu, tilam asrama dan bantal gebu anda sebelum membuat pesanan terus dari kilang.',
}

export default function CartPage() {
  return <CartClient />
}
