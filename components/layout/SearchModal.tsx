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
      setQuery('')
      setResults([])
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

  if (!isOpen) return null

  const handleSelectQuick = (tag: string) => {
    setQuery(tag)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/collections/mattress?search=${encodeURIComponent(query.trim())}`)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-charcoal/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full bg-warmwhite border-b border-borderLight shadow-2xl py-6 px-4 md:px-8 transition-all animate-fade-in-down"
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
              className="text-charcoal-muted hover:text-charcoal p-1 rounded-full hover:bg-cream transition-colors"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="relative mt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gold-dark" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-14 pr-12 py-3.5 text-lg md:text-xl bg-cream-light rounded-lg border border-borderLight focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-charcoal placeholder-charcoal-muted/60 transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal"
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
                onClick={() => handleSelectQuick(tag)}
                className="text-xs px-2.5 py-1 bg-cream hover:bg-cream-dark text-charcoal border border-borderLight rounded-full transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Results Area */}
          <div className="mt-6 max-h-[60vh] overflow-y-auto divide-y divide-borderLight">
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
              <div className="py-2 space-y-3">
                <div className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-2">
                  Matching Products ({results.length})
                </div>
                {results.map((product) => {
                  const minPrice = Math.min(...product.variants.map((v) => v.priceSen))
                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center space-x-4 p-2.5 rounded-lg hover:bg-cream transition-colors group"
                    >
                      <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-cream-dark">
                        <Image
                          src={product.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=400&q=80'}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-charcoal group-hover:text-forest transition-colors truncate">
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
                        <span className="text-[10px] text-charcoal-muted">
                          {product.variants.length} sizes
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1" onClick={onClose} />
    </div>
  )
}
