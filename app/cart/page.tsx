import React from 'react'
import { Metadata } from 'next'
import { CartClient } from './CartClient'

export const metadata: Metadata = {
  title: 'Shopping Cart | KAMAAR Beddings Malaysia',
  description: 'Review your selected luxury organic natural latex mattresses, pillows, and bedding before checkout.',
}

export default function CartPage() {
  return <CartClient />
}
