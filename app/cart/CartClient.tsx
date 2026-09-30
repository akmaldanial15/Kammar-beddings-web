'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  RotateCcw,
  Gift,
  HelpCircle,
} from 'lucide-react'
import { useCart } from '@/lib/context/CartContext'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { formatMYR, calculateShippingFee, MALAYSIAN_STATES } from '@/lib/utils/format'

export function CartClient() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
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
  const [estimatedState, setEstimatedState] = useState<string>('Selangor')

  // Check if any item is a bulky mattress
  const hasBulkyMattress = items.some(
    (i) =>
      i.sku.includes('RH') ||
      i.sku.includes('CN') ||
      i.sku.includes('OR') ||
      i.sku.includes('EC') ||
      i.sku.includes('SL') ||
      i.sku.includes('CS') ||
      i.sku.includes('NF') ||
      i.sku.includes('LC') ||
      i.sku.includes('CP') ||
      i.sku.includes('MS') ||
      i.sku.includes('DS') ||
      i.sku.includes('CF')
  )

  // Automatic Gift Qualification: Free Latex Contour Pillow if Queen or King mattress in cart
  const hasQueenOrKingMattress = items.some(
    (i) =>
      hasBulkyMattress &&
      (i.sizeName.toLowerCase().includes('queen') || i.sizeName.toLowerCase().includes('king'))
  )

  // Calculate Shipping fee
  const shippingInfo = calculateShippingFee({
    subtotalSen,
    state: estimatedState,
    hasBulkyItem: hasBulkyMattress,
    freeShippingPromo: couponCode === 'FREESHIP',
  })

  // Calculate discount if coupon applied
  let discountSen = 0
  if (couponCode === 'LENAWELCOME' && subtotalSen >= 100000) {
    discountSen = Math.min(50000, Math.round(subtotalSen * 0.1))
  } else if (couponCode === 'TIER100' && subtotalSen >= 150000) {
    discountSen = 10000
  } else if (couponCode === 'SLEEPVIP' && subtotalSen >= 300000) {
    discountSen = Math.min(80000, Math.round(subtotalSen * 0.15))
  }

  const finalTotalSen = Math.max(0, subtotalSen - discountSen + shippingInfo.shippingSen)

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
        setCouponError(data.message || 'Invalid or ineligible coupon.')
      }
    } catch {
      setCouponError('Error validating coupon.')
    } finally {
      setIsValidating(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="py-20 sm:py-28 bg-warmwhite">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-cream flex items-center justify-center text-gold-dark mx-auto mb-6 shadow-subtle">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest">
            {t.emptyCartTitle}
          </h1>
          <p className="text-sm text-charcoal-muted mt-2 max-w-md mx-auto leading-relaxed">
            {t.emptyCartText}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link
              href="/collections/mattress"
              className="w-full sm:w-auto px-8 py-3.5 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold uppercase tracking-wider rounded-lg shadow-card transition-colors flex items-center justify-center space-x-2"
            >
              <span>{t.startShopping}</span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </Link>
            <Link
              href="/finder"
              className="w-full sm:w-auto px-6 py-3.5 bg-cream hover:bg-cream-dark text-charcoal text-xs font-semibold rounded-lg border border-borderLight transition-colors"
            >
              Take Mattress Finder Quiz
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-warmwhite py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-borderLight">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest">
              {t.cartTitle}
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
              Review your selected mattresses and accessories before proceeding to checkout.
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-sale hover:underline font-semibold flex items-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Empty Cart</span>
          </button>
        </div>

        {/* Free Gift Notification if Qualified */}
        {hasQueenOrKingMattress && (
          <div className="mb-8 p-4 bg-blue-50/80 rounded-2xl border border-blue-200 flex items-center space-x-3 text-blue-950">
            <Gift className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div className="text-xs">
              <span className="font-bold">Gift with Purchase Qualified!</span>
              <p className="text-blue-900 mt-0.5">
                Your Queen/King mattress purchase automatically qualifies for a free Ergonomic Cervical Contour Natural Latex Pillow (worth RM269.00), included with delivery.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="divide-y divide-borderLight border border-borderLight rounded-2xl overflow-hidden bg-cream-light shadow-subtle">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 bg-warmwhite"
                >
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-cream border border-borderLight flex-shrink-0">
                    <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.sku.toLowerCase()}`}
                      className="font-serif text-base sm:text-lg font-bold text-charcoal hover:text-forest transition-colors line-clamp-2"
                    >
                      {item.productName}
                    </Link>
                    <div className="flex items-center space-x-2 text-xs text-gold-dark font-medium mt-1">
                      <span>Size: {item.sizeName}</span>
                      <span>&bull;</span>
                      <span>{item.dimensions}</span>
                    </div>
                    <span className="text-[11px] text-charcoal-muted block mt-0.5">
                      SKU: {item.sku}
                    </span>

                    <div className="mt-3 flex items-center justify-between sm:hidden">
                      <div className="flex items-center border border-borderLight rounded bg-cream-light">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="px-2 py-1 text-charcoal"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-bold text-charcoal">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="px-2 py-1 text-charcoal"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-bold text-forest">
                        {formatMYR(item.priceSen * item.quantity)}
                      </span>
                    </div>
                  </div>

                  {/* Desktop Quantity & Price */}
                  <div className="hidden sm:flex items-center space-x-6 flex-shrink-0">
                    <div className="flex items-center border border-borderLight rounded-lg bg-cream-light">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="px-3 py-1.5 text-sm text-charcoal hover:bg-cream rounded-l"
                      >
                        -
                      </button>
                      <span className="px-4 text-xs font-bold text-charcoal">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="px-3 py-1.5 text-sm text-charcoal hover:bg-cream rounded-r"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right w-28">
                      <span className="text-base font-bold text-forest">
                        {formatMYR(item.priceSen * item.quantity)}
                      </span>
                      {item.quantity > 1 && (
                        <span className="block text-[11px] text-charcoal-muted">
                          {formatMYR(item.priceSen)} each
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="p-1.5 text-charcoal-muted hover:text-sale rounded-full hover:bg-cream transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Instructions & Notes */}
            <div className="p-5 bg-cream-light rounded-2xl border border-borderLight space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-forest block">
                {t.orderNotes} (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specific instructions for our delivery team (e.g. lift access availability, floor level, call 30 mins before arrival)"
                rows={3}
                className="w-full p-3 text-xs bg-warmwhite border border-borderLight rounded-xl outline-none focus:border-gold placeholder-charcoal-muted/60 resize-none"
              />
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-cream-light rounded-2xl border border-borderLight p-6 space-y-5 shadow-card">
              <h2 className="font-serif text-xl font-bold text-forest pb-3 border-b border-borderLight">
                {t.orderSummary}
              </h2>

              {/* Subtotal */}
              <div className="flex justify-between text-xs text-charcoal">
                <span>{t.subtotal}</span>
                <span className="font-bold">{formatMYR(subtotalSen)}</span>
              </div>

              {/* Discount */}
              {discountSen > 0 && (
                <div className="flex justify-between text-xs text-sale font-semibold">
                  <span>Promotional Discount ({couponCode})</span>
                  <span>-{formatMYR(discountSen)}</span>
                </div>
              )}

              {/* Shipping Estimator */}
              <div className="space-y-2 pt-2 border-t border-borderLight text-xs">
                <div className="flex justify-between items-center text-charcoal font-semibold">
                  <span className="flex items-center space-x-1">
                    <Truck className="w-3.5 h-3.5 text-gold-dark" />
                    <span>Malaysian Shipping Destination:</span>
                  </span>
                  <span className="text-forest font-bold">
                    {shippingInfo.isFreeShipping ? 'FREE' : formatMYR(shippingInfo.shippingSen)}
                  </span>
                </div>

                <select
                  value={estimatedState}
                  onChange={(e) => setEstimatedState(e.target.value)}
                  className="w-full p-2 bg-warmwhite border border-borderLight rounded-lg text-xs font-medium text-charcoal outline-none focus:border-gold cursor-pointer"
                >
                  {MALAYSIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st} {st === 'Sabah' || st === 'Sarawak' || st === 'WP Labuan' ? '(East MY Sea Freight)' : '(Peninsular)'}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-charcoal-muted leading-tight">
                  {shippingInfo.label}
                </p>
              </div>

              {/* Voucher Application Field */}
              <div className="pt-2 border-t border-borderLight">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal block mb-1.5">
                  {t.couponCode}
                </label>
                {couponCode ? (
                  <div className="flex items-center justify-between p-2.5 bg-gold/10 border border-gold/40 rounded-lg text-xs">
                    <div className="flex items-center space-x-1.5 text-forest font-bold">
                      <Tag className="w-3.5 h-3.5 text-gold-dark" />
                      <span>{couponCode} Applied</span>
                    </div>
                    <button
                      onClick={() => {
                        setCouponCode('')
                        setCouponSuccess('')
                      }}
                      className="text-sale hover:underline font-semibold text-xs"
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
                      placeholder="e.g. LENAWELCOME"
                      className="flex-1 px-3 py-2 text-xs bg-warmwhite border border-borderLight rounded-lg outline-none focus:border-gold uppercase"
                    />
                    <button
                      type="submit"
                      disabled={isValidating || !inputCoupon.trim()}
                      className="px-4 py-2 bg-forest text-warmwhite text-xs font-bold rounded-lg hover:bg-forest-dark disabled:opacity-50 transition-colors"
                    >
                      {isValidating ? '...' : t.applyCoupon}
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-sale mt-1">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-forest font-medium mt-1">{couponSuccess}</p>}
              </div>

              {/* Grand Total */}
              <div className="pt-4 border-t border-borderLight flex items-baseline justify-between">
                <div>
                  <span className="font-serif text-lg font-bold text-forest block">
                    {t.total}
                  </span>
                  <span className="text-[10px] text-charcoal-muted">Inclusive of SST where applicable</span>
                </div>
                <span className="text-2xl font-bold text-forest">
                  {formatMYR(finalTotalSen)}
                </span>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => router.push('/checkout')}
                className="w-full py-4 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold uppercase tracking-wider rounded-xl shadow-card flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
              >
                <ShieldCheck className="w-4 h-4 text-gold" />
                <span>{t.proceedToCheckout}</span>
              </button>

              <div className="pt-2 text-[11px] text-charcoal-muted text-center space-y-1">
                <p>🔒 256-bit encrypted checkout via Stripe</p>
                <p>Supported: Visa, Mastercard, FPX Malaysian Banking</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
