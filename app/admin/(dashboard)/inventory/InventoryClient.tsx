'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { formatMYR } from '@/lib/utils/format'
import {
  Search,
  AlertTriangle,
  CheckCircle,
  Package,
  ArrowUpDown,
  Check,
  AlertCircle,
  X,
  Plus,
  Minus,
} from 'lucide-react'

interface InventoryItem {
  productId: string
  productName: string
  productSlug: string
  productImage: string
  variantId: string
  sku: string
  sizeName: string
  dimensions: string
  priceSen: number
  stockQuantity: number
  isAvailable: boolean
}

interface InventoryClientProps {
  initialItems: InventoryItem[]
}

export function InventoryClient({ initialItems }: InventoryClientProps) {
  const [items, setItems] = useState<InventoryItem[]>(initialItems)
  const [search, setSearch] = useState('')
  const [filterStock, setFilterStock] = useState<'all' | 'low' | 'out'>('all')
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null)
  const [newQty, setNewQty] = useState<number>(0)
  const [reason, setReason] = useState<string>('Cycle count replenishment')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll when modal is active
  useEffect(() => {
    if (adjustingItem) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [adjustingItem])

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.sizeName.toLowerCase().includes(search.toLowerCase())

    if (filterStock === 'low') {
      return matchesSearch && item.stockQuantity > 0 && item.stockQuantity < 5
    }
    if (filterStock === 'out') {
      return matchesSearch && item.stockQuantity === 0
    }
    return matchesSearch
  })

  const openAdjustModal = (item: InventoryItem) => {
    setAdjustingItem(item)
    setNewQty(item.stockQuantity)
    setReason('Cycle count replenishment')
    setFeedback(null)
  }

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adjustingItem) return

    setIsSubmitting(true)
    setFeedback(null)

    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId: adjustingItem.variantId,
          newQuantity: newQty,
          reason,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setItems((prev) =>
          prev.map((i) =>
            i.variantId === adjustingItem.variantId ? { ...i, stockQuantity: newQty } : i
          )
        )
        setFeedback({
          text: `Berjaya mengemaskini ${adjustingItem.sku} kepada ${newQty} unit. Log audit telah direkodkan.`,
          type: 'success',
        })
        setAdjustingItem(null)
      } else {
        setFeedback({ text: data.error || 'Gagal mengemaskini stok.', type: 'error' })
      }
    } catch {
      setFeedback({ text: 'Ralat rangkaian semasa mengemaskini inventori.', type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalUnits = items.reduce((acc, i) => acc + i.stockQuantity, 0)
  const lowStockCount = items.filter((i) => i.stockQuantity > 0 && i.stockQuantity < 5).length
  const outOfStockCount = items.filter((i) => i.stockQuantity === 0).length

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-3.5 sm:p-4 rounded-xl flex items-center justify-between text-xs sm:text-sm animate-fade-in ${
            feedback.type === 'success'
              ? 'bg-forest/10 border border-forest/20 text-forest-dark'
              : 'bg-rose-50 border border-rose-200 text-rose-700'
          }`}
        >
          <div className="flex items-center space-x-2">
            {feedback.type === 'success' ? (
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-forest flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 flex-shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs font-bold underline ml-2 flex-shrink-0"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Summary KPI Badges: 3-column responsive grid on all devices */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 animate-fade-in-up">
        {/* Card 1: Total Units */}
        <button
          type="button"
          onClick={() => setFilterStock('all')}
          className={`text-left p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all cursor-pointer ${
            filterStock === 'all'
              ? 'bg-warmwhite border-forest/60 ring-2 ring-forest/20 shadow-sm'
              : 'bg-warmwhite/80 border-borderLight hover:bg-warmwhite shadow-xs'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 gap-1 sm:gap-0">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-forest/10 text-forest flex items-center justify-center flex-shrink-0">
              <Package className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs text-secondary font-medium block truncate">
                Total On-Hand
              </span>
              <h4 className="text-sm sm:text-xl font-bold text-forest-dark truncate">
                {totalUnits.toLocaleString()}{' '}
                <span className="text-[9px] sm:text-xs font-normal text-secondary">unit</span>
              </h4>
            </div>
          </div>
        </button>

        {/* Card 2: Low Stock */}
        <button
          type="button"
          onClick={() => setFilterStock('low')}
          className={`text-left p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all cursor-pointer ${
            filterStock === 'low'
              ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-400/25 shadow-sm'
              : 'bg-warmwhite/80 border-borderLight hover:bg-warmwhite shadow-xs'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 gap-1 sm:gap-0">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-600" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs text-amber-800 font-medium block truncate">
                Low Stock (&lt;5)
              </span>
              <h4 className="text-sm sm:text-xl font-bold text-amber-900 truncate">
                {lowStockCount}{' '}
                <span className="text-[9px] sm:text-xs font-normal text-amber-700">item</span>
              </h4>
            </div>
          </div>
        </button>

        {/* Card 3: Out of Stock */}
        <button
          type="button"
          onClick={() => setFilterStock('out')}
          className={`text-left p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all cursor-pointer ${
            filterStock === 'out'
              ? 'bg-rose-50/80 border-rose-500 ring-2 ring-rose-400/25 shadow-sm'
              : 'bg-warmwhite/80 border-borderLight hover:bg-warmwhite shadow-xs'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 gap-1 sm:gap-0">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-rose-600" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs text-rose-800 font-medium block truncate">
                Out of Stock
              </span>
              <h4 className="text-sm sm:text-xl font-bold text-rose-900 truncate">
                {outOfStockCount}{' '}
                <span className="text-[9px] sm:text-xs font-normal text-rose-700">item</span>
              </h4>
            </div>
          </div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-warmwhite p-3 sm:p-4 rounded-2xl border border-borderLight shadow-xs flex flex-col md:flex-row gap-2.5 sm:gap-3 items-stretch md:items-center justify-between animate-fade-in-up delay-100">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari SKU, nama produk, saiz..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2 text-xs rounded-xl bg-cream/50 border border-borderLight focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal p-0.5 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto pb-0.5 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilterStock('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterStock === 'all'
                ? 'bg-forest text-warmwhite shadow-xs'
                : 'bg-cream/60 text-secondary hover:text-charcoal hover:bg-cream'
            }`}
          >
            Semua ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStock('low')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
              filterStock === 'low'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-cream/60 text-secondary hover:text-charcoal hover:bg-cream'
            }`}
          >
            <span>Stok Rendah</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                filterStock === 'low' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {lowStockCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setFilterStock('out')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
              filterStock === 'out'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-cream/60 text-secondary hover:text-charcoal hover:bg-cream'
            }`}
          >
            <span>Habis Stok</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                filterStock === 'out' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {outOfStockCount}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE INVENTORY FEED (md:hidden)                                        */}
      {/* ========================================================================= */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-warmwhite rounded-2xl border border-borderLight p-8 text-center text-charcoal-muted">
            <Package className="w-10 h-10 text-charcoal-muted/40 mx-auto mb-2" />
            <p className="text-xs font-bold">Tiada varian inventori dijumpai</p>
            <p className="text-[11px] mt-1 text-secondary">Cuba carian atau penapis status yang berbeza.</p>
          </div>
        ) : (
          filtered.map((item, idx) => {
            const isOut = item.stockQuantity === 0
            const isLow = item.stockQuantity > 0 && item.stockQuantity < 5
            const staggerClass = `stagger-${(idx % 10) + 1}`

            return (
              <div
                key={item.variantId}
                className={`bg-warmwhite rounded-2xl border p-3.5 shadow-xs transition-all animate-fade-in-up ${staggerClass} ${
                  isOut
                    ? 'border-rose-300/80 bg-rose-50/20'
                    : isLow
                    ? 'border-amber-300/80 bg-amber-50/15'
                    : 'border-borderLight'
                }`}
              >
                {/* Header: Thumbnail + Product Title + Size + Status Pill */}
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-borderLight flex-shrink-0 bg-cream/30">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none'
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-forest bg-forest/10 px-2 py-0.5 rounded">
                        {item.sizeName}
                      </span>

                      {/* Stock Badge */}
                      {isOut ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                          <span>Habis Stok</span>
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>Stok Rendah (&lt;5)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Cukup ({item.stockQuantity})</span>
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-xs text-forest-dark truncate">
                      {item.productName}
                    </h4>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-borderLight/60 text-[11px]">
                  <div>
                    <span className="text-secondary block text-[10px]">SKU:</span>
                    <span className="font-mono font-bold text-charcoal truncate block text-[11px]">
                      {item.sku}
                    </span>
                  </div>
                  <div>
                    <span className="text-secondary block text-[10px]">Dimensi:</span>
                    <span className="text-charcoal-muted truncate block text-[11px]">
                      {item.dimensions || '-'}
                    </span>
                  </div>
                </div>

                {/* Stock Gauge & Quick Adjust Button */}
                <div className="mt-3 pt-2.5 border-t border-borderLight/60 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-secondary block">Baki Stok:</span>
                    <div className="flex items-baseline space-x-1">
                      <span
                        className={`text-base font-black ${
                          isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-forest-dark'
                        }`}
                      >
                        {item.stockQuantity}
                      </span>
                      <span className="text-[10px] text-secondary">unit</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="text-[10px] text-secondary block">Harga Seunit:</span>
                    <span className="text-xs font-bold text-forest block">
                      {formatMYR(item.priceSen)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => openAdjustModal(item)}
                    className="inline-flex items-center space-x-1 px-3 py-2 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 text-gold" />
                    <span>Laras</span>
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP INVENTORY TABLE (hidden md:block)                                 */}
      {/* ========================================================================= */}
      <div className="hidden md:block bg-warmwhite rounded-2xl border border-borderLight shadow-sm overflow-hidden animate-fade-in-up delay-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream/60 border-b border-borderLight text-secondary uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Product Variant</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Dimensions</th>
                <th className="py-3.5 px-4">Unit Price</th>
                <th className="py-3.5 px-4">Available Stock</th>
                <th className="py-3.5 px-4">Status Indicator</th>
                <th className="py-3.5 px-4 text-right">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLight/60">
              {filtered.map((item) => (
                <tr key={item.variantId} className="hover:bg-cream/20 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-10 h-10 rounded-lg object-cover border border-borderLight flex-shrink-0"
                      />
                      <div>
                        <span className="font-bold text-forest-dark block line-clamp-1">
                          {item.productName}
                        </span>
                        <span className="text-[11px] text-forest font-semibold">
                          {item.sizeName}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono font-medium text-secondary">
                    {item.sku}
                  </td>
                  <td className="py-4 px-4 text-secondary">
                    {item.dimensions}
                  </td>
                  <td className="py-4 px-4 font-bold text-forest">
                    {formatMYR(item.priceSen)}
                  </td>
                  <td className="py-4 px-4 font-bold text-charcoal">
                    {item.stockQuantity} units
                  </td>
                  <td className="py-4 px-4">
                    {item.stockQuantity === 0 ? (
                      <span className="inline-block px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                        Out of Stock
                      </span>
                    ) : item.stockQuantity < 5 ? (
                      <span className="inline-block px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        Low Stock Alert
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Healthy Buffer
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => openAdjustModal(item)}
                      className="px-3 py-1.5 bg-forest/10 hover:bg-forest hover:text-warmwhite text-forest text-xs font-bold rounded-lg transition-colors cursor-pointer inline-flex items-center space-x-1"
                    >
                      <ArrowUpDown className="w-3 h-3 text-gold" />
                      <span>Adjust Stock</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADJUST STOCK MODAL (PORTALED & MOBILE-OPTIMIZED)                          */}
      {/* ========================================================================= */}
      {adjustingItem && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] bg-forest-dark/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="bg-warmwhite w-full max-w-md rounded-2xl sm:rounded-3xl border border-borderLight shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] my-auto animate-scale-in">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-forest-dark text-warmwhite flex items-center justify-between border-b border-warmwhite/10 flex-shrink-0">
              <div className="min-w-0 pr-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold bg-gold/20 px-2 py-0.5 rounded">
                    Audit Stok
                  </span>
                  <span className="font-mono text-[11px] text-warmwhite/60 truncate">
                    SKU: {adjustingItem.sku}
                  </span>
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-warmwhite mt-0.5 truncate">
                  Pelarasan Inventori
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setAdjustingItem(null)}
                className="w-8 h-8 rounded-full bg-warmwhite/10 hover:bg-warmwhite/20 flex items-center justify-center text-warmwhite/80 hover:text-warmwhite transition-colors flex-shrink-0 cursor-pointer"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            {/* Form with scrollable body & sticky footer */}
            <form onSubmit={handleAdjustStock} className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4">
                {/* Product Summary Card */}
                <div className="p-3 bg-cream/40 rounded-xl border border-borderLight flex items-center space-x-3">
                  <img
                    src={adjustingItem.productImage}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover border border-borderLight flex-shrink-0 bg-white"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs text-forest-dark truncate">
                      {adjustingItem.productName}
                    </h4>
                    <span className="text-[11px] text-forest font-semibold block">
                      Saiz: {adjustingItem.sizeName} {adjustingItem.dimensions ? `(${adjustingItem.dimensions})` : ''}
                    </span>
                    <span className="text-[11px] text-secondary mt-0.5 block">
                      Stok Semasa:{' '}
                      <strong className="text-forest-dark font-mono">
                        {adjustingItem.stockQuantity} unit
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Stepper + Quantity Input */}
                <div>
                  <label className="block text-xs font-bold text-forest-dark uppercase tracking-wider mb-1.5">
                    Kuantiti Baharu (Unit) *
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setNewQty((prev) => Math.max(0, prev - 1))}
                      className="w-11 h-11 rounded-xl border border-borderLight bg-cream/50 hover:bg-cream flex items-center justify-center font-bold text-charcoal transition-colors flex-shrink-0 cursor-pointer text-lg"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="0"
                      required
                      value={newQty}
                      onChange={(e) => setNewQty(Math.max(0, parseInt(e.target.value) || 0))}
                      className="flex-1 px-3 py-2 text-center text-lg font-bold font-mono rounded-xl border border-borderLight bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold h-11"
                    />
                    <button
                      type="button"
                      onClick={() => setNewQty((prev) => prev + 1)}
                      className="w-11 h-11 rounded-xl border border-borderLight bg-cream/50 hover:bg-cream flex items-center justify-center font-bold text-charcoal transition-colors flex-shrink-0 cursor-pointer text-lg"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quick Preset Buttons: -5, +5, +10 */}
                  <div className="flex items-center justify-center space-x-1.5 sm:space-x-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setNewQty((prev) => Math.max(0, prev - 5))}
                      className="px-2.5 py-1 rounded-lg bg-cream/70 hover:bg-cream text-[11px] font-bold text-charcoal-muted cursor-pointer"
                    >
                      -5
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewQty((prev) => prev + 5)}
                      className="px-2.5 py-1 rounded-lg bg-cream/70 hover:bg-cream text-[11px] font-bold text-charcoal-muted cursor-pointer"
                    >
                      +5
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewQty((prev) => prev + 10)}
                      className="px-2.5 py-1 rounded-lg bg-cream/70 hover:bg-cream text-[11px] font-bold text-charcoal-muted cursor-pointer"
                    >
                      +10
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewQty(0)}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-[11px] font-bold text-rose-700 cursor-pointer"
                    >
                      Set 0 (Habis)
                    </button>
                  </div>
                </div>

                {/* Reason Selection */}
                <div>
                  <label className="block text-xs font-bold text-forest-dark uppercase tracking-wider mb-1.5">
                    Sebab Pelarasan (Keperluan Jejak Audit) *
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-borderLight bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold mb-2 font-medium"
                  >
                    <option value="Cycle count replenishment">Pengiraan kitaran stok (Cycle count replenishment)</option>
                    <option value="Supplier shipment received">Penerimaan bekalan baharu (Supplier shipment received)</option>
                    <option value="Damaged unit decommissioning">Unit rosak dilupuskan (Damaged unit decommissioning)</option>
                    <option value="Showroom sample relocation">Sampel bilik pameran (Showroom sample relocation)</option>
                    <option value="Return to warehouse inspection">Pemeriksaan pulangan pelanggan (Return to warehouse inspection)</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Atau masukkan nota penerangan audit khusus..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-borderLight bg-cream/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                  />
                </div>
              </div>

              {/* Fixed Sticky Footer */}
              <div className="flex items-center justify-end space-x-3 p-3.5 sm:px-6 sm:py-4 border-t border-borderLight bg-warmwhite flex-shrink-0 shadow-xs">
                <button
                  type="button"
                  onClick={() => setAdjustingItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal-muted hover:bg-cream transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-forest hover:bg-forest-dark text-warmwhite transition-colors shadow-sm disabled:opacity-50 inline-flex items-center space-x-1.5 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Menyimpan...</span>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 text-gold" />
                      <span>Simpan & Rekod Audit</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
