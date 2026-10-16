'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw, CheckCircle2, Clock, ShieldCheck, Sparkles } from 'lucide-react'

interface Props {
  orderId: string
  paymentId?: string
  initialIsPaid?: boolean
  className?: string
}

export function RefreshPaymentStatusButton({
  orderId,
  paymentId,
  initialIsPaid = false,
  className = '',
}: Props) {
  const router = useRouter()
  const [isPaid, setIsPaid] = useState(initialIsPaid)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [feedback, setFeedback] = useState<{ text: string; type: 'info' | 'success' | 'error' } | null>(null)
  const [lastChecked, setLastChecked] = useState<string | null>(null)

  const handleRefresh = async (isAuto = false) => {
    if (isRefreshing) return
    setIsRefreshing(true)
    if (!isAuto) {
      setFeedback({ text: 'Menyemak status bayaran dengan pelayan Vercel & gerbang CHIP...', type: 'info' })
    }

    try {
      // Gather client snapshot if available
      let candidateOrder: any = null
      try {
        const raw =
          sessionStorage.getItem(`kamaar_order_snapshot_${orderId}`) ||
          sessionStorage.getItem('kamaar_last_order_snapshot')
        if (raw) candidateOrder = JSON.parse(raw)
      } catch (_) {}

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
      setLastChecked(nowStr)

      if (data && data.success) {
        if (data.isPaid) {
          setIsPaid(true)
          setFeedback({
            text: 'Alhamdulillah! Bayaran telah disahkan berjaya.',
            type: 'success',
          })
          router.refresh()
        } else {
          setFeedback({
            text: data.message || 'Status bayaran masih dalam proses perbankan. Sila tunggu beberapa saat.',
            type: 'info',
          })
        }
      } else {
        setFeedback({
          text: data.message || 'Belum menerima maklum balas gerbang. Sila tekan butang sekali lagi.',
          type: 'error',
        })
      }
    } catch {
      setFeedback({
        text: 'Ralat sambungan rangkaian. Sila cuba tekan semula butang semak.',
        type: 'error',
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  // Automatic gentle polling for unpaid orders (runs 3 times at 3s, 8s, 15s)
  useEffect(() => {
    if (isPaid) return

    const timers = [
      setTimeout(() => handleRefresh(true), 3000),
      setTimeout(() => handleRefresh(true), 8000),
      setTimeout(() => handleRefresh(true), 15000),
    ]

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [isPaid, orderId])

  // If already verified as paid, show quick confirmed indicator with manual re-sync option
  if (isPaid) {
    return (
      <div className={`inline-flex items-center gap-2 pt-2 ${className}`}>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Status: Bayaran Disahkan</span>
        </span>
        <button
          type="button"
          onClick={() => handleRefresh(false)}
          disabled={isRefreshing}
          className="text-[11px] text-charcoal-muted hover:text-forest underline transition-colors cursor-pointer flex items-center gap-1"
          title="Muat semula status pesanan"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Semak Semula</span>
        </button>
      </div>
    )
  }

  return (
    <div className={`w-full max-w-md mx-auto my-4 space-y-2.5 ${className}`}>
      <button
        type="button"
        onClick={() => handleRefresh(false)}
        disabled={isRefreshing}
        className="group relative w-full py-3.5 px-5 bg-gradient-to-r from-[#0F2D59] via-[#1B4B8A] to-[#0F2D59] hover:from-[#13386D] hover:via-[#225CA8] hover:to-[#13386D] text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] border border-[#E5B54F]/70 disabled:opacity-60 cursor-pointer overflow-hidden flex items-center justify-center gap-2.5"
      >
        <RefreshCw className={`w-4 h-4 text-[#FAD02C] ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
        <span className="text-xs sm:text-sm font-bold tracking-wide">
          {isRefreshing ? 'Menyemak Status Terkini...' : '🔄 Muat Semula Status Bayaran'}
        </span>
      </button>

      {feedback && (
        <div
          className={`p-2.5 rounded-xl text-xs text-center border animate-in fade-in duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
              : feedback.type === 'error'
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-blue-50 text-blue-800 border-blue-200'
          }`}
        >
          <p>{feedback.text}</p>
          {lastChecked && (
            <span className="text-[10px] opacity-75 block mt-0.5 font-mono">
              Disemak pada: {lastChecked}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
