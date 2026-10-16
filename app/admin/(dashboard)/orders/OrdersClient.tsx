'use client'

import React, { useState } from 'react'
import { Order } from '@/types'
import { formatMYR, formatKLDate, formatKLTime, formatKLDateTime } from '@/lib/utils/format'
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
  Trash2,
  Loader2,
  CheckCircle,
  RefreshCw,
} from 'lucide-react'
import Link from 'next/link'

interface OrdersClientProps {
  initialOrders: Order[]
}

const ADMIN_ORDERS_CACHE_KEY = 'kamaar_admin_cached_orders'

export function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [search, setSearch] = useState('')
  const [paymentFilter, setPaymentFilter] = useState<string>('all')
  const [fulfillmentFilter, setFulfillmentFilter] = useState<string>('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null)
  const [isBulkDeleting, setIsBulkDeleting] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [isManualSyncing, setIsManualSyncing] = useState<boolean>(false)
  const [syncCountdown, setSyncCountdown] = useState<number>(25)
  const [lastSyncedAt, setLastSyncedAt] = useState<string>('Baru sahaja')

  // Helper to persist orders to browser storage
  const saveOrdersToCache = (orderList: Order[]) => {
    try {
      if (typeof window !== 'undefined') {
        if (orderList.length > 0) {
          localStorage.setItem(ADMIN_ORDERS_CACHE_KEY, JSON.stringify(orderList))
        } else {
          localStorage.removeItem(ADMIN_ORDERS_CACHE_KEY)
        }
      }
    } catch (_) {}
  }

  // 1. Initial Client Cache Hydration (Prevents orders temporarily disappearing on page refresh / cold lambda)
  React.useEffect(() => {
    try {
      if (typeof window === 'undefined') return
      const cached = localStorage.getItem(ADMIN_ORDERS_CACHE_KEY)
      if (cached) {
        const parsed: Order[] = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOrders((prev) => {
            if (prev.length === 0) return parsed
            const map = new Map<string, Order>()
            parsed.forEach((o) => map.set(o.id, o))
            prev.forEach((o) => map.set(o.id, o))
            return Array.from(map.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
          })
        }
      } else if (initialOrders.length > 0) {
        saveOrdersToCache(initialOrders)
      }
    } catch (_) {}
  }, [initialOrders])

  // 2. Smart Auto-Polling Loop (Every 25 seconds & paused when tab/phone is locked to save Vercel quota)
  React.useEffect(() => {
    let isMounted = true

    // Countdown timer tick every second - pauses automatically when tab is hidden / phone locked
    const countTimer = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return
      setSyncCountdown((prev) => (prev <= 1 ? 25 : prev - 1))
    }, 1000)

    // Poll endpoint every 25 seconds - paused when tab is inactive
    const pollTimer = setInterval(async () => {
      if (typeof document !== 'undefined' && document.hidden) return
      try {
        const res = await fetch('/api/admin/orders', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (data && Array.isArray(data.orders) && isMounted) {
          setOrders((prev) => {
            // Case A: Server has orders -> merge & update cache
            if (data.orders.length > 0) {
              const map = new Map<string, Order>()
              data.orders.forEach((no: Order) => map.set(no.id, no))
              // Preserve any verified orders previously present
              prev.forEach((po: Order) => {
                if (!map.has(po.id)) map.set(po.id, po)
              })
              const merged = Array.from(map.values()).sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              )
              saveOrdersToCache(merged)

              if (data.orders.length > prev.length) {
                const newOrders = data.orders.filter(
                  (no: Order) => !prev.some((po) => po.id === no.id)
                )
                if (newOrders.length > 0) {
                  const newest = newOrders[0]
                  setToast({
                    type: 'success',
                    message: `🔔 Pesanan Baharu Vercel Dikesan: ${newest.orderNumber} (RM${(newest.totalSen / 100).toFixed(2)}) oleh ${newest.customerName}!`,
                  })
                }
              }
              return merged
            }

            // Case B: Server returned empty, but client has verified orders
            // (Vercel serverless cold-container split-brain protection)
            if (prev.length > 0) {
              // Back-fill this serverless container in background so it never stays empty
              fetch('/api/admin/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ syncOrders: prev }),
              }).catch(() => {})
              return prev // NEVER wipe orders to empty on cold-boot glitches!
            }

            return []
          })
          setLastSyncedAt(new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
        }
      } catch (_) {}
    }, 25000)

    return () => {
      isMounted = false
      clearInterval(countTimer)
      clearInterval(pollTimer)
    }
  }, [])

  const handleManualSync = async () => {
    setIsManualSyncing(true)
    try {
      const res = await fetch('/api/admin/orders', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        if (data && Array.isArray(data.orders)) {
          if (data.orders.length > 0) {
            setOrders((prev) => {
              const map = new Map<string, Order>()
              data.orders.forEach((no: Order) => map.set(no.id, no))
              prev.forEach((po: Order) => {
                if (!map.has(po.id)) map.set(po.id, po)
              })
              const merged = Array.from(map.values()).sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              )
              saveOrdersToCache(merged)
              return merged
            })
          } else if (orders.length > 0) {
            // Re-hydrate server container
            await fetch('/api/admin/orders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ syncOrders: orders }),
            }).catch(() => {})
          }
          setLastSyncedAt(new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
          setSyncCountdown(8)
          setToast({ type: 'success', message: 'Penyegerakan awan Vercel berjaya disahkan & dimuktamadkan.' })
        }
      }
    } catch (_) {
      setToast({ type: 'error', message: 'Ralat sambungan semasa menyegerak.' })
    } finally {
      setIsManualSyncing(false)
    }
  }

  const handleClearAll = async () => {
    if (!window.confirm('Adakah anda pasti ingin memadam dan mengosongkan SEMUA pesanan dalam sistem? Tindakan ini tidak boleh dibatalkan.')) {
      return
    }
    setIsDeleting(true)
    try {
      const res = await fetch('/api/admin/orders?all=true', {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setOrders([])
        setSelectedIds([])
        saveOrdersToCache([])
        setToast({ type: 'success', message: 'Semua rekod pesanan telah berjaya dipadam bersih.' })
      } else {
        setToast({ type: 'error', message: data.error || 'Gagal memadam semua pesanan.' })
      }
    } catch {
      setToast({ type: 'error', message: 'Ralat sambungan semasa memadam pesanan.' })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteSingle = async () => {
    if (!orderToDelete) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderToDelete.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setOrders((prev) => {
          const updated = prev.filter((o) => o.id !== orderToDelete.id)
          saveOrdersToCache(updated)
          return updated
        })
        setSelectedIds((prev) => prev.filter((id) => id !== orderToDelete.id))
        setToast({ type: 'success', message: `Pesanan ${orderToDelete.orderNumber} berjaya dipadam.` })
        setOrderToDelete(null)
      } else {
        setToast({ type: 'error', message: data.error || 'Gagal memadam pesanan.' })
      }
    } catch {
      setToast({ type: 'error', message: 'Ralat sambungan semasa memadam pesanan.' })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    setIsDeleting(true)
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        const deletedSet = new Set(selectedIds)
        setOrders((prev) => {
          const updated = prev.filter((o) => !deletedSet.has(o.id))
          saveOrdersToCache(updated)
          return updated
        })
        setSelectedIds([])
        setToast({ type: 'success', message: `${data.count || selectedIds.length} pesanan terpilih berjaya dipadam.` })
        setIsBulkDeleting(false)
      } else {
        setToast({ type: 'error', message: data.error || 'Gagal memadam pesanan terpilih.' })
      }
    } catch {
      setToast({ type: 'error', message: 'Ralat sambungan semasa memadam pesanan.' })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSelectAll = () => {
    if (filtered.length > 0 && selectedIds.length === filtered.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filtered.map((o) => o.id))
    }
  }

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

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

  const getFinalizationBadge = (order: Order) => {
    if (order.paymentStatus === 'paid') {
      return {
        label: 'Dimuktamadkan (Finalized)',
        shortLabel: 'Finalized',
        sublabel: 'Bayaran FPX/TNG disahkan & didaftarkan penuh ke kilang',
        className: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold',
        dot: 'bg-emerald-500',
        isFinalized: true,
      }
    }
    if (order.paymentStatus === 'unpaid') {
      return {
        label: 'Menunggu Bayaran (Pending)',
        shortLabel: 'Pending',
        sublabel: 'Menanti selesai bayaran dari bank pelanggan',
        className: 'bg-amber-50 text-amber-800 border-amber-300 font-medium',
        dot: 'bg-amber-500',
        isFinalized: false,
      }
    }
    return {
      label: 'Dalam Semakan (Processing)',
      shortLabel: 'Processing',
      className: 'bg-blue-50 text-blue-800 border-blue-300 font-medium',
      dot: 'bg-blue-500',
      isFinalized: false,
    }
  }

  const isFilterActive = search !== '' || paymentFilter !== 'all' || fulfillmentFilter !== 'all'

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Toast Feedback */}
      {toast && (
        <div
          className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border flex items-center justify-between text-xs sm:text-sm animate-fade-in ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            {toast.type === 'success' ? (
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 flex-shrink-0" />
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-charcoal-muted hover:text-charcoal p-1 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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

      {/* Bulk Action Bar (when orders selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-forest text-warmwhite p-3 sm:px-5 sm:py-3.5 rounded-2xl flex items-center justify-between shadow-lg border border-gold/30 animate-fade-in-up">
          <div className="flex items-center space-x-2 text-xs sm:text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
            <span className="font-bold">{selectedIds.length} pesanan dipilih</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 text-xs text-warmwhite/80 hover:text-warmwhite hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              Batal Pilihan
            </button>
            <button
              type="button"
              onClick={() => setIsBulkDeleting(true)}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Padam Terpilih ({selectedIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Realtime Vercel Cloud Sync Live Radar Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-navy-dark to-slate-950 text-white p-3 sm:px-4 sm:py-2.5 rounded-2xl border border-gold/30 flex flex-wrap items-center justify-between gap-2 text-xs shadow-sm">
        <div className="flex items-center space-x-2.5 min-w-0">
          <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <div className="truncate">
            <div className="flex items-center space-x-2 flex-wrap gap-1">
              <span className="font-semibold text-warmwhite">Penyegerakan Awan Vercel (Live Sync):</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold">
                {orders.filter((o) => o.paymentStatus === 'paid').length} Dimuktamadkan
              </span>
              <span className="text-slate-400 text-[10px] hidden md:inline">
                • Terakhir: {lastSyncedAt} (Semakan auto: {syncCountdown}s)
              </span>
            </div>
            <div className="text-slate-300 text-[11px] mt-0.5 truncate">
              {isManualSyncing ? (
                <span className="text-amber-300 font-medium animate-pulse">
                  🔄 Menyemak &amp; memuktamadkan pesanan merentas nod awan Vercel...
                </span>
              ) : orders.length > 0 ? (
                <span>
                  Semua rekod pesanan kekal terpelihara dalam simpanan pantas dan disegerakkan dengan selamat.
                </span>
              ) : (
                <span>
                  Pangkalan data sedia menerima pesanan baharu dari gerbang CHIP.
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          {orders.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              disabled={isDeleting}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-rose-600/30 hover:bg-rose-600/60 text-rose-200 hover:text-white rounded-xl transition-all text-[11px] font-semibold border border-rose-500/40 cursor-pointer disabled:opacity-50"
              title="Padam dan kosongkan semua pesanan dalam sistem"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Kosongkan Semua</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleManualSync}
            disabled={isManualSyncing}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all text-[11px] font-semibold border border-white/15 cursor-pointer disabled:opacity-50"
            title="Segerak dan sahkan semua status pesanan terkini"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isManualSyncing ? 'animate-spin text-[#FAD02C]' : ''}`} />
            <span>{isManualSyncing ? 'Menyemak...' : 'Segerak & Muktamadkan'}</span>
          </button>
        </div>
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
            const finalizationBadge = getFinalizationBadge(order)
            const staggerClass = `stagger-${(idx % 10) + 1}`
            const isSelected = selectedIds.includes(order.id)

            return (
              <div
                key={order.id}
                className={`bg-warmwhite rounded-2xl border p-3.5 shadow-xs transition-all animate-fade-in-up ${staggerClass} ${
                  isSelected ? 'border-gold bg-gold/5 ring-1 ring-gold/20' : 'border-borderLight'
                }`}
              >
                {/* Header: Checkbox + Order Number + Badges */}
                <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-borderLight/60">
                  <div className="flex items-start space-x-2.5">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(order.id)}
                      className="mt-0.5 w-4 h-4 rounded border-borderLight text-forest focus:ring-forest cursor-pointer"
                    />
                    <div>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-mono font-bold text-xs text-forest hover:underline block"
                      >
                        {order.orderNumber}
                      </Link>
                      <span className="text-[10px] text-charcoal-muted block mt-0.5">
                        {formatKLDate(order.createdAt)} • {formatKLTime(order.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-1 flex-shrink-0 max-w-[190px]">
                    {/* Finalization Badge */}
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9.5px] border ${finalizationBadge.className}`}
                      title={finalizationBadge.sublabel}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${finalizationBadge.dot}`} />
                      <span>{finalizationBadge.shortLabel}</span>
                    </span>

                    {/* Payment Badge */}
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold border ${paymentBadge.className}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${paymentBadge.dot}`} />
                      <span>{paymentBadge.label}</span>
                    </span>

                    {/* Fulfilment Badge */}
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold border ${fulfillmentBadge.className}`}
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

                {/* Footer: Total & Actions (Manage + Delete) */}
                <div className="pt-2.5 border-t border-borderLight/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-secondary block">Jumlah Bayaran:</span>
                    <span className="text-sm font-bold text-forest-dark">
                      {formatMYR(order.totalSen)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => setOrderToDelete(order)}
                      className="p-2 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
                      title="Padam Pesanan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">Padam</span>
                    </button>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center space-x-1 px-3.5 py-2 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      <span>Urus</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-gold" />
                    </Link>
                  </div>
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
                  <th className="py-3.5 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={filtered.length > 0 && selectedIds.length === filtered.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-borderLight text-forest focus:ring-forest cursor-pointer"
                      title="Pilih semua"
                    />
                  </th>
                  <th className="py-3.5 px-4">Order Number</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Referral / Agent</th>
                  <th className="py-3.5 px-4">Items Summary</th>
                  <th className="py-3.5 px-4">Destination</th>
                  <th className="py-3.5 px-4">Total (MYR)</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status Muktamad</th>
                  <th className="py-3.5 px-4">Fulfilment</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderLight/60">
                {filtered.map((order) => {
                  const itemCount = order.items.reduce((acc, i) => acc + i.quantity, 0)
                  const paymentBadge = getPaymentBadge(order.paymentStatus)
                  const fulfillmentBadge = getFulfillmentBadge(order.fulfillmentStatus)
                  const finalizationBadge = getFinalizationBadge(order)
                  const isSelected = selectedIds.includes(order.id)

                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-cream/20 transition-colors ${
                        isSelected ? 'bg-gold/5' : ''
                      }`}
                    >
                      <td className="py-4 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(order.id)}
                          className="w-4 h-4 rounded border-borderLight text-forest focus:ring-forest cursor-pointer"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-bold text-forest hover:underline font-mono"
                        >
                          {order.orderNumber}
                        </Link>
                        <span className="text-[10px] text-secondary block mt-0.5">
                          {formatKLDate(order.createdAt)} • {formatKLTime(order.createdAt)}
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
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] border ${finalizationBadge.className}`}
                          title={finalizationBadge.sublabel}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${finalizationBadge.dot}`} />
                          <span>{finalizationBadge.shortLabel}</span>
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
                        <div className="flex items-center justify-end space-x-1.5">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-forest text-warmwhite text-xs font-bold rounded-lg hover:bg-forest-dark transition-colors shadow-xs"
                          >
                            <span>Manage</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setOrderToDelete(order)}
                            className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-lg transition-colors cursor-pointer"
                            title="Padam Pesanan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL (Single Order)                                 */}
      {/* ========================================================================= */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-dark/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-warmwhite rounded-2xl border border-borderLight shadow-2xl max-w-md w-full p-5 sm:p-6 space-y-4 animate-scale-in">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-forest-dark text-base sm:text-lg">
                  Padam Pesanan Ini?
                </h3>
                <p className="text-xs text-secondary">
                  Tindakan ini tidak boleh diundur.
                </p>
              </div>
            </div>

            <div className="bg-cream/60 rounded-xl p-3 text-xs space-y-1.5 border border-borderLight/60">
              <div className="flex justify-between">
                <span className="text-secondary">No. Pesanan:</span>
                <span className="font-mono font-bold text-forest">{orderToDelete.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Pelanggan:</span>
                <span className="font-bold text-forest-dark truncate max-w-[200px]">{orderToDelete.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Jumlah Bayaran:</span>
                <span className="font-bold text-forest-dark">{formatMYR(orderToDelete.totalSen)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Status Bayaran:</span>
                <span className="font-medium capitalize">{orderToDelete.paymentStatus}</span>
              </div>
            </div>

            <p className="text-[11.5px] text-secondary">
              Rekod pesanan ini akan dipadamkan daripada pangkalan data secara kekal. Stok bagi produk pesanan ini akan dikembalikan ke inventori kilang.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setOrderToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-secondary hover:text-charcoal bg-cream/70 hover:bg-cream rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteSingle}
                className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Memadam...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Ya, Padam Pesanan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BULK DELETE CONFIRMATION MODAL                                            */}
      {/* ========================================================================= */}
      {isBulkDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-dark/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-warmwhite rounded-2xl border border-borderLight shadow-2xl max-w-md w-full p-5 sm:p-6 space-y-4 animate-scale-in">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-forest-dark text-base sm:text-lg">
                  Padam {selectedIds.length} Pesanan Terpilih?
                </h3>
                <p className="text-xs text-secondary">
                  Semua rekod pesanan yang dipilih akan dipadam secara kekal.
                </p>
              </div>
            </div>

            <p className="text-[11.5px] text-secondary">
              Adakah anda pasti mahu memadamkan {selectedIds.length} pesanan yang telah dipilih? Sebarang stok bagi produk berkaitan akan dikembalikan ke inventori kilang secara automatik.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setIsBulkDeleting(false)}
                className="px-4 py-2 text-xs font-bold text-secondary hover:text-charcoal bg-cream/70 hover:bg-cream rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleBulkDelete}
                className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Memadam ({selectedIds.length})...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Ya, Padam Semua ({selectedIds.length})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
