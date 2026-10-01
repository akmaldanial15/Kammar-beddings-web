'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/common/WhatsAppButton'

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isStandalone = pathname?.startsWith('/admin') || pathname?.startsWith('/affiliate')

  // If navigating any /admin or /affiliate route (login, portal, dashboard, reset, etc.),
  // render as an isolated, standalone portal with zero customer storefront clutter.
  if (isStandalone) {
    return <div className="min-h-screen bg-cream">{children}</div>
  }

  // Public customer storefront experience
  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Header />
      <CartDrawer />
      <main className="flex-1">{children}</main>
      <WhatsAppButton phoneNumber="+60123456789" />
      <Footer />
    </div>
  )
}
