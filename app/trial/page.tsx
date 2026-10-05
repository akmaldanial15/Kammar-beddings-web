import React from 'react'
import { Metadata } from 'next'
import { TrialClient } from './TrialClient'

export const metadata: Metadata = {
  title: '100-Night Risk-Free Sleep Trial | KAMAAR Beddings Malaysia',
  description:
    'Experience 100 nights of pure organic latex and hybrid sleep in the comfort of your home. Free delivery, zero-risk returns, and 100% full refunds across Malaysia.',
}

export default function TrialPage() {
  return (
    <div className="bg-cream min-h-screen py-12 md:py-20 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Editorial Heading */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            Zero-Risk Sleep Guarantee
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-forest-dark tracking-tight">
            100-Night Risk-Free Sleep Trial
          </h1>
          <p className="text-sm md:text-base text-secondary leading-relaxed">
            A 10-minute showroom test cannot compare to sleeping in your own bedroom. Test our 100% natural organic latex and luxury hybrid mattresses in your real daily routine for 100 nights. If your body isn&apos;t completely revitalized, we&apos;ll pick it up and refund every ringgit.
          </p>
        </div>

        <TrialClient />
      </div>
    </div>
  )
}
