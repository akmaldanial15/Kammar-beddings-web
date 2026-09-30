'use client'

import React, { useState } from 'react'
import { Order } from '@/types'
import { formatMYR, formatKLDate } from '@/lib/utils/format'
import {
  ArrowLeft,
  Truck,
  CheckCircle,
  AlertCircle,
  Clock,
  RotateCcw,
  ShieldCheck,
  FileText,
  Save,
} from 'lucide-react'
import Link from 'next/link'

interface OrderDetailAdminClientProps {
  initialOrder: Order
}

export function OrderDetailAdminClient({ initialOrder }: OrderDetailAdminClientProps) {
  const [order, setOrder] = useState<Order>(initialOrder)
  const [carrier, setCarrier] = useState(order.carrier || 'LENA White-Glove Fleet')
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '')
  const [internalNotes, setInternalNotes] = useState(order.internalNotes || '')
  const [isUpdating, setIsUpdating] = useState(false)
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  // Refund Modal State
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [refundAmount, setRefundAmount] = useState<number>(order.totalSen / 100)
  const [refundReason, setRefundReason] = useState<string>('Customer order cancellation request')
  const [isRefunding, setIsRefunding] = useState(false)

  const handleUpdateFulfillment = async (newStatus: Order['fulfillmentStatus']) => {
    setIsUpdating(true)
    setFeedback(null)

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fulfillmentStatus: newStatus,
          carrier,
          trackingNumber,
          internalNotes,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setOrder(data.order)
        setFeedback({ text: `Fulfilment status updated to "${newStatus}".`, type: 'success' })
      } else {
        setFeedback({ text: data.error || 'Failed to update order.', type: 'error' })
      }
    } catch {
      setFeedback({ text: 'Network failure while updating order.', type: 'error' })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSaveNotes = async () => {
    setIsUpdating(true)
    setFeedback(null)

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carrier,
          trackingNumber,
          internalNotes,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setOrder(data.order)
        setFeedback({ text: 'Internal notes and tracking information saved.', type: 'success' })
      } else {
        setFeedback({ text: data.error || 'Failed to save notes.', type: 'error' })
      }
    } catch {
      setFeedback({ text: 'Network failure while saving notes.', type: 'error' })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleProcessRefund = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsRefunding(true)
    setFeedback(null)

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountSen: Math.round(refundAmount * 100),
          reason: refundReason,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setOrder(data.order)
        setShowRefundModal(false)
        setFeedback({ text: 'Refund processed successfully and logged to audit trail.', type: 'success' })
      } else {
        setFeedback({ text: data.error || 'Refund execution failed.', type: 'error' })
      }
    } catch {
      setFeedback({ text: 'Network error during refund processing.', type: 'error' })
    } finally {
      setIsRefunding(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/orders"
            className="p-2 bg-warmwhite rounded-xl border border-borderLight text-secondary hover:text-forest transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-forest-dark font-mono">
                {order.orderNumber}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  order.paymentStatus === 'paid'
                    ? 'bg-forest/10 text-forest'
                    : order.paymentStatus.includes('refund')
                    ? 'bg-sale/10 text-sale'
                    : 'bg-gold/20 text-forest-dark'
                }`}
              >
                {order.paymentStatus.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-secondary mt-1">
              Placed on {formatKLDate(order.createdAt)} (Asia/Kuala_Lumpur)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {order.paymentStatus === 'paid' && (
            <button
              onClick={() => setShowRefundModal(true)}
              className="flex items-center space-x-1.5 px-4 py-2 border border-sale text-sale rounded-xl text-xs font-bold hover:bg-sale/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Issue Refund</span>
            </button>
          )}

          <Link
            href={`/order/confirmed/${order.id}`}
            target="_blank"
            className="flex items-center space-x-1.5 px-4 py-2 bg-warmwhite border border-borderLight text-forest-dark rounded-xl text-xs font-bold hover:border-forest transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4 text-gold" />
            <span>Customer Tax Invoice</span>
          </Link>
        </div>
      </div>

      {/* Feedback Toast */}
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Items and Timeline) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items Section */}
          <div className="bg-warmwhite p-6 rounded-2xl border border-borderLight shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-forest-dark border-b border-borderLight pb-3">
              Order Items Snapshot (Immutable)
            </h3>

            <div className="divide-y divide-borderLight/60">
              {order.items.map((item) => (
                <div key={item.variantId} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-4 min-w-0">
                    <img
                      src={item.imageUrl || item.image || ''}
                      alt={item.productName}
                      className="w-16 h-16 rounded-xl object-cover border border-borderLight flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-forest-dark text-sm truncate">
                        {item.productName}
                      </h4>
                      <p className="text-xs text-forest font-semibold mt-0.5">
                        {item.sizeName} ({item.dimensions})
                      </p>
                      <p className="text-[10px] text-secondary font-mono mt-0.5">
                        SKU: {item.sku}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="font-bold text-forest-dark text-sm block">
                      {formatMYR((item.unitPriceSen || item.priceSen || 0) * item.quantity)}
                    </span>
                    <span className="text-xs text-secondary block">
                      {item.quantity} × {formatMYR(item.unitPriceSen || item.priceSen || 0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="border-t border-borderLight pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-secondary">
                <span>Subtotal</span>
                <span className="font-medium text-charcoal">{formatMYR(order.subtotalSen)}</span>
              </div>
              {order.discountSen > 0 && (
                <div className="flex justify-between text-sale font-medium">
                  <span>Coupon Discount ({order.appliedCoupon})</span>
                  <span>-{formatMYR(order.discountSen)}</span>
                </div>
              )}
              <div className="flex justify-between text-secondary">
                <span>Malaysian Logistics & White-Glove Installation</span>
                <span className="font-medium text-charcoal">
                  {order.shippingSen === 0 ? 'Complimentary' : formatMYR(order.shippingSen)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-forest-dark border-t border-borderLight pt-3">
                <span>Total Amount (MYR)</span>
                <span className="font-serif text-lg text-forest">{formatMYR(order.totalSen)}</span>
              </div>
            </div>
          </div>

          {/* Fulfilment Workflow & State Machine */}
          <div className="bg-warmwhite p-6 rounded-2xl border border-borderLight shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-forest-dark border-b border-borderLight pb-3">
              Fulfilment Workflow Actions
            </h3>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-secondary font-medium">Current Status:</span>
              <span className="font-bold text-forest uppercase tracking-wider px-2.5 py-1 rounded bg-forest/10">
                {order.fulfillmentStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <button
                disabled={isUpdating}
                onClick={() => handleUpdateFulfillment('processing')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                  order.fulfillmentStatus === 'processing'
                    ? 'border-forest bg-forest text-warmwhite'
                    : 'border-borderLight bg-cream/40 text-charcoal hover:border-forest'
                }`}
              >
                1. Processing
              </button>

              <button
                disabled={isUpdating}
                onClick={() => handleUpdateFulfillment('scheduled')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                  order.fulfillmentStatus === 'scheduled'
                    ? 'border-forest bg-forest text-warmwhite'
                    : 'border-borderLight bg-cream/40 text-charcoal hover:border-forest'
                }`}
              >
                2. Scheduled
              </button>

              <button
                disabled={isUpdating}
                onClick={() => handleUpdateFulfillment('shipped')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                  order.fulfillmentStatus === 'shipped'
                    ? 'border-forest bg-forest text-warmwhite'
                    : 'border-borderLight bg-cream/40 text-charcoal hover:border-forest'
                }`}
              >
                3. Shipped / Dispatch
              </button>

              <button
                disabled={isUpdating}
                onClick={() => handleUpdateFulfillment('delivered')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                  order.fulfillmentStatus === 'delivered'
                    ? 'border-forest bg-forest text-warmwhite'
                    : 'border-borderLight bg-cream/40 text-charcoal hover:border-forest'
                }`}
              >
                4. Delivered
              </button>
            </div>

            {/* Courier & Tracking Assignment */}
            <div className="pt-4 border-t border-borderLight grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-forest-dark mb-1">
                  Logistics Carrier
                </label>
                <input
                  type="text"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  placeholder="e.g. LENA White-Glove Fleet, GDEX, J&T"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-borderLight focus:border-forest bg-cream/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-dark mb-1">
                  Tracking Waybill / Reference
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. LENA-MY-89212"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-borderLight focus:border-forest bg-cream/30 font-mono"
                />
              </div>
            </div>

            {/* Internal Staff Notes */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-forest-dark mb-1">
                Internal Staff Notes (Private from Customer)
              </label>
              <textarea
                rows={3}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Log customer phone confirmations, elevator access clearances, or warehouse notes..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-borderLight focus:border-forest bg-cream/30"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveNotes}
                disabled={isUpdating}
                className="flex items-center space-x-1.5 px-4 py-2 bg-forest text-warmwhite text-xs font-bold rounded-xl hover:bg-forest-dark transition-colors shadow-sm disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Tracking & Notes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (Customer & Delivery Specs) */}
        <div className="space-y-6">
          {/* Customer Details */}
          <div className="bg-warmwhite p-6 rounded-2xl border border-borderLight shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-forest-dark border-b border-borderLight pb-3">
              Customer Information
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-secondary block">Full Name</span>
                <span className="font-bold text-charcoal">{order.customerName}</span>
              </div>

              <div>
                <span className="text-secondary block">Email</span>
                <span className="font-bold text-charcoal">{order.customerEmail}</span>
              </div>

              <div>
                <span className="text-secondary block">Phone Number</span>
                <span className="font-bold text-charcoal">{order.customerPhone}</span>
              </div>

              {order.paymentId && (
                <div>
                  <span className="text-secondary block">Payment Reference</span>
                  <span className="font-mono text-[10px] text-forest block truncate">
                    {order.paymentId}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Address & Bulky Specs */}
          <div className="bg-warmwhite p-6 rounded-2xl border border-borderLight shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-forest-dark border-b border-borderLight pb-3 flex items-center justify-between">
              <span>Shipping Address</span>
              <Truck className="w-4 h-4 text-gold" />
            </h3>

            <div className="space-y-2 text-xs">
              <p className="font-bold text-charcoal">
                {order.shippingAddress.fullName || order.shippingAddress.name || order.customerName}
              </p>
              <p className="text-secondary">{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && (
                <p className="text-secondary">{order.shippingAddress.addressLine2}</p>
              )}
              <p className="font-semibold text-charcoal">
                {order.shippingAddress.postcode} {order.shippingAddress.city},{' '}
                {order.shippingAddress.state}
              </p>
              <p className="text-secondary font-medium">Malaysia</p>
            </div>

            {(order.deliveryNotes || order.shippingAddress.deliveryNotes) && (
              <div className="p-3 bg-cream/60 rounded-xl border border-borderLight text-xs space-y-1 mt-3">
                <span className="font-bold text-forest-dark block">Bulky Mattress Notes:</span>
                <p className="text-secondary italic">
                  {order.deliveryNotes || order.shippingAddress.deliveryNotes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 z-50 bg-forest-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-warmwhite w-full max-w-md rounded-3xl border border-borderLight shadow-2xl overflow-hidden">
            <div className="p-6 bg-sale text-warmwhite flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-5 h-5" />
                <h3 className="font-serif text-lg font-bold">Issue Verified Refund</h3>
              </div>
              <button
                onClick={() => setShowRefundModal(false)}
                className="text-warmwhite/70 hover:text-warmwhite text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProcessRefund} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-sale/10 rounded-xl text-sale text-xs border border-sale/20">
                Warning: Issuing a refund will update the order status and record an audited
                administrative action with your staff credentials.
              </div>

              <div>
                <label className="block font-bold text-forest-dark mb-1">
                  Refund Amount (MYR) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  max={order.totalSen / 100}
                  required
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-borderLight focus:border-forest text-sm font-bold font-mono"
                />
                <span className="text-[10px] text-secondary mt-1 block">
                  Maximum refundable: {formatMYR(order.totalSen)}
                </span>
              </div>

              <div>
                <label className="block font-bold text-forest-dark mb-1">
                  Reason for Refund (Mandatory Audit Requirement) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Provide explicit operational rationale for this refund..."
                  className="w-full px-3 py-2 rounded-xl border border-borderLight focus:border-forest"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-borderLight">
                <button
                  type="button"
                  onClick={() => setShowRefundModal(false)}
                  className="px-4 py-2 font-bold text-secondary hover:text-charcoal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRefunding}
                  className="px-5 py-2.5 bg-sale text-warmwhite font-bold rounded-xl hover:bg-sale/90 transition-colors shadow-sm disabled:opacity-50"
                >
                  {isRefunding ? 'Processing Refund...' : 'Confirm & Execute Refund'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
