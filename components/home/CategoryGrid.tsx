'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function CategoryGrid() {
  const { t } = useLanguage()

  const mattressTypes = [
    {
      title: '100% Pure Natural Latex',
      subtitle: 'Zero synthetic foam, zero springs. Pure Malaysian natural latex for buoyant, hypoallergenic sleep.',
      tag: 'Flagship Collection',
      link: '/collections/mattress?material=latex',
      imageUrl: 'https://images.unsplash.com/photo-1582582621959-48d27397dc69?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Cool Night Hybrid Pocket Spring',
      subtitle: 'Sub-zero Japanese Ice-Silk fabric with aerated latex & 7-zone pocket springs for active heat dissipation.',
      tag: 'Tropical Cooling',
      link: '/collections/mattress?material=hybrid',
      imageUrl: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Orthopaedic Spinal Alignment',
      subtitle: 'Physiotherapist-approved high-density posture foundation preventing lumbar sag and morning back pain.',
      tag: 'Back Health',
      link: '/collections/mattress?material=ortho',
      imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Sovereign Presidential Suite',
      subtitle: 'Bespoke 34cm dual pocket spring architecture with hand-tufted Belgian silk and Talalay latex pillowtop.',
      tag: '5-Star Luxury',
      link: '/collections/mattress?material=hotel',
      imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
    },
  ]

  const supportingCategories = [
    {
      name: 'Contour Latex Pillows',
      description: 'Cervical spinal support',
      link: '/collections/pillows',
      imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Mattress Toppers',
      description: '5cm & 7.5cm natural latex slabs',
      link: '/collections/toppers-protectors',
      imageUrl: '/images/products/topper-latex-5cm.jpg',
    },
    {
      name: 'Hardwood Bedframes',
      description: 'Kiln-dried solid tropical wood',
      link: '/collections/bedframes',
      imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: '1000TC Bamboo Bedding',
      description: 'Silky breathable sheet sets',
      link: '/collections/bedding',
      imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
    },
  ]

  return (
    <section className="py-16 sm:py-24 bg-warmwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gold-dark flex items-center justify-center space-x-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Curated Sleep Technologies</span>
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest">
            {t.shopByTypeTitle}
          </h2>
          <p className="text-sm sm:text-base text-charcoal-muted mt-3 leading-relaxed">
            {t.shopByTypeSubtitle}
          </p>
        </div>

        {/* 4 Main Mattress Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {mattressTypes.map((type, idx) => (
            <Link
              key={idx}
              href={type.link}
              className={`group relative h-[320px] sm:h-[380px] rounded-2xl overflow-hidden shadow-card border border-borderLight flex flex-col justify-end p-6 sm:p-8 luxury-card-hover animate-fade-in-up ${
                idx === 0 ? 'delay-50' : idx === 1 ? 'delay-100' : idx === 2 ? 'delay-150' : 'delay-200'
              }`}
            >
              <Image
                src={type.imageUrl}
                alt={type.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/95 via-forest-dark/50 to-transparent" />

              <div className="relative z-10 space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold text-forest-dark shadow-xs">
                  {type.tag}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-warmwhite group-hover:text-gold-light transition-colors">
                  {type.title}
                </h3>
                <p className="text-xs sm:text-sm text-warmwhite/80 line-clamp-2 max-w-md">
                  {type.subtitle}
                </p>
                <div className="pt-2 flex items-center space-x-2 text-xs font-bold text-gold uppercase tracking-wider">
                  <span>Explore Series</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Supporting Categories Strip */}
        <div className="pt-6 border-t border-borderLight">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-serif text-xl sm:text-2xl font-bold text-forest">
              Complete Your Bedroom Sanctuary
            </h4>
            <Link
              href="/collections/mattress"
              className="text-xs font-semibold text-gold-dark hover:text-forest flex items-center space-x-1 transition-colors"
            >
              <span>View All Accessories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {supportingCategories.map((cat, idx) => (
              <Link
                key={idx}
                href={cat.link}
                className={`group relative rounded-xl overflow-hidden bg-cream border border-borderLight shadow-subtle hover:shadow-card transition-all luxury-card-hover animate-fade-in-up ${
                  idx === 0 ? 'delay-100' : idx === 1 ? 'delay-150' : idx === 2 ? 'delay-200' : 'delay-250'
                }`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-transparent to-transparent" />
                </div>
                <div className="p-3.5 sm:p-4 bg-warmwhite">
                  <h5 className="font-serif text-sm sm:text-base font-bold text-charcoal group-hover:text-forest transition-colors truncate">
                    {cat.name}
                  </h5>
                  <p className="text-[11px] text-charcoal-muted mt-0.5 truncate">
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
