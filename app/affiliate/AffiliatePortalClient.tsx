'use client'

import React, { useState } from 'react'
import { Affiliate } from '@/types'
import { formatMYR, formatKLDate, formatKLTime } from '@/lib/utils/format'
import {
  Crown,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Percent,
  Share2,
  Copy,
  Check,
  MessageSquare,
  LogOut,
  Building2,
  ExternalLink,
  QrCode,
  Sparkles,
  ShieldCheck,
  Send,
  Calendar,
  AlertCircle,
  Package,
  Trash2,
  Lock,
  Unlock,
  KeyRound,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SafeOrder {
  id: string
  orderNumber: string
  createdAt: string
  subtotalSen: number
  totalSen: number
  paymentStatus: string
  fulfillmentStatus: string
  affiliateCommissionSen: number
  itemCount: number
  itemsSummary: string
}

interface Props {
  affiliate: Affiliate
  initialOrders: SafeOrder[]
  initialIsAdmin?: boolean
}

export function AffiliatePortalClient({ affiliate, initialOrders, initialIsAdmin = false }: Props) {
  const router = useRouter()
  const [orders, setOrders] = useState<SafeOrder[]>(initialOrders)
  const [currentAffiliate, setCurrentAffiliate] = useState<Affiliate>(affiliate)
  const [isAdmin, setIsAdmin] = useState<boolean>(initialIsAdmin)
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null)
  const [isClearingAll, setIsClearingAll] = useState(false)
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Admin Unlock Modal State
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [adminEmail, setAdminEmail] = useState('danial@kamaar.my')
  const [adminSecretKey, setAdminSecretKey] = useState('')
  const [isVerifyingAdmin, setIsVerifyingAdmin] = useState(false)
  const [adminModalError, setAdminModalError] = useState('')

  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const [showQr, setShowQr] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://kamaar.my'
  const referralUrl = `${origin}/?ref=${encodeURIComponent(currentAffiliate.code)}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentAffiliate.code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
    if (
      !window.confirm(
        `Adakah anda pasti ingin memadam pesanan "${orderNumber}"?\n\nNilai jualan dan komisen ejen akan dikira semula secara automatik.`
      )
    ) {
      return
    }

    setIsDeletingId(orderId)
    setActionFeedback(null)

    try {
      const res = await fetch(`/api/admin/affiliates/${affiliate.id}/orders`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setOrders(data.orders || [])
        if (data.affiliate) {
          setCurrentAffiliate(data.affiliate)
        }
        setActionFeedback({ type: 'success', message: `Pesanan ${orderNumber} berjaya dipadam.` })
        setTimeout(() => setActionFeedback(null), 4000)
      } else {
        setActionFeedback({ type: 'error', message: data.error || 'Gagal memadam pesanan.' })
      }
    } catch (err: any) {
      setActionFeedback({ type: 'error', message: err.message || 'Ralat sambungan pelayan.' })
    } finally {
      setIsDeletingId(null)
    }
  }

  const handleClearAllOrders = async () => {
    if (
      !window.confirm(
        `PERHATIAN PENTADBIR:\n\nAdakah anda pasti ingin memadam KESEMUA ${orders.length} pesanan rujukan untuk ejen ini?\n\nStatistik jualan dan komisen akan diset semula ke 0. Tindakan ini tidak boleh diundur.`
      )
    ) {
      return
    }

    setIsClearingAll(true)
    setActionFeedback(null)

    try {
      const res = await fetch(`/api/admin/affiliates/${affiliate.id}/orders`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clearAll: true }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setOrders([])
        if (data.affiliate) {
          setCurrentAffiliate(data.affiliate)
        }
        setActionFeedback({
          type: 'success',
          message: data.message || 'Semua rekod pesanan rujukan berjaya dipadam.',
        })
        setTimeout(() => setActionFeedback(null), 4000)
      } else {
        setActionFeedback({ type: 'error', message: data.error || 'Gagal memadam semua pesanan.' })
      }
    } catch (err: any) {
      setActionFeedback({ type: 'error', message: err.message || 'Ralat sambungan pelayan.' })
    } finally {
      setIsClearingAll(false)
    }
  }

  const handleVerifyAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifyingAdmin(true)
    setAdminModalError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: adminEmail.trim(),
          secretKey: adminSecretKey.trim(),
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setIsAdmin(true)
        setShowAdminModal(false)
        setAdminSecretKey('')
        setActionFeedback({
          type: 'success',
          message: 'Akses Pentadbir disahkan! Pilihan padam rekod kini diaktifkan.',
        })
        setTimeout(() => setActionFeedback(null), 4000)
      } else {
        setAdminModalError(data.error || 'Pengesahan gagal. Sila semak kunci keselamatan atau emel.')
      }
    } catch (err: any) {
      setAdminModalError(err.message || 'Ralat sambungan pelayan.')
    } finally {
      setIsVerifyingAdmin(false)
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch('/api/affiliate/logout', { method: 'POST' })
      router.push('/affiliate/login')
      router.refresh()
    } catch {
      router.push('/affiliate/login')
    }
  }

  // Pre-formatted messages for social share
  const shareText = encodeURIComponent(
    `Hai! Nikmati tidur mewah taraf hotel 5-bintang dengan tilam & bantal KAMAAR Beddings Malaysia. Gunakan pautan rujukan khas saya untuk keistimewaan penghantaran percuma & waranti 10 tahun:\n${referralUrl}`
  )
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent('Dapatkan tilam premium KAMAAR Beddings dengan tawaran istimewa')}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`

  // QR Code URL using free reliable QR server API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(referralUrl)}&color=30-78-140`

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-[#0A192F] pb-24">
      {/* TOP LUXURY APP BAR */}
      <header className="bg-[#13325B] text-white border-b border-[#B49A58]/20 sticky top-0 z-40 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E4E8C] to-[#2A6DB5] border border-[#B49A58]/40 flex items-center justify-center shadow-md">
              <Crown className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-bold">
                  KAMAAR BEDDINGS
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  VIP AGENT
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Portal Komisen Rakan Niaga
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center space-x-1.5 text-xs text-neutral-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10"
            >
              <span>Lihat Kedai</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center space-x-1.5 text-xs font-semibold text-rose-300 hover:text-rose-100 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO GREETING & STATUS BANNER */}
      <div className="bg-gradient-to-r from-[#13325B] via-[#1E4E8C] to-[#13325B] text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-[#B49A58]/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#D4AF37] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Selamat Kembali ke Atelier Rakan Niaga
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
                {affiliate.name}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 mt-1 flex flex-wrap items-center gap-2">
                <span>Kod Rujukan Anda:</span>
                <span className="font-mono font-bold text-[#D4AF37] bg-white/10 px-2 py-0.5 rounded-md">
                  {affiliate.code}
                </span>
                <span>• Status:</span>
                <span className="text-emerald-400 font-semibold">Aktif</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#B49A58] to-[#D4AF37] text-[#0A192F] font-bold text-xs sm:text-sm shadow-md hover:brightness-105 transition-all flex items-center gap-2 cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Pautan Disalin!' : 'Salin Pautan Affiliate'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 1. TOP 4 METRICS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Commission */}
          <div className="bg-white rounded-2xl p-5 border border-borderLight shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
                Jumlah Komisen
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-700 font-mono">
              {formatMYR(currentAffiliate.totalCommissionSen || 0)}
            </div>
            <p className="text-[11px] text-charcoal-muted mt-1">
              Pendapatan bersih hasil jualan anda
            </p>
          </div>

          {/* Total Sales Value */}
          <div className="bg-white rounded-2xl p-5 border border-borderLight shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
                Jumlah Nilai Jualan
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#1E4E8C]/10 text-[#1E4E8C] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#1E4E8C] font-mono">
              {formatMYR(currentAffiliate.totalSalesRevenueSen || 0)}
            </div>
            <p className="text-[11px] text-charcoal-muted mt-1">
              Nilai kasar pembelian oleh pelanggan anda
            </p>
          </div>

          {/* Successful Orders */}
          <div className="bg-white rounded-2xl p-5 border border-borderLight shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
                Pesanan Berjaya
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-charcoal font-mono">
              {currentAffiliate.totalSalesCount || 0}
            </div>
            <p className="text-[11px] text-charcoal-muted mt-1">
              Tempahan disahkan melalui kod anda
            </p>
          </div>

          {/* Commission Rate */}
          <div className="bg-white rounded-2xl p-5 border border-borderLight shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
                Kadar Komisen
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-indigo-700 font-mono">
              {currentAffiliate.commissionType === 'percentage'
                ? `${currentAffiliate.commissionRate}%`
                : formatMYR(currentAffiliate.commissionRate * 100)}
            </div>
            <p className="text-[11px] text-charcoal-muted mt-1">
              {currentAffiliate.commissionType === 'percentage' ? 'Per peratusan nilai tilam' : 'Kadar tetap per pesanan'}
            </p>
          </div>
        </div>

        {/* 2. ADMIN NOTES & MESSAGES (THE USER'S PRIMARY REQUEST!) */}
        <div className="bg-gradient-to-br from-[#1E4E8C] to-[#13325B] rounded-3xl p-6 sm:p-8 text-white border border-[#B49A58]/30 shadow-lg relative overflow-hidden">
          {/* Subtle gold emblem backdrop */}
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-[#B49A58]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#B49A58]/20 border border-[#B49A58]/40 flex items-center justify-center text-[#D4AF37]">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                    SALURAN KOMUNIKASI RASMI
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                    Mesej & Nota Terkini Daripada Pentadbir
                  </h3>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/10 text-neutral-200 border border-white/15">
                Kemas Kini Langsung
              </span>
            </div>

            {/* Note Content Box */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-sm sm:text-base leading-relaxed text-neutral-100 backdrop-blur-sm">
              {affiliate.adminNotes ? (
                <div className="space-y-2">
                  <p className="whitespace-pre-line font-medium text-white/95">
                    {affiliate.adminNotes}
                  </p>
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                    <span>Dihantar oleh: <strong>Pengurusan KAMAAR Beddings</strong></span>
                    <span className="text-[11px] text-[#D4AF37]">Status: Disahkan</span>
                  </div>
                </div>
              ) : (
                <div className="py-2 text-center text-neutral-300 text-sm">
                  <p>Tiada nota peribadi baharu daripada pentadbir buat masa ini.</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Akaun anda berada dalam keadaan aktif & baik. Sebarang makluman pembayaran atau pengumuman kempen jualan akan dipaparkan di sini.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. SHARING SUITE & TOOLS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-borderLight shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-[#B49A58] font-bold">
                Alatan Promosi Ejen
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">
                Pusat Perkongsian Pautan Rujukan
              </h3>
            </div>
            <button
              onClick={() => setShowQr(!showQr)}
              className="px-3.5 py-1.5 rounded-xl border border-borderLight hover:bg-neutral-50 text-xs font-semibold text-charcoal flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-[#1E4E8C]" />
              <span>{showQr ? 'Tutup Kod QR' : 'Tunjuk Kod QR'}</span>
            </button>
          </div>

          {/* Quick Copy Link Box */}
          <div className="bg-[#F8FAFC] border border-borderLight rounded-2xl p-4 sm:p-5 space-y-3">
            <label className="text-xs font-bold text-charcoal block">
              Pautan Rujukan Unik Anda (Automatik Jejak Pesanan 30 Hari)
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                readOnly
                value={referralUrl}
                className="w-full px-4 py-3 bg-white border border-borderLight rounded-xl text-xs sm:text-sm font-mono text-charcoal select-all focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-6 py-3 bg-[#1E4E8C] hover:bg-[#2A6DB5] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer shadow-sm"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Disalin!' : 'Salin Pautan'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-charcoal-muted pt-1">
              <span>
                Kod Kupon / Rujukan Manual: <strong className="font-mono text-[#1E4E8C]">{affiliate.code}</strong>
              </span>
              <button
                onClick={handleCopyCode}
                className="text-xs font-semibold text-[#1E4E8C] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Kod Disalin!' : 'Salin Kod'}</span>
              </button>
            </div>
          </div>

          {/* QR Code expansion modal/view */}
          {showQr && (
            <div className="p-6 bg-cream/40 border border-[#B49A58]/30 rounded-2xl text-center space-y-3 animate-in fade-in">
              <span className="text-xs font-bold text-charcoal uppercase tracking-wider block">
                Kod QR Pautan Rujukan Anda
              </span>
              <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
                Tunjukkan kod QR ini kepada pelanggan atau kenalan untuk mereka imbas terus menggunakan kamera telefon bimbit.
              </p>
              <div className="inline-block p-4 bg-white rounded-2xl shadow-md border border-borderLight">
                <img
                  src={qrCodeUrl}
                  alt={`QR Code for ${affiliate.code}`}
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <p className="font-mono text-xs text-charcoal font-bold">{affiliate.code}</p>
            </div>
          )}

          {/* 1-Click Social Media Sharing Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-charcoal block">Kongsi Pantas Ke Media Sosial:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4 text-emerald-600" />
                <span>Kongsi ke WhatsApp</span>
              </a>

              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4 text-sky-600" />
                <span>Kongsi ke Telegram</span>
              </a>

              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-blue-600" />
                <span>Kongsi ke Facebook</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4. RECENT ORDERS TIED TO THIS AGENT */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-borderLight shadow-sm space-y-5">
          {actionFeedback && (
            <div
              className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-between ${
                actionFeedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border-rose-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {actionFeedback.type === 'success' ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{actionFeedback.message}</span>
              </div>
              <button
                onClick={() => setActionFeedback(null)}
                className="text-neutral-500 hover:text-neutral-800 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#B49A58] font-bold">
                Rekod Transaksi
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">
                  Sejarah Pesanan & Komisen Dirujuk
                </h3>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mod Pentadbir Aktif</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs text-charcoal-muted font-medium bg-neutral-100 px-3 py-1.5 rounded-xl border border-neutral-200">
                Jumlah: <strong>{orders.length}</strong> Pesanan
              </span>

              {isAdmin ? (
                orders.length > 0 && (
                  <button
                    onClick={handleClearAllOrders}
                    disabled={isClearingAll}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50 hover:scale-[1.02]"
                    title="Padam semua pesanan rujukan dan kosongkan rekod komisen ejen ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isClearingAll ? 'Memadam...' : 'Padam Semua Rekod'}</span>
                  </button>
                )
              ) : (
                <button
                  onClick={() => setShowAdminModal(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-50 hover:bg-[#1E4E8C]/10 text-[#1E4E8C] border border-[#1E4E8C]/30 transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Buka akses pengurusan admin untuk memadam rekod pesanan"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#B49A58]" />
                  <span>Akses Admin (Padam Rekod)</span>
                </button>
              )}
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="py-12 text-center text-charcoal-muted border-2 border-dashed border-borderLight rounded-2xl">
              <Package className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm font-medium">Belum ada pesanan yang direkodkan melalui pautan ini.</p>
              <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                Kongsikan pautan rujukan anda sekarang kepada bakal pembeli untuk mula mengumpul komisen jualan!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-borderLight bg-neutral-50/50 text-charcoal-muted font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">No. Pesanan</th>
                    <th className="py-3 px-4">Tarikh & Masa</th>
                    <th className="py-3 px-4">Ringkasan Item</th>
                    <th className="py-3 px-4 text-right">Nilai Jualan</th>
                    <th className="py-3 px-4 text-right">Komisen Anda</th>
                    <th className="py-3 px-4 text-center">Status Bayaran</th>
                    {isAdmin && (
                      <th className="py-3 px-4 text-center">Tindakan Admin</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderLight">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#1E4E8C]">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-charcoal block">
                          {formatKLDate(ord.createdAt)}
                        </span>
                        <span className="text-[11px] font-mono text-neutral-500 block mt-0.5">
                          {formatKLTime(ord.createdAt)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs text-charcoal truncate" title={ord.itemsSummary}>
                        {ord.itemsSummary || `${ord.itemCount} item`}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-charcoal font-semibold">
                        {formatMYR(ord.totalSen)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700">
                        {formatMYR(ord.affiliateCommissionSen)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            ord.paymentStatus === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteOrder(ord.id, ord.orderNumber)}
                            disabled={isDeletingId === ord.id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 hover:border-rose-300 transition-all cursor-pointer disabled:opacity-50 hover:scale-[1.02]"
                            title={`Padam pesanan ${ord.orderNumber} ini`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{isDeletingId === ord.id ? 'Memadam...' : 'Padam'}</span>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 5. BANK ACCOUNT & PAYOUT DESTINATION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-borderLight shadow-sm space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#1E4E8C]/10 text-[#1E4E8C] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal">
                Maklumat Pindahan Bank Untuk Bayaran Komisen
              </h3>
              <p className="text-xs text-charcoal-muted">
                Semua pembayaran komisen dijadualkan dan didepositkan terus ke akaun berikut.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-neutral-50 rounded-2xl border border-borderLight">
              <span className="text-[11px] text-charcoal-muted uppercase tracking-wider block font-semibold">
                Nama Bank
              </span>
              <span className="text-sm font-bold text-charcoal mt-1 block">
                {affiliate.bankName || 'Maybank'}
              </span>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-borderLight">
              <span className="text-[11px] text-charcoal-muted uppercase tracking-wider block font-semibold">
                Nombor Akaun Bank
              </span>
              <span className="text-sm font-mono font-bold text-[#1E4E8C] mt-1 block">
                {affiliate.bankAccountNumber || '-'}
              </span>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-borderLight">
              <span className="text-[11px] text-charcoal-muted uppercase tracking-wider block font-semibold">
                Nama Pemegang Berdaftar
              </span>
              <span className="text-sm font-bold text-charcoal mt-1 block">
                {affiliate.name}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-neutral-400 italic">
            * Sekiranya anda perlu menukar butiran perbankan anda, sila maklumkan pihak pengurusan KAMAAR Beddings melalui emel atau WhatsApp sokongan.
          </p>
        </div>

        {/* PORTAL FOOTER */}
        <footer className="pt-8 pb-4 text-center text-xs text-neutral-400 space-y-1">
          <p className="font-medium text-neutral-500">
            KAMAAR Beddings Malaysia Atelier • Portal Komisen Ejen Berdaftar
          </p>
          <p className="text-[11px] text-neutral-400">
            Sebarang pertanyaan berkaitan pengiraan komisen atau penyata jualan, sila hubungi pengurusan atelier KAMAAR.
          </p>
        </footer>
      </main>

      {/* Quick Admin Verification Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-borderLight animate-in fade-in zoom-in-95 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-borderLight">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-charcoal">Akses Pentadbir (Admin)</h3>
                  <p className="text-xs text-charcoal-muted">Sahkan identiti untuk memadam senarai pesanan rujukan</p>
                </div>
              </div>
              <button
                onClick={() => setShowAdminModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-charcoal cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {adminModalError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{adminModalError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Emel Kakitangan / Pentadbir</label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-borderLight rounded-xl text-xs text-charcoal focus:bg-white focus:outline-none focus:border-[#1E4E8C]"
                  placeholder="admin@kamaar.my"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Kunci Keselamatan (Passkey)</label>
                <input
                  type="password"
                  required
                  value={adminSecretKey}
                  onChange={(e) => setAdminSecretKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-borderLight rounded-xl text-xs text-charcoal focus:bg-white focus:outline-none focus:border-[#1E4E8C]"
                  placeholder="Masukkan kata laluan pentadbir..."
                />
                <span className="text-[10.5px] text-neutral-400 block mt-1">
                  Kunci laluan utama: <code>kamaar_admin_2026</code> / <code>admin</code>
                </span>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isVerifyingAdmin}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1E4E8C] hover:bg-[#2A6DB5] text-white shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isVerifyingAdmin ? 'Mengesahkan...' : 'Sahkan & Buka Pilihan Padam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
