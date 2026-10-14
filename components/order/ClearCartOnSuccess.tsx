'use client'

import { useEffect } from 'react'
import { useCart } from '@/lib/context/CartContext'

interface ClearCartOnSuccessProps {
  orderId?: string
}

export function ClearCartOnSuccess({ orderId }: ClearCartOnSuccessProps) {
  const { clearCart } = useCart()

  useEffect(() => {
    try {
      // Clear cart once order is confirmed
      clearCart()

      // Clean up temporary checkout session items
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('kamaar_last_checkout_items')
        sessionStorage.removeItem('kamaar_last_order_id')
        sessionStorage.removeItem('kamaar_last_checkout_form')
        if (orderId) {
          sessionStorage.setItem('kamaar_completed_order_id', orderId)
        }
      }
    } catch (_) {}
  }, [clearCart, orderId])

  return null
}
