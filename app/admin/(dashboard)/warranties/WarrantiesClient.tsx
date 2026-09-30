'use client'

import React, { useState } from 'react'
import { WarrantyRegistration } from '@/types'
import { formatKLDate } from '@/lib/utils/format'
import { ShieldCheck, CheckCircle2, XCircle, Search, Filter } from 'lucide-react'

interface WarrantiesClientProps {
  initialWarranties: WarrantyRegistration[]
}

export function WarrantiesClient({ initialWarranties }: WarrantiesClientProps) {
  const [warranties, setWarranties] = useState<WarrantyRegistration[]>(initialWarranties)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all')
  const [selectedWarranty, setSelectedWarranty] = useState<WarrantyRegistration | null>(null)
  const [notes, setNotes] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const filtered = warranties.filter((w) => {
    const matchesSearch =
      w.customerName.toLowerCase().includes(search.toLowerCase()) ||
      w.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      w.productName.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || w.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleUpdateStatus = async (status: 'verified' | 'rejected') => {
    if (!selectedWarranty) return

    setIsUpdating(true)
    try {
      const res = await fetch('/api/admin/warranties', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedWarranty.id,
          status,
          notes,
        }),
      })

      if (res.ok) {
        setWarranties((prev) =>
          prev.map((item) =>
            item.id === selectedWarranty.id
              ? { ...item, status, internalNotes: notes }
              : item
          )
        )
        setFeedback(`Warranty registration ${selectedWarranty.invoiceNumber} marked as ${status}.`)
        setSelectedWarranty(null)
      }
    } catch {
      setFeedback('Failed to update warranty registration.')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      {feedback && (
        <div className="p-3 bg-forest/10 border border-forest/20 text-forest text-xs rounded-xl font-bold flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-warmwhite p-4 rounded-2xl border border-borderLight flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice #, customer name, mattress..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-cream/50 border border-borderLight focus:outline-none focus:border-forest"
          />
        </div>

        <div className="flex items-center space-x-2">
          {(['all', 'pending', 'verified', 'rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-forest text-warmwhite'
                  : 'bg-cream/50 text-secondary hover:text-charcoal'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Warranties Table */}
      <div className="bg-warmwhite rounded-2xl border border-borderLight shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-secondary">
            No warranty registrations found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream/60 border-b border-borderLight text-secondary uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Invoice / Reg Date</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Mattress Model</th>
                  <th className="py-3.5 px-4">Purchased From / Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderLight/60">
                {filtered.map((w) => (
                  <tr key={w.id} className="hover:bg-cream/20 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-forest">
                      {w.invoiceNumber}
                      <span className="text-[10px] text-secondary font-sans block font-normal">
                        {formatKLDate(w.createdAt)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-forest-dark block">{w.customerName}</span>
                      <span className="text-[10px] text-secondary">{w.customerEmail}</span>
                    </td>
                    <td className="py-4 px-4 font-medium text-charcoal">
                      {w.productName}
                    </td>
                    <td className="py-4 px-4 text-secondary">
                      <span className="font-medium text-charcoal block">{w.retailer}</span>
                      <span className="text-[10px]">Purchased: {w.purchaseDate}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          w.status === 'verified'
                            ? 'bg-forest/10 text-forest'
                            : w.status === 'rejected'
                            ? 'bg-sale/10 text-sale'
                            : 'bg-gold/20 text-forest-dark'
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedWarranty(w)
                          setNotes(w.internalNotes || '')
                        }}
                        className="px-3 py-1.5 bg-forest text-warmwhite rounded-lg text-xs font-bold hover:bg-forest-dark transition-colors"
                      >
                        Review Claim
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedWarranty && (
        <div className="fixed inset-0 z-50 bg-forest-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-warmwhite w-full max-w-lg rounded-3xl border border-borderLight shadow-2xl overflow-hidden">
            <div className="p-6 bg-forest-dark text-warmwhite flex items-center justify-between border-b border-borderLight/20">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-gold" />
                <h3 className="font-serif text-lg font-bold">
                  Verify Warranty: {selectedWarranty.invoiceNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedWarranty(null)}
                className="text-warmwhite/60 hover:text-warmwhite text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-cream/40 p-4 rounded-2xl border border-borderLight">
                <div>
                  <span className="text-secondary block">Customer Name</span>
                  <span className="font-bold text-charcoal">{selectedWarranty.customerName}</span>
                </div>
                <div>
                  <span className="text-secondary block">Phone</span>
                  <span className="font-bold text-charcoal">{selectedWarranty.customerPhone}</span>
                </div>
                <div>
                  <span className="text-secondary block">Email</span>
                  <span className="font-bold text-charcoal">{selectedWarranty.customerEmail}</span>
                </div>
                <div>
                  <span className="text-secondary block">Retailer / Store</span>
                  <span className="font-bold text-charcoal">{selectedWarranty.retailer}</span>
                </div>
                <div>
                  <span className="text-secondary block">Purchase Date</span>
                  <span className="font-bold text-charcoal">{selectedWarranty.purchaseDate}</span>
                </div>
                <div>
                  <span className="text-secondary block">Delivery Date</span>
                  <span className="font-bold text-charcoal">{selectedWarranty.deliveryDate}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-forest-dark mb-1">
                  Internal Verification Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record verification against ERP invoice or serial inspection..."
                  className="w-full px-3 py-2 rounded-xl border border-borderLight focus:border-forest"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-borderLight">
                <button
                  type="button"
                  onClick={() => setSelectedWarranty(null)}
                  className="px-4 py-2 font-bold text-secondary"
                >
                  Cancel
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus('rejected')}
                    className="flex items-center space-x-1 px-4 py-2 border border-sale text-sale font-bold rounded-xl hover:bg-sale/10"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>

                  <button
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus('verified')}
                    className="flex items-center space-x-1 px-5 py-2 bg-forest text-warmwhite font-bold rounded-xl hover:bg-forest-dark shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-gold" />
                    <span>Verify & Approve 10-Yr Warranty</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
