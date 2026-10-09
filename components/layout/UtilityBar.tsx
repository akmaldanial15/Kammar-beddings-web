'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { MapPin, Phone, HelpCircle, Briefcase, Globe } from 'lucide-react'

export function UtilityBar() {
  const { locale, setLocale, t } = useLanguage()

  return (
    <div className="bg-cream/90 backdrop-blur-sm text-charcoal border-b border-borderLight/70 text-xs py-1.5 px-4 hidden lg:block">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Links - Exactly Slide 1 of PERUBAHAN DI MUKA DEPAN.pptx */}
        <div className="flex items-center space-x-5 text-[11.5px]">
          <Link
            href="/showrooms"
            className="flex items-center space-x-1.5 text-charcoal-muted hover:text-forest transition-colors font-semibold uppercase tracking-wider"
          >
            <MapPin className="w-3.5 h-3.5 text-gold-dark" />
            <span>SHOWROOM</span>
          </Link>
          <Link
            href="/jelajah-promosi"
            className="flex items-center space-x-1.5 text-amber-700 hover:text-amber-900 transition-colors font-bold uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded border border-amber-200"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block" />
            <span>JELAJAH PROMOSI (LOKASI TERKINI)</span>
          </Link>
          <Link
            href="/profil"
            className="flex items-center space-x-1.5 text-charcoal-muted hover:text-forest transition-colors font-semibold uppercase tracking-wider"
          >
            <Briefcase className="w-3.5 h-3.5 text-gold-dark" />
            <span>PROFIL SYARIKAT</span>
          </Link>
        </div>

        {/* Right Info & Language Selector */}
        <div className="flex items-center space-x-6 text-[11.5px]">
          <a
            href="tel:+60377221199"
            className="flex items-center space-x-1.5 text-charcoal-muted hover:text-forest transition-colors font-medium"
          >
            <Phone className="w-3.5 h-3.5 text-gold-dark" />
            <span>Concierge: {t.phone}</span>
          </a>

          {/* Language Switcher */}
          <div className="flex items-center space-x-1 bg-warmwhite px-2 py-0.5 rounded-full border border-borderLight shadow-xs">
            <Globe className="w-3 h-3 text-gold-dark" />
            <button
              onClick={() => setLocale('en')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                locale === 'en'
                  ? 'bg-forest text-warmwhite font-bold'
                  : 'text-charcoal-muted hover:text-forest'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLocale('bm')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                locale === 'bm'
                  ? 'bg-forest text-warmwhite font-bold'
                  : 'text-charcoal-muted hover:text-forest'
              }`}
            >
              BM
            </button>
          </div>

          <span className="text-charcoal-muted font-semibold tracking-wider text-[11px]">
            MYR (RM)
          </span>
        </div>
      </div>
    </div>
  )
}
