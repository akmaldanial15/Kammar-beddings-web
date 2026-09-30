'use client'

import React from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight, HelpCircle, CheckCircle2 } from 'lucide-react'

export function FinderCallout() {
  return (
    <section className="py-16 sm:py-24 bg-forest-dark text-warmwhite relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#B49A58_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center space-x-2 bg-warmwhite/10 px-4 py-1.5 rounded-full border border-gold/40 text-gold text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Sleep Assessment</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-warmwhite max-w-3xl mx-auto leading-tight">
          Not Sure Which Firmness Fits Your Body?
        </h2>

        <p className="text-sm sm:text-base text-warmwhite/80 max-w-2xl mx-auto mt-4 leading-relaxed">
          Sleep position, body build, and ambient temperature determine the ideal mattress resistance. Answer 5 quick questions to receive deterministic, science-backed mattress recommendations.
        </p>

        {/* 4 Feature checks */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-warmwhite/75">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
            <span>Spinal Alignment Analysis</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
            <span>Tropical Cooling Match</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
            <span>Side, Back & Stomach Sleepers</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
            <span>Takes Under 60 Seconds</span>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link
            href="/finder"
            className="w-full sm:w-auto px-8 py-4 bg-gold hover:bg-gold-light text-forest-dark font-bold text-xs uppercase tracking-wider rounded-lg shadow-card transition-all hover:scale-105 flex items-center justify-center space-x-2"
          >
            <span>Launch Mattress Finder</span>
            <ArrowRight className="w-4 h-4 text-forest-dark" />
          </Link>
          <Link
            href="/compare"
            className="w-full sm:w-auto px-8 py-4 bg-warmwhite/10 hover:bg-warmwhite/20 text-warmwhite text-xs font-semibold tracking-wide rounded-lg border border-warmwhite/20 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Compare 3 Mattresses Side-by-Side</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
