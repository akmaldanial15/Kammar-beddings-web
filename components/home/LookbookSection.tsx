'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, ArrowRight, X, Plus } from 'lucide-react'
import { formatMYR } from '@/lib/utils/format'

interface Hotspot {
  id: string
  number: number
  name: string
  category: string
  priceSen: number
  link: string
  imageUrl: string
  topPercent: number
  leftPercent: number
}

const hotspots: Hotspot[] = [
  {
    id: 'hs-1',
    number: 1,
    name: 'Lena Royal Heritage 100% Natural Latex',
    category: 'Flagship Latex Mattress',
    priceSen: 289900,
    link: '/products/lena-royal-heritage-latex-mattress',
    imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=400&q=80',
    topPercent: 54,
    leftPercent: 44,
  },
  {
    id: 'hs-2',
    number: 2,
    name: 'Lena Ergonomic Cervical Contour Latex Pillow',
    category: 'Natural Latex Pillow',
    priceSen: 26900,
    link: '/products/lena-ergonomic-contour-natural-latex-pillow',
    imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=400&q=80',
    topPercent: 38,
    leftPercent: 30,
  },
  {
    id: 'hs-3',
    number: 3,
    name: 'Lena 1000TC Organic Bamboo Sheet Set',
    category: 'Luxury Sateen Linen',
    priceSen: 38900,
    link: '/products/lena-1000tc-organic-bamboo-sheet-set',
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80',
    topPercent: 68,
    leftPercent: 62,
  },
  {
    id: 'hs-4',
    number: 4,
    name: 'Lena Grand Tufted Upholstered Bedframe',
    category: 'Solid Hardwood Frame',
    priceSen: 269900,
    link: '/products/lena-grand-tufted-upholstered-bedframe',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80',
    topPercent: 28,
    leftPercent: 65,
  },
]

export function LookbookSection() {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(hotspots[0])

  return (
    <section className="py-16 sm:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gold-dark flex items-center justify-center space-x-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Interactive Bedroom Suite</span>
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest">
            Shoppable Sanctuary
          </h2>
          <p className="text-sm sm:text-base text-charcoal-muted mt-2">
            Click any pin to inspect the artisanal mattress, contour pillows, and organic bedding styled in this master bedroom.
          </p>
        </div>

        {/* Lookbook Bedroom Scene Container */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-borderLight aspect-[16/10] sm:aspect-[16/9] w-full bg-forest-dark">
          <Image
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1800&q=85"
            alt="Shoppable KAMAAR Beddings Master Bedroom Suite"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/20" />

          {/* Interactive Hotspot Pins */}
          {hotspots.map((hs) => (
            <div
              key={hs.id}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
              style={{ top: `${hs.topPercent}%`, left: `${hs.leftPercent}%` }}
            >
              <button
                onClick={() => setActiveHotspot(hs)}
                className={`hotspot-pin w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shadow-xl transition-transform hover:scale-110 ${
                  activeHotspot?.id === hs.id
                    ? 'bg-forest text-warmwhite ring-4 ring-gold'
                    : 'bg-warmwhite/95 text-forest hover:bg-gold hover:text-warmwhite'
                }`}
                aria-label={`View ${hs.name}`}
              >
                {hs.number}
              </button>
            </div>
          ))}

          {/* Active Hotspot Desktop Popover */}
          {activeHotspot && (
            <div className="hidden md:flex absolute bottom-6 right-6 z-30 max-w-sm bg-warmwhite/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-borderLight animate-fadeIn">
              <div className="flex space-x-3.5 items-center">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-cream border border-borderLight">
                  <Image
                    src={activeHotspot.imageUrl}
                    alt={activeHotspot.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark">
                      Pin #{activeHotspot.number} &bull; {activeHotspot.category}
                    </span>
                    <button
                      onClick={() => setActiveHotspot(null)}
                      className="text-charcoal-muted hover:text-charcoal p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="text-xs font-bold text-charcoal leading-snug line-clamp-2 mt-0.5">
                    {activeHotspot.name}
                  </h4>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-borderLight">
                    <span className="text-sm font-bold text-forest">
                      {formatMYR(activeHotspot.priceSen)}
                    </span>
                    <Link
                      href={activeHotspot.link}
                      className="text-xs font-semibold text-gold-dark hover:text-forest flex items-center space-x-1 underline"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Tagged Products List */}
        <div className="mt-8 md:hidden">
          <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-3">
            Products Featured in this Suite ({hotspots.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {hotspots.map((hs) => (
              <Link
                key={hs.id}
                href={hs.link}
                className="flex items-center space-x-3 p-3 bg-warmwhite rounded-xl border border-borderLight shadow-subtle"
              >
                <div className="w-6 h-6 rounded-full bg-forest text-warmwhite font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {hs.number}
                </div>
                <div className="relative w-14 h-14 rounded-md overflow-hidden bg-cream flex-shrink-0">
                  <Image src={hs.imageUrl} alt={hs.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-charcoal truncate">{hs.name}</h5>
                  <span className="text-xs font-bold text-forest block mt-0.5">
                    {formatMYR(hs.priceSen)}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-gold-dark flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
