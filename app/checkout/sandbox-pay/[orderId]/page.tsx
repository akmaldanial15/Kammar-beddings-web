'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Building2,
  Smartphone,
  QrCode,
  Clock,
  ChevronDown,
  ChevronUp,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Shield,
  HelpCircle,
} from 'lucide-react'
import { Order } from '@/types'
import { formatMYR } from '@/lib/utils/format'
import { KamaarLogo } from '@/components/brand/KamaarLogo'

interface Props {
  params: { orderId: string }
}

const MALAYSIAN_BANKS = [
  { id: 'mb2u', name: 'Maybank2u', shortName: 'Maybank', code: 'MBB', bg: '#FFC800', text: '#000000', popular: true },
  { id: 'cimb', name: 'CIMB Clicks', shortName: 'CIMB', code: 'CIMB', bg: '#ED1B24', text: '#FFFFFF', popular: true },
  { id: 'pbb', name: 'Public Bank', shortName: 'PBe', code: 'PBB', bg: '#D92626', text: '#FFFFFF', popular: true },
  { id: 'rhb', name: 'RHB Now', shortName: 'RHB', code: 'RHB', bg: '#0067B1', text: '#FFFFFF', popular: true },
  { id: 'hlb', name: 'Hong Leong Connect', shortName: 'Hong Leong', code: 'HLB', bg: '#002B49', text: '#FFFFFF', popular: true },
  { id: 'ambank', name: 'AmBank Online', shortName: 'AmBank', code: 'AMB', bg: '#ED1C24', text: '#FFFFFF', popular: true },
  { id: 'bimb', name: 'Bank Islam', shortName: 'Bank Islam', code: 'BIMB', bg: '#A01E28', text: '#FFFFFF', popular: false },
  { id: 'bsn', name: 'myBSN', shortName: 'BSN', code: 'BSN', bg: '#00838F', text: '#FFFFFF', popular: false },
  { id: 'bankrakyat', name: 'i-Rakyat', shortName: 'Bank Rakyat', code: 'BR', bg: '#F15A24', text: '#FFFFFF', popular: false },
  { id: 'affin', name: 'AffinAlways', shortName: 'Affin Bank', code: 'AFF', bg: '#0054A6', text: '#FFFFFF', popular: false },
  { id: 'alliance', name: 'AllianceOnline', shortName: 'Alliance Bank', code: 'ABMB', bg: '#005C9E', text: '#FFFFFF', popular: false },
  { id: 'uob', name: 'UOB Infinity', shortName: 'UOB', code: 'UOB', bg: '#0B2341', text: '#FFFFFF', popular: false },
]

function SandboxPaymentContent({ params }: Props) {
  const { orderId } = params
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialMethod = searchParams.get('method') === 'tng' ? 'tng' : 'fpx'

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [simulating, setSimulating] = useState(false)
  const [simulationStatus, setSimulationStatus] = useState<string | null>(null)

  // Active payment tab
  const [activeTab, setActiveTab] = useState<'fpx' | 'tng'>(initialMethod)

  // Selected Bank for FPX
  const [selectedBankId, setSelectedBankId] = useState('mb2u')

  // Bank simulation modal
  const [isBankModalOpen, setIsBankModalOpen] = useState(false)
  const [bankModalStep, setBankModalStep] = useState<'login' | 'tac' | 'processing'>('login')
  const [tacCode, setTacCode] = useState('684029')
  const [tacRequested, setTacRequested] = useState(false)

  // Order summary accordion
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false)

  // Session timer (15 minutes countdown)
  const [timeLeft, setTimeLeft] = useState(15 * 60)
  // QR timer (5 minutes countdown)
  const [qrTimeLeft, setQrTimeLeft] = useState(5 * 60)

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`)
        if (res.ok) {
          const data = await res.json()
          setOrder(data.order)
        }
      } catch (err) {
        console.error('Failed to load order:', err)
      } finally {
        setLoading(false)
      }
    }
    loadOrder()
  }, [orderId])

  // Countdowns
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
      setQrTimeLeft((prev) => (prev > 0 ? prev - 1 : 300))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const selectedBank = MALAYSIAN_BANKS.find((b) => b.id === selectedBankId) || MALAYSIAN_BANKS[0]

  const handleSimulatePayment = async (status: 'success' | 'fail', method: 'fpx' | 'tng' = activeTab) => {
    setSimulating(true)
    setSimulationStatus(status === 'success' ? 'Memproses pengesahan bayaran...' : 'Membatalkan sesi bayaran...')

    try {
      if (order?.paymentProvider === 'chip' || !order?.paymentProvider || order?.paymentProvider === 'chip_sandbox_simulator') {
        await fetch('/api/webhooks/chip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: status === 'success' ? 'purchase.paid' : 'purchase.failed',
            status: status === 'success' ? 'paid' : 'failed',
            id: `chip_sim_${Date.now()}`,
            reference: orderId,
            order_id: orderId,
            payment_method: method,
            bank: method === 'fpx' ? selectedBank.name : 'Touch n Go eWallet',
          }),
        })
      } else {
        await fetch('/api/webhooks/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: status === 'success' ? 'checkout.session.completed' : 'payment_intent.payment_failed',
            id: `evt_sim_${Date.now()}`,
            orderId,
            data: {
              object: {
                id: `pi_sim_${Date.now()}`,
                metadata: { orderId },
                client_reference_id: orderId,
                amount_received: order?.totalSen,
                currency: 'myr',
              },
            },
          }),
        })
      }

      // Small delay for realistic feel
      setTimeout(() => {
        if (status === 'success') {
          router.push(`/order/confirmed/${orderId}`)
        } else {
          router.push('/checkout?cancelled=true')
        }
      }, 700)
    } catch (err) {
      console.error('Simulation error:', err)
      setSimulating(false)
      setSimulationStatus(null)
    }
  }

  const handleOpenBankModal = () => {
    setBankModalStep('login')
    setTacRequested(false)
    setIsBankModalOpen(true)
  }

  const handleRequestTac = () => {
    setTacRequested(true)
    const newTac = Math.floor(100000 + Math.random() * 900000).toString()
    setTacCode(newTac)
  }

  if (loading) {
    return (
      <div className="py-24 text-center bg-[#FAF8F5] min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-3 border-forest/20 border-t-forest rounded-full animate-spin" />
        <p className="text-sm font-medium text-charcoal-muted">Memuatkan sesi gerbang pembayaran CHIP In Asia...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="py-24 text-center bg-[#FAF8F5] min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
          <XCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-forest">Pesanan Tidak Dijumpai</h2>
        <p className="text-xs text-charcoal-muted mt-1 max-w-sm">
          Sesi pesanan ini mungkin telah luput atau nombor rujukan tidak sah.
        </p>
        <Link
          href="/"
          className="mt-6 px-6 py-2.5 bg-forest text-warmwhite text-xs font-bold rounded-xl shadow-xs hover:bg-forest-dark transition-all"
        >
          Kembali ke Laman Utama
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#1E293B] font-sans antialiased selection:bg-gold/20 selection:text-forest pb-16">
      
      {/* 1. TOP OFFICIAL CHIP SANDBOX ENVIRONMENT BANNER */}
      <div className="bg-[#0B1E38] text-white py-2.5 px-4 text-xs font-sans border-b border-white/10 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold tracking-wide uppercase text-[11px] text-emerald-300">
              CHIP In Asia Sandbox Simulator
            </span>
            <span className="hidden sm:inline text-white/40">•</span>
            <span className="hidden sm:inline text-white/80 text-[11px]">
              Mod Ujian Penuh FPX Online Banking &amp; Touch &apos;n Go eWallet
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-white/60 hidden md:inline">Tindakan Pantas:</span>
            <button
              onClick={() => handleSimulatePayment('success')}
              disabled={simulating}
              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-md shadow-xs transition-all active:scale-95 flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-3 h-3" />
              <span>Lulus Pantas</span>
            </button>
            <button
              onClick={() => handleSimulatePayment('fail')}
              disabled={simulating}
              className="px-2.5 py-1 bg-rose-500/80 hover:bg-rose-600 text-white font-semibold rounded-md transition-all active:scale-95 flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <XCircle className="w-3 h-3" />
              <span>Tolak / Gagal</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-6 sm:pt-8">
        
        {/* 2. CHIP HOSTED CHECKOUT SHELL */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
          
          {/* Header Strip with CHIP & Merchant Logos */}
          <div className="p-6 sm:p-7 bg-gradient-to-r from-[#0F284E] via-[#153B6C] to-[#1C4880] text-white flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-[0.2em] font-extrabold text-gold-light">
                  Collect by CHIP
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-white/10 text-white/90 border border-white/20 font-mono">
                  Sandbox
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>TUNAS SINAR JAYA ENTERPRISE</span>
              </h1>
              <p className="text-xs text-blue-100/80">
                KAMAAR Beddings Official Checkout Portal
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 px-3.5 bg-white rounded-xl shadow-xs flex items-center justify-center border border-white/30">
                <Image
                  src="/images/payments/fpx.svg"
                  alt="FPX Online Banking"
                  width={52}
                  height={18}
                  className="h-4 w-auto object-contain"
                />
              </div>
              <div className="h-10 px-3 bg-white rounded-xl shadow-xs flex items-center justify-center gap-1.5 border border-white/30">
                <Image
                  src="/images/payments/tng-ewallet.svg"
                  alt="Touch 'n Go eWallet"
                  width={22}
                  height={22}
                  className="h-5.5 w-5.5 object-contain"
                />
                <span className="text-[11px] font-bold text-[#015CA9] font-sans">TNG</span>
              </div>
            </div>
          </div>

          {/* Amount & Order Bar */}
          <div className="p-6 sm:p-7 bg-[#FAFBFD] border-b border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block">
                Jumlah Perlu Dibayar (MYR)
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-sans text-3xl sm:text-4xl font-extrabold text-[#0F284E] tracking-tight">
                  {formatMYR(order.totalSen)}
                </span>
                <span className="text-xs text-slate-500 font-medium">MYR Sahaja</span>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700">
                <span>No. Pesanan:</span>
                <strong className="text-[#0F284E]">{order.orderNumber}</strong>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-700">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Sesi Tamat dalam: <strong className="font-mono">{formatTimer(timeLeft)}</strong></span>
              </div>
            </div>
          </div>

          {/* Collapsible Order Breakdown */}
          <div className="border-b border-slate-200/70">
            <button
              type="button"
              onClick={() => setIsOrderSummaryOpen(!isOrderSummaryOpen)}
              className="w-full px-6 sm:px-7 py-3 text-xs font-semibold text-slate-600 hover:text-forest bg-white hover:bg-slate-50/80 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span>Ringkasan Item Pesanan ({order.items.length} item)</span>
                <span className="text-slate-400">• Penerima: {order.customerName}</span>
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span>{isOrderSummaryOpen ? 'Sembunyi' : 'Lihat Butiran'}</span>
                {isOrderSummaryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>

            {isOrderSummaryOpen && (
              <div className="px-6 sm:px-7 py-4 bg-slate-50/70 text-xs space-y-3 border-t border-slate-100">
                <div className="space-y-2 divide-y divide-slate-200/60">
                  {order.items.map((item) => (
                    <div key={item.id} className="pt-2 first:pt-0 flex justify-between items-center">
                      <div>
                        <span className="font-medium text-slate-800">{item.productName}</span>
                        <span className="text-slate-500 block text-[11px]">Saiz: {item.sizeName} &bull; Kuantiti: {item.quantity}</span>
                      </div>
                      <span className="font-bold text-slate-700">{formatMYR(item.lineTotalSen)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-200/70 flex justify-between text-slate-500 text-[11px]">
                  <span>Alamat Penghantaran:</span>
                  <span className="text-right text-slate-700 font-medium max-w-xs">
                    {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postcode}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 3. PAYMENT METHOD TABS (FPX vs TNG) */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Tabs Header */}
            <div>
              <label className="text-xs uppercase tracking-wider text-slate-500 font-bold block mb-3">
                Pilih Kaedah Pembayaran CHIP In Asia:
              </label>
              <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80">
                
                {/* Tab: FPX */}
                <button
                  type="button"
                  onClick={() => setActiveTab('fpx')}
                  className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                    activeTab === 'fpx'
                      ? 'bg-white text-[#0F284E] shadow-sm border border-slate-200/80 scale-[1.01]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <div className="w-5 h-5 rounded-md bg-[#00529C] text-white flex items-center justify-center shrink-0">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <span>FPX Online Banking</span>
                </button>

                {/* Tab: Touch 'n Go eWallet */}
                <button
                  type="button"
                  onClick={() => setActiveTab('tng')}
                  className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                    activeTab === 'tng'
                      ? 'bg-white text-[#015CA9] shadow-sm border border-slate-200/80 scale-[1.01]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <div className="w-5 h-5 rounded-md bg-[#015CA9] text-white flex items-center justify-center shrink-0">
                    <Smartphone className="w-3.5 h-3.5" />
                  </div>
                  <span>Touch &apos;n Go eWallet</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT: FPX ONLINE BANKING */}
            {activeTab === 'fpx' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">Senarai Bank FPX Tersedia:</span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Sistem Normal (24/7)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">Pilih bank anda di bawah</span>
                </div>

                {/* Bank Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {MALAYSIAN_BANKS.map((b) => {
                    const isSelected = b.id === selectedBankId
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBankId(b.id)}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-20 cursor-pointer relative ${
                          isSelected
                            ? 'border-[#0F284E] bg-blue-50/50 ring-2 ring-[#0F284E]/20 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: b.bg, color: b.text }}
                          >
                            {b.code}
                          </span>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-[#0F284E] text-white flex items-center justify-center text-[10px]">
                              ✓
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block truncate leading-tight">
                            {b.name}
                          </span>
                          <span className="text-[9.5px] text-slate-400 block mt-0.5">
                            {b.popular ? 'Paling Kerap Diguna' : 'FPX Direct'}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Primary Bank Payment Action */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <button
                    type="button"
                    onClick={handleOpenBankModal}
                    disabled={simulating}
                    className="w-full py-4 bg-gradient-to-r from-[#0F284E] via-[#153B6C] to-[#0F284E] hover:from-[#153B6C] hover:to-[#1B4880] text-white text-sm font-bold rounded-2xl shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Building2 className="w-4 h-4 text-gold-light" />
                    <span>Buka Portal Perbankan {selectedBank.name} (Simulasi FPX)</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>

                  <p className="text-[11px] text-center text-slate-400">
                    🔒 Anda akan dibawa ke simulasi skrin log masuk rasmi perbankan internet untuk meluluskan bayaran.
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: TOUCH 'N GO EWALLET */}
            {activeTab === 'tng' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="p-6 rounded-2xl bg-[#015CA9]/5 border border-[#015CA9]/20 flex flex-col md:flex-row items-center gap-6">
                  
                  {/* Dynamic Realistic QR Code Box */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-md text-center flex flex-col items-center shrink-0">
                    <div className="relative w-44 h-44 bg-white p-2 rounded-xl border border-slate-100 flex items-center justify-center overflow-hidden">
                      
                      {/* Realistic simulated QR pattern */}
                      <div className="w-full h-full bg-[radial-gradient(#015CA9_2px,transparent_2px)] [background-size:8px_8px] rounded-lg relative flex items-center justify-center">
                        {/* Center TNG Badge */}
                        <div className="w-12 h-12 bg-white rounded-xl shadow-md border border-[#015CA9]/30 flex items-center justify-center z-10">
                          <Image
                            src="/images/payments/tng-ewallet.svg"
                            alt="TNG eWallet"
                            width={32}
                            height={32}
                            className="w-8 h-8 object-contain"
                          />
                        </div>

                        {/* Scanner Laser Animation */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#015CA9] to-transparent animate-pulse shadow-sm" />
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center gap-1.5 text-xs font-mono text-[#015CA9] font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Tamat QR: {formatTimer(qrTimeLeft)}</span>
                    </div>
                  </div>

                  {/* Step-by-Step Instructions */}
                  <div className="space-y-3 flex-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#015CA9] uppercase tracking-wider bg-[#015CA9]/10 px-2.5 py-0.5 rounded-full border border-[#015CA9]/20">
                        Langkah Bayaran TNG eWallet
                      </span>
                    </div>

                    <ol className="space-y-2 text-slate-600 list-decimal list-inside leading-relaxed">
                      <li>Buka aplikasi <strong>Touch &apos;n Go eWallet</strong> pada telefon bimbit anda.</li>
                      <li>Tekan ikon <strong>&ldquo;Scan&rdquo;</strong> di laman utama dan imbas kod QR di sebelah.</li>
                      <li>Sahkan amaun bayaran <strong>{formatMYR(order.totalSen)}</strong> dan masukkan PIN 6-digit.</li>
                    </ol>

                    <div className="pt-2 flex flex-col sm:flex-row gap-2">
                      <button
                        type="button"
                        onClick={() => handleSimulatePayment('success', 'tng')}
                        disabled={simulating}
                        className="py-3 px-4 bg-[#015CA9] hover:bg-[#004c8c] text-white font-bold text-xs rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Simulasi Imbas &amp; Bayar Dalam App (Lulus Segera)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSimulatePayment('fail', 'tng')}
                        disabled={simulating}
                        className="py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50"
                      >
                        <span>Simulasi Gagal / Batal</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. FOOTER CONTROLS & CANCEL */}
            <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <Link
                href="/checkout?cancelled=true"
                className="text-slate-500 hover:text-slate-800 underline underline-offset-4 transition-colors font-medium"
              >
                &larr; Batalkan Pesanan &amp; Kembali ke Troli
              </Link>

              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Enkripsi 256-Bit SSL &bull; Patuh Standard PayNet &amp; BNM</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5. REALISTIC FPX INTERNET BANKING MODAL (DEMO SIMULATION)                 */}
      {/* ========================================================================= */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Bank Header */}
            <div
              className="p-5 text-white flex items-center justify-between"
              style={{ backgroundColor: selectedBank.bg, color: selectedBank.text }}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-black/10 flex items-center justify-center font-black text-xs">
                  {selectedBank.code}
                </span>
                <div>
                  <h3 className="font-bold text-sm leading-tight">{selectedBank.name}</h3>
                  <span className="text-[10px] opacity-80 block">Gerbang Pembayaran FPX Malaysia</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsBankModalOpen(false)}
                className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs text-slate-700">
              
              {/* Payment Info Strip */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Penerima Bayaran</span>
                  <strong className="text-slate-800 text-xs">TUNAS SINAR JAYA (KAMAAR)</strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Jumlah</span>
                  <strong className="text-sm font-bold text-[#0F284E]">{formatMYR(order.totalSen)}</strong>
                </div>
              </div>

              {/* Step 1: Login Form Simulation */}
              {bankModalStep === 'login' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 block text-xs">ID Pengguna (Demo Username):</label>
                    <input
                      type="text"
                      readOnly
                      value="kamaar_tester"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs text-slate-700 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 block text-xs">Kata Laluan (Demo Password):</label>
                    <input
                      type="password"
                      readOnly
                      value="password123456"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs text-slate-700 outline-none"
                    />
                  </div>

                  <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/60 text-[11px] text-blue-900 leading-relaxed">
                    💡 <em>Maklumat demo telah diisi secara automatik untuk ujian pantas. Sila tekan &ldquo;Log Masuk ke Bank&rdquo; untuk meneruskan pengesahan TAC.</em>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsBankModalOpen(false)}
                      className="px-4 py-2.5 text-slate-500 hover:text-slate-800 font-medium transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={() => setBankModalStep('tac')}
                      className="px-5 py-2.5 bg-[#0F284E] hover:bg-[#153B6C] text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Log Masuk ke Bank</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: TAC / Approval Simulation */}
              {bankModalStep === 'tac' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Pilihan Akaun Debit</span>
                    <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs">
                      <div>
                        <strong className="block text-slate-800">Akaun Simpanan-i</strong>
                        <span className="text-slate-400 font-mono text-[11px]">1580 **** 4920</span>
                      </div>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                        Baki Cukup
                      </span>
                    </div>
                  </div>

                  {/* TAC / OTP Generator Box */}
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-950 text-xs">Pengesahan TAC / OTP:</span>
                      <button
                        type="button"
                        onClick={handleRequestTac}
                        className="px-2.5 py-1 bg-amber-200/80 hover:bg-amber-300 text-amber-900 rounded-lg font-bold text-[10px] transition-colors cursor-pointer"
                      >
                        {tacRequested ? 'Jana Semula TAC' : 'Mohon TAC (Demo)'}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={tacCode}
                        className="w-full text-center tracking-[0.4em] font-mono font-bold text-base py-2 bg-white rounded-xl border border-amber-300 text-amber-950"
                      />
                    </div>
                    <p className="text-[10.5px] text-amber-800">
                      Kod 6-digit TAC di atas dijana secara automatik untuk meluluskan bayaran FPX.
                    </p>
                  </div>

                  {/* Final Decision Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsBankModalOpen(false)
                        handleSimulatePayment('success', 'fpx')
                      }}
                      disabled={simulating}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Sahkan &amp; Bayar (Luluskan FPX)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsBankModalOpen(false)
                        handleSimulatePayment('fail', 'fpx')
                      }}
                      disabled={simulating}
                      className="py-3 px-4 bg-slate-100 hover:bg-rose-50 text-rose-700 font-bold text-xs rounded-xl transition-all cursor-pointer active:scale-95"
                    >
                      <span>Tolak Bayaran</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Security Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-[10.5px] text-center text-slate-400 flex items-center justify-center gap-2">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Sesi ini dilindungi oleh PayNet Financial Process Exchange (FPX) Secure Gateway</span>
            </div>

          </div>
        </div>
      )}

      {/* Loading Overlay while webhook is processing */}
      {simulating && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-3">
          <div className="w-12 h-12 border-3 border-white/20 border-t-gold rounded-full animate-spin" />
          <p className="text-sm font-bold tracking-wide">{simulationStatus || 'Memproses simulasi transaksi...'}</p>
          <span className="text-xs text-white/70">Menghubungi webhook CHIP In Asia...</span>
        </div>
      )}

    </div>
  )
}

export default function SandboxPaymentPage(props: Props) {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center bg-[#FAF8F5] min-h-screen flex items-center justify-center">
          <p className="text-charcoal-muted text-sm animate-pulse">Memuatkan sesi sandbox pembayaran...</p>
        </div>
      }
    >
      <SandboxPaymentContent {...props} />
    </Suspense>
  )
}
