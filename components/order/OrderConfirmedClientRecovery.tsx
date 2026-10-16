'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  CheckCircle2,
  Clock,
  Printer,
  Truck,
  ShieldCheck,
  Mail,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react'
import { Order } from '@/types'
import { formatMYR, formatDateTimeMY } from '@/lib/utils/format'
import { PrintButton } from '@/components/order/PrintButton'
import { ClearCartOnSuccess } from '@/components/order/ClearCartOnSuccess'
import { OrderSyncProgressBar } from '@/components/order/OrderSyncProgressBar'

interface Props {
  orderId: string
  paymentId?: string
}

export function OrderConfirmedClientRecovery({ orderId, paymentId }: Props) {
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isManualRefreshing, setIsManualRefreshing] = useState(false)
  const [manualRefreshFeedback, setManualRefreshFeedback] = useState<{
    text: string
    type: 'info' | 'success' | 'error'
  } | null>(null)
  const [lastCheckedTime, setLastCheckedTime] = useState<string | null>(null)

  const handleManualRefresh = async (isSilent = false) => {
    if (isManualRefreshing) return
    setIsManualRefreshing(true)
    if (!isSilent) {
      setManualRefreshFeedback({
        text: 'Menghubungi pelayan Vercel & gerbang bayaran CHIP...',
        type: 'info',
      })
    }

    try {
      let candidateOrder: any = null
      try {
        const raw =
          sessionStorage.getItem(`kamaar_order_snapshot_${orderId}`) ||
          sessionStorage.getItem('kamaar_last_order_snapshot')
        if (raw) candidateOrder = JSON.parse(raw)
      } catch (_) {}

      if (!candidateOrder && typeof document !== 'undefined') {
        try {
          const match =
            document.cookie.match(new RegExp(`(?:^|;\\s*)kamaar_order_${orderId}=([^;]+)`)) ||
            document.cookie.match(/(?:^|;\s*)kamaar_last_order=([^;]+)/)
          if (match && match[1]) {
            const b64 = decodeURIComponent(match[1])
            const decoded = decodeURIComponent(escape(atob(b64)))
            candidateOrder = JSON.parse(decoded)
          }
        } catch (_) {}
      }

      const res = await fetch(`/api/orders/${orderId}/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderSnapshot: candidateOrder,
          paymentId,
        }),
      })

      const data = await res.json()
      const nowStr = new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      setLastCheckedTime(nowStr)

      if (data && data.success && data.order) {
        setOrder(data.order)
        setIsLoading(false)
        if (data.isPaid) {
          setManualRefreshFeedback({
            text: 'Alhamdulillah! Bayaran telah disahkan berjaya. Resit rasmi anda dimuatkan di bawah.',
            type: 'success',
          })
        } else {
          setManualRefreshFeedback({
            text: data.message || 'Pesanan dijumpai, bayaran masih dalam proses perbankan.',
            type: 'info',
          })
        }
      } else {
        if (!isSilent) {
          setManualRefreshFeedback({
            text: data.message || 'Status bayaran belum dikemaskini oleh pihak bank. Sila cuba tekan butang ini semula dalam beberapa saat.',
            type: 'error',
          })
        }
      }
    } catch {
      if (!isSilent) {
        setManualRefreshFeedback({
          text: 'Ralat sambungan rangkaian. Sila tekan butang semak sekali lagi.',
          type: 'error',
        })
      }
    } finally {
      setIsManualRefreshing(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    async function recover() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        let candidateOrder: any = null

        // 1. Check Session Storage snapshot
        try {
          const raw =
            sessionStorage.getItem(`kamaar_order_snapshot_${orderId}`) ||
            sessionStorage.getItem('kamaar_last_order_snapshot')
          if (raw) {
            candidateOrder = JSON.parse(raw)
          }
        } catch (_) {}

        // 2. Check Client Cookies snapshot if not in sessionStorage
        if (!candidateOrder && typeof document !== 'undefined') {
          try {
            const match =
              document.cookie.match(new RegExp(`(?:^|;\\s*)kamaar_order_${orderId}=([^;]+)`)) ||
              document.cookie.match(/(?:^|;\s*)kamaar_last_order=([^;]+)/)
            if (match && match[1]) {
              const b64 = decodeURIComponent(match[1])
              const decoded = decodeURIComponent(escape(atob(b64)))
              candidateOrder = JSON.parse(decoded)
            }
          } catch (_) {}
        }

        // 3. Call recovery API with snapshot and/or paymentId
        const res = await fetch('/api/orders/recover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            order: candidateOrder,
            paymentId,
          }),
        })

        if (res.ok) {
          const data = await res.json()
          if (data && data.order && isMounted) {
            setOrder(data.order)
            setIsLoading(false)
            return
          }
        }

        // 4. Try refresh API directly with CHIP reference search
        try {
          const refreshRes = await fetch(`/api/orders/${orderId}/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderSnapshot: candidateOrder,
              paymentId,
            }),
          })
          if (refreshRes.ok) {
            const refreshData = await refreshRes.json()
            if (refreshData && refreshData.order && isMounted) {
              setOrder(refreshData.order)
              setIsLoading(false)
              return
            }
          }
        } catch (_) {}

        // 5. If recovery endpoint didn't succeed but we have candidateOrder in client memory
        if (candidateOrder && isMounted) {
          setOrder(candidateOrder)
          setIsLoading(false)
          return
        }

        if (isMounted) {
          setIsLoading(false)
          setErrorMessage('Pesanan tidak dapat dikesan secara automatik dalam sesi ini.')
        }
      } catch (err: any) {
        if (isMounted) {
          setIsLoading(false)
          setErrorMessage('Ralat sambungan semasa mendapatkan status pesanan.')
        }
      }
    }

    recover()

    // Gentle auto-poll in background every 4s for first 24s
    const pollTimers = [
      setTimeout(() => handleManualRefresh(true), 3500),
      setTimeout(() => handleManualRefresh(true), 8000),
      setTimeout(() => handleManualRefresh(true), 15000),
      setTimeout(() => handleManualRefresh(true), 24000),
    ]

    return () => {
      isMounted = false
      pollTimers.forEach(clearTimeout)
    }
  }, [orderId, paymentId])

  // Loading Screen
  if (isLoading) {
    return (
      <div className="bg-cream-light py-16 sm:py-24 min-h-[80vh] flex items-center justify-center">
        <div className="bg-warmwhite rounded-3xl p-8 sm:p-12 border border-borderLight shadow-card text-center max-w-md mx-4">
          <div className="w-16 h-16 rounded-full bg-forest/10 text-forest mx-auto flex items-center justify-center mb-6 animate-spin">
            <RefreshCw className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-dark block mb-2">
            PENGESAHAN STATUS BAYARAN
          </span>
          <h2 className="font-serif text-2xl font-bold text-forest mb-3">
            Mengesahkan Pesanan Anda
          </h2>
          <p className="text-xs text-charcoal-muted leading-relaxed">
            Sila tunggu sebentar sementara sistem atelier KAMAAR mengesahkan resit bayaran bersama gerbang perbankan CHIP (FPX / TNG).
          </p>
          <div className="mt-6 pt-4 border-t border-borderLight text-[11px] font-mono text-charcoal-muted">
            ID: {orderId}
          </div>
        </div>
      </div>
    )
  }

  // Not Found / Error Fallback (Replaces ugly 404 with helpful concierge actions)
  if (!order) {
    const waText = encodeURIComponent(
      `Salam KAMAAR Beddings, saya baru sahaja membuat bayaran bagi pesanan nombor: ${orderId}. Boleh bantu saya semak status resit?`
    )
    return (
      <div className="bg-cream-light py-12 sm:py-20 min-h-[80vh] flex items-center justify-center">
        <div className="bg-warmwhite rounded-3xl p-8 sm:p-12 border border-borderLight shadow-card text-center max-w-lg mx-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-dark block mb-2">
            STATUS PESANAN DALAM SEMAKAN
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest mb-3">
            Pesanan Sedang Diproses Kilang
          </h2>

          <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed mb-6">
            Jika anda telah selesai membuat bayaran melalui FPX atau Touch &apos;n Go eWallet, resit rasmi anda selamat dan telah direkodkan. Sila hubungi talian sokongan concierge kami untuk pengesahan segera:
          </p>

          <div className="bg-cream p-4 rounded-xl border border-borderLight text-xs font-mono font-bold text-forest mb-6">
            Rujukan Pesanan: {orderId}
          </div>

          {/* DEDICATED REFRESH PAYMENT STATUS BUTTON (OPTIMIZED FOR VERCEL) */}
          <div className="space-y-3 mb-6 pt-1 text-left sm:text-center">
            <button
              type="button"
              onClick={() => handleManualRefresh(false)}
              disabled={isManualRefreshing}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#0F2D59] via-[#1B4B8A] to-[#0F2D59] hover:from-[#13386D] hover:via-[#225CA8] hover:to-[#13386D] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider rounded-2xl transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] border-2 border-[#E5B54F]/80 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 text-[#FAD02C] ${isManualRefreshing ? 'animate-spin' : ''}`} />
              <span>{isManualRefreshing ? 'Menyemak Status Terkini...' : '🔄 Semak & Muat Semula Status Bayaran'}</span>
            </button>

            {manualRefreshFeedback && (
              <div
                className={`p-3 rounded-xl text-xs text-center border animate-in fade-in duration-200 ${
                  manualRefreshFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                    : manualRefreshFeedback.type === 'error'
                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                    : 'bg-blue-50 text-blue-800 border-blue-200'
                }`}
              >
                <p>{manualRefreshFeedback.text}</p>
                {lastCheckedTime && (
                  <span className="text-[10px] opacity-75 block mt-1 font-mono">
                    Disemak pada: {lastCheckedTime}
                  </span>
                )}
              </div>
            )}

            <p className="text-[11px] text-charcoal-muted leading-relaxed">
              Tekan butang di atas untuk menyegerak dan mengesahkan status transaksi terus dengan gerbang CHIP (FPX / TNG) &amp; pelayan awan Vercel.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`https://wa.me/60194786991?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 bg-forest text-warmwhite text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-forest-dark transition-all inline-flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Hubungi WhatsApp Concierge (019-478 6991)</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 bg-warmwhite border border-borderLight text-forest text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-cream transition-all"
            >
              Kembali Ke Laman Utama
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isPaid = order.paymentStatus === 'paid'

  return (
    <div className="bg-cream-light py-8 sm:py-16 min-h-[85vh] print:bg-white print:py-0 print:min-h-0 print:text-black">
      <ClearCartOnSuccess orderId={order.id} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 print:max-w-none print:px-0 print:mx-0">
        {/* Status Header: Web only (Hidden in Print) */}
        <div className="bg-warmwhite rounded-3xl p-6 sm:p-10 border border-borderLight shadow-card text-center mb-8 print:hidden">
          <div
            className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${
              isPaid ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-700'
            }`}
          >
            {isPaid ? <CheckCircle2 className="w-10 h-10" /> : <Clock className="w-10 h-10" />}
          </div>

          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark block">
            {isPaid ? 'Payment Verified & Confirmed' : 'Payment Awaiting Confirmation'}
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest mt-1">
            {isPaid ? 'Thank You For Your Order' : 'Order Received'}
          </h1>

          <p className="text-sm text-charcoal-muted mt-2 max-w-lg mx-auto">
            {isPaid
              ? `We have confirmed your payment. A formal tax receipt and delivery schedule have been dispatched to ${order.customerEmail}.`
              : 'Your payment attempt is currently being processed by CHIP In Asia (FPX / Touch \'n Go eWallet). Please check back shortly.'}
          </p>

          <div className="mt-6 inline-flex items-center space-x-2 px-4 py-2 bg-cream rounded-full border border-borderLight text-xs font-mono font-bold text-forest">
            <span>Order Number: {order.orderNumber}</span>
          </div>

          {/* Realtime Vercel Cloud Sync Progress & Estimation */}
          <OrderSyncProgressBar
            orderId={order.id}
            orderNumber={order.orderNumber}
            initialIsPaid={isPaid}
          />

          {/* Refresh Payment Status Button when order is awaiting confirmation */}
          {!isPaid && (
            <div className="mt-5 max-w-md mx-auto space-y-2">
              <button
                type="button"
                onClick={() => handleManualRefresh(false)}
                disabled={isManualRefreshing}
                className="w-full py-3.5 px-5 bg-gradient-to-r from-[#0F2D59] via-[#1B4B8A] to-[#0F2D59] hover:from-[#13386D] hover:via-[#225CA8] hover:to-[#13386D] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer border border-[#E5B54F]/70 disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#FAD02C] ${isManualRefreshing ? 'animate-spin' : ''}`} />
                <span>{isManualRefreshing ? 'Menyemak Status...' : '🔄 Semak & Muat Semula Status Bayaran'}</span>
              </button>
              {manualRefreshFeedback && (
                <div
                  className={`p-2.5 rounded-xl text-xs text-center border animate-in fade-in duration-200 ${
                    manualRefreshFeedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                      : manualRefreshFeedback.type === 'error'
                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                      : 'bg-blue-50 text-blue-800 border-blue-200'
                  }`}
                >
                  <p>{manualRefreshFeedback.text}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* OFFICIAL RECEIPT CONTAINER */}
        <div className="bg-warmwhite rounded-3xl p-6 sm:p-10 border border-borderLight shadow-card space-y-6 print:bg-white print:rounded-none print:p-0 print:border-none print:shadow-none print:space-y-4">
          {/* 1. PRINT-ONLY CORPORATE LETTERHEAD */}
          <div className="print-only border-b-2 border-black pb-4 mb-4 page-break-avoid">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3.5">
                <div className="relative w-36 h-12 flex-shrink-0">
                  <Image
                    src="/images/kamaar-logo-clean.png"
                    alt="KAMAAR Beddings"
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </div>
                <div className="text-[10px] leading-tight text-gray-800">
                  <h2 className="font-bold text-sm text-black uppercase tracking-wide">
                    TUNAS SINAR JAYA ENTERPRISE
                  </h2>
                  <p className="font-medium text-gray-700">
                    No. Pendaftaran Perniagaan (SSM): <strong className="font-mono text-black">PG0395419W</strong>
                  </p>
                  <p className="text-gray-600 mt-0.5">
                    No. 7878 B, Jalan Permatang Berangan, Kg Pokok Tampang, 13300 Tasek Gelugor, Pulau Pinang.
                  </p>
                  <p className="text-gray-600 mt-0.5">
                    Tel: 019-478 6991 / 012-421 2119 &bull; Emel: tunassinar@gmail.com &bull; Web: www.kamaarbeddings.com.my
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-black text-white text-[11px] font-bold uppercase tracking-widest rounded-xs">
                  RESIT RASMI / OFFICIAL RECEIPT
                </span>
                <div className="mt-2 text-[10px] space-y-0.5 text-gray-800">
                  <p>
                    <span className="text-gray-500">No. Resit:</span>{' '}
                    <strong className="font-mono text-black text-[11px]">{order.orderNumber}</strong>
                  </p>
                  <p>
                    <span className="text-gray-500">Tarikh:</span>{' '}
                    <strong>{formatDateTimeMY(order.createdAt)}</strong>
                  </p>
                  <p>
                    <span className="text-gray-500">Status:</span>{' '}
                    <strong className="text-emerald-700 uppercase font-bold">
                      {isPaid ? 'PAID / LULUS' : 'MENUNGGU PENGESAHAN'}
                    </strong>
                  </p>
                  <p>
                    <span className="text-gray-500">Gerbang:</span>{' '}
                    <strong>CHIP In Asia (FPX / TNG)</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. WEB-ONLY HEADER (Heading + Print Button) */}
          <div className="flex items-center justify-between pb-4 border-b border-borderLight print:hidden">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-dark block">
                TUNAS SINAR JAYA ENTERPRISE (PG0395419W)
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest">
                Official Purchase Receipt
              </h2>
            </div>
            <PrintButton />
          </div>

          {/* Referral attribution banner if referred by affiliate */}
          {order.affiliateCode && (
            <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs text-emerald-950 print:bg-gray-50 print:border-gray-300 print:text-black">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 print:hidden" />
                <span className="font-medium text-emerald-800 print:text-gray-700">Rujukan Rakan Niaga / Ejen Rasmi KAMAAR:</span>
                <span className="font-mono font-bold bg-white px-2.5 py-0.5 rounded-md border border-emerald-300 text-emerald-900 print:border-gray-400 print:text-black">
                  {order.affiliateCode}
                </span>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold print:hidden">Pesanan Direkod Kepada Ejen</span>
            </div>
          )}

          {/* 3. ORDER TIMELINE STRIP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-cream-light rounded-xl border border-borderLight text-xs print:hidden">
            <div>
              <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Order Placed</span>
              <span className="font-semibold text-charcoal">{formatDateTimeMY(order.createdAt)}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Estimated Dispatch</span>
              <span className="font-semibold text-forest">2 to 4 Working Days (White-Glove Direct Factory)</span>
            </div>
          </div>

          {/* 4. BILLING & SHIPPING ADDRESS SUMMARY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-borderLight bg-cream-light/60 print:bg-white print:border print:border-gray-300 print:p-3 text-xs page-break-avoid">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted print:text-gray-600 block mb-1">
                DIBIL KEPADA (BILLED TO):
              </span>
              <p className="font-bold text-charcoal print:text-black">{order.shippingAddress?.fullName || order.customerName}</p>
              <p className="text-charcoal-muted print:text-gray-700">{order.customerEmail}</p>
              <p className="text-charcoal-muted print:text-gray-700">Tel: {order.customerPhone}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted print:text-gray-600 block mb-1">
                DIHANTAR KEPADA (SHIP TO):
              </span>
              <p className="font-bold text-charcoal print:text-black">{order.shippingAddress?.fullName || order.customerName}</p>
              <p className="text-charcoal-muted print:text-gray-700">{order.shippingAddress?.addressLine1}</p>
              {order.shippingAddress?.addressLine2 && (
                <p className="text-charcoal-muted print:text-gray-700">{order.shippingAddress.addressLine2}</p>
              )}
              <p className="text-charcoal-muted print:text-gray-700">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postcode}
              </p>
              {(order.hasLiftAccess !== undefined || order.deliveryNotes) && (
                <p className="text-[10px] text-charcoal-muted print:text-gray-600 mt-1">
                  Logistik: {order.hasLiftAccess ? 'Lif Ada' : 'Tangga'}
                  {order.floorLevel
                    ? ` (${order.floorLevel.toLowerCase().includes('tingkat') ? order.floorLevel : `Tingkat ${order.floorLevel}`})`
                    : ''}
                  {order.deliveryNotes ? ` • "${order.deliveryNotes}"` : ''}
                </p>
              )}
            </div>
          </div>

          {/* 5. ITEM TABLE */}
          <div className="space-y-2 page-break-avoid">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal print:text-black">
              Senarai Item Pesanan ({order.items?.length || 0})
            </h3>

            <div className="overflow-hidden rounded-xl border border-borderLight print:border print:border-gray-300 bg-warmwhite print:bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-cream print:bg-gray-100 border-b border-borderLight print:border-gray-300 text-[10px] uppercase font-bold text-charcoal print:text-black">
                    <th className="py-2 px-3 w-8 text-center">#</th>
                    <th className="py-2 px-3">Keterangan Produk (Description)</th>
                    <th className="py-2 px-3 text-center w-16">Kuantiti</th>
                    <th className="py-2 px-3 text-right w-28">Harga Seunit</th>
                    <th className="py-2 px-3 text-right w-28">Jumlah (MYR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderLight print:divide-gray-300">
                  {order.items?.map((item, idx) => (
                    <tr key={item.id || idx} className="text-charcoal print:text-black">
                      <td className="py-2.5 px-3 text-center text-charcoal-muted print:text-gray-500 font-mono text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-charcoal print:text-black text-xs sm:text-sm">
                          {item.productName}
                        </div>
                        <div className="text-[11px] text-gold-dark print:text-gray-600 font-medium">
                          Saiz: {item.sizeName} ({item.dimensions})
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-semibold text-xs">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[11px] text-charcoal-muted print:text-gray-700">
                        {formatMYR(item.unitPriceSen)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-xs sm:text-sm text-forest print:text-black">
                        {formatMYR(item.lineTotalSen)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. PRICING TOTALS TABLE */}
          <div className="flex justify-end pt-2 page-break-avoid">
            <div className="w-full sm:w-80 print:w-72 space-y-1.5 text-xs text-charcoal print:text-black">
              <div className="flex justify-between py-1 border-b border-borderLight print:border-gray-200">
                <span className="text-charcoal-muted print:text-gray-600">Jumlah Kecil (Subtotal)</span>
                <span className="font-mono font-semibold">{formatMYR(order.subtotalSen)}</span>
              </div>

              {order.discountSen > 0 && (
                <div className="flex justify-between py-1 border-b border-borderLight print:border-gray-200 text-sale print:text-black">
                  <span>Diskaun ({order.appliedCoupon})</span>
                  <span className="font-mono font-semibold">-{formatMYR(order.discountSen)}</span>
                </div>
              )}

              <div className="flex justify-between py-1 border-b border-borderLight print:border-gray-200">
                <span className="text-charcoal-muted print:text-gray-600">Caj Penghantaran</span>
                <span className="font-mono font-semibold text-forest print:text-black">
                  {order.shippingSen === 0 ? 'PERCUMA' : formatMYR(order.shippingSen)}
                </span>
              </div>

              <div className="flex justify-between py-2 border-t-2 border-forest print:border-black items-baseline">
                <span className="font-serif text-base sm:text-lg font-bold text-forest print:text-black uppercase">
                  JUMLAH DIBAYAR
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-forest print:text-black">
                  {formatMYR(order.totalSen)}
                </span>
              </div>
            </div>
          </div>

          {/* 7. PRINT-ONLY FOOTER */}
          <div className="print-only pt-4 mt-6 border-t-2 border-black text-[10px] text-gray-700 page-break-avoid">
            <div className="flex justify-between items-start gap-6">
              <div className="space-y-1 max-w-md">
                <p className="font-bold text-black uppercase">Terma &amp; Pengesahan Rasmi:</p>
                <p>1. Ini adalah resit janaan komputer yang sah bagi <strong>TUNAS SINAR JAYA ENTERPRISE (PG0395419W)</strong>. Tiada tandatangan fizikal diperlukan.</p>
                <p>2. Barang diproses dan dihantar terus dari kilang KAMAAR Beddings di Tasek Gelugor, Pulau Pinang.</p>
                <p>3. Untuk pertanyaan status penghantaran atau tuntutan jaminan, sila hubungi talian kilang: <strong>019-478 6991</strong>.</p>
              </div>

              <div className="border border-dashed border-gray-500 p-2.5 rounded text-center w-40 bg-gray-50/50 flex-shrink-0">
                <div className="text-[8px] uppercase tracking-wider font-bold text-gray-500">PENGESAHAN BAYARAN</div>
                <div className="text-xs font-mono font-bold text-emerald-800 my-0.5">LULUS / PAID</div>
                <div className="text-[8px] text-gray-600">CHIP IN ASIA GATEWAY</div>
              </div>
            </div>

            <div className="text-center text-[9px] text-gray-500 mt-4 pt-2 border-t border-gray-200">
              KAMAAR BEDDINGS &bull; Menjahit Kepercayaan, Menyulam Masa Depan &bull; www.kamaarbeddings.com.my
            </div>
          </div>

          {/* 8. WEB-ONLY ACTION BUTTONS */}
          <div className="pt-6 border-t border-borderLight flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
            <Link
              href="/collections/mattress"
              className="text-xs font-bold text-forest hover:text-gold-dark underline"
            >
              &larr; Teruskan Membeli-Belah
            </Link>

            <Link
              href="/account"
              className="px-6 py-3 bg-forest text-warmwhite text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-forest-dark transition-colors shadow-sm"
            >
              Lihat Dalam Akaun Saya &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
