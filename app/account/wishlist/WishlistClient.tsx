'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  BedDouble,
  Check,
} from 'lucide-react'
import { Product } from '@/types'
import { formatMYR } from '@/lib/utils/format'
import { useWishlist } from '@/lib/context/WishlistContext'
import { useCart } from '@/lib/context/CartContext'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface WishlistClientProps {
  allProducts: Product[]
}

export function WishlistClient({ allProducts }: WishlistClientProps) {
  const { wishlistIds, removeFromWishlist, clearWishlist } = useWishlist()
  const { addItem, openDrawer } = useCart()
  const { locale } = useLanguage()
  const isBM = locale === 'bm'

  const [addedId, setAddedId] = useState<string | null>(null)

  const savedProducts = allProducts.filter((p) => wishlistIds.includes(p.id))

  const handleQuickAdd = (product: Product) => {
    const active = product.variants.filter((v) => v.isActive && v.stockQuantity > 0)
    const variant = active[0] || product.variants[0]
    if (!variant) return

    addItem({
      variantId: variant.id,
      productId: product.id,
      productName: product.name,
      sizeName: variant.sizeName,
      sku: variant.sku,
      dimensions: variant.dimensions,
      priceSen: variant.priceSen,
      compareAtPriceSen: variant.compareAtPriceSen,
      imageUrl: product.images[0]?.imageUrl || '',
      quantity: 1,
      stockAvailable: variant.stockQuantity,
    })

    setAddedId(product.id)
    setTimeout(() => {
      setAddedId(null)
      openDrawer()
    }, 400)
  }

  return (
    <div className="space-y-8">
      {savedProducts.length > 0 && (
        <div className="flex items-center justify-between pb-3 border-b border-borderLight text-xs">
          <span className="text-secondary font-medium">
            {isBM
              ? `Menunjukkan ${savedProducts.length} item tersimpan`
              : `Showing ${savedProducts.length} saved mattress & bedding items`}
          </span>
          <button
            onClick={() => {
              if (confirm(isBM ? 'Padam semua item daripada senarai hajat?' : 'Clear all items from your wishlist?')) {
                clearWishlist()
              }
            }}
            className="text-secondary hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isBM ? 'Kosongkan Senarai' : 'Clear Wishlist'}</span>
          </button>
        </div>
      )}

      {savedProducts.length === 0 ? (
        <div className="bg-warmwhite rounded-3xl p-10 md:p-16 border border-borderLight text-center space-y-4 shadow-sm max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-cream mx-auto flex items-center justify-center text-charcoal-muted">
            <Heart className="w-8 h-8 text-gold-dark opacity-60" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-serif text-2xl font-bold text-forest-dark">
              {isBM ? 'Senarai Hajat Anda Masih Kosong' : 'Your Wishlist is Empty'}
            </h3>
            <p className="text-xs sm:text-sm text-secondary max-w-sm mx-auto">
              {isBM
                ? 'Tekan ikon hati pada mana-mana tilam atau bantal untuk menyimpan dan membandingkannya di sini.'
                : 'Click the heart icon on any mattress or luxury accessory to save your favorites for later.'}
            </p>
          </div>
          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/collections/mattress"
              className="px-6 py-3 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all"
            >
              {isBM ? 'Terokai Tilam' : 'Browse Mattresses'}
            </Link>
            <Link
              href="/finder"
              className="px-6 py-3 bg-cream hover:bg-cream-light text-forest text-xs font-bold uppercase tracking-wider rounded-xl border border-borderLight transition-all"
            >
              {isBM ? 'Kuiz Cari Tilam (60s)' : '60-Sec Mattress Quiz'}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProducts.map((product) => {
            const activeVariants = product.variants.filter((v) => v.isActive)
            const minPrice =
              activeVariants.length > 0
                ? Math.min(...activeVariants.map((v) => v.priceSen))
                : 0
            const primaryImg =
              product.images[0]?.imageUrl ||
              'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80'

            return (
              <div
                key={product.id}
                className="bg-warmwhite rounded-2xl border border-borderLight shadow-sm overflow-hidden flex flex-col justify-between hover:border-gold/50 transition-all group"
              >
                <div>
                  {/* Image Card */}
                  <div className="relative aspect-[4/3] bg-cream-light overflow-hidden">
                    <Link href={`/products/${product.slug}`}>
                      <Image
                        src={primaryImg}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-warmwhite/90 text-rose-600 hover:bg-rose-50 shadow-md transition-colors cursor-pointer"
                      title={isBM ? 'Keluarkan dari senarai' : 'Remove from wishlist'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {product.material && (
                      <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-forest-dark/80 backdrop-blur-sm text-gold text-[10px] font-bold uppercase tracking-wider">
                        {product.material}
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4 sm:p-5 space-y-2">
                    <Link
                      href={`/products/${product.slug}`}
                      className="font-serif text-base sm:text-lg font-bold text-forest-dark hover:text-forest block line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                      {product.shortDescription || product.subtitle}
                    </p>
                    <div className="pt-2 flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-secondary block font-bold">
                          {isBM ? 'Harga Bermula' : 'Starting From'}
                        </span>
                        <span className="font-serif text-lg font-bold text-forest">
                          {formatMYR(minPrice)}
                        </span>
                      </div>
                      <span className="text-[11px] text-secondary font-medium">
                        {product.variants.length} {isBM ? 'saiz' : 'sizes'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-borderLight bg-cream/30 flex items-center gap-2">
                  <button
                    onClick={() => handleQuickAdd(product)}
                    className="flex-1 py-2.5 px-3 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {addedId === product.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-gold" />
                        <span>{isBM ? 'Ditambah!' : 'Added!'}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5 text-gold" />
                        <span>{isBM ? 'Tambah ke Beg' : 'Add to Bag'}</span>
                      </>
                    )}
                  </button>

                  <Link
                    href={`/products/${product.slug}`}
                    className="p-2.5 rounded-xl bg-warmwhite hover:bg-cream border border-borderLight text-charcoal text-xs font-bold transition-colors flex items-center justify-center"
                    title={isBM ? 'Lihat butiran' : 'View details'}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
