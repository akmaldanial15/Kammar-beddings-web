'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Product } from '@/types'

interface CompareContextType {
  compareProducts: Product[]
  addToCompare: (product: Product) => { success: boolean; message?: string }
  removeFromCompare: (productId: string) => void
  clearCompare: () => void
  isComparing: (productId: string) => boolean
  compareCount: number
}

const CompareContext = createContext<CompareContextType | undefined>(undefined)

const STORAGE_KEY = 'lena_compare_v1'

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareProducts, setCompareProducts] = useState<Product[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setCompareProducts(JSON.parse(stored))
      }
    } catch {}
  }, [])

  const addToCompare = (product: Product): { success: boolean; message?: string } => {
    if (compareProducts.some((p) => p.id === product.id)) {
      return { success: false, message: 'Mattress is already in your comparison table.' }
    }
    if (compareProducts.length >= 3) {
      return { success: false, message: 'You can compare up to 3 mattresses at a time.' }
    }
    const updated = [...compareProducts, product]
    setCompareProducts(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {}
    return { success: true }
  }

  const removeFromCompare = (productId: string) => {
    const updated = compareProducts.filter((p) => p.id !== productId)
    setCompareProducts(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {}
  }

  const clearCompare = () => {
    setCompareProducts([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }

  const isComparing = (productId: string) => compareProducts.some((p) => p.id === productId)

  return (
    <CompareContext.Provider
      value={{
        compareProducts,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isComparing,
        compareCount: compareProducts.length,
      }}
    >
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const context = useContext(CompareContext)
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider')
  }
  return context
}
