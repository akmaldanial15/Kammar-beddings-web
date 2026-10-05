'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Lock,
  ShoppingBag,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Tag,
  CreditCard as CardIcon,
  ShieldCheck,
  Building,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Info,
  X,
} from 'lucide-react'
import { useCart } from '@/lib/context/CartContext'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { KamaarLogo } from '@/components/brand/KamaarLogo'
import {
  formatMYR,
  calculateShippingFee,
  MALAYSIAN_STATES,
  validateMalaysianPostcode,
  validateMalaysianPhone,
} from '@/lib/utils/format'
import { PaymentSettings, PaymentMethodConfig } from '@/types'

interface CheckoutClientProps {
  initialPaymentSettings?: PaymentSettings
}

const MALAYSIAN_BANKS = [
  { id: 'mb2u', name: 'Maybank2u', popular: true },
  { id: 'cimb', name: 'CIMB Clicks', popular: true },
  { id: 'pbb', name: 'Public Bank Online', popular: true },
  { id: 'rhb', name: 'RHB Now', popular: true },
  { id: 'hlb', name: 'Hong Leong Connect', popular: true },
  { id: 'ambank', name: 'AmBank Online' },
  { id: 'bimb', name: 'Bank Islam' },
  { id: 'affina', name: 'Affin Bank' },
  { id: 'alliance', name: 'Alliance Bank' },
  { id: 'uob', name: 'UOB Malaysia' },
  { id: 'ocbc', name: 'OCBC Bank' },
  { id: 'hsbc', name: 'HSBC Malaysia' },
  { id: 'standardchartered', name: 'Standard Chartered' },
  { id: 'bsn', name: 'Bank Simpanan Nasional (BSN)' },
  { id: 'bankrakyat', name: 'Bank Rakyat' },
]

export function CheckoutClient({ initialPaymentSettings }: CheckoutClientProps) {
  const { items, subtotalSen, couponCode, applyCoupon, removeCoupon, notes, clearCart } = useCart()
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()

  const isCancelled = searchParams.get('cancelled') === 'true'

  // Payment configuration from Admin
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | undefined>(initialPaymentSettings)
  const [activeMethods, setActiveMethods] = useState<PaymentMethodConfig[]>(
    initialPaymentSettings?.methods?.filter((m) => m.enabled) || []
  )
  const [selectedMethodId, setSelectedMethodId] = useState<string>(
    initialPaymentSettings?.defaultMethodId ||
      initialPaymentSettings?.methods?.find((m) => m.enabled)?.id ||
      'pay-credit-card'
  )

  // Fetch updated methods on mount if not provided or to ensure fresh status
  useEffect(() => {
    async function loadFreshMethods() {
      try {
        const res = await fetch('/api/payment-methods')
        if (res.ok) {
          const data = await res.json()
          if (data.methods) {
            setActiveMethods(data.methods)
            if (!selectedMethodId || !data.methods.some((m: any) => m.id === selectedMethodId)) {
              setSelectedMethodId(data.defaultMethodId || data.methods[0]?.id)
            }
          }
        }
      } catch (err) {
        console.error('Failed to load payment methods:', err)
      }
    }
    loadFreshMethods()
  }, [])

  // Form states matching Getha / Shopify layout
  const [contactInfo, setContactInfo] = useState('')
  const [newsletterConsent, setNewsletterConsent] = useState(true)
  const [country, setCountry] = useState('Malaysia')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [company, setCompany] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('Selangor')
  const [postcode, setPostcode] = useState('')
  const [phone, setPhone] = useState('')
  const [saveInfoForNextTime, setSaveInfoForNextTime] = useState(true)
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true)

  // White-glove installation fields (essential for mattresses)
  const [hasLiftAccess, setHasLiftAccess] = useState(true)
  const [floorLevel, setFloorLevel] = useState('Ground Floor')
  const [deliveryNotes, setDeliveryNotes] = useState(notes || '')

  // Inline Card States (simulated / stripe client token)
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [cardName, setCardName] = useState('')

  // FPX Selected Bank
  const [selectedBank, setSelectedBank] = useState('mb2u')

  // Coupon input state in right sidebar
  const [inputCoupon, setInputCoupon] = useState('')
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [affiliateCode, setAffiliateCode] = useState('')

  // Load affiliate referral attribution
  useEffect(() => {
    try {
      const stored = localStorage.getItem('kamaar_ref')
      if (stored) {
        setAffiliateCode(stored.trim().toUpperCase())
      } else {
        const match = document.cookie.match(/(?:^|;\s*)kamaar_ref=([^;]+)/)
        if (match && match[1]) {
          setAffiliateCode(decodeURIComponent(match[1]).trim().toUpperCase())
        }
      }
    } catch {
      // Private browsing protection
    }
  }, [])

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
  if ((couponCode === 'KAMAAR100' || couponCode === 'TIER100') && subtotalSen >= 100000) {
    discountSen = 10000
  } else if (couponCode === 'LENAWELCOME' && subtotalSen >= 100000) {
    discountSen = Math.min(50000, Math.round(subtotalSen * 0.1))
  } else if (couponCode === 'SLEEPVIP' && subtotalSen >= 300000) {
    discountSen = Math.min(80000, Math.round(subtotalSen * 0.15))
  }

  const finalTotalSen = Math.max(0, subtotalSen - discountSen + shippingInfo.shippingSen)

  // Selected Payment Method Object
  const selectedMethod = activeMethods.find((m) => m.id === selectedMethodId) || activeMethods[0]

  // Handle Apply Coupon
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    setCouponError('')
    setCouponSuccess('')

    const code = inputCoupon.trim().toUpperCase()
    if (!code) return

    const validCodes = ['KAMAAR100', 'LENAWELCOME', 'TIER100', 'SLEEPVIP', 'FREESHIP']
    if (validCodes.includes(code)) {
      applyCoupon(code)
      setCouponSuccess(`Baucar "${code}" berjaya ditebus!`)
      setInputCoupon('')
    } else {
      setCouponError('Kod diskaun tidak sah atau telah tamat tempoh.')
    }
  }

  // Handle Order Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (items.length === 0) {
      setErrorMessage('Troli anda kosong.')
      return
    }

    if (!contactInfo || !contactInfo.trim()) {
      setErrorMessage('Sila masukkan alamat emel atau nombor telefon di bahagian Contact.')
      return
    }

    if (!lastName || !lastName.trim()) {
      setErrorMessage('Sila masukkan Nama Akhir (Last name).')
      return
    }

    if (!addressLine1 || !addressLine1.trim()) {
      setErrorMessage('Sila masukkan alamat penghantaran anda.')
      return
    }

    if (!postcode || !validateMalaysianPostcode(postcode)) {
      setErrorMessage('Sila masukkan 5-digit poskod Malaysia yang sah (cth: 50450).')
      return
    }

    const effectivePhone = phone.trim() || (contactInfo.includes('@') ? '' : contactInfo.trim())
    if (effectivePhone && !validateMalaysianPhone(effectivePhone)) {
      setErrorMessage('Sila masukkan nombor telefon Malaysia yang sah (cth: 012 345 6789).')
      return
    }

    const effectiveEmail = contactInfo.includes('@')
      ? contactInfo.trim().toLowerCase()
      : `guest_${Date.now()}@kamaar.my`

    const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ') || 'Pelanggan KAMAAR'

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
            fullName,
            email: effectiveEmail,
            phone: effectivePhone || '0123456789',
          },
          shippingAddress: {
            addressLine1: [addressLine1.trim(), company.trim() ? `(${company.trim()})` : '']
              .filter(Boolean)
              .join(', '),
            addressLine2: addressLine2.trim() || undefined,
            city: city.trim() || 'Kuala Lumpur',
            state,
            postcode: postcode.trim(),
            country: 'Malaysia',
          },
          deliveryDetails: {
            notes: deliveryNotes.trim() || undefined,
            hasLiftAccess,
            floorLevel,
          },
          couponCode: couponCode || undefined,
          affiliateCode: affiliateCode.trim() || undefined,
          paymentMethodId: selectedMethod?.id,
          paymentProvider: selectedMethod?.providerType || 'credit_card',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(data.error || 'Gagal memulakan sesi pembayaran.')
        setIsSubmitting(false)
        return
      }

      // Clear client cart after session persistence
      clearCart()

      // Redirect to payment gateway URL or local development sandbox
      window.location.href = data.checkoutUrl
    } catch (err: any) {
      console.error('Checkout error:', err)
      setErrorMessage('Ralat sambungan rangkaian semasa menghantar pesanan. Sila cuba lagi.')
      setIsSubmitting(false)
    }
  }

  // Render Badge Icons
  const renderBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case 'visa':
        return (
          <span
            key={type}
            className="px-1.5 py-0.5 rounded text-[10px] font-black tracking-tighter bg-[#1A1F71] text-white border border-[#1A1F71]"
          >
            VISA
          </span>
        )
      case 'mastercard':
        return (
          <span
            key={type}
            className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#EB001B] text-white flex items-center space-x-0.5"
          >
            <span className="w-2 h-2 rounded-full bg-[#EB001B] inline-block" />
            <span className="w-2 h-2 rounded-full bg-[#F79E1B] -ml-1 inline-block" />
          </span>
        )
      case 'amex':
        return (
          <span
            key={type}
            className="px-1.5 py-0.5 rounded text-[10px] font-black bg-[#2E77BB] text-white border border-[#2E77BB]"
          >
            AMEX
          </span>
        )
      case 'atome':
        return (
          <span
            key={type}
            className="px-2 py-0.5 rounded text-[10px] font-black bg-[#E2F700] text-black tracking-tight"
          >
            atome
          </span>
        )
      case 'fpx':
        return (
          <span
            key={type}
            className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#00529C] text-white tracking-wider"
          >
            FPX
          </span>
        )
      case 'tng':
        return (
          <span
            key={type}
            className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#015CA9] text-white"
          >
            TNG
          </span>
        )
      case 'grabpay':
        return (
          <span
            key={type}
            className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#00B140] text-white"
          >
            GrabPay
          </span>
        )
      case 'boost':
        return (
          <span
            key={type}
            className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#ED1C24] text-white"
          >
            Boost
          </span>
        )
      case 'duitnow':
        return (
          <span
            key={type}
            className="px-2 py-0.5 rounded text-[10px] font-black bg-[#ED1A3B] text-white tracking-tight"
          >
            DuitNow
          </span>
        )
      default:
        return (
          <span
            key={type}
            className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-neutral-200 text-neutral-800"
          >
            {type}
          </span>
        )
    }
  }

  if (items.length === 0 && !isSubmitting) {
    return (
      <div className="py-24 text-center bg-warmwhite min-h-[70vh] flex flex-col items-center justify-center space-y-4 px-4 font-sans">
        <div className="w-16 h-16 rounded-full bg-forest/10 text-forest flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-gold" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
          Troli Beli-Belah Anda Kosong
        </h2>
        <p className="text-xs text-charcoal-muted max-w-md">
          Anda belum menambah sebarang tilam atau aksesori ke dalam troli anda.
        </p>
        <Link
          href="/collections/mattress"
          className="px-6 py-3 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold rounded-xl transition-all shadow-sm"
        >
          Lihat Koleksi Tilam KAMAAR
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-[#333333] font-sans antialiased">
      {/* ========================================================================= */}
      {/* 1. TOP MINIMALIST HEADER (Getha / Shopify Style)                         */}
      {/* ========================================================================= */}
      <header className="border-b border-[#E6E6E6] bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="block">
            <KamaarLogo variant="horizontal" size="sm" theme="light" />
          </Link>

          <Link
            href="/cart"
            className="p-2 text-charcoal hover:text-forest transition-colors relative flex items-center"
            title="Kembali ke Troli"
          >
            <ShoppingBag className="w-5 h-5 text-forest" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-forest text-warmwhite text-[10px] font-bold flex items-center justify-center">
              {items.reduce((sum, i) => sum + i.quantity, 0)}
            </span>
          </Link>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. TWO-COLUMN CHECKOUT LAYOUT (Exact Getha Style)                        */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-64px)]">
          {/* --------------------------------------------------------------------- */}
          {/* LEFT COLUMN: Customer, Shipping & Payment Form (Span 7)              */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-7 py-8 lg:py-12 lg:pr-12 xl:pr-16 space-y-8">
            {/* Express Checkout (Google Pay / Apple Pay) */}
            {paymentSettings?.expressCheckoutEnabled !== false && (
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-xs text-neutral-500 font-medium">Express checkout</span>
                </div>

                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full max-w-sm py-3 px-6 bg-black hover:bg-neutral-900 active:scale-[0.99] text-white rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-xs cursor-pointer"
                  >
                    <span className="font-sans font-black text-sm tracking-tight">G Pay</span>
                  </button>
                </div>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-[#E6E6E6] w-full" />
                  <span className="bg-white px-3 text-xs text-neutral-400 uppercase font-medium absolute">
                    OR
                  </span>
                </div>
              </div>
            )}

            {/* Error notifications */}
            {isCancelled && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 text-amber-900 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Sesi pembayaran sebelum ini telah dibatalkan. Anda boleh menyemak semula butiran anda di bawah.</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 bg-red-50 rounded-xl border border-red-300 text-sale text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* SECTION: Contact */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-neutral-900">Contact</h2>
                  <Link
                    href="/account/login"
                    className="text-xs text-[#1E4E8C] hover:underline font-semibold"
                  >
                    Sign in
                  </Link>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    required
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="Email or mobile phone number"
                    className="w-full px-3.5 py-3 rounded-xl border border-[#D9D9D9] text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#1E4E8C] focus:ring-1 focus:ring-[#1E4E8C] transition-all"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 cursor-help" title="Kami akan menghantar nombor penjejakan dan resit pesanan ke sini.">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                </div>

                <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-neutral-700">
                  <input
                    type="checkbox"
                    checked={newsletterConsent}
                    onChange={(e) => setNewsletterConsent(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#1E4E8C]"
                  />
                  <span>Email me with news and offers</span>
                </label>
              </div>

              {/* SECTION: Delivery Address */}
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-neutral-900">Delivery</h2>

                {/* Country / Region */}
                <div>
                  <label className="text-[11px] text-neutral-500 font-medium block mb-1">
                    Country/Region
                  </label>
                  <div className="relative">
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl border border-[#D9D9D9] text-sm text-neutral-900 bg-neutral-50 outline-none focus:border-[#1E4E8C] appearance-none"
                    >
                      <option value="Malaysia">Malaysia</option>
                      <option value="Singapore">Singapore (Hubungi Concierge)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name (optional)"
                    className="w-full px-3.5 py-3 rounded-xl border border-[#D9D9D9] text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#1E4E8C] transition-all"
                  />
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="w-full px-3.5 py-3 rounded-xl border border-[#D9D9D9] text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#1E4E8C] transition-all"
                  />
                </div>

                {/* Company */}
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company (optional)"
                  className="w-full px-3.5 py-3 rounded-xl border border-[#D9D9D9] text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#1E4E8C] transition-all"
                />

                {/* Address */}
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="Address"
                  className="w-full px-3.5 py-3 rounded-xl border border-[#D9D9D9] text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#1E4E8C] transition-all"
                />

                {/* Apartment, suite, etc. */}
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Apartment, suite, etc. (optional)"
                  className="w-full px-3.5 py-3 rounded-xl border border-[#D9D9D9] text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#1E4E8C] transition-all"
                />

                {/* Postcode, City, State Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder="Postcode"
                    className="w-full px-3.5 py-3 rounded-xl border border-[#D9D9D9] text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#1E4E8C] font-mono transition-all"
                  />

                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full px-3.5 py-3 rounded-xl border border-[#D9D9D9] text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#1E4E8C] transition-all"
                  />

                  <div className="relative">
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl border border-[#D9D9D9] text-sm text-neutral-900 bg-white outline-none focus:border-[#1E4E8C] appearance-none"
                    >
                      {MALAYSIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Phone */}
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone"
                    className="w-full px-3.5 py-3 rounded-xl border border-[#D9D9D9] text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#1E4E8C] transition-all"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 cursor-help" title="Diperlukan untuk koordinasi lori penghantaran tilam.">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                </div>

                {/* Lift Access & Floor level for bulky mattresses */}
                {hasBulkyMattress && (
                  <div className="p-4 bg-cream/40 rounded-xl border border-[#E6E6E6] space-y-3 text-xs">
                    <span className="font-bold text-forest block">
                      🚚 Maklumat Pemasangan Tilam KAMAAR (White-Glove Setup)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-neutral-500 block mb-1">
                          Akses Lif di Kediaman Anda
                        </label>
                        <select
                          value={hasLiftAccess ? 'yes' : 'no'}
                          onChange={(e) => setHasLiftAccess(e.target.value === 'yes')}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-[#D9D9D9]"
                        >
                          <option value="yes">Ada Lif Penumpang / Servis</option>
                          <option value="no">Tiada Lif (Naik Tangga Manual)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-neutral-500 block mb-1">
                          Aras Tingkat Bilik Tidur
                        </label>
                        <input
                          type="text"
                          value={floorLevel}
                          onChange={(e) => setFloorLevel(e.target.value)}
                          placeholder="cth: Tingkat 2 / Ground Floor"
                          className="w-full px-3 py-2 bg-white rounded-lg border border-[#D9D9D9]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Save info for next time checkbox */}
                <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-neutral-700 pt-1">
                  <input
                    type="checkbox"
                    checked={saveInfoForNextTime}
                    onChange={(e) => setSaveInfoForNextTime(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#1E4E8C]"
                  />
                  <span>Save this information for next time</span>
                </label>
              </div>

              {/* SECTION: Shipping Method */}
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-neutral-900">Shipping method</h2>

                <div className="p-4 rounded-xl border border-[#D9D9D9] bg-white flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full border-4 border-[#1E4E8C] bg-white" />
                    <div>
                      <span className="text-sm font-semibold text-neutral-900 block">
                        {shippingInfo.isComplimentary
                          ? 'Complimentary White-Glove In-Home Setup'
                          : 'Penghantaran Terus Semenanjung'}
                      </span>
                      <span className="text-xs text-neutral-500 block">
                        {shippingInfo.isComplimentary
                          ? 'Pemasangan percuma di bilik tidur anda • 3-7 hari bekerja'
                          : 'Penghantaran standard berinsurans'}
                      </span>
                    </div>
                  </div>

                  <span className="text-sm font-bold text-forest">
                    {shippingInfo.shippingSen === 0 ? 'Free' : formatMYR(shippingInfo.shippingSen)}
                  </span>
                </div>
              </div>

              {/* SECTION: Payment Accordion (Getha / Shopify Style) */}
              <div className="space-y-3">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Payment</h2>
                  <p className="text-xs text-neutral-500">
                    All transactions are secure and encrypted.
                  </p>
                </div>

                <div className="rounded-xl border border-[#D9D9D9] overflow-hidden divide-y divide-[#D9D9D9] bg-white">
                  {activeMethods.map((method) => {
                    const isSelected = selectedMethodId === method.id

                    return (
                      <div key={method.id} className="transition-colors">
                        {/* Header Row */}
                        <label
                          className={`flex items-center justify-between p-4 cursor-pointer select-none transition-colors ${
                            isSelected ? 'bg-[#F4F7FB]' : 'hover:bg-neutral-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3 min-w-0 pr-2">
                            <input
                              type="radio"
                              name="paymentMethod"
                              checked={isSelected}
                              onChange={() => setSelectedMethodId(method.id)}
                              className="w-4 h-4 accent-[#1E4E8C] shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="text-sm font-semibold text-neutral-900 block truncate">
                                {method.name}
                              </span>
                              {method.subtitle && (
                                <span className="text-[11px] text-neutral-500 block truncate">
                                  {method.subtitle}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Badges / Logos on right */}
                          {method.badgeIcons && method.badgeIcons.length > 0 && (
                            <div className="flex items-center space-x-1 shrink-0">
                              {method.badgeIcons.map((b) => renderBadge(b))}
                            </div>
                          )}
                        </label>

                        {/* Expanded Content Subcard when selected */}
                        {isSelected && (
                          <div className="p-4 sm:p-5 bg-[#F9FAFC] border-t border-[#D9D9D9] space-y-4 animate-in fade-in duration-200">
                            {/* CASE 1: Credit Card inline fields */}
                            {method.providerType === 'credit_card' && (
                              <div className="space-y-3 max-w-md mx-auto">
                                <div className="relative">
                                  <input
                                    type="text"
                                    maxLength={19}
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    placeholder="Card number"
                                    className="w-full px-3.5 py-3 rounded-xl border border-[#D9D9D9] text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#1E4E8C] bg-white font-mono"
                                  />
                                  <Lock className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <input
                                    type="text"
                                    maxLength={5}
                                    value={cardExpiry}
                                    onChange={(e) => setCardExpiry(e.target.value)}
                                    placeholder="Expiration date (MM / YY)"
                                    className="w-full px-3.5 py-3 rounded-xl border border-[#D9D9D9] text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#1E4E8C] bg-white font-mono"
                                  />
                                  <div className="relative">
                                    <input
                                      type="password"
                                      maxLength={4}
                                      value={cardCvc}
                                      onChange={(e) => setCardCvc(e.target.value)}
                                      placeholder="Security code"
                                      className="w-full px-3.5 py-3 rounded-xl border border-[#D9D9D9] text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#1E4E8C] bg-white font-mono"
                                    />
                                    <HelpCircle className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 cursor-help" title="3-digit nombor di belakang kad anda" />
                                  </div>
                                </div>

                                <input
                                  type="text"
                                  value={cardName}
                                  onChange={(e) => setCardName(e.target.value)}
                                  placeholder="Name on card"
                                  className="w-full px-3.5 py-3 rounded-xl border border-[#D9D9D9] text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#1E4E8C] bg-white"
                                />

                                <label className="flex items-center space-x-2 cursor-pointer text-xs text-neutral-700 pt-1">
                                  <input
                                    type="checkbox"
                                    checked={useShippingAsBilling}
                                    onChange={(e) => setUseShippingAsBilling(e.target.checked)}
                                    className="w-4 h-4 rounded accent-[#1E4E8C]"
                                  />
                                  <span>Use shipping address as billing address</span>
                                </label>
                              </div>
                            )}

                            {/* CASE 2: Atome BNPL 3x Installment Calculator */}
                            {method.providerType === 'atome_bnpl' && (
                              <div className="p-4 bg-white rounded-xl border border-[#D9D9D9] space-y-3">
                                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                                  <span className="text-xs font-bold text-neutral-800">
                                    Pelan Ansuran Atome 3x Bulan (0% Interest)
                                  </span>
                                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#E2F700] text-black">
                                    0% FAEDAH
                                  </span>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-center">
                                  <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                                    <span className="text-[10px] text-neutral-500 block">Hari Ini</span>
                                    <span className="text-xs font-bold text-forest block">
                                      {formatMYR(Math.round(finalTotalSen / 3))}
                                    </span>
                                  </div>
                                  <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                                    <span className="text-[10px] text-neutral-500 block">Bulan 2 (30 Hari)</span>
                                    <span className="text-xs font-bold text-neutral-800 block">
                                      {formatMYR(Math.round(finalTotalSen / 3))}
                                    </span>
                                  </div>
                                  <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                                    <span className="text-[10px] text-neutral-500 block">Bulan 3 (60 Hari)</span>
                                    <span className="text-xs font-bold text-neutral-800 block">
                                      {formatMYR(finalTotalSen - 2 * Math.round(finalTotalSen / 3))}
                                    </span>
                                  </div>
                                </div>

                                <p className="text-[11px] text-neutral-600 leading-relaxed">
                                  {method.instructions ||
                                    'Anda akan dibawa ke portal selamat Atome untuk melengkapkan pengesahan identiti dan pelan ansuran 3 bulan 0% anda.'}
                                </p>
                              </div>
                            )}

                            {/* CASE 3: FPX Online Banking Bank Selector */}
                            {(method.providerType === 'payex' || method.providerType === 'eghl' || method.providerType === 'fpx') && (
                              <div className="space-y-3">
                                <span className="text-xs font-semibold text-neutral-800 block">
                                  Pilih Perbankan Internet (FPX) Anda:
                                </span>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                  {MALAYSIAN_BANKS.slice(0, 6).map((bank) => (
                                    <button
                                      key={bank.id}
                                      type="button"
                                      onClick={() => setSelectedBank(bank.id)}
                                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                                        selectedBank === bank.id
                                          ? 'bg-[#1E4E8C] text-white border-[#1E4E8C] shadow-xs'
                                          : 'bg-white text-neutral-800 border-[#D9D9D9] hover:bg-neutral-50'
                                      }`}
                                    >
                                      {bank.name}
                                    </button>
                                  ))}
                                </div>

                                <p className="text-[11px] text-neutral-500 leading-relaxed pt-1">
                                  {method.instructions ||
                                    'Selepas menekan butang "Pay now", anda akan dibawa ke gerbang perbankan selamat untuk log masuk ke akaun bank pilihan anda.'}
                                </p>
                              </div>
                            )}

                            {/* CASE 4: DuitNow QR & Manual Bank Transfer */}
                            {method.providerType === 'duitnow_qr' && (
                              <div className="p-4 bg-white rounded-xl border border-[#D9D9D9] space-y-3">
                                <div className="flex items-center space-x-2 text-forest font-bold text-xs">
                                  <Building className="w-4 h-4 text-gold" />
                                  <span>Akaun Rasmi KAMAAR BEDDINGS SDN BHD</span>
                                </div>

                                <div className="bg-cream/40 p-3 rounded-lg border border-borderLight text-xs space-y-1 font-mono">
                                  <div>Bank: <strong className="text-forest">Maybank Berhad</strong></div>
                                  <div>No. Akaun: <strong className="text-forest">5123 4567 8901</strong></div>
                                  <div>Penerima: <strong className="text-forest">KAMAAR BEDDINGS SDN BHD</strong></div>
                                </div>

                                <p className="text-[11px] text-neutral-600 leading-relaxed">
                                  {method.instructions ||
                                    'Sila buat pindahan dana melalui aplikasi perbankan anda atau imbas DuitNow QR. Resit boleh dihantar kepada Concierge KAMAAR di WhatsApp.'}
                                </p>
                              </div>
                            )}

                            {/* CASE 5: Custom Instructions */}
                            {method.providerType === 'cod' && (
                              <div className="p-4 bg-white rounded-xl border border-[#D9D9D9] space-y-2 text-xs">
                                <span className="font-bold text-forest block">
                                  💵 Pembayaran Semasa Penghantaran (COD / White-Glove Delivery)
                                </span>
                                <p className="text-[11px] text-neutral-600 leading-relaxed">
                                  {method.description ||
                                    'Anda boleh membayar baki pesanan secara tunai atau pindahan bank DuitNow terus kepada kru pemasangan KAMAAR selepas tilam diletakkan di bilik tidur anda.'}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* SECTION: Primary Submit Button */}
              <div className="space-y-4 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-8 bg-[#1E4E8C] hover:bg-[#13325B] active:scale-[0.99] text-white text-base font-bold rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-[#D4AF37]" />
                  <span>
                    {isSubmitting ? 'Processing Payment...' : 'Pay now'}
                  </span>
                </button>

                <div className="flex items-center justify-center space-x-2 text-[11px] text-neutral-500 text-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Sesi bayaran dilindungi dengan standard keselamatan antarabangsa PCI-DSS &amp; TLS 256-bit.
                  </span>
                </div>
              </div>

              {/* SECTION: Legal Footer Links */}
              <div className="pt-8 border-t border-[#E6E6E6] flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-[#1E4E8C]">
                <Link href="/pages/refund-policy" className="hover:underline">
                  Refund policy
                </Link>
                <Link href="/pages/shipping-policy" className="hover:underline">
                  Shipping policy
                </Link>
                <Link href="/pages/privacy-policy" className="hover:underline">
                  Privacy policy
                </Link>
                <Link href="/pages/terms-of-service" className="hover:underline">
                  Terms of service
                </Link>
              </div>
            </form>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* RIGHT COLUMN: Order Summary & Coupon Code (Span 5)                   */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-5 bg-[#FAFAFA] border-t lg:border-t-0 lg:border-l border-[#E6E6E6] py-8 lg:py-12 lg:pl-10 xl:pl-12">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Product Line Items */}
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.variantId} className="flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-3.5 min-w-0">
                      {/* Image Thumbnail with Quantity Badge */}
                      <div className="relative w-16 h-16 rounded-xl border border-[#E6E6E6] bg-white overflow-hidden shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-cream flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-gold" />
                          </div>
                        )}
                        {/* Quantity Badge Overlay */}
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-neutral-700 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                          {item.quantity}
                        </span>
                      </div>

                      {/* Product Title & Variant */}
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-bold text-neutral-900 block truncate">
                          {item.title}
                        </span>
                        <span className="text-xs text-neutral-500 block truncate">
                          {item.variantName || 'Single (90x190cm)'}
                        </span>
                      </div>
                    </div>

                    {/* Line Total */}
                    <span className="text-sm font-semibold text-neutral-900 shrink-0">
                      {formatMYR(item.priceSen * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Discount Code Input */}
              <div className="pt-4 border-t border-[#E6E6E6] space-y-2">
                <form onSubmit={handleApplyCoupon} className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      placeholder="Discount code"
                      className="w-full px-3.5 py-3 rounded-xl border border-[#D9D9D9] text-sm text-neutral-900 placeholder-neutral-400 bg-white outline-none focus:border-[#1E4E8C] uppercase font-mono transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-400 text-neutral-800 text-sm font-bold transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {couponError && (
                  <p className="text-xs text-sale font-medium">{couponError}</p>
                )}
                {couponSuccess && (
                  <p className="text-xs text-emerald-700 font-medium">{couponSuccess}</p>
                )}

                {/* Applied coupon badge */}
                {couponCode && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <div className="flex items-center space-x-1.5 text-emerald-800 font-bold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{couponCode}</span>
                      <span className="text-emerald-600 font-normal">(-{formatMYR(discountSen)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCoupon()}
                      className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
                      title="Buang kupon"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Pricing Breakdown */}
              <div className="pt-4 border-t border-[#E6E6E6] space-y-2.5 text-sm">
                <div className="flex items-center justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-neutral-900">{formatMYR(subtotalSen)}</span>
                </div>

                <div className="flex items-center justify-between text-neutral-600">
                  <span className="flex items-center space-x-1">
                    <span>Shipping</span>
                    <HelpCircle className="w-3.5 h-3.5 text-neutral-400" title="Penghantaran percuma untuk tilam Semenanjung Malaysia" />
                  </span>
                  <span className="font-medium text-neutral-900">
                    {shippingInfo.shippingSen === 0 ? 'Free' : formatMYR(shippingInfo.shippingSen)}
                  </span>
                </div>

                {discountSen > 0 && (
                  <div className="flex items-center justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>-{formatMYR(discountSen)}</span>
                  </div>
                )}

                {/* Total Row (Getha Style) */}
                <div className="pt-4 border-t border-[#E6E6E6] flex items-center justify-between">
                  <span className="text-base font-bold text-neutral-900">Total</span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-xs text-neutral-500 font-normal">MYR</span>
                    <span className="text-2xl font-black text-neutral-900">
                      {formatMYR(finalTotalSen)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="p-4 rounded-2xl bg-white border border-[#E6E6E6] space-y-2 text-xs text-neutral-600">
                <div className="flex items-center space-x-2 text-forest font-bold">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span>Jaminan Tidur KAMAAR Beddings</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Semua tilam dilindungi oleh <strong>Jaminan Terhad Tempatan 10-Tahun</strong> dan <strong>Percubaan Tidur 100-Malam</strong> di rumah anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
