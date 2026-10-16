'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, X, ArrowRight, Sparkles } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { Product } from '@/types'
import { formatMYR } from '@/lib/utils/format'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      // Crucial for mobile: Keep results mounted while the 300ms slide-up animation runs
      // so the tapped <Link> is never destroyed mid-tap!
      const timer = setTimeout(() => {
        setQuery('')
        setResults([])
      }, 350)
      return () => clearTimeout(timer)
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Debounced search query
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const data = await res.json()
          setResults(data.products || [])
        }
      } catch (err) {
        console.error('Search error:', err)
      } finally {
        setIsLoading(false)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [query])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleSelectQuick = (tag: string) => {
    setQuery(tag)
    inputRef.current?.focus()
  }

  const handleNavigateToProduct = (e: React.MouseEvent, slug: string) => {
    e.preventDefault()
    // Explicitly blur on phone to close mobile keyboard cleanly
    inputRef.current?.blur()
    // Navigate via router immediately
    router.push(`/products/${slug}`)
    // Trigger modal close
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      inputRef.current?.blur()
      router.push(`/collections/mattress?search=${encodeURIComponent(query.trim())}`)
      onClose()
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col ${
        isOpen
          ? 'pointer-events-auto visible'
          : 'pointer-events-none invisible delay-300'
      }`}
    >
      <div
        className={`fixed inset-0 bg-charcoal/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <div
        className={`w-full bg-warmwhite border-b border-borderLight shadow-2xl py-6 px-4 md:px-8 z-10 transform transition-transform duration-300 ease-out will-change-transform ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between pb-4 border-b border-borderLight">
            <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>KAMAAR Beddings Catalog Search</span>
            </span>
            <button
              onClick={onClose}
              className="text-charcoal-muted hover:text-charcoal p-1.5 rounded-full hover:bg-cream active:bg-cream-dark transition-colors touch-manipulation cursor-pointer"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="relative mt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gold-dark pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              className="w-full pl-14 pr-12 py-3.5 text-base sm:text-lg md:text-xl bg-cream-light rounded-xl border border-borderLight focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-charcoal placeholder-charcoal-muted/60 transition-all touch-manipulation"
            />
            {query && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal p-1 rounded-full touch-manipulation"
                aria-label="Clear query"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </form>

          {/* Quick tags */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-charcoal-muted">Cadangan Carian:</span>
            {['Tilam Toto Queen', 'Tilam Kekabu Asli', 'Tilam Lipat 3 Berzip', 'Bantal Gebu', 'Tilam Asrama 3 Kaki', 'Selimut Patchwork'].map((tag) => (
              <button
                key={tag}
                type="button"
                onMouseDown={(e) => {
                  // Prevent search input from blurring and collapsing virtual keyboard
                  e.preventDefault()
                }}
                onClick={() => handleSelectQuick(tag)}
                className="text-xs px-3 py-1.5 bg-cream hover:bg-cream-dark active:scale-95 text-charcoal border border-borderLight rounded-full transition-all touch-manipulation cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Results Area */}
          <div className="mt-6 max-h-[55vh] sm:max-h-[60vh] overflow-y-auto divide-y divide-borderLight overscroll-contain">
            {isLoading && (
              <div className="py-8 text-center text-charcoal-muted text-sm animate-pulse">
                Mencari produk kilang Tunas Sinar Jaya...
              </div>
            )}

            {!isLoading && query && results.length === 0 && (
              <div className="py-10 text-center">
                <p className="text-charcoal font-medium">Tiada produk ditemui untuk &ldquo;{query}&rdquo;</p>
                <p className="text-xs text-charcoal-muted mt-1">Cuba cari mengikut kategori (Toto, Kekabu, Asrama, Bantal, Comforter).</p>
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <div className="py-2 space-y-2.5">
                <div className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Matching Products ({results.length})</span>
                  <span className="text-[11px] font-normal text-gold-dark lowercase hidden sm:inline">tekan untuk lihat</span>
                </div>
                {results.map((product) => {
                  const minPrice = Math.min(...product.variants.map((v) => v.priceSen))
                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      prefetch={true}
                      onMouseDown={(e) => {
                        // Crucial for mobile: prevent search input blur from collapsing the keyboard and shifting layout
                        e.preventDefault()
                      }}
                      onClick={(e) => handleNavigateToProduct(e, product.slug)}
                      className="flex items-center space-x-3.5 p-3 rounded-xl hover:bg-cream active:bg-cream-dark active:scale-[0.99] transition-all group cursor-pointer touch-manipulation border border-transparent hover:border-borderLight"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-cream-dark shadow-2xs">
                        <Image
                          src={product.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=400&q=80'}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-charcoal group-hover:text-forest transition-colors truncate">
                          {product.name}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-charcoal-muted mt-0.5">
                          <span>{product.material}</span>
                          {product.firmness && (
                            <>
                              <span>&bull;</span>
                              <span>{product.firmness}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-bold text-forest">
                          {formatMYR(minPrice)}
                        </div>
                        <span className="text-[10px] text-charcoal-muted block">
                          {product.variants.length} sizes
                        </span>
                      </div>
                    </Link>
                  )
                })}

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleSubmit}
                  className="w-full mt-3 py-3 px-4 bg-cream hover:bg-cream-dark active:bg-borderLight text-forest text-xs font-bold rounded-xl border border-borderLight flex items-center justify-center gap-2 transition-all touch-manipulation cursor-pointer shadow-2xs"
                >
                  <span>Lihat Semua Hasil Untuk &ldquo;{query}&rdquo;</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1" onClick={onClose} />
    </div>
  )
}
