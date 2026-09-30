'use client'

import React, { useState } from 'react'
import { Star, CheckCircle, Quote, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { Review } from '@/types'

interface ReviewsSectionProps {
  reviews: Review[]
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  if (reviews.length === 0) return null

  return (
    <section className="py-16 sm:py-24 bg-cream border-t border-borderLight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gold-dark flex items-center justify-center space-x-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Verified Malaysian Testimonials</span>
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest">
            Ache-Free Mornings, Guaranteed
          </h2>
          <p className="text-sm sm:text-base text-charcoal-muted mt-2">
            Over 15,000 Malaysian households have elevated their sleep quality with KAMAAR Beddings’ pure natural latex and ergonomic hybrid mattresses.
          </p>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-warmwhite p-6 rounded-2xl border border-borderLight shadow-card flex flex-col justify-between"
            >
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center space-x-1 text-gold mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating ? 'fill-gold text-gold' : 'text-borderLight'
                      }`}
                    />
                  ))}
                </div>

                <h3 className="font-serif text-base font-bold text-charcoal mb-2 leading-snug">
                  &ldquo;{rev.title}&rdquo;
                </h3>

                <p className="text-xs text-charcoal-muted leading-relaxed">
                  {rev.content}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-borderLight flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-forest">{rev.customerName}</h4>
                  {rev.isVerifiedPurchase && (
                    <span className="flex items-center space-x-1 text-[10px] text-emerald-700 font-semibold mt-0.5">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>Verified Purchaser</span>
                    </span>
                  )}
                </div>
                <Quote className="w-6 h-6 text-gold/30" />
              </div>
            </div>
          ))}
        </div>

        {/* Demo Disclaimer Badge */}
        <div className="mt-8 text-center text-[11px] text-charcoal-muted">
          <span>* Illustrative customer testimonials from actual Malaysian trials. Review moderation managed in staff admin.</span>
        </div>
      </div>
    </section>
  )
}
