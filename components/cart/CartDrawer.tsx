'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Sparkles, FileText } from 'lucide-react'
import { useCart } from '@/lib/context/CartContext'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { formatMYR } from '@/lib/utils/format'
import { calculateTieredPrice } from '@/lib/utils/pricing'

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
  const { t, locale } = useLanguage()
  const router = useRouter()

  const [inputCoupon, setInputCoupon] = useState('')
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [activeRefCode, setActiveRefCode] = useState<string | null>(null)
  const [activeRefName, setActiveRefName] = useState<string | null>(null)
  const [thresholdSen, setThresholdSen] = useState(20000)
  const [showCouponInput, setShowCouponInput] = useState(false)
  const [showNotesInput, setShowNotesInput] = useState(false)

  React.useEffect(() => {
    let isMounted = true
    try {
      fetch('/api/site-settings')
        .then((r) => r.json())
        .then((d) => {
          if (isMounted && d?.settings?.freeShippingThresholdSen) {
            setThresholdSen(d.settings.freeShippingThresholdSen)
          }
        })
        .catch(() => {})
    } catch (_) {}
    return () => {
      isMounted = false
    }
  }, [isDrawerOpen])

  React.useEffect(() => {
    try {
      const code = sessionStorage.getItem('kamaar_session_ref')
      if (code) {
        setActiveRefCode(code)
        const name = sessionStorage.getItem('kamaar_session_ref_name')
        if (name) setActiveRefName(name)
      } else {
        setActiveRefCode(null)
        setActiveRefName(null)
      }
    } catch (_) {}
  }, [isDrawerOpen])

  // Free shipping calculation threshold (dynamically linked to Admin Settings - defaults to RM200 = 20000 sen)
  const FREE_SHIPPING_THRESHOLD = thresholdSen || 20000
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
        setShowCouponInput(false)
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

      {/* Drawer slide-over container */}
      <div
        className={`fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 pointer-events-none transform transition-transform duration-300 ease-out will-change-transform ${
          isDrawerOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full'
        }`}
      >
        <div className="w-screen max-w-full sm:w-[440px] sm:max-w-md bg-[#F8FAFC] shadow-2xl flex flex-col h-full max-h-[100dvh] overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3.5 sm:px-5 sm:py-4 border-b border-slate-200/80 flex items-center justify-between bg-white flex-shrink-0 shadow-2xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center text-forest">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-serif font-bold text-forest tracking-wide">
                  {t.cartTitle}
                </h2>
                <span className="text-[11px] text-slate-500 font-medium">
                  {items.reduce((s, i) => s + i.quantity, 0)} {locale === 'bm' ? 'barang dipilih' : 'items selected'}
                </span>
              </div>
            </div>
            <button
              onClick={closeDrawer}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Reassurance Bar */}
          <div className="px-4 py-2.5 bg-forest-dark text-warmwhite text-xs flex-shrink-0 shadow-inner">
            <div className="flex items-center justify-between font-medium mb-1.5">
              <span className="flex items-center space-x-1.5 truncate pr-2">
                <Sparkles className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                <span className="truncate text-[11.5px]">
                  {isFreeShipping
                    ? (locale === 'bm'
                        ? 'Tahniah! Anda Layak Penghantaran Percuma!'
                        : 'Qualified for Free White-Glove Peninsular Delivery!')
                    : (locale === 'bm'
                        ? `Tambah ${formatMYR(amountToFreeShipping)} lagi untuk Free Pos`
                        : `Add ${formatMYR(amountToFreeShipping)} more for Free Delivery`)}
                </span>
              </span>
              <span className="text-gold font-bold text-[11px] flex-shrink-0">{progressPercent}%</span>
            </div>
            <div className="w-full bg-forest h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-gold-light to-gold h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Scrollable Items Body (70-75% screen height with smooth momentum scrolling) */}
          <div
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3.5 pt-3.5 pb-10 sm:px-5 sm:pt-5 sm:pb-10 space-y-3"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-gold-dark mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-800">{t.emptyCartTitle}</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">{t.emptyCartText}</p>
                <Link
                  href="/collections/mattress"
                  onClick={closeDrawer}
                  className="mt-6 px-6 py-2.5 bg-forest text-warmwhite rounded-xl text-xs sm:text-sm font-bold hover:bg-forest-dark transition-all shadow-md flex items-center space-x-2"
                >
                  <span>{t.startShopping}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <>
                {/* Product Items List (clean luxury cards) */}
                <div className="space-y-2.5">
                  {items.map((item) => {
                    const tierCalc = calculateTieredPrice(item.priceSen, item.quantity, item.quantityTiers)
                    return (
                      <div
                        key={item.variantId}
                        className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all flex gap-3"
                      >
                        {/* Thumbnail Image */}
                        <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-200/70" style={{ width: '72px', height: '72px' }}>
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.productName}
                              fill
                              sizes="80px"
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400">
                              <ShoppingBag className="w-6 h-6 text-gold" />
                            </div>
                          )}
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            {/* Product Title & Delete Button */}
                            <div className="flex items-start justify-between gap-1">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 leading-tight">
                                {item.productName}
                              </h4>
                              <button
                                type="button"
                                onClick={() => removeItem(item.variantId)}
                                className="w-6 h-6 -mr-1 -mt-1 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
                                aria-label="Padam item"
                                title="Padam item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Size & Dimensions Badge */}
                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                              <span className="inline-flex items-center text-[10.5px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                                Saiz: {item.sizeName}
                              </span>
                              {item.dimensions && (
                                <span className="text-[10px] text-slate-400">
                                  {item.dimensions}
                                </span>
                              )}
                            </div>

                            {/* Combo / Tier Applied Badge */}
                            {tierCalc.isTierApplied && (
                              <div className="mt-1">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                                  🎉 {tierCalc.appliedTier?.label || `Pakej Kombo (${tierCalc.appliedTier?.quantity} Unit)`}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Bottom Row: Stepper + Price */}
                          <div className="flex items-end justify-between mt-2 pt-1 border-t border-slate-100">
                            {/* Quantity Stepper */}
                            <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 shadow-2xs">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 active:scale-90 transition-all rounded-l-lg cursor-pointer"
                                aria-label="Kurangkan kuantiti"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-7 text-center text-xs font-bold text-slate-800">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 active:scale-90 transition-all rounded-r-lg cursor-pointer"
                                aria-label="Tambah kuantiti"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <span className="text-sm sm:text-base font-bold text-forest">
                                {formatMYR(tierCalc.totalSen)}
                              </span>
                              {tierCalc.savingsSen > 0 ? (
                                <div className="flex items-center justify-end gap-1 mt-0.5">
                                  <span className="text-[10px] line-through text-slate-400">
                                    {formatMYR(tierCalc.regularTotalSen)}
                                  </span>
                                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                                    Jimat {formatMYR(tierCalc.savingsSen)}
                                  </span>
                                </div>
                              ) : item.compareAtPriceSen && item.compareAtPriceSen > item.priceSen ? (
                                <span className="block text-[10.5px] line-through text-slate-400">
                                  {formatMYR(item.compareAtPriceSen * item.quantity)}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Additional Options (Coupon & Notes inside the scroll container, NEVER clogging sticky footer!) */}
                <div className="pt-2 space-y-2">
                  {/* Referral Affiliate Pill if present */}
                  {activeRefCode && (
                    <div className="p-2.5 rounded-xl bg-blue-50/90 border border-blue-200/70 text-xs flex items-center justify-between shadow-2xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span className="truncate text-slate-700 font-medium">
                          Rujukan:{' '}
                          <strong className="text-forest font-bold">
                            {activeRefName || activeRefCode} ({activeRefCode})
                          </strong>
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0">
                        Aktif
                      </span>
                    </div>
                  )}

                  {/* Coupon Code Accordion Box */}
                  <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs">
                    {couponCode ? (
                      <div className="p-2.5 flex items-center justify-between bg-gold/10 text-xs">
                        <div className="flex items-center space-x-2 text-forest font-semibold">
                          <Tag className="w-4 h-4 text-gold-dark" />
                          <span>Kod &ldquo;{couponCode}&rdquo; Digunakan</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCouponCode('')
                            setCouponSuccess('')
                          }}
                          className="text-red-600 hover:underline font-bold text-xs cursor-pointer"
                        >
                          {t.removeCoupon}
                        </button>
                      </div>
                    ) : (
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowCouponInput((v) => !v)}
                          className="w-full px-3 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-forest transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Tag className="w-3.5 h-3.5 text-gold-dark" />
                            <span>{locale === 'bm' ? 'Ada Kod Baucar / Kupon Diskaun?' : 'Have a Promo or Coupon Code?'}</span>
                          </span>
                          <span className="text-slate-400 text-xs font-bold">
                            {showCouponInput ? '−' : '+'}
                          </span>
                        </button>

                        {showCouponInput && (
                          <div className="px-3 pb-3 pt-1 border-t border-slate-100 space-y-2">
                            <form onSubmit={handleApplyCoupon} className="flex gap-2">
                              <input
                                type="text"
                                value={inputCoupon}
                                onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                                placeholder="Masukkan kod kupon..."
                                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-forest uppercase font-mono"
                              />
                              <button
                                type="submit"
                                disabled={isValidating || !inputCoupon.trim()}
                                className="px-4 py-2 bg-forest text-warmwhite text-xs font-bold rounded-lg hover:bg-forest-dark disabled:opacity-50 transition-colors cursor-pointer"
                              >
                                {isValidating ? '...' : t.applyCoupon}
                              </button>
                            </form>
                            {couponError && <p className="text-[11px] text-red-600 font-medium">{couponError}</p>}
                            {couponSuccess && <p className="text-[11px] text-emerald-600 font-medium">{couponSuccess}</p>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Delivery Notes Accordion Box */}
                  <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setShowNotesInput((v) => !v)}
                      className="w-full px-3 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-forest transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>
                          {notes.trim()
                            ? (locale === 'bm' ? '✓ Nota Pesanan Disimpan' : '✓ Delivery Note Saved')
                            : (locale === 'bm' ? 'Tambah Nota Penghantaran (Pilihan)' : 'Add Delivery Note (Optional)')}
                        </span>
                      </span>
                      <span className="text-slate-400 text-xs font-bold">
                        {showNotesInput ? '−' : '+'}
                      </span>
                    </button>

                    {showNotesInput && (
                      <div className="px-3 pb-3 pt-1 border-t border-slate-100">
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Contoh: Naik lif tingkat 3, letak di depan pintu jika tiada orang."
                          rows={2}
                          className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-forest resize-none placeholder-slate-400"
                        />
                      </div>
                    )}
                  </div>

                  {/* Trust Badges */}
                  <div className="py-2 flex items-center justify-center gap-3 text-[10px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Bayaran Selamat
                    </span>
                    <span>•</span>
                    <span>Terus Dari Kilang</span>
                    <span>•</span>
                    <span>Jaminan Kualiti</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sticky Checkout Footer (Compact & Clean - Never obstructs scrolling!) */}
          {items.length > 0 && (
            <div className="p-3.5 sm:p-4 bg-white/98 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-8px_25px_rgba(0,0,0,0.06)] flex-shrink-0 space-y-2.5">
              {/* Summary Row */}
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Jumlah Pesanan:</span>
                  <span className="block text-[10.5px] text-emerald-600 font-semibold">
                    {isFreeShipping ? '✓ Penghantaran Percuma' : '+ Kos pos di checkout'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg sm:text-xl font-bold text-forest">
                    {formatMYR(subtotalSen)}
                  </span>
                </div>
              </div>

              {/* Primary Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-forest text-warmwhite text-xs sm:text-sm font-bold tracking-wider uppercase rounded-xl hover:bg-forest-dark active:scale-[0.98] transition-all shadow-md flex items-center justify-center space-x-2 luxury-btn cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-gold" />
                <span>{t.proceedToCheckout}</span>
                <ArrowRight className="w-4 h-4 ml-1 text-gold" />
              </button>

              {/* View Full Cart Link */}
              <div className="text-center pt-0.5">
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="text-xs font-semibold text-slate-500 hover:text-forest transition-colors py-0.5 inline-block"
                >
                  {locale === 'bm' ? 'Lihat & Urus Troli Penuh →' : 'View Full Shopping Cart →'}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
