'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  CreditCard,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
  Sparkles,
  Zap,
  Globe,
  Settings2,
  HelpCircle,
  ExternalLink,
  Save,
  X,
  Lock,
  Layers,
  Building2,
  QrCode,
  SlidersHorizontal,
} from 'lucide-react'
import { PaymentSettings, PaymentMethodConfig, PaymentProviderType } from '@/types'

interface PaymentsClientProps {
  initialSettings: PaymentSettings
}

const ALL_BADGE_OPTIONS = [
  { id: 'visa', label: 'Visa' },
  { id: 'mastercard', label: 'Mastercard' },
  { id: 'amex', label: 'Amex' },
  { id: 'fpx', label: 'FPX Online Banking' },
  { id: 'atome', label: 'Atome BNPL' },
  { id: 'tng', label: "Touch 'n Go eWallet" },
  { id: 'grabpay', label: 'GrabPay' },
  { id: 'boost', label: 'Boost' },
  { id: 'duitnow', label: 'DuitNow QR' },
  { id: 'bank', label: 'Bank Transfer' },
]

const PRESET_TEMPLATES: {
  title: string
  subtitle: string
  providerType: PaymentProviderType
  badgeIcons: string[]
  description: string
  instructions: string
  installmentMonths?: number
}[] = [
  {
    title: 'Credit card (Kad Kredit / Debit)',
    subtitle: 'Visa, Mastercard & American Express',
    providerType: 'credit_card',
    badgeIcons: ['visa', 'mastercard', 'amex'],
    description: 'All transactions are secure and encrypted. Dilindungi dengan protokol penyulitan 256-bit SSL.',
    instructions: 'Masukkan butiran kad kredit atau debit anda untuk proses pembayaran segera yang selamat.',
  },
  {
    title: 'Atome PayLater - 3 easy payments, 0% interest',
    subtitle: 'Bayar 3 kali ansuran bulanan tanpa sebarang caj faedah (0% APR)',
    providerType: 'atome_bnpl',
    badgeIcons: ['atome', 'visa', 'mastercard', 'amex'],
    installmentMonths: 3,
    description: 'Pecahkan jumlah bil anda kepada 3 ansuran bulanan mudah tanpa caj faedah tersembunyi. Bayaran pertama ditolak hari ini.',
    instructions: 'Pelan ansuran 0% faedah. Pengesahan segera tanpa kad kredit diperlukan.',
  },
  {
    title: 'Payex (FPX Online Banking & Kad)',
    subtitle: 'FPX Perbankan Internet Malaysia, Kad & DuitNow',
    providerType: 'payex',
    badgeIcons: ['visa', 'mastercard', 'fpx'],
    description: 'Gerbang pembayaran rasmi yang menyokong FPX Perbankan Internet Malaysia dan kad kredit/debit.',
    instructions: 'Pilih bank tempatan anda di skrin seterusnya untuk log masuk ke perbankan internet anda.',
  },
  {
    title: 'ADAPTIS Payment Gateway (formerly eGHL)',
    subtitle: 'FPX Malaysia, Touch n Go, GrabPay, Boost',
    providerType: 'eghl',
    badgeIcons: ['visa', 'mastercard', 'fpx', 'tng', 'grabpay', 'boost'],
    description: 'Bayar melalui FPX Maybank2u, CIMB Clicks, Public Bank, RHB, Hong Leong atau e-Wallet pilihan anda.',
    instructions: 'Pilih e-Wallet atau perbankan internet anda melalui gerbang ADAPTIS (eGHL) yang selamat.',
  },
  {
    title: 'DuitNow QR & Pindahan Bank Manual',
    subtitle: 'Imbas Kod QR DuitNow atau pindahan akaun Maybank rasmi KAMAAR',
    providerType: 'duitnow_qr',
    badgeIcons: ['duitnow', 'fpx'],
    description: 'Pindahan dana terus ke akaun bank korporat KAMAAR Beddings tanpa sebarang caj tambahan.',
    instructions: 'Maybank KAMAAR BEDDINGS SDN BHD: 5123 4567 8901. Sila simpan resit transaksi untuk pengesahan concierge.',
  },
  {
    title: 'Bayar Waktu Pemasangan (COD / Showroom Balance)',
    subtitle: 'Bayar baki semasa penghantaran tilam oleh tim atelier',
    providerType: 'cod',
    badgeIcons: ['bank'],
    description: 'Bayar baki pesanan secara tunai atau DuitNow pindahan bank semasa juruteknik KAMAAR memasang tilam di bilik tidur anda.',
    instructions: 'Bayaran penuh atau baki perlu diselesaikan sebaik sahaja tilam selesai dipasang dan disemak.',
  },
]

export function PaymentsClient({ initialSettings }: PaymentsClientProps) {
  const [settings, setSettings] = useState<PaymentSettings>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState<PaymentMethodConfig | null>(null)

  // Method Form State
  const [methodForm, setMethodForm] = useState<Partial<PaymentMethodConfig>>({
    name: '',
    subtitle: '',
    providerType: 'credit_card',
    enabled: true,
    isDefault: false,
    testMode: true,
    badgeIcons: ['visa', 'mastercard'],
    description: '',
    instructions: '',
    installmentMonths: 3,
    config: {
      bankName: '',
      accountName: '',
      accountNumber: '',
      merchantId: '',
      apiKey: '',
    },
  })

  // Open modal for adding new method
  const handleAddNew = () => {
    setEditingMethod(null)
    setMethodForm({
      id: `pay-${Date.now()}`,
      name: '',
      subtitle: '',
      providerType: 'credit_card',
      enabled: true,
      isDefault: false,
      testMode: true,
      sortOrder: settings.methods.length + 1,
      badgeIcons: ['visa', 'mastercard'],
      description: 'All transactions are secure and encrypted.',
      instructions: '',
      installmentMonths: 3,
      config: {
        bankName: '',
        accountName: '',
        accountNumber: '',
      },
    })
    setIsModalOpen(true)
  }

  // Open modal for editing existing method
  const handleEdit = (method: PaymentMethodConfig) => {
    setEditingMethod(method)
    setMethodForm({
      ...method,
      config: method.config || {
        bankName: '',
        accountName: '',
        accountNumber: '',
      },
    })
    setIsModalOpen(true)
  }

  // Apply a template to the form
  const applyTemplate = (tpl: typeof PRESET_TEMPLATES[0]) => {
    setMethodForm((prev) => ({
      ...prev,
      name: tpl.title,
      subtitle: tpl.subtitle,
      providerType: tpl.providerType,
      badgeIcons: tpl.badgeIcons,
      description: tpl.description,
      instructions: tpl.instructions,
      installmentMonths: tpl.installmentMonths || 3,
    }))
  }

  // Toggle enable/disable
  const handleToggle = async (id: string, currentEnabled: boolean) => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_enabled',
          id,
          enabled: !currentEnabled,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setSettings(data.paymentSettings)
        setFeedback({
          text: `Kaedah pembayaran telah ${!currentEnabled ? 'diaktifkan' : 'dimatikan'}.`,
          type: 'success',
        })
      } else {
        setFeedback({ text: data.error || 'Gagal mengubah status kaedah.', type: 'error' })
      }
    } catch {
      setFeedback({ text: 'Ralat sambungan rangkaian.', type: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  // Set default method
  const handleSetDefault = async (id: string) => {
    setIsSaving(true)
    try {
      const updatedMethods = settings.methods.map((m) => ({
        ...m,
        isDefault: m.id === id,
      }))
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_settings',
          settings: {
            ...settings,
            defaultMethodId: id,
            methods: updatedMethods,
          },
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setSettings(data.paymentSettings)
        setFeedback({ text: 'Kaedah pembayaran lalai telah dikemas kini.', type: 'success' })
      }
    } catch {
      setFeedback({ text: 'Ralat mengubah kaedah lalai.', type: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  // Reorder methods
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === settings.methods.length - 1) return

    const newMethods = [...settings.methods]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    const [moved] = newMethods.splice(index, 1)
    newMethods.splice(targetIndex, 0, moved)

    const orderedIds = newMethods.map((m) => m.id)

    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reorder',
          orderedIds,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setSettings(data.paymentSettings)
      }
    } catch {
      setFeedback({ text: 'Ralat menyusun kaedah pembayaran.', type: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  // Delete method
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Adakah anda pasti mahu memadamkan kaedah pembayaran "${name}"?`)) {
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch(`/api/admin/payments?id=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setSettings(data.paymentSettings)
        setFeedback({ text: `Kaedah "${name}" berjaya dipadamkan.`, type: 'success' })
      } else {
        setFeedback({ text: data.error || 'Gagal memadam kaedah.', type: 'error' })
      }
    } catch {
      setFeedback({ text: 'Ralat sambungan rangkaian.', type: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  // Save Modal Form (Add or Edit)
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!methodForm.name || !methodForm.name.trim()) {
      alert('Sila masukkan nama kaedah pembayaran.')
      return
    }

    setIsSaving(true)
    try {
      const methodToSave: PaymentMethodConfig = {
        id: methodForm.id || `pay-${Date.now()}`,
        name: methodForm.name.trim(),
        subtitle: methodForm.subtitle?.trim() || '',
        providerType: methodForm.providerType || 'custom',
        enabled: Boolean(methodForm.enabled),
        isDefault: Boolean(methodForm.isDefault),
        testMode: Boolean(methodForm.testMode),
        sortOrder: methodForm.sortOrder || settings.methods.length + 1,
        badgeIcons: methodForm.badgeIcons || ['visa', 'mastercard'],
        description: methodForm.description?.trim() || '',
        instructions: methodForm.instructions?.trim() || '',
        installmentMonths: Number(methodForm.installmentMonths) || 3,
        config: methodForm.config || {},
      }

      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_method',
          method: methodToSave,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSettings(data.paymentSettings)
        setIsModalOpen(false)
        setFeedback({
          text: `Kaedah pembayaran "${methodToSave.name}" telah disimpan.`,
          type: 'success',
        })
      } else {
        setFeedback({ text: data.error || 'Gagal menyimpan kaedah pembayaran.', type: 'error' })
      }
    } catch {
      setFeedback({ text: 'Ralat rangkaian semasa menyimpan.', type: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  // Update Express Checkout Toggle
  const handleToggleExpress = async (field: 'expressCheckoutEnabled' | 'enableGooglePay' | 'enableApplePay') => {
    const newSettings = {
      ...settings,
      [field]: !settings[field],
    }
    setSettings(newSettings)
    try {
      await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_settings',
          settings: newSettings,
        }),
      })
      setFeedback({ text: 'Tetapan Express Checkout dikemas kini.', type: 'success' })
    } catch {
      setFeedback({ text: 'Ralat menyimpan tetapan.', type: 'error' })
    }
  }

  const activeCount = settings.methods.filter((m) => m.enabled).length

  return (
    <div className="space-y-6">
      {/* Top Feedback Notification */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-semibold animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/70 border border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            {feedback.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-[11px] underline opacity-80 hover:opacity-100 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Main Page Title Header */}
      <div className="bg-warmwhite p-5 sm:p-7 rounded-3xl border border-borderLight shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-1">
            <CreditCard className="w-3.5 h-3.5 text-gold" />
            <span>KAMAAR Payment Atelier</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
            Pengurusan Kaedah Pembayaran (Payment Settings)
          </h1>
          <p className="text-xs text-charcoal-muted mt-1 leading-relaxed max-w-2xl">
            Tambah, buang, hidupkan atau susun kaedah bayaran yang dipaparkan kepada pelanggan di halaman Checkout (gaya Getha &amp; Shopify Malaysia).
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Link
            href="/checkout"
            target="_blank"
            className="px-4 py-2.5 rounded-xl border border-borderLight hover:bg-cream text-forest text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <span>Uji Checkout Awam</span>
            <ExternalLink className="w-3.5 h-3.5 text-gold" />
          </Link>

          <button
            type="button"
            onClick={handleAddNew}
            className="px-5 py-2.5 bg-[#1E4E8C] hover:bg-[#13325B] text-warmwhite text-xs font-bold rounded-xl transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-gold" />
            <span>Tambah Kaedah Bayaran</span>
          </button>
        </div>
      </div>

      {/* Global Express Checkout Bar Settings */}
      <div className="bg-warmwhite p-5 sm:p-6 rounded-3xl border border-borderLight shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-borderLight pb-3">
          <div className="flex items-center space-x-2.5">
            <Zap className="w-4 h-4 text-gold" />
            <h2 className="font-serif text-base font-bold text-forest">
              Express Checkout (1-Klik Pantas)
            </h2>
          </div>
          <span className="text-[11px] text-charcoal-muted">
            Dipaparkan di bahagian atas sebelum borang alamat
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-cream/30 border border-borderLight/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-forest block">Aktifkan Express Checkout</span>
              <span className="text-[10px] text-charcoal-muted block">Papar bar butang pantas</span>
            </div>
            <button
              type="button"
              onClick={() => handleToggleExpress('expressCheckoutEnabled')}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.expressCheckoutEnabled ? 'bg-forest' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform absolute top-1 ${
                  settings.expressCheckoutEnabled ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-cream/30 border border-borderLight/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-forest block">Google Pay (G Pay)</span>
              <span className="text-[10px] text-charcoal-muted block">Butang hitam Google Pay</span>
            </div>
            <button
              type="button"
              disabled={!settings.expressCheckoutEnabled}
              onClick={() => handleToggleExpress('enableGooglePay')}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer disabled:opacity-40 ${
                settings.enableGooglePay && settings.expressCheckoutEnabled ? 'bg-forest' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform absolute top-1 ${
                  settings.enableGooglePay && settings.expressCheckoutEnabled ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-cream/30 border border-borderLight/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-forest block">Apple Pay</span>
              <span className="text-[10px] text-charcoal-muted block">Pengguna Safari &amp; iOS</span>
            </div>
            <button
              type="button"
              disabled={!settings.expressCheckoutEnabled}
              onClick={() => handleToggleExpress('enableApplePay')}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer disabled:opacity-40 ${
                settings.enableApplePay && settings.expressCheckoutEnabled ? 'bg-forest' : 'bg-neutral-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform absolute top-1 ${
                  settings.enableApplePay && settings.expressCheckoutEnabled ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Main List of Payment Methods */}
      <div className="bg-warmwhite p-5 sm:p-7 rounded-3xl border border-borderLight shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-borderLight pb-4">
          <div className="flex items-center space-x-2.5">
            <SlidersHorizontal className="w-4 h-4 text-gold" />
            <h2 className="font-serif text-lg font-bold text-forest">
              Senarai Pilihan Kaedah Pembayaran di Checkout
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gold/15 text-gold-dark border border-gold/30">
              {activeCount} Aktif
            </span>
          </div>

          <span className="text-xs text-charcoal-muted">
            Gunakan anak panah <span className="font-mono font-bold">↑ ↓</span> untuk menyusun turutan pilihan di checkout.
          </span>
        </div>

        {settings.methods.length === 0 ? (
          <div className="text-center py-12 bg-cream/30 rounded-2xl border border-dashed border-borderLight space-y-3">
            <CreditCard className="w-10 h-10 text-gold/60 mx-auto" />
            <h3 className="font-serif text-base font-bold text-forest">
              Tiada kaedah pembayaran dikonfigurasi
            </h3>
            <p className="text-xs text-charcoal-muted max-w-md mx-auto">
              Sila klik butang di bawah untuk menambah kaedah seperti Kad Kredit, Atome PayLater, atau FPX.
            </p>
            <button
              type="button"
              onClick={handleAddNew}
              className="px-5 py-2.5 bg-forest text-warmwhite text-xs font-bold rounded-xl hover:bg-forest-dark transition-all cursor-pointer inline-flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4 text-gold" />
              <span>Tambah Kaedah Pertama</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {settings.methods.map((method, index) => {
              const isDefault = method.isDefault || settings.defaultMethodId === method.id

              return (
                <div
                  key={method.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    method.enabled
                      ? 'bg-cream-light/40 border-borderLight hover:border-gold/50 shadow-xs'
                      : 'bg-neutral-100/60 border-neutral-200 opacity-60'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Reorder Controls + Info */}
                    <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                      {/* Sort Reorder Buttons */}
                      <div className="flex flex-col space-y-1 shrink-0 pt-0.5">
                        <button
                          type="button"
                          disabled={index === 0 || isSaving}
                          onClick={() => handleMove(index, 'up')}
                          className="p-1.5 rounded-lg bg-warmwhite border border-borderLight hover:bg-cream text-forest disabled:opacity-30 disabled:hover:bg-warmwhite cursor-pointer transition-colors"
                          title="Gerak ke atas"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === settings.methods.length - 1 || isSaving}
                          onClick={() => handleMove(index, 'down')}
                          className="p-1.5 rounded-lg bg-warmwhite border border-borderLight hover:bg-cream text-forest disabled:opacity-30 disabled:hover:bg-warmwhite cursor-pointer transition-colors"
                          title="Gerak ke bawah"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Main Title, Badges & Provider */}
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-serif text-sm sm:text-base font-bold text-forest">
                            {method.name}
                          </span>

                          {isDefault && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gold/20 text-gold-dark border border-gold/40 flex items-center space-x-1">
                              <span>⭐</span>
                              <span>Pilihan Lalai</span>
                            </span>
                          )}

                          {method.testMode && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                              Mod Sandbox
                            </span>
                          )}

                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-neutral-200/80 text-neutral-700">
                            {method.providerType.replace('_', ' ')}
                          </span>
                        </div>

                        {method.subtitle && (
                          <p className="text-xs text-charcoal font-medium truncate">
                            {method.subtitle}
                          </p>
                        )}

                        {method.description && (
                          <p className="text-[11px] text-charcoal-muted line-clamp-1">
                            {method.description}
                          </p>
                        )}

                        {/* Badges/Logos list */}
                        {method.badgeIcons && method.badgeIcons.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[10px] text-charcoal-muted">Ikon dipaparkan:</span>
                            {method.badgeIcons.map((b) => (
                              <span
                                key={b}
                                className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-warmwhite border border-borderLight text-forest rounded"
                              >
                                {b}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions, Toggle, Edit, Delete */}
                    <div className="flex items-center justify-between lg:justify-end space-x-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-borderLight/60">
                      {/* Set Default Button */}
                      {!isDefault && method.enabled && (
                        <button
                          type="button"
                          onClick={() => handleSetDefault(method.id)}
                          className="px-2.5 py-1.5 text-[11px] font-semibold text-charcoal hover:text-forest bg-warmwhite hover:bg-cream border border-borderLight rounded-xl transition-colors cursor-pointer"
                        >
                          Jadikan Lalai
                        </button>
                      )}

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleEdit(method)}
                        className="px-3 py-1.5 text-xs font-bold text-forest bg-warmwhite hover:bg-gold/15 border border-borderLight rounded-xl transition-colors cursor-pointer flex items-center space-x-1"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-gold" />
                        <span>Sunting</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDelete(method.id, method.name)}
                        className="p-1.5 text-sale hover:bg-sale/10 rounded-xl transition-colors cursor-pointer"
                        title="Padam Kaedah"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Quick Enable/Disable Switch */}
                      <div className="flex items-center space-x-2 pl-2 border-l border-borderLight">
                        <button
                          type="button"
                          onClick={() => handleToggle(method.id, method.enabled)}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                            method.enabled ? 'bg-forest' : 'bg-neutral-300'
                          }`}
                          title={method.enabled ? 'Klik untuk matikan' : 'Klik untuk aktifkan'}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform absolute top-1 ${
                              method.enabled ? 'right-1' : 'left-1'
                            }`}
                          />
                        </button>
                        <span className="text-[11px] font-bold text-forest">
                          {method.enabled ? 'Aktif' : 'Tutup'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* POPUP MODAL: Add / Edit Payment Method */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-warmwhite w-full max-w-2xl rounded-3xl border border-borderLight shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-borderLight flex items-center justify-between bg-cream/30">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-forest/10 text-forest flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-forest">
                    {editingMethod ? 'Sunting Kaedah Pembayaran' : 'Tambah Kaedah Pembayaran Baharu'}
                  </h3>
                  <span className="text-xs text-charcoal-muted">
                    Konfigurasi nama, lencana logo, arahan, dan mod operasi.
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Scrollable Body */}
            <form onSubmit={handleSaveModal} className="overflow-y-auto p-5 sm:p-6 space-y-5 text-xs flex-1">
              {/* Presets template picker (only for new methods) */}
              {!editingMethod && (
                <div className="p-4 rounded-2xl bg-cream border border-borderLight space-y-2">
                  <span className="font-bold text-forest block">
                    ⚡ Pilih Templat Pantas (Optional Presets):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PRESET_TEMPLATES.map((tpl) => (
                      <button
                        key={tpl.title}
                        type="button"
                        onClick={() => applyTemplate(tpl)}
                        className="p-2 text-left bg-warmwhite hover:bg-gold/15 rounded-xl border border-borderLight transition-all cursor-pointer"
                      >
                        <span className="font-bold text-[11px] text-forest block truncate">
                          {tpl.title.split('(')[0]}
                        </span>
                        <span className="text-[10px] text-charcoal-muted block truncate">
                          {tpl.providerType}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-charcoal mb-1">
                    Nama Kaedah Pembayaran *
                  </label>
                  <input
                    type="text"
                    required
                    value={methodForm.name || ''}
                    onChange={(e) => setMethodForm({ ...methodForm, name: e.target.value })}
                    placeholder="Contoh: Credit card atau Atome PayLater"
                    className="w-full px-3.5 py-2.5 bg-cream-light border border-borderLight rounded-xl font-bold text-forest outline-none focus:border-forest"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-charcoal mb-1">
                    Teks Penerangan Ringkas (Subtitle)
                  </label>
                  <input
                    type="text"
                    value={methodForm.subtitle || ''}
                    onChange={(e) => setMethodForm({ ...methodForm, subtitle: e.target.value })}
                    placeholder="Contoh: Visa, Mastercard atau 3 easy payments, 0% interest"
                    className="w-full px-3.5 py-2.5 bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">
                    Jenis Pembekal / Gateway
                  </label>
                  <select
                    value={methodForm.providerType || 'credit_card'}
                    onChange={(e) =>
                      setMethodForm({ ...methodForm, providerType: e.target.value as PaymentProviderType })
                    }
                    className="w-full px-3.5 py-2.5 bg-cream-light border border-borderLight rounded-xl font-medium outline-none focus:border-forest"
                  >
                    <option value="credit_card">Credit / Debit Card (Stripe / Gateway)</option>
                    <option value="atome_bnpl">Atome PayLater (Buy Now Pay Later)</option>
                    <option value="payex">Payex (FPX Online Banking &amp; Kad)</option>
                    <option value="eghl">ADAPTIS / eGHL (FPX, eWallet, Cards)</option>
                    <option value="duitnow_qr">DuitNow QR &amp; Bank Transfer Manual</option>
                    <option value="cod">Cash On Delivery / Bayar Waktu Pasang</option>
                    <option value="custom">Gerbang Pembayaran Khas (Custom)</option>
                  </select>
                </div>

                {methodForm.providerType === 'atome_bnpl' && (
                  <div>
                    <label className="block font-bold text-charcoal mb-1">
                      Tempoh Ansuran (Bulan)
                    </label>
                    <input
                      type="number"
                      min={2}
                      max={12}
                      value={methodForm.installmentMonths || 3}
                      onChange={(e) =>
                        setMethodForm({ ...methodForm, installmentMonths: parseInt(e.target.value) || 3 })
                      }
                      className="w-full px-3.5 py-2.5 bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest font-mono"
                    />
                  </div>
                )}

                {/* Badge Icons Selection */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-charcoal mb-1.5">
                    Pilih Logo / Lencana yang Dipaparkan:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ALL_BADGE_OPTIONS.map((badge) => {
                      const isSelected = (methodForm.badgeIcons || []).includes(badge.id)
                      return (
                        <label
                          key={badge.id}
                          className={`p-2.5 rounded-xl border flex items-center space-x-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-forest/10 border-forest text-forest font-bold'
                              : 'bg-cream-light/60 border-borderLight text-charcoal hover:bg-cream'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              const current = methodForm.badgeIcons || []
                              if (e.target.checked) {
                                setMethodForm({ ...methodForm, badgeIcons: [...current, badge.id] })
                              } else {
                                setMethodForm({
                                  ...methodForm,
                                  badgeIcons: current.filter((b) => b !== badge.id),
                                })
                              }
                            }}
                            className="w-4 h-4 accent-forest"
                          />
                          <span className="text-[11px]">{badge.label}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* Description & Customer Instructions */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-charcoal mb-1">
                    Penerangan Keselamatan / Maklumat (Description)
                  </label>
                  <textarea
                    rows={2}
                    value={methodForm.description || ''}
                    onChange={(e) => setMethodForm({ ...methodForm, description: e.target.value })}
                    placeholder="Contoh: All transactions are secure and encrypted. Dilindungi dengan SSL 256-bit."
                    className="w-full px-3.5 py-2.5 bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest leading-relaxed text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-charcoal mb-1">
                    Arahan Tambahan Kepada Pelanggan (Customer Instructions)
                  </label>
                  <textarea
                    rows={2}
                    value={methodForm.instructions || ''}
                    onChange={(e) => setMethodForm({ ...methodForm, instructions: e.target.value })}
                    placeholder="Contoh: Masukkan butiran kad kredit atau debit anda untuk pembayaran segera."
                    className="w-full px-3.5 py-2.5 bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest leading-relaxed text-xs"
                  />
                </div>

                {/* Bank account fields if manual/duitnow */}
                {(methodForm.providerType === 'duitnow_qr' || methodForm.providerType === 'custom') && (
                  <>
                    <div>
                      <label className="block font-bold text-charcoal mb-1">
                        Nama Bank
                      </label>
                      <input
                        type="text"
                        value={methodForm.config?.bankName || ''}
                        onChange={(e) =>
                          setMethodForm({
                            ...methodForm,
                            config: { ...methodForm.config, bankName: e.target.value },
                          })
                        }
                        placeholder="Contoh: Maybank Berhad"
                        className="w-full px-3.5 py-2.5 bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-charcoal mb-1">
                        Nombor Akaun Bank
                      </label>
                      <input
                        type="text"
                        value={methodForm.config?.accountNumber || ''}
                        onChange={(e) =>
                          setMethodForm({
                            ...methodForm,
                            config: { ...methodForm.config, accountNumber: e.target.value },
                          })
                        }
                        placeholder="Contoh: 5123 4567 8901"
                        className="w-full px-3.5 py-2.5 bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest font-mono"
                      />
                    </div>
                  </>
                )}

                {/* Toggles */}
                <div className="sm:col-span-2 pt-2 border-t border-borderLight grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center space-x-2 cursor-pointer p-2.5 rounded-xl bg-cream-light border border-borderLight">
                    <input
                      type="checkbox"
                      checked={Boolean(methodForm.enabled)}
                      onChange={(e) => setMethodForm({ ...methodForm, enabled: e.target.checked })}
                      className="w-4 h-4 accent-forest"
                    />
                    <span className="font-bold text-forest">Aktifkan Kaedah Ini</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer p-2.5 rounded-xl bg-cream-light border border-borderLight">
                    <input
                      type="checkbox"
                      checked={Boolean(methodForm.testMode)}
                      onChange={(e) => setMethodForm({ ...methodForm, testMode: e.target.checked })}
                      className="w-4 h-4 accent-forest"
                    />
                    <span className="font-bold text-amber-900">Mod Ujian (Sandbox)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer p-2.5 rounded-xl bg-cream-light border border-borderLight">
                    <input
                      type="checkbox"
                      checked={Boolean(methodForm.isDefault)}
                      onChange={(e) => setMethodForm({ ...methodForm, isDefault: e.target.checked })}
                      className="w-4 h-4 accent-forest"
                    />
                    <span className="font-bold text-gold-dark">Jadikan Pilihan Lalai</span>
                  </label>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-borderLight flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-borderLight hover:bg-neutral-100 text-charcoal font-semibold cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-forest hover:bg-forest-dark text-warmwhite font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer flex items-center space-x-2"
                >
                  <Save className="w-4 h-4 text-gold" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Kaedah Pembayaran'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
