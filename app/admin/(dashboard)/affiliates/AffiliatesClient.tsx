'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Affiliate } from '@/types'
import { formatMYR, formatKLDate, formatKLTime, formatKLDateTime } from '@/lib/utils/format'
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
  ShoppingBag,
  Package,
  AlertCircle,
  Loader2,
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
  const [mounted, setMounted] = useState(false)
  const [affiliates, setAffiliates] = useState<Affiliate[]>(initialAffiliates)
  const [search, setSearch] = useState('')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  // New affiliate form state
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [bankName, setBankName] = useState('Maybank')
  const [bankAccountNumber, setBankAccountNumber] = useState('')
  const [commissionType, setCommissionType] = useState<'percentage' | 'fixed_amount'>('percentage')
  const [commissionRate, setCommissionRate] = useState(10)
  const [newAdminNotes, setNewAdminNotes] = useState('')
  const [newAccessKey, setNewAccessKey] = useState('')

  // Global recalculate state
  const [isRecalculating, setIsRecalculating] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

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

  // Edit Affiliate Modal State (Admin full edit power & commission determination)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editAffiliateId, setEditAffiliateId] = useState('')
  const [editName, setEditName] = useState('')
  const [editCode, setEditCode] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editBankName, setEditBankName] = useState('Maybank')
  const [editBankAccountNumber, setEditBankAccountNumber] = useState('')
  const [editCommissionType, setEditCommissionType] = useState<'percentage' | 'fixed_amount'>('percentage')
  const [editCommissionRate, setEditCommissionRate] = useState<number>(10)
  const [editAdminNotes, setEditAdminNotes] = useState('')
  const [editAccessKey, setEditAccessKey] = useState('')
  const [editIsActive, setEditIsActive] = useState(true)
  const [editSalesCount, setEditSalesCount] = useState<number>(0)
  const [editSalesRevenueSen, setEditSalesRevenueSen] = useState<number>(0)
  const [editCommissionSen, setEditCommissionSen] = useState<number>(0)
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [editError, setEditError] = useState('')
  const [editSuccessMessage, setEditSuccessMessage] = useState('')
  const [isRecalculatingSingle, setIsRecalculatingSingle] = useState(false)

  // Orders / Commissions List Modal State (Admin manage & delete affiliate orders)
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false)
  const [ordersTargetAffiliate, setOrdersTargetAffiliate] = useState<Affiliate | null>(null)
  const [targetAffiliateOrders, setTargetAffiliateOrders] = useState<any[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [isDeletingOrder, setIsDeletingOrder] = useState<string | null>(null)
  const [isClearingAffiliateOrders, setIsClearingAffiliateOrders] = useState(false)
  const [ordersModalFeedback, setOrdersModalFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    if (isModalOpen || isNoteModalOpen || isResetModalOpen || isEditModalOpen || isOrdersModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen, isNoteModalOpen, isResetModalOpen, isEditModalOpen, isOrdersModalOpen])

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
          commissionType,
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
      setCommissionType('percentage')
      setCommissionRate(10)
      setNewAdminNotes('')
      setNewAccessKey('')
    } catch (err: any) {
      setErrorMessage(err.message || 'Ralat sambungan pelayan.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Recalculate affiliate stats from actual confirmed paid orders in database
  const handleRecalculate = async (targetAffiliateId?: string) => {
    setIsRecalculating(true)
    try {
      const res = await fetch('/api/admin/affiliates/recalculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetAffiliateId ? { affiliateId: targetAffiliateId } : {}),
      })
      const data = await res.json()
      if (res.ok && data.affiliates) {
        setAffiliates(data.affiliates)
        setToastMessage(data.message || 'Semua metrik jualan & komisen berjaya dikira semula dari data pesanan terkini!')
        setTimeout(() => setToastMessage(null), 4000)
      } else {
        alert(data.error || 'Gagal mengira semula statistik affiliate.')
      }
    } catch (err) {
      console.error('Failed to recalculate affiliate stats:', err)
      alert('Ralat sambungan pelayan.')
    } finally {
      setIsRecalculating(false)
    }
  }

  // Open Full Edit Affiliate Modal
  const handleOpenEditModal = (aff: Affiliate) => {
    setEditAffiliateId(aff.id)
    setEditName(aff.name)
    setEditCode(aff.code)
    setEditEmail(aff.email || '')
    setEditPhone(aff.phone || '')
    setEditBankName(aff.bankName || 'Maybank')
    setEditBankAccountNumber(aff.bankAccountNumber || '')
    setEditCommissionType(aff.commissionType || 'percentage')
    setEditCommissionRate(aff.commissionRate !== undefined ? aff.commissionRate : 10)
    setEditAdminNotes(aff.adminNotes || '')
    setEditAccessKey(aff.accessKey || 'kamaar123')
    setEditIsActive(aff.isActive)
    setEditSalesCount(aff.totalSalesCount || 0)
    setEditSalesRevenueSen(aff.totalSalesRevenueSen || 0)
    setEditCommissionSen(aff.totalCommissionSen || 0)
    setEditError('')
    setEditSuccessMessage('')
    setIsEditModalOpen(true)
  }

  // Quick single affiliate recalculation inside edit modal
  const handleRecalculateCurrentEditing = async () => {
    if (!editAffiliateId) return
    setIsRecalculatingSingle(true)
    setEditError('')
    try {
      const res = await fetch('/api/admin/affiliates/recalculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ affiliateId: editAffiliateId }),
      })
      const data = await res.json()
      if (res.ok && data.affiliates) {
        setAffiliates(data.affiliates)
        const updated = data.affiliates.find((a: Affiliate) => a.id === editAffiliateId)
        if (updated) {
          setEditSalesCount(updated.totalSalesCount || 0)
          setEditSalesRevenueSen(updated.totalSalesRevenueSen || 0)
          setEditCommissionSen(updated.totalCommissionSen || 0)
          setEditSuccessMessage('Metrik jualan & komisen berjaya dikira semula dari rekod pesanan yang dibayar!')
          setTimeout(() => setEditSuccessMessage(''), 3500)
        }
      } else {
        setEditError(data.error || 'Gagal mengira semula pesanan ejen.')
      }
    } catch (err: any) {
      setEditError(err.message || 'Ralat sambungan pelayan.')
    } finally {
      setIsRecalculatingSingle(false)
    }
  }

  // Save full affiliate edits (Admin Power)
  const handleSaveEditAffiliate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editAffiliateId) return

    setIsSavingEdit(true)
    setEditError('')
    setEditSuccessMessage('')

    try {
      const payload = {
        name: editName.trim(),
        code: editCode.trim().toUpperCase(),
        email: editEmail.trim(),
        phone: editPhone.trim(),
        bankName: editBankName,
        bankAccountNumber: editBankAccountNumber.trim(),
        commissionType: editCommissionType,
        commissionRate: Number(editCommissionRate),
        adminNotes: editAdminNotes.trim(),
        accessKey: editAccessKey.trim() || 'kamaar123',
        isActive: editIsActive,
        totalSalesCount: Number(editSalesCount),
        totalSalesRevenueSen: Number(editSalesRevenueSen),
        totalCommissionSen: Number(editCommissionSen),
      }

      const res = await fetch(`/api/admin/affiliates/${editAffiliateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (res.ok && data.affiliate) {
        setAffiliates((prev) =>
          prev.map((a) => (a.id === editAffiliateId ? data.affiliate : a))
        )
        setEditSuccessMessage('Maklumat ejen affiliate dan kadar komisen berjaya dikemas kini!')
        setTimeout(() => {
          setIsEditModalOpen(false)
          setEditSuccessMessage('')
        }, 1200)
      } else {
        setEditError(data.error || 'Gagal mengemas kini maklumat ejen.')
      }
    } catch (err: any) {
      console.error('Failed to update affiliate:', err)
      setEditError(err.message || 'Ralat sambungan pelayan.')
    } finally {
      setIsSavingEdit(false)
    }
  }

  // Open Orders / Commissions Management Modal
  const handleOpenOrdersModal = async (aff: Affiliate) => {
    setOrdersTargetAffiliate(aff)
    setIsOrdersModalOpen(true)
    setIsLoadingOrders(true)
    setOrdersModalFeedback(null)
    setTargetAffiliateOrders([])

    try {
      const res = await fetch(`/api/admin/affiliates/${aff.id}/orders`)
      const data = await res.json()
      if (res.ok && data.orders) {
        setTargetAffiliateOrders(data.orders)
        if (data.affiliate) {
          setOrdersTargetAffiliate(data.affiliate)
          setAffiliates((prev) =>
            prev.map((a) => (a.id === data.affiliate.id ? data.affiliate : a))
          )
        }
      } else {
        setOrdersModalFeedback({
          type: 'error',
          message: data.error || 'Gagal memuat turun rekod pesanan.',
        })
      }
    } catch (err: any) {
      setOrdersModalFeedback({
        type: 'error',
        message: err.message || 'Ralat sambungan pelayan.',
      })
    } finally {
      setIsLoadingOrders(false)
    }
  }

  const handleDeleteAffiliateOrder = async (orderId: string, orderNumber: string) => {
    if (!ordersTargetAffiliate) return
    if (
      !confirm(
        `Padam pesanan "${orderNumber}" daripada rekod rujukan ejen ini?\n\nNilai jualan dan komisen ejen akan dikira semula secara automatik.`
      )
    ) {
      return
    }

    setIsDeletingOrder(orderId)
    setOrdersModalFeedback(null)

    try {
      const res = await fetch(`/api/admin/affiliates/${ordersTargetAffiliate.id}/orders`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setTargetAffiliateOrders(data.orders || [])
        if (data.affiliate) {
          setOrdersTargetAffiliate(data.affiliate)
          setAffiliates((prev) =>
            prev.map((a) => (a.id === data.affiliate.id ? data.affiliate : a))
          )
        }
        setOrdersModalFeedback({
          type: 'success',
          message: `Pesanan ${orderNumber} berjaya dipadam.`,
        })
        setTimeout(() => setOrdersModalFeedback(null), 3500)
      } else {
        setOrdersModalFeedback({
          type: 'error',
          message: data.error || 'Gagal memadam pesanan.',
        })
      }
    } catch (err: any) {
      setOrdersModalFeedback({
        type: 'error',
        message: err.message || 'Ralat sambungan pelayan.',
      })
    } finally {
      setIsDeletingOrder(null)
    }
  }

  const handleClearAllAffiliateOrders = async () => {
    if (!ordersTargetAffiliate) return
    if (
      !confirm(
        `PERHATIAN PENTADBIR:\n\nAdakah anda pasti ingin memadam KESEMUA ${targetAffiliateOrders.length} pesanan rujukan untuk ejen "${ordersTargetAffiliate.name}"?\n\nStatistik jualan dan komisen akan diset semula ke 0.`
      )
    ) {
      return
    }

    setIsClearingAffiliateOrders(true)
    setOrdersModalFeedback(null)

    try {
      const res = await fetch(`/api/admin/affiliates/${ordersTargetAffiliate.id}/orders`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clearAll: true }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setTargetAffiliateOrders([])
        if (data.affiliate) {
          setOrdersTargetAffiliate(data.affiliate)
          setAffiliates((prev) =>
            prev.map((a) => (a.id === data.affiliate.id ? data.affiliate : a))
          )
        }
        setOrdersModalFeedback({
          type: 'success',
          message: data.message || 'Semua rekod pesanan rujukan berjaya dipadam.',
        })
        setTimeout(() => setOrdersModalFeedback(null), 3500)
      } else {
        setOrdersModalFeedback({
          type: 'error',
          message: data.error || 'Gagal memadam semua pesanan.',
        })
      }
    } catch (err: any) {
      setOrdersModalFeedback({
        type: 'error',
        message: err.message || 'Ralat sambungan pelayan.',
      })
    } finally {
      setIsClearingAffiliateOrders(false)
    }
  }

  return (
    <div className="space-y-5 sm:space-y-8">
      {/* Pending Password Reset Notification Banner */}
      {pendingResets.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-500/10 border-2 border-amber-400 rounded-2xl p-3.5 sm:p-5 shadow-sm animate-fade-in-up">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <BellRing className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className="text-[9px] sm:text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-amber-500 text-white">
                    Tindakan Pentadbir Diperlukan
                  </span>
                  <span className="text-xs font-bold text-amber-950">
                    {pendingResets.length} Permintaan Reset Kata Laluan Ejen
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-neutral-700 mt-1">
                  Ejen affiliate telah melepasi pengesahan identiti (OTP Kod SMS/Emel) dan sedang menunggu kata laluan baharu daripada pihak pentadbir.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {pendingResets.map((aff) => (
                <button
                  key={aff.id}
                  onClick={() => handleOpenResetModal(aff)}
                  className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer hover:scale-[1.02]"
                >
                  <KeyRound className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Set Kata Laluan: {aff.name.split(' ')[0]} ({aff.code})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4 KPI Metrics - 2x2 grid on mobile, 4 columns on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-warmwhite p-3.5 sm:p-5 lg:p-6 rounded-2xl border border-borderLight shadow-xs animate-fade-in-up delay-50 luxury-card-hover flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-xs font-bold text-secondary uppercase tracking-wider truncate">
              Ejen Berdaftar
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-forest/10 flex items-center justify-center text-forest shrink-0">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-forest-dark mt-1.5 sm:mt-2">
            {affiliates.length}
          </p>
          <span className="text-[10px] sm:text-[11px] text-forest font-medium block mt-0.5 sm:mt-1 truncate">
            {activeCount} aktif menjana rujukan
          </span>
        </div>

        <div className="bg-warmwhite p-3.5 sm:p-5 lg:p-6 rounded-2xl border border-borderLight shadow-xs animate-fade-in-up delay-100 luxury-card-hover flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-xs font-bold text-secondary uppercase tracking-wider truncate">
              Jumlah Jualan
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold-dark shrink-0">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-forest-dark mt-1.5 sm:mt-2">
            {totalSalesCount}
          </p>
          <span className="text-[10px] sm:text-[11px] text-secondary font-medium block mt-0.5 sm:mt-1 truncate">
            Pesanan melalui link/kod
          </span>
        </div>

        <div className="bg-warmwhite p-3.5 sm:p-5 lg:p-6 rounded-2xl border border-borderLight shadow-xs animate-fade-in-up delay-150 luxury-card-hover flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-xs font-bold text-secondary uppercase tracking-wider truncate">
              Hasil Jualan Rujukan
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-forest/10 flex items-center justify-center text-forest shrink-0">
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-forest-dark mt-1.5 sm:mt-2 truncate">
            {formatMYR(totalRevenueSen)}
          </p>
          <span className="text-[10px] sm:text-[11px] text-secondary font-medium block mt-0.5 sm:mt-1 truncate">
            Nilai jualan bersih (GMV)
          </span>
        </div>

        <div className="bg-warmwhite p-3.5 sm:p-5 lg:p-6 rounded-2xl border border-borderLight shadow-xs animate-fade-in-up delay-200 luxury-card-hover flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-xs font-bold text-secondary uppercase tracking-wider truncate">
              Komisen Ejen
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sale/10 flex items-center justify-center text-sale shrink-0">
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-sale mt-1.5 sm:mt-2 truncate">
            {formatMYR(totalCommissionSen)}
          </p>
          <span className="text-[10px] sm:text-[11px] text-secondary font-medium block mt-0.5 sm:mt-1 truncate">
            Perlu dibayar kepada ejen
          </span>
        </div>
      </div>

      {/* Toast Notification Alert for Recalculate */}
      {toastMessage && (
        <div className="bg-emerald-700 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Controls: Search + Refresh Komisen + Portal Log Masuk + Daftar Ejen Baru */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 animate-fade-in-up delay-250">
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

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => handleRecalculate()}
            disabled={isRecalculating}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3 sm:px-4 py-2.5 bg-warmwhite border border-[#1E4E8C] text-[#1E4E8C] hover:bg-[#1E4E8C]/10 text-xs font-bold rounded-xl transition-all shadow-xs text-center cursor-pointer disabled:opacity-50"
            title="Kira semula statistik jualan & komisen semua ejen affiliate dari rekod pesanan yang dibayar"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-[#1E4E8C] shrink-0 ${isRecalculating ? 'animate-spin' : ''}`} />
            <span className="truncate">{isRecalculating ? 'Mengira...' : 'Refresh Komisen'}</span>
          </button>

          <Link
            href="/affiliate/login"
            target="_blank"
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3 sm:px-4 py-2.5 bg-warmwhite border border-[#B49A58] text-[#1E4E8C] hover:bg-[#B49A58]/10 text-xs font-bold rounded-xl transition-all shadow-xs text-center"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#B49A58] shrink-0" />
            <span className="truncate">Portal Log Masuk</span>
            <ExternalLink className="w-3 h-3 text-[#B49A58] shrink-0 hidden sm:inline" />
          </Link>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-5 py-2.5 bg-forest text-warmwhite text-xs font-bold rounded-xl hover:bg-forest-dark transition-all duration-200 hover:scale-[1.02] shadow-sm text-center cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span className="truncate">Daftar Ejen</span>
          </button>
        </div>
      </div>

      {/* MOBILE AFFILIATE CARDS FEED (md:hidden) */}
      <div className="md:hidden space-y-3 animate-fade-in-up delay-300">
        {filteredAffiliates.length === 0 ? (
          <div className="p-8 text-center bg-warmwhite rounded-2xl border border-borderLight shadow-xs">
            <Users className="w-10 h-10 text-secondary/40 mx-auto mb-2" />
            <p className="text-sm font-bold text-forest-dark">Tiada ejen affiliate dijumpai.</p>
            <p className="text-xs text-secondary mt-1">Daftar ejen pertama untuk mulakan promosi rujukan.</p>
          </div>
        ) : (
          filteredAffiliates.map((aff) => {
            const isCopied = copiedCode === aff.code
            const initials = aff.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()

            return (
              <div
                key={aff.id}
                className={`bg-warmwhite rounded-2xl border ${
                  aff.passwordResetRequested
                    ? 'border-amber-400 ring-2 ring-amber-300/40 bg-gradient-to-b from-amber-50/50 to-warmwhite'
                    : 'border-borderLight'
                } p-3.5 sm:p-4 space-y-3 shadow-xs transition-all`}
              >
                {/* Header Row: Initials Avatar, Name, Status Pill & Toggle */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start space-x-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-forest/10 border border-forest/20 text-forest-dark font-serif font-bold flex items-center justify-center shrink-0 text-xs shadow-2xs">
                      {initials || 'EJ'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-serif font-bold text-forest-dark text-sm leading-tight truncate">
                          {aff.name}
                        </h3>
                        {aff.passwordResetRequested && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs animate-pulse">
                            <BellRing className="w-2.5 h-2.5 text-amber-600 animate-bounce" />
                            <span>Minta Reset</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10.5px] text-secondary mt-0.5">
                        <span className="font-bold text-charcoal">
                          {aff.commissionType === 'fixed_amount' ? `RM${aff.commissionRate} Tetap` : `${aff.commissionRate}% Komisen`}
                        </span>
                        <span>•</span>
                        <span>{aff.totalSalesCount || 0} Jualan</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Toggle Button */}
                  <button
                    onClick={() => handleToggleStatus(aff.id, aff.isActive)}
                    className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      aff.isActive
                        ? 'bg-forest/10 text-forest hover:bg-forest/20'
                        : 'bg-charcoal/10 text-secondary hover:bg-charcoal/20'
                    }`}
                  >
                    {aff.isActive ? 'Aktif' : 'Nyahaktif'}
                  </button>
                </div>

                {/* Referral Code & Quick Copy Bar */}
                <div className="bg-cream/40 rounded-xl p-2.5 flex items-center justify-between gap-2 border border-borderLight/60">
                  <div className="min-w-0">
                    <span className="text-[9.5px] font-bold text-secondary uppercase tracking-wider block">
                      Kod Rujukan & Pautan
                    </span>
                    <span className="font-mono text-xs font-bold text-forest-dark">
                      {aff.code}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyLink(aff.code)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs shrink-0 ${
                      isCopied
                        ? 'bg-forest text-warmwhite'
                        : 'bg-warmwhite hover:bg-gold/15 text-[#1E4E8C] border border-borderLight'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold">Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gold-dark" />
                        <span className="text-[11px] font-bold">Salin Pautan</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 3-Column Micro Performance Grid */}
                <div className="grid grid-cols-3 gap-2 bg-warmwhite rounded-xl border border-borderLight/70 p-2 text-center">
                  <div className="border-r border-borderLight/60 pr-1">
                    <span className="text-[9px] uppercase font-bold text-secondary block">Pesanan</span>
                    <span className="text-xs font-bold text-forest-dark mt-0.5 block">{aff.totalSalesCount || 0} order</span>
                  </div>
                  <div className="border-r border-borderLight/60 px-1">
                    <span className="text-[9px] uppercase font-bold text-secondary block">Nilai Jualan</span>
                    <span className="text-xs font-bold text-forest mt-0.5 block truncate">{formatMYR(aff.totalSalesRevenueSen || 0)}</span>
                  </div>
                  <div className="pl-1">
                    <span className="text-[9px] uppercase font-bold text-secondary block">Komisen</span>
                    <span className="text-xs font-bold text-sale mt-0.5 block truncate">{formatMYR(aff.totalCommissionSen || 0)}</span>
                  </div>
                </div>

                {/* Contact Details & Bank Payout */}
                <div className="space-y-1.5 text-xs text-charcoal bg-cream/20 rounded-xl p-2.5 border border-borderLight/40">
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="text-secondary font-medium flex items-center gap-1">
                      <Phone className="w-3 h-3 text-gold shrink-0" />
                      <span>Telefon:</span>
                    </span>
                    {aff.phone ? (
                      <a href={`tel:${aff.phone}`} className="font-semibold text-forest-dark hover:underline">
                        {aff.phone}
                      </a>
                    ) : (
                      <span className="text-secondary/60 italic">—</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="text-secondary font-medium flex items-center gap-1">
                      <Mail className="w-3 h-3 text-gold shrink-0" />
                      <span>Emel:</span>
                    </span>
                    {aff.email ? (
                      <a href={`mailto:${aff.email}`} className="font-semibold text-forest-dark hover:underline truncate max-w-[170px]">
                        {aff.email}
                      </a>
                    ) : (
                      <span className="text-secondary/60 italic">—</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 text-[11px] pt-1 border-t border-borderLight/50">
                    <span className="text-secondary font-medium flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-gold shrink-0" />
                      <span>Bank Payout:</span>
                    </span>
                    <span className="font-semibold text-charcoal text-right truncate">
                      {aff.bankName || 'Maybank'} • <span className="font-mono text-[10.5px]">{aff.bankAccountNumber || 'Belum diisi'}</span>
                    </span>
                  </div>
                </div>

                {/* Admin Note if any */}
                {aff.adminNotes && (
                  <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-xl p-2 text-xs">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 mb-0.5">
                      <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                      <span>Nota Pentadbir:</span>
                    </div>
                    <p className="text-[11px] text-charcoal italic line-clamp-2">
                      "{aff.adminNotes}"
                    </p>
                  </div>
                )}

                {/* Card Action Buttons */}
                <div className="space-y-1.5 pt-1 border-t border-borderLight/60">
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => handleOpenEditModal(aff)}
                      className="flex items-center justify-center gap-1 py-2 px-1.5 rounded-xl text-[11px] font-bold bg-forest/10 border border-forest/20 text-forest-dark hover:bg-forest/20 transition-all cursor-pointer"
                      title="Edit Semua Maklumat & Kadar Komisen"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-forest shrink-0" />
                      <span className="truncate">Edit Ejen</span>
                    </button>

                    <button
                      onClick={() => handleRecalculate(aff.id)}
                      disabled={isRecalculating}
                      className="flex items-center justify-center gap-1 py-2 px-1.5 rounded-xl text-[11px] font-bold bg-warmwhite border border-[#1E4E8C]/30 text-[#1E4E8C] hover:bg-[#1E4E8C]/10 transition-all cursor-pointer disabled:opacity-50"
                      title="Kira Semula Pesanan Ejen Ini"
                    >
                      <RotateCcw className={`w-3.5 h-3.5 shrink-0 ${isRecalculating ? 'animate-spin' : ''}`} />
                      <span className="truncate">Refresh</span>
                    </button>

                    <button
                      onClick={() => handleOpenResetModal(aff)}
                      className={`flex items-center justify-center gap-1 py-2 px-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                        aff.passwordResetRequested
                          ? 'bg-amber-500 text-white shadow-xs animate-pulse ring-2 ring-amber-300'
                          : 'bg-warmwhite border border-borderLight text-[#1E4E8C] hover:bg-[#1E4E8C]/10'
                      }`}
                    >
                      <KeyRound className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Laluan</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => handleOpenOrdersModal(aff)}
                      className="flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-xl text-[11px] font-bold bg-[#1E4E8C]/10 border border-[#1E4E8C]/20 text-[#1E4E8C] hover:bg-[#1E4E8C]/20 transition-all cursor-pointer"
                      title="Lihat & Urus Rekod Pesanan / Komisen Ejen Ini"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Rekod</span>
                    </button>

                    <button
                      onClick={() => handleOpenNoteModal(aff)}
                      className="flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-xl text-[11px] font-bold bg-warmwhite border border-borderLight text-secondary hover:text-forest-dark hover:bg-forest/10 transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#1E4E8C] shrink-0" />
                      <span className="truncate">Nota</span>
                    </button>

                    <button
                      onClick={() => handleDelete(aff.id, aff.name)}
                      className="flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-xl text-[11px] font-bold bg-warmwhite border border-borderLight text-sale hover:bg-sale/10 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Padam</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* DESKTOP AFFILIATES TABLE (hidden md:block) */}
      <div className="hidden md:block bg-warmwhite rounded-2xl border border-borderLight shadow-sm overflow-hidden animate-fade-in-up delay-300">
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
                            className="p-1 rounded hover:bg-cream text-secondary hover:text-forest transition-colors cursor-pointer"
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
                        {aff.commissionType === 'fixed_amount'
                          ? `RM${aff.commissionRate} Tetap`
                          : `${aff.commissionRate}% Per Sale`}
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
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
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
                            onClick={() => handleRecalculate(aff.id)}
                            disabled={isRecalculating}
                            className="p-1.5 text-secondary hover:text-[#1E4E8C] rounded-lg hover:bg-[#1E4E8C]/10 transition-colors inline-flex items-center cursor-pointer disabled:opacity-40"
                            title="Kira Semula & Segarkan Jualan/Komisen Ejen Ini"
                          >
                            <RotateCcw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin' : ''}`} />
                          </button>

                          <button
                            onClick={() => handleOpenOrdersModal(aff)}
                            className="p-1.5 text-secondary hover:text-[#1E4E8C] rounded-lg hover:bg-[#1E4E8C]/10 transition-colors inline-flex items-center cursor-pointer"
                            title="Lihat & Padam Rekod Pesanan / Komisen Ejen Ini"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-[#1E4E8C]" />
                          </button>

                          <button
                            onClick={() => handleOpenEditModal(aff)}
                            className="p-1.5 text-secondary hover:text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors inline-flex items-center cursor-pointer"
                            title="Edit Semua Maklumat & Kadar Komisen Ejen Ini"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-emerald-700" />
                          </button>

                          <button
                            onClick={() => handleOpenResetModal(aff)}
                            className={`p-1.5 rounded-lg transition-all inline-flex items-center relative cursor-pointer ${
                              aff.passwordResetRequested
                                ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm animate-pulse ring-2 ring-amber-400 ring-offset-1'
                                : 'text-secondary hover:text-[#1E4E8C] hover:bg-[#1E4E8C]/10'
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
                            className="p-1.5 text-secondary hover:text-forest rounded-lg hover:bg-forest/10 transition-colors inline-flex items-center cursor-pointer"
                            title="Tulis / Edit Nota Pentadbir Untuk Ejen Ini"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-[#1E4E8C]" />
                          </button>

                          <button
                            onClick={() => handleDelete(aff.id, aff.name)}
                            className="p-1.5 text-secondary hover:text-sale rounded-lg hover:bg-sale/10 transition-colors cursor-pointer"
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

      {/* Modal 1: Register New Affiliate */}
      {isModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] bg-forest-dark/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overscroll-contain">
          <div className="bg-warmwhite w-full max-w-lg max-h-[92dvh] sm:max-h-[88dvh] rounded-2xl sm:rounded-3xl border border-borderLight shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Sticky Header */}
            <div className="p-4 sm:p-6 bg-forest text-warmwhite flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold">Daftar Ejen Affiliate KAMAAR</h3>
                <p className="text-xs text-warmwhite/80 mt-0.5 line-clamp-1">
                  Cipta kod khas untuk ejen kongsi di media sosial, TikTok, atau WhatsApp.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-warmwhite/80 hover:text-warmwhite rounded-lg hover:bg-warmwhite/10 shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleCreateAffiliate} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="p-4 sm:p-6 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain">
                {errorMessage && (
                  <div className="p-3 bg-sale/10 border border-sale/20 rounded-xl text-sale text-xs font-semibold">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                    <span className="text-[10px] text-secondary mt-0.5 block truncate">
                      Link: ?ref={code.trim().toUpperCase() || 'KOD'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                    Jenis &amp; Kadar Komisen Ejen
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setCommissionType('percentage')}
                      className={`py-1.5 px-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                        commissionType === 'percentage'
                          ? 'bg-forest text-warmwhite border-forest shadow-xs'
                          : 'bg-cream-light text-secondary border-borderLight hover:bg-cream'
                      }`}
                    >
                      Peratusan (%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCommissionType('fixed_amount')}
                      className={`py-1.5 px-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                        commissionType === 'fixed_amount'
                          ? 'bg-forest text-warmwhite border-forest shadow-xs'
                          : 'bg-cream-light text-secondary border-borderLight hover:bg-cream'
                      }`}
                    >
                      Amaun Tetap (RM)
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      max={commissionType === 'percentage' ? 100 : 5000}
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(Number(e.target.value))}
                      className="w-24 sm:w-28 px-3.5 py-2 text-xs bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest font-bold"
                    />
                    <span className="text-[11px] sm:text-xs text-secondary font-medium">
                      {commissionType === 'percentage'
                        ? '% daripada nilai jualan bersih (subtotal)'
                        : 'RM setiap pesanan sah yang berjaya'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 bg-cream/40 rounded-2xl border border-borderLight space-y-3">
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

                <div className="p-3.5 sm:p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/60 space-y-3">
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Nota Pentadbir & Akses Portal Ejen
                  </span>

                  <div>
                    <label className="text-[11px] font-medium text-charcoal block mb-1">
                      Nota Khas Untuk Ejen (Dipaparkan di portal ejen)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Contoh: Selamat datang ke pasukan rakan niaga KAMAAR! Sila rujuk promosi terkini."
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
                      className="w-full px-3 py-2 text-xs bg-white border border-emerald-200 rounded-xl outline-none focus:border-forest font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="p-3.5 sm:px-6 sm:py-4 pb-[max(0.875rem,env(safe-area-inset-bottom))] bg-cream/30 border-t border-borderLight flex items-center justify-end space-x-3 flex-shrink-0 z-20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-secondary hover:text-charcoal transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 sm:px-6 py-2 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Mendaftar...' : 'Sahkan & Cipta Kod'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Modal 2: Write / Edit Admin Notes to Affiliate */}
      {isNoteModalOpen && selectedAffiliate && mounted && createPortal(
        <div className="fixed inset-0 z-[100] bg-forest-dark/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overscroll-contain">
          <div className="bg-warmwhite w-full max-w-lg max-h-[92dvh] sm:max-h-[88dvh] rounded-2xl sm:rounded-3xl border border-borderLight shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Sticky Header */}
            <div className="p-4 sm:p-6 bg-[#1E4E8C] text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#B49A58]/20 border border-[#B49A58]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-base sm:text-lg font-bold truncate">Nota Pentadbir Untuk Ejen</h3>
                  <p className="text-xs text-neutral-300 mt-0.5 truncate">
                    {selectedAffiliate.name} ({selectedAffiliate.code})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="p-1.5 text-neutral-300 hover:text-white rounded-lg hover:bg-white/10 shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveNote} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="p-4 sm:p-6 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain">
                {noteSaveSuccess && (
                  <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
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
                    placeholder="Contoh: Pembayaran komisen telah selesai didepositkan ke akaun Maybank anda. Sila tumpukan perhatian kepada promosi Tilam Hybrid..."
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
              </div>

              {/* Sticky Footer */}
              <div className="p-3.5 sm:px-6 sm:py-4 bg-cream/30 border-t border-borderLight flex items-center justify-between flex-shrink-0">
                <Link
                  href="/affiliate/login"
                  target="_blank"
                  className="text-xs text-[#1E4E8C] hover:underline flex items-center gap-1 font-semibold"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Uji Portal</span>
                </Link>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsNoteModalOpen(false)}
                    className="px-3 sm:px-4 py-2 text-xs font-bold text-secondary hover:text-charcoal transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingNote}
                    className="px-4 sm:px-5 py-2 bg-[#1E4E8C] hover:bg-[#2A6DB5] text-white text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSavingNote ? 'Menyimpan...' : 'Simpan Nota'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Modal 3: Admin Direct Reset Password for Affiliate */}
      {isResetModalOpen && resetTargetAffiliate && mounted && createPortal(
        <div className="fixed inset-0 z-[100] bg-forest-dark/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overscroll-contain">
          <div className="bg-warmwhite w-full max-w-lg max-h-[92dvh] sm:max-h-[88dvh] rounded-2xl sm:rounded-3xl border border-borderLight shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Sticky Header */}
            <div className="p-4 sm:p-6 bg-[#1E4E8C] text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#B49A58]/20 border border-[#B49A58]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <KeyRound className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-base sm:text-lg font-bold truncate">Set Semula Kata Laluan Ejen</h3>
                  <p className="text-xs text-neutral-300 mt-0.5 truncate">
                    {resetTargetAffiliate.name} ({resetTargetAffiliate.code})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="p-1.5 text-neutral-300 hover:text-white rounded-lg hover:bg-white/10 shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleExecuteResetPassword} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="p-4 sm:p-6 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain">
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
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
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
                      className="px-2.5 py-1 bg-cream hover:bg-gold/20 text-[#1E4E8C] text-[10.5px] font-bold rounded-lg border border-borderLight transition-colors cursor-pointer"
                    >
                      kamaar123
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewPasscode(`KAM-${Math.floor(1000 + Math.random() * 9000)}`)}
                      className="px-2.5 py-1 bg-cream hover:bg-gold/20 text-[#1E4E8C] text-[10.5px] font-bold rounded-lg border border-borderLight transition-colors cursor-pointer"
                    >
                      Auto PIN 4-Digit
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewPasscode(resetTargetAffiliate.code)}
                      className="px-2.5 py-1 bg-cream hover:bg-gold/20 text-[#1E4E8C] text-[10.5px] font-bold rounded-lg border border-borderLight transition-colors cursor-pointer"
                    >
                      Sama Kod ({resetTargetAffiliate.code})
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">
                    Nota Pentadbir Tambahan (Dipaparkan di portal ejen)
                  </label>
                  <textarea
                    rows={2}
                    value={resetNote}
                    onChange={(e) => setResetNote(e.target.value)}
                    placeholder="Kata laluan anda telah diset semula oleh pihak pentadbir KAMAAR. Sila log masuk ke portal ejen."
                    className="w-full px-3.5 py-2 text-xs bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest text-charcoal"
                  />
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="p-3.5 sm:px-6 sm:py-4 pb-[max(0.875rem,env(safe-area-inset-bottom))] bg-cream/30 border-t border-borderLight flex items-center justify-between flex-shrink-0 z-20">
                <Link
                  href="/affiliate/login"
                  target="_blank"
                  className="text-xs text-[#1E4E8C] hover:underline flex items-center gap-1 font-semibold"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Uji Portal</span>
                </Link>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsResetModalOpen(false)}
                    className="px-3 sm:px-4 py-2 text-xs font-bold text-secondary hover:text-charcoal transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isResetting || !newPasscode.trim()}
                    className="px-4 sm:px-5 py-2 bg-[#1E4E8C] hover:bg-[#2A6DB5] text-white text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    {isResetting ? 'Menetapkan...' : 'Sahkan Reset'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Modal 4: Comprehensive Edit Affiliate Details & Commission */}
      {isEditModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] bg-forest-dark/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overscroll-contain">
          <div className="bg-warmwhite w-full max-w-xl max-h-[94dvh] sm:max-h-[90dvh] rounded-2xl sm:rounded-3xl border border-borderLight shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Sticky Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-forest-dark via-forest to-[#1E4E8C] text-warmwhite flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold shrink-0">
                  <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-base sm:text-lg font-bold truncate">Edit Maklumat Ejen Affiliate</h3>
                    <span className="font-mono text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">
                      {editCode}
                    </span>
                  </div>
                  <p className="text-xs text-warmwhite/80 mt-0.5 truncate">
                    Ubah kadar komisen, status, pautan rujukan, bank payout, dan kata laluan.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-warmwhite/80 hover:text-warmwhite rounded-lg hover:bg-warmwhite/10 shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveEditAffiliate} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="p-4 sm:p-6 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain">
                {editError && (
                  <div className="p-3 bg-sale/10 border border-sale/20 rounded-xl text-sale text-xs font-semibold">
                    {editError}
                  </div>
                )}
                {editSuccessMessage && (
                  <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{editSuccessMessage}</span>
                  </div>
                )}

                {/* Section 1: Profil & Kod Rujukan */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-forest-dark uppercase tracking-wider block">
                    1. Maklumat Profil &amp; Pautan Rujukan
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-charcoal block mb-1">
                        Nama Penuh Ejen <span className="text-sale">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
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
                        value={editCode}
                        onChange={(e) => setEditCode(e.target.value.toUpperCase())}
                        className="w-full px-3.5 py-2 text-xs bg-cream-light border border-borderLight rounded-xl uppercase font-mono outline-none focus:border-forest font-bold"
                      />
                      <span className="text-[10px] text-secondary mt-0.5 block truncate">
                        Pautan: ?ref={editCode.trim().toUpperCase()} atau /r/{editCode.trim().toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-charcoal block mb-1">
                        Nombor Telefon / WhatsApp
                      </label>
                      <input
                        type="text"
                        placeholder="012 345 6789"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
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
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Penentuan Kadar Komisen (Admin Power) */}
                <div className="p-3.5 sm:p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      2. Struktur &amp; Kadar Komisen Ejen
                    </span>
                    <span className="text-[10.5px] font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full">
                      Kawalan Pentadbir
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditCommissionType('percentage')}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                        editCommissionType === 'percentage'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-white text-secondary border-amber-200 hover:bg-amber-50'
                      }`}
                    >
                      Peratusan (%) Per Sale
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditCommissionType('fixed_amount')}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                        editCommissionType === 'fixed_amount'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-white text-secondary border-amber-200 hover:bg-amber-50'
                      }`}
                    >
                      Amaun Tetap (RM) Per Order
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-charcoal block mb-1">
                      Kadar Komisen ({editCommissionType === 'percentage' ? '%' : 'RM'})
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        max={editCommissionType === 'percentage' ? 100 : 5000}
                        step={editCommissionType === 'percentage' ? '1' : '0.5'}
                        value={editCommissionRate}
                        onChange={(e) => setEditCommissionRate(Number(e.target.value))}
                        className="w-28 px-3.5 py-2 text-xs bg-white border border-amber-300 rounded-xl outline-none focus:border-amber-600 font-bold text-charcoal"
                      />
                      <span className="text-[11px] text-amber-900 font-medium">
                        {editCommissionType === 'percentage'
                          ? '% daripada nilai bersih jualan (subtotal pesanan)'
                          : 'RM tunai untuk setiap pesanan sah yang berjaya dibayar'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 3: Akaun Bank (Payout) */}
                <div className="p-3.5 sm:p-4 bg-cream/50 border border-borderLight rounded-2xl space-y-3">
                  <span className="text-xs font-bold text-forest-dark block">
                    3. Maklumat Pembayaran Bank (Payout Komisen)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-secondary block mb-1">
                        Bank Malaysia
                      </label>
                      <select
                        value={editBankName}
                        onChange={(e) => setEditBankName(e.target.value)}
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
                        value={editBankAccountNumber}
                        onChange={(e) => setEditBankAccountNumber(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-warmwhite border border-borderLight rounded-xl font-mono outline-none focus:border-forest"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Keselamatan, Status & Nota Rasmi */}
                <div className="p-3.5 sm:p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl space-y-3">
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    4. Akses Portal, Status &amp; Nota Pentadbir
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-charcoal block mb-1">
                        Kata Laluan Portal Ejen
                      </label>
                      <input
                        type="text"
                        value={editAccessKey}
                        onChange={(e) => setEditAccessKey(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-emerald-200 rounded-xl outline-none focus:border-forest font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-charcoal block mb-1">
                        Status Keahlian Ejen
                      </label>
                      <div className="flex items-center space-x-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditIsActive(true)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                            editIsActive
                              ? 'bg-forest text-white border-forest shadow-xs'
                              : 'bg-white text-secondary border-borderLight'
                          }`}
                        >
                          Aktif (Boleh Jana Komisen)
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditIsActive(false)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                            !editIsActive
                              ? 'bg-sale text-white border-sale shadow-xs'
                              : 'bg-white text-secondary border-borderLight'
                          }`}
                        >
                          Nyahaktif
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-charcoal block mb-1">
                      Nota Pentadbir (Dipaparkan terus dalam portal ejen)
                    </label>
                    <textarea
                      rows={2}
                      value={editAdminNotes}
                      onChange={(e) => setEditAdminNotes(e.target.value)}
                      placeholder="Contoh: Payout komisen bulan ini telah dimasukkan ke akaun anda."
                      className="w-full px-3 py-2 text-xs bg-white border border-emerald-200 rounded-xl outline-none focus:border-forest"
                    />
                  </div>
                </div>

                {/* Section 5: Metrik Jualan & Komisen (Dengan Butang Kira Semula Automatik) */}
                <div className="p-3.5 sm:p-4 bg-blue-50/60 border border-blue-200/80 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      5. Statistik Jualan &amp; Komisen Terkumpul
                    </span>
                    <button
                      type="button"
                      onClick={handleRecalculateCurrentEditing}
                      disabled={isRecalculatingSingle}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white text-[10.5px] font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                      title="Kira semula jualan dan komisen dari pesanan sebenar yang dibayar"
                    >
                      <RotateCcw className={`w-3 h-3 ${isRecalculatingSingle ? 'animate-spin' : ''}`} />
                      <span>{isRecalculatingSingle ? 'Mengira...' : 'Kira Semula Dari Pesanan'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-secondary font-medium block mb-0.5">
                        Bil Pesanan (Order)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editSalesCount}
                        onChange={(e) => setEditSalesCount(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-blue-200 rounded-lg font-bold text-forest-dark"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-secondary font-medium block mb-0.5">
                        Hasil Jualan (RM)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={(editSalesRevenueSen / 100).toFixed(2)}
                        onChange={(e) => setEditSalesRevenueSen(Math.round(Number(e.target.value) * 100))}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-blue-200 rounded-lg font-bold text-forest"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-secondary font-medium block mb-0.5">
                        Komisen Terkumpul (RM)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={(editCommissionSen / 100).toFixed(2)}
                        onChange={(e) => setEditCommissionSen(Math.round(Number(e.target.value) * 100))}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-blue-200 rounded-lg font-bold text-sale"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="p-3.5 sm:px-6 sm:py-4 pb-[max(0.875rem,env(safe-area-inset-bottom))] bg-cream/30 border-t border-borderLight flex items-center justify-end space-x-3 flex-shrink-0 z-20">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-secondary hover:text-charcoal transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-6 py-2 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {isSavingEdit ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Simpan Semua Maklumat</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Modal: View & Delete Affiliate Referral Orders */}
      {isOrdersModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] bg-forest-dark/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overscroll-contain">
          <div className="bg-warmwhite w-full max-w-4xl max-h-[92dvh] sm:max-h-[88dvh] rounded-2xl sm:rounded-3xl border border-borderLight shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 sm:p-6 bg-[#13325B] text-white flex items-center justify-between flex-shrink-0 border-b border-[#B49A58]/30">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E4E8C] to-[#2A6DB5] border border-[#B49A58]/40 flex items-center justify-center shadow-md">
                  <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                      REKOD KOMISEN & RUJUKAN
                    </span>
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white">
                      {ordersTargetAffiliate?.code}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                    {ordersTargetAffiliate?.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setIsOrdersModalOpen(false)}
                className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* KPI Summary Bar */}
            <div className="bg-[#1E4E8C]/5 border-b border-borderLight p-3.5 sm:px-6 sm:py-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <div className="bg-white px-3 py-1.5 rounded-xl border border-borderLight shadow-2xs">
                  <span className="text-[10px] text-secondary uppercase font-bold block">Pesanan</span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-forest-dark">
                    {targetAffiliateOrders.length} order
                  </span>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-xl border border-borderLight shadow-2xs">
                  <span className="text-[10px] text-secondary uppercase font-bold block">Jumlah Nilai Jualan</span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-forest">
                    {formatMYR(ordersTargetAffiliate?.totalSalesRevenueSen || 0)}
                  </span>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-xl border border-borderLight shadow-2xs">
                  <span className="text-[10px] text-secondary uppercase font-bold block">Komisen Terkumpul</span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-sale">
                    {formatMYR(ordersTargetAffiliate?.totalCommissionSen || 0)}
                  </span>
                </div>
              </div>

              {targetAffiliateOrders.length > 0 && (
                <button
                  onClick={handleClearAllAffiliateOrders}
                  disabled={isClearingAffiliateOrders}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Padam semua pesanan rujukan dan kosongkan rekod komisen ejen ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isClearingAffiliateOrders ? 'Memadam...' : 'Padam Semua Rekod'}</span>
                </button>
              )}
            </div>

            {/* Notification alert inside modal */}
            {ordersModalFeedback && (
              <div
                className={`m-3.5 sm:mx-6 sm:mt-4 p-3 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                  ordersModalFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    : 'bg-rose-50 text-rose-900 border-rose-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {ordersModalFeedback.type === 'success' ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{ordersModalFeedback.message}</span>
                </div>
                <button
                  onClick={() => setOrdersModalFeedback(null)}
                  className="p-0.5 text-neutral-500 hover:text-neutral-800 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Content Body */}
            <div className="p-3.5 sm:p-6 overflow-y-auto flex-1">
              {isLoadingOrders ? (
                <div className="py-16 text-center space-y-2">
                  <Loader2 className="w-8 h-8 text-[#1E4E8C] animate-spin mx-auto" />
                  <p className="text-xs text-secondary font-medium">Memuat turun rekod pesanan rujukan...</p>
                </div>
              ) : targetAffiliateOrders.length === 0 ? (
                <div className="py-16 text-center text-charcoal-muted border-2 border-dashed border-borderLight rounded-2xl bg-cream/20">
                  <Package className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-forest-dark">Tiada rekod pesanan rujukan dijumpai.</p>
                  <p className="text-xs text-secondary mt-1">
                    Ejen ini belum mempunyai sebarang pesanan yang direkodkan melalui pautan atau kodnya.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-borderLight bg-white">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-cream/60 border-b border-borderLight text-secondary uppercase font-semibold text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3 px-3.5">No. Pesanan</th>
                        <th className="py-3 px-3.5">Tarikh & Masa</th>
                        <th className="py-3 px-3.5">Pelanggan & Item</th>
                        <th className="py-3 px-3.5 text-right">Nilai Jualan</th>
                        <th className="py-3 px-3.5 text-right">Komisen Ejen</th>
                        <th className="py-3 px-3.5 text-center">Status</th>
                        <th className="py-3 px-3.5 text-center">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-borderLight/60">
                      {targetAffiliateOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-cream/20 transition-colors">
                          <td className="py-3.5 px-3.5 font-mono font-bold text-[#1E4E8C]">
                            {ord.orderNumber}
                          </td>
                          <td className="py-3.5 px-3.5 whitespace-nowrap">
                            <span className="font-semibold text-charcoal block">
                              {formatKLDate(ord.createdAt)}
                            </span>
                            <span className="text-[10.5px] font-mono text-secondary block mt-0.5">
                              {formatKLTime(ord.createdAt)}
                            </span>
                          </td>
                          <td className="py-3.5 px-3.5 max-w-xs">
                            <span className="font-bold text-charcoal block text-[11px] truncate">
                              {ord.customerName || 'Pelanggan'}
                            </span>
                            <span
                              className="text-[10.5px] text-secondary truncate block"
                              title={ord.itemsSummary}
                            >
                              {ord.itemsSummary || `${ord.itemCount} item`}
                            </span>
                          </td>
                          <td className="py-3.5 px-3.5 text-right font-mono font-semibold text-charcoal">
                            {formatMYR(ord.totalSen)}
                          </td>
                          <td className="py-3.5 px-3.5 text-right font-mono font-bold text-sale">
                            {formatMYR(ord.affiliateCommissionSen)}
                          </td>
                          <td className="py-3.5 px-3.5 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                                ord.paymentStatus === 'paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {ord.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleDeleteAffiliateOrder(ord.id, ord.orderNumber)}
                              disabled={isDeletingOrder === ord.id}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
                              title={`Padam pesanan ${ord.orderNumber} ini`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{isDeletingOrder === ord.id ? 'Memadam...' : 'Padam'}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3.5 sm:px-6 sm:py-3.5 bg-cream/30 border-t border-borderLight flex items-center justify-between flex-shrink-0 text-xs">
              <span className="text-[11px] text-secondary">
                Memadam rekod akan mengira semula statistik jualan & komisen ejen secara automatik.
              </span>
              <button
                onClick={() => setIsOrdersModalOpen(false)}
                className="px-4 py-2 bg-warmwhite border border-borderLight hover:bg-neutral-100 rounded-xl font-bold text-charcoal transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
