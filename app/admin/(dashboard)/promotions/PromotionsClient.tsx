'use client'

import React, { useState } from 'react'
import { Coupon } from '@/types'
import { formatMYR, formatKLDate } from '@/lib/utils/format'
import { Plus, Tag, Trash2, Edit2, CheckCircle, AlertCircle } from 'lucide-react'

interface PromotionsClientProps {
  initialCoupons: Coupon[]
}

export function PromotionsClient({ initialCoupons }: PromotionsClientProps) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const handleOpenNew = () => {
    const newC: Coupon = {
      id: `cpn-${Date.now()}`,
      code: 'PROMO10',
      description: '10% discount on luxury mattresses',
      discountType: 'percentage',
      discountValue: 10,
      minSpendSen: 100000,
      maxDiscountSen: 20000,
      startsAt: new Date().toISOString(),
      endsAt: new Date(Date.now() + 30 * 86400000).toISOString(),
      usageLimit: 100,
      usageCount: 0,
      perCustomerLimit: 1,
      isActive: true,
    }
    setEditingCoupon(newC)
  }

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
        setFeedback({ text: `Coupon ${data.coupon.code} saved successfully.`, type: 'success' })
        setEditingCoupon(null)
      } else {
        setFeedback({ text: data.error || 'Failed to save coupon.', type: 'error' })
      }
    } catch {
      setFeedback({ text: 'Network failure while saving coupon.', type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promotional coupon?')) return

    try {
      const res = await fetch(`/api/admin/promotions?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok && data.success) {
        setCoupons((prev) => prev.filter((c) => c.id !== id))
        setFeedback({ text: 'Coupon deleted.', type: 'success' })
      } else {
        setFeedback({ text: 'Failed to delete coupon.', type: 'error' })
      }
    } catch {
      setFeedback({ text: 'Network failure while deleting.', type: 'error' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
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

      {/* Action Header */}
      <div className="flex justify-between items-center bg-warmwhite p-4 rounded-2xl border border-borderLight shadow-sm animate-fade-in">
        <div className="flex items-center space-x-2 text-xs text-secondary">
          <Tag className="w-4 h-4 text-gold" />
          <span>{coupons.length} Active & Scheduled Campaigns</span>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center space-x-2 px-4 py-2 bg-forest text-warmwhite text-xs font-bold rounded-xl hover:bg-forest-dark transition-colors shadow-sm luxury-btn"
        >
          <Plus className="w-3.5 h-3.5 text-gold" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-warmwhite rounded-2xl border border-borderLight shadow-sm overflow-hidden animate-fade-in-up delay-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream/60 border-b border-borderLight text-secondary uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Coupon Code</th>
                <th className="py-3.5 px-4">Discount</th>
                <th className="py-3.5 px-4">Min. Spend</th>
                <th className="py-3.5 px-4">Max. Cap</th>
                <th className="py-3.5 px-4">Redemptions</th>
                <th className="py-3.5 px-4">Validity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLight/60">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-cream/20 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-forest text-sm">
                    {c.code}
                    <span className="text-[10px] font-sans text-secondary block font-normal">
                      {c.description}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-semibold text-charcoal">
                    {c.discountType === 'percentage'
                      ? `${c.discountValue}% OFF`
                      : c.discountType === 'fixed_amount'
                      ? `${formatMYR(c.discountValue)} OFF`
                      : 'Free Shipping'}
                  </td>
                  <td className="py-4 px-4 text-secondary">
                    {c.minSpendSen ? formatMYR(c.minSpendSen) : 'None'}
                  </td>
                  <td className="py-4 px-4 text-secondary">
                    {c.maxDiscountSen ? formatMYR(c.maxDiscountSen) : 'No Cap'}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-charcoal">
                      {c.usageCount}
                    </span>
                    <span className="text-secondary text-[10px]">
                      {c.usageLimit ? ` / ${c.usageLimit} max` : ' (Unlimited)'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[10px] text-secondary">
                    <div>Until: {formatKLDate(c.endsAt)}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        c.isActive ? 'bg-forest/10 text-forest' : 'bg-sale/10 text-sale'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setEditingCoupon({ ...c })}
                        className="p-1.5 text-secondary hover:text-forest transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-secondary hover:text-sale transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Coupon Modal */}
      {editingCoupon && (
        <div className="fixed inset-0 z-50 bg-forest-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-warmwhite w-full max-w-lg rounded-3xl border border-borderLight shadow-2xl overflow-hidden">
            <div className="p-6 bg-forest-dark text-warmwhite flex items-center justify-between border-b border-borderLight/20">
              <h3 className="font-serif text-lg font-bold text-warmwhite">
                Configure Coupon Voucher
              </h3>
              <button
                onClick={() => setEditingCoupon(null)}
                className="text-warmwhite/60 hover:text-warmwhite text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-forest-dark mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCoupon.code}
                    onChange={(e) =>
                      setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-borderLight focus:border-forest font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-dark mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={editingCoupon.discountType}
                    onChange={(e) =>
                      setEditingCoupon({
                        ...editingCoupon,
                        discountType: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-borderLight focus:border-forest"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed_amount">Fixed Amount (Sen)</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-forest-dark mb-1">
                    Discount Value {editingCoupon.discountType === 'percentage' ? '(%)' : '(RM)'} *
                  </label>
                  <input
                    type="number"
                    step="0.01"
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
                    className="w-full px-3 py-2 rounded-xl border border-borderLight focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-dark mb-1">
                    Min Spend (RM)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={((editingCoupon.minSpendSen || 0) / 100).toFixed(2)}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value) || 0
                      setEditingCoupon({
                        ...editingCoupon,
                        minSpendSen: Math.round(v * 100),
                      })
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-borderLight focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-dark mb-1">
                    Max Discount Cap (RM)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={((editingCoupon.maxDiscountSen || 0) / 100).toFixed(2)}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value) || 0
                      setEditingCoupon({
                        ...editingCoupon,
                        maxDiscountSen: Math.round(v * 100),
                      })
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-borderLight focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-dark mb-1">
                    Total Redemption Limit
                  </label>
                  <input
                    type="number"
                    value={editingCoupon.usageLimit || ''}
                    onChange={(e) =>
                      setEditingCoupon({
                        ...editingCoupon,
                        usageLimit: parseInt(e.target.value) || undefined,
                      })
                    }
                    placeholder="Leave blank for unlimited"
                    className="w-full px-3 py-2 rounded-xl border border-borderLight focus:border-forest"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-forest-dark mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={editingCoupon.description}
                  onChange={(e) =>
                    setEditingCoupon({ ...editingCoupon, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-borderLight focus:border-forest"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveCoupon"
                  checked={editingCoupon.isActive}
                  onChange={(e) =>
                    setEditingCoupon({ ...editingCoupon, isActive: e.target.checked })
                  }
                  className="w-4 h-4 accent-forest"
                />
                <label htmlFor="isActiveCoupon" className="font-bold text-forest-dark cursor-pointer">
                  Activate this voucher coupon immediately
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-borderLight">
                <button
                  type="button"
                  onClick={() => setEditingCoupon(null)}
                  className="px-4 py-2 font-bold text-secondary hover:text-charcoal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-forest text-warmwhite font-bold rounded-xl hover:bg-forest-dark transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Promotion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
