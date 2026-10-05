'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface WishlistContextType {
  wishlistIds: string[]
  toggleWishlist: (productId: string) => void
  removeFromWishlist: (productId: string) => void
  clearWishlist: () => void
  isInWishlist: (productId: string) => boolean
  wishlistCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

const STORAGE_KEY = 'lena_wishlist_v1'

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setWishlistIds(JSON.parse(stored))
      }
    } catch {}
  }, [])

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  const removeFromWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const updated = prev.filter((id) => id !== productId)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  const clearWishlist = () => {
    setWishlistIds([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }

  const isInWishlist = (productId: string) => wishlistIds.includes(productId)

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        wishlistCount: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
