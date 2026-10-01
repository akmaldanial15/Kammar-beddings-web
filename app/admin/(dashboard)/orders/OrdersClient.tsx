'use client'

import React, { useState } from 'react'
import { Order } from '@/types'
import { formatMYR, formatKLDate } from '@/lib/utils/format'
import {
  Search,
  ShoppingBag,
  ArrowUpRight,
  X,
  CreditCard,
  Truck,
  MapPin,
  Calendar,
  User,
  Clock,
  DollarSign,
  AlertTriangle,
  Tag,
} from 'lucide-react'
import Link from 'next/link'

interface OrdersClientProps {
  initialOrders: Order[]
}

export function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [orders] = useState<Order[]>(initialOrders)
  const [search, setSearch] = useState('')
  const [paymentFilter, setPaymentFilter] = useState<string>('all')
  const [fulfillmentFilter, setFulfillmentFilter] = useState<string>('all')

  const filtered = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      (order.affiliateCode && order.affiliateCode.toLowerCase().includes(search.toLowerCase())) ||
      (order.shippingAddress?.city && order.shippingAddress.city.toLowerCase().includes(search.toLowerCase())) ||
      (order.shippingAddress?.state && order.shippingAddress.state.toLowerCase().includes(search.toLowerCase()))

    const matchesPayment =
      paymentFilter === 'all' || order.paymentStatus === paymentFilter
    const matchesFulfillment =
      fulfillmentFilter === 'all' || order.fulfillmentStatus === fulfillmentFilter

    return matchesSearch && matchesPayment && matchesFulfillment
  })

  // Quick stats
  const totalOrders = orders.length
  const totalRevenueSen = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((acc, o) => acc + o.totalSen, 0)
  const pendingActionCount = orders.filter(
    (o) =>
      o.fulfillmentStatus === 'unfulfilled' ||
      o.fulfillmentStatus === 'processing' ||
      o.paymentStatus === 'unpaid'
  ).length

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return {
          label: 'Paid',
          className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
        }
      case 'unpaid':
        return {
          label: 'Unpaid',
          className: 'bg-amber-100 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
        }
      case 'processing':
        return {
          label: 'Processing',
          className: 'bg-blue-100 text-blue-800 border-blue-200',
          dot: 'bg-blue-500',
        }
      case 'partially_refunded':
        return {
          label: 'Part. Refunded',
          className: 'bg-rose-100 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
        }
      case 'refunded':
        return {
          label: 'Refunded',
          className: 'bg-rose-100 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
        }
      case 'failed':
        return {
          label: 'Failed',
          className: 'bg-rose-100 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
        }
      default:
        return {
          label: status.replace('_', ' '),
          className: 'bg-cream text-charcoal border-borderLight',
          dot: 'bg-charcoal',
        }
    }
  }

  const getFulfillmentBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return {
          label: 'Delivered',
          className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
        }
      case 'shipped':
        return {
          label: 'Shipped',
          className: 'bg-sky-100 text-sky-800 border-sky-200',
          dot: 'bg-sky-500',
        }
      case 'scheduled':
        return {
          label: 'Scheduled',
          className: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          dot: 'bg-indigo-500',
        }
      case 'processing':
        return {
          label: 'Processing',
          className: 'bg-amber-100 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
        }
      case 'unfulfilled':
        return {
          label: 'Unfulfilled',
          className: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
        }
      case 'cancelled':
        return {
          label: 'Cancelled',
          className: 'bg-rose-100 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
        }
      default:
        return {
          label: status,
          className: 'bg-cream text-secondary border-borderLight',
          dot: 'bg-secondary',
        }
    }
  }

  const isFilterActive = search !== '' || paymentFilter !== 'all' || fulfillmentFilter !== 'all'

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary KPI Badges: 3-column responsive grid on all devices */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 animate-fade-in-up">
        {/* Card 1: Total Orders */}
        <button
          type="button"
          onClick={() => {
            setPaymentFilter('all')
            setFulfillmentFilter('all')
          }}
          className="text-left p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border bg-warmwhite/80 border-borderLight hover:bg-warmwhite transition-all shadow-xs cursor-pointer"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 gap-1 sm:gap-0">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-forest/10 text-forest flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs text-secondary font-medium block truncate">
                Total Orders
              </span>
              <h4 className="text-sm sm:text-xl font-bold text-forest-dark truncate">
                {totalOrders}{' '}
                <span className="text-[9px] sm:text-xs font-normal text-secondary">pesanan</span>
              </h4>
            </div>
          </div>
        </button>

        {/* Card 2: Total Revenue */}
        <button
          type="button"
          onClick={() => setPaymentFilter('paid')}
          className={`text-left p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all cursor-pointer ${
            paymentFilter === 'paid'
              ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-400/20 shadow-sm'
              : 'bg-warmwhite/80 border-borderLight hover:bg-warmwhite shadow-xs'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 gap-1 sm:gap-0">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-emerald-700" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs text-emerald-800 font-medium block truncate">
                Paid Revenue
              </span>
              <h4 className="text-xs sm:text-xl font-bold text-emerald-900 truncate">
                {formatMYR(totalRevenueSen)}
              </h4>
            </div>
          </div>
        </button>

        {/* Card 3: Pending Action */}
        <button
          type="button"
          onClick={() => setFulfillmentFilter('unfulfilled')}
          className={`text-left p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all cursor-pointer ${
            fulfillmentFilter === 'unfulfilled'
              ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20 shadow-sm'
              : 'bg-warmwhite/80 border-borderLight hover:bg-warmwhite shadow-xs'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 gap-1 sm:gap-0">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
              <Truck className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-600" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs text-amber-800 font-medium block truncate">
                Perlu Tindakan
              </span>
              <h4 className="text-sm sm:text-xl font-bold text-amber-900 truncate">
                {pendingActionCount}{' '}
                <span className="text-[9px] sm:text-xs font-normal text-amber-700">pesanan</span>
              </h4>
            </div>
          </div>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-warmwhite p-3 sm:p-4 rounded-2xl border border-borderLight flex flex-col md:flex-row gap-2.5 sm:gap-3 items-stretch md:items-center justify-between shadow-xs animate-fade-in-up delay-100">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari no pesanan, pelanggan, emel, bandar..."
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

        <div className="flex items-center space-x-2">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="flex-1 md:flex-initial text-xs px-2.5 sm:px-3 py-2 rounded-xl bg-cream/50 border border-borderLight focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold font-medium"
          >
            <option value="all">Semua Bayaran</option>
            <option value="paid">Paid (Dibayar)</option>
            <option value="unpaid">Unpaid (Belum Dibayar)</option>
            <option value="processing">Processing</option>
            <option value="partially_refunded">Partially Refunded</option>
            <option value="refunded">Refunded</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={fulfillmentFilter}
            onChange={(e) => setFulfillmentFilter(e.target.value)}
            className="flex-1 md:flex-initial text-xs px-2.5 sm:px-3 py-2 rounded-xl bg-cream/50 border border-borderLight focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold font-medium"
          >
            <option value="all">Semua Penghantaran</option>
            <option value="unfulfilled">Unfulfilled</option>
            <option value="processing">Processing</option>
            <option value="scheduled">Scheduled</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {isFilterActive && (
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setPaymentFilter('all')
                setFulfillmentFilter('all')
              }}
              className="px-2.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
              title="Reset Penapis"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE ORDERS FEED (md:hidden)                                            */}
      {/* ========================================================================= */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-warmwhite rounded-2xl border border-borderLight p-8 text-center text-charcoal-muted">
            <ShoppingBag className="w-10 h-10 text-charcoal-muted/40 mx-auto mb-2" />
            <p className="text-xs font-bold">Tiada pesanan dijumpai</p>
            <p className="text-[11px] mt-1 text-secondary">
              Cuba carian atau penapis status yang berbeza.
            </p>
          </div>
        ) : (
          filtered.map((order, idx) => {
            const itemCount = order.items.reduce((acc, i) => acc + i.quantity, 0)
            const paymentBadge = getPaymentBadge(order.paymentStatus)
            const fulfillmentBadge = getFulfillmentBadge(order.fulfillmentStatus)
            const staggerClass = `stagger-${(idx % 10) + 1}`

            return (
              <div
                key={order.id}
                className={`bg-warmwhite rounded-2xl border border-borderLight p-3.5 shadow-xs transition-all animate-fade-in-up ${staggerClass}`}
              >
                {/* Header: Order Number + Badges */}
                <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-borderLight/60">
                  <div>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-mono font-bold text-xs text-forest hover:underline block"
                    >
                      {order.orderNumber}
                    </Link>
                    <span className="text-[10px] text-charcoal-muted block mt-0.5">
                      {formatKLDate(order.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 flex-shrink-0">
                    {/* Payment Badge */}
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${paymentBadge.className}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${paymentBadge.dot}`} />
                      <span>{paymentBadge.label}</span>
                    </span>

                    {/* Fulfilment Badge */}
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${fulfillmentBadge.className}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${fulfillmentBadge.dot}`} />
                      <span>{fulfillmentBadge.label}</span>
                    </span>
                  </div>
                </div>

                {/* Customer & Destination Row */}
                <div className="py-2.5 space-y-1.5 text-xs border-b border-borderLight/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 min-w-0">
                      <User className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                      <span className="font-bold text-forest-dark truncate">
                        {order.customerName}
                      </span>
                    </div>

                    {order.shippingAddress?.city && (
                      <div className="flex items-center space-x-1 text-[11px] text-secondary flex-shrink-0 ml-2">
                        <MapPin className="w-3 h-3 text-gold-dark" />
                        <span>
                          {order.shippingAddress.city}, {order.shippingAddress.state}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] text-secondary truncate">
                    {order.customerEmail}
                  </div>

                  {/* Affiliate / Referral info if any */}
                  {order.affiliateCode && (
                    <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-gold/15 border border-gold/30 text-[10px] font-medium text-forest-dark mt-1">
                      <Tag className="w-3 h-3 text-gold-dark" />
                      <span className="font-mono font-bold">{order.affiliateCode}</span>
                      <span className="text-charcoal-muted">&bull; {order.affiliateName || 'Affiliate'}</span>
                      {order.affiliateCommissionSen !== undefined && (
                        <span className="font-bold text-forest">
                          (Komisen: {formatMYR(order.affiliateCommissionSen)})
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Items Summary Row */}
                <div className="py-2 text-xs text-charcoal">
                  <span className="font-medium line-clamp-1">
                    {order.items[0]?.productName}
                    {order.items.length > 1 && (
                      <span className="text-secondary font-normal">
                        {' '}
                        + {order.items.length - 1} item lagi
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] text-secondary block mt-0.5">
                    Jumlah item: {itemCount} unit
                  </span>
                </div>

                {/* Footer: Total & Manage Button */}
                <div className="pt-2.5 border-t border-borderLight/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-secondary block">Jumlah Bayaran:</span>
                    <span className="text-sm font-bold text-forest-dark">
                      {formatMYR(order.totalSen)}
                    </span>
                  </div>

                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="inline-flex items-center space-x-1 px-3.5 py-2 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    <span>Urus Pesanan</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gold" />
                  </Link>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP ORDERS TABLE (hidden md:block)                                    */}
      {/* ========================================================================= */}
      <div className="hidden md:block bg-warmwhite rounded-2xl border border-borderLight shadow-sm overflow-hidden animate-fade-in-up delay-150">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-secondary/40 mx-auto mb-3" />
            <p className="text-sm font-bold text-forest-dark">
              No orders found matching criteria.
            </p>
            <p className="text-xs text-secondary mt-1">
              Orders placed on the storefront will appear here instantly.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream/60 border-b border-borderLight text-secondary uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Order Number</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Referral / Agent</th>
                  <th className="py-3.5 px-4">Items Summary</th>
                  <th className="py-3.5 px-4">Destination</th>
                  <th className="py-3.5 px-4">Total (MYR)</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Fulfilment</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderLight/60">
                {filtered.map((order) => {
                  const itemCount = order.items.reduce((acc, i) => acc + i.quantity, 0)
                  const paymentBadge = getPaymentBadge(order.paymentStatus)
                  const fulfillmentBadge = getFulfillmentBadge(order.fulfillmentStatus)

                  return (
                    <tr key={order.id} className="hover:bg-cream/20 transition-colors">
                      <td className="py-4 px-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-bold text-forest hover:underline font-mono"
                        >
                          {order.orderNumber}
                        </Link>
                        <span className="text-[10px] text-secondary block mt-0.5">
                          {formatKLDate(order.createdAt)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-forest-dark block">
                          {order.customerName}
                        </span>
                        <span className="text-[10px] text-secondary">{order.customerEmail}</span>
                      </td>
                      <td className="py-4 px-4">
                        {order.affiliateCode ? (
                          <div>
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-gold/20 text-forest-dark text-[10px] font-bold font-mono">
                              <span>🏷️</span>
                              <span>{order.affiliateCode}</span>
                            </span>
                            <span className="text-[10.5px] text-charcoal font-medium block mt-0.5 truncate max-w-[130px]">
                              {order.affiliateName || 'Affiliate'}
                            </span>
                            {order.affiliateCommissionSen !== undefined && (
                              <span className="text-[9.5px] text-forest font-bold block">
                                Comm: {formatMYR(order.affiliateCommissionSen)}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-secondary/60 italic">
                            Direct Organic
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-charcoal block">
                          {order.items[0]?.productName}
                          {order.items.length > 1 && ` + ${order.items.length - 1} more`}
                        </span>
                        <span className="text-[10px] text-secondary">
                          {itemCount} total item(s)
                        </span>
                      </td>
                      <td className="py-4 px-4 text-secondary">
                        <span className="font-medium text-charcoal block">
                          {order.shippingAddress.city}
                        </span>
                        <span className="text-[10px]">{order.shippingAddress.state}</span>
                      </td>
                      <td className="py-4 px-4 font-bold text-forest">
                        {formatMYR(order.totalSen)}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${paymentBadge.className}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${paymentBadge.dot}`} />
                          <span>{paymentBadge.label}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${fulfillmentBadge.className}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${fulfillmentBadge.dot}`} />
                          <span>{fulfillmentBadge.label}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-forest text-warmwhite text-xs font-bold rounded-lg hover:bg-forest-dark transition-colors shadow-sm"
                        >
                          <span>Manage</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
