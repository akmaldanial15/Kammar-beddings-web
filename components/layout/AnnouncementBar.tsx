'use client'

import React from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight, ShieldCheck, Truck } from 'lucide-react'

export function AnnouncementBar() {
  return (
    <div className="bg-forest-dark text-warmwhite py-2 px-4 text-xs font-medium tracking-wide border-b border-gold/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left benefit */}
        <div className="hidden md:flex items-center space-x-2 text-[11px] text-warmwhite/80">
          <Truck className="w-3.5 h-3.5 text-gold flex-shrink-0" />
          <span>Complimentary White-Glove In-Home Setup Across Peninsular Malaysia</span>
        </div>

        {/* Center promotional notice */}
        <div className="flex-1 md:flex-initial flex items-center justify-center space-x-2 text-center">
          <Sparkles className="w-3.5 h-3.5 text-gold flex-shrink-0 animate-pulse" />
          <span className="font-medium text-warmwhite text-[11.5px] sm:text-xs">
            Grand Launch Privileges: Enjoy RM100 Off with code{' '}
            <strong className="text-gold font-bold tracking-wider">KAMAAR100</strong>
          </span>
          <Link
            href="/collections/mattress"
            className="hidden sm:inline-flex items-center space-x-1 text-gold hover:text-gold-light font-bold underline ml-1.5 transition-colors"
          >
            <span>Explore Mattresses</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Right guarantee */}
        <div className="hidden lg:flex items-center space-x-1.5 text-[11px] text-warmwhite/80">
          <ShieldCheck className="w-3.5 h-3.5 text-gold flex-shrink-0" />
          <span>10-Year Local Warranty &bull; 100-Night Trial</span>
        </div>
      </div>
    </div>
  )
}
