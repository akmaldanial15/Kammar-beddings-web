'use client'

import React, { useState } from 'react'
import { formatMYR } from '@/lib/utils/format'
import { Search, AlertTriangle, CheckCircle, Package, ArrowUpDown, Check, AlertCircle } from 'lucide-react'

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
          text: `Updated ${adjustingItem.sku} to ${newQty} units. Movement logged.`,
          type: 'success',
        })
        setAdjustingItem(null)
      } else {
        setFeedback({ text: data.error || 'Failed to update stock.', type: 'error' })
      }
    } catch {
      setFeedback({ text: 'Network failure while updating stock.', type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalUnits = items.reduce((acc, i) => acc + i.stockQuantity, 0)
  const lowStockCount = items.filter((i) => i.stockQuantity > 0 && i.stockQuantity < 5).length
  const outOfStockCount = items.filter((i) => i.stockQuantity === 0).length

  return (
    <div className="space-y-6">
      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-sm ${
            feedback.type === 'success'
              ? 'bg-forest/10 border border-forest/20 text-forest-dark'
              : 'bg-sale/10 border border-sale/20 text-sale'
          }`}
        >
          <div className="flex items-center space-x-2">
            {feedback.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-forest" />
            ) : (
              <AlertCircle className="w-5 h-5 text-sale" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-xs font-bold underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-warmwhite p-4 rounded-2xl border border-borderLight shadow-sm animate-fade-in-up delay-50 luxury-card-hover">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center transition-transform group-hover:scale-110">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-secondary font-medium">Total On-Hand Units</span>
              <h4 className="text-xl font-bold text-forest-dark">{totalUnits.toLocaleString()} units</h4>
            </div>
          </div>
        </div>

        <div className="bg-warmwhite p-4 rounded-2xl border border-borderLight shadow-sm animate-fade-in-up delay-100 luxury-card-hover">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gold/20 text-forest flex items-center justify-center transition-transform group-hover:scale-110">
              <AlertTriangle className="w-5 h-5 text-gold" />
            </div>
            <div>
              <span className="text-xs text-secondary font-medium">Low Stock Variants (&lt; 5)</span>
              <h4 className="text-xl font-bold text-forest-dark">{lowStockCount} items</h4>
            </div>
          </div>
        </div>

        <div className="bg-warmwhite p-4 rounded-2xl border border-borderLight shadow-sm animate-fade-in-up delay-150 luxury-card-hover">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sale/10 text-sale flex items-center justify-center transition-transform group-hover:scale-110">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-secondary font-medium">Out of Stock</span>
              <h4 className="text-xl font-bold text-sale">{outOfStockCount} items</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-warmwhite p-4 rounded-2xl border border-borderLight flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm animate-fade-in-up delay-200">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search SKU, product title, size..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-cream/50 border border-borderLight focus:outline-none focus:border-forest"
          />
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilterStock('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterStock === 'all'
                ? 'bg-forest text-warmwhite'
                : 'bg-cream/50 text-secondary hover:text-charcoal'
            }`}
          >
            All SKUs ({items.length})
          </button>
          <button
            onClick={() => setFilterStock('low')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterStock === 'low'
                ? 'bg-gold text-forest-dark'
                : 'bg-cream/50 text-secondary hover:text-charcoal'
            }`}
          >
            Low Stock ({lowStockCount})
          </button>
          <button
            onClick={() => setFilterStock('out')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterStock === 'out'
                ? 'bg-sale text-warmwhite'
                : 'bg-cream/50 text-secondary hover:text-charcoal'
            }`}
          >
            Out of Stock ({outOfStockCount})
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-warmwhite rounded-2xl border border-borderLight shadow-sm overflow-hidden animate-fade-in-up delay-250">
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
                      <span className="inline-block px-2.5 py-1 rounded-full bg-sale/10 text-sale text-[10px] font-bold">
                        Out of Stock
                      </span>
                    ) : item.stockQuantity < 5 ? (
                      <span className="inline-block px-2.5 py-1 rounded-full bg-gold/20 text-forest-dark text-[10px] font-bold">
                        Low Stock Alert
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-1 rounded-full bg-forest/10 text-forest text-[10px] font-bold">
                        Healthy Buffer
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => openAdjustModal(item)}
                      className="px-3 py-1.5 bg-forest/10 hover:bg-forest hover:text-warmwhite text-forest text-xs font-bold rounded-lg transition-colors"
                    >
                      Adjust Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {adjustingItem && (
        <div className="fixed inset-0 z-50 bg-forest-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-warmwhite w-full max-w-md rounded-3xl border border-borderLight shadow-2xl overflow-hidden">
            <div className="p-6 bg-forest-dark text-warmwhite flex items-center justify-between border-b border-borderLight/20">
              <div>
                <h3 className="font-serif text-lg font-bold text-warmwhite">
                  Audited Stock Adjustment
                </h3>
                <span className="text-xs text-gold">SKU: {adjustingItem.sku}</span>
              </div>
              <button
                onClick={() => setAdjustingItem(null)}
                className="text-warmwhite/60 hover:text-warmwhite text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdjustStock} className="p-6 space-y-4">
              <div>
                <span className="text-xs text-secondary block">Product Variant</span>
                <span className="font-bold text-forest-dark text-sm block">
                  {adjustingItem.productName} ({adjustingItem.sizeName})
                </span>
                <span className="text-xs text-secondary mt-1 block">
                  Current On-Hand: <strong>{adjustingItem.stockQuantity} units</strong>
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-dark mb-1">
                  New Quantity (Units) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newQty}
                  onChange={(e) => setNewQty(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-borderLight focus:border-forest"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-dark mb-1">
                  Reason for Adjustment (Mandatory Audit Requirement) *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-borderLight focus:border-forest mb-2"
                >
                  <option value="Cycle count replenishment">Cycle count replenishment</option>
                  <option value="Supplier shipment received">Supplier shipment received</option>
                  <option value="Damaged unit decommissioning">Damaged unit decommissioning</option>
                  <option value="Showroom sample relocation">Showroom sample relocation</option>
                  <option value="Return to warehouse inspection">Return to warehouse inspection</option>
                </select>
                <input
                  type="text"
                  placeholder="Or custom explanation..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-borderLight focus:border-forest"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-borderLight">
                <button
                  type="button"
                  onClick={() => setAdjustingItem(null)}
                  className="px-4 py-2 text-xs font-bold text-secondary hover:text-charcoal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-forest text-warmwhite text-xs font-bold rounded-xl hover:bg-forest-dark transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving Movement...' : 'Save & Record Audit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
