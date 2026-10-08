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
  MapPin,
  Store,
  Navigation,
  Clock,
  Phone,
  Minus,
  Plus,
  Trash2,
  SlidersHorizontal,
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
import { PaymentSettings, PaymentMethodConfig, SiteSettings, Product, ProductVariant } from '@/types'

interface CheckoutClientProps {
  initialPaymentSettings?: PaymentSettings
  initialSiteSettings?: SiteSettings
  availableProducts?: Product[]
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

export function CheckoutClient({ initialPaymentSettings, initialSiteSettings, availableProducts }: CheckoutClientProps) {
  const {
    items,
    subtotalSen,
    couponCode,
    applyCoupon,
    removeCoupon,
    notes,
    clearCart,
    removeItem,
    updateQuantity,
    updateItemVariant,
  } = useCart()
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()

  const isCancelled = searchParams.get('cancelled') === 'true'

  // Settings & Fulfillment configuration
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | undefined>(initialPaymentSettings)
  const [siteSettings, setSiteSettings] = useState<SiteSettings | undefined>(initialSiteSettings)
  const [fulfillmentType, setFulfillmentType] = useState<'delivery' | 'pickup'>('delivery')

  // Products catalog for in-checkout variant choices
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(availableProducts || [])
  const [editingVariantFor, setEditingVariantFor] = useState<string | null>(null)

  const [activeMethods, setActiveMethods] = useState<PaymentMethodConfig[]>(
    initialPaymentSettings?.methods?.filter((m) => m.enabled) || []
  )
  const [selectedMethodId, setSelectedMethodId] = useState<string>(
    initialPaymentSettings?.defaultMethodId || 'pay-fpx'
  )

  // Fetch updated settings and methods on mount if not provided or to ensure fresh status
  useEffect(() => {
    async function loadFreshData() {
      try {
        if (!initialSiteSettings) {
          const sRes = await fetch('/api/site-settings')
          if (sRes.ok) {
            const sData = await sRes.json()
            if (sData.settings) setSiteSettings(sData.settings)
          }
        }

        if (!availableProducts || availableProducts.length === 0) {
          const pRes = await fetch('/api/products')
          if (pRes.ok) {
            const pData = await pRes.json()
            if (pData.products && Array.isArray(pData.products)) {
              setCatalogProducts(pData.products)
            }
          }
        }

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
        console.error('Failed to load fresh checkout settings:', err)
      }
    }
    loadFreshData()
  }, [initialSiteSettings, selectedMethodId])

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

  // Factory Self-Pickup condition
  const isSelfPickupAllowed = Boolean(siteSettings?.selfPickupEnabled ?? true)
  const isPickup = fulfillmentType === 'pickup' && isSelfPickupAllowed

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

  const effectiveShippingSen = isPickup ? 0 : shippingInfo.shippingSen
  const finalTotalSen = Math.max(0, subtotalSen - discountSen + effectiveShippingSen)

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

    if (!isPickup) {
      if (!addressLine1 || !addressLine1.trim()) {
        setErrorMessage('Sila masukkan alamat penghantaran anda.')
        return
      }

      if (!postcode || !validateMalaysianPostcode(postcode)) {
        setErrorMessage('Sila masukkan 5-digit poskod Malaysia yang sah (cth: 50450).')
        return
      }
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
            addressLine1: isPickup
              ? (addressLine1.trim() || siteSettings?.pickupAddress || '7878B Jalan Permatang Berangan')
              : [addressLine1.trim(), company.trim() ? `(${company.trim()})` : ''].filter(Boolean).join(', '),
            addressLine2: isPickup ? 'Ambil Sendiri di Kilang' : (addressLine2.trim() || undefined),
            city: isPickup ? (city.trim() || 'Tasek Gelugor') : (city.trim() || 'Kuala Lumpur'),
            state: isPickup ? (state || 'Pulau Pinang') : state,
            postcode: isPickup ? (postcode.trim() || siteSettings?.pickupPostcode || '13300') : postcode.trim(),
            country: 'Malaysia',
          },
          deliveryDetails: {
            method: isPickup ? 'pickup' : 'delivery',
            pickupLocation: siteSettings?.pickupLocationName || 'Kilang KAMAAR Beddings (Tasek Gelugor)',
            notes: deliveryNotes.trim() || undefined,
            hasLiftAccess: isPickup ? false : hasLiftAccess,
            floorLevel: isPickup ? 'Self-Pickup' : floorLevel,
          },
          couponCode: couponCode || undefined,
          affiliateCode: affiliateCode.trim() || undefined,
          paymentMethodId: selectedMethodId || selectedMethod?.id,
          paymentProvider:
            selectedMethodId === 'pay-fpx' || selectedMethodId === 'pay-tng'
              ? 'chip'
              : selectedMethod?.providerType || 'chip',
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
          <div key={type} className="h-6 px-2 bg-white rounded border border-[#D5CEC2] flex items-center justify-center shadow-2xs">
            <Image src="/images/payments/fpx.svg" alt="FPX" width={40} height={14} className="h-3.5 w-auto object-contain" />
          </div>
        )
      case 'tng':
        return (
          <div key={type} className="h-6 px-1.5 bg-white rounded border border-[#D5CEC2] flex items-center justify-center gap-1 shadow-2xs">
            <Image src="/images/payments/tng-ewallet.svg" alt="TNG" width={16} height={16} className="h-4 w-4 object-contain" />
            <span className="text-[9px] font-bold text-[#015CA9]">TNG</span>
          </div>
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
            href="/collections/tilam-toto"
            className="w-full inline-flex items-center justify-center py-3.5 px-6 bg-forest hover:bg-forest-dark text-warmwhite text-sm font-bold rounded-xl transition-all shadow-md group"
          >
            <span>Terokai Produk Kilang KAMAAR</span>
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
            {/* Official Payment Guarantee Banner (Reassures customer upfront without duplicate buttons) */}
            <div className="bg-[#FAF7F2] rounded-2xl p-4 sm:p-4.5 border border-[#E8E2D8] flex flex-wrap items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-100/80 border border-emerald-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-800" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-forest block leading-tight">
                      Gerbang Pembayaran Rasmi CHIP In Asia
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-full border border-emerald-200/80 hidden sm:inline-flex">
                      Patuh Bank Negara &amp; PayNet
                    </span>
                  </div>
                  <span className="text-[11px] text-charcoal-muted leading-tight block mt-0.5">
                    Transaksi selamat 256-Bit SSL • FPX Online Banking &amp; Touch &apos;n Go eWallet
                  </span>
                </div>
              </div>

              {/* Official Badges */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="h-7 px-2.5 bg-white rounded-lg border border-[#D5CEC2] flex items-center justify-center shadow-2xs">
                  <Image
                    src="/images/payments/fpx.svg"
                    alt="FPX Online Banking"
                    width={48}
                    height={16}
                    className="h-3.5 w-auto object-contain"
                  />
                </div>
                <div className="h-7 px-2.5 bg-white rounded-lg border border-[#D5CEC2] flex items-center justify-center gap-1.5 shadow-2xs">
                  <Image
                    src="/images/payments/tng-ewallet.svg"
                    alt="Touch 'n Go eWallet"
                    width={18}
                    height={18}
                    className="h-4.5 w-4.5 object-contain"
                  />
                  <span className="text-[10px] font-bold text-[#015CA9] font-sans">TNG</span>
                </div>
              </div>
            </div>

            {/* Error notifications */}
            {isCancelled && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
                <span>Sesi pembayaran sebelum ini telah dibatalkan. Anda boleh menyemak semula butiran anda di bawah dan mencuba kaedah lain.</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-red-900 text-xs flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                  <span className="font-medium leading-relaxed">{errorMessage}</span>
                </div>
                {(errorMessage.toLowerCase().includes('available') ||
                  errorMessage.toLowerCase().includes('tersedia') ||
                  errorMessage.toLowerCase().includes('katalog') ||
                  errorMessage.toLowerCase().includes('tiada')) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (catalogProducts.length > 0) {
                        const validVariantIds = new Set(
                          catalogProducts.flatMap((p) => p.variants.map((v) => v.id))
                        )
                        const invalidItems = items.filter((i) => !validVariantIds.has(i.variantId))
                        if (invalidItems.length > 0) {
                          invalidItems.forEach((inv) => removeItem(inv.variantId))
                        } else if (items.length > 0) {
                          removeItem(items[0].variantId)
                        }
                      } else if (items.length > 0) {
                        removeItem(items[0].variantId)
                      }
                      setErrorMessage('')
                    }}
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0 inline-flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Buang Item Tidak Sah</span>
                  </button>
                )}
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

              {/* SECTION 2: Delivery Address / Contact Details */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E8E2D8] shadow-2xs space-y-5">
                <div className="flex items-center justify-between border-b border-[#E8E2D8]/60 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-full bg-forest text-warmwhite text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-forest leading-tight">
                        {isPickup ? 'Butiran Pengambilan di Kilang' : 'Alamat Penghantaran'}
                      </h2>
                      <span className="text-[11px] text-charcoal-muted">
                        {isPickup ? 'Nama & nombor telefon penerima yang hadir ke kilang' : 'Alamat kediaman / premis anda di Semenanjung'}
                      </span>
                    </div>
                  </div>
                  {isPickup && (
                    <span className="text-[10.5px] font-bold text-amber-900 bg-amber-100/90 px-2.5 py-1 rounded-full border border-amber-300 flex items-center gap-1">
                      <Store className="w-3 h-3 text-amber-700" />
                      <span>Ambil di Kilang</span>
                    </span>
                  )}
                </div>

                {isPickup && (
                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-amber-900 font-bold">
                        Pilihan Ambil Sendiri di Kilang Aktif
                      </strong>
                      <p className="mt-0.5 leading-relaxed text-amber-800">
                        Pesanan ini akan diambil sendiri di kilang Tunas Sinar Jaya Enterprise (Tasek Gelugor, Pulau Pinang). Lori KAMAAR tidak akan dihantar ke rumah anda. Sila lengkapkan nama &amp; nombor telefon penerima di bawah untuk pengesahan serahan barang di kaunter kilang.
                      </p>
                    </div>
                  </div>
                )}

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
                    {isPickup ? 'Alamat Kediaman / Bil (Pilihan untuk Resit)' : 'Alamat Jalan (No. Rumah & Nama Jalan)'}{' '}
                    {!isPickup && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    required={!isPickup}
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder={
                      isPickup
                        ? 'cth: No. 12, Taman Seri Gelugor (Pilihan)'
                        : 'cth: No. 12, Jalan Telawi 3, Bangsar Baru'
                    }
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
                      Poskod {!isPickup && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      required={!isPickup}
                      maxLength={5}
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      placeholder={isPickup ? '13300' : '50450'}
                      className="w-full px-4 py-3 rounded-xl border border-[#D5CEC2] bg-[#FAF7F2]/40 text-sm text-[#222] placeholder-neutral-400 outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 font-mono transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-forest block">
                      Bandar {!isPickup && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      required={!isPickup}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder={isPickup ? 'Tasek Gelugor' : 'Kuala Lumpur'}
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
                  <label className="text-xs font-semibold text-forest block">
                    Nombor Telefon Penerima <span className="text-red-500">*</span>
                  </label>
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
                      title="Diperlukan untuk kru atau kaunter kilang menghubungi anda."
                    >
                      <HelpCircle className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-[11px] text-charcoal-muted">
                    {isPickup
                      ? 'No. telefon ini akan digunakan oleh staf kilang untuk memaklumkan status siap tilam.'
                      : 'Pemandu lori KAMAAR akan menghubungi nombor ini untuk menjadualkan masa ketibaan.'}
                  </p>
                </div>

                {/* White-Glove Installation Concierge (bulky items, delivery mode only) */}
                {hasBulkyMattress && !isPickup && (
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
                    Simpan maklumat ini untuk pesanan masa hadapan
                  </span>
                </label>
              </div>

              {/* SECTION 3: Shipping / Fulfillment Method */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E8E2D8] shadow-2xs space-y-4">
                <div className="flex items-center space-x-2.5 border-b border-[#E8E2D8]/60 pb-3">
                  <span className="w-6 h-6 rounded-full bg-forest text-warmwhite text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-forest leading-tight">Kaedah Penerimaan Pesanan</h2>
                    <span className="text-[11px] text-charcoal-muted">
                      Pilih sama ada dihantar terus ke kediaman anda atau diambil sendiri di kilang
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {/* OPTION 1: Penghantaran ke Rumah / Premis */}
                  <label
                    className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none ${
                      !isPickup
                        ? 'border-forest bg-[#FAF7F2] shadow-xs ring-1 ring-forest/10'
                        : 'border-[#E8E2D8] bg-white hover:bg-stone-50/70'
                    }`}
                  >
                    <div className="flex items-start space-x-3.5 min-w-0">
                      <input
                        type="radio"
                        name="fulfillmentOption"
                        checked={!isPickup}
                        onChange={() => setFulfillmentType('delivery')}
                        className="w-4 h-4 accent-forest mt-1 shrink-0 cursor-pointer"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-forest block truncate">
                            Penghantaran Terus Semenanjung Malaysia
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Pilihan Utama
                          </span>
                        </div>
                        <span className="text-xs text-charcoal-muted block mt-0.5 leading-relaxed">
                          {shippingInfo.isComplimentary
                            ? 'Penghantaran berjadual & servis White-Glove In-Home Setup di bilik tidur anda • 3-7 hari bekerja'
                            : 'Penghantaran standard berinsurans penuh terus ke alamat anda'}
                        </span>
                      </div>
                    </div>

                    <span className="text-sm font-extrabold text-forest shrink-0 bg-white px-3 py-1.5 rounded-lg border border-borderLight shadow-2xs self-start sm:self-auto">
                      {shippingInfo.shippingSen === 0 ? 'PERCUMA' : formatMYR(shippingInfo.shippingSen)}
                    </span>
                  </label>

                  {/* OPTION 2: Ambil Sendiri di Kilang (Jika admin benarkan) */}
                  {isSelfPickupAllowed && (
                    <div
                      className={`rounded-2xl border-2 transition-all overflow-hidden ${
                        isPickup
                          ? 'border-forest bg-[#FAF7F2] shadow-xs ring-1 ring-forest/10'
                          : 'border-[#E8E2D8] bg-white hover:bg-stone-50/70'
                      }`}
                    >
                      <label className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none">
                        <div className="flex items-start space-x-3.5 min-w-0">
                          <input
                            type="radio"
                            name="fulfillmentOption"
                            checked={isPickup}
                            onChange={() => setFulfillmentType('pickup')}
                            className="w-4 h-4 accent-forest mt-1 shrink-0 cursor-pointer"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-forest block truncate">
                                Ambil Sendiri di Kilang (Factory Self-Pickup)
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                                Sedia Cepat
                              </span>
                            </div>
                            <span className="text-xs text-charcoal-muted block mt-0.5 leading-relaxed">
                              Ambil terus dari kilang KAMAAR di Tasek Gelugor, Pulau Pinang. Tiada sebarang caj penghantaran.
                            </span>
                          </div>
                        </div>

                        <span className="text-sm font-extrabold text-emerald-700 shrink-0 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 shadow-2xs self-start sm:self-auto">
                          PERCUMA
                        </span>
                      </label>

                      {/* Expanded Factory Details & Google Maps */}
                      {isPickup && (
                        <div className="p-4 sm:p-6 bg-white border-t border-[#D5CEC2] space-y-4">
                          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D8] space-y-3.5 text-xs">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#E8E2D8] pb-3">
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase tracking-wider font-bold text-charcoal-muted block">
                                  Lokasi Kilang Rasmi
                                </span>
                                <h4 className="text-sm font-bold text-forest flex items-center gap-1.5">
                                  <Store className="w-4 h-4 text-gold shrink-0" />
                                  <span>
                                    {siteSettings?.pickupLocationName ||
                                      'Kilang KAMAAR Beddings (Tunas Sinar Jaya Enterprise)'}
                                  </span>
                                </h4>
                                <p className="text-charcoal font-medium leading-relaxed">
                                  {siteSettings?.pickupAddress || '7878B Jalan Permatang Berangan'},{' '}
                                  {siteSettings?.pickupCityState || '13300 Tasek Gelugor, Pulau Pinang'}
                                </p>
                              </div>

                              {/* Navigation Buttons */}
                              <div className="flex items-center gap-2 shrink-0">
                                <a
                                  href={
                                    siteSettings?.pickupGoogleMapsUrl ||
                                    'https://maps.google.com/?q=7878B+Jalan+Permatang+Berangan,+13300+Tasek+Gelugor+Pulau+Pinang'
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-3.5 py-2 bg-white hover:bg-stone-50 border border-[#D5CEC2] hover:border-forest text-forest font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
                                  title="Buka panduan arah di Google Maps"
                                >
                                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                                  <span>Google Maps</span>
                                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                                </a>

                                <a
                                  href={
                                    siteSettings?.pickupWazeUrl ||
                                    'https://waze.com/ul?q=7878B%20Jalan%20Permatang%20Berangan%20Tasek%20Gelugor'
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-3.5 py-2 bg-white hover:bg-stone-50 border border-[#D5CEC2] hover:border-sky-600 text-sky-800 font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
                                  title="Buka panduan arah di Waze"
                                >
                                  <Navigation className="w-3.5 h-3.5 text-sky-600" />
                                  <span>Waze</span>
                                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                                </a>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
                              <div className="flex items-center gap-2 text-charcoal">
                                <Clock className="w-4 h-4 text-forest shrink-0" />
                                <span>
                                  <strong>Waktu Operasi:</strong>{' '}
                                  {siteSettings?.pickupOperatingHours ||
                                    'Isnin – Sabtu: 9:00 AM – 6:00 PM'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-charcoal">
                                <Phone className="w-4 h-4 text-forest shrink-0" />
                                <span>
                                  <strong>Hubungi Kilang:</strong>{' '}
                                  {siteSettings?.pickupContactPhone || '019-478 6991'}
                                </span>
                              </div>
                            </div>

                            {/* Embedded Google Maps */}
                            <div className="pt-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block mb-1.5">
                                Pratonton Lokasi Google Maps Kilang:
                              </span>
                              <div className="w-full h-44 sm:h-52 rounded-xl overflow-hidden border border-[#D5CEC2] shadow-2xs bg-stone-100 relative">
                                <iframe
                                  title="Lokasi Kilang KAMAAR Beddings di Google Maps"
                                  width="100%"
                                  height="100%"
                                  style={{ border: 0 }}
                                  loading="lazy"
                                  allowFullScreen
                                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                                    (siteSettings?.pickupAddress || '7878B Jalan Permatang Berangan') +
                                      ', ' +
                                      (siteSettings?.pickupCityState ||
                                        '13300 Tasek Gelugor Pulau Pinang')
                                  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                />
                              </div>
                            </div>

                            <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-200 text-[11.5px] text-amber-950 flex items-start gap-2">
                              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                              <p className="leading-relaxed">
                                {siteSettings?.pickupInstructions ||
                                  'Sila tunjukkan No. Pesanan atau Resit Pengesahan pembayaran semasa hadir ke kaunter kilang untuk penyerahan pesanan anda.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 4: Payment Methods Accordion (FPX & TNG eWallet via CHIP) */}
              <div id="payment-section" className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E8E2D8] shadow-2xs space-y-5">
                <div className="flex items-center justify-between border-b border-[#E8E2D8]/60 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-full bg-forest text-warmwhite text-xs font-bold flex items-center justify-center">
                      4
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-forest leading-tight">Kaedah Pembayaran</h2>
                      <span className="text-[11px] text-charcoal-muted">FPX Online Banking &amp; Touch &apos;n Go eWallet</span>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-800 font-medium flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    CHIP In Asia
                  </span>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Syarikat kami <strong>TUNAS SINAR JAYA ENTERPRISE</strong> menerima bayaran rasmi melalui <strong>FPX Perbankan Dalam Talian</strong> dan <strong>Touch &apos;n Go (TNG) eWallet</strong> yang diproses terus melalui gerbang pembayaran rasmi <strong>CHIP In Asia</strong> (Patuh Bank Negara Malaysia &amp; PayNet).
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
                              <span className="text-charcoal-muted">Gerbang Pembayaran:</span>
                              <strong className="text-forest font-semibold">CHIP In Asia (DuitNow QR / TNG)</strong>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-charcoal-muted">Pengesahan Status:</span>
                              <span className="text-emerald-700 font-bold flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                Automatik Serta-merta
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-charcoal-muted">Lokasi Pengilang:</span>
                              <strong className="text-forest text-right">Tasek Gelugor, Pulau Pinang</strong>
                            </div>
                          </div>

                          <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-950 leading-relaxed flex items-center space-x-2">
                            <Info className="w-4 h-4 text-[#015CA9] shrink-0" />
                            <span>
                              Selepas menekan butang <strong>&quot;Bayar Sekarang&quot;</strong>, anda akan dibawa ke gerbang rasmi CHIP untuk mengimbas kod DuitNow QR atau membuat bayaran terus di aplikasi <strong>Touch &apos;n Go eWallet</strong> anda.
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
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Adakah anda pasti mahu mengosongkan semua item dalam troli anda?')) {
                          clearCart()
                          setErrorMessage('')
                        }
                      }}
                      className="text-[11px] font-semibold text-charcoal-muted hover:text-red-600 transition-colors cursor-pointer mr-1"
                      title="Kosongkan troli"
                    >
                      Kosongkan
                    </button>
                  )}
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

              {/* Product Line Items (Zero Overlap, Full Flexibility with Edit & Remove) */}
              <div className="max-h-[360px] sm:max-h-[420px] overflow-y-auto overscroll-contain pr-1.5 space-y-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-forest/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-forest/40">
                {items.map((item) => {
                  const resolvedImg = item.imageUrl || item.image || defaultProductImage
                  const resolvedTitle = item.productName || item.title || 'KAMAAR Luxury Mattress'
                  const resolvedVariant = item.sizeName || item.variantName || item.dimensions || 'Single (90×190cm)'

                  // Find product in catalog
                  const matchedProduct = catalogProducts.find(
                    (p) => p.id === item.productId || p.variants?.some((v) => v.id === item.variantId)
                  )
                  const isUnavailable = catalogProducts.length > 0 && !matchedProduct
                  const otherVariants = matchedProduct?.variants?.filter((v) => v.isActive) || []
                  const hasAlternativeVariants = otherVariants.length > 1

                  return (
                    <div
                      key={item.variantId}
                      className={`group relative p-3 sm:p-3.5 rounded-2xl bg-white border shadow-2xs transition-all ${
                        isUnavailable
                          ? 'border-red-300 bg-red-50/20 ring-1 ring-red-200'
                          : 'border-[#E8E2D8] hover:border-forest/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        {/* Left: Thumbnail */}
                        <div className="relative shrink-0">
                          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl border border-[#E8E2D8] bg-cream/30 overflow-hidden relative shadow-2xs">
                            <Image
                              src={resolvedImg}
                              alt={resolvedTitle}
                              fill
                              sizes="72px"
                              className="object-cover"
                            />
                          </div>
                        </div>

                        {/* Middle: Product Title, Variant & Actions */}
                        <div className="min-w-0 flex-1 flex flex-col justify-start gap-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-forest leading-snug line-clamp-2" title={resolvedTitle}>
                              {resolvedTitle}
                            </h4>
                            {/* Delete / Remove Item Button */}
                            <button
                              type="button"
                              onClick={() => {
                                removeItem(item.variantId)
                                setErrorMessage('')
                              }}
                              className="p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                              title="Buang item daripada pesanan"
                              aria-label="Buang item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Variant badge & change button */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            <span className="text-[11px] font-semibold text-charcoal bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200 truncate max-w-[180px]">
                              {resolvedVariant}
                            </span>

                            {hasAlternativeVariants && (
                              <button
                                type="button"
                                onClick={() => setEditingVariantFor(editingVariantFor === item.variantId ? null : item.variantId)}
                                className="inline-flex items-center gap-1 text-[10.5px] font-bold text-forest hover:text-gold-dark bg-gold/15 hover:bg-gold/25 px-2 py-0.5 rounded-md border border-gold/40 transition-all cursor-pointer shadow-2xs"
                                title="Tukar pilihan saiz atau variasi"
                              >
                                <SlidersHorizontal className="w-3 h-3 text-gold-dark" />
                                <span>Tukar Pilihan</span>
                                <ChevronDown className={`w-3 h-3 transition-transform ${editingVariantFor === item.variantId ? 'rotate-180' : ''}`} />
                              </button>
                            )}
                          </div>

                          {item.sku && (
                            <span className="text-[9.5px] text-charcoal-muted/70 font-mono tracking-tight truncate">
                              SKU: {item.sku}
                            </span>
                          )}

                          {isUnavailable && (
                            <div className="mt-1 flex items-center justify-between gap-2 p-1.5 rounded-lg bg-red-100/90 border border-red-300 text-red-900 text-[10.5px] font-medium">
                              <span>⚠️ Tidak lagi dalam katalog</span>
                              <button
                                type="button"
                                onClick={() => {
                                  removeItem(item.variantId)
                                  setErrorMessage('')
                                }}
                                className="text-[10px] font-bold bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded shadow-2xs shrink-0 cursor-pointer"
                              >
                                Buang Sekarang
                              </button>
                            </div>
                          )}

                          {/* Bottom row: Quantity Stepper & Price */}
                          <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#F0EBE1]">
                            {/* Quantity Stepper */}
                            <div className="flex items-center border border-[#D5CEC2] rounded-lg bg-cream/40 overflow-hidden shadow-2xs">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center text-forest hover:bg-cream transition-colors cursor-pointer"
                                title="Kurangkan kuantiti"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-bold text-forest min-w-[22px] text-center font-mono">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center text-forest hover:bg-cream transition-colors cursor-pointer"
                                title="Tambah kuantiti"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
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

                          {/* Inline Variant Chooser Accordion */}
                          {editingVariantFor === item.variantId && hasAlternativeVariants && (
                            <div className="mt-2.5 p-2.5 bg-[#FAF7F2] rounded-xl border border-gold/50 shadow-sm space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
                              <div className="flex items-center justify-between text-[11px] font-bold text-forest border-b border-[#E8E2D8] pb-1">
                                <span>Pilih Saiz / Variasi:</span>
                                <button
                                  type="button"
                                  onClick={() => setEditingVariantFor(null)}
                                  className="text-neutral-400 hover:text-neutral-700 text-[10px] font-semibold cursor-pointer"
                                >
                                  ✕ Batal
                                </button>
                              </div>
                              <div className="space-y-1 max-h-44 overflow-y-auto pr-0.5">
                                {otherVariants.map((v) => {
                                  const isCurrent = v.id === item.variantId
                                  return (
                                    <button
                                      key={v.id}
                                      type="button"
                                      disabled={isCurrent}
                                      onClick={() => {
                                        updateItemVariant(item.variantId, {
                                          variantId: v.id,
                                          sizeName: v.sizeName,
                                          sku: v.sku,
                                          dimensions: v.dimensions,
                                          priceSen: v.priceSen,
                                          compareAtPriceSen: v.compareAtPriceSen,
                                          stockAvailable: v.stockQuantity,
                                        })
                                        setEditingVariantFor(null)
                                        setErrorMessage('')
                                      }}
                                      className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-all ${
                                        isCurrent
                                          ? 'bg-forest text-warmwhite font-bold cursor-default shadow-xs'
                                          : 'bg-white hover:bg-gold/15 border border-[#E8E2D8] text-forest cursor-pointer'
                                      }`}
                                    >
                                      <div className="min-w-0 pr-2">
                                        <div className="font-semibold text-xs leading-tight">{v.sizeName}</div>
                                        <div className={`text-[10px] leading-tight ${isCurrent ? 'text-warmwhite/80' : 'text-neutral-500'}`}>
                                          {v.dimensions}
                                        </div>
                                      </div>
                                      <div className="text-right shrink-0 font-bold font-serif whitespace-nowrap">
                                        {formatMYR(v.priceSen)}
                                        {isCurrent && <span className="text-[9px] block font-sans opacity-90">(Pilihan Semasa)</span>}
                                      </div>
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>
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
                    <span>
                      {isPickup ? 'Ambil Sendiri di Kilang' : 'Penghantaran White-Glove'}
                    </span>
                    <span
                      title={
                        isPickup
                          ? 'Ambil sendiri terus di kilang KAMAAR Beddings, Tasek Gelugor, Pulau Pinang (Percuma)'
                          : 'Penghantaran & pemasangan percuma di bilik tidur anda di seluruh Semenanjung Malaysia'
                      }
                      className="cursor-help inline-flex text-neutral-400"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </span>
                  </span>
                  <span className="font-bold text-forest">
                    {effectiveShippingSen === 0 ? 'PERCUMA' : formatMYR(effectiveShippingSen)}
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
