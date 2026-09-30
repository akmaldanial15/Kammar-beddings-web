'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Scale, Eye, Sparkles, Check } from 'lucide-react'
import { Product } from '@/types'
import { formatMYR } from '@/lib/utils/format'
import { useWishlist } from '@/lib/context/WishlistContext'
import { useCompare } from '@/lib/context/CompareContext'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { QuickViewModal } from './QuickViewModal'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useLanguage()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { isComparing, addToCompare, removeFromCompare } = useCompare()
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)

  const inWishlist = isInWishlist(product.id)
  const comparing = isComparing(product.id)

  // Calculate lowest available price
  const activeVariants = product.variants.filter((v) => v.isActive)
  const minPrice = activeVariants.length > 0 ? Math.min(...activeVariants.map((v) => v.priceSen)) : 0
  const maxCompareAt = activeVariants.reduce(
    (max, v) => Math.max(max, v.compareAtPriceSen || 0),
    0
  )
  const hasSavings = maxCompareAt > minPrice
  const savingsPercent = hasSavings ? Math.round(((maxCompareAt - minPrice) / maxCompareAt) * 100) : 0

  const primaryImage = product.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80'
  const secondaryImage = product.images[1]?.imageUrl || primaryImage

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (comparing) {
      removeFromCompare(product.id)
    } else {
      addToCompare(product)
    }
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product.id)
  }

  return (
    <>
      <div className="product-card group relative bg-warmwhite rounded-xl border border-borderLight overflow-hidden flex flex-col justify-between">
        {/* Top Badges & Actions */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-light">
          <Link href={`/products/${product.slug}`} className="block w-full h-full">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {secondaryImage !== primaryImage && (
              <Image
                src={secondaryImage}
                alt={`${product.name} alternate view`}
                fill
                className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              />
            )}
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-1.5 z-10">
            {product.isFeatured && (
              <span className="bg-forest text-warmwhite text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                Signature
              </span>
            )}
            {hasSavings && (
              <span className="bg-sale text-warmwhite text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                Save {savingsPercent}%
              </span>
            )}
          </div>

          {/* Floating Actions */}
          <div className="absolute top-3 right-3 flex flex-col space-y-1.5 z-10">
            <button
              onClick={handleToggleWishlist}
              className={`p-2 rounded-full shadow-md transition-all ${
                inWishlist
                  ? 'bg-sale text-warmwhite'
                  : 'bg-warmwhite/90 text-charcoal hover:bg-warmwhite hover:text-sale'
              }`}
              title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              aria-label="Wishlist toggle"
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleToggleCompare}
              className={`p-2 rounded-full shadow-md transition-all ${
                comparing
                  ? 'bg-gold text-warmwhite'
                  : 'bg-warmwhite/90 text-charcoal hover:bg-warmwhite hover:text-gold-dark'
              }`}
              title={comparing ? 'Comparing' : 'Compare Mattress'}
              aria-label="Compare toggle"
            >
              <Scale className="w-4 h-4" />
            </button>
          </div>

          {/* Quick View Button on Hover */}
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden sm:block">
            <button
              onClick={() => setIsQuickViewOpen(true)}
              className="w-full py-2 bg-warmwhite/95 hover:bg-warmwhite text-forest text-xs font-bold rounded-lg shadow-lg border border-borderLight flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-gold-dark" />
              <span>{t.quickView}</span>
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Material & Firmness Info */}
            <div className="flex items-center justify-between text-[11px] text-charcoal-muted mb-1.5">
              <span className="font-semibold text-gold-dark uppercase tracking-wider truncate">
                {product.material || product.productType}
              </span>
              {product.firmness && (
                <span className="bg-cream px-2 py-0.5 rounded border border-borderLight">
                  {product.firmness} ({product.firmnessScale}/10)
                </span>
              )}
            </div>

            <Link href={`/products/${product.slug}`} className="block group-hover:text-forest transition-colors">
              <h3 className="font-serif text-base sm:text-lg font-bold text-charcoal leading-snug line-clamp-2">
                {product.name}
              </h3>
            </Link>

            <p className="text-xs text-charcoal-muted line-clamp-2 mt-1.5 leading-relaxed">
              {product.shortDescription || product.subtitle}
            </p>
          </div>

          {/* Pricing & Size Summary */}
          <div className="pt-4 mt-3 border-t border-borderLight flex items-end justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-charcoal-muted block">
                {activeVariants.length > 1 ? `${t.fromPrice}` : 'Price'}
              </span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-base sm:text-lg font-bold text-forest">
                  {formatMYR(minPrice)}
                </span>
                {hasSavings && (
                  <span className="text-xs text-charcoal-muted line-through">
                    {formatMYR(maxCompareAt)}
                  </span>
                )}
              </div>
            </div>

            <Link
              href={`/products/${product.slug}`}
              className="text-xs font-bold text-forest hover:text-gold-dark flex items-center space-x-0.5 underline transition-colors"
            >
              <span>{t.viewDetails}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  )
}
