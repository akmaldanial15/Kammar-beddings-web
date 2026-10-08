'use client'

import React, { useState } from 'react'
import { SiteSettings } from '@/types'
import {
  Save,
  CheckCircle,
  AlertCircle,
  Building,
  Phone,
  Mail,
  Truck,
  Bell,
  ShieldCheck,
  Search,
  X,
  Sparkles,
  RefreshCw,
  Sliders,
  MapPin,
  ExternalLink,
} from 'lucide-react'

interface SettingsClientProps {
  initialSettings: SiteSettings
  currentAdminName?: string
  currentAdminEmail?: string
}

type SettingsSection = 'all' | 'brand' | 'admin' | 'announcement' | 'contact' | 'shipping'

export function SettingsClient({
  initialSettings,
  currentAdminName = 'Kamaar Admin',
  currentAdminEmail = 'admin@kamaarbeddings.com',
}: SettingsClientProps) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings)
  const [adminName, setAdminName] = useState(currentAdminName)
  const [isSaving, setIsSaving] = useState(false)
  const [savingSection, setSavingSection] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [search, setSearch] = useState('')
  const [selectedSection, setSelectedSection] = useState<SettingsSection>('all')

  const handleSave = async (sectionName?: string) => {
    if (sectionName) {
      setSavingSection(sectionName)
    } else {
      setIsSaving(true)
    }
    setFeedback(null)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings, adminName }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSettings(data.settings)
        setFeedback({
          text: sectionName
            ? `Bahagian "${sectionName}" berjaya disimpan ke pangkalan data!`
            : 'Semua tetapan kedai KAMAAR berjaya dikemaskini dan disimpan!',
          type: 'success',
        })
      } else {
        setFeedback({ text: data.error || 'Gagal menyimpan tetapan.', type: 'error' })
      }
    } catch {
      setFeedback({ text: 'Ralat komunikasi pelayan semasa menyimpan tetapan.', type: 'error' })
    } finally {
      setIsSaving(false)
      setSavingSection(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    handleSave()
  }

  // Filter helper: checks if a section matches search query
  const q = search.toLowerCase().trim()

  const matchesBrand =
    !q ||
    'brand jenama atelier details tagline philosophy'.includes(q) ||
    settings.brandName.toLowerCase().includes(q) ||
    settings.tagline.toLowerCase().includes(q)

  const matchesAdmin =
    !q ||
    'admin staff profil pentadbir nama email emel owner role'.includes(q) ||
    adminName.toLowerCase().includes(q) ||
    currentAdminEmail.toLowerCase().includes(q)

  const matchesAnnouncement =
    !q ||
    'announcement banner pengumuman promo bar notifikasi notice'.includes(q) ||
    settings.announcementText.toLowerCase().includes(q)

  const matchesContact =
    !q ||
    'contact phone telefon whatsapp email concierge customer care bantuan sokongan'.includes(q) ||
    settings.contactPhone.toLowerCase().includes(q) ||
    settings.contactEmail.toLowerCase().includes(q) ||
    settings.whatsappNumber.toLowerCase().includes(q)

  const matchesShipping =
    !q ||
    'shipping delivery penghantaran pos threshold percuma currency ringgit myr mata wang'.includes(q) ||
    settings.currency.toLowerCase().includes(q)

  const showBrand = (selectedSection === 'all' || selectedSection === 'brand') && matchesBrand
  const showAdmin = (selectedSection === 'all' || selectedSection === 'admin') && matchesAdmin
  const showAnnouncement =
    (selectedSection === 'all' || selectedSection === 'announcement') && matchesAnnouncement
  const showContact = (selectedSection === 'all' || selectedSection === 'contact') && matchesContact
  const showShipping = (selectedSection === 'all' || selectedSection === 'shipping') && matchesShipping

  const anyMatch = showBrand || showAdmin || showAnnouncement || showContact || showShipping

  return (
    <div className="space-y-6 max-w-5xl font-sans">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm shadow-sm animate-fade-in border ${
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

      {/* Header with Direct Top Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-forest-dark/5 border border-forest-dark/10 text-forest-dark text-[10px] font-bold tracking-wider uppercase">
            <Sliders className="w-3 h-3 text-gold" />
            <span>Konfigurasi Atelier & Sistem</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-dark tracking-tight">
            Site Settings & Atelier Configuration
          </h1>
          <p className="text-xs sm:text-sm text-secondary max-w-2xl">
            Cari dan sunting tetapan jenama, profil pentadbir, palang pengumuman, saluran concierge, dan had penghantaran percuma.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleSave()}
          disabled={isSaving}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-forest-dark to-forest hover:from-forest hover:to-forest-dark text-warmwhite px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer whitespace-nowrap"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-gold" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-gold flex-shrink-0" />
              <span>Simpan Semua Tetapan</span>
            </>
          )}
        </button>
      </div>

      {/* Live Search & Quick Section Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3 font-sans">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari tetapan (cth: whatsapp, telefon, pengumuman, shipping, brand, admin)..."
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

        {/* Quick Section Tabs */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 overflow-x-auto no-scrollbar scroll-smooth text-xs">
          <button
            type="button"
            onClick={() => setSelectedSection('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex-shrink-0 ${
              selectedSection === 'all'
                ? 'bg-forest-dark text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
            }`}
          >
            Semua Tetapan
          </button>
          <button
            type="button"
            onClick={() => setSelectedSection('brand')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex-shrink-0 ${
              selectedSection === 'brand'
                ? 'bg-forest-dark text-white font-bold shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
            }`}
          >
            Jenama & Atelier
          </button>
          <button
            type="button"
            onClick={() => setSelectedSection('admin')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex-shrink-0 ${
              selectedSection === 'admin'
                ? 'bg-forest-dark text-white font-bold shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
            }`}
          >
            Profil Pentadbir
          </button>
          <button
            type="button"
            onClick={() => setSelectedSection('announcement')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex-shrink-0 ${
              selectedSection === 'announcement'
                ? 'bg-forest-dark text-white font-bold shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
            }`}
          >
            Banner Pengumuman
          </button>
          <button
            type="button"
            onClick={() => setSelectedSection('contact')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex-shrink-0 ${
              selectedSection === 'contact'
                ? 'bg-forest-dark text-white font-bold shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
            }`}
          >
            Saluran Concierge & WhatsApp
          </button>
          <button
            type="button"
            onClick={() => setSelectedSection('shipping')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex-shrink-0 ${
              selectedSection === 'shipping'
                ? 'bg-forest-dark text-white font-bold shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
            }`}
          >
            Penghantaran & Mata Wang
          </button>
        </div>
      </div>

      {!anyMatch ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3 shadow-xs">
          <Search className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="font-bold text-forest-dark text-sm">Tiada tetapan sepadan dengan &quot;{search}&quot;</p>
          <p className="text-xs text-secondary max-w-sm mx-auto">
            Cuba gunakan kata kunci lain seperti &quot;whatsapp&quot;, &quot;telefon&quot;, &quot;shipping&quot;, atau &quot;brand&quot;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('')
              setSelectedSection('all')
            }}
            className="mt-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
          >
            Reset Carian
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Brand & Store Identity */}
          {showBrand && (
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4 transition-all">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center">
                    <Building className="w-4 h-4 text-gold-dark" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-forest-dark">
                      Brand Identity & Atelier Details
                    </h3>
                    <p className="text-[11px] text-slate-400">Nama jenama dan falsafah atelier.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSave('Identiti Jenama')}
                  disabled={savingSection === 'Identiti Jenama'}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-gold text-forest text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-gold" />
                  <span>
                    {savingSection === 'Identiti Jenama' ? 'Menyimpan...' : '⚡ Quick Save'}
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-forest-dark mb-1">
                    Nama Jenama Rasmi * (Brand Name)
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.brandName}
                    onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold bg-slate-50/50"
                  />
                  <span className="text-[10px] text-secondary mt-1 block">
                    Dipaparkan secara dinamik di seluruh laman web dan invois pesanan.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-forest-dark mb-1">
                    Tagline / Falsafah Jenama
                  </label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold bg-slate-50/50"
                  />
                  <span className="text-[10px] text-secondary mt-1 block">
                    Cth: Pure Restorative Sleep, Handcrafted in Malaysia.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Admin Staff & Atelier Profile */}
          {showAdmin && (
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4 transition-all">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200/60 text-forest flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-forest-dark">
                      Profil Pentadbir KAMAAR (Admin Profile)
                    </h3>
                    <p className="text-[11px] text-slate-400">Identiti pentadbir yang dipaparkan dalam sistem.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSave('Profil Pentadbir')}
                  disabled={savingSection === 'Profil Pentadbir'}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-gold text-forest text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-gold" />
                  <span>
                    {savingSection === 'Profil Pentadbir' ? 'Menyimpan...' : '⚡ Quick Save'}
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-forest-dark mb-1">
                    Nama Rasmi Pentadbir (Admin Display Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="cth: Kamaar Admin"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold bg-slate-50/50 font-medium"
                  />
                  <span className="text-[10px] text-secondary mt-1 block">
                    Nama ini dipaparkan pada bar navigasi atas, avatar profil, dan log audit admin.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-forest-dark mb-1">
                    Emel Log Masuk Pentadbir Utama
                  </label>
                  <input
                    type="email"
                    disabled
                    value={currentAdminEmail || 'admin@kamaarbeddings.com'}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-mono"
                  />
                  <span className="text-[10px] text-secondary mt-1 block">
                    Akaun berstatus Pemilik (Store Owner).
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Storefront Announcement Bar */}
          {showAnnouncement && (
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4 transition-all">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200/60 text-purple-700 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-forest-dark">
                      Top Announcement Banner
                    </h3>
                    <p className="text-[11px] text-slate-400">Mesej promosi bar teratas di kedai awam.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSave('Banner Pengumuman')}
                  disabled={savingSection === 'Banner Pengumuman'}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-gold text-forest text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-gold" />
                  <span>
                    {savingSection === 'Banner Pengumuman' ? 'Menyimpan...' : '⚡ Quick Save'}
                  </span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-forest-dark mb-1">
                    Teks Mesej Pengumuman
                  </label>
                  <input
                    type="text"
                    value={settings.announcementText}
                    onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                    placeholder="Cth: Complimentary White-Glove In-Home Setup Across Peninsular Malaysia."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold bg-slate-50/50"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="isAnnounceActive"
                    checked={Boolean(settings.isAnnouncementActive ?? settings.announcementActive)}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        isAnnouncementActive: e.target.checked,
                        announcementActive: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-forest rounded cursor-pointer"
                  />
                  <label htmlFor="isAnnounceActive" className="font-bold text-forest-dark cursor-pointer text-xs">
                    Paparkan palang pengumuman ini kepada semua pelawat kedai
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Contact Channels & Concierge */}
          {showContact && (
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4 transition-all">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-forest-dark">
                      Concierge & Customer Care Channels
                    </h3>
                    <p className="text-[11px] text-slate-400">Nombor telefon, WhatsApp dan emel perkhidmatan pelanggan.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSave('Saluran Hubungan')}
                  disabled={savingSection === 'Saluran Hubungan'}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-gold text-forest text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-gold" />
                  <span>
                    {savingSection === 'Saluran Hubungan' ? 'Menyimpan...' : '⚡ Quick Save'}
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-forest-dark mb-1">
                    No. Telefon Atelier
                  </label>
                  <input
                    type="text"
                    value={settings.contactPhone}
                    onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                    placeholder="+60 3-2141 8900"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-dark mb-1">
                    Emel Concierge Rasmi
                  </label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    placeholder="concierge@kamaarbeddings.com"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-dark mb-1">
                    No. WhatsApp Rasmi (Direct Link)
                  </label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    placeholder="+60123456789"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold bg-slate-50/50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Shipping & Commerce Thresholds */}
          {showShipping && (
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4 transition-all">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center">
                    <Truck className="w-4 h-4 text-gold-dark" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-forest-dark">
                      Penghantaran & Had Penghantaran Percuma
                    </h3>
                    <p className="text-[11px] text-slate-400">Kelayakan penghantaran percuma dan penetapan mata wang.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSave('Penghantaran')}
                  disabled={savingSection === 'Penghantaran'}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-gold text-forest text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-gold" />
                  <span>
                    {savingSection === 'Penghantaran' ? 'Menyimpan...' : '⚡ Quick Save'}
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-forest-dark mb-1">
                    Had Minimum Penghantaran Percuma (RM)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={(settings.freeShippingThresholdSen / 100).toFixed(2)}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0
                      setSettings({ ...settings, freeShippingThresholdSen: Math.round(val * 100) })
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold bg-slate-50/50 font-mono"
                  />
                  <span className="text-[10px] text-secondary mt-1 block">
                    Pesanan aksesori dan bantal melebihi jumlah ini layak mendapat penghantaran percuma ke Semenanjung. Tilam merangkumi servis pemasangan White-Glove percuma.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-forest-dark mb-1">
                    Kod & Simbol Mata Wang
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${settings.currency} (${settings.currencySymbol})`}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500"
                  />
                  <span className="text-[10px] text-secondary mt-1 block">
                    Ditetapkan piawai kepada Ringgit Malaysia (MYR - RM).
                  </span>
                </div>

                {/* Factory Self-Pickup Section */}
                <div className="md:col-span-2 pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50/60 border border-amber-200/80">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-forest-dark block text-xs sm:text-sm">
                          Pilihan Ambil Sendiri di Kilang (Factory Self-Pickup)
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Aktifkan pilihan untuk membenarkan pelanggan mengambil tilam atau tempahan terus di kilang Tasek Gelugor (percuma kos penghantaran).
                        </p>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={Boolean(settings.selfPickupEnabled ?? true)}
                        onChange={(e) =>
                          setSettings({ ...settings, selfPickupEnabled: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-forest"></div>
                    </label>
                  </div>

                  {Boolean(settings.selfPickupEnabled ?? true) && (
                    <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-forest-dark mb-1">
                            Nama Lokasi Pengambilan (Kilang)
                          </label>
                          <input
                            type="text"
                            value={settings.pickupLocationName || ''}
                            onChange={(e) =>
                              setSettings({ ...settings, pickupLocationName: e.target.value })
                            }
                            placeholder="cth: Kilang KAMAAR Beddings (Tunas Sinar Jaya Enterprise)"
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold bg-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-forest-dark mb-1">
                            No. Telefon / WhatsApp Hubungan Kilang
                          </label>
                          <input
                            type="text"
                            value={settings.pickupContactPhone || ''}
                            onChange={(e) =>
                              setSettings({ ...settings, pickupContactPhone: e.target.value })
                            }
                            placeholder="cth: 019-478 6991"
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="block font-bold text-forest-dark mb-1">
                            Alamat Penuh Kilang
                          </label>
                          <input
                            type="text"
                            value={settings.pickupAddress || ''}
                            onChange={(e) =>
                              setSettings({ ...settings, pickupAddress: e.target.value })
                            }
                            placeholder="cth: 7878B Jalan Permatang Berangan"
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold bg-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-forest-dark mb-1">
                            Bandar, Poskod & Negeri
                          </label>
                          <input
                            type="text"
                            value={settings.pickupCityState || ''}
                            onChange={(e) =>
                              setSettings({ ...settings, pickupCityState: e.target.value })
                            }
                            placeholder="cth: 13300 Tasek Gelugor, Pulau Pinang"
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-forest-dark mb-1">
                          Waktu Operasi Kilang (Operating Hours)
                        </label>
                        <input
                          type="text"
                          value={settings.pickupOperatingHours || ''}
                          onChange={(e) =>
                            setSettings({ ...settings, pickupOperatingHours: e.target.value })
                          }
                          placeholder="cth: Isnin – Sabtu: 9:00 AM – 6:00 PM (Ahad & Cuti Umum Tutup)"
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block font-bold text-forest-dark">
                              Pautan Google Maps Lokasi Kilang
                            </label>
                            {settings.pickupGoogleMapsUrl && (
                              <a
                                href={settings.pickupGoogleMapsUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-sky-700 hover:text-sky-900 font-semibold inline-flex items-center gap-1"
                              >
                                <span>Buka Peta</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                          <input
                            type="url"
                            value={settings.pickupGoogleMapsUrl || ''}
                            onChange={(e) =>
                              setSettings({ ...settings, pickupGoogleMapsUrl: e.target.value })
                            }
                            placeholder="https://maps.google.com/?q=..."
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold bg-white font-mono text-[11px]"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block font-bold text-forest-dark">
                              Pautan Waze Lokasi Kilang (Pilihan)
                            </label>
                            {settings.pickupWazeUrl && (
                              <a
                                href={settings.pickupWazeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-sky-700 hover:text-sky-900 font-semibold inline-flex items-center gap-1"
                              >
                                <span>Buka Waze</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                          <input
                            type="url"
                            value={settings.pickupWazeUrl || ''}
                            onChange={(e) =>
                              setSettings({ ...settings, pickupWazeUrl: e.target.value })
                            }
                            placeholder="https://waze.com/ul?q=..."
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold bg-white font-mono text-[11px]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Save All Button */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200/80">
            <span className="text-xs text-slate-500">
              Perubahan disimpan secara kekal dalam pangkalan data dan terpakai kepada keseluruhan kedai.
            </span>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-forest-dark to-forest hover:from-forest hover:to-forest-dark text-warmwhite text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-gold" />
              <span>{isSaving ? 'Menyimpan Semua Perubahan...' : 'Simpan Semua Tetapan'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
