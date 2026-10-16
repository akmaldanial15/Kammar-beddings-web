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

      {/* Drawer slide-over wrapper: pl-0 on mobile eliminates the 40px rightward clipping overflow */}
      <div
        className={`fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 pointer-events-none transform transition-transform duration-300 ease-out will-change-transform ${
          isDrawerOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full'
        }`}
      >
        <div className="w-screen max-w-full sm:w-[440px] sm:max-w-md bg-white shadow-2xl flex flex-col h-full max-h-[100dvh] overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-borderLight flex items-center justify-between bg-cream-light flex-shrink-0">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-forest" />
              <h2 className="text-base sm:text-lg font-serif font-bold text-forest tracking-wide">
                {t.cartTitle} ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 text-charcoal-muted hover:text-charcoal rounded-full hover:bg-cream transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Reassurance Bar */}
          <div className="px-4 py-2.5 bg-forest-dark text-warmwhite text-xs flex-shrink-0">
            <div className="flex items-center justify-between font-medium mb-1.5">
              <span className="flex items-center space-x-1.5 truncate pr-2">
                <Sparkles className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                <span className="truncate">
                  {isFreeShipping
                    ? (locale === 'bm'
                        ? 'Tahniah! Pesanan Anda Layak Penghantaran Percuma!'
                        : 'Qualified for Free White-Glove Peninsular Delivery!')
                    : (locale === 'bm'
                        ? `Tambah ${formatMYR(amountToFreeShipping)} lagi untuk Penghantaran Percuma`
                        : `Add ${formatMYR(amountToFreeShipping)} more for Free Delivery`)}
                </span>
              </span>
              <span className="text-gold font-bold flex-shrink-0">{progressPercent}%</span>
            </div>
            <div className="w-full bg-forest h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gold h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items Area with independent smooth scrolling */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-5 divide-y divide-borderLight">
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
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-cream flex-shrink-0 border border-borderLight shadow-2xs">
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
                        <div className="w-full h-full flex items-center justify-center bg-cream text-forest">
                          <ShoppingBag className="w-7 h-7 text-gold" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="text-xs sm:text-sm font-semibold text-charcoal line-clamp-2 pr-1">
                            {item.productName}
                          </h4>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="text-charcoal-muted hover:text-sale p-1 transition-colors flex-shrink-0 cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gold-dark font-medium mt-0.5">
                          Size: {item.sizeName}
                        </p>
                        <p className="text-[11px] text-charcoal-muted">{item.dimensions}</p>
                        {(() => {
                          const tierCalc = calculateTieredPrice(item.priceSen, item.quantity, item.quantityTiers)
                          if (!tierCalc.isTierApplied) return null
                          return (
                            <div className="mt-1">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md">
                                🎉 {tierCalc.appliedTier?.label || `Pakej Kombo (${tierCalc.appliedTier?.quantity} Unit)`}
                              </span>
                            </div>
                          )
                        })()}
                      </div>

                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center border border-borderLight rounded-md bg-cream-light">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="p-1 text-charcoal hover:bg-cream transition-colors rounded-l cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold text-charcoal">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="p-1 text-charcoal hover:bg-cream transition-colors rounded-r cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {(() => {
                          const tierCalc = calculateTieredPrice(item.priceSen, item.quantity, item.quantityTiers)
                          return (
                            <div className="text-right">
                              <span className="text-sm font-bold text-forest">
                                {formatMYR(tierCalc.totalSen)}
                              </span>
                              {tierCalc.savingsSen > 0 ? (
                                <div className="space-y-0.5">
                                  <span className="block text-[10.5px] line-through text-charcoal-muted">
                                    {formatMYR(tierCalc.regularTotalSen)}
                                  </span>
                                  <span className="inline-block text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                    Jimat {formatMYR(tierCalc.savingsSen)}
                                  </span>
                                </div>
                              ) : item.compareAtPriceSen && item.compareAtPriceSen > item.priceSen ? (
                                <span className="block text-[11px] line-through text-charcoal-muted">
                                  {formatMYR(item.compareAtPriceSen * item.quantity)}
                                </span>
                              ) : null}
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Area with Collapsible Promo & Notes, Totals, and Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-borderLight bg-cream-light space-y-3 flex-shrink-0 max-h-[60vh] overflow-y-auto">
              {/* Voucher Code & Notes Controls (Collapsible to save vertical screen space on mobile) */}
              <div className="space-y-2">
                {couponCode ? (
                  <div className="flex items-center justify-between bg-gold/15 border border-gold/40 rounded-lg p-2 text-xs">
                    <div className="flex items-center space-x-1.5 text-forest font-semibold">
                      <Tag className="w-3.5 h-3.5 text-gold-dark" />
                      <span>Kod &ldquo;{couponCode}&rdquo; Digunakan</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCouponCode('')
                        setCouponSuccess('')
                      }}
                      className="text-sale hover:underline font-semibold text-xs cursor-pointer"
                    >
                      {t.removeCoupon}
                    </button>
                  </div>
                ) : (
                  <div>
                    {!showCouponInput ? (
                      <button
                        type="button"
                        onClick={() => setShowCouponInput(true)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-gold-dark transition-colors py-0.5 cursor-pointer"
                      >
                        <Tag className="w-3.5 h-3.5 text-gold-dark" />
                        <span>+ {locale === 'bm' ? 'Guna Kod Baucar / Kupon' : 'Add Coupon Code'}</span>
                      </button>
                    ) : (
                      <div className="space-y-1.5 bg-white p-2.5 rounded-lg border border-borderLight shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-charcoal flex items-center gap-1">
                            <Tag className="w-3 h-3 text-gold-dark" />
                            {t.couponCode}
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowCouponInput(false)}
                            className="text-[11px] text-charcoal-muted hover:text-charcoal cursor-pointer"
                          >
                            Tutup
                          </button>
                        </div>
                        <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                          <input
                            type="text"
                            value={inputCoupon}
                            onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                            placeholder={t.couponCode}
                            className="flex-1 px-3 py-1.5 text-xs bg-warmwhite border border-borderLight rounded-md outline-none focus:border-gold uppercase"
                          />
                          <button
                            type="submit"
                            disabled={isValidating || !inputCoupon.trim()}
                            className="px-3 py-1.5 bg-forest text-warmwhite text-xs font-semibold rounded-md hover:bg-forest-dark disabled:opacity-50 transition-colors cursor-pointer"
                          >
                            {isValidating ? '...' : t.applyCoupon}
                          </button>
                        </form>
                      </div>
                    )}
                    {couponError && <p className="text-[11px] text-sale mt-1">{couponError}</p>}
                    {couponSuccess && <p className="text-[11px] text-forest font-medium mt-1">{couponSuccess}</p>}
                  </div>
                )}

                {/* Delivery notes optional request */}
                <div>
                  {!showNotesInput && !notes.trim() ? (
                    <button
                      type="button"
                      onClick={() => setShowNotesInput(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-charcoal transition-colors py-0.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-charcoal-muted" />
                      <span>+ {locale === 'bm' ? 'Tambah Nota Pesanan / Penghantaran' : 'Add Delivery Note'}</span>
                    </button>
                  ) : (
                    <div className="space-y-1.5 bg-white p-2.5 rounded-lg border border-borderLight shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-charcoal flex items-center gap-1">
                          <FileText className="w-3 h-3 text-forest" />
                          {locale === 'bm' ? 'Nota Penghantaran' : 'Delivery Note'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowNotesInput(false)}
                          className="text-[11px] text-charcoal-muted hover:text-charcoal cursor-pointer"
                        >
                          Tutup
                        </button>
                      </div>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Contoh: Naik lif tingkat 3, letak di depan pintu"
                        rows={2}
                        className="w-full px-3 py-1.5 text-xs bg-warmwhite border border-borderLight rounded-md outline-none focus:border-gold placeholder-charcoal-muted/70 resize-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-1.5 text-xs bg-white/80 p-3 rounded-lg border border-borderLight/60">
                <div className="flex justify-between text-charcoal-muted">
                  <span>{t.subtotal}</span>
                  <span className="font-semibold text-charcoal">{formatMYR(subtotalSen)}</span>
                </div>
                <div className="flex justify-between text-charcoal-muted">
                  <span>{t.estimatedShipping}</span>
                  <span className="font-semibold text-forest">
                    {isFreeShipping ? (locale === 'bm' ? 'PERCUMA' : 'FREE') : 'Calculated at Checkout'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-forest pt-1.5 border-t border-borderLight/60">
                  <span>{t.total}</span>
                  <span className="text-base text-forest font-bold">{formatMYR(subtotalSen)}</span>
                </div>
              </div>

              {/* Active Affiliate Indicator in Cart */}
              {activeRefCode && (
                <div className="p-2.5 rounded-lg bg-blue-50/80 border border-[#1E4E8C]/20 text-[11px] flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Sparkles className="w-3.5 h-3.5 text-[#B49A58] shrink-0" />
                    <span className="truncate text-charcoal font-medium">
                      Rujukan:{' '}
                      <strong className="text-[#1E4E8C]">
                        {activeRefName || activeRefCode} ({activeRefCode})
                      </strong>
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0">
                    Aktif
                  </span>
                </div>
              )}

              {/* CTAs */}
              <div className="space-y-2 pt-1 pb-1 sm:pb-0">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 bg-forest text-warmwhite text-xs sm:text-sm font-bold tracking-wider uppercase rounded-xl hover:bg-forest-dark active:scale-[0.99] transition-all shadow-md flex items-center justify-center space-x-2 luxury-btn cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-gold" />
                  <span>{t.proceedToCheckout}</span>
                </button>
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="w-full py-2.5 block text-center bg-white text-charcoal border border-borderLight text-xs font-semibold rounded-xl hover:bg-cream transition-colors"
                >
                  {locale === 'bm' ? 'Lihat Troli Penuh' : 'View Full Shopping Cart'}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

