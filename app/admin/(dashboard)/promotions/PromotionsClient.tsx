'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { Coupon } from '@/types'
import { formatMYR, formatDateMY } from '@/lib/utils/format'
import {
  Plus,
  Tag,
  Trash2,
  Edit2,
  Copy,
  CheckCircle,
  AlertCircle,
  Star,
  Eye,
  EyeOff,
  Search,
  Sparkles,
  ExternalLink,
  Layers,
  Clock,
  Users,
  ShieldCheck,
  Check,
  Percent,
  Calendar,
  Sliders,
} from 'lucide-react'

interface PromotionsClientProps {
  initialCoupons: Coupon[]
}

export function PromotionsClient({ initialCoupons }: PromotionsClientProps) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (editingCoupon) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [editingCoupon])
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'featured' | 'active' | 'inactive'>('all')
  const [activeModalTab, setActiveModalTab] = useState<'discount' | 'homepage' | 'rules'>('discount')

  // Quick stats calculation
  const stats = useMemo(() => {
    const activeCount = coupons.filter((c) => c.isActive).length
    const featuredCount = coupons.filter((c) => c.isActive && c.showOnHomepage).length
    const totalRedemptions = coupons.reduce((sum, c) => sum + (c.usageCount || 0), 0)
    const inactiveCount = coupons.filter((c) => !c.isActive).length
    return { activeCount, featuredCount, totalRedemptions, inactiveCount }
  }, [coupons])

  // Filtered coupons
  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      // Search match
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !query ||
        c.code.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        (c.customTitle && c.customTitle.toLowerCase().includes(query))

      if (!matchesSearch) return false

      // Tab filter
      if (statusFilter === 'featured') return c.showOnHomepage && c.isActive
      if (statusFilter === 'active') return c.isActive
      if (statusFilter === 'inactive') return !c.isActive
      return true
    })
  }, [coupons, searchQuery, statusFilter])

  // Helper date conversions
  const toDateInputValue = (isoStr?: string) => {
    if (!isoStr) return ''
    try {
      return isoStr.split('T')[0]
    } catch {
      return ''
    }
  }

  const fromDateInputValue = (val: string, isEnd = false) => {
    if (!val) return new Date().toISOString()
    return isEnd ? `${val}T23:59:59Z` : `${val}T00:00:00Z`
  }

  // Open New Coupon
  const handleOpenNew = () => {
    const now = new Date()
    const oneYearLater = new Date(now.getTime() + 365 * 86400000)

    const newC: Coupon = {
      id: `cpn-${Date.now()}`,
      code: 'PROMO2026',
      description: 'Diskaun istimewa tilam eksklusif',
      discountType: 'percentage',
      discountValue: 10,
      minSpendSen: 100000,
      maxDiscountSen: 30000,
      startsAt: now.toISOString(),
      endsAt: oneYearLater.toISOString(),
      usageLimit: 500,
      usageCount: 0,
      perCustomerLimit: 1,
      isActive: true,
      showOnHomepage: true,
      featuredOrder: stats.featuredCount + 1,
      customTitle: '10% Mattress Privilege',
      customBadge: '10% OFF',
      customerRestriction: 'all',
      applicableCategory: 'mattress',
    }
    setEditingCoupon(newC)
    setActiveModalTab('discount')
  }

  // Quick Duplicate
  const handleDuplicate = (base: Coupon) => {
    const randomSuffix = Math.floor(10 + Math.random() * 90)
    const cloned: Coupon = {
      ...base,
      id: `cpn-${Date.now()}`,
      code: `${base.code}_SALIN${randomSuffix}`.substring(0, 16).toUpperCase(),
      usageCount: 0,
      showOnHomepage: false,
    }
    setEditingCoupon(cloned)
    setActiveModalTab('discount')
  }

  // Quick Inline Toggle Homepage Showcase
  const handleToggleHomepage = async (c: Coupon) => {
    const nextVal = !c.showOnHomepage
    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: c.id,
          updates: { showOnHomepage: nextVal },
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setCoupons((prev) => prev.map((item) => (item.id === c.id ? { ...item, showOnHomepage: nextVal } : item)))
        setFeedback({
          text: nextVal
            ? `Kupon [${c.code}] kini DITAYANGKAN di Halaman Utama (Sleep Privileges)!`
            : `Kupon [${c.code}] telah DIKELUARKAN dari Halaman Utama.`,
          type: 'success',
        })
      } else {
        setFeedback({ text: data.error || 'Gagal mengubah status paparan homepage.', type: 'error' })
      }
    } catch {
      setFeedback({ text: 'Ralat sambungan rangkaian.', type: 'error' })
    }
  }

  // Quick Inline Toggle Active / Disabled
  const handleToggleActive = async (c: Coupon) => {
    const nextVal = !c.isActive
    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: c.id,
          updates: { isActive: nextVal },
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setCoupons((prev) => prev.map((item) => (item.id === c.id ? { ...item, isActive: nextVal } : item)))
        setFeedback({
          text: nextVal ? `Kupon [${c.code}] telah diaktifkan.` : `Kupon [${c.code}] telah dinyahaktifkan.`,
          type: 'success',
        })
      } else {
        setFeedback({ text: data.error || 'Gagal menukar status kupon.', type: 'error' })
      }
    } catch {
      setFeedback({ text: 'Ralat sambungan rangkaian.', type: 'error' })
    }
  }

  // Save Full Coupon (Modal)
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCoupon) return

    setIsSubmitting(true)
    setFeedback(null)

    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coupon: editingCoupon }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setCoupons((prev) => {
          const idx = prev.findIndex((c) => c.id === data.coupon.id)
          if (idx >= 0) {
            const next = [...prev]
            next[idx] = data.coupon
            return next
          }
          return [data.coupon, ...prev]
        })
        setFeedback({
          text: `Kupon ${data.coupon.code} berjaya disimpan dan dikemaskini.`,
          type: 'success',
        })
        setEditingCoupon(null)
      } else {
        setFeedback({ text: data.error || 'Gagal menyimpan kupon.', type: 'error' })
      }
    } catch {
      setFeedback({ text: 'Ralat rangkaian semasa menyimpan kupon.', type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete Coupon
  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Adakah anda pasti mahu memadamkan kod kupon [${code}] ini? Tindakan ini tidak boleh diundur.`)) return

    try {
      const res = await fetch(`/api/admin/promotions?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok && data.success) {
        setCoupons((prev) => prev.filter((c) => c.id !== id))
        setFeedback({ text: `Kupon ${code} telah dipadamkan.`, type: 'success' })
      } else {
        setFeedback({ text: data.error || 'Gagal memadam kupon.', type: 'error' })
      }
    } catch {
      setFeedback({ text: 'Ralat rangkaian semasa memadam kupon.', type: 'error' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm animate-fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            {feedback.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            )}
            <span className="font-semibold">{feedback.text}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs font-bold underline ml-4 hover:opacity-75 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* TOP METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Active */}
        <div className="bg-warmwhite rounded-2xl p-4 border border-borderLight shadow-xs animate-fade-in-up delay-50 luxury-card-hover">
          <div className="flex items-center justify-between text-secondary mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-muted">
              Kupon Aktif
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-charcoal">{stats.activeCount}</div>
          <p className="text-[11px] text-charcoal-muted mt-1">Sedia ditebus di checkout</p>
        </div>

        {/* Featured on Homepage */}
        <div className="bg-warmwhite rounded-2xl p-4 border border-borderLight shadow-xs animate-fade-in-up delay-100 luxury-card-hover">
          <div className="flex items-center justify-between text-secondary mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-muted">
              Ditayang di Halaman Utama
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-forest">{stats.featuredCount}</div>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-charcoal-muted">
            <span>Seksyen &apos;Sleep Privileges&apos;</span>
            <Link href="/" target="_blank" className="text-forest hover:underline inline-flex items-center">
              <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
            </Link>
          </div>
        </div>

        {/* Total Redemptions */}
        <div className="bg-warmwhite rounded-2xl p-4 border border-borderLight shadow-xs animate-fade-in-up delay-150 luxury-card-hover">
          <div className="flex items-center justify-between text-secondary mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-muted">
              Jumlah Penebusan
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-charcoal">{stats.totalRedemptions}</div>
          <p className="text-[11px] text-charcoal-muted mt-1">Kali kod ditebus oleh pelanggan</p>
        </div>

        {/* Inactive / Ended */}
        <div className="bg-warmwhite rounded-2xl p-4 border border-borderLight shadow-xs animate-fade-in-up delay-200 luxury-card-hover">
          <div className="flex items-center justify-between text-secondary mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-muted">
              Nyahaktif / Arkib
            </span>
            <div className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-600 flex items-center justify-center">
              <EyeOff className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-500">{stats.inactiveCount}</div>
          <p className="text-[11px] text-charcoal-muted mt-1">Kupon disekat atau ditutup</p>
        </div>
      </div>

      {/* ACTION BAR: SEARCH, TABS & CREATE BUTTON */}
      <div className="bg-warmwhite p-4 rounded-2xl border border-borderLight shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 animate-fade-in-up delay-250">
        {/* Left: Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-forest text-warmwhite shadow-xs'
                : 'bg-neutral-100 text-charcoal hover:bg-neutral-200'
            }`}
          >
            Semua ({coupons.length})
          </button>

          <button
            onClick={() => setStatusFilter('featured')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              statusFilter === 'featured'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>⭐ Di Halaman Utama ({stats.featuredCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'active'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            Aktif ({stats.activeCount})
          </button>

          <button
            onClick={() => setStatusFilter('inactive')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'inactive'
                ? 'bg-neutral-600 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Nyahaktif ({stats.inactiveCount})
          </button>
        </div>

        {/* Right: Search & Create Button */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kod atau perincian..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs bg-cream/50 border border-borderLight rounded-xl focus:outline-none focus:border-forest"
            />
          </div>

          <button
            onClick={handleOpenNew}
            className="flex items-center space-x-1.5 px-4 py-2 bg-forest text-warmwhite text-xs font-bold rounded-xl hover:bg-forest-dark transition-all duration-200 shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Cipta Kod Baucar</span>
          </button>
        </div>
      </div>

      {/* COUPONS TABLE WITH DIRECT CONTROLS */}
      <div className="bg-warmwhite rounded-3xl border border-borderLight shadow-sm overflow-hidden animate-fade-in-up delay-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-borderLight text-charcoal-muted uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Kod Kupon & Perincian</th>
                <th className="py-3.5 px-4">Diskaun & Syarat Belanja</th>
                <th className="py-3.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>Tayang di Web Utama</span>
                  </div>
                </th>
                <th className="py-3.5 px-4">Penggunaan / Kuota</th>
                <th className="py-3.5 px-4">Kelayakan Pelanggan</th>
                <th className="py-3.5 px-4">Tempoh Sah</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Tindakan Pentadbir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLight">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-secondary">
                    <Tag className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                    <p className="font-semibold text-charcoal">Tiada kod baucar ditemui.</p>
                    <p className="text-xs text-secondary mt-1">Cuba tukar kriteria carian atau penapis status.</p>
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((c) => {
                  const usagePercent = c.usageLimit ? Math.min(100, Math.round((c.usageCount / c.usageLimit) * 100)) : null
                  const isExpired = new Date(c.endsAt).getTime() < Date.now()

                  return (
                    <tr key={c.id} className="hover:bg-cream/40 transition-colors">
                      {/* 1. Code & Description */}
                      <td className="py-4 px-4 font-mono">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-forest text-sm bg-forest/5 px-2.5 py-1 rounded-lg border border-forest/15">
                            {c.code}
                          </span>
                          {c.showOnHomepage && (
                            <span
                              className="px-2 py-0.5 rounded-full text-[9.5px] font-black bg-amber-500 text-white flex items-center gap-1 shadow-xs"
                              title={`Ditayangkan pada kedudukan #${c.featuredOrder || 1} di Halaman Utama`}
                            >
                              <Star className="w-2.5 h-2.5 fill-current" />
                              <span>#{c.featuredOrder || 1}</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-sans text-charcoal block font-medium mt-1">
                          {c.customTitle || c.description}
                        </span>
                        {c.customBadge && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded bg-neutral-100 text-[10px] text-charcoal-muted font-semibold">
                            Lencana: {c.customBadge}
                          </span>
                        )}
                      </td>

                      {/* 2. Discount & Rules */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-charcoal flex items-center gap-1">
                          <Percent className="w-3.5 h-3.5 text-forest" />
                          <span>
                            {c.discountType === 'percentage'
                              ? `${c.discountValue}% Diskaun`
                              : c.discountType === 'fixed_amount'
                              ? `${formatMYR(c.discountValue)} Potongan`
                              : 'Penghantaran Percuma'}
                          </span>
                        </div>
                        <div className="text-[11px] text-secondary mt-0.5 space-y-0.5">
                          <div>Min Belanja: {c.minSpendSen ? formatMYR(c.minSpendSen) : 'Tiada'}</div>
                          {c.maxDiscountSen && <div>Had Maks: {formatMYR(c.maxDiscountSen)}</div>}
                        </div>
                      </td>

                      {/* 3. Homepage Showcase Direct 1-Click Toggle */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleHomepage(c)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                            c.showOnHomepage
                              ? 'bg-amber-500 hover:bg-amber-600 text-white'
                              : 'bg-neutral-100 hover:bg-amber-100 text-neutral-600 hover:text-amber-800 border border-borderLight'
                          }`}
                          title={
                            c.showOnHomepage
                              ? 'Klik untuk KELUARKAN baucar ini daripada paparan Halaman Utama'
                              : 'Klik untuk TAYANGKAN baucar ini pada seksyen Sleep Privileges Halaman Utama'
                          }
                        >
                          <Star className={`w-3.5 h-3.5 ${c.showOnHomepage ? 'fill-current' : ''}`} />
                          <span>{c.showOnHomepage ? 'Ditayang' : 'Pilih Tayang'}</span>
                        </button>
                      </td>

                      {/* 4. Redemptions & Quota Bar */}
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-charcoal font-mono">{c.usageCount}</span>
                          <span className="text-[10px] text-secondary">
                            {c.usageLimit ? `drpd ${c.usageLimit}` : 'Tanpa Had'}
                          </span>
                        </div>
                        {usagePercent !== null ? (
                          <div className="w-24 bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                usagePercent >= 90
                                  ? 'bg-rose-500'
                                  : usagePercent >= 70
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${usagePercent}%` }}
                            />
                          </div>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-semibold">&infin; Terbuka</span>
                        )}
                      </td>

                      {/* 5. Customer Restrictions */}
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded-lg bg-neutral-100 text-[10.5px] font-semibold text-charcoal block w-fit">
                          {c.customerRestriction === 'first_time'
                            ? 'Pelanggan Baharu'
                            : c.customerRestriction === 'existing_only'
                            ? 'Pelanggan VIP'
                            : 'Semua Pembeli'}
                        </span>
                        <span className="text-[10px] text-secondary block mt-0.5">
                          Had: {c.perCustomerLimit ? `${c.perCustomerLimit}x per akaun` : '1x per akaun'}
                        </span>
                      </td>

                      {/* 6. Validity & Expiry */}
                      <td className="py-4 px-4 text-[11px]">
                        <div className="flex items-center gap-1 text-charcoal font-medium">
                          <Calendar className="w-3 h-3 text-secondary" />
                          <span>{formatDateMY(c.endsAt)}</span>
                        </div>
                        {isExpired ? (
                          <span className="text-[10px] text-rose-600 font-bold block mt-0.5">Tamat Tempoh</span>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">Sah Digunakan</span>
                        )}
                      </td>

                      {/* 7. Direct 1-Click Active / Disabled Toggle */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(c)}
                          className={`inline-block px-3 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            c.isActive
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                          title="Klik untuk ubah status Aktif / Nyahaktif"
                        >
                          {c.isActive ? 'Aktif' : 'Nyahaktif'}
                        </button>
                      </td>

                      {/* 8. Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            type="button"
                            onClick={() => handleDuplicate(c)}
                            className="p-2 text-secondary hover:text-forest rounded-xl hover:bg-forest/10 transition-colors cursor-pointer"
                            title="Klon / Salin kupon ini"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingCoupon({ ...c })
                              setActiveModalTab('discount')
                            }}
                            className="p-2 text-secondary hover:text-forest rounded-xl hover:bg-forest/10 transition-colors cursor-pointer"
                            title="Konfigurasi penuh kupon"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(c.id, c.code)}
                            className="p-2 text-secondary hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Padam kupon"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COMPREHENSIVE CONFIGURE COUPON VOUCHER MODAL (IMAGE 2 ENHANCED)           */}
      {/* ========================================================================= */}
      {editingCoupon && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] bg-[#13325B]/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-warmwhite w-full max-w-2xl rounded-2xl sm:rounded-3xl border border-borderLight shadow-2xl overflow-hidden my-auto max-h-[94dvh] flex flex-col animate-scale-in">
            {/* Modal Header */}
            <div className="p-6 bg-[#13325B] text-white flex items-center justify-between border-b border-[#B49A58]/20 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E4E8C] to-[#2A6DB5] border border-[#B49A58]/40 flex items-center justify-center shadow-md">
                  <Tag className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    Konfigurasi Penuh Kod Baucar & Promosi
                  </h3>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    Kawal nilai diskaun, paparan di halaman utama (*Sleep Privileges*), dan kelayakan pelanggan.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingCoupon(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="px-6 pt-4 border-b border-borderLight bg-neutral-50/70 flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setActiveModalTab('discount')}
                className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  activeModalTab === 'discount'
                    ? 'border-[#1E4E8C] text-[#1E4E8C]'
                    : 'border-transparent text-secondary hover:text-charcoal'
                }`}
              >
                <Percent className="w-3.5 h-3.5" />
                <span>1. Nilai & Diskaun</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModalTab('homepage')}
                className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  activeModalTab === 'homepage'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-secondary hover:text-charcoal'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                <span>2. Paparan Halaman Utama (Image 1)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModalTab('rules')}
                className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  activeModalTab === 'rules'
                    ? 'border-[#1E4E8C] text-[#1E4E8C]'
                    : 'border-transparent text-secondary hover:text-charcoal'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>3. Had & Kelayakan Pelanggan</span>
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveCoupon} className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <div className="p-4 sm:p-6 space-y-5 text-xs overflow-y-auto overscroll-contain flex-1 min-h-0">
                {/* TAB 1: DISCOUNT & BASIC INFO */}
                {activeModalTab === 'discount' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-charcoal mb-1">
                        Kod Kupon / Voucher Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingCoupon.code}
                        onChange={(e) =>
                          setEditingCoupon({
                            ...editingCoupon,
                            code: e.target.value.toUpperCase().replace(/\s+/g, ''),
                          })
                        }
                        placeholder="cth: KAMAAR100"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-borderLight focus:border-[#1E4E8C] font-mono font-bold uppercase text-charcoal bg-white"
                      />
                      <span className="text-[10px] text-secondary mt-1 block">
                        Pelanggan masukkan kod ini di bakul / checkout.
                      </span>
                    </div>

                    <div>
                      <label className="block font-bold text-charcoal mb-1">
                        Jenis Diskaun / Discount Type *
                      </label>
                      <select
                        value={editingCoupon.discountType}
                        onChange={(e) =>
                          setEditingCoupon({
                            ...editingCoupon,
                            discountType: e.target.value as any,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-borderLight focus:border-[#1E4E8C] font-semibold text-charcoal bg-white"
                      >
                        <option value="percentage">Peratusan / Percentage (%)</option>
                        <option value="fixed_amount">Potongan Tetap / Fixed Cash (RM)</option>
                        <option value="free_shipping">Penghantaran Percuma / Free Shipping</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-charcoal mb-1">
                        Nilai Diskaun {editingCoupon.discountType === 'percentage' ? '(%)' : '(RM)'} *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={
                          editingCoupon.discountType === 'percentage'
                            ? editingCoupon.discountValue
                            : (editingCoupon.discountValue / 100).toFixed(2)
                        }
                        onChange={(e) => {
                          const v = parseFloat(e.target.value) || 0
                          setEditingCoupon({
                            ...editingCoupon,
                            discountValue:
                              editingCoupon.discountType === 'percentage' ? v : Math.round(v * 100),
                          })
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-borderLight focus:border-[#1E4E8C] font-bold text-charcoal bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-charcoal mb-1">
                        Syarat Belanja Minimum (RM)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={((editingCoupon.minSpendSen || 0) / 100).toFixed(2)}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value) || 0
                          setEditingCoupon({
                            ...editingCoupon,
                            minSpendSen: Math.round(v * 100),
                          })
                        }}
                        placeholder="0.00 (Tiada had belanja)"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-borderLight focus:border-[#1E4E8C] text-charcoal bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-charcoal mb-1">
                        Had Maksimum Diskaun (RM)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={
                          editingCoupon.maxDiscountSen !== undefined
                            ? ((editingCoupon.maxDiscountSen || 0) / 100).toFixed(2)
                            : ''
                        }
                        onChange={(e) => {
                          const val = e.target.value
                          setEditingCoupon({
                            ...editingCoupon,
                            maxDiscountSen: val ? Math.round(parseFloat(val) * 100) : undefined,
                          })
                        }}
                        placeholder="Biarkan kosong jika tiada had siling"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-borderLight focus:border-[#1E4E8C] text-charcoal bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-charcoal mb-1">
                        Kategori Produk Layak
                      </label>
                      <select
                        value={editingCoupon.applicableCategory || 'all'}
                        onChange={(e) =>
                          setEditingCoupon({
                            ...editingCoupon,
                            applicableCategory: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-borderLight focus:border-[#1E4E8C] text-charcoal bg-white font-medium"
                      >
                        <option value="all">Semua Koleksi Produk</option>
                        <option value="mattress">Tilam Sahaja (Mattresses)</option>
                        <option value="pillows">Bantal Sahaja (Pillows)</option>
                        <option value="toppers-protectors">Topper & Pelindung Sahaja</option>
                        <option value="bedframes">Rangka Katil Sahaja (Bedframes)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-charcoal mb-1">
                      Penerangan Kupon (Penerangan untuk pelanggan)
                    </label>
                    <input
                      type="text"
                      value={editingCoupon.description}
                      onChange={(e) =>
                        setEditingCoupon({ ...editingCoupon, description: e.target.value })
                      }
                      placeholder="cth: 10% Welcome Discount for new customers on orders over RM1,000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-borderLight focus:border-[#1E4E8C] text-charcoal bg-white"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: HOMEPAGE SHOWCASE CONTROLS (IMAGE 1 CONNECTION!) */}
              {activeModalTab === 'homepage' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="showOnHomepageModal"
                        checked={editingCoupon.showOnHomepage || false}
                        onChange={(e) =>
                          setEditingCoupon({ ...editingCoupon, showOnHomepage: e.target.checked })
                        }
                        className="w-5 h-5 rounded-md accent-amber-500 mt-0.5 cursor-pointer"
                      />
                      <div>
                        <label
                          htmlFor="showOnHomepageModal"
                          className="font-bold text-sm text-charcoal block cursor-pointer"
                        >
                          ⭐ Tayangkan Kupon Ini Pada Seksyen &apos;Sleep Privileges&apos; di Halaman Utama
                        </label>
                        <p className="text-secondary text-xs mt-0.5 leading-relaxed">
                          Apabila diaktifkan, kad baucar ini akan muncul secara langsung di barisan 4 kad promosi
                          pada Halaman Utama (seperti dalam Gambar 1). Pelanggan boleh terus klik &apos;Salin Kod&apos;.
                        </p>
                      </div>
                    </div>
                  </div>

                  {editingCoupon.showOnHomepage && (
                    <div className="p-4 bg-cream/40 rounded-2xl border border-borderLight space-y-4 animate-in fade-in">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-forest block">
                        Kustomisasi Paparan Kad Halaman Utama
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-charcoal mb-1">
                            Tajuk Khas Kad Halaman Utama
                          </label>
                          <input
                            type="text"
                            value={editingCoupon.customTitle || ''}
                            onChange={(e) =>
                              setEditingCoupon({ ...editingCoupon, customTitle: e.target.value })
                            }
                            placeholder="cth: 10% Mattress Privilege / Instant RM100 Voucher"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-borderLight focus:border-[#1E4E8C] text-charcoal bg-white font-medium"
                          />
                          <span className="text-[10px] text-secondary mt-1 block">
                            Jika kosong, tajuk akan dijana secara automatik mengikut diskaun.
                          </span>
                        </div>

                        <div>
                          <label className="block font-bold text-charcoal mb-1">
                            Lencana Promosi Kad (Badge Text)
                          </label>
                          <input
                            type="text"
                            value={editingCoupon.customBadge || ''}
                            onChange={(e) =>
                              setEditingCoupon({ ...editingCoupon, customBadge: e.target.value })
                            }
                            placeholder="cth: 10% OFF / RM100.00 OFF / VIP EXCLUSIVE"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-borderLight focus:border-[#1E4E8C] text-charcoal bg-white uppercase font-bold"
                          />
                          <span className="text-[10px] text-secondary mt-1 block">
                            Pill emas kecil di penjuru atas kad kupon.
                          </span>
                        </div>

                        <div>
                          <label className="block font-bold text-charcoal mb-1">
                            Susunan Keutamaan Paparan (Display Order)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={editingCoupon.featuredOrder || 1}
                            onChange={(e) =>
                              setEditingCoupon({
                                ...editingCoupon,
                                featuredOrder: parseInt(e.target.value) || 1,
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-borderLight focus:border-[#1E4E8C] text-charcoal bg-white font-bold"
                          />
                          <span className="text-[10px] text-secondary mt-1 block">
                            Nilai kecil (cth: 1) akan muncul paling kiri dahulu.
                          </span>
                        </div>
                      </div>

                      {/* Live Preview Box */}
                      <div className="pt-2">
                        <span className="text-[11px] font-bold text-charcoal block mb-2">
                          Pratonton Kad Halaman Utama:
                        </span>
                        <div className="max-w-xs bg-[#13325B] text-white p-4 rounded-2xl border border-[#B49A58]/40 shadow-sm space-y-2">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="px-2 py-0.5 rounded bg-[#B49A58]/20 text-[#D4AF37] font-bold uppercase">
                              {editingCoupon.customBadge ||
                                (editingCoupon.discountType === 'percentage'
                                  ? `${editingCoupon.discountValue}% OFF`
                                  : `${formatMYR(editingCoupon.discountValue)} OFF`)}
                            </span>
                            <span className="text-white/60">
                              Ends {formatDateMY(editingCoupon.endsAt)}
                            </span>
                          </div>
                          <h4 className="font-serif font-bold text-sm text-white">
                            {editingCoupon.customTitle ||
                              (editingCoupon.discountType === 'percentage'
                                ? `${editingCoupon.discountValue}% Mattress Privilege`
                                : `Instant ${formatMYR(editingCoupon.discountValue)} Voucher`)}
                          </h4>
                          <p className="text-[10px] text-white/70 line-clamp-2">
                            {editingCoupon.description || 'Penerangan ringkas diskaun tilam'}
                          </p>
                          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                            <span className="font-mono text-xs text-[#D4AF37] font-bold">
                              {editingCoupon.code}
                            </span>
                            <span className="px-2 py-1 bg-white/10 rounded text-[9.5px] font-semibold text-white">
                              Copy Code
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: RULES, LIMITS & VALIDITY */}
              {activeModalTab === 'rules' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-charcoal mb-1">
                        Tarikh Mula Sah (Starts At)
                      </label>
                      <input
                        type="date"
                        value={toDateInputValue(editingCoupon.startsAt)}
                        onChange={(e) =>
                          setEditingCoupon({
                            ...editingCoupon,
                            startsAt: fromDateInputValue(e.target.value, false),
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-borderLight focus:border-[#1E4E8C] text-charcoal bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-charcoal mb-1">
                        Tarikh Luput / Tamat (Ends At) *
                      </label>
                      <input
                        type="date"
                        required
                        value={toDateInputValue(editingCoupon.endsAt)}
                        onChange={(e) =>
                          setEditingCoupon({
                            ...editingCoupon,
                            endsAt: fromDateInputValue(e.target.value, true),
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-borderLight focus:border-[#1E4E8C] text-charcoal bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-charcoal mb-1">
                        Jumlah Had Penebusan Keseluruhan
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={editingCoupon.usageLimit || ''}
                        onChange={(e) =>
                          setEditingCoupon({
                            ...editingCoupon,
                            usageLimit: parseInt(e.target.value) || undefined,
                          })
                        }
                        placeholder="Biarkan kosong untuk tanpa had"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-borderLight focus:border-[#1E4E8C] text-charcoal bg-white"
                      />
                      <span className="text-[10px] text-secondary mt-1 block">
                        Kupon akan dinyahaktifkan secara automatik apabila kuota habis.
                      </span>
                    </div>

                    <div>
                      <label className="block font-bold text-charcoal mb-1">
                        Had Guna Setiap Pelanggan (Per Customer Limit)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={editingCoupon.perCustomerLimit || 1}
                        onChange={(e) =>
                          setEditingCoupon({
                            ...editingCoupon,
                            perCustomerLimit: parseInt(e.target.value) || 1,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-borderLight focus:border-[#1E4E8C] text-charcoal bg-white font-bold"
                      />
                      <span className="text-[10px] text-secondary mt-1 block">
                        Cth: 1 = Hanya satu kali penebusan per alamat emel/telefon pembeli.
                      </span>
                    </div>

                    <div>
                      <label className="block font-bold text-charcoal mb-1">
                        Kelayakan Pelanggan (Audience)
                      </label>
                      <select
                        value={editingCoupon.customerRestriction || 'all'}
                        onChange={(e) =>
                          setEditingCoupon({
                            ...editingCoupon,
                            customerRestriction: e.target.value as any,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-borderLight focus:border-[#1E4E8C] text-charcoal bg-white font-medium"
                      >
                        <option value="all">Semua Pelanggan (Terbuka)</option>
                        <option value="first_time">Pelanggan Baharu Sahaja (First Order)</option>
                        <option value="existing_only">Pelanggan Setia / VIP Sahaja</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Checkbox at bottom of all tabs */}
              <div className="pt-3 border-t border-borderLight flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <input
                    type="checkbox"
                    id="isActiveCoupon"
                    checked={editingCoupon.isActive}
                    onChange={(e) =>
                      setEditingCoupon({ ...editingCoupon, isActive: e.target.checked })
                    }
                    className="w-4 h-4 rounded accent-[#1E4E8C] cursor-pointer"
                  />
                  <label htmlFor="isActiveCoupon" className="font-bold text-charcoal cursor-pointer">
                    Aktifkan kod baucar promosi ini serta-merta
                  </label>
                </div>
              </div>
            </div>

            {/* Fixed Sticky Modal Buttons Footer */}
            <div className="flex items-center justify-between p-3.5 sm:px-6 sm:py-4 pb-[max(0.875rem,env(safe-area-inset-bottom))] border-t border-borderLight bg-neutral-50/95 backdrop-blur-sm flex-shrink-0 z-20">
              <div className="text-[11px] text-secondary">
                Status: <strong>{editingCoupon.isActive ? 'Aktif' : 'Nyahaktif'}</strong> •{' '}
                Homepage:{' '}
                <strong>{editingCoupon.showOnHomepage ? 'Ditayang (Ya)' : 'Tidak'}</strong>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingCoupon(null)}
                  className="px-4 py-2 font-bold text-secondary hover:text-charcoal rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#1E4E8C] text-white font-bold rounded-xl hover:bg-[#2A6DB5] transition-colors shadow-sm disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Konfigurasi Promosi'}
                </button>
              </div>
            </div>
          </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
