'use client'

import React, { useState } from 'react'
import { Order } from '@/types'
import { formatMYR, formatKLDate } from '@/lib/utils/format'
import { Search, Eye, Filter, ShoppingBag, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

interface OrdersClientProps {
  initialOrders: Order[]
}

export function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [search, setSearch] = useState('')
  const [paymentFilter, setPaymentFilter] = useState<string>('all')
  const [fulfillmentFilter, setFulfillmentFilter] = useState<string>('all')

  const filtered = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(search.toLowerCase())

    const matchesPayment =
      paymentFilter === 'all' || order.paymentStatus === paymentFilter
    const matchesFulfillment =
      fulfillmentFilter === 'all' || order.fulfillmentStatus === fulfillmentFilter

    return matchesSearch && matchesPayment && matchesFulfillment
  })

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-warmwhite p-4 rounded-2xl border border-borderLight flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order #, customer, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-cream/50 border border-borderLight focus:outline-none focus:border-forest"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl bg-cream/50 border border-borderLight focus:outline-none focus:border-forest"
          >
            <option value="all">All Payment States</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="processing">Processing</option>
            <option value="partially_refunded">Partially Refunded</option>
            <option value="refunded">Refunded</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={fulfillmentFilter}
            onChange={(e) => setFulfillmentFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl bg-cream/50 border border-borderLight focus:outline-none focus:border-forest"
          >
            <option value="all">All Fulfilment States</option>
            <option value="unfulfilled">Unfulfilled</option>
            <option value="processing">Processing</option>
            <option value="scheduled">Scheduled</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-warmwhite rounded-2xl border border-borderLight shadow-sm overflow-hidden animate-fade-in-up delay-150">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-secondary/40 mx-auto mb-3" />
            <p className="text-sm font-bold text-forest-dark">No orders found matching criteria.</p>
            <p className="text-xs text-secondary mt-1">Orders placed on the storefront will appear here instantly.</p>
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
                        <span className="font-bold text-forest-dark block">{order.customerName}</span>
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
                          <span className="text-[11px] text-secondary/60 italic">Direct Organic</span>
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
                        <span className="font-medium text-charcoal block">{order.shippingAddress.city}</span>
                        <span className="text-[10px]">{order.shippingAddress.state}</span>
                      </td>
                      <td className="py-4 px-4 font-bold text-forest">
                        {formatMYR(order.totalSen)}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.paymentStatus === 'paid'
                              ? 'bg-forest/10 text-forest'
                              : order.paymentStatus === 'refunded' || order.paymentStatus === 'partially_refunded'
                              ? 'bg-sale/10 text-sale'
                              : 'bg-gold/20 text-forest-dark'
                          }`}
                        >
                          {order.paymentStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.fulfillmentStatus === 'delivered'
                              ? 'bg-forest/10 text-forest'
                              : order.fulfillmentStatus === 'shipped' || order.fulfillmentStatus === 'scheduled'
                              ? 'bg-gold/20 text-forest-dark'
                              : 'bg-cream text-secondary'
                          }`}
                        >
                          {order.fulfillmentStatus}
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
