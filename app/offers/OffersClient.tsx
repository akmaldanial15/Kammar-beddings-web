'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Tag, Copy, Check, Clock, Sparkles, Gift, ArrowRight, ShieldCheck } from 'lucide-react'
import { Coupon, Product } from '@/types'
import { formatMYR, formatDateMY } from '@/lib/utils/format'
import { ProductCard } from '@/components/product/ProductCard'

interface OffersClientProps {
  coupons: Coupon[]
  eligibleProducts: Product[]
}

export function OffersClient({ coupons, eligibleProducts }: OffersClientProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2500)
  }

  return (
    <div className="bg-warmwhite py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Banner */}
        <div className="bg-forest-dark text-warmwhite rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-gold/30">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Bedroom Privileges</span>
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-warmwhite leading-tight">
              Exclusive Mattress Privileges & Vouchers
            </h1>
            <p className="text-sm sm:text-base text-warmwhite/80 leading-relaxed">
              Elevate your master bedroom with handcrafted Malaysian natural latex. Apply verified vouchers at checkout for instant cash savings, bundle rewards, and free white-glove delivery.
            </p>
          </div>
        </div>

        {/* Free Gift with Purchase Promotion Spotlight */}
        <div className="bg-cream rounded-2xl p-6 sm:p-8 border border-gold/40 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-forest flex items-center justify-center flex-shrink-0 text-gold shadow-md">
              <Gift className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forest bg-gold/20 px-2.5 py-0.5 rounded">
                Automatic Gift Promotion
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest mt-1.5">
                Complimentary Natural Latex Pillow (Worth RM269.00)
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-1 leading-relaxed max-w-xl">
                Purchase any Queen or King size mattress and receive our signature Ergonomic Cervical Contour Natural Latex Pillow automatically included in your delivery.
              </p>
            </div>
          </div>

          <Link
            href="/collections/mattress"
            className="w-full md:w-auto px-6 py-3 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm whitespace-nowrap text-center transition-colors"
          >
            Shop Qualifying Mattresses &rarr;
          </Link>
        </div>

        {/* Verified Coupons Grid */}
        <div>
          <div className="mb-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
              Active Checkout Vouchers
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
              Copy any code below and paste it into the coupon field in your cart drawer or checkout summary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coupons.map((coupon) => {
              const isCopied = copiedCode === coupon.code
              return (
                <div
                  key={coupon.id}
                  className="bg-cream-light rounded-2xl p-6 border border-borderLight shadow-card flex flex-col justify-between hover:border-gold transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded bg-forest text-warmwhite text-[10px] font-bold uppercase tracking-wider">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}% OFF`
                          : coupon.discountType === 'fixed_amount'
                          ? `${formatMYR(coupon.discountValue)} OFF`
                          : 'FREE SHIPPING'}
                      </span>
                      <span className="text-[10px] text-charcoal-muted flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-gold-dark" />
                        <span>Valid: {formatDateMY(coupon.endsAt)}</span>
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-charcoal mb-1.5">
                      {coupon.description}
                    </h3>

                    <div className="text-xs text-charcoal-muted space-y-1 mb-4">
                      <div>&bull; Minimum Spend: {formatMYR(coupon.minSpendSen)}</div>
                      {coupon.maxDiscountSen && (
                        <div>&bull; Max Discount: {formatMYR(coupon.maxDiscountSen)}</div>
                      )}
                      <div>&bull; Limit: {coupon.perCustomerLimit} redemption per customer</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-borderLight flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-forest tracking-wider px-2.5 py-1 bg-warmwhite rounded border border-borderLight">
                      {coupon.code}
                    </span>

                    <button
                      onClick={() => handleCopy(coupon.code)}
                      className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1 transition-all ${
                        isCopied
                          ? 'bg-emerald-700 text-white font-bold'
                          : 'bg-forest hover:bg-forest-dark text-warmwhite'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Eligible Featured Mattresses */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
                Featured Mattresses Eligible for Voucher Discounts
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
                Handcrafted with 100% natural latex and backed by our 100-night trial.
              </p>
            </div>
            <Link
              href="/collections/mattress"
              className="text-xs font-semibold text-gold-dark hover:text-forest flex items-center space-x-1"
            >
              <span>View All 12 Mattresses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {eligibleProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
