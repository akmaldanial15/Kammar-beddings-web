import React from 'react'
import { Metadata } from 'next'
import { CareGuideClient } from './CareGuideClient'

export const metadata: Metadata = {
  title: 'Latex & Hybrid Mattress Care Guide | KAMAAR Beddings Malaysia',
  description:
    'Comprehensive care guidelines for 100% natural organic latex and hybrid mattresses. Essential sunlight precautions, rotation schedules, and cleaning tips.',
}

export default function CareGuidePage() {
  return (
    <div className="bg-cream min-h-screen py-12 md:py-20 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Editorial Heading */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            Longevity & Craft Preservation
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-forest-dark tracking-tight">
            Natural Latex Mattress Care Guide
          </h1>
          <p className="text-sm md:text-base text-secondary leading-relaxed">
            Crafted from 100% pure organic Malaysian Hevea latex and luxury pocket springs, your KAMAAR mattress is built to last over a decade. Follow our essential care guidelines to preserve peak elasticity, cooling hygiene, and warranty integrity.
          </p>
        </div>

        <CareGuideClient />
      </div>
    </div>
  )
}
