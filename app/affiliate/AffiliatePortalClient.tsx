'use client'

import React, { useState } from 'react'
import { Affiliate } from '@/types'
import { formatMYR, formatKLDate } from '@/lib/utils/format'
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
}

export function AffiliatePortalClient({ affiliate, initialOrders }: Props) {
  const router = useRouter()
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const [showQr, setShowQr] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://kamaar.my'
  const referralUrl = `${origin}/?ref=${encodeURIComponent(affiliate.code)}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(affiliate.code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
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
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(referralUrl)}&color=10-42-78`

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-[#0A192F] pb-24">
      {/* TOP LUXURY APP BAR */}
      <header className="bg-[#0B1E3B] text-white border-b border-[#B49A58]/20 sticky top-0 z-40 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#102A4E] to-[#1e467d] border border-[#B49A58]/40 flex items-center justify-center shadow-md">
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
      <div className="bg-gradient-to-r from-[#0B1E3B] via-[#102A4E] to-[#0B1E3B] text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#B49A58]/20 relative">
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#D4AF37] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Selamat Kembali ke Atelier Rakan Niaga
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white mt-1">
                {affiliate.name}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 mt-1">
                Kod Rujukan Anda: <span className="font-mono font-bold text-[#D4AF37] bg-white/10 px-2 py-0.5 rounded-md">{affiliate.code}</span> • Status: <span className="text-emerald-400 font-semibold">Aktif</span>
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-8">
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
              {formatMYR(affiliate.totalCommissionSen || 0)}
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
              <div className="w-8 h-8 rounded-lg bg-[#102A4E]/10 text-[#102A4E] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#102A4E] font-mono">
              {formatMYR(affiliate.totalSalesRevenueSen || 0)}
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
              {affiliate.totalSalesCount || 0}
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
              {affiliate.commissionType === 'percentage'
                ? `${affiliate.commissionRate}%`
                : formatMYR(affiliate.commissionRate * 100)}
            </div>
            <p className="text-[11px] text-charcoal-muted mt-1">
              {affiliate.commissionType === 'percentage' ? 'Per peratusan nilai tilam' : 'Kadar tetap per pesanan'}
            </p>
          </div>
        </div>

        {/* 2. ADMIN NOTES & MESSAGES (THE USER'S PRIMARY REQUEST!) */}
        <div className="bg-gradient-to-br from-[#102A4E] to-[#0A1A32] rounded-3xl p-6 sm:p-8 text-white border border-[#B49A58]/30 shadow-lg relative overflow-hidden">
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
              <QrCode className="w-3.5 h-3.5 text-[#102A4E]" />
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
                className="px-6 py-3 bg-[#102A4E] hover:bg-[#163660] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer shadow-sm"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Disalin!' : 'Salin Pautan'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-charcoal-muted pt-1">
              <span>
                Kod Kupon / Rujukan Manual: <strong className="font-mono text-[#102A4E]">{affiliate.code}</strong>
              </span>
              <button
                onClick={handleCopyCode}
                className="text-xs font-semibold text-[#102A4E] hover:underline flex items-center gap-1 cursor-pointer"
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
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#B49A58] font-bold">
                Rekod Transaksi
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">
                Sejarah Pesanan & Komisen Dirujuk
              </h3>
            </div>
            <span className="text-xs text-charcoal-muted font-medium">
              Jumlah: {initialOrders.length} Pesanan
            </span>
          </div>

          {initialOrders.length === 0 ? (
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
                    <th className="py-3 px-4">Tarikh</th>
                    <th className="py-3 px-4">Ringkasan Item</th>
                    <th className="py-3 px-4 text-right">Nilai Jualan</th>
                    <th className="py-3 px-4 text-right">Komisen Anda</th>
                    <th className="py-3 px-4 text-center">Status Bayaran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderLight">
                  {initialOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#102A4E]">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3.5 px-4 text-charcoal-muted whitespace-nowrap">
                        {formatKLDate(ord.createdAt)}
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
            <div className="w-9 h-9 rounded-xl bg-[#102A4E]/10 text-[#102A4E] flex items-center justify-center">
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
              <span className="text-sm font-mono font-bold text-[#102A4E] mt-1 block">
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
      </main>
    </div>
  )
}
