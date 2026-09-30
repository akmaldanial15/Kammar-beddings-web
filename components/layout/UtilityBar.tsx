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
        {/* Left Links */}
        <div className="flex items-center space-x-6 text-[11.5px]">
          <Link
            href="/showrooms"
            className="flex items-center space-x-1.5 text-charcoal-muted hover:text-forest transition-colors font-medium"
          >
            <MapPin className="w-3.5 h-3.5 text-gold-dark" />
            <span>{t.findShowroom}</span>
          </Link>
          <Link
            href="/faq"
            className="flex items-center space-x-1.5 text-charcoal-muted hover:text-forest transition-colors font-medium"
          >
            <HelpCircle className="w-3.5 h-3.5 text-gold-dark" />
            <span>{t.customerCare}</span>
          </Link>
          <Link
            href="/business"
            className="flex items-center space-x-1.5 text-charcoal-muted hover:text-forest transition-colors font-medium"
          >
            <Briefcase className="w-3.5 h-3.5 text-gold-dark" />
            <span>{t.businessEnquiries}</span>
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
