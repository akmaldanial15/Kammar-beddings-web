'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ShieldCheck,
  CreditCard,
  Truck,
  RotateCcw,
  Sparkles,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Calendar,
} from 'lucide-react'
import { useCart } from '@/lib/context/CartContext'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import {
  formatMYR,
  calculateShippingFee,
  MALAYSIAN_STATES,
  validateMalaysianPostcode,
  validateMalaysianPhone,
} from '@/lib/utils/format'

export function CheckoutClient() {
  const { items, subtotalSen, couponCode, notes, clearCart } = useCart()
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()

  const isCancelled = searchParams.get('cancelled') === 'true'

  // Form states
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('Selangor')
  const [postcode, setPostcode] = useState('')
  const [hasLiftAccess, setHasLiftAccess] = useState(true)
  const [floorLevel, setFloorLevel] = useState('Ground Floor')
  const [preferredDate, setPreferredDate] = useState('')
  const [deliveryNotes, setDeliveryNotes] = useState(notes || '')
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [termsAgreed, setTermsAgreed] = useState(true)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Check if any item is a mattress
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

  // Shipping calculation
  const shippingInfo = calculateShippingFee({
    subtotalSen,
    state,
    hasBulkyItem: hasBulkyMattress,
    freeShippingPromo: couponCode === 'FREESHIP',
  })

  // Discount calculation
  let discountSen = 0
  if (couponCode === 'LENAWELCOME' && subtotalSen >= 100000) {
    discountSen = Math.min(50000, Math.round(subtotalSen * 0.1))
  } else if (couponCode === 'TIER100' && subtotalSen >= 150000) {
    discountSen = 10000
  } else if (couponCode === 'SLEEPVIP' && subtotalSen >= 300000) {
    discountSen = Math.min(80000, Math.round(subtotalSen * 0.15))
  }

  const finalTotalSen = Math.max(0, subtotalSen - discountSen + shippingInfo.shippingSen)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (items.length === 0) {
      setErrorMessage('Your cart is empty.')
      return
    }

    if (!validateMalaysianPhone(phone)) {
      setErrorMessage('Please enter a valid Malaysian contact number (e.g. 012 345 6789 or +60123456789).')
      return
    }

    if (!validateMalaysianPostcode(postcode)) {
      setErrorMessage('Please enter a valid 5-digit Malaysian postcode.')
      return
    }

    if (!termsAgreed) {
      setErrorMessage('Please agree to LENA SLEEP’s Terms of Service and Sleep Trial policy to proceed.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            variantId: i.variantId,
            productId: i.productId,
            quantity: i.quantity,
          })),
          customer: {
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
          },
          shippingAddress: {
            addressLine1: addressLine1.trim(),
            addressLine2: addressLine2.trim() || undefined,
            city: city.trim(),
            state,
            postcode: postcode.trim(),
            country: 'Malaysia',
          },
          deliveryDetails: {
            notes: deliveryNotes.trim() || undefined,
            hasLiftAccess,
            floorLevel,
            preferredDeliveryDate: preferredDate || undefined,
          },
          couponCode: couponCode || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(data.error || 'Failed to initialize payment session.')
        setIsSubmitting(false)
        return
      }

      // Clear client cart after session persistence
      clearCart()

      // Redirect to Stripe hosted checkout or local development sandbox
      window.location.href = data.checkoutUrl
    } catch (err: any) {
      console.error('Checkout error:', err)
      setErrorMessage('Network or server error while placing order. Please try again.')
      setIsSubmitting(false)
    }
  }

  if (items.length === 0 && !isSubmitting) {
    return (
      <div className="py-20 text-center bg-warmwhite">
        <h2 className="font-serif text-2xl font-bold text-charcoal">Your cart is empty</h2>
        <Link href="/collections/mattress" className="mt-4 inline-block text-xs font-bold text-forest underline">
          Return to Mattress Collection
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-cream-light py-10 sm:py-16 min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gold-dark flex items-center space-x-1.5 mb-1">
            <Lock className="w-3.5 h-3.5 text-gold" />
            <span>Encrypted Malaysian Checkout</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest">
            {t.checkoutTitle}
          </h1>
        </div>

        {isCancelled && (
          <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-300 text-amber-900 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Previous payment session was cancelled. You can review your details and re-attempt checkout below.</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-300 text-sale text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Delivery & Customer Forms */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Contact Information */}
            <div className="bg-warmwhite p-6 sm:p-8 rounded-2xl border border-borderLight shadow-subtle space-y-4">
              <h2 className="font-serif text-xl font-bold text-forest pb-2 border-b border-borderLight">
                1. {t.contactInfo}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">
                    {t.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ahmad Danial"
                    className="w-full px-3.5 py-2.5 text-xs bg-cream-light border border-borderLight rounded-lg outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">
                    {t.email} *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. danial@example.com.my"
                    className="w-full px-3.5 py-2.5 text-xs bg-cream-light border border-borderLight rounded-lg outline-none focus:border-gold"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">
                  {t.phoneLabel} *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 012 345 6789"
                  className="w-full px-3.5 py-2.5 text-xs bg-cream-light border border-borderLight rounded-lg outline-none focus:border-gold"
                />
                <span className="text-[10px] text-charcoal-muted mt-1 block">
                  Our white-glove logistics team will call or SMS you prior to delivery.
                </span>
              </div>
            </div>

            {/* 2. Malaysian Delivery Address */}
            <div className="bg-warmwhite p-6 sm:p-8 rounded-2xl border border-borderLight shadow-subtle space-y-4">
              <h2 className="font-serif text-xl font-bold text-forest pb-2 border-b border-borderLight">
                2. {t.shippingAddress}
              </h2>

              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">
                  {t.address1} *
                </label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="e.g. No. 12, Jalan Telawi 3, Bangsar Baru"
                  className="w-full px-3.5 py-2.5 text-xs bg-cream-light border border-borderLight rounded-lg outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">
                  {t.address2}
                </label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="e.g. Unit A-12-03, Bangsar Peak Condominium"
                  className="w-full px-3.5 py-2.5 text-xs bg-cream-light border border-borderLight rounded-lg outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">
                    {t.city} *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Kuala Lumpur"
                    className="w-full px-3.5 py-2.5 text-xs bg-cream-light border border-borderLight rounded-lg outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">
                    {t.state} *
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-cream-light border border-borderLight rounded-lg outline-none focus:border-gold cursor-pointer"
                  >
                    {MALAYSIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">
                    {t.postcode} *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder="e.g. 59100"
                    className="w-full px-3.5 py-2.5 text-xs bg-cream-light border border-borderLight rounded-lg outline-none focus:border-gold font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 3. Bulky Mattress Delivery Details (Floor, Lift, Preferred Date) */}
            <div className="bg-warmwhite p-6 sm:p-8 rounded-2xl border border-borderLight shadow-subtle space-y-4">
              <h2 className="font-serif text-xl font-bold text-forest pb-2 border-b border-borderLight">
                3. Mattress Delivery Logistics
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">
                    {t.liftAccessLabel}
                  </label>
                  <div className="flex items-center space-x-4 pt-1 text-xs">
                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="lift"
                        checked={hasLiftAccess}
                        onChange={() => setHasLiftAccess(true)}
                        className="text-forest focus:ring-forest"
                      />
                      <span>Yes, elevator available</span>
                    </label>
                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="lift"
                        checked={!hasLiftAccess}
                        onChange={() => setHasLiftAccess(false)}
                        className="text-forest focus:ring-forest"
                      />
                      <span>No, staircase walk-up</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">
                    Floor Level
                  </label>
                  <select
                    value={floorLevel}
                    onChange={(e) => setFloorLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-cream-light border border-borderLight rounded-lg outline-none focus:border-gold"
                  >
                    <option value="Landed / Ground Floor">Landed House / Ground Floor</option>
                    <option value="1st Floor">1st Floor</option>
                    <option value="2nd Floor">2nd Floor</option>
                    <option value="3rd Floor">3rd Floor</option>
                    <option value="4th Floor or Higher (With Lift)">4th Floor or Higher (With Lift)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">
                  {t.preferredDateLabel}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-cream-light border border-borderLight rounded-lg outline-none focus:border-gold"
                  />
                </div>
                <span className="text-[10px] text-charcoal-muted mt-1 block">
                  * Preferred date is submitted as a request. Our concierge will confirm exact route scheduling with you.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">
                  Special Delivery Instructions
                </label>
                <textarea
                  rows={2}
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder={t.deliveryNotesPlaceholder}
                  className="w-full px-3.5 py-2 text-xs bg-cream-light border border-borderLight rounded-lg outline-none focus:border-gold resize-none"
                />
              </div>
            </div>

            {/* Checkbox agreements */}
            <div className="space-y-3 pt-2 text-xs text-charcoal-muted">
              <label className="flex items-start space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="mt-0.5 rounded text-forest focus:ring-forest"
                />
                <span>
                  Keep me updated on exclusive mattress privileges and seasonal VIP showroom events.
                </span>
              </label>

              <label className="flex items-start space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="mt-0.5 rounded text-forest focus:ring-forest"
                />
                <span>
                  I have read and agree to LENA SLEEP&apos;s Terms of Service and 100-Night Mattress Sleep Trial Policy.
                </span>
              </label>
            </div>
          </div>

          {/* Right Column: Sticky Order Summary */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="bg-warmwhite p-6 sm:p-8 rounded-2xl border border-borderLight shadow-card space-y-5">
              <h2 className="font-serif text-xl font-bold text-forest pb-3 border-b border-borderLight">
                {t.orderSummary} ({items.length} items)
              </h2>

              {/* Items Breakdown */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-borderLight">
                {items.map((item) => (
                  <div key={item.variantId} className="flex space-x-3 pt-3 first:pt-0">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-cream flex-shrink-0 border border-borderLight">
                      <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-charcoal truncate">{item.productName}</h4>
                      <p className="text-[11px] text-gold-dark">{item.sizeName} ({item.dimensions})</p>
                      <span className="text-[11px] text-charcoal-muted">Qty: {item.quantity}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-forest">
                        {formatMYR(item.priceSen * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Totals */}
              <div className="pt-4 border-t border-borderLight space-y-2 text-xs text-charcoal">
                <div className="flex justify-between">
                  <span>{t.subtotal}</span>
                  <span className="font-semibold">{formatMYR(subtotalSen)}</span>
                </div>

                {discountSen > 0 && (
                  <div className="flex justify-between text-sale font-semibold">
                    <span>Discount ({couponCode})</span>
                    <span>-{formatMYR(discountSen)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery ({state})</span>
                  <span className="font-semibold text-forest">
                    {shippingInfo.isFreeShipping ? 'FREE' : formatMYR(shippingInfo.shippingSen)}
                  </span>
                </div>

                <div className="pt-3 border-t border-borderLight flex items-baseline justify-between">
                  <span className="font-serif text-lg font-bold text-forest">Total Payable</span>
                  <span className="text-2xl font-bold text-forest">{formatMYR(finalTotalSen)}</span>
                </div>
              </div>

              {/* Submit to Stripe */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold uppercase tracking-wider rounded-xl shadow-card flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  <Lock className="w-4 h-4 text-gold" />
                  <span>
                    {isSubmitting ? 'Securing Session...' : `Pay ${formatMYR(finalTotalSen)} via Stripe`}
                  </span>
                </button>
              </div>

              <div className="text-[11px] text-charcoal-muted text-center space-y-1">
                <p>Protected by 256-Bit SSL Bank-Grade Encryption</p>
                <p>Card, FPX Online Banking, Apple Pay supported</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
