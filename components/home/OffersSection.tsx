'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Tag, Copy, Check, Sparkles, Clock, ArrowRight } from 'lucide-react'
import { Coupon } from '@/types'
import { formatMYR, formatDateMY } from '@/lib/utils/format'

interface OffersSectionProps {
  coupons: Coupon[]
}

export function OffersSection({ coupons }: OffersSectionProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2500)
  }

  // Filter coupons chosen by Admin to display on homepage
  const featuredCoupons = coupons
    .filter((c) => c.isActive && c.showOnHomepage)
    .sort((a, b) => (a.featuredOrder || 99) - (b.featuredOrder || 99))

  // Fallback to active coupons if admin hasn't chosen any specifically yet
  const displayCoupons =
    featuredCoupons.length > 0 ? featuredCoupons : coupons.filter((c) => c.isActive).slice(0, 4)

  if (displayCoupons.length === 0) {
    return null
  }

  const gridColsClass =
    displayCoupons.length === 1
      ? 'max-w-md mx-auto grid-cols-1'
      : displayCoupons.length === 2
      ? 'max-w-3xl mx-auto grid-cols-1 sm:grid-cols-2'
      : displayCoupons.length === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'

  return (
    <section className="py-16 sm:py-24 bg-forest text-warmwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gold flex items-center space-x-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Privilege Vouchers & Campaigns</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-warmwhite">
              Limited-Time Sleep Privileges
            </h2>
            <p className="text-sm sm:text-base text-warmwhite/80 mt-2 max-w-xl">
              Apply these verified voucher codes directly at checkout to enjoy instant mattress savings, free white-glove setup, and bundle discounts.
            </p>
          </div>

          <Link
            href="/offers"
            className="mt-4 md:mt-0 text-xs font-bold text-gold hover:text-gold-light uppercase tracking-wider flex items-center space-x-1"
          >
            <span>View All Campaign Rules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Dynamic Coupon Cards Grid chosen by Admin */}
        <div className={`grid gap-6 ${gridColsClass}`}>
          {displayCoupons.map((coupon) => {
            const isCopied = copiedCode === coupon.code

            // Derive badge & title from admin custom settings or smart defaults
            const badgeText =
              coupon.customBadge?.trim() ||
              (coupon.discountType === 'percentage'
                ? `${coupon.discountValue}% OFF`
                : coupon.discountType === 'fixed_amount'
                ? `${formatMYR(coupon.discountValue)} OFF`
                : 'FREE SHIPPING')

            const cardTitle =
              coupon.customTitle?.trim() ||
              (coupon.discountType === 'percentage'
                ? `${coupon.discountValue}% Mattress Privilege`
                : coupon.discountType === 'fixed_amount'
                ? `Instant ${formatMYR(coupon.discountValue)} Voucher`
                : 'Zero Shipping Fee')

            return (
              <div
                key={coupon.id}
                className="relative bg-forest-dark/80 rounded-2xl p-6 border border-gold/30 shadow-card flex flex-col justify-between hover:border-gold transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded bg-gold/20 text-gold text-[10px] font-bold uppercase tracking-wider">
                      {badgeText}
                    </span>
                    <span className="text-[10px] text-warmwhite/60 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-gold" />
                      <span>Ends {formatDateMY(coupon.endsAt)}</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-warmwhite mb-2">
                    {cardTitle}
                  </h3>

                  <p className="text-xs text-warmwhite/70 leading-relaxed mb-4">
                    {coupon.description}
                  </p>

                  <div className="text-[11px] text-warmwhite/50 space-y-1 mb-4">
                    <div>&bull; Minimum Spend: {formatMYR(coupon.minSpendSen)}</div>
                    {coupon.maxDiscountSen && (
                      <div>&bull; Max Discount: {formatMYR(coupon.maxDiscountSen)}</div>
                    )}
                    {coupon.customerRestriction === 'first_time' && (
                      <div className="text-amber-300/80 font-medium">
                        &bull; Eksklusif: Pelanggan Baharu
                      </div>
                    )}
                    {coupon.customerRestriction === 'existing_only' && (
                      <div className="text-amber-300/80 font-medium">
                        &bull; Eksklusif: Pelanggan Setia / VIP
                      </div>
                    )}
                  </div>
                </div>

                {/* Code Copy Box */}
                <div className="pt-4 border-t border-warmwhite/10 flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-gold tracking-widest px-2.5 py-1 bg-warmwhite/5 rounded border border-gold/30">
                    {coupon.code}
                  </span>

                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer ${
                      isCopied
                        ? 'bg-gold text-forest-dark font-bold'
                        : 'bg-warmwhite/10 hover:bg-warmwhite/20 text-warmwhite'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-forest-dark" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
