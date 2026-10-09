'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react'
import { useCart } from '@/lib/context/CartContext'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { formatMYR } from '@/lib/utils/format'

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    subtotalSen,
    couponCode,
    setCouponCode,
    notes,
    setNotes,
  } = useCart()
  const { t } = useLanguage()
  const router = useRouter()

  const [inputCoupon, setInputCoupon] = useState('')
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')
  const [isValidating, setIsValidating] = useState(false)

  // Free shipping calculation threshold (RM500 = 50000 sen)
  const FREE_SHIPPING_THRESHOLD = 50000
  const hasMattress = items.some((i) => i.sku.includes('RH') || i.sku.includes('CN') || i.sku.includes('OR') || i.sku.includes('EC') || i.sku.includes('SL') || i.sku.includes('CS') || i.sku.includes('NF') || i.sku.includes('LC') || i.sku.includes('CP') || i.sku.includes('MS') || i.sku.includes('DS') || i.sku.includes('CF'))
  const isFreeShipping = hasMattress || subtotalSen >= FREE_SHIPPING_THRESHOLD
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalSen)
  const progressPercent = hasMattress ? 100 : Math.min(100, Math.round((subtotalSen / FREE_SHIPPING_THRESHOLD) * 100))

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputCoupon.trim()) return

    setIsValidating(true)
    setCouponError('')
    setCouponSuccess('')

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inputCoupon.trim(), subtotalSen }),
      })
      const data = await res.json()
      if (data.isValid) {
        setCouponCode(inputCoupon.trim().toUpperCase())
        setCouponSuccess(data.message || 'Coupon applied successfully.')
        setInputCoupon('')
      } else {
        setCouponError(data.message || 'Invalid coupon code.')
      }
    } catch {
      setCouponError('Error validating coupon. Please try again.')
    } finally {
      setIsValidating(false)
    }
  }

  const handleCheckout = () => {
    closeDrawer()
    router.push('/checkout')
  }

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden ${
        isDrawerOpen
          ? 'pointer-events-auto visible'
          : 'pointer-events-none invisible delay-300'
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-charcoal/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isDrawerOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeDrawer}
      />

      <div
        className={`fixed inset-y-0 right-0 max-w-full flex pl-10 transform transition-transform duration-300 ease-out will-change-transform ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-borderLight flex items-center justify-between bg-cream-light">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-forest" />
              <h2 className="text-lg font-serif font-bold text-forest tracking-wide">
                {t.cartTitle} ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 text-charcoal-muted hover:text-charcoal rounded-full hover:bg-cream transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Reassurance Bar */}
          <div className="p-3 bg-forest-dark text-warmwhite text-xs">
            <div className="flex items-center justify-between font-medium mb-1.5">
              <span className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>
                  {isFreeShipping
                    ? 'Qualified for Free White-Glove Peninsular Delivery!'
                    : `Add ${formatMYR(amountToFreeShipping)} more for Free Delivery`}
                </span>
              </span>
              <span className="text-gold font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-forest h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gold h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-borderLight">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center text-gold-dark mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-bold text-charcoal">{t.emptyCartTitle}</h3>
                <p className="text-xs text-charcoal-muted mt-1 max-w-xs">{t.emptyCartText}</p>
                <Link
                  href="/collections/mattress"
                  onClick={closeDrawer}
                  className="mt-6 px-6 py-2.5 bg-forest text-warmwhite rounded-lg text-sm font-medium hover:bg-forest-dark transition-colors shadow-subtle flex items-center space-x-2"
                >
                  <span>{t.startShopping}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.variantId} className="flex space-x-3.5 pt-4 first:pt-0">
                    <div className="relative w-20 h-20 rounded-md overflow-hidden bg-cream flex-shrink-0 border border-borderLight">
                      <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-semibold text-charcoal truncate pr-2">
                            {item.productName}
                          </h4>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="text-charcoal-muted hover:text-sale p-0.5 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gold-dark font-medium mt-0.5">
                          Size: {item.sizeName}
                        </p>
                        <p className="text-[11px] text-charcoal-muted">{item.dimensions}</p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-borderLight rounded bg-cream-light">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="p-1 text-charcoal hover:bg-cream transition-colors rounded-l"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold text-charcoal">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="p-1 text-charcoal hover:bg-cream transition-colors rounded-r"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-bold text-forest">
                            {formatMYR(item.priceSen * item.quantity)}
                          </span>
                          {item.compareAtPriceSen && item.compareAtPriceSen > item.priceSen && (
                            <span className="block text-[11px] line-through text-charcoal-muted">
                              {formatMYR(item.compareAtPriceSen * item.quantity)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Area with Promo Code & Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-borderLight bg-cream-light space-y-4">
              {/* Voucher Code */}
              <div>
                {couponCode ? (
                  <div className="flex items-center justify-between bg-gold/10 border border-gold/30 rounded p-2 text-xs">
                    <div className="flex items-center space-x-1.5 text-forest font-semibold">
                      <Tag className="w-3.5 h-3.5 text-gold-dark" />
                      <span>Code &ldquo;{couponCode}&rdquo; Applied</span>
                    </div>
                    <button
                      onClick={() => {
                        setCouponCode('')
                        setCouponSuccess('')
                      }}
                      className="text-sale hover:underline font-medium text-xs"
                    >
                      {t.removeCoupon}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                    <input
                      type="text"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                      placeholder={t.couponCode}
                      className="flex-1 px-3 py-1.5 text-xs bg-warmwhite border border-borderLight rounded outline-none focus:border-gold uppercase"
                    />
                    <button
                      type="submit"
                      disabled={isValidating || !inputCoupon.trim()}
                      className="px-3 py-1.5 bg-forest text-warmwhite text-xs font-semibold rounded hover:bg-forest-dark disabled:opacity-50 transition-colors"
                    >
                      {isValidating ? '...' : t.applyCoupon}
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-sale mt-1">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-forest font-medium mt-1">{couponSuccess}</p>}
              </div>

              {/* Delivery notes optional request */}
              <div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special delivery notes (e.g. lift access, floor level)"
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs bg-warmwhite border border-borderLight rounded outline-none focus:border-gold placeholder-charcoal-muted/70 resize-none"
                />
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-charcoal-muted">
                  <span>{t.subtotal}</span>
                  <span className="font-semibold text-charcoal">{formatMYR(subtotalSen)}</span>
                </div>
                <div className="flex justify-between text-charcoal-muted">
                  <span>{t.estimatedShipping}</span>
                  <span className="font-semibold text-forest">
                    {isFreeShipping ? 'FREE' : 'Calculated at Checkout'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-forest pt-2 border-t border-borderLight">
                  <span>{t.total}</span>
                  <span>{formatMYR(subtotalSen)}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-forest text-warmwhite text-sm font-bold tracking-wide rounded-lg hover:bg-forest-dark transition-all shadow-card flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4 text-gold" />
                  <span>{t.proceedToCheckout}</span>
                </button>
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="w-full py-2.5 block text-center bg-warmwhite text-charcoal border border-borderLight text-xs font-semibold rounded-lg hover:bg-cream transition-colors"
                >
                  View Full Shopping Cart
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
