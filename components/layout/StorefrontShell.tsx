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
  const isAdmin = pathname?.startsWith('/admin')

  // If navigating any /admin route (login, dashboard, inventory, orders, etc.),
  // render as an isolated, standalone administrative atelier with zero storefront clutter.
  if (isAdmin) {
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
