'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Filter, X, ChevronDown, SlidersHorizontal, ArrowUpDown, Sparkles, Check } from 'lucide-react'
import { Product, Category, Collection } from '@/types'
import { ProductCard } from '@/components/product/ProductCard'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface CollectionClientProps {
  products: Product[]
  category?: Category | null
  collection?: Collection | null
  title: string
  description: string
}

export function CollectionClient({
  products,
  category,
  collection,
  title,
  description,
}: CollectionClientProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)

  // Close sort dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Current filter state from URL params
  const currentMaterial = searchParams.get('material') || ''
  const currentSize = searchParams.get('size') || ''
  const currentFirmness = searchParams.get('firmness') || ''
  const currentSort = searchParams.get('sort') || 'recommended'
  const inStockOnly = searchParams.get('inStock') === 'true'

  // Update URL helper
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearAllFilters = () => {
    router.push(pathname)
  }

  // Filter and Sort calculation
  const filteredAndSortedProducts = useMemo(() => {
    let list = [...products]

    // Material filter
    if (currentMaterial) {
      const mat = currentMaterial.toLowerCase()
      list = list.filter((p) => p.material?.toLowerCase().includes(mat))
    }

    // Firmness filter
    if (currentFirmness) {
      const firm = currentFirmness.toLowerCase()
      list = list.filter((p) => p.firmness?.toLowerCase().includes(firm))
    }

    // Size filter
    if (currentSize) {
      const sz = currentSize.toLowerCase()
      list = list.filter((p) =>
        p.variants.some((v) => v.sizeName.toLowerCase().replace(/\s/g, '').includes(sz))
      )
    }

    // In Stock Only
    if (inStockOnly) {
      list = list.filter((p) => p.variants.some((v) => v.isActive && v.stockQuantity > 0))
    }

    // Sorting
    if (currentSort === 'price_asc') {
      list.sort((a, b) => {
        const minA = Math.min(...a.variants.map((v) => v.priceSen))
        const minB = Math.min(...b.variants.map((v) => v.priceSen))
        return minA - minB
      })
    } else if (currentSort === 'price_desc') {
      list.sort((a, b) => {
        const minA = Math.min(...a.variants.map((v) => v.priceSen))
        const minB = Math.min(...b.variants.map((v) => v.priceSen))
        return minB - minA
      })
    } else if (currentSort === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else {
      // Recommended: featured first
      list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    }

    return list
  }, [products, currentMaterial, currentFirmness, currentSize, inStockOnly, currentSort])

  const hasActiveFilters = Boolean(currentMaterial || currentSize || currentFirmness || inStockOnly)

  return (
    <div className="bg-warmwhite py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner & Intro Header */}
        <div className="bg-cream rounded-2xl p-6 sm:p-10 mb-8 sm:mb-12 border border-borderLight shadow-subtle">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gold-dark flex items-center space-x-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>KAMAAR Beddings Collection</span>
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-charcoal-muted mt-3 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Filter Bar & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pb-6 mb-8 border-b border-borderLight gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-cream text-charcoal rounded-lg border border-borderLight text-xs font-semibold"
            >
              <SlidersHorizontal className="w-4 h-4 text-gold-dark" />
              <span>Filters {hasActiveFilters && '(Active)'}</span>
            </button>

            <span className="text-xs text-charcoal-muted font-medium">
              Showing <strong className="text-forest">{filteredAndSortedProducts.length}</strong>{' '}
              {category?.name ? `${category.name.toLowerCase()} found` : t.resultsFound}
            </span>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-sale hover:underline font-semibold flex items-center space-x-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t.clearAll}</span>
              </button>
            )}
          </div>

          {/* Custom Luxury Sort Selector */}
          <div className="relative" ref={sortRef}>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-charcoal-muted font-medium hidden sm:inline">{t.sortBy}:</span>
              <button
                type="button"
                onClick={() => setIsSortOpen((prev) => !prev)}
                className={`flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer shadow-2xs ${
                  isSortOpen
                    ? 'bg-warmwhite border-gold text-forest shadow-md ring-2 ring-gold/20'
                    : 'bg-warmwhite hover:bg-cream-light border-borderLight text-charcoal hover:border-gold/60'
                }`}
                aria-expanded={isSortOpen}
                aria-haspopup="listbox"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-gold-dark" />
                <span className="text-forest font-bold tracking-tight">
                  {currentSort === 'price_asc'
                    ? t.sortPriceAsc
                    : currentSort === 'price_desc'
                    ? t.sortPriceDesc
                    : currentSort === 'newest'
                    ? t.sortNewest
                    : t.sortFeatured}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-charcoal-muted transition-transform duration-300 ${
                    isSortOpen ? 'rotate-180 text-gold-dark' : ''
                  }`}
                />
              </button>
            </div>

            {/* Floating Luxury Menu */}
            {isSortOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-warmwhite rounded-2xl shadow-2xl border border-borderLight p-1.5 z-40 animate-fade-in-down">
                <div className="px-3 py-2 border-b border-borderLight/70 mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark">
                    {t.sortBy}
                  </span>
                  <span className="text-[10px] text-charcoal-muted font-medium">4 options</span>
                </div>
                <div className="space-y-0.5">
                  {[
                    { id: 'recommended', label: t.sortFeatured, desc: 'Curated signature picks' },
                    { id: 'price_asc', label: t.sortPriceAsc, desc: 'Lowest price first' },
                    { id: 'price_desc', label: t.sortPriceDesc, desc: 'Highest luxury first' },
                    { id: 'newest', label: t.sortNewest, desc: 'Latest arrivals & releases' },
                  ].map((opt) => {
                    const isSelected = currentSort === opt.id || (!currentSort && opt.id === 'recommended')
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          updateFilter('sort', opt.id)
                          setIsSortOpen(false)
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-left transition-all flex items-center justify-between group ${
                          isSelected
                            ? 'bg-forest text-warmwhite font-bold shadow-xs'
                            : 'hover:bg-cream text-charcoal hover:text-forest'
                        }`}
                      >
                        <div>
                          <div className={`text-xs ${isSelected ? 'text-warmwhite font-bold' : 'font-semibold'}`}>
                            {opt.label}
                          </div>
                          <div
                            className={`text-[10.5px] mt-0.5 ${
                              isSelected ? 'text-warmwhite/80' : 'text-charcoal-muted group-hover:text-charcoal'
                            }`}
                          >
                            {opt.desc}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-gold/30 flex items-center justify-center shrink-0 ml-2">
                            <Check className="w-3 h-3 text-gold-light stroke-[2.5]" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Layout: Desktop Filter Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6 sticky top-28 p-5 bg-cream-light rounded-xl border border-borderLight">
            <div className="flex items-center justify-between pb-3 border-b border-borderLight">
              <span className="text-xs font-bold uppercase tracking-wider text-forest flex items-center space-x-1.5">
                <Filter className="w-3.5 h-3.5 text-gold-dark" />
                <span>{category?.name ? `Filter ${category.name}` : t.filterBy}</span>
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] text-sale hover:underline font-semibold"
                >
                  {t.clearAll}
                </button>
              )}
            </div>

            {/* Material Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-charcoal uppercase tracking-wider block">
                {t.byMaterial}
              </label>
              <div className="space-y-1.5 text-xs text-charcoal-muted">
                {[
                  { id: '', label: 'Semua Bahan / Isian' },
                  { id: 'polyester', label: 'Asian Polyester Fibre' },
                  { id: 'foam', label: 'High Density Foam' },
                  { id: 'microfibre', label: 'Microfibre & Kapas' },
                  { id: 'quilted', label: 'Quilted Fabrik Sejuk' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => updateFilter('material', item.id)}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors ${
                      currentMaterial === item.id
                        ? 'bg-forest/10 text-forest font-bold ring-1 ring-forest/20'
                        : 'hover:bg-cream hover:text-charcoal'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="space-y-2 pt-4 border-t border-borderLight">
              <label className="text-xs font-bold text-charcoal uppercase tracking-wider block">
                {t.bySize}
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs text-charcoal-muted">
                {[
                  { id: '', label: 'All' },
                  { id: 'single', label: 'Single' },
                  { id: 'supersingle', label: 'Super Single' },
                  { id: 'queen', label: 'Queen' },
                  { id: 'king', label: 'King' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => updateFilter('size', item.id)}
                    className={`py-1.5 px-2 text-center rounded-lg border transition-all ${
                      currentSize === item.id
                        ? 'bg-white text-forest border-gold/60 ring-2 ring-gold/20 font-bold shadow-2xs'
                        : 'bg-warmwhite border-borderLight hover:border-gold'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Firmness Filter */}
            <div className="space-y-2 pt-4 border-t border-borderLight">
              <label className="text-xs font-bold text-charcoal uppercase tracking-wider block">
                {t.byFirmness}
              </label>
              <div className="space-y-1.5 text-xs text-charcoal-muted">
                {[
                  { id: '', label: 'All Comfort Levels' },
                  { id: 'soft', label: 'Plush & Soft (1-3)' },
                  { id: 'medium', label: 'Balanced Medium (4-6)' },
                  { id: 'firm', label: 'Ergonomic Firm (7-10)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => updateFilter('firmness', item.id)}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors ${
                      currentFirmness === item.id
                        ? 'bg-forest/10 text-forest font-bold ring-1 ring-forest/20'
                        : 'hover:bg-cream hover:text-charcoal'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="pt-4 border-t border-borderLight">
              <label className="flex items-center space-x-2 text-xs text-charcoal cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : '')}
                  className="rounded text-forest focus:ring-forest"
                />
                <span className="font-medium">In Stock Only (Ready to Dispatch)</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-20 bg-cream-light rounded-2xl border border-borderLight p-8">
                <h3 className="font-serif text-2xl font-bold text-charcoal">
                  No Mattresses Match Your Filter Selection
                </h3>
                <p className="text-xs text-charcoal-muted mt-2 max-w-md mx-auto">
                  Try clearing some filter criteria such as specific firmness or size to view all available mattresses.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 px-6 py-2.5 bg-forest text-warmwhite rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-forest-dark transition-colors"
                >
                  {t.clearAll}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map((product, idx) => (
                  <div
                    key={product.id}
                    className={`animate-fade-in-up ${
                      idx % 6 === 0 ? 'delay-50' : idx % 6 === 1 ? 'delay-100' : idx % 6 === 2 ? 'delay-150' : idx % 6 === 3 ? 'delay-200' : idx % 6 === 4 ? 'delay-250' : 'delay-300'
                    }`}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-warmwhite shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto animate-slide-in-right">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-borderLight">
                <h3 className="font-serif text-xl font-bold text-forest">
                  {category?.name ? `Filter ${category.name}` : t.filterBy}
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-charcoal-muted hover:text-charcoal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Material */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal mb-2">
                  {t.byMaterial}
                </h4>
                <div className="space-y-1 text-xs text-charcoal-muted">
                  {[
                    { id: '', label: 'Semua Bahan' },
                    { id: 'polyester', label: 'Asian Polyester Fibre' },
                    { id: 'foam', label: 'High Density Foam' },
                    { id: 'microfibre', label: 'Microfibre & Kapas' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => updateFilter('material', m.id)}
                      className={`block w-full text-left py-1.5 px-2.5 rounded-lg ${
                        currentMaterial === m.id ? 'bg-forest/10 text-forest font-bold ring-1 ring-forest/20' : ''
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal mb-2">
                  {t.bySize}
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['single', 'supersingle', 'queen', 'king'].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => updateFilter('size', sz)}
                      className={`py-1.5 px-2 rounded-lg border text-center capitalize transition-all ${
                        currentSize === sz
                          ? 'bg-white text-forest border-gold/60 ring-2 ring-gold/20 font-bold shadow-2xs'
                          : 'bg-cream-light border-borderLight'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Firmness */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal mb-2">
                  {t.byFirmness}
                </h4>
                <div className="space-y-1 text-xs">
                  {[
                    { id: 'soft', label: 'Soft (1-3)' },
                    { id: 'medium', label: 'Medium (4-6)' },
                    { id: 'firm', label: 'Firm (7-10)' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => updateFilter('firmness', f.id)}
                      className={`block w-full text-left py-1.5 px-2.5 rounded-lg ${
                        currentFirmness === f.id ? 'bg-forest/10 text-forest font-bold ring-1 ring-forest/20' : ''
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-borderLight flex space-x-3">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-3 bg-cream text-charcoal rounded-lg text-xs font-bold uppercase tracking-wider"
              >
                {t.clearAll}
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 bg-forest text-warmwhite rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
