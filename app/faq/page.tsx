import React from 'react'
import { FaqClient } from './FaqClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions & Care Guides | KAMAAR Beddings Malaysia',
  description:
    'Answers regarding Malaysian white-glove mattress delivery, 100-night trial, organic latex care, dimensions, and structural warranty terms.',
}

export default function FaqPage() {
  return (
    <div className="bg-cream min-h-screen py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            Concierge Knowledge Base
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-forest-dark">
            Frequently Asked Questions
          </h1>
          <p className="text-sm md:text-base text-secondary max-w-xl mx-auto">
            Everything you need to know about our handcrafted sleep systems, Malaysian delivery timelines, trial guarantees, and organic latex longevity.
          </p>
        </div>

        <FaqClient />
      </div>
    </div>
  )
}
