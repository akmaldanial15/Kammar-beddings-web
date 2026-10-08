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
  ArrowLeft,
  Check,
  Copy,
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
  { id: 'pbb', name: 'Public Bank', popular: true },
  { id: 'rhb', name: 'RHB Now', popular: true },
  { id: 'hlb', name: 'Hong Leong Connect', popular: true },
  { id: 'ambank', name: 'AmBank Online', popular: true },
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
    initialPaymentSettings?.defaultMethodId || 'pay-fpx'
  )

  // Fetch updated methods on mount if not provided or to ensure fresh status
  useEffect(() => {
    async function loadFreshMethods() {
      try {
        const res = await fetch('/api/payment-methods')
        if (res.ok) {
          const data = await res.json()
          if (data.methods) {
            // Strictly enforce only FPX and TNG
            const allowed = data.methods.filter(
              (m: any) => m.id === 'pay-fpx' || m.id === 'pay-tng' || m.providerType === 'fpx' || m.providerType === 'tng'
            )
            if (allowed.length > 0) {
              setActiveMethods(allowed)
              if (!allowed.some((m: any) => m.id === selectedMethodId)) {
                setSelectedMethodId(allowed[0].id)
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to load payment methods:', err)
      }
    }
    loadFreshMethods()
  }, [])

  // Form states
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

  // Inline Card States
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
  const [copiedBank, setCopiedBank] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [affiliateCode, setAffiliateCode] = useState('')

  // Format credit card number with spaces
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ')
    setCardNumber(formatted)
  }

  // Format expiry date with slash
  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4)
    if (raw.length >= 2) {
      raw = raw.slice(0, 2) + ' / ' + raw.slice(2)
    }
    setCardExpiry(raw)
  }

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
      i.sku?.includes('RH') ||
      i.sku?.includes('CN') ||
      i.sku?.includes('OR') ||
      i.sku?.includes('EC') ||
      i.sku?.includes('SL') ||
      i.sku?.includes('CS') ||
      i.sku?.includes('NF') ||
      i.sku?.includes('LC') ||
      i.sku?.includes('CP') ||
      i.sku?.includes('MS') ||
      i.sku?.includes('DS') ||
      i.sku?.includes('CF') ||
      (i.productName || i.title || '').toLowerCase().includes('tilam') ||
      (i.productName || i.title || '').toLowerCase().includes('mattress')
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

  const handleCopyBankAccount = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('512345678901')
      setCopiedBank(true)
      setTimeout(() => setCopiedBank(false), 2000)
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
      setErrorMessage('Sila masukkan alamat emel atau nombor telefon di bahagian Maklumat Hubungan.')
      return
    }

    if (!lastName || !lastName.trim()) {
      setErrorMessage('Sila masukkan Nama Akhir (Last Name).')
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
            className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider bg-[#1A1F71] text-white border border-[#1A1F71] shadow-2xs"
          >
            VISA
          </span>
        )
      case 'mastercard':
        return (
          <span
            key={type}
            className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#111] text-white flex items-center space-x-1 border border-neutral-300 shadow-2xs"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#EB001B] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#F79E1B] -ml-1.5 inline-block opacity-90" />
            <span className="text-[9px] font-extrabold ml-1">MC</span>
          </span>
        )
      case 'amex':
        return (
          <span
            key={type}
            className="px-2 py-0.5 rounded text-[10px] font-black bg-[#0070CE] text-white border border-[#0070CE] shadow-2xs"
          >
            AMEX
          </span>
        )
      case 'atome':
        return (
          <span
            key={type}
            className="px-2 py-0.5 rounded text-[10px] font-black bg-[#E2F700] text-black tracking-tight border border-[#D5E800] shadow-2xs"
          >
            atome
          </span>
        )
      case 'fpx':
        return (
          <span
            key={type}
            className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#00529C] text-white tracking-wider border border-[#00529C] shadow-2xs"
          >
            FPX
          </span>
        )
      case 'tng':
        return (
          <span
            key={type}
            className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#015CA9] text-white border border-[#015CA9]"
          >
            TNG eWallet
          </span>
        )
      case 'grabpay':
        return (
          <span
            key={type}
            className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00B140] text-white border border-[#00B140]"
          >
            GrabPay
          </span>
        )
      case 'duitnow':
        return (
          <span
            key={type}
            className="px-2 py-0.5 rounded text-[10px] font-black bg-[#ED1A3B] text-white tracking-tight border border-[#ED1A3B]"
          >
            DuitNow
          </span>
        )
      default:
        return (
          <span
            key={type}
            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-200 text-neutral-800"
          >
            {type}
          </span>
        )
    }
  }

  // Fallback product image if missing or empty
  const defaultProductImage = '/images/products/tilam-toto-queen.jpg'

  if (items.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#222] font-sans flex flex-col justify-center items-center py-20 px-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#E8E2D8] shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-cream text-forest mx-auto flex items-center justify-center border border-borderLight">
            <ShoppingBag className="w-8 h-8 text-gold" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-forest">
              Troli Beli-Belah Anda Kosong
            </h2>
            <p className="text-sm text-charcoal-muted leading-relaxed">
              Anda belum menambah sebarang tilam atau aksesori mewah ke dalam troli anda.
            </p>
          </div>
          <Link
            href="/collections/mattress"
            className="w-full inline-flex items-center justify-center py-3.5 px-6 bg-forest hover:bg-forest-dark text-warmwhite text-sm font-bold rounded-xl transition-all shadow-md group"
          >
            <span>Terokai Koleksi Tilam KAMAAR</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2A26] font-sans antialiased selection:bg-gold/20 selection:text-forest">
      {/* ========================================================================= */}
      {/* 1. BESPOKE LUXURY ATELIER CHECKOUT HEADER (DISTRACTION-FREE)             */}
      {/* ========================================================================= */}
      <header className="border-b border-[#E8E2D8] bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Left: Back to Cart Button */}
          <Link
            href="/cart"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-charcoal-muted hover:text-forest py-2 px-3 rounded-lg hover:bg-stone-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-forest" />
            <span className="hidden sm:inline">Kembali ke Troli</span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cream text-forest text-[11px] font-bold border border-borderLight">
              {items.reduce((sum, i) => sum + i.quantity, 0)}
            </span>
          </Link>

          {/* Center: Kamaar Logo & Atelier Subtitle */}
          <div className="flex flex-col items-center">
            <Link href="/" className="block">
              <KamaarLogo variant="horizontal" size="md" theme="light" />
            </Link>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold/90 mt-0.5">
              Atelier Secure Checkout
            </span>
          </div>

          {/* Right: Security Guarantee Badge */}
          <div className="flex items-center space-x-2 text-right">
            <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
              <Lock className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="hidden md:block text-left">
              <span className="text-[11px] font-bold text-forest block leading-none">
                256-Bit SSL Enkripsi
              </span>
              <span className="text-[10px] text-charcoal-muted block mt-0.5">
                Patuh Piawaian PCI-DSS
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. PROGRESS STEPPER BAR                                                   */}
      {/* ========================================================================= */}
      <div className="bg-[#FAF7F2] border-b border-[#E8E2D8] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <nav className="flex items-center space-x-2 sm:space-x-4 text-xs font-medium text-charcoal-muted">
            <Link href="/cart" className="hover:text-forest flex items-center space-x-1.5 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>1. Troli</span>
            </Link>
            <span className="text-neutral-300">/</span>
            <span className="flex items-center space-x-1.5 text-forest font-bold">
              <span className="w-4 h-4 rounded-full bg-forest text-warmwhite text-[10px] flex items-center justify-center">
                2
              </span>
              <span>Penghantaran &amp; Pembayaran</span>
            </span>
            <span className="text-neutral-300">/</span>
            <span className="flex items-center space-x-1.5 text-charcoal-muted/60">
              <span className="w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-[10px] flex items-center justify-center">
                3
              </span>
              <span>Pengesahan Selesai</span>
            </span>
          </nav>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TWO-COLUMN BESPOKE CHECKOUT LAYOUT                                    */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* --------------------------------------------------------------------- */}
          {/* LEFT COLUMN: Checkout Form (7 Columns)                               */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-7 space-y-8">
            {/* Express Checkout Module */}
            {paymentSettings?.expressCheckoutEnabled !== false && (
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8E2D8] shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-charcoal-muted flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-gold" />
                    Express Checkout
                  </span>
                  <span className="text-[11px] text-charcoal-muted">Pembayaran Pantas 1-Klik</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMethodId('pay-fpx')
                      const el = document.getElementById('payment-section')
                      el?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="w-full py-3.5 px-4 bg-[#00529C] hover:bg-[#00417C] active:scale-[0.99] text-white rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-xs cursor-pointer"
                  >
                    <span className="font-mono font-black text-sm tracking-wider">FPX</span>
                    <span className="text-[11px] text-sky-100 font-normal">| Perbankan Internet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMethodId('pay-tng')
                      const el = document.getElementById('payment-section')
                      el?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="w-full py-3.5 px-4 bg-[#015CA9] hover:bg-[#004c8c] active:scale-[0.99] text-white rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-xs cursor-pointer"
                  >
                    <span className="font-sans font-black text-sm tracking-tight text-white">TNG</span>
                    <span className="text-[11px] text-sky-100 font-normal">| Touch &apos;n Go eWallet</span>
                  </button>
                </div>

                <div className="relative flex items-center justify-center pt-2">
                  <div className="border-t border-[#E8E2D8] w-full" />
                  <span className="bg-white px-3 text-[11px] font-bold text-charcoal-muted uppercase tracking-wider absolute">
                    Atau Teruskan dengan Butiran Anda
                  </span>
                </div>
              </div>
            )}

            {/* Error notifications */}
            {isCancelled && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
                <span>Sesi pembayaran sebelum ini telah dibatalkan. Anda boleh menyemak semula butiran anda di bawah dan mencuba kaedah lain.</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-red-900 text-xs flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* SECTION 1: Contact Information */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E8E2D8] shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E8E2D8]/60 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-full bg-forest text-warmwhite text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <h2 className="text-base font-bold text-forest">Maklumat Hubungan</h2>
                  </div>
                  <Link
                    href="/account/login"
                    className="text-xs text-forest hover:text-gold font-semibold underline underline-offset-2 transition-colors"
                  >
                    Log Masuk Akaun
                  </Link>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-forest block">
                    Alamat Emel atau Nombor Telefon <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      placeholder="cth: nama@kamaar.my atau 012 345 6789"
                      className="w-full px-4 py-3 rounded-xl border border-[#D5CEC2] bg-[#FAF7F2]/40 text-sm text-[#222] placeholder-neutral-400 outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all font-sans"
                    />
                    <div
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 cursor-help"
                      title="Kami akan menghantar nombor penjejakan lori dan resit pesanan rasmi ke sini."
                    >
                      <HelpCircle className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-[11px] text-charcoal-muted">
                    Resit pesanan dan nombor penjejakan penghantaran akan dihantar ke sini.
                  </p>
                </div>

                <label className="flex items-start space-x-3 cursor-pointer pt-1 select-none">
                  <input
                    type="checkbox"
                    checked={newsletterConsent}
                    onChange={(e) => setNewsletterConsent(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded accent-forest cursor-pointer"
                  />
                  <span className="text-xs text-charcoal-muted leading-relaxed">
                    Langgan tawaran eksklusif, keistimewaan VIP, dan panduan penjagaan tilam KAMAAR.
                  </span>
                </label>
              </div>

              {/* SECTION 2: Delivery Address */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E8E2D8] shadow-2xs space-y-5">
                <div className="flex items-center space-x-2.5 border-b border-[#E8E2D8]/60 pb-3">
                  <span className="w-6 h-6 rounded-full bg-forest text-warmwhite text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-base font-bold text-forest">Alamat Penghantaran</h2>
                </div>

                {/* Country / Region */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-forest block">Negara / Wilayah</label>
                  <div className="relative">
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#D5CEC2] bg-[#FAF7F2]/50 text-sm text-[#222] outline-none focus:border-forest appearance-none font-sans font-medium"
                    >
                      <option value="Malaysia">Malaysia (Penghantaran Percuma Semenanjung)</option>
                      <option value="Singapore">Singapore (Hubungi Concierge untuk Tempahan Khas)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-forest block">Nama Pertama</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="cth: Ahmad"
                      className="w-full px-4 py-3 rounded-xl border border-[#D5CEC2] bg-[#FAF7F2]/40 text-sm text-[#222] placeholder-neutral-400 outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-forest block">
                      Nama Akhir <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="cth: Danial"
                      className="w-full px-4 py-3 rounded-xl border border-[#D5CEC2] bg-[#FAF7F2]/40 text-sm text-[#222] placeholder-neutral-400 outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all"
                    />
                  </div>
                </div>

                {/* Company (Optional) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-charcoal-muted block">
                    Nama Syarikat / Organisasi (Pilihan)
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="cth: KAMAAR Beddings Boutique / Kediaman Peribadi"
                    className="w-full px-4 py-3 rounded-xl border border-[#D5CEC2] bg-[#FAF7F2]/40 text-sm text-[#222] placeholder-neutral-400 outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all"
                  />
                </div>

                {/* Address Line 1 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-forest block">
                    Alamat Jalan (No. Rumah &amp; Nama Jalan) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="cth: No. 12, Jalan Telawi 3, Bangsar Baru"
                    className="w-full px-4 py-3 rounded-xl border border-[#D5CEC2] bg-[#FAF7F2]/40 text-sm text-[#222] placeholder-neutral-400 outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all"
                  />
                </div>

                {/* Address Line 2 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-charcoal-muted block">
                    Unit, Blok, Kondominium (Pilihan)
                  </label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="cth: Blok B, Tingkat 15-02"
                    className="w-full px-4 py-3 rounded-xl border border-[#D5CEC2] bg-[#FAF7F2]/40 text-sm text-[#222] placeholder-neutral-400 outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all"
                  />
                </div>

                {/* Postcode, City, State Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-forest block">
                      Poskod <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      placeholder="50450"
                      className="w-full px-4 py-3 rounded-xl border border-[#D5CEC2] bg-[#FAF7F2]/40 text-sm text-[#222] placeholder-neutral-400 outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 font-mono transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-forest block">
                      Bandar <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Kuala Lumpur"
                      className="w-full px-4 py-3 rounded-xl border border-[#D5CEC2] bg-[#FAF7F2]/40 text-sm text-[#222] placeholder-neutral-400 outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-forest block">Negeri</label>
                    <div className="relative">
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#D5CEC2] bg-[#FAF7F2]/40 text-sm text-[#222] outline-none focus:border-forest appearance-none font-sans"
                      >
                        {MALAYSIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-forest block">Nombor Telefon Penerima</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="012 345 6789"
                      className="w-full px-4 py-3 rounded-xl border border-[#D5CEC2] bg-[#FAF7F2]/40 text-sm text-[#222] placeholder-neutral-400 outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all"
                    />
                    <div
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 cursor-help"
                      title="Diperlukan untuk kru penghantaran menghubungi anda sebelum tiba."
                    >
                      <HelpCircle className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-[11px] text-charcoal-muted">
                    Pemandu lori KAMAAR akan menghubungi nombor ini untuk menjadualkan masa ketibaan.
                  </p>
                </div>

                {/* White-Glove Installation Concierge (bulky items) */}
                {hasBulkyMattress && (
                  <div className="p-4 sm:p-5 bg-[#FAF7F2] rounded-2xl border border-gold/40 space-y-4 text-xs">
                    <div className="flex items-center space-x-2 text-forest font-bold text-sm">
                      <Truck className="w-4 h-4 text-gold shrink-0" />
                      <span>Perkhidmatan White-Glove Setup Percuma</span>
                    </div>
                    <p className="text-[11px] text-charcoal-muted leading-relaxed">
                      Kru KAMAAR akan membawa tilam terus ke dalam bilik tidur anda, membuka pembungkusan, dan memasang tilam di atas rangka katil anda dengan rapi.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-forest block">
                          Akses Lif di Kediaman Anda
                        </label>
                        <select
                          value={hasLiftAccess ? 'yes' : 'no'}
                          onChange={(e) => setHasLiftAccess(e.target.value === 'yes')}
                          className="w-full px-3 py-2.5 bg-white rounded-xl border border-[#D5CEC2] text-xs text-[#222]"
                        >
                          <option value="yes">Ada Lif Penumpang / Kargo</option>
                          <option value="no">Tiada Lif (Kru Angkut Tangga)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-forest block">
                          Aras Tingkat Bilik Tidur
                        </label>
                        <input
                          type="text"
                          value={floorLevel}
                          onChange={(e) => setFloorLevel(e.target.value)}
                          placeholder="cth: Tingkat Bawah / Tingkat 2"
                          className="w-full px-3 py-2.5 bg-white rounded-xl border border-[#D5CEC2] text-xs text-[#222]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <label className="text-[11px] font-semibold text-forest block">
                        Nota Khas untuk Pemandu &amp; Kru Pemasangan (Pilihan)
                      </label>
                      <textarea
                        rows={2}
                        value={deliveryNotes}
                        onChange={(e) => setDeliveryNotes(e.target.value)}
                        placeholder="cth: Sila daftar di pos pengawal Kondo, hubungi sebelum sampai, atau tarikh pindah rumah baru..."
                        className="w-full px-3 py-2 bg-white rounded-xl border border-[#D5CEC2] text-xs text-[#222] resize-none outline-none focus:border-forest"
                      />
                    </div>
                  </div>
                )}

                {/* Save info for next time */}
                <label className="flex items-center space-x-3 cursor-pointer pt-1 select-none">
                  <input
                    type="checkbox"
                    checked={saveInfoForNextTime}
                    onChange={(e) => setSaveInfoForNextTime(e.target.checked)}
                    className="w-4 h-4 rounded accent-forest cursor-pointer"
                  />
                  <span className="text-xs text-charcoal-muted">
                    Simpan maklumat penghantaran ini untuk pesanan masa hadapan
                  </span>
                </label>
              </div>

              {/* SECTION 3: Shipping Method */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E8E2D8] shadow-2xs space-y-4">
                <div className="flex items-center space-x-2.5 border-b border-[#E8E2D8]/60 pb-3">
                  <span className="w-6 h-6 rounded-full bg-forest text-warmwhite text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h2 className="text-base font-bold text-forest">Kaedah Penghantaran</h2>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl border-2 border-forest/30 bg-[#FAF7F2] flex items-center justify-between gap-4">
                  <div className="flex items-start space-x-3.5 min-w-0">
                    <div className="w-5 h-5 rounded-full border-4 border-forest bg-white mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-sm font-bold text-forest block truncate">
                        {shippingInfo.isComplimentary
                          ? 'Complimentary White-Glove In-Home Setup'
                          : 'Penghantaran Terus Semenanjung Malaysia'}
                      </span>
                      <span className="text-xs text-charcoal-muted block mt-0.5">
                        {shippingInfo.isComplimentary
                          ? 'Penghantaran berjadual & pemasangan terus di bilik tidur anda • 3-7 hari bekerja'
                          : 'Penghantaran standard berinsurans penuh'}
                      </span>
                    </div>
                  </div>

                  <span className="text-sm font-extrabold text-forest shrink-0 bg-white px-3 py-1.5 rounded-lg border border-borderLight shadow-2xs">
                    {shippingInfo.shippingSen === 0 ? 'PERCUMA' : formatMYR(shippingInfo.shippingSen)}
                  </span>
                </div>
              </div>

              {/* SECTION 4: Payment Methods Accordion (FPX & TNG eWallet Only) */}
              <div id="payment-section" className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E8E2D8] shadow-2xs space-y-5">
                <div className="flex items-center justify-between border-b border-[#E8E2D8]/60 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-full bg-forest text-warmwhite text-xs font-bold flex items-center justify-center">
                      4
                    </span>
                    <h2 className="text-base font-bold text-forest">Kaedah Pembayaran (FPX &amp; TNG Sahaja)</h2>
                  </div>
                  <span className="text-xs text-charcoal-muted flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    Pembayaran Rasmi Sah
                  </span>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Syarikat kami <strong>TUNAS SINAR JAYA ENTERPRISE</strong> menerima bayaran rasmi melalui <strong>FPX Perbankan Dalam Talian</strong> dan <strong>Touch &apos;n Go (TNG) eWallet</strong> sahaja bagi memastikan transaksi selamat dan pantas.
                  </p>
                </div>

                {/* Payment Option List */}
                <div className="rounded-2xl border border-[#D5CEC2] overflow-hidden divide-y divide-[#D5CEC2] bg-white">
                  {/* OPTION 1: FPX Online Banking */}
                  <div className="transition-colors">
                    <label
                      className={`flex items-center justify-between p-4 sm:p-4.5 cursor-pointer select-none transition-colors ${
                        selectedMethodId === 'pay-fpx' ? 'bg-[#FAF7F2]' : 'hover:bg-stone-50/60'
                      }`}
                    >
                      <div className="flex items-center space-x-3.5 min-w-0 pr-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={selectedMethodId === 'pay-fpx'}
                          onChange={() => setSelectedMethodId('pay-fpx')}
                          className="w-4 h-4 accent-forest shrink-0 cursor-pointer"
                        />
                        <div className="min-w-0">
                          <span className="text-sm font-bold text-forest block truncate">
                            FPX Perbankan Dalam Talian (Online Banking)
                          </span>
                          <span className="text-xs text-charcoal-muted block truncate mt-0.5">
                            Maybank2u, CIMB, Bank Islam, RHB, Public Bank, Hong Leong &amp; lain-lain
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <div className="h-7 px-2.5 bg-white rounded-md border border-[#D5CEC2] flex items-center justify-center shadow-xs">
                          <Image
                            src="/images/payments/fpx.svg"
                            alt="FPX Online Banking"
                            width={48}
                            height={16}
                            className="h-3.5 w-auto object-contain"
                          />
                        </div>
                      </div>
                    </label>

                    {selectedMethodId === 'pay-fpx' && (
                      <div className="p-4 sm:p-6 bg-[#FAF7F2]/60 border-t border-[#D5CEC2] space-y-4">
                        <div className="space-y-3">
                          <span className="text-xs font-bold text-forest block">
                            Pilih Bank Tempatan Anda:
                          </span>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {MALAYSIAN_BANKS.map((bank) => (
                              <button
                                key={bank.id}
                                type="button"
                                onClick={() => setSelectedBank(bank.id)}
                                className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                                  selectedBank === bank.id
                                    ? 'bg-forest text-warmwhite border-forest shadow-xs'
                                    : 'bg-white text-forest border-[#D5CEC2] hover:bg-stone-50'
                                }`}
                              >
                                <span className="truncate">{bank.name}</span>
                                {selectedBank === bank.id && (
                                  <Check className="w-3.5 h-3.5 text-gold shrink-0 ml-1" />
                                )}
                              </button>
                            ))}
                          </div>

                          <div className="p-3 bg-white rounded-xl border border-[#D5CEC2] text-xs text-charcoal-muted leading-relaxed flex items-center space-x-2">
                            <Info className="w-4 h-4 text-forest shrink-0" />
                            <span>
                              Selepas menekan butang <strong>&quot;Bayar Sekarang&quot;</strong>, anda akan dibawa ke gerbang pembayaran selamat FPX bagi mengesahkan transaksi secara terus dengan bank anda.
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* OPTION 2: Touch 'n Go (TNG) eWallet */}
                  <div className="transition-colors">
                    <label
                      className={`flex items-center justify-between p-4 sm:p-4.5 cursor-pointer select-none transition-colors ${
                        selectedMethodId === 'pay-tng' ? 'bg-[#FAF7F2]' : 'hover:bg-stone-50/60'
                      }`}
                    >
                      <div className="flex items-center space-x-3.5 min-w-0 pr-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={selectedMethodId === 'pay-tng'}
                          onChange={() => setSelectedMethodId('pay-tng')}
                          className="w-4 h-4 accent-forest shrink-0 cursor-pointer"
                        />
                        <div className="min-w-0">
                          <span className="text-sm font-bold text-forest block truncate">
                            Touch &apos;n Go eWallet (TNG)
                          </span>
                          <span className="text-xs text-charcoal-muted block truncate mt-0.5">
                            Bayaran terus imbas QR Kod atau aplikasi Touch &apos;n Go
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <div className="h-7 px-2.5 bg-white rounded-md border border-[#D5CEC2] flex items-center justify-center gap-1.5 shadow-xs">
                          <Image
                            src="/images/payments/tng-ewallet.svg"
                            alt="Touch 'n Go eWallet"
                            width={18}
                            height={18}
                            className="h-4.5 w-4.5 object-contain rounded-xs"
                          />
                          <span className="font-bold text-[10px] text-[#015CA9] font-sans">
                            Touch &apos;n Go
                          </span>
                        </div>
                      </div>
                    </label>

                    {selectedMethodId === 'pay-tng' && (
                      <div className="p-4 sm:p-6 bg-[#FAF7F2]/60 border-t border-[#D5CEC2] space-y-4">
                        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#D5CEC2] space-y-3.5">
                          <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                            <div className="flex items-center space-x-2 text-forest font-bold text-xs">
                              <Building className="w-4 h-4 text-gold" />
                              <span>Akaun Rasmi: TUNAS SINAR JAYA ENTERPRISE</span>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-[#015CA9]">
                              TNG Terverifikasi
                            </span>
                          </div>

                          <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E8E2D8] text-xs space-y-2.5">
                            <div className="flex justify-between items-center">
                              <span className="text-charcoal-muted">Nama Peniaga:</span>
                              <strong className="text-forest">TUNAS SINAR JAYA ENTERPRISE</strong>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-charcoal-muted">Jenama:</span>
                              <strong className="text-forest">KAMAAR BEDDINGS</strong>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-charcoal-muted">No. TNG / WhatsApp Rasmi:</span>
                              <div className="flex items-center space-x-2">
                                <strong className="text-forest font-mono tracking-wider font-bold">019-478 6991</strong>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (typeof navigator !== 'undefined' && navigator.clipboard) {
                                      navigator.clipboard.writeText('0194786991')
                                      setCopiedBank(true)
                                      setTimeout(() => setCopiedBank(false), 2000)
                                    }
                                  }}
                                  className="text-forest hover:text-gold transition-colors cursor-pointer"
                                  title="Salin Nombor TNG"
                                >
                                  {copiedBank ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-charcoal-muted">Lokasi Kilang:</span>
                              <strong className="text-forest text-right">Tasek Gelugor, Pulau Pinang</strong>
                            </div>
                          </div>

                          <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-950 leading-relaxed flex items-center space-x-2">
                            <Info className="w-4 h-4 text-[#015CA9] shrink-0" />
                            <span>
                              Buka aplikasi <strong>Touch &apos;n Go eWallet</strong> anda untuk menyelesaikan bayaran. Resit pengesahan akan dihantar secara automatik.
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* PRIMARY SUBMIT CTA */}
              <div className="space-y-4 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4.5 px-8 bg-forest hover:bg-forest-dark active:scale-[0.99] text-warmwhite text-base font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 disabled:opacity-50 cursor-pointer border border-forest/20"
                >
                  <Lock className="w-5 h-5 text-gold shrink-0" />
                  <span className="tracking-wide">
                    {isSubmitting ? 'Memproses Pesanan Anda...' : `Bayar Sekarang • ${formatMYR(finalTotalSen)}`}
                  </span>
                </button>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-[11px] text-charcoal-muted text-center pt-1">
                  <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Perlindungan Bayaran Penuh PCI-DSS &amp; Bank Negara</span>
                  </div>
                  <span className="hidden sm:inline text-neutral-300">•</span>
                  <span>100% Hak Pemulangan Duit Terjamin</span>
                </div>
              </div>

              {/* LEGAL & POLICY FOOTER */}
              <div className="pt-6 border-t border-[#E8E2D8] flex flex-wrap items-center justify-center gap-4 text-xs text-charcoal-muted">
                <Link href="/pages/refund-policy" className="hover:text-forest underline underline-offset-2">
                  Polisi Pemulangan (100-Malam)
                </Link>
                <span>•</span>
                <Link href="/pages/shipping-policy" className="hover:text-forest underline underline-offset-2">
                  Polisi Penghantaran White-Glove
                </Link>
                <span>•</span>
                <Link href="/pages/privacy-policy" className="hover:text-forest underline underline-offset-2">
                  Dasar Privasi
                </Link>
                <span>•</span>
                <Link href="/pages/terms-of-service" className="hover:text-forest underline underline-offset-2">
                  Terma &amp; Syarat
                </Link>
              </div>
            </form>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* RIGHT COLUMN: Order Summary Card (5 Columns)                          */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 bg-[#FAF7F2] rounded-3xl p-5 sm:p-6 border border-[#E8E2D8] shadow-sm space-y-5">
              {/* Order Summary Header */}
              <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3.5">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-forest" />
                  <h3 className="font-serif text-lg font-bold text-forest">Ringkasan Pesanan</h3>
                </div>
                <div className="flex items-center gap-2">
                  {items.length > 2 && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-forest/80 bg-forest/5 px-2 py-0.5 rounded-full border border-forest/10">
                      <ChevronDown className="w-3 h-3 text-gold animate-bounce" />
                      <span>Skrol ({items.length} item)</span>
                    </span>
                  )}
                  <span className="text-xs font-bold text-forest px-2.5 py-1 rounded-full bg-cream border border-borderLight shadow-2xs">
                    {items.reduce((sum, i) => sum + i.quantity, 0)} Item
                  </span>
                </div>
              </div>

              {/* Product Line Items (Zero Overlap Guaranteed!) */}
              <div className="max-h-[260px] sm:max-h-[290px] overflow-y-auto overscroll-contain pr-1.5 space-y-2.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-forest/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-forest/40">
                {items.map((item) => {
                  const resolvedImg = item.imageUrl || item.image || defaultProductImage
                  const resolvedTitle = item.productName || item.title || 'KAMAAR Luxury Mattress'
                  const resolvedVariant = item.sizeName || item.variantName || item.dimensions || 'Single (90×190cm)'

                  return (
                    <div
                      key={item.variantId}
                      className="group relative flex items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-[#E8E2D8] hover:border-forest/20 shadow-2xs transition-all"
                    >
                      {/* Left: Thumbnail & Quantity Badge */}
                      <div className="relative shrink-0">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-[#E8E2D8] bg-cream/30 overflow-hidden relative shadow-2xs">
                          <Image
                            src={resolvedImg}
                            alt={resolvedTitle}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        {/* Quantity Badge */}
                        <span className="absolute -top-1.5 -right-1.5 z-10 w-5 h-5 rounded-full bg-forest text-warmwhite text-[10px] font-bold flex items-center justify-center shadow-md border-2 border-white ring-1 ring-forest/20">
                          {item.quantity}
                        </span>
                      </div>

                      {/* Middle: Product Title & Variant Details */}
                      <div className="min-w-0 flex-1 flex flex-col justify-center gap-0.5">
                        <h4 className="text-xs sm:text-sm font-bold text-forest leading-snug line-clamp-1" title={resolvedTitle}>
                          {resolvedTitle}
                        </h4>
                        <p className="text-[11px] text-charcoal-muted leading-tight truncate">
                          {resolvedVariant}
                        </p>
                        {item.sku && (
                          <span className="text-[9.5px] text-charcoal-muted/70 font-mono tracking-tight truncate">
                            SKU: {item.sku}
                          </span>
                        )}
                      </div>

                      {/* Right: Line Total */}
                      <div className="shrink-0 text-right flex flex-col items-end justify-center">
                        <span className="text-xs sm:text-sm font-bold text-forest font-serif whitespace-nowrap">
                          {formatMYR(item.priceSen * item.quantity)}
                        </span>
                        {item.compareAtPriceSen && item.compareAtPriceSen > item.priceSen && (
                          <span className="text-[10px] text-charcoal-muted/60 line-through block whitespace-nowrap">
                            {formatMYR(item.compareAtPriceSen * item.quantity)}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Discount Code Input Module */}
              <div className="pt-3.5 border-t border-[#E8E2D8] space-y-2">
                <form onSubmit={handleApplyCoupon} className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      placeholder="Kod Diskaun / Baucar"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CEC2] text-xs text-[#222] placeholder-neutral-400 bg-white outline-none focus:border-forest uppercase font-mono transition-all shadow-2xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    Tebus
                  </button>
                </form>

                {couponError && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{couponError}</span>
                  </p>
                )}
                {couponSuccess && (
                  <p className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{couponSuccess}</span>
                  </p>
                )}

                {/* Applied coupon badge */}
                {couponCode && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs shadow-2xs">
                    <div className="flex items-center space-x-2 text-emerald-900 font-bold">
                      <Tag className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="font-mono text-xs">{couponCode}</span>
                      <span className="text-emerald-700 font-medium">(-{formatMYR(discountSen)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCoupon()}
                      className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
                      title="Buang kupon"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {!couponCode && (
                  <div className="flex items-center justify-between text-[11px] text-charcoal-muted pt-0.5">
                    <span>Ada kod promosi pelancaran?</span>
                    <button
                      type="button"
                      onClick={() => {
                        applyCoupon('KAMAAR100')
                        setCouponSuccess('Baucar "KAMAAR100" berjaya ditebus!')
                      }}
                      className="text-forest hover:text-gold font-bold underline cursor-pointer"
                    >
                      Cuba KAMAAR100
                    </button>
                  </div>
                )}
              </div>

              {/* Pricing Breakdown */}
              <div className="pt-3.5 border-t border-[#E8E2D8] space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-charcoal-muted">
                  <span>Jumlah Kasar (Subtotal)</span>
                  <span className="font-semibold text-forest font-serif">{formatMYR(subtotalSen)}</span>
                </div>

                <div className="flex items-center justify-between text-charcoal-muted">
                  <span className="flex items-center space-x-1.5">
                    <span>Penghantaran White-Glove</span>
                    <span
                      title="Penghantaran & pemasangan percuma di bilik tidur anda di seluruh Semenanjung Malaysia"
                      className="cursor-help inline-flex text-neutral-400"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </span>
                  </span>
                  <span className="font-bold text-forest">
                    {shippingInfo.shippingSen === 0 ? 'PERCUMA' : formatMYR(shippingInfo.shippingSen)}
                  </span>
                </div>

                {discountSen > 0 && (
                  <div className="flex items-center justify-between text-emerald-700 font-semibold">
                    <span>Diskaun Baucar ({couponCode})</span>
                    <span>-{formatMYR(discountSen)}</span>
                  </div>
                )}

                {/* Grand Total */}
                <div className="pt-3.5 border-t border-[#E8E2D8] flex items-center justify-between">
                  <div>
                    <span className="text-sm sm:text-base font-bold text-forest block">Jumlah Keseluruhan</span>
                    <span className="text-[10.5px] text-charcoal-muted block mt-0.5">
                      Termasuk Cukai SST 0% &amp; Insurans
                    </span>
                  </div>
                  <div className="flex items-baseline space-x-1 text-right">
                    <span className="text-xs text-charcoal-muted font-bold">MYR</span>
                    <span className="text-2xl sm:text-3xl font-serif font-black text-forest tracking-tight">
                      {formatMYR(finalTotalSen).replace('RM', '')}
                    </span>
                  </div>
                </div>
              </div>

              {/* KAMAAR Factory Guarantees Card */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E8E2D8] space-y-2 text-xs shadow-2xs">
                <div className="flex items-center space-x-2 text-forest font-bold text-[11.5px]">
                  <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>Jaminan Kualiti Kilang KAMAAR BEDDINGS</span>
                </div>
                <ul className="space-y-1.5 text-[10.5px] text-charcoal-muted leading-relaxed">
                  <li className="flex items-start space-x-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Terus Dari Kilang:</strong> Pengeluaran oleh Tunas Sinar Jaya Enterprise, Tasek Gelugor.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Kualiti Jahitan &amp; Isian:</strong> Isian Asian Polyester Fibre gebu &amp; jahitan quilting kukuh.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Penghantaran Pantas:</strong> Pembungkusan rapi terus dihantar ke seluruh Semenanjung.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
