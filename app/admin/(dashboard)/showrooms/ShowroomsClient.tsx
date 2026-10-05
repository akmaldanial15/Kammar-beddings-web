'use client'

import React, { useState } from 'react'
import { Showroom, AppointmentRequest } from '@/types'
import { formatKLDate } from '@/lib/utils/format'
import {
  MapPin,
  Calendar,
  Plus,
  Edit2,
  CheckCircle,
  Clock,
  ExternalLink,
  Search,
  X,
  Sliders,
  Trash2,
  Save,
  Phone,
  Building2,
  Sparkles,
  Check,
  AlertCircle,
  Eye,
  RefreshCw,
} from 'lucide-react'

interface ShowroomsClientProps {
  initialShowrooms: Showroom[]
  initialAppointments: AppointmentRequest[]
}

export function ShowroomsClient({
  initialShowrooms,
  initialAppointments,
}: ShowroomsClientProps) {
  const [showrooms, setShowrooms] = useState<Showroom[]>(initialShowrooms)
  const [appointments, setAppointments] = useState<AppointmentRequest[]>(initialAppointments)
  const [activeTab, setActiveTab] = useState<'showrooms' | 'appointments'>('showrooms')
  
  // Search & Filter state
  const [search, setSearch] = useState('')
  const [selectedState, setSelectedState] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all')

  // Full Edit Modal State
  const [editingShowroom, setEditingShowroom] = useState<Showroom | null>(null)
  
  // Quick Inline Edit State
  const [quickEditingId, setQuickEditingId] = useState<string | null>(null)
  const [quickFormData, setQuickFormData] = useState<Partial<Showroom>>({})
  const [isQuickSaving, setIsQuickSaving] = useState(false)

  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  // Unique states for filter dropdown
  const allStates = Array.from(new Set(showrooms.map((s) => s.state))).filter(Boolean)

  // Filtered Showrooms
  const filteredShowrooms = showrooms.filter((s) => {
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.state.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q) ||
      s.phone.toLowerCase().includes(q) ||
      s.openingHours.toLowerCase().includes(q)
    const matchesState = selectedState === 'all' || s.state.toLowerCase() === selectedState.toLowerCase()
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && s.isActive) ||
      (selectedStatus === 'inactive' && !s.isActive)
    return matchesSearch && matchesState && matchesStatus
  })

  // Filtered Appointments
  const filteredAppointments = appointments.filter((apt) => {
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      apt.customerName.toLowerCase().includes(q) ||
      apt.customerEmail.toLowerCase().includes(q) ||
      apt.customerPhone.toLowerCase().includes(q) ||
      apt.showroomId.toLowerCase().includes(q) ||
      (apt.notes && apt.notes.toLowerCase().includes(q))
    return matchesSearch
  })

  // KPI Calculations
  const totalShowrooms = showrooms.length
  const activeShowroomsCount = showrooms.filter((s) => s.isActive).length
  const inactiveShowroomsCount = totalShowrooms - activeShowroomsCount
  const pendingAppointmentsCount = appointments.filter((a) => a.status === 'pending').length

  // Quick 1-Click Status Toggle
  const handleToggleStatus = async (showroom: Showroom) => {
    const updated: Showroom = { ...showroom, isActive: !showroom.isActive }
    try {
      const res = await fetch('/api/admin/showrooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showroom: updated }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setShowrooms((prev) => prev.map((s) => (s.id === showroom.id ? updated : s)))
        setFeedback({
          text: `Status ${showroom.name} berjaya ditukar kepada ${updated.isActive ? 'Buka (Open)' : 'Tutup Sementara (Closed)'}.`,
          type: 'success',
        })
      } else {
        setFeedback({ text: data.error || 'Gagal menukar status studio.', type: 'error' })
      }
    } catch {
      setFeedback({ text: 'Ralat komunikasi pelayan berlaku.', type: 'error' })
    }
  }

  // Quick Inline Edit Handlers
  const handleStartQuickEdit = (s: Showroom) => {
    setQuickEditingId(s.id)
    setQuickFormData({
      id: s.id,
      name: s.name,
      state: s.state,
      address: s.address,
      phone: s.phone,
      openingHours: s.openingHours,
      mapUrl: s.mapUrl,
      isActive: s.isActive,
    })
  }

  const handleCancelQuickEdit = () => {
    setQuickEditingId(null)
    setQuickFormData({})
  }

  const handleSaveQuickEdit = async (showroom: Showroom) => {
    if (!quickFormData.name?.trim() || !quickFormData.state?.trim()) {
      setFeedback({ text: 'Nama studio dan negeri tidak boleh kosong.', type: 'error' })
      return
    }

    setIsQuickSaving(true)
    const updated: Showroom = {
      ...showroom,
      ...quickFormData,
      name: quickFormData.name?.trim() || showroom.name,
      state: quickFormData.state?.trim() || showroom.state,
      address: quickFormData.address?.trim() || showroom.address,
      phone: quickFormData.phone?.trim() || showroom.phone,
      openingHours: quickFormData.openingHours?.trim() || showroom.openingHours,
      mapUrl: quickFormData.mapUrl?.trim() || showroom.mapUrl,
    }

    try {
      const res = await fetch('/api/admin/showrooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showroom: updated }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setShowrooms((prev) => prev.map((s) => (s.id === showroom.id ? updated : s)))
        setFeedback({ text: `Kemaskini pantas untuk "${updated.name}" berjaya disimpan!`, type: 'success' })
        setQuickEditingId(null)
        setQuickFormData({})
      } else {
        setFeedback({ text: data.error || 'Gagal menyimpan maklumat studio.', type: 'error' })
      }
    } catch {
      setFeedback({ text: 'Ralat komunikasi pelayan semasa kemaskini pantas.', type: 'error' })
    } finally {
      setIsQuickSaving(false)
    }
  }

  // Delete Showroom
  const handleDeleteShowroom = async (id: string, name: string) => {
    if (!confirm(`Adakah anda pasti mahu memadam galeri studio "${name}"? Tindakan ini tidak boleh diundur.`)) return

    try {
      const res = await fetch(`/api/admin/showrooms?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok && data.success) {
        setShowrooms((prev) => prev.filter((s) => s.id !== id))
        setFeedback({ text: `Galeri studio "${name}" telah dipadam.`, type: 'success' })
      } else {
        setFeedback({ text: data.error || 'Gagal memadam showroom.', type: 'error' })
      }
    } catch {
      setFeedback({ text: 'Ralat memadam galeri studio.', type: 'error' })
    }
  }

  // Save via Full Modal
  const handleSaveShowroom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingShowroom) return

    setIsSaving(true)
    setFeedback(null)

    try {
      const res = await fetch('/api/admin/showrooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showroom: editingShowroom }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setShowrooms((prev) => {
          const idx = prev.findIndex((s) => s.id === data.showroom.id)
          if (idx >= 0) {
            const next = [...prev]
            next[idx] = data.showroom
            return next
          }
          return [...prev, data.showroom]
        })
        setFeedback({ text: `Galeri showroom "${data.showroom.name}" berjaya disimpan.`, type: 'success' })
        setEditingShowroom(null)
      } else {
        setFeedback({ text: data.error || 'Gagal menyimpan showroom.', type: 'error' })
      }
    } catch {
      setFeedback({ text: 'Ralat komunikasi semasa menyimpan showroom.', type: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateAppointment = async (
    appointmentId: string,
    status: 'pending' | 'confirmed' | 'cancelled'
  ) => {
    try {
      const res = await fetch('/api/admin/showrooms', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, status }),
      })

      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === appointmentId ? { ...a, status } : a))
        )
        setFeedback({ text: `Janji temu berjaya dikemaskini kepada: ${status}.`, type: 'success' })
      } else {
        setFeedback({ text: 'Gagal mengemaskini status janji temu.', type: 'error' })
      }
    } catch {
      setFeedback({ text: 'Ralat kemaskini janji temu.', type: 'error' })
    }
  }

  return (
    <div className="space-y-6 max-w-full font-sans">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-3.5 sm:p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm shadow-sm animate-fade-in border ${
            feedback.type === 'success'
              ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
              : 'bg-rose-50/90 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            )}
            <span className="font-medium">{feedback.text}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 underline ml-3 flex-shrink-0 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* 1. Header & Quick Stat Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-forest-dark/5 border border-forest-dark/10 text-forest-dark text-[10px] font-bold tracking-wider uppercase">
            <Building2 className="w-3 h-3 text-gold" />
            <span>KAMAAR Boutiques & Atelier Network</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-dark tracking-tight">
            Showroom Studios & Appointments
          </h1>
          <p className="text-xs sm:text-sm text-secondary max-w-2xl">
            Uruskan galeri fizikal di seluruh Malaysia, waktu operasi, tetapan pantas dan tempahan sesi ujian tilam peribadi.
          </p>
        </div>

        {/* Action Button: Add Studio */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap flex-shrink-0">
          <button
            onClick={() => {
              setEditingShowroom({
                id: `shw-${Date.now()}`,
                name: 'KAMAAR Sleep Atelier',
                slug: `studio-${Date.now()}`,
                state: 'Kuala Lumpur',
                address: 'Level 2, Premium Lifestyle Mall, Jalan Bukit Bintang',
                phone: '+60 3-2141 8900',
                openingHours: 'Daily: 10:00 AM – 9:00 PM',
                mapUrl: 'https://maps.google.com',
                image: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?q=80&w=800',
                isActive: true,
                displayOrder: showrooms.length + 1,
              })
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-forest-dark to-forest hover:from-forest hover:to-forest-dark text-warmwhite px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-gold flex-shrink-0" />
            <span>+ Add Showroom Studio</span>
          </button>
        </div>
      </div>

      {/* 2. Executive KPI Ribbon */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3 sm:p-4 font-sans">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {/* Total Studios */}
          <div className="flex items-center justify-between p-2 sm:px-3 sm:py-1">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Jumlah Galeri
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl sm:text-2xl font-bold text-forest-dark">{totalShowrooms}</span>
                <span className="text-[11px] text-slate-500 font-medium">Boutique</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Seluruh Malaysia</span>
            </div>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-50/80 border border-blue-100 text-forest flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          {/* Active Studios */}
          <div className="flex items-center justify-between p-2 sm:px-4 sm:py-1 pt-3 sm:pt-1">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Galeri Dibuka
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl sm:text-2xl font-bold text-emerald-700">{activeShowroomsCount}</span>
                <span className="text-[11px] text-emerald-600 font-semibold">Aktif</span>
              </div>
              <span className="text-[10px] text-emerald-600/90 block mt-0.5 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span> Menerima pelanggan
              </span>
            </div>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50/80 border border-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>

          {/* Inactive / Closed */}
          <div className="flex items-center justify-between p-2 sm:px-4 sm:py-1 pt-3 sm:pt-1">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Tutup Sementara
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl sm:text-2xl font-bold text-amber-700">{inactiveShowroomsCount}</span>
                <span className="text-[11px] text-amber-600 font-medium">Boutique</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Ubah suai / Cuti</span>
            </div>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-50/80 border border-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* Appointments Pending */}
          <div className="flex items-center justify-between p-2 sm:px-4 sm:py-1 pt-3 sm:pt-1">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Tempahan Sesi
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl sm:text-2xl font-bold text-forest-dark">{appointments.length}</span>
                {pendingAppointmentsCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                    {pendingAppointmentsCount} baru
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Private Consultation</span>
            </div>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-purple-50/80 border border-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Section Tabs */}
      <div className="flex items-center gap-2 border-b border-borderLight pb-1">
        <button
          onClick={() => setActiveTab('showrooms')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'showrooms'
              ? 'bg-forest-dark text-warmwhite shadow-sm'
              : 'bg-white hover:bg-slate-50 text-secondary hover:text-charcoal border border-slate-200/80'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Showroom Studios ({showrooms.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'appointments'
              ? 'bg-forest-dark text-warmwhite shadow-sm'
              : 'bg-white hover:bg-slate-50 text-secondary hover:text-charcoal border border-slate-200/80'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Consultation Bookings ({appointments.length})</span>
          {pendingAppointmentsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          )}
        </button>
      </div>

      {/* 4. Search & Quick Settings Console Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3.5 sm:p-4 space-y-3 font-sans">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                activeTab === 'showrooms'
                  ? 'Cari galeri mengikut nama studio, negeri, no. telefon, alamat...'
                  : 'Cari tempahan mengikut nama pelanggan, email, telefon, studio...'
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50/70 border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200 transition-all cursor-pointer"
                title="Kosongkan carian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter: State Selector (Showrooms tab) */}
          {activeTab === 'showrooms' && (
            <div className="flex items-center gap-2">
              <div className="relative min-w-[140px] flex-1 sm:flex-initial">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all cursor-pointer appearance-none pr-8"
                >
                  <option value="all">Semua Negeri</option>
                  {allStates.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Sliders className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Status Filter */}
              <div className="relative min-w-[130px] flex-1 sm:flex-initial">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all cursor-pointer appearance-none pr-8"
                >
                  <option value="all">Semua Status</option>
                  <option value="active">Buka (Open)</option>
                  <option value="inactive">Tutup (Closed)</option>
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Sliders className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Reset Button */}
              {(search || selectedState !== 'all' || selectedStatus !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setSelectedState('all')
                    setSelectedStatus('all')
                  }}
                  className="px-3 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200/80 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                  title="Reset semua penapis"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* State Quick Pills (Showrooms Tab) */}
        {activeTab === 'showrooms' && (
          <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 overflow-x-auto no-scrollbar scroll-smooth">
            <button
              type="button"
              onClick={() => setSelectedState('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 flex-shrink-0 ${
                selectedState === 'all'
                  ? 'bg-forest-dark text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
              }`}
            >
              <span>Semua Negeri</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedState === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {showrooms.length}
              </span>
            </button>

            {allStates.map((st) => {
              const count = showrooms.filter((s) => s.state.toLowerCase() === st.toLowerCase()).length
              const isSelected = selectedState.toLowerCase() === st.toLowerCase()
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedState(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 flex-shrink-0 ${
                    isSelected
                      ? 'bg-forest-dark text-white font-bold shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                  }`}
                >
                  <span>{st}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* 5. Main Content Area */}
      {activeTab === 'showrooms' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Menunjukkan <strong className="text-forest-dark font-bold">{filteredShowrooms.length}</strong> daripada {showrooms.length} galeri studio
            </span>
            <span className="text-[11px] text-slate-400 italic">
              ⚡ Klik toggle status atau butang &quot;Quick Edit&quot; untuk suntingan segera tanpa modal.
            </span>
          </div>

          {filteredShowrooms.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3 shadow-xs">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-bold text-forest-dark text-sm">Tiada galeri studio sepadan</p>
              <p className="text-xs text-secondary max-w-sm mx-auto">
                Cuba gunakan kata carian lain atau tetapkan semula penapis negeri/status.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setSelectedState('all')
                  setSelectedStatus('all')
                }}
                className="mt-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Reset Semua Carian
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredShowrooms.map((s) => {
                const isQuickEditing = quickEditingId === s.id

                return (
                  <div
                    key={s.id}
                    className={`bg-white rounded-2xl border transition-all shadow-xs flex flex-col justify-between overflow-hidden ${
                      isQuickEditing
                        ? 'border-gold ring-2 ring-gold/20 shadow-md bg-amber-50/20'
                        : 'border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    {/* Top Status Header */}
                    <div className="p-4 sm:p-5 space-y-3.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200/60 uppercase tracking-wider font-bold px-2 py-0.5 rounded-md">
                          {s.state}
                        </span>

                        {/* Direct 1-Click Status Toggle Switch */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(s)}
                          title="Klik untuk tukar status Buka / Tutup Sementara secara terus"
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer shadow-2xs ${
                            s.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              s.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                            }`}
                          ></span>
                          <span>{s.isActive ? 'Open (Buka)' : 'Tutup Sementara'}</span>
                        </button>
                      </div>

                      {/* Content: View Mode vs Inline Quick Edit Mode */}
                      {!isQuickEditing ? (
                        <div className="space-y-3">
                          <h3 className="font-serif text-lg font-bold text-forest-dark leading-snug">
                            {s.name}
                          </h3>

                          <p className="text-xs text-slate-600 leading-relaxed flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                            <span>{s.address}</span>
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-1.5 text-slate-700">
                              <Clock className="w-3.5 h-3.5 text-gold-dark flex-shrink-0" />
                              <span className="truncate">{s.openingHours}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-700">
                              <Phone className="w-3.5 h-3.5 text-forest flex-shrink-0" />
                              <span className="font-medium">{s.phone}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* INLINE QUICK EDIT FORM */
                        <div className="space-y-3 pt-1 animate-fade-in font-sans">
                          <div className="bg-amber-100/40 p-2 rounded-xl text-[11px] text-amber-900 font-semibold flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                            <span>Mod Suntingan Pantas (Quick Edit Aktif)</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                Nama Studio *
                              </label>
                              <input
                                type="text"
                                value={quickFormData.name || ''}
                                onChange={(e) => setQuickFormData({ ...quickFormData, name: e.target.value })}
                                className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-300 focus:border-gold focus:ring-1 focus:ring-gold bg-white"
                                placeholder="Contoh: Bangsar Flagship Sleep Gallery"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                Negeri *
                              </label>
                              <input
                                type="text"
                                value={quickFormData.state || ''}
                                onChange={(e) => setQuickFormData({ ...quickFormData, state: e.target.value })}
                                className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-300 focus:border-gold focus:ring-1 focus:ring-gold bg-white"
                                placeholder="Contoh: WP Kuala Lumpur"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                Waktu Operasi
                              </label>
                              <input
                                type="text"
                                value={quickFormData.openingHours || ''}
                                onChange={(e) => setQuickFormData({ ...quickFormData, openingHours: e.target.value })}
                                className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-300 focus:border-gold focus:ring-1 focus:ring-gold bg-white"
                                placeholder="Mon - Sun: 10:00 AM - 10:00 PM"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                No. Telefon
                              </label>
                              <input
                                type="text"
                                value={quickFormData.phone || ''}
                                onChange={(e) => setQuickFormData({ ...quickFormData, phone: e.target.value })}
                                className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-300 focus:border-gold focus:ring-1 focus:ring-gold bg-white"
                                placeholder="+603 2284 8899"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                              Alamat Penuh
                            </label>
                            <textarea
                              rows={2}
                              value={quickFormData.address || ''}
                              onChange={(e) => setQuickFormData({ ...quickFormData, address: e.target.value })}
                              className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-300 focus:border-gold focus:ring-1 focus:ring-gold bg-white"
                              placeholder="No. 88, Jalan Maarof, Bangsar"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                              Pautan Google Maps URL
                            </label>
                            <input
                              type="url"
                              value={quickFormData.mapUrl || ''}
                              onChange={(e) => setQuickFormData({ ...quickFormData, mapUrl: e.target.value })}
                              className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-300 focus:border-gold focus:ring-1 focus:ring-gold bg-white"
                              placeholder="https://maps.google.com/..."
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions Bar */}
                    <div className="p-3.5 sm:px-5 sm:py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs font-sans">
                      {!isQuickEditing ? (
                        <>
                          <div className="flex items-center space-x-3">
                            <a
                              href={s.mapUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-600 hover:text-forest font-medium flex items-center space-x-1 hover:underline cursor-pointer"
                            >
                              <span>View Map</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>

                            <button
                              type="button"
                              onClick={() => handleDeleteShowroom(s.id, s.name)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Padam studio ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center space-x-2">
                            {/* Quick Edit Trigger */}
                            <button
                              type="button"
                              onClick={() => handleStartQuickEdit(s)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-gold text-forest font-bold rounded-xl shadow-2xs hover:bg-amber-50/50 transition-all cursor-pointer"
                            >
                              <Sparkles className="w-3 h-3 text-gold" />
                              <span>Quick Edit</span>
                            </button>

                            {/* Full Modal Edit Trigger */}
                            <button
                              type="button"
                              onClick={() => setEditingShowroom({ ...s })}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-forest-dark hover:bg-forest text-warmwhite font-bold rounded-xl shadow-2xs transition-all cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3 text-gold" />
                              <span>Edit Penuh</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        /* Quick Edit Controls */
                        <div className="w-full flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={handleCancelQuickEdit}
                            disabled={isQuickSaving}
                            className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold rounded-xl transition-all cursor-pointer"
                          >
                            Batal
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSaveQuickEdit(s)}
                            disabled={isQuickSaving}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                          >
                            {isQuickSaving ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Menyimpan...</span>
                              </>
                            ) : (
                              <>
                                <Save className="w-3.5 h-3.5" />
                                <span>Simpan Segera</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ) : (
        /* APPOINTMENTS TAB */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden font-sans">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Menunjukkan <strong className="text-forest-dark font-bold">{filteredAppointments.length}</strong> daripada {appointments.length} tempahan
            </span>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-bold text-forest-dark text-sm">Tiada tempahan janji temu dijumpai</p>
              <p className="text-xs text-secondary max-w-sm mx-auto">
                {search
                  ? 'Cuba kosongkan carian untuk melihat semua tempahan konsultasi.'
                  : 'Tiada rekod tempahan mattress consultation sesi peribadi yang aktif buat masa ini.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Studio / Preferred Date</th>
                    <th className="py-3.5 px-4">Notes</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-forest-dark">{apt.customerName}</td>
                      <td className="py-4 px-4 text-secondary">
                        <div className="font-medium text-slate-800">{apt.customerEmail}</div>
                        <div className="text-[11px] text-slate-400">{apt.customerPhone}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-charcoal block">{apt.showroomId}</span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {apt.preferredDate} at {apt.preferredTime}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-secondary max-w-xs truncate">
                        {apt.notes || 'Tiada nota'}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            apt.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : apt.status === 'cancelled'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        {apt.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateAppointment(apt.id, 'confirmed')}
                            className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-2xs"
                          >
                            Confirm
                          </button>
                        )}
                        {apt.status !== 'cancelled' && (
                          <button
                            onClick={() => handleUpdateAppointment(apt.id, 'cancelled')}
                            className="px-2.5 py-1 border border-rose-200 text-rose-600 hover:bg-rose-50 text-[10px] font-bold rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 6. Full Modal Edit Showroom (For Deep Configuration) */}
      {editingShowroom && (
        <div className="fixed inset-0 z-50 bg-forest-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-warmwhite w-full max-w-md rounded-3xl border border-borderLight shadow-2xl overflow-hidden font-sans">
            <div className="p-5 sm:p-6 bg-forest-dark text-warmwhite flex items-center justify-between border-b border-borderLight/20">
              <div>
                <h3 className="font-serif text-lg font-bold">
                  {editingShowroom.id.startsWith('shw-') && !showrooms.some((s) => s.id === editingShowroom.id)
                    ? 'Tambah Showroom Studio Baharu'
                    : 'Konfigurasi Penuh Galeri Studio'}
                </h3>
                <p className="text-[11px] text-warmwhite/70">
                  Tetapkan alamat lengkap, pautan Google Maps, waktu & status galeri.
                </p>
              </div>
              <button
                onClick={() => setEditingShowroom(null)}
                className="text-warmwhite/60 hover:text-warmwhite text-lg font-bold p-1 rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveShowroom} className="p-5 sm:p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-forest-dark mb-1">Nama Studio *</label>
                <input
                  type="text"
                  required
                  value={editingShowroom.name}
                  onChange={(e) =>
                    setEditingShowroom({ ...editingShowroom, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-borderLight bg-white"
                  placeholder="Contoh: Bangsar Flagship Sleep Gallery"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-dark mb-1">Negeri *</label>
                <input
                  type="text"
                  required
                  value={editingShowroom.state}
                  onChange={(e) =>
                    setEditingShowroom({ ...editingShowroom, state: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-borderLight bg-white"
                  placeholder="Contoh: WP Kuala Lumpur"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-dark mb-1">Alamat Penuh *</label>
                <textarea
                  rows={2}
                  required
                  value={editingShowroom.address}
                  onChange={(e) =>
                    setEditingShowroom({ ...editingShowroom, address: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-borderLight bg-white"
                  placeholder="No. 88, Jalan Maarof, Bangsar..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-dark mb-1">No. Telefon</label>
                  <input
                    type="text"
                    value={editingShowroom.phone}
                    onChange={(e) =>
                      setEditingShowroom({ ...editingShowroom, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-borderLight bg-white"
                    placeholder="+603 2284 8899"
                  />
                </div>
                <div>
                  <label className="block font-bold text-forest-dark mb-1">Waktu Operasi</label>
                  <input
                    type="text"
                    value={editingShowroom.openingHours}
                    onChange={(e) =>
                      setEditingShowroom({ ...editingShowroom, openingHours: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-borderLight bg-white"
                    placeholder="Mon - Sun: 10:00 AM - 10:00 PM"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-forest-dark mb-1">Google Maps URL</label>
                <input
                  type="url"
                  value={editingShowroom.mapUrl}
                  onChange={(e) =>
                    setEditingShowroom({ ...editingShowroom, mapUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-borderLight bg-white"
                  placeholder="https://maps.google.com/..."
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveShowroom"
                  checked={editingShowroom.isActive}
                  onChange={(e) =>
                    setEditingShowroom({ ...editingShowroom, isActive: e.target.checked })
                  }
                  className="w-4 h-4 accent-forest"
                />
                <label htmlFor="isActiveShowroom" className="font-bold text-forest-dark cursor-pointer text-xs">
                  Galeri dibuka & menerima tempahan konsultasi pelanggan
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-borderLight">
                <button
                  type="button"
                  onClick={() => setEditingShowroom(null)}
                  className="px-4 py-2 font-bold text-secondary hover:text-charcoal"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-forest-dark hover:bg-forest text-warmwhite font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Studio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
