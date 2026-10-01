'use client'

import React, { useState } from 'react'
import { Affiliate } from '@/types'
import { formatMYR } from '@/lib/utils/format'
import {
  Users,
  Plus,
  Share2,
  Copy,
  Check,
  TrendingUp,
  DollarSign,
  Search,
  ExternalLink,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  X,
  Edit2,
  Trash2,
  MessageSquare,
  KeyRound,
  Sparkles,
  BellRing,
  RotateCcw,
} from 'lucide-react'
import Link from 'next/link'

interface Props {
  initialAffiliates: Affiliate[]
}

const MALAYSIAN_BANKS = [
  'Maybank',
  'CIMB Bank',
  'Public Bank',
  'RHB Bank',
  'Hong Leong Bank',
  'AmBank',
  'Bank Islam',
  'Bank Muamalat',
  'BSN',
  'Alliance Bank',
  'Affin Bank',
  'OCBC Bank',
  'HSBC Bank',
  'Standard Chartered',
  'UOB Malaysia',
]

export function AffiliatesClient({ initialAffiliates }: Props) {
  const [affiliates, setAffiliates] = useState<Affiliate[]>(initialAffiliates)
  const [search, setSearch] = useState('')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // New affiliate form state
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [bankName, setBankName] = useState('Maybank')
  const [bankAccountNumber, setBankAccountNumber] = useState('')
  const [commissionRate, setCommissionRate] = useState(10)
  const [newAdminNotes, setNewAdminNotes] = useState('')
  const [newAccessKey, setNewAccessKey] = useState('')

  // Note Modal State (For Admin sending direct notes to affiliate)
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null)
  const [noteText, setNoteText] = useState('')
  const [accessKeyText, setAccessKeyText] = useState('')
  const [isSavingNote, setIsSavingNote] = useState(false)
  const [noteSaveSuccess, setNoteSaveSuccess] = useState(false)

  // Reset Password Modal State (Admin direct reset + Pending request handler)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [resetTargetAffiliate, setResetTargetAffiliate] = useState<Affiliate | null>(null)
  const [newPasscode, setNewPasscode] = useState('')
  const [resetNote, setResetNote] = useState('')
  const [isResetting, setIsResetting] = useState(false)
  const [resetToastMessage, setResetToastMessage] = useState('')

  // Aggregated KPI Metrics & Pending Resets
  const activeCount = affiliates.filter((a) => a.isActive).length
  const totalSalesCount = affiliates.reduce((acc, a) => acc + (a.totalSalesCount || 0), 0)
  const totalRevenueSen = affiliates.reduce((acc, a) => acc + (a.totalSalesRevenueSen || 0), 0)
  const totalCommissionSen = affiliates.reduce((acc, a) => acc + (a.totalCommissionSen || 0), 0)
  const pendingResets = affiliates.filter((a) => a.passwordResetRequested)

  // Filtered list
  const filteredAffiliates = affiliates.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.code.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleCopyLink = (code: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://kammar-beddings-web.vercel.app'
    const referralUrl = `${origin}/?ref=${encodeURIComponent(code)}`
    navigator.clipboard.writeText(referralUrl)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2500)
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/affiliates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })
      if (res.ok) {
        setAffiliates((prev) =>
          prev.map((a) => (a.id === id ? { ...a, isActive: !currentStatus } : a))
        )
      }
    } catch (err) {
      console.error('Failed to toggle status:', err)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Padam ejen affiliate "${name}"? Tindakan ini tidak boleh diundur.`)) return

    try {
      const res = await fetch(`/api/admin/affiliates/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setAffiliates((prev) => prev.filter((a) => a.id !== id))
      }
    } catch (err) {
      console.error('Failed to delete affiliate:', err)
    }
  }

  const handleOpenNoteModal = (aff: Affiliate) => {
    setSelectedAffiliate(aff)
    setNoteText(aff.adminNotes || '')
    setAccessKeyText(aff.accessKey || 'kamaar123')
    setNoteSaveSuccess(false)
    setIsNoteModalOpen(true)
  }

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAffiliate) return

    setIsSavingNote(true)
    setNoteSaveSuccess(false)

    try {
      const res = await fetch(`/api/admin/affiliates/${selectedAffiliate.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminNotes: noteText.trim(),
          accessKey: accessKeyText.trim() || 'kamaar123',
        }),
      })

      const data = await res.json()

      if (res.ok && data.affiliate) {
        setAffiliates((prev) =>
          prev.map((a) =>
            a.id === selectedAffiliate.id
              ? {
                  ...a,
                  adminNotes: noteText.trim(),
                  accessKey: accessKeyText.trim() || 'kamaar123',
                }
              : a
          )
        )
        setNoteSaveSuccess(true)
        setTimeout(() => {
          setIsNoteModalOpen(false)
          setNoteSaveSuccess(false)
        }, 1200)
      } else {
        alert(data.error || 'Gagal mengemas kini nota.')
      }
    } catch (err) {
      console.error('Failed to save note:', err)
      alert('Ralat sambungan pelayan.')
    } finally {
      setIsSavingNote(false)
    }
  }

  const handleOpenResetModal = (aff: Affiliate) => {
    setResetTargetAffiliate(aff)
    setNewPasscode(aff.accessKey || 'kamaar123')
    setResetNote(
      aff.passwordResetRequested
        ? `Kata laluan anda telah diset semula oleh pihak pentadbir KAMAAR berikutan permohonan anda.`
        : aff.adminNotes || ''
    )
    setResetToastMessage('')
    setIsResetModalOpen(true)
  }

  const handleExecuteResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetTargetAffiliate) return

    setIsResetting(true)
    setResetToastMessage('')

    try {
      const res = await fetch('/api/admin/affiliates/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          affiliateId: resetTargetAffiliate.id,
          newPasscode: newPasscode.trim(),
          adminNote: resetNote.trim(),
        }),
      })

      const data = await res.json()

      if (res.ok && data.affiliate) {
        setAffiliates((prev) =>
          prev.map((a) => (a.id === resetTargetAffiliate.id ? data.affiliate : a))
        )
        setResetToastMessage(data.message || 'Kata laluan berjaya diset semula!')
        setTimeout(() => {
          setIsResetModalOpen(false)
          setResetToastMessage('')
        }, 1500)
      } else {
        alert(data.error || 'Gagal menetapkan kata laluan.')
      }
    } catch (err) {
      console.error('Failed to reset password:', err)
      alert('Ralat sambungan pelayan.')
    } finally {
      setIsResetting(false)
    }
  }

  const handleCreateAffiliate = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!name.trim() || !code.trim()) {
      setErrorMessage('Sila isi nama dan kod affiliate.')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/admin/affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          code: code.trim().toUpperCase(),
          email: email.trim(),
          phone: phone.trim(),
          bankName,
          bankAccountNumber: bankAccountNumber.trim(),
          commissionType: 'percentage',
          commissionRate: Number(commissionRate) || 10,
          adminNotes: newAdminNotes.trim(),
          accessKey: newAccessKey.trim() || 'kamaar123',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || 'Gagal mendaftar ejen affiliate.')
        setIsSubmitting(false)
        return
      }

      setAffiliates((prev) => [data.affiliate, ...prev])
      setIsModalOpen(false)
      // Reset form
      setName('')
      setCode('')
      setEmail('')
      setPhone('')
      setBankAccountNumber('')
      setCommissionRate(10)
      setNewAdminNotes('')
      setNewAccessKey('')
    } catch (err: any) {
      setErrorMessage(err.message || 'Ralat sambungan pelayan.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Pending Password Reset Notification Banner */}
      {pendingResets.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-500/10 border-2 border-amber-400 rounded-2xl p-4 sm:p-5 shadow-sm animate-fade-in-up">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <BellRing className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-amber-500 text-white">
                    Tindakan Pentadbir Diperlukan
                  </span>
                  <span className="text-xs font-bold text-amber-950">
                    {pendingResets.length} Permintaan Set Semula Kata Laluan Ejen
                  </span>
                </div>
                <p className="text-xs text-neutral-700 mt-1">
                  Ejen affiliate telah melepasi pengesahan identiti (OTP Kod SMS/Emel) dan sedang menunggu kata laluan baharu daripada pihak pentadbir.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {pendingResets.map((aff) => (
                <button
                  key={aff.id}
                  onClick={() => handleOpenResetModal(aff)}
                  className="flex items-center space-x-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer hover:scale-[1.02]"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Set Kata Laluan: {aff.name.split(' ')[0]} ({aff.code})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-warmwhite p-6 rounded-2xl border border-borderLight shadow-sm animate-fade-in-up delay-50 luxury-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
              Ejen Berdaftar
            </span>
            <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center text-forest transition-transform group-hover:scale-110">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-forest-dark mt-2">
            {affiliates.length}
          </p>
          <span className="text-[11px] text-forest font-medium block mt-1">
            {activeCount} aktif menjana rujukan
          </span>
        </div>

        <div className="bg-warmwhite p-6 rounded-2xl border border-borderLight shadow-sm animate-fade-in-up delay-100 luxury-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
              Jumlah Jualan (Order)
            </span>
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold-dark transition-transform group-hover:scale-110">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-forest-dark mt-2">
            {totalSalesCount}
          </p>
          <span className="text-[11px] text-secondary font-medium block mt-1">
            Pesanan melalui kod & link
          </span>
        </div>

        <div className="bg-warmwhite p-6 rounded-2xl border border-borderLight shadow-sm animate-fade-in-up delay-150 luxury-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
              Hasil Jualan Rujukan
            </span>
            <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center text-forest transition-transform group-hover:scale-110">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-forest-dark mt-2">
            {formatMYR(totalRevenueSen)}
          </p>
          <span className="text-[11px] text-secondary font-medium block mt-1">
            Nilai jualan bersih (Gross GMV)
          </span>
        </div>

        <div className="bg-warmwhite p-6 rounded-2xl border border-borderLight shadow-sm animate-fade-in-up delay-200 luxury-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
              Komisen Ejen (Payable)
            </span>
            <div className="w-8 h-8 rounded-full bg-sale/10 flex items-center justify-center text-sale transition-transform group-hover:scale-110">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-sale mt-2">
            {formatMYR(totalCommissionSen)}
          </p>
          <span className="text-[11px] text-secondary font-medium block mt-1">
            Perlu dibayar kepada ejen
          </span>
        </div>
      </div>

      {/* Controls: Search + Add Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in-up delay-250">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            placeholder="Cari nama, kod ejen, atau emel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-warmwhite rounded-xl border border-borderLight text-xs outline-none focus:border-forest"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Link
            href="/affiliate/login"
            target="_blank"
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-warmwhite border border-[#B49A58] text-[#102A4E] hover:bg-[#B49A58]/10 text-xs font-bold rounded-xl transition-all shadow-xs"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#B49A58]" />
            <span>Portal Log Masuk Ejen</span>
            <ExternalLink className="w-3 h-3 text-[#B49A58]" />
          </Link>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-2.5 bg-forest text-warmwhite text-xs font-bold rounded-xl hover:bg-forest-dark transition-all duration-200 hover:scale-[1.02] shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Daftar Ejen Baru</span>
          </button>
        </div>
      </div>

      {/* Affiliates Table */}
      <div className="bg-warmwhite rounded-2xl border border-borderLight shadow-sm overflow-hidden animate-fade-in-up delay-300">
        {filteredAffiliates.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-secondary/40 mx-auto mb-3" />
            <p className="text-sm font-bold text-forest-dark">Tiada ejen affiliate dijumpai.</p>
            <p className="text-xs text-secondary mt-1">Daftar ejen pertama untuk mulakan promosi rujukan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream/60 border-b border-borderLight text-secondary uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Nama Ejen & Kontak</th>
                  <th className="py-3.5 px-4">Kod & Pautan Khas</th>
                  <th className="py-3.5 px-4">Kadar Komisen</th>
                  <th className="py-3.5 px-4">Bil. Jualan</th>
                  <th className="py-3.5 px-4">Jumlah Jualan (MYR)</th>
                  <th className="py-3.5 px-4">Komisen Terkumpul</th>
                  <th className="py-3.5 px-4">Akaun Bank Payout</th>
                  <th className="py-3.5 px-4">Nota Pentadbir (Admin Note)</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderLight/60">
                {filteredAffiliates.map((aff) => {
                  const isCopied = copiedCode === aff.code

                  return (
                    <tr key={aff.id} className={`transition-colors ${aff.passwordResetRequested ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-cream/20'}`}>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-forest-dark block text-sm">{aff.name}</span>
                          {aff.passwordResetRequested && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs animate-pulse">
                              <BellRing className="w-2.5 h-2.5 text-amber-600 animate-bounce" />
                              <span>Minta Reset (OTP {aff.passwordResetMethod === 'phone' ? 'SMS' : 'Emel'} Disahkan)</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-[10.5px] text-secondary mt-0.5">
                          {aff.phone && (
                            <span className="flex items-center space-x-0.5">
                              <Phone className="w-2.5 h-2.5 text-gold" />
                              <span>{aff.phone}</span>
                            </span>
                          )}
                          {aff.email && (
                            <span className="flex items-center space-x-0.5">
                              <Mail className="w-2.5 h-2.5 text-gold" />
                              <span className="truncate max-w-[120px]">{aff.email}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono font-bold px-2 py-0.5 rounded-full bg-gold/20 text-forest-dark text-[11px]">
                            {aff.code}
                          </span>
                          <button
                            onClick={() => handleCopyLink(aff.code)}
                            title="Salin pautan rujukan khas"
                            className="p-1 rounded hover:bg-cream text-secondary hover:text-forest transition-colors"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-forest font-bold" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <span className="text-[9.5px] text-secondary font-mono block mt-1">
                          {isCopied ? (
                            <span className="text-forest font-bold">Pautan disalin!</span>
                          ) : (
                            `?ref=${aff.code}`
                          )}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-bold text-charcoal">
                        {aff.commissionRate}% {aff.commissionType === 'percentage' ? 'Per Sale' : 'Tetap'}
                      </td>

                      <td className="py-4 px-4 font-bold text-forest-dark">
                        {aff.totalSalesCount || 0} order
                      </td>

                      <td className="py-4 px-4 font-bold text-forest">
                        {formatMYR(aff.totalSalesRevenueSen || 0)}
                      </td>

                      <td className="py-4 px-4 font-bold text-sale">
                        {formatMYR(aff.totalCommissionSen || 0)}
                      </td>

                      <td className="py-4 px-4 text-charcoal">
                        <span className="font-bold block text-[11px]">{aff.bankName || 'Maybank'}</span>
                        <span className="font-mono text-[10.5px] text-secondary">
                          {aff.bankAccountNumber || '— Belum diisi'}
                        </span>
                      </td>

                      {/* Admin Note Column */}
                      <td className="py-4 px-4 max-w-[210px]">
                        {aff.adminNotes ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                              <Sparkles className="w-2.5 h-2.5" /> Ada Mesej Pentadbir
                            </span>
                            <p className="text-[11px] text-charcoal truncate" title={aff.adminNotes}>
                              {aff.adminNotes}
                            </p>
                          </div>
                        ) : (
                          <span className="text-[11px] text-neutral-400 italic">Tiada nota dihantar</span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleStatus(aff.id, aff.isActive)}
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                            aff.isActive
                              ? 'bg-forest/10 text-forest hover:bg-forest/20'
                              : 'bg-charcoal/10 text-secondary hover:bg-charcoal/20'
                          }`}
                        >
                          {aff.isActive ? 'Aktif' : 'Nyahaktif'}
                        </button>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => handleOpenResetModal(aff)}
                            className={`p-1.5 rounded-lg transition-all inline-flex items-center relative ${
                              aff.passwordResetRequested
                                ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm animate-pulse ring-2 ring-amber-400 ring-offset-1'
                                : 'text-secondary hover:text-[#102A4E] hover:bg-[#102A4E]/10'
                            }`}
                            title={
                              aff.passwordResetRequested
                                ? 'PERHATIAN: Ejen mohon reset kata laluan (OTP Disahkan). Klik untuk set kata laluan baharu'
                                : 'Set Semula Kata Laluan Ejen'
                            }
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            {aff.passwordResetRequested && (
                              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full border border-white" />
                            )}
                          </button>

                          <button
                            onClick={() => handleOpenNoteModal(aff)}
                            className="p-1.5 text-secondary hover:text-forest rounded-lg hover:bg-forest/10 transition-colors inline-flex items-center"
                            title="Tulis / Edit Nota Pentadbir Untuk Ejen Ini"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-[#102A4E]" />
                          </button>

                          <button
                            onClick={() => handleDelete(aff.id, aff.name)}
                            className="p-1.5 text-secondary hover:text-sale rounded-lg hover:bg-sale/10 transition-colors"
                            title="Padam ejen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Modal: Register New Affiliate */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-forest-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-warmwhite w-full max-w-lg rounded-3xl border border-borderLight shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-forest text-warmwhite flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold">Daftar Ejen Affiliate KAMAAR</h3>
                <p className="text-xs text-warmwhite/80 mt-0.5">
                  Cipta kod khas untuk ejen kongsi di media sosial, TikTok, atau WhatsApp.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-warmwhite/80 hover:text-warmwhite rounded-lg hover:bg-warmwhite/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAffiliate} className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3 bg-sale/10 border border-sale/20 rounded-xl text-sale text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">
                    Nama Penuh Ejen <span className="text-sale">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ahmad Danial"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">
                    Kod Khas Affiliate <span className="text-sale">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: AFF-DANIAL"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2 text-xs bg-cream-light border border-borderLight rounded-xl uppercase font-mono outline-none focus:border-forest"
                  />
                  <span className="text-[10px] text-secondary mt-0.5 block">
                    Link: ?ref={code.trim().toUpperCase() || 'KOD'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">
                    Nombor Telefon / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="012 345 6789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">
                    Alamat Emel
                  </label>
                  <input
                    type="email"
                    placeholder="ejen@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">
                  Kadar Komisen (% Peratusan Jualan)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-28 px-3.5 py-2 text-xs bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest font-bold"
                  />
                  <span className="text-xs text-secondary font-medium">
                    % daripada nilai bersih tilam & perabot
                  </span>
                </div>
              </div>

              <div className="p-4 bg-cream/40 rounded-2xl border border-borderLight space-y-3">
                <span className="text-xs font-bold text-forest-dark block">
                  Maklumat Pembayaran Komisen (Payout)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-secondary block mb-1">
                      Bank Malaysia
                    </label>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-warmwhite border border-borderLight rounded-xl outline-none focus:border-forest"
                    >
                      {MALAYSIAN_BANKS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-secondary block mb-1">
                      Nombor Akaun Bank
                    </label>
                    <input
                      type="text"
                      placeholder="164012345678"
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-warmwhite border border-borderLight rounded-xl font-mono outline-none focus:border-forest"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/60 space-y-3">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Nota Pentadbir & Akses Portal Ejen
                </span>

                <div>
                  <label className="text-[11px] font-medium text-charcoal block mb-1">
                    Nota Khas Untuk Ejen (Akan dipaparkan di portal ejen)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Selamat datang ke pasukan rakan niaga KAMAAR! Sila rujuk kempen promosi bulan ini."
                    value={newAdminNotes}
                    onChange={(e) => setNewAdminNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-emerald-200 rounded-xl outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-charcoal block mb-1">
                    Kata Laluan Log Masuk Ejen (Default: kamaar123)
                  </label>
                  <input
                    type="text"
                    placeholder="kamaar123"
                    value={newAccessKey}
                    onChange={(e) => setNewAccessKey(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-emerald-200 rounded-xl outline-none focus:border-forest"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-borderLight">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-secondary hover:text-charcoal transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Mendaftar...' : 'Sahkan & Cipta Kod'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Write / Edit Admin Notes to Affiliate */}
      {isNoteModalOpen && selectedAffiliate && (
        <div className="fixed inset-0 z-50 bg-forest-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-warmwhite w-full max-w-lg rounded-3xl border border-borderLight shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-[#102A4E] text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#B49A58]/20 border border-[#B49A58]/40 flex items-center justify-center text-[#D4AF37]">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold">Nota Pentadbir Untuk Ejen</h3>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    {selectedAffiliate.name} ({selectedAffiliate.code})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="p-1.5 text-neutral-300 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="p-6 space-y-4">
              {noteSaveSuccess && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Nota dan akses berjaya dikemas kini! Ejen boleh melihat mesej ini di portal mereka.</span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">
                  Mesej / Nota Rasmi Pentadbir (Dipaparkan terus di dashboard ejen)
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Contoh: Pembayaran komisen RM 1,319.60 telah selesai didepositkan ke akaun Maybank anda. Sila tumpukan perhatian kepada promosi Tilam Hybrid minggu hadapan..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest leading-relaxed text-charcoal"
                />
                <span className="text-[10.5px] text-secondary mt-1 block">
                  Ejen akan melihat nota ini secara langsung pada kad mesej utama di portal mereka.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">
                  Kata Laluan / Kunci Akses Log Masuk Ejen
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={accessKeyText}
                    onChange={(e) => setAccessKeyText(e.target.value)}
                    placeholder="kamaar123"
                    className="w-full pl-9 pr-3.5 py-2 text-xs bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest font-mono"
                  />
                </div>
                <span className="text-[10px] text-secondary mt-0.5 block">
                  Ejen boleh log masuk menggunakan kod ({selectedAffiliate.code}) dan kata laluan ini.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-borderLight">
                <Link
                  href="/affiliate/login"
                  target="_blank"
                  className="text-xs text-[#102A4E] hover:underline flex items-center gap-1 font-semibold"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Uji Log Masuk Ejen</span>
                </Link>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsNoteModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-secondary hover:text-charcoal transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingNote}
                    className="px-5 py-2 bg-[#102A4E] hover:bg-[#163660] text-white text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSavingNote ? 'Menyimpan...' : 'Simpan & Hantar Nota'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Admin Direct Reset Password for Affiliate */}
      {isResetModalOpen && resetTargetAffiliate && (
        <div className="fixed inset-0 z-50 bg-forest-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-warmwhite w-full max-w-lg rounded-3xl border border-borderLight shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-[#102A4E] text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#B49A58]/20 border border-[#B49A58]/40 flex items-center justify-center text-[#D4AF37]">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold">Set Semula Kata Laluan Ejen</h3>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    {resetTargetAffiliate.name} ({resetTargetAffiliate.code})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="p-1.5 text-neutral-300 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteResetPassword} className="p-6 space-y-4">
              {resetTargetAffiliate.passwordResetRequested && (
                <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex items-start space-x-3">
                  <BellRing className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 animate-bounce" />
                  <div className="text-xs text-amber-900 leading-relaxed">
                    <span className="font-bold block text-amber-950 mb-0.5">
                      Permintaan Reset Diterima & Disahkan (OTP Verified)
                    </span>
                    Ejen ini telah berjaya mengesahkan identiti akaun melalui{' '}
                    <strong className="font-bold text-amber-950">
                      {resetTargetAffiliate.passwordResetMethod === 'phone' ? 'SMS Nombor Telefon' : 'Emel Berdaftar'}
                    </strong>{' '}
                    pada{' '}
                    {resetTargetAffiliate.passwordResetRequestedAt
                      ? new Date(resetTargetAffiliate.passwordResetRequestedAt).toLocaleTimeString('ms-MY', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'sebentar tadi'}
                    . Sila tetapkan kata laluan baharu untuk membolehkan ejen mengakses semula portal.
                  </div>
                </div>
              )}

              {resetToastMessage && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{resetToastMessage}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">
                  Kata Laluan Baharu <span className="text-sale">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    minLength={4}
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value)}
                    placeholder="Contoh: kamaar123"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest font-mono text-charcoal font-bold"
                  />
                </div>
                <span className="text-[10.5px] text-secondary mt-1 block">
                  Ejen akan menggunakan kata laluan ini untuk log masuk portal bersama Kod ({resetTargetAffiliate.code}) atau Emel.
                </span>

                {/* Quick preset buttons */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  <span className="text-[10px] text-secondary font-bold mr-1">Pilihan Pantas:</span>
                  <button
                    type="button"
                    onClick={() => setNewPasscode('kamaar123')}
                    className="px-2.5 py-1 bg-cream hover:bg-gold/20 text-[#102A4E] text-[10.5px] font-bold rounded-lg border border-borderLight transition-colors"
                  >
                    kamaar123
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPasscode(`KAM-${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="px-2.5 py-1 bg-cream hover:bg-gold/20 text-[#102A4E] text-[10.5px] font-bold rounded-lg border border-borderLight transition-colors"
                  >
                    Auto PIN 4-Digit
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPasscode(resetTargetAffiliate.code)}
                    className="px-2.5 py-1 bg-cream hover:bg-gold/20 text-[#102A4E] text-[10.5px] font-bold rounded-lg border border-borderLight transition-colors"
                  >
                    Sama Kod ({resetTargetAffiliate.code})
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">
                  Nota Pentadbir Tambahan (Akan dipaparkan di portal ejen)
                </label>
                <textarea
                  rows={2}
                  value={resetNote}
                  onChange={(e) => setResetNote(e.target.value)}
                  placeholder="Kata laluan anda telah diset semula oleh pihak pentadbir KAMAAR. Sila log masuk ke portal ejen."
                  className="w-full px-3.5 py-2 text-xs bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest text-charcoal"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-borderLight">
                <Link
                  href="/affiliate/login"
                  target="_blank"
                  className="text-xs text-[#102A4E] hover:underline flex items-center gap-1 font-semibold"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Uji Portal Ejen</span>
                </Link>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsResetModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-secondary hover:text-charcoal transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isResetting || !newPasscode.trim()}
                    className="px-5 py-2 bg-[#102A4E] hover:bg-[#163660] text-white text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    {isResetting ? 'Menetapkan...' : 'Sahkan Reset Kata Laluan'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
