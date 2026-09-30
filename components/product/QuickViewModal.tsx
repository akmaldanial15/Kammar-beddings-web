'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Check, ShieldCheck, RotateCcw, Truck, ShoppingBag, ArrowRight } from 'lucide-react'
import { Product, ProductVariant } from '@/types'
import { formatMYR } from '@/lib/utils/format'
import { useCart } from '@/lib/context/CartContext'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface QuickViewModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { t } = useLanguage()
  const { addItem } = useCart()

  const activeVariants = product.variants.filter((v) => v.isActive)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    activeVariants[0] || product.variants[0]
  )
  const [quantity, setQuantity] = useState(1)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  if (!isOpen) return null

  const handleAddToCart = () => {
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      sizeName: selectedVariant.sizeName,
      sku: selectedVariant.sku,
      dimensions: selectedVariant.dimensions,
      priceSen: selectedVariant.priceSen,
      compareAtPriceSen: selectedVariant.compareAtPriceSen,
      imageUrl: product.images[0]?.imageUrl || '',
      quantity,
      stockAvailable: selectedVariant.stockQuantity,
    })
    onClose()
  }

  const hasCompareAt =
    selectedVariant.compareAtPriceSen &&
    selectedVariant.compareAtPriceSen > selectedVariant.priceSen

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="relative bg-warmwhite rounded-2xl shadow-2xl max-w-3xl w-full border border-borderLight overflow-hidden z-10 flex flex-col md:flex-row max-h-[90vh] animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-charcoal-muted hover:text-charcoal bg-warmwhite/80 rounded-full hover:bg-cream transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Gallery */}
        <div className="md:w-1/2 p-4 sm:p-6 bg-cream-light flex flex-col justify-between">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-cream border border-borderLight">
            <Image
              src={product.images[activeImageIndex]?.imageUrl || product.images[0]?.imageUrl || ''}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex space-x-2 mt-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-14 h-14 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all ${
                    activeImageIndex === idx ? 'border-forest' : 'border-borderLight opacity-70'
                  }`}
                >
                  <Image src={img.imageUrl} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Reassurance mini-tags */}
          <div className="mt-4 pt-3 border-t border-borderLight grid grid-cols-2 gap-2 text-[11px] text-charcoal-muted">
            <div className="flex items-center space-x-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-gold-dark" />
              <span>{product.trialNights}-Night Trial</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-dark" />
              <span>{product.warrantyYears}-Year Warranty</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Truck className="w-3.5 h-3.5 text-gold-dark" />
              <span>Free Peninsular Delivery</span>
            </div>
          </div>
        </div>

        {/* Right: Details & Variant Selection */}
        <div className="md:w-1/2 p-5 sm:p-6 overflow-y-auto flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gold-dark">
              {product.material}
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal mt-1 leading-snug">
              {product.name}
            </h3>

            {/* Price display */}
            <div className="flex items-baseline space-x-2 mt-3">
              <span className="text-2xl font-bold text-forest">
                {formatMYR(selectedVariant.priceSen)}
              </span>
              {hasCompareAt && (
                <span className="text-sm text-charcoal-muted line-through">
                  {formatMYR(selectedVariant.compareAtPriceSen)}
                </span>
              )}
            </div>

            <p className="text-xs text-charcoal-muted mt-2 leading-relaxed line-clamp-3">
              {product.shortDescription || product.description}
            </p>

            {/* Size selection */}
            <div className="mt-4">
              <div className="flex justify-between items-center text-xs font-semibold text-charcoal mb-2">
                <span>{t.selectSize}:</span>
                <span className="text-gold-dark font-normal">{selectedVariant.dimensions}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {activeVariants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border text-left flex justify-between items-center transition-all ${
                      selectedVariant.id === variant.id
                        ? 'border-forest bg-forest text-warmwhite shadow-sm'
                        : 'border-borderLight bg-cream-light text-charcoal hover:border-gold'
                    }`}
                  >
                    <span>{variant.sizeName}</span>
                    <span className="text-[11px] opacity-90">{formatMYR(variant.priceSen)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-4 flex items-center space-x-3">
              <span className="text-xs font-semibold text-charcoal">{t.quantity}:</span>
              <div className="flex items-center border border-borderLight rounded-lg bg-cream-light">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1 text-sm text-charcoal hover:bg-cream rounded-l"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-charcoal">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(selectedVariant.stockQuantity, quantity + 1))}
                  className="px-2.5 py-1 text-sm text-charcoal hover:bg-cream rounded-r"
                >
                  +
                </button>
              </div>
              <span className="text-[11px] text-charcoal-muted">
                {selectedVariant.stockQuantity > 0
                  ? `${selectedVariant.stockQuantity} units available`
                  : 'Out of stock'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-borderLight space-y-2">
            <button
              onClick={handleAddToCart}
              disabled={selectedVariant.stockQuantity <= 0}
              className="w-full py-3 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold uppercase tracking-wider rounded-lg shadow-card flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4 text-gold" />
              <span>{t.addToCart}</span>
            </button>

            <Link
              href={`/products/${product.slug}`}
              onClick={onClose}
              className="w-full py-2.5 text-center text-xs font-semibold text-charcoal hover:text-forest flex items-center justify-center space-x-1"
            >
              <span>{t.viewDetails}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
