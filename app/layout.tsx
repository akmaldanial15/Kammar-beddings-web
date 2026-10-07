import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/lib/i18n/LanguageContext'
import { CartProvider } from '@/lib/context/CartContext'
import { WishlistProvider } from '@/lib/context/WishlistContext'
import { CompareProvider } from '@/lib/context/CompareContext'
import { AffiliateTracker } from '@/components/common/AffiliateTracker'
import { StorefrontShell } from '@/components/layout/StorefrontShell'

export const metadata: Metadata = {
  title: 'KAMAAR Beddings | Pengilang Tilam Toto, Tilam Kekabu & Tekstil Berkualiti (Tunas Sinar Jaya Enterprise)',
  description:
    'Pengilang dan pemborong produk jahitan tekstil berkualiti tinggi terus dari kilang Tasek Gelugor, Pulau Pinang. Menghasilkan Tilam Toto Asian Polyester Fibre, Tilam Kekabu Tradisi, Tilam Bujang Asrama, Bantal Gebu, Comforter Quilting & Tempahan Pukal OEM.',
  keywords: [
    'KAMAAR Beddings',
    'Tunas Sinar Jaya Enterprise',
    'tilam toto tebal Malaysia',
    'tilam toto asian polyester fibre',
    'tilam kekabu asli Tasek Gelugor',
    'tilam lipat 3 berzip',
    'tilam bujang asrama',
    'jualan gudang tekstil Pulau Pinang',
    'kilang tilam toto',
    'bantal gebu asian fibre',
  ],
  openGraph: {
    title: 'KAMAAR Beddings | Pengilang Tilam Toto & Tekstil Berkualiti Tunas Sinar Jaya',
    description: 'Keselesaan anda keutamaan kami. Mengilang dan memasar Tilam Toto, Tilam Kekabu, Tilam Asrama, Bantal Gebu & Jualan Gudang Terus Dari Kilang.',
    url: 'https://kamaarbeddings.com.my',
    siteName: 'KAMAAR Beddings (Tunas Sinar Jaya Enterprise)',
    images: [
      {
        url: '/images/hero/hero-tilam-toto-lifestyle.jpg',
        width: 1200,
        height: 630,
        alt: 'KAMAAR Beddings Tilam Toto Asian Polyester Fibre Tunas Sinar Jaya',
      },
    ],
    locale: 'ms_MY',
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
