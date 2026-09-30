import React from 'react'
import Link from 'next/link'
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Clock,
} from 'lucide-react'
import { getOrders, getProducts, getWarrantyRegistrations } from '@/lib/db'
import { formatMYR, formatDateTimeMY } from '@/lib/utils/format'

export default async function AdminDashboardOverview() {
  const [orders, products, warranties] = await Promise.all([
    getOrders(),
    getProducts({ status: 'all' }),
    getWarrantyRegistrations(),
  ])

  // Verified figures from database
  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid')
  const verifiedRevenueSen = paidOrders.reduce((sum, o) => sum + o.totalSen, 0)
  const aovSen = paidOrders.length > 0 ? Math.round(verifiedRevenueSen / paidOrders.length) : 0

  // Low stock calculation across all variants
  const lowStockVariants: { product: string; size: string; stock: number; sku: string }[] = []
  for (const p of products) {
    for (const v of p.variants) {
      if (v.isActive && v.stockQuantity < 6) {
        lowStockVariants.push({
          product: p.name,
          size: v.sizeName,
          stock: v.stockQuantity,
          sku: v.sku,
        })
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-gold-dark block mb-1">
          KAMAAR Beddings Operations Atelier
        </span>
        <h1 className="font-serif text-3xl font-bold text-forest">
          Dashboard Overview
        </h1>
        <p className="text-xs text-charcoal-muted mt-1">
          Real-time metrics aggregated directly from your persistent store database.
        </p>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Verified Revenue */}
        <div className="bg-warmwhite p-6 rounded-2xl border border-borderLight shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-xs text-charcoal-muted font-bold uppercase tracking-wider">
            <span>Verified Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-forest block">
            {formatMYR(verifiedRevenueSen)}
          </span>
          <span className="text-[11px] text-charcoal-muted block">
            From {paidOrders.length} verified paid orders
          </span>
        </div>

        {/* Paid Orders */}
        <div className="bg-warmwhite p-6 rounded-2xl border border-borderLight shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-xs text-charcoal-muted font-bold uppercase tracking-wider">
            <span>Paid Orders</span>
            <div className="w-8 h-8 rounded-lg bg-forest/10 text-forest flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-forest block">
            {paidOrders.length}
          </span>
          <span className="text-[11px] text-charcoal-muted block">
            {orders.length} total orders recorded
          </span>
        </div>

        {/* Average Order Value */}
        <div className="bg-warmwhite p-6 rounded-2xl border border-borderLight shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-xs text-charcoal-muted font-bold uppercase tracking-wider">
            <span>Average Order Value</span>
            <div className="w-8 h-8 rounded-lg bg-gold/15 text-gold-dark flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-forest block">
            {formatMYR(aovSen)}
          </span>
          <span className="text-[11px] text-charcoal-muted block">
            High-ticket mattress benchmark
          </span>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-warmwhite p-6 rounded-2xl border border-borderLight shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-xs text-charcoal-muted font-bold uppercase tracking-wider">
            <span>Low Stock Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-sale block">
            {lowStockVariants.length}
          </span>
          <span className="text-[11px] text-charcoal-muted block">
            SKUs with under 6 units remaining
          </span>
        </div>
      </div>

      {/* Grid: Recent Orders & Low Stock Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-warmwhite rounded-2xl border border-borderLight shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-borderLight">
            <h2 className="font-serif text-lg font-bold text-forest">
              Recent Store Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-gold-dark hover:text-forest flex items-center space-x-1"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="text-xs text-charcoal-muted py-8 text-center">
              No orders placed yet. As customers complete checkout, verified orders will appear here.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-borderLight text-charcoal-muted font-bold uppercase text-[10px]">
                    <th className="py-2.5">Order</th>
                    <th className="py-2.5">Customer</th>
                    <th className="py-2.5">Total</th>
                    <th className="py-2.5">Payment</th>
                    <th className="py-2.5">Fulfilment</th>
                    <th className="py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderLight">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-cream-light transition-colors">
                      <td className="py-3 font-mono font-bold text-forest">
                        {order.orderNumber}
                      </td>
                      <td className="py-3">
                        <span className="font-semibold block">{order.customerName}</span>
                        <span className="text-[10px] text-charcoal-muted">{order.shippingAddress.state}</span>
                      </td>
                      <td className="py-3 font-bold">
                        {formatMYR(order.totalSen)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            order.paymentStatus === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-cream text-charcoal border border-borderLight">
                          {order.fulfillmentStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-xs font-semibold text-forest hover:text-gold-dark underline"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Alerts Box */}
        <div className="lg:col-span-4 bg-warmwhite rounded-2xl border border-borderLight shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-borderLight">
            <h2 className="font-serif text-lg font-bold text-forest">
              Low Stock Warnings
            </h2>
            <Link
              href="/admin/inventory"
              className="text-xs font-semibold text-gold-dark hover:text-forest"
            >
              Restock &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {lowStockVariants.slice(0, 5).map((v, i) => (
              <div key={i} className="p-3 bg-cream rounded-xl border border-borderLight flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-charcoal truncate max-w-[170px]">{v.product}</h4>
                  <span className="text-[10px] text-gold-dark font-medium">
                    {v.size} ({v.sku})
                  </span>
                </div>
                <span className="px-2.5 py-1 bg-sale/15 text-sale font-bold text-xs rounded-full">
                  {v.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
