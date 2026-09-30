import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/lib/i18n/LanguageContext'
import { CartProvider } from '@/lib/context/CartContext'
import { WishlistProvider } from '@/lib/context/WishlistContext'
import { CompareProvider } from '@/lib/context/CompareContext'
import { AffiliateTracker } from '@/components/common/AffiliateTracker'
import { StorefrontShell } from '@/components/layout/StorefrontShell'

export const metadata: Metadata = {
  title: 'KAMAAR Beddings | 100% Pure Natural Latex & Luxury Hybrid Mattresses Malaysia',
  description:
    'Handcrafted in Malaysia with 100% organic natural latex and micro-zoned pocket springs. Experience 100-night sleep trials, 10-year warranties, and complimentary white-glove bedroom setup across Peninsular Malaysia.',
  keywords: [
    'KAMAAR Beddings',
    'natural latex mattress Malaysia',
    'luxury hybrid mattress',
    'orthopaedic mattress Kuala Lumpur',
    'latex pillow Malaysia',
    'mattress trial Malaysia',
    'KAMAAR',
  ],
  openGraph: {
    title: 'KAMAAR Beddings | Organic Latex & Luxury Hybrid Mattresses',
    description: 'Transform your sleep with certified organic natural latex and ergonomic spinal alignment.',
    url: 'https://kamaarbeddings.com.my',
    siteName: 'KAMAAR Beddings Malaysia',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'KAMAAR Beddings Luxury Bedroom Sanctuary',
      },
    ],
    locale: 'en_MY',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen selection:bg-gold/30 selection:text-forest">
        <LanguageProvider>
          <CartProvider>
            <WishlistProvider>
              <CompareProvider>
                <AffiliateTracker />
                <StorefrontShell>{children}</StorefrontShell>
              </CompareProvider>
            </WishlistProvider>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
