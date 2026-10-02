'use client'

import React from 'react'
import { Sparkles, RotateCcw, ShieldCheck, Truck, BedDouble } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function ReassuranceStrip() {
  const { t } = useLanguage()

  const items = [
    {
      icon: Sparkles,
      title: t.reassureLatex,
      subtitle: t.reassureLatexSub,
    },
    {
      icon: RotateCcw,
      title: t.reassureTrial,
      subtitle: t.reassureTrialSub,
    },
    {
      icon: ShieldCheck,
      title: t.reassureWarranty,
      subtitle: t.reassureWarrantySub,
    },
    {
      icon: Truck,
      title: t.reassureDelivery,
      subtitle: t.reassureDeliverySub,
    },
  ]

  return (
    <div className="bg-cream border-y border-borderLight py-7 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {items.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-warmwhite flex items-center justify-center flex-shrink-0 text-gold-dark border border-borderLight shadow-subtle">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-sans text-xs sm:text-sm font-bold text-forest uppercase tracking-wider">
                    {item.title}
                  </h4>
                  <p className="font-sans text-xs text-charcoal-muted mt-0.5 leading-snug">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
