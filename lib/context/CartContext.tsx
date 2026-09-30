'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { CartItem } from '@/types'

interface CartContextType {
  items: CartItem[]
  isDrawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  couponCode: string
  setCouponCode: (code: string) => void
  notes: string
  setNotes: (notes: string) => void
  itemCount: number
  subtotalSen: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = 'lena_cart_v1'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed.items)) setItems(parsed.items)
        if (parsed.couponCode) setCouponCode(parsed.couponCode)
        if (parsed.notes) setNotes(parsed.notes)
      }
    } catch {
      // Ignore
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save to local storage on change
  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ items, couponCode, notes })
      )
    } catch {
      // Ignore
    }
  }, [items, couponCode, notes, isLoaded])

  const openDrawer = () => setIsDrawerOpen(true)
  const closeDrawer = () => setIsDrawerOpen(false)

  const addItem = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const qtyToAdd = newItem.quantity || 1
    setItems((prev) => {
      const existing = prev.find((item) => item.variantId === newItem.variantId)
      if (existing) {
        const updatedQty = Math.min(
          existing.quantity + qtyToAdd,
          newItem.stockAvailable || 99
        )
        return prev.map((item) =>
          item.variantId === newItem.variantId
            ? { ...item, quantity: updatedQty }
            : item
        )
      }
      return [...prev, { ...newItem, quantity: qtyToAdd }]
    })
    setIsDrawerOpen(true)
  }

  const removeItem = (variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId))
  }

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId)
      return
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.variantId === variantId) {
          const clamped = Math.min(quantity, i.stockAvailable || 99)
          return { ...i, quantity: clamped }
        }
        return i
      })
    )
  }

  const clearCart = () => {
    setItems([])
    setCouponCode('')
    setNotes('')
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotalSen = items.reduce((sum, i) => sum + i.priceSen * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        couponCode,
        setCouponCode,
        notes,
        setNotes,
        itemCount,
        subtotalSen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
