'use client'

import React from 'react'
import { Printer } from 'lucide-react'

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-3.5 py-1.5 bg-cream hover:bg-cream-dark text-charcoal text-xs font-semibold rounded-lg border border-borderLight flex items-center space-x-1.5 transition-colors print:hidden"
    >
      <Printer className="w-3.5 h-3.5 text-gold-dark" />
      <span>Print Receipt</span>
    </button>
  )
}
