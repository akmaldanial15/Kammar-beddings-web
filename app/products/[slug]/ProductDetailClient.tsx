'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
  Heart,
  Scale,
  ShoppingBag,
  Zap,
  ShieldCheck,
  RotateCcw,
  Truck,
  Check,
  Star,
  ChevronRight,
  MessageCircle,
  Layers,
  HelpCircle,
  Clock,
  Sparkles,
  Maximize2,
  X,
} from 'lucide-react'
import { Product, ProductVariant, Review } from '@/types'
import { formatMYR } from '@/lib/utils/format'
import { useCart } from '@/lib/context/CartContext'
import { useWishlist } from '@/lib/context/WishlistContext'
import { useCompare } from '@/lib/context/CompareContext'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { ProductCard } from '@/components/product/ProductCard'

interface ProductDetailClientProps {
  product: Product
  initialReviews: Review[]
  matchingAccessories: Product[]
  relatedProducts: Product[]
}

export function ProductDetailClient({
  product,
  initialReviews,
  matchingAccessories,
  relatedProducts,
}: ProductDetailClientProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { addItem } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { isComparing, addToCompare, removeFromCompare } = useCompare()

  const activeVariants = product.variants.filter((v) => v.isActive)
  const variantParam = searchParams.get('variant')

  // Find initial variant from URL or default to first (prefer Queen if available)
  const defaultVar =
    activeVariants.find((v) => v.id === variantParam || v.sku === variantParam) ||
    activeVariants.find((v) => v.sizeName === 'Queen') ||
    activeVariants[0] ||
    product.variants[0]

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(defaultVar)
  const [quantity, setQuantity] = useState(1)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<'overview' | 'layers' | 'specs' | 'sizeguide' | 'delivery' | 'reviews' | 'faq'>('overview')
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  // Review submission state
  const [reviewsList, setReviewsList] = useState<Review[]>(initialReviews)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [revRating, setRevRating] = useState(5)
  const [revName, setRevName] = useState('')
  const [revTitle, setRevTitle] = useState('')
  const [revContent, setRevContent] = useState('')
  const [revSubmitted, setRevSubmitted] = useState(false)

  // Sync selected variant with URL
  const handleSelectVariant = (variant: ProductVariant) => {
    setSelectedVariant(variant)
    const params = new URLSearchParams(searchParams.toString())
    params.set('variant', variant.id)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const inWishlist = isInWishlist(product.id)
  const comparing = isComparing(product.id)

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
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/checkout')
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!revName || !revContent) return

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          customerName: revName,
          rating: revRating,
          title: revTitle,
          content: revContent,
          isVerifiedPurchase: true,
        }),
      })

      if (res.ok) {
        const newRev = await res.json()
        setReviewsList([newRev, ...reviewsList])
        setRevSubmitted(true)
        setShowReviewForm(false)
      }
    } catch (err) {
      console.error('Review submit error:', err)
    }
  }

  const hasCompareAt =
    selectedVariant.compareAtPriceSen &&
    selectedVariant.compareAtPriceSen > selectedVariant.priceSen
  const savingsSen = hasCompareAt
    ? selectedVariant.compareAtPriceSen! - selectedVariant.priceSen
    : 0

  const whatsappMessage = encodeURIComponent(
    `Hello LENA SLEEP! I am interested in the ${product.name} (${selectedVariant.sizeName}, ${formatMYR(selectedVariant.priceSen)}). Is this available for delivery in Peninsular Malaysia?`
  )

  return (
    <div className="bg-warmwhite py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs text-charcoal-muted mb-6 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-forest">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <Link href="/collections/mattress" className="hover:text-forest">Mattresses</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-charcoal font-semibold truncate">{product.name}</span>
        </nav>

        {/* 2-Column Main Section: Gallery & Purchase Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Image Box */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-cream border border-borderLight shadow-card group">
              <Image
                src={product.images[activeImageIndex]?.imageUrl || product.images[0]?.imageUrl || ''}
                alt={product.images[activeImageIndex]?.altText || product.name}
                fill
                priority
                className="object-cover"
              />

              {/* Lightbox Zoom Trigger */}
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-4 right-4 p-2.5 rounded-lg bg-warmwhite/80 backdrop-blur-md text-charcoal hover:bg-warmwhite shadow-subtle transition-all"
                aria-label="Enlarge image"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                <span className="px-3 py-1 bg-forest text-warmwhite text-xs font-bold uppercase tracking-wider rounded shadow-sm">
                  {product.material}
                </span>
                {hasCompareAt && (
                  <span className="px-3 py-1 bg-sale text-warmwhite text-xs font-bold uppercase tracking-wider rounded shadow-sm">
                    Save {formatMYR(savingsSen)}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails Row */}
            {product.images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-forest shadow-md'
                        : 'border-borderLight opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img.imageUrl} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Purchasing Info */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark block">
                {product.material} &bull; {product.warrantyYears}-Year Warranty
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest mt-1 leading-snug">
                {product.name}
              </h1>

              {/* Rating summary */}
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <span className="text-xs font-bold text-charcoal">5.0</span>
                <span className="text-xs text-charcoal-muted">
                  ({reviewsList.length} verified reviews)
                </span>
              </div>
            </div>

            {/* Live Pricing Breakdown */}
            <div className="p-4 bg-cream rounded-xl border border-borderLight space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-charcoal-muted block">
                Selected Size Price:
              </span>
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl sm:text-4xl font-bold text-forest">
                  {formatMYR(selectedVariant.priceSen)}
                </span>
                {hasCompareAt && (
                  <span className="text-base text-charcoal-muted line-through">
                    {formatMYR(selectedVariant.compareAtPriceSen)}
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-800 font-semibold pt-1 flex items-center space-x-1">
                <Truck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Complimentary White-Glove Peninsular Delivery & Room Setup</span>
              </p>
            </div>

            {/* Mattress Core Attributes Quick-Strip */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-cream-light rounded-xl border border-borderLight text-center text-xs">
              <div>
                <span className="text-[10px] text-charcoal-muted uppercase block">Firmness</span>
                <span className="font-bold text-forest">{product.firmness || 'Medium'} ({product.firmnessScale}/10)</span>
              </div>
              <div className="border-x border-borderLight">
                <span className="text-[10px] text-charcoal-muted uppercase block">Height</span>
                <span className="font-bold text-forest">{product.thicknessCm} cm</span>
              </div>
              <div>
                <span className="text-[10px] text-charcoal-muted uppercase block">Trial</span>
                <span className="font-bold text-forest">{product.trialNights} Nights</span>
              </div>
            </div>

            {/* Variant Size Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-charcoal">
                <span>{t.selectSize}:</span>
                <span className="text-gold-dark font-normal">{selectedVariant.dimensions}</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {activeVariants.map((v) => {
                  const isSelected = selectedVariant.id === v.id
                  return (
                    <button
                      key={v.id}
                      onClick={() => handleSelectVariant(v)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-forest text-warmwhite border-forest shadow-md'
                          : 'bg-warmwhite text-charcoal border-borderLight hover:border-gold'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs">{v.sizeName}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-gold" />}
                      </div>
                      <span className="block text-[11px] opacity-90 mt-0.5">
                        {formatMYR(v.priceSen)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Stock status & Lead time */}
            <div className="text-xs flex items-center space-x-2 text-charcoal-muted">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {selectedVariant.stockQuantity > 5
                  ? `In Stock & Ready for Delivery (SKU: ${selectedVariant.sku})`
                  : `Low Stock: Only ${selectedVariant.stockQuantity} remaining`}
              </span>
              <span>&bull;</span>
              <span>Est. {selectedVariant.leadTimeDays}-5 working days</span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold text-charcoal">{t.quantity}:</span>
              <div className="flex items-center border border-borderLight rounded-lg bg-cream-light">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-sm text-charcoal hover:bg-cream rounded-l"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold text-charcoal">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(selectedVariant.stockQuantity, quantity + 1))}
                  className="px-3 py-1.5 text-sm text-charcoal hover:bg-cream rounded-r"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions: Add to Cart & Buy Now */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={selectedVariant.stockQuantity <= 0}
                  className="w-full py-3.5 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold uppercase tracking-wider rounded-lg shadow-card flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4 text-gold" />
                  <span>{t.addToCart}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={selectedVariant.stockQuantity <= 0}
                  className="w-full py-3.5 bg-gold hover:bg-gold-light text-forest-dark text-xs font-bold uppercase tracking-wider rounded-lg shadow-card flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 text-forest-dark" />
                  <span>{t.buyNow}</span>
                </button>
              </div>

              {/* Auxiliary buttons: Wishlist, Compare, WhatsApp */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`py-2 px-2 rounded-lg border text-center flex items-center justify-center space-x-1 transition-colors ${
                    inWishlist
                      ? 'border-sale bg-sale/10 text-sale font-semibold'
                      : 'border-borderLight hover:bg-cream text-charcoal'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-sale text-sale' : ''}`} />
                  <span>{inWishlist ? 'Saved' : 'Wishlist'}</span>
                </button>

                <button
                  onClick={() => {
                    if (comparing) removeFromCompare(product.id)
                    else addToCompare(product)
                  }}
                  className={`py-2 px-2 rounded-lg border text-center flex items-center justify-center space-x-1 transition-colors ${
                    comparing
                      ? 'border-gold bg-gold/10 text-forest font-semibold'
                      : 'border-borderLight hover:bg-cream text-charcoal'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>{comparing ? 'Comparing' : 'Compare'}</span>
                </button>

                <a
                  href={`https://wa.me/60123456789?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-2 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 flex items-center justify-center space-x-1 font-semibold transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Reassurance points */}
            <div className="pt-4 border-t border-borderLight space-y-2 text-xs text-charcoal-muted">
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-4 h-4 text-gold-dark flex-shrink-0" />
                <span>100-Night Sleep Trial with Free Home Pickup</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-gold-dark flex-shrink-0" />
                <span>{product.warrantyYears}-Year Manufacturer Core Sagging Guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-gold-dark flex-shrink-0" />
                <span>100% Certified Eco-Friendly Malaysian Organic Latex</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs Section */}
        <div className="pt-8 border-t border-borderLight">
          {/* Tab Navigation */}
          <div className="flex items-center space-x-2 sm:space-x-4 border-b border-borderLight overflow-x-auto pb-px">
            {[
              { id: 'overview', label: t.overviewTab },
              { id: 'layers', label: t.layersTab },
              { id: 'specs', label: t.specsTab },
              { id: 'sizeguide', label: t.sizeGuideTab },
              { id: 'delivery', label: t.deliveryTab },
              { id: 'reviews', label: `${t.reviewsTab} (${reviewsList.length})` },
              { id: 'faq', label: t.faqTab },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-forest text-forest font-bold'
                    : 'border-transparent text-charcoal-muted hover:text-charcoal'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          <div className="py-8">
            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="max-w-4xl space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-forest mb-3">
                    Crafted for Pure, Restorative Sleep
                  </h3>
                  <p className="text-sm text-charcoal-muted leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gold-dark mb-3">
                    Key Features & Advantages
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-charcoal">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-start space-x-2 p-2.5 bg-cream-light rounded-lg border border-borderLight">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Layer Anatomy */}
            {activeTab === 'layers' && (
              <div className="max-w-4xl space-y-4">
                <h3 className="font-serif text-2xl font-bold text-forest mb-4">
                  Multi-Tiered Ergonomic Anatomy
                </h3>
                {product.layers.map((layer) => (
                  <div key={layer.number} className="p-4 bg-cream rounded-xl border border-borderLight flex items-start space-x-4">
                    <span className="w-8 h-8 rounded-full bg-forest text-warmwhite font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {layer.number}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-charcoal">{layer.name}</h4>
                      <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                        {layer.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Specs Table */}
            {activeTab === 'specs' && (
              <div className="max-w-3xl">
                <h3 className="font-serif text-2xl font-bold text-forest mb-4">
                  Product Technical Specifications
                </h3>
                <div className="divide-y divide-borderLight border border-borderLight rounded-xl overflow-hidden">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex text-xs py-3 px-4 odd:bg-cream-light even:bg-warmwhite">
                      <span className="w-1/3 font-bold text-charcoal">{key}</span>
                      <span className="w-2/3 text-charcoal-muted">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Size Guide Table */}
            {activeTab === 'sizeguide' && (
              <div className="max-w-3xl">
                <h3 className="font-serif text-2xl font-bold text-forest mb-3">
                  Malaysian Mattress Dimensions Guide
                </h3>
                <p className="text-xs text-charcoal-muted mb-4">
                  Standard Malaysian bedding dimensions. Please measure your bedframe inner dimensions before purchasing.
                </p>
                <div className="border border-borderLight rounded-xl overflow-hidden text-xs">
                  <div className="grid grid-cols-3 bg-cream p-3 font-bold text-forest border-b border-borderLight">
                    <span>Size Name</span>
                    <span>Dimensions (Width x Length)</span>
                    <span>Best Suited For</span>
                  </div>
                  <div className="grid grid-cols-3 p-3 border-b border-borderLight">
                    <span className="font-semibold">Single</span>
                    <span>91 cm x 190 cm (3ft x 6ft 3in)</span>
                    <span className="text-charcoal-muted">Children, teens, compact guest rooms</span>
                  </div>
                  <div className="grid grid-cols-3 p-3 border-b border-borderLight bg-cream-light">
                    <span className="font-semibold">Super Single</span>
                    <span>107 cm x 190 cm (3ft 6in x 6ft 3in)</span>
                    <span className="text-charcoal-muted">Single adults needing extra turning space</span>
                  </div>
                  <div className="grid grid-cols-3 p-3 border-b border-borderLight">
                    <span className="font-semibold">Queen (Most Popular)</span>
                    <span>152 cm x 190 cm (5ft x 6ft 3in)</span>
                    <span className="text-charcoal-muted">Couples, master bedrooms, comfortable sharing</span>
                  </div>
                  <div className="grid grid-cols-3 p-3 bg-cream-light">
                    <span className="font-semibold">King</span>
                    <span>183 cm x 190 cm (6ft x 6ft 3in)</span>
                    <span className="text-charcoal-muted">Spacious master suites, family co-sleeping</span>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Terms */}
            {activeTab === 'delivery' && (
              <div className="max-w-3xl space-y-4 text-xs text-charcoal-muted leading-relaxed">
                <h3 className="font-serif text-2xl font-bold text-forest mb-2">
                  White-Glove Delivery & Installation
                </h3>
                <p>
                  <strong>Peninsular Malaysia:</strong> Enjoy complimentary 2-person white-glove delivery on all mattresses. Our logistics specialists carry the mattress directly to your bedroom, unbox it, set it onto your bedframe, and remove all protective plastic wrap upon request.
                </p>
                <p>
                  <strong>East Malaysia (Sabah & Sarawak):</strong> Sea freight logistics are quoted transparently at RM280.00 per bulky mattress. Delivery lead times range from 10 to 14 working days.
                </p>
                <p>
                  <strong>High-Rise Premises:</strong> Delivery to premises with lift access is 100% free of charge. For walk-up apartments without elevator access, our delivery concierge assists up to the 3rd floor at no additional charge.
                </p>
              </div>
            )}

            {/* Reviews */}
            {activeTab === 'reviews' && (
              <div className="max-w-4xl space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl font-bold text-forest">
                    Customer Sleep Experiences ({reviewsList.length})
                  </h3>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-4 py-2 bg-forest text-warmwhite text-xs font-semibold rounded-lg hover:bg-forest-dark transition-colors"
                  >
                    Write a Review
                  </button>
                </div>

                {/* Submit Review Form */}
                {showReviewForm && (
                  <form onSubmit={handleReviewSubmit} className="p-5 bg-cream rounded-xl border border-borderLight space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-forest">
                      Submit Your Verified Review
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-charcoal font-medium">Rating:</span>
                      <div className="flex text-gold">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRevRating(star)}
                            className="p-1"
                          >
                            <Star className={`w-4 h-4 ${star <= revRating ? 'fill-gold' : 'text-borderLight'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Your Name (e.g. Rachel Lim, Bangsar)"
                        value={revName}
                        onChange={(e) => setRevName(e.target.value)}
                        className="px-3 py-2 text-xs bg-warmwhite border border-borderLight rounded outline-none focus:border-gold"
                      />
                      <input
                        type="text"
                        placeholder="Review Title (e.g. Solved my morning backache)"
                        value={revTitle}
                        onChange={(e) => setRevTitle(e.target.value)}
                        className="px-3 py-2 text-xs bg-warmwhite border border-borderLight rounded outline-none focus:border-gold"
                      />
                    </div>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share your experience sleeping on this mattress..."
                      value={revContent}
                      onChange={(e) => setRevContent(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-warmwhite border border-borderLight rounded outline-none focus:border-gold resize-none"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2 bg-forest text-warmwhite text-xs font-bold uppercase tracking-wider rounded hover:bg-forest-dark transition-colors"
                    >
                      Publish Review
                    </button>
                  </form>
                )}

                {/* Review Cards */}
                <div className="space-y-4">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="p-4 bg-cream-light rounded-xl border border-borderLight space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-charcoal">{rev.customerName}</span>
                          {rev.isVerifiedPurchase && (
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="flex text-gold">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-gold' : 'text-borderLight'}`} />
                          ))}
                        </div>
                      </div>
                      {rev.title && <h5 className="font-serif text-sm font-bold text-forest">&ldquo;{rev.title}&rdquo;</h5>}
                      <p className="text-xs text-charcoal-muted leading-relaxed">{rev.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {activeTab === 'faq' && (
              <div className="max-w-3xl space-y-3">
                <h3 className="font-serif text-2xl font-bold text-forest mb-4">
                  Frequently Asked Questions
                </h3>
                {product.faq.map((item, idx) => (
                  <div key={idx} className="p-4 bg-cream rounded-xl border border-borderLight space-y-1.5">
                    <h4 className="text-xs font-bold text-charcoal flex items-center space-x-2">
                      <HelpCircle className="w-4 h-4 text-gold-dark flex-shrink-0" />
                      <span>{item.question}</span>
                    </h4>
                    <p className="text-xs text-charcoal-muted pl-6 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Matching Accessories Suite */}
        {matchingAccessories.length > 0 && (
          <div className="mt-16 pt-12 border-t border-borderLight">
            <div className="mb-6">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
                {t.matchingAccessories}
              </h3>
              <p className="text-xs text-charcoal-muted mt-1">
                Specially tailored to match your {selectedVariant.sizeName} mattress.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {matchingAccessories.map((acc) => (
                <ProductCard key={acc.id} product={acc} />
              ))}
            </div>
          </div>
        )}

        {/* Related Mattresses */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-borderLight">
            <div className="mb-6">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
                Related Handcrafted Mattresses
              </h3>
              <p className="text-xs text-charcoal-muted mt-1">
                Explore alternative firmness and hybrid comfort configurations.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Sticky Purchase Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-warmwhite border-t border-borderLight shadow-2xl p-3 px-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-charcoal-muted uppercase block">
            {selectedVariant.sizeName}
          </span>
          <span className="text-base font-bold text-forest">
            {formatMYR(selectedVariant.priceSen)}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          className="px-6 py-2.5 bg-forest text-warmwhite text-xs font-bold uppercase tracking-wider rounded-lg shadow-card flex items-center space-x-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-gold" />
          <span>{t.addToCart}</span>
        </button>
      </div>

      {/* Lightbox Zoom Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/90 flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 text-warmwhite hover:text-gold"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-4xl aspect-[16/10] rounded-xl overflow-hidden">
            <Image
              src={product.images[activeImageIndex]?.imageUrl || ''}
              alt=""
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
