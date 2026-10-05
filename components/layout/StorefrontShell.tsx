'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/common/WhatsAppButton'
import { ThemeInjector } from '@/components/layout/ThemeInjector'

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isStandalone =
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/affiliate') ||
    pathname?.startsWith('/checkout')

  // If navigating any /admin, /affiliate, or /checkout route,
  // render as an isolated, standalone portal with zero customer storefront clutter.
  if (isStandalone) {
    return (
      <div className="min-h-screen bg-cream">
        <ThemeInjector />
        {children}
      </div>
    )
  }

  // Public customer storefront experience
  return (
    <div className="flex flex-col min-h-screen">
      <ThemeInjector />
      <AnnouncementBar />
      <Header />
      <CartDrawer />
      <main className="flex-1">{children}</main>
      <WhatsAppButton phoneNumber="+60123456789" />
      <Footer />
    </div>
  )
}
