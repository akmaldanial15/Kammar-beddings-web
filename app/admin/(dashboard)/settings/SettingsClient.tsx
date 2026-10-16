'use client'

import React, { useState, useEffect } from 'react'
import { SiteSettings, Coupon } from '@/types'
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
  HelpCircle,
  Eye,
  ChevronRight,
  Tag,
} from 'lucide-react'

interface SettingsClientProps {
  initialSettings: SiteSettings
  currentAdminName?: string
  currentAdminEmail?: string
}

type SettingsSection = 'all' | 'brand' | 'admin' | 'announcement' | 'contact' | 'shipping' | 'vouchers'

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
  const [whiteGlovePreviewTab, setWhiteGlovePreviewTab] = useState<'mini' | 'detailed'>('mini')
  const [couponsFromDb, setCouponsFromDb] = useState<Coupon[]>([])

  useEffect(() => {
    fetch('/api/coupons')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCouponsFromDb(data)
        }
      })
      .catch(() => {})
  }, [])

  const defaultCouponOptions = [
    { code: 'KAMAAR3', label: 'RM3 OFF', minText: 'Min RM20', description: 'Potongan RM3 untuk belian minima RM20' },
    { code: 'KAMAAR5', label: 'RM5 OFF', minText: 'Min RM45', description: 'Potongan RM5 untuk belian minima RM45' },
    { code: 'KAMAAR10', label: 'RM10 OFF', minText: 'Min RM90', description: 'Potongan RM10 untuk belian minima RM90' },
    { code: 'KAMAAR15', label: 'RM15 OFF', minText: 'Min RM140', description: 'Potongan RM15 untuk belian minima RM140' },
    { code: 'FREESHIP', label: 'Free Pos', minText: 'Min RM80', description: 'Penghantaran Percuma Semenanjung (Min RM80)' },
    { code: 'BORONG20', label: 'RM20 OFF', minText: 'Min RM200', description: 'Diskaun Borong Kilang RM20 (Min RM200)' },
    { code: 'WELCOME10', label: '10% OFF', minText: 'Min RM100', description: 'Diskaun 10% untuk pelanggan baharu (Min RM100)' },
  ]

  const allCouponOptions = couponsFromDb.length > 0
    ? couponsFromDb.map((c) => {
        let label = ''
        if (c.discountType === 'percentage') label = `${c.discountValue}% OFF`
        else if (c.discountType === 'fixed_amount') label = `RM${Math.round(c.discountValue / 100)} OFF`
        else if (c.discountType === 'free_shipping') label = 'Free Pos'
        return {
          code: c.code,
          label: c.customBadge || label || c.code,
          minText: c.minSpendSen ? `Min RM${Math.round(c.minSpendSen / 100)}` : 'Tiada Minima',
          description: c.description || '',
        }
      })
    : defaultCouponOptions

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
    'shipping delivery penghantaran pos threshold percuma currency ringgit myr mata wang white-glove white glove modal lori popup pop-up mini box kecik'.includes(q) ||
    settings.currency.toLowerCase().includes(q) ||
    (settings.whiteGloveTitle && settings.whiteGloveTitle.toLowerCase().includes(q)) ||
    (settings.whiteGloveSubtitle && settings.whiteGloveSubtitle.toLowerCase().includes(q)) ||
    (settings.whiteGloveMiniTitle && settings.whiteGloveMiniTitle.toLowerCase().includes(q)) ||
    (settings.whiteGloveMiniDesc && settings.whiteGloveMiniDesc.toLowerCase().includes(q))

  const matchesVouchers =
    !q ||
    'voucher baucar kupon coupon diskaun discount cadangan auto guna auto-apply chip chips promosi checkout'.includes(q)

  const showBrand = (selectedSection === 'all' || selectedSection === 'brand') && matchesBrand
  const showAdmin = (selectedSection === 'all' || selectedSection === 'admin') && matchesAdmin
  const showAnnouncement =
    (selectedSection === 'all' || selectedSection === 'announcement') && matchesAnnouncement
  const showContact = (selectedSection === 'all' || selectedSection === 'contact') && matchesContact
  const showShipping = (selectedSection === 'all' || selectedSection === 'shipping') && matchesShipping
  const showVouchers = (selectedSection === 'all' || selectedSection === 'vouchers') && matchesVouchers

  const anyMatch = showBrand || showAdmin || showAnnouncement || showContact || showShipping || showVouchers

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
          <button
            type="button"
            onClick={() => setSelectedSection('vouchers')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex-shrink-0 ${
              selectedSection === 'vouchers'
                ? 'bg-forest-dark text-white font-bold shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
            }`}
          >
            Baucar & Diskaun Checkout
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

                {/* White-Glove Delivery Info Configuration (Checkout Popover & Bottom Sheet) */}
                <div className="md:col-span-2 pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-forest/5 via-gold/5 to-transparent border border-forest/15">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-forest/10 text-forest flex items-center justify-center shrink-0 mt-0.5">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-forest-dark block text-xs sm:text-sm">
                            Kandungan Mesej White-Glove (Pop-up Checkout)
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Live di Checkout
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Ubah suai teks kotak pop-up mini di sebelah ikon (?) dan tetingkap penuh terperinci yang dipaparkan semasa pelanggan menekan butang maklumat lanjut di checkout.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Form Controls (7 Columns) */}
                    <div className="lg:col-span-7 space-y-5">
                      {/* Section 1: Kotak Pop-up Mini (Tepi ?) */}
                      <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-3.5">
                        <div className="flex items-center justify-between border-b border-amber-200/50 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-amber-500/15 text-amber-800 flex items-center justify-center font-bold text-xs">
                              1
                            </span>
                            <h4 className="font-bold text-forest-dark text-xs uppercase tracking-wider">
                              Tetapan Pop-up Mini (Kotak Kecil di Sebelah ?)
                            </h4>
                          </div>
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                            Muncul Semasa Tekan / Hover ?
                          </span>
                        </div>

                        <div>
                          <label className="block font-bold text-forest-dark text-xs mb-1">
                            Tajuk Ringkas Mini:
                          </label>
                          <input
                            type="text"
                            value={settings.whiteGloveMiniTitle || ''}
                            onChange={(e) =>
                              setSettings({ ...settings, whiteGloveMiniTitle: e.target.value })
                            }
                            placeholder="Servis Kurier & Pasang Kilang"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold bg-white text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-forest-dark text-xs mb-1">
                            Penerangan Ringkas Mini:
                          </label>
                          <textarea
                            rows={2}
                            value={settings.whiteGloveMiniDesc || ''}
                            onChange={(e) =>
                              setSettings({ ...settings, whiteGloveMiniDesc: e.target.value })
                            }
                            placeholder="Dihantar terus oleh krew terlatih KAMAAR ke bilik tidur anda berserta jaminan keselamatan kilang."
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold bg-white text-xs resize-none"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-forest-dark text-xs mb-1">
                            Teks Butang Maklumat Lanjut:
                          </label>
                          <input
                            type="text"
                            value={settings.whiteGloveMiniButtonText || ''}
                            onChange={(e) =>
                              setSettings({ ...settings, whiteGloveMiniButtonText: e.target.value })
                            }
                            placeholder="Maklumat Lanjut"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold bg-white text-xs"
                          />
                          <span className="text-[10px] text-slate-500 mt-1 block">
                            Butang ini akan membuka tetingkap terperinci di bawah bila ditekan.
                          </span>
                        </div>
                      </div>

                      {/* Section 2: Tetingkap Penuh Terperinci (Modal / Window) */}
                      <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-200/60 space-y-3.5">
                        <div className="flex items-center justify-between border-b border-blue-200/50 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-blue-500/15 text-blue-800 flex items-center justify-center font-bold text-xs">
                              2
                            </span>
                            <h4 className="font-bold text-forest-dark text-xs uppercase tracking-wider">
                              Tetapan Tetingkap Penuh Terperinci (Window / Bottom Sheet)
                            </h4>
                          </div>
                          <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                            Muncul Bila Tekan Butang
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="block font-bold text-forest-dark text-xs mb-1">
                              Tajuk Utama Servis:
                            </label>
                            <input
                              type="text"
                              value={settings.whiteGloveTitle || ''}
                              onChange={(e) =>
                                setSettings({ ...settings, whiteGloveTitle: e.target.value })
                              }
                              placeholder="Penghantaran White-Glove"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold bg-white text-xs"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-forest-dark text-xs mb-1">
                              Label Kurier / Caj (Notice):
                            </label>
                            <input
                              type="text"
                              value={settings.whiteGloveNotice || ''}
                              onChange={(e) =>
                                setSettings({ ...settings, whiteGloveNotice: e.target.value })
                              }
                              placeholder="Kurier Kilang"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold bg-white text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-forest-dark text-xs mb-1">
                            Ayat Pengenalan (Subtitle):
                          </label>
                          <input
                            type="text"
                            value={settings.whiteGloveSubtitle || ''}
                            onChange={(e) =>
                              setSettings({ ...settings, whiteGloveSubtitle: e.target.value })
                            }
                            placeholder="Servis logistik premium khas terus dari kilang KAMAAR ke kediaman anda:"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold bg-white text-xs"
                          />
                        </div>

                        <div className="space-y-2.5 pt-1">
                          <label className="block font-bold text-forest-dark text-xs">
                            3 Poin Keistimewaan Servis (Bullet Points):
                          </label>
                          <div>
                            <span className="text-[10px] text-slate-500 font-semibold block mb-0.5">Poin 1:</span>
                            <input
                              type="text"
                              value={settings.whiteGloveFeature1 || ''}
                              onChange={(e) =>
                                setSettings({ ...settings, whiteGloveFeature1: e.target.value })
                              }
                              placeholder="Masuk Bilik Tidur — 2 krew angkat terus ke bilik"
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold bg-white text-xs"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 font-semibold block mb-0.5">Poin 2:</span>
                            <input
                              type="text"
                              value={settings.whiteGloveFeature2 || ''}
                              onChange={(e) =>
                                setSettings({ ...settings, whiteGloveFeature2: e.target.value })
                              }
                              placeholder="Unboxing & Pasang — Buka & pasang tilam di katil"
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold bg-white text-xs"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 font-semibold block mb-0.5">Poin 3:</span>
                            <input
                              type="text"
                              value={settings.whiteGloveFeature3 || ''}
                              onChange={(e) =>
                                setSettings({ ...settings, whiteGloveFeature3: e.target.value })
                              }
                              placeholder="Insurans Kilang — Kalis cuaca & dilindungi penuh"
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold bg-white text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-forest-dark text-xs mb-1">
                            Teks Butang Tutup Modal:
                          </label>
                          <input
                            type="text"
                            value={settings.whiteGloveModalCloseText || ''}
                            onChange={(e) =>
                              setSettings({ ...settings, whiteGloveModalCloseText: e.target.value })
                            }
                            placeholder="Faham & Tutup"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold bg-white text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Live Mobile Preview Box (5 Columns) */}
                    <div className="lg:col-span-5 bg-slate-900/95 rounded-2xl p-4 text-white flex flex-col justify-between border border-slate-800 shadow-inner">
                      <div>
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
                          <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                            <Eye className="w-3.5 h-3.5 text-gold" />
                            <span>Pratonton Langsung di Telefon</span>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-mono">Live Sync</span>
                        </div>

                        {/* Interactive Tab Switcher for Preview */}
                        <div className="flex p-1 bg-slate-800 rounded-xl mb-3 text-xs">
                          <button
                            type="button"
                            onClick={() => setWhiteGlovePreviewTab('mini')}
                            className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                              whiteGlovePreviewTab === 'mini'
                                ? 'bg-forest text-white shadow-xs'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Kotak Mini (Tepi ?)
                          </button>
                          <button
                            type="button"
                            onClick={() => setWhiteGlovePreviewTab('detailed')}
                            className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                              whiteGlovePreviewTab === 'detailed'
                                ? 'bg-forest text-white shadow-xs'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Tetingkap Terperinci
                          </button>
                        </div>

                        {/* Simulated Phone Screen */}
                        <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-slate-700/60 shadow-lg">
                          {/* Simulated Checkout Row */}
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-charcoal flex items-center justify-between text-xs mb-2">
                            <div className="flex items-center gap-1.5 font-medium">
                              <span>{settings.whiteGloveTitle || 'Penghantaran White-Glove'}</span>
                              <span className="w-4 h-4 rounded-full bg-forest/15 text-forest flex items-center justify-center text-[10px] font-bold">
                                ?
                              </span>
                            </div>
                            <span className="font-bold text-forest">RM15.00</span>
                          </div>

                          {/* Preview View: Mini Pop-up */}
                          {whiteGlovePreviewTab === 'mini' ? (
                            <div className="bg-white text-charcoal rounded-2xl p-3 border border-slate-200 shadow-xl space-y-2 relative animate-in fade-in zoom-in-95">
                              <div className="flex items-start justify-between gap-1.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="p-1 rounded-md bg-gold/15 text-gold-dark shrink-0">
                                    <Truck className="w-3.5 h-3.5" />
                                  </span>
                                  <h5 className="font-bold text-forest text-xs truncate">
                                    {settings.whiteGloveMiniTitle || 'Servis Kurier & Pasang Kilang'}
                                  </h5>
                                </div>
                                <span className="text-slate-400 text-xs">✕</span>
                              </div>

                              <p className="text-[10.5px] text-slate-600 leading-snug">
                                {settings.whiteGloveMiniDesc || 'Dihantar terus oleh krew terlatih KAMAAR ke bilik tidur anda berserta jaminan keselamatan kilang.'}
                              </p>

                              <button
                                type="button"
                                onClick={() => setWhiteGlovePreviewTab('detailed')}
                                className="w-full py-1.5 px-2.5 bg-forest hover:bg-forest-light text-white font-medium text-[10.5px] rounded-lg transition-all flex items-center justify-between cursor-pointer shadow-2xs"
                              >
                                <span>{settings.whiteGloveMiniButtonText || 'Maklumat Lanjut'}</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            /* Preview View: Detailed Window */
                            <div className="bg-white text-charcoal rounded-2xl p-3.5 border border-slate-200 shadow-xl space-y-2.5 animate-in fade-in slide-in-from-bottom-2">
                              <div className="w-8 h-1 bg-neutral-300 rounded-full mx-auto" />
                              <div className="flex items-center gap-2">
                                <span className="p-1 rounded-md bg-gold/15 text-gold-dark shrink-0">
                                  <Truck className="w-3.5 h-3.5" />
                                </span>
                                <div>
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-gold-dark block">
                                    Servis Logistik Eksklusif
                                  </span>
                                  <h5 className="font-bold text-forest text-xs truncate">
                                    {settings.whiteGloveTitle || 'Penghantaran White-Glove'}
                                  </h5>
                                </div>
                              </div>
                              <p className="text-[10px] text-slate-500 leading-tight">
                                {settings.whiteGloveSubtitle || 'Servis logistik premium khas terus dari kilang KAMAAR ke kediaman anda:'}
                              </p>
                              <ul className="space-y-1.5 text-[10px] bg-slate-50 p-2 rounded-xl border border-slate-100">
                                <li className="flex items-center gap-1.5">
                                  <span className="w-3.5 h-3.5 rounded-full bg-forest/10 text-forest flex items-center justify-center font-bold text-[8px] shrink-0">✓</span>
                                  <span className="truncate">{settings.whiteGloveFeature1 || 'Masuk Bilik Tidur — 2 krew angkat terus ke bilik'}</span>
                                </li>
                                <li className="flex items-center gap-1.5">
                                  <span className="w-3.5 h-3.5 rounded-full bg-forest/10 text-forest flex items-center justify-center font-bold text-[8px] shrink-0">✓</span>
                                  <span className="truncate">{settings.whiteGloveFeature2 || 'Unboxing & Pasang — Buka & pasang tilam di katil'}</span>
                                </li>
                                <li className="flex items-center gap-1.5">
                                  <span className="w-3.5 h-3.5 rounded-full bg-forest/10 text-forest flex items-center justify-center font-bold text-[8px] shrink-0">✓</span>
                                  <span className="truncate">{settings.whiteGloveFeature3 || 'Insurans Kilang — Kalis cuaca & dilindungi penuh'}</span>
                                </li>
                              </ul>
                              <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                                <span className="text-slate-500">Kadar Caj Logistik:</span>
                                <span className="font-bold text-forest">
                                  RM15.00 ({settings.whiteGloveNotice || 'Kurier Kilang'})
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setWhiteGlovePreviewTab('mini')}
                                className="w-full py-1.5 bg-forest text-white font-medium text-[10px] rounded-lg text-center cursor-pointer"
                              >
                                {settings.whiteGloveModalCloseText || 'Faham & Tutup'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-400 text-center mt-3">
                        Paparan di atas dikemaskini secara automatik semasa anda menyunting teks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: CHECKOUT VOUCHERS & AUTO-APPLY */}
          {showVouchers && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all">
              {/* Card Header */}
              <div className="p-6 bg-gradient-to-r from-slate-50 via-white to-amber-50/20 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-forest/10 flex items-center justify-center text-forest shadow-xs">
                    <Tag className="w-5 h-5 text-forest" />
                  </div>
                  <div>
                    <h3 className="font-bold text-forest-dark text-base sm:text-lg flex items-center gap-2">
                      <span>Tetapan Baucar & Diskaun Checkout</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold/15 text-gold-dark border border-gold/30">
                        Cadangan & Auto-Guna
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Kawal pilihan auto-guna diskaun dan pilih baucar kilang yang dipaparkan kepada pelanggan di Checkout.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSave('Baucar & Diskaun Checkout')}
                  disabled={isSaving}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-forest-dark hover:bg-forest text-warmwhite rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50 self-start sm:self-auto shrink-0"
                >
                  <Save className="w-3.5 h-3.5 text-gold" />
                  <span>{savingSection === 'Baucar & Diskaun Checkout' ? 'Menyimpan...' : 'Simpan Bahagian Ini'}</span>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Bahagian 1: Auto-Guna Baucar di Checkout */}
                <div className="space-y-4 p-5 rounded-2xl bg-slate-50/60 border border-slate-200/80">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-forest text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-gold-dark" />
                        <span>Bahagian 1: Auto-Guna Baucar di Checkout</span>
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Apabila diaktifkan (tetapan lalai), sistem akan memilih dan menebus baucar yang paling menguntungkan pelanggan secara automatik tanpa pelanggan perlu menaip kod secara manual. Pelanggan masih boleh membatalkan atau menukar baucar jika mahu.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={settings.checkoutAutoApplyVoucherEnabled !== false}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            checkoutAutoApplyVoucherEnabled: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-forest"></div>
                    </label>
                  </div>

                  {/* Pilihan Mod Auto-Guna Baucar */}
                  {settings.checkoutAutoApplyVoucherEnabled !== false && (
                    <div className="pt-4 border-t border-slate-200/60 space-y-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-800">
                          Kaedah Pemilihan Baucar Auto-Guna:
                        </label>
                        <p className="text-[11px] text-slate-500">
                          Pilih sama ada sistem harus menggunakan algoritma pintar untuk memilih baucar terbaik secara automatik, atau anda ingin menetapkan satu baucar khusus secara manual.
                        </p>
                      </div>

                      {/* 2 Interactive Cards: Algoritma vs Manual */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Option 1: Mod Algoritma Pintar */}
                        <div
                          onClick={() =>
                            setSettings({
                              ...settings,
                              checkoutAutoApplyMode: 'algorithm_best',
                              checkoutAutoApplyVoucherCode: 'auto_best',
                            })
                          }
                          className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                            (settings.checkoutAutoApplyMode || 'algorithm_best') === 'algorithm_best'
                              ? 'bg-emerald-50/70 border-emerald-600 shadow-xs ring-2 ring-emerald-600/10'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                  (settings.checkoutAutoApplyMode || 'algorithm_best') === 'algorithm_best'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                <Sparkles className="w-4 h-4" />
                              </div>
                              <div>
                                <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                                  <span>Mod Algoritma Pintar</span>
                                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-200/70 text-emerald-800 text-[9px] font-extrabold uppercase tracking-wider">
                                    Lalai (Disyorkan)
                                  </span>
                                </h5>
                                <p className="text-[10px] text-emerald-800 font-medium">Auto-Kesan &amp; Pilih Baucar Terbaik</p>
                              </div>
                            </div>
                            <input
                              type="radio"
                              name="checkoutAutoApplyMode"
                              checked={(settings.checkoutAutoApplyMode || 'algorithm_best') === 'algorithm_best'}
                              onChange={() =>
                                setSettings({
                                  ...settings,
                                  checkoutAutoApplyMode: 'algorithm_best',
                                  checkoutAutoApplyVoucherCode: 'auto_best',
                                })
                              }
                              className="mt-1 accent-emerald-600 cursor-pointer"
                            />
                          </div>
                          <p className="mt-2.5 text-[11px] text-slate-600 leading-relaxed">
                            Algoritma KAMAAR mengira nilai troli secara dinamik dan memilih baucar yang memberi <strong>penjimatan tunai tertinggi (maksimum Ringgit)</strong> untuk pelanggan mengikut syarat semasa.
                          </p>
                        </div>

                        {/* Option 2: Mod Manual (Admin Tetapkan Baucar Khusus) */}
                        <div
                          onClick={() => {
                            const firstCode = allCouponOptions[0]?.code || 'KAMAAR3'
                            setSettings({
                              ...settings,
                              checkoutAutoApplyMode: 'manual_specific',
                              checkoutAutoApplyVoucherCode:
                                settings.checkoutAutoApplyVoucherCode && settings.checkoutAutoApplyVoucherCode !== 'auto_best'
                                  ? settings.checkoutAutoApplyVoucherCode
                                  : firstCode,
                            })
                          }}
                          className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                            settings.checkoutAutoApplyMode === 'manual_specific'
                              ? 'bg-blue-50/70 border-blue-600 shadow-xs ring-2 ring-blue-600/10'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                  settings.checkoutAutoApplyMode === 'manual_specific'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                <Tag className="w-4 h-4" />
                              </div>
                              <div>
                                <h5 className="text-xs font-bold text-slate-900">Mod Manual (Tetapan Admin)</h5>
                                <p className="text-[10px] text-blue-800 font-medium">Khas 1 Kod Baucar Pilihan Anda</p>
                              </div>
                            </div>
                            <input
                              type="radio"
                              name="checkoutAutoApplyMode"
                              checked={settings.checkoutAutoApplyMode === 'manual_specific'}
                              onChange={() => {
                                const firstCode = allCouponOptions[0]?.code || 'KAMAAR3'
                                setSettings({
                                  ...settings,
                                  checkoutAutoApplyMode: 'manual_specific',
                                  checkoutAutoApplyVoucherCode:
                                    settings.checkoutAutoApplyVoucherCode && settings.checkoutAutoApplyVoucherCode !== 'auto_best'
                                      ? settings.checkoutAutoApplyVoucherCode
                                      : firstCode,
                                })
                              }}
                              className="mt-1 accent-blue-600 cursor-pointer"
                            />
                          </div>
                          <p className="mt-2.5 text-[11px] text-slate-600 leading-relaxed">
                            Admin memilih <strong>satu kod baucar khusus</strong> untuk sentiasa diguna secara automatik selagi troli pelanggan layak.
                          </p>
                        </div>
                      </div>

                      {/* Dropdown if Mod Manual is selected */}
                      {settings.checkoutAutoApplyMode === 'manual_specific' && (
                        <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2 animate-in fade-in duration-200">
                          <label className="block text-xs font-bold text-slate-800">
                            Pilih Kod Baucar Manual Yang Hendak Diguna Secara Automatik:
                          </label>
                          <select
                            value={
                              settings.checkoutAutoApplyVoucherCode && settings.checkoutAutoApplyVoucherCode !== 'auto_best'
                                ? settings.checkoutAutoApplyVoucherCode
                                : allCouponOptions[0]?.code || 'KAMAAR3'
                            }
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                checkoutAutoApplyMode: 'manual_specific',
                                checkoutAutoApplyVoucherCode: e.target.value,
                              })
                            }
                            className="w-full sm:w-auto min-w-[300px] px-3.5 py-2.5 rounded-xl border border-blue-300 text-xs text-slate-900 bg-white font-semibold outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 cursor-pointer shadow-2xs"
                          >
                            {allCouponOptions.map((c) => (
                              <option key={c.code} value={c.code}>
                                Kod {c.code} — {c.label} ({c.minText})
                              </option>
                            ))}
                          </select>
                          <p className="text-[11px] text-slate-600">
                            Sistem akan sentiasa mengguna kod <strong>{settings.checkoutAutoApplyVoucherCode && settings.checkoutAutoApplyVoucherCode !== 'auto_best' ? settings.checkoutAutoApplyVoucherCode : (allCouponOptions[0]?.code || 'KAMAAR3')}</strong> secara automatik kepada semua pelanggan jika troli mereka layak.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bahagian 2: Pilihan Cadangan Baucar Kilang yang Dipaparkan */}
                <div className="space-y-4 p-5 rounded-2xl bg-slate-50/60 border border-slate-200/80">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-forest text-sm flex items-center gap-2">
                        <Tag className="w-4 h-4 text-forest" />
                        <span>Bahagian 2: Barisan Cip Cadangan Baucar Kilang di Checkout</span>
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Tandakan baucar-baucar yang anda ingin paparkan sebagai butang cip cadangan pantas di bawah kotak baucar di Checkout.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={settings.checkoutSuggestedVouchersEnabled !== false}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            checkoutSuggestedVouchersEnabled: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-forest"></div>
                    </label>
                  </div>

                  {settings.checkoutSuggestedVouchersEnabled !== false && (
                    <div className="pt-3 border-t border-slate-200/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">
                          Pilih Baucar Untuk Dipaparkan di Checkout:
                        </span>
                        <div className="flex items-center gap-2 text-[11px]">
                          <button
                            type="button"
                            onClick={() =>
                              setSettings({
                                ...settings,
                                checkoutSuggestedVoucherCodes: allCouponOptions.map((c) => c.code),
                              })
                            }
                            className="text-forest hover:underline font-semibold cursor-pointer"
                          >
                            Pilih Semua
                          </button>
                          <span className="text-slate-300">•</span>
                          <button
                            type="button"
                            onClick={() =>
                              setSettings({
                                ...settings,
                                checkoutSuggestedVoucherCodes: ['KAMAAR3', 'KAMAAR5', 'KAMAAR10', 'FREESHIP'],
                              })
                            }
                            className="text-forest hover:underline font-semibold cursor-pointer"
                          >
                            Lalai Standard
                          </button>
                          <span className="text-slate-300">•</span>
                          <button
                            type="button"
                            onClick={() =>
                              setSettings({
                                ...settings,
                                checkoutSuggestedVoucherCodes: [],
                              })
                            }
                            className="text-slate-500 hover:underline cursor-pointer"
                          >
                            Kosongkan
                          </button>
                        </div>
                      </div>

                      {/* Checkboxes grid for each coupon */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {allCouponOptions.map((c) => {
                          const currentCodes = settings.checkoutSuggestedVoucherCodes || ['KAMAAR3', 'KAMAAR5', 'KAMAAR10', 'FREESHIP']
                          const isChecked = currentCodes.includes(c.code)
                          return (
                            <label
                              key={c.code}
                              className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                                isChecked
                                  ? 'bg-forest/5 border-forest/30 text-forest shadow-2xs'
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  const nextCodes = e.target.checked
                                    ? [...currentCodes, c.code]
                                    : currentCodes.filter((code) => code !== c.code)
                                  setSettings({
                                    ...settings,
                                    checkoutSuggestedVoucherCodes: nextCodes,
                                  })
                                }}
                                className="mt-0.5 rounded text-forest focus:ring-forest cursor-pointer"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 font-bold font-mono">
                                  <span>{c.code}</span>
                                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-gold/15 text-gold-dark font-sans font-semibold">
                                    {c.label}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                                  {c.description || c.minText}
                                </p>
                              </div>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bahagian 3: Pratonton Langsung Interaktif di Checkout */}
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-forest" />
                      <h5 className="font-bold text-forest text-xs uppercase tracking-wider">
                        Pratonton Langsung di Halaman Checkout Pelanggan
                      </h5>
                    </div>
                    <span className="text-[10px] text-slate-500">Live Simulation</span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-[#D5CEC2] shadow-xs space-y-3 max-w-md mx-auto">
                    {/* Input Box */}
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 px-3 py-2 rounded-xl border border-[#D5CEC2] bg-[#FAF7F2]/50 text-xs font-mono uppercase text-slate-400">
                        KOD DISKAUN / BAUCAR
                      </div>
                      <div className="px-4 py-2 rounded-xl bg-forest text-warmwhite text-xs font-bold shadow-xs">
                        Tebus
                      </div>
                    </div>

                    {/* Auto-applied badge */}
                    {settings.checkoutAutoApplyVoucherEnabled !== false && (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-forest/5 border border-forest/20 text-xs">
                        <div className="flex items-center space-x-2 text-forest font-bold">
                          <Tag className="w-3.5 h-3.5 text-gold shrink-0" />
                          <span className="font-mono text-xs">
                            {settings.checkoutAutoApplyMode === 'manual_specific' && settings.checkoutAutoApplyVoucherCode && settings.checkoutAutoApplyVoucherCode !== 'auto_best'
                              ? settings.checkoutAutoApplyVoucherCode
                              : 'KAMAAR3'}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase flex items-center gap-0.5 ${
                              settings.checkoutAutoApplyMode === 'manual_specific'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            <Sparkles className="w-2.5 h-2.5" />
                            {settings.checkoutAutoApplyMode === 'manual_specific'
                              ? 'Auto-Guna (Admin)'
                              : '✨ Auto-Pilih Algoritma'}
                          </span>
                          <span className="text-emerald-700 font-medium">(-RM3.00)</span>
                        </div>
                        <span className="text-xs text-red-600 underline font-medium cursor-pointer">
                          Batalkan
                        </span>
                      </div>
                    )}

                    {/* Suggested chips */}
                    {settings.checkoutSuggestedVouchersEnabled !== false && (
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[11px] text-slate-500 flex items-center justify-between">
                          <span>
                            {settings.checkoutAutoApplyVoucherEnabled !== false
                              ? 'Pilihan baucar lain (klik untuk tukar):'
                              : 'Cadangan baucar kilang:'}
                          </span>
                          <span className="text-forest underline font-bold cursor-pointer">
                            Cuba KAMAAR3 (-RM3)
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(settings.checkoutSuggestedVoucherCodes || ['KAMAAR3', 'KAMAAR5', 'KAMAAR10', 'FREESHIP']).map(
                            (code) => {
                              const found = allCouponOptions.find((c) => c.code === code)
                              const label = found ? found.label : code
                              const isSelected =
                                settings.checkoutAutoApplyVoucherEnabled !== false &&
                                (settings.checkoutAutoApplyVoucherCode === code ||
                                  ((!settings.checkoutAutoApplyVoucherCode || settings.checkoutAutoApplyVoucherCode === 'auto_best') &&
                                    code === 'KAMAAR3'))
                              return (
                                <span
                                  key={code}
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold border ${
                                    isSelected
                                      ? 'bg-forest text-warmwhite border-forest shadow-xs font-bold'
                                      : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  }`}
                                >
                                  <Tag className="w-2.5 h-2.5" />
                                  <span>{code}</span>
                                  <span className="text-[9px] opacity-80 font-normal">({label})</span>
                                  {isSelected && <span className="ml-0.5 font-bold text-gold">✓</span>}
                                </span>
                              )
                            }
                          )}
                        </div>
                      </div>
                    )}
                  </div>
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
