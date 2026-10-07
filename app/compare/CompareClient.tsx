'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Scale, X, ShoppingBag, Plus, Trash2, ArrowRight, Check } from 'lucide-react'
import { Product, ProductVariant } from '@/types'
import { formatMYR } from '@/lib/utils/format'
import { useCompare } from '@/lib/context/CompareContext'
import { useCart } from '@/lib/context/CartContext'

interface CompareClientProps {
  allProducts: Product[]
}

export function CompareClient({ allProducts }: CompareClientProps) {
  const { compareProducts, removeFromCompare, clearCompare, addToCompare } = useCompare()
  const { addItem } = useCart()

  // Track selected size for each compared mattress (defaults to Queen if available)
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({})

  const mattressCatalog = allProducts.filter((p) => p.productType === 'mattress')

  const getVariantForSize = (product: Product, sizeName?: string): ProductVariant => {
    const targetSize = sizeName || selectedSizes[product.id] || 'Queen'
    const match =
      product.variants.find((v) => v.sizeName.toLowerCase() === targetSize.toLowerCase()) ||
      product.variants[0]
    return match
  }

  const handleSizeChange = (productId: string, sizeName: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: sizeName }))
  }

  const handleAddToCart = (product: Product) => {
    const variant = getVariantForSize(product)
    addItem({
      variantId: variant.id,
      productId: product.id,
      productName: product.name,
      sizeName: variant.sizeName,
      sku: variant.sku,
      dimensions: variant.dimensions,
      priceSen: variant.priceSen,
      imageUrl: product.images[0]?.imageUrl || '',
      quantity: 1,
      stockAvailable: variant.stockQuantity,
    })
  }

  return (
    <div className="bg-warmwhite py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-borderLight">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gold-dark flex items-center space-x-1.5 mb-1.5">
              <Scale className="w-3.5 h-3.5 text-gold" />
              <span>Side-by-Side Analysis</span>
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest">
              Bandingkan Pilihan Tilam Kilang
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
              Bandingkan jenis isian (Asian Polyester Fibre / Kekabu Asli / Foam Asrama), ketebalan, saiz dan jaminan mutu kilang.
            </p>
          </div>

          {compareProducts.length > 0 && (
            <button
              onClick={clearCompare}
              className="mt-4 sm:mt-0 text-xs text-sale hover:underline font-semibold flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Comparison Table</span>
            </button>
          )}
        </div>

        {compareProducts.length === 0 ? (
          <div className="text-center py-20 bg-cream rounded-3xl border border-borderLight p-8 max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-full bg-warmwhite flex items-center justify-center text-gold-dark mx-auto mb-4 shadow-subtle">
              <Scale className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-charcoal">
              Your Comparison Table is Empty
            </h2>
            <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
              Select &ldquo;Compare&rdquo; on any mattress card in our collection to view side-by-side materials, heights, and warranties.
            </p>
            <Link
              href="/collections/mattress"
              className="mt-6 inline-flex items-center space-x-2 px-6 py-3 bg-forest text-warmwhite rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-forest-dark transition-colors shadow-card"
            >
              <span>Browse Mattresses</span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-borderLight bg-warmwhite rounded-2xl overflow-hidden shadow-card text-xs">
              <thead>
                <tr className="border-b border-borderLight bg-cream-light">
                  <th className="p-4 w-1/4 font-serif text-base text-forest font-bold">
                    Specification
                  </th>
                  {compareProducts.map((p) => {
                    const variant = getVariantForSize(p)
                    return (
                      <th key={p.id} className="p-4 w-1/4 align-top">
                        <div className="relative">
                          <button
                            onClick={() => removeFromCompare(p.id)}
                            className="absolute -top-1 -right-1 p-1 bg-warmwhite rounded-full border border-borderLight text-charcoal-muted hover:text-sale shadow-sm"
                            title="Remove from comparison"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-cream mb-3 border border-borderLight">
                            <Image
                              src={p.images[0]?.imageUrl || ''}
                              alt={p.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Link href={`/products/${p.slug}`} className="hover:text-forest">
                            <h3 className="font-serif text-base font-bold text-charcoal leading-snug line-clamp-2">
                              {p.name}
                            </h3>
                          </Link>
                          <span className="text-base font-bold text-forest block mt-1">
                            {formatMYR(variant.priceSen)}
                          </span>
                        </div>
                      </th>
                    )
                  })}
                  {/* Empty Slot if less than 3 */}
                  {compareProducts.length < 3 && (
                    <th className="p-4 w-1/4 bg-cream/40 border-l border-borderLight align-middle text-center">
                      <div className="p-6 text-center space-y-2">
                        <Plus className="w-6 h-6 text-gold-dark mx-auto" />
                        <span className="font-bold text-xs text-charcoal-muted block">
                          Add Another Mattress
                        </span>
                        <select
                          onChange={(e) => {
                            const found = mattressCatalog.find((m) => m.id === e.target.value)
                            if (found) addToCompare(found)
                          }}
                          defaultValue=""
                          className="mt-2 w-full p-2 bg-warmwhite border border-borderLight rounded text-xs text-charcoal font-medium"
                        >
                          <option value="" disabled>
                            Select mattress...
                          </option>
                          {mattressCatalog
                            .filter((m) => !compareProducts.some((cp) => cp.id === m.id))
                            .map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-borderLight">
                {/* Select Size Row */}
                <tr className="bg-cream/20">
                  <td className="p-4 font-bold text-charcoal">Selected Size</td>
                  {compareProducts.map((p) => {
                    const activeSizes = p.variants.filter((v) => v.isActive)
                    const currentVar = getVariantForSize(p)
                    return (
                      <td key={p.id} className="p-4">
                        <select
                          value={currentVar.sizeName}
                          onChange={(e) => handleSizeChange(p.id, e.target.value)}
                          className="w-full p-1.5 bg-warmwhite border border-borderLight rounded font-semibold text-charcoal"
                        >
                          {activeSizes.map((v) => (
                            <option key={v.id} value={v.sizeName}>
                              {v.sizeName} ({formatMYR(v.priceSen)})
                            </option>
                          ))}
                        </select>
                      </td>
                    )
                  })}
                  {compareProducts.length < 3 && <td className="bg-cream/40 border-l border-borderLight" />}
                </tr>

                {/* Dimensions */}
                <tr>
                  <td className="p-4 font-bold text-charcoal">Dimensions</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-4 text-charcoal-muted">
                      {getVariantForSize(p).dimensions}
                    </td>
                  ))}
                  {compareProducts.length < 3 && <td className="bg-cream/40 border-l border-borderLight" />}
                </tr>

                {/* Material */}
                <tr className="bg-cream/20">
                  <td className="p-4 font-bold text-charcoal">Core Material</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-4 font-semibold text-gold-dark">
                      {p.material}
                    </td>
                  ))}
                  {compareProducts.length < 3 && <td className="bg-cream/40 border-l border-borderLight" />}
                </tr>

                {/* Firmness */}
                <tr>
                  <td className="p-4 font-bold text-charcoal">Firmness Rating</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-4 text-charcoal font-medium">
                      {p.firmness || 'Medium'} ({p.firmnessScale}/10)
                    </td>
                  ))}
                  {compareProducts.length < 3 && <td className="bg-cream/40 border-l border-borderLight" />}
                </tr>

                {/* Thickness */}
                <tr className="bg-cream/20">
                  <td className="p-4 font-bold text-charcoal">Height / Thickness</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-4 text-charcoal font-semibold">
                      {p.thicknessCm} cm
                    </td>
                  ))}
                  {compareProducts.length < 3 && <td className="bg-cream/40 border-l border-borderLight" />}
                </tr>

                {/* Sleep Trial */}
                <tr>
                  <td className="p-4 font-bold text-charcoal">Sleep Trial Period</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-4 text-charcoal-muted">
                      {p.trialNights} Nights Risk-Free
                    </td>
                  ))}
                  {compareProducts.length < 3 && <td className="bg-cream/40 border-l border-borderLight" />}
                </tr>

                {/* Warranty */}
                <tr className="bg-cream/20">
                  <td className="p-4 font-bold text-charcoal">Warranty Guarantee</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-4 text-charcoal font-semibold">
                      {p.warrantyYears} Years Core Guarantee
                    </td>
                  ))}
                  {compareProducts.length < 3 && <td className="bg-cream/40 border-l border-borderLight" />}
                </tr>

                {/* Lead Time */}
                <tr>
                  <td className="p-4 font-bold text-charcoal">Peninsular Dispatch</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-4 text-charcoal-muted">
                      Est. {getVariantForSize(p).leadTimeDays}-5 working days
                    </td>
                  ))}
                  {compareProducts.length < 3 && <td className="bg-cream/40 border-l border-borderLight" />}
                </tr>

                {/* Action Row: Add to Cart */}
                <tr className="bg-cream/30">
                  <td className="p-4 font-bold text-charcoal">Purchase Choice</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-4">
                      <button
                        onClick={() => handleAddToCart(p)}
                        className="w-full py-2.5 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm flex items-center justify-center space-x-1.5 transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-gold" />
                        <span>Add {getVariantForSize(p).sizeName}</span>
                      </button>
                    </td>
                  ))}
                  {compareProducts.length < 3 && <td className="bg-cream/40 border-l border-borderLight" />}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
