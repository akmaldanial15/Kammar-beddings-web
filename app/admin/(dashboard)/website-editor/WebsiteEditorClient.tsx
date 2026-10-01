'use client'

import React, { useState } from 'react'
import { WebsiteConfig, HeroSlideConfig, ReassuranceItemConfig } from '@/types'
import {
  Palette,
  Image as ImageIcon,
  Bell,
  Sparkles,
  BookOpen,
  Tag,
  Share2,
  Wand2,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  Plus,
  Trash2,
  Eye,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw as TrialIcon,
  Phone,
  Mail,
  MapPin,
  HelpCircle,
  Layers,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  initialConfig: WebsiteConfig
}

type TabType = 'theme' | 'hero' | 'announcement' | 'reassurance' | 'story' | 'promotions' | 'contact' | 'visual'

const THEME_PRESETS = [
  {
    id: 'sapphire-gold',
    name: 'KAMAAR Sapphire & Gold (Rasmi)',
    desc: 'Biru nilam diraja mewah dipadankan dengan emas hangat eksklusif.',
    primary: '#1E4E8C',
    dark: '#13325B',
    gold: '#B49A58',
    cream: '#F4F7FB',
  },
  {
    id: 'emerald-botanic',
    name: 'Emerald Forest & Champagne',
    desc: 'Hijau zamrud organik melambangkan 100% susu getah asli semula jadi.',
    primary: '#1B4D3E',
    dark: '#0D2A20',
    gold: '#C2A649',
    cream: '#F3F7F4',
  },
  {
    id: 'obsidian-luxe',
    name: 'Obsidian Black & Platinum',
    desc: 'Gaya monokrom moden suite hotel ultra-mewah kontemporari.',
    primary: '#1F242D',
    dark: '#0E1117',
    gold: '#D4AF37',
    cream: '#F8F9FA',
  },
  {
    id: 'royal-bordeaux',
    name: 'Royal Bordeaux & Velvet Gold',
    desc: 'Sentuhan merah wain mewah romantik dengan keanggunan sutera.',
    primary: '#5B1E2B',
    dark: '#3A0F19',
    gold: '#D4AF37',
    cream: '#FAF5F6',
  },
  {
    id: 'nordic-slate',
    name: 'Nordic Coastal Slate',
    desc: 'Gaya Skandinavia minimalis berhawa dingin dan menenangkan jiwa.',
    primary: '#243B53',
    dark: '#102A43',
    gold: '#BA9B52',
    cream: '#F0F4F8',
  },
]

const SAMPLE_BEDROOM_IMAGES = [
  {
    label: 'Kamar Tidur Utama (Master Suite)',
    url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1800&q=85',
  },
  {
    label: 'Tilam Hibrid Dingin (Cooling Hybrid)',
    url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1800&q=85',
  },
  {
    label: 'Suite Mewah Presidential (Sovereign Luxe)',
    url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1800&q=85',
  },
  {
    label: 'Bilik Tidur Minimalis Linen Kayu',
    url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=85',
  },
  {
    label: 'Kamar Tropikal Semula Jadi (Organic Latex)',
    url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1800&q=85',
  },
]

export function WebsiteEditorClient({ initialConfig }: Props) {
  const [config, setConfig] = useState<WebsiteConfig>(initialConfig)
  const [activeTab, setActiveTab] = useState<TabType>('theme')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Handle saving to database
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsSaving(true)
    setSaveSuccess(false)
    setErrorMessage('')

    try {
      const res = await fetch('/api/admin/website-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setConfig(data.config)
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        setErrorMessage(data.error || 'Gagal menyimpan perubahan laman web.')
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Ralat sambungan pelayan.')
    } finally {
      setIsSaving(false)
    }
  }

  // Preset theme applicator
  const applyPreset = (preset: typeof THEME_PRESETS[0]) => {
    setConfig((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        primaryColor: preset.primary,
        primaryDarkColor: preset.dark,
        accentGoldColor: preset.gold,
        creamColor: preset.cream,
        activePreset: preset.id,
      },
      announcement: {
        ...prev.announcement,
        bgColor: preset.dark,
      },
    }))
  }

  // Hero Slide Handlers
  const handleAddSlide = () => {
    const newSlide: HeroSlideConfig = {
      id: `slide-${Date.now()}`,
      badge: 'Koleksi Khas Terbaru',
      title: 'Tidur lena idaman bermula di sini.',
      subtitle: 'Direka khas dengan 100% susu getah asli organik dan zon sokongan tulang belakang ergonomik.',
      ctaText: 'Terokai Tilam',
      ctaLink: '/collections/mattress',
      secondaryCtaText: 'Kuis Pencari Tilam',
      secondaryCtaLink: '/finder',
      imageUrl: SAMPLE_BEDROOM_IMAGES[0].url,
      isActive: true,
    }
    setConfig((prev) => ({
      ...prev,
      hero: {
        slides: [...prev.hero.slides, newSlide],
      },
    }))
  }

  const handleUpdateSlide = (id: string, updates: Partial<HeroSlideConfig>) => {
    setConfig((prev) => ({
      ...prev,
      hero: {
        slides: prev.hero.slides.map((s) => (s.id === id ? { ...s, ...updates } : s)),
      },
    }))
  }

  const handleDeleteSlide = (id: string) => {
    if (config.hero.slides.length <= 1) {
      alert('Slaid utama mesti mempunyai sekurang-kurangnya 1 gambar/slaid.')
      return
    }
    if (!confirm('Padam slaid ini daripada karusel utama?')) return
    setConfig((prev) => ({
      ...prev,
      hero: {
        slides: prev.hero.slides.filter((s) => s.id !== id),
      },
    }))
  }

  const tabs = [
    { id: 'theme', label: 'Warna & Tema', icon: Palette },
    { id: 'hero', label: 'Slaid Hero & Gambar', icon: ImageIcon },
    { id: 'announcement', label: 'Palang Pengumuman', icon: Bell },
    { id: 'reassurance', label: 'Jaminan & Kelebihan', icon: Sparkles },
    { id: 'story', label: 'Kisah Atelier', icon: BookOpen },
    { id: 'promotions', label: 'Banner Promosi', icon: Tag },
    { id: 'contact', label: 'WhatsApp & Sosial', icon: Share2 },
    { id: 'visual', label: 'Animasi & Kesan', icon: Wand2 },
  ]

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {saveSuccess && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2.5 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <div className="text-xs">
            <span className="font-bold block">Berjaya Disimpan!</span>
            <span>Konfigurasi visual dan hiasan laman web telah dikemas kini.</span>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-sale/10 border border-sale/30 rounded-2xl flex items-center justify-between text-sale text-xs animate-shake">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="underline text-[11px] font-bold">
            Tutup
          </button>
        </div>
      )}

      {/* TOP HEADER CONTROLS (Live Preview + Quick Save) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-warmwhite p-3.5 sm:p-4 rounded-2xl border border-borderLight shadow-xs animate-fade-in-up delay-50">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-forest-dark">Pratonton Langsung:</span>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-cream hover:bg-gold/15 text-[#1E4E8C] border border-borderLight rounded-xl text-xs font-semibold transition-all hover:scale-[1.02]"
          >
            <span>Buka Laman Web Awam</span>
            <ExternalLink className="w-3 h-3 text-gold-dark" />
          </Link>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-2.5 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer hover:scale-[1.02]"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </div>

      {/* HORIZONTAL SWIPEABLE TABS BAR */}
      <div className="bg-warmwhite rounded-2xl border border-borderLight p-1.5 shadow-xs overflow-x-auto no-scrollbar animate-fade-in-up delay-100">
        <div className="flex items-center space-x-1 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1E4E8C] text-white shadow-xs'
                    : 'text-secondary hover:text-forest-dark hover:bg-cream/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D4AF37]' : 'text-secondary'}`} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* TAB CONTENT PANELS */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: THEME & BRAND COLORS                                               */}
        {/* ========================================================================= */}
        {activeTab === 'theme' && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Quick 1-Click Luxury Theme Presets */}
            <div className="bg-warmwhite p-4 sm:p-6 rounded-2xl border border-borderLight shadow-xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-borderLight pb-3">
                <Palette className="w-4 h-4 text-gold" />
                <h3 className="font-serif text-base sm:text-lg font-bold text-forest-dark">
                  Pilihan Pantas: Palet Tema Mewah Atelier
                </h3>
              </div>
              <p className="text-xs text-secondary">
                Pilih kombinasi warna harmoni siap sedia yang dirumus khas untuk jenama tilam dan perabot mewah KAMAAR.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {THEME_PRESETS.map((preset) => {
                  const isSelected = config.theme.primaryColor.toLowerCase() === preset.primary.toLowerCase()

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className={`text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'border-[#1E4E8C] bg-gradient-to-b from-[#1E4E8C]/5 to-warmwhite shadow-sm ring-2 ring-[#B49A58]/30'
                          : 'border-borderLight hover:border-gold/40 bg-warmwhite'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-forest-dark">{preset.name}</span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        )}
                      </div>
                      <p className="text-[11px] text-secondary leading-snug">{preset.desc}</p>
                      <div className="flex items-center space-x-1.5 pt-1">
                        <span className="w-5 h-5 rounded-full border border-black/10 shadow-2xs" style={{ backgroundColor: preset.primary }} />
                        <span className="w-5 h-5 rounded-full border border-black/10 shadow-2xs" style={{ backgroundColor: preset.dark }} />
                        <span className="w-5 h-5 rounded-full border border-black/10 shadow-2xs" style={{ backgroundColor: preset.gold }} />
                        <span className="w-5 h-5 rounded-full border border-black/10 shadow-2xs" style={{ backgroundColor: preset.cream }} />
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Granular Color Pickers */}
            <div className="bg-warmwhite p-4 sm:p-6 rounded-2xl border border-borderLight shadow-xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-borderLight pb-3">
                <Wand2 className="w-4 h-4 text-gold" />
                <h3 className="font-serif text-base sm:text-lg font-bold text-forest-dark">
                  Penyesuaian Kod Warna Terperinci
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {/* Primary Color */}
                <div className="p-3 bg-cream/40 rounded-xl border border-borderLight space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-forest-dark">Warna Utama (Primary)</label>
                    <span className="font-mono text-[11px] text-secondary">{config.theme.primaryColor}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.theme.primaryColor}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          theme: { ...config.theme, primaryColor: e.target.value },
                        })
                      }
                      className="w-10 h-10 rounded-xl cursor-pointer border border-borderLight p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={config.theme.primaryColor}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          theme: { ...config.theme, primaryColor: e.target.value },
                        })
                      }
                      className="flex-1 px-3 py-2 bg-white border border-borderLight rounded-xl uppercase font-mono text-xs"
                    />
                  </div>
                  <span className="text-[10px] text-secondary block">
                    Digunakan untuk butang CTA utama, aksen tajuk, dan lencana.
                  </span>
                </div>

                {/* Primary Dark */}
                <div className="p-3 bg-cream/40 rounded-xl border border-borderLight space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-forest-dark">Warna Gelap (Header/Footer)</label>
                    <span className="font-mono text-[11px] text-secondary">{config.theme.primaryDarkColor}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.theme.primaryDarkColor}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          theme: { ...config.theme, primaryDarkColor: e.target.value },
                        })
                      }
                      className="w-10 h-10 rounded-xl cursor-pointer border border-borderLight p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={config.theme.primaryDarkColor}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          theme: { ...config.theme, primaryDarkColor: e.target.value },
                        })
                      }
                      className="flex-1 px-3 py-2 bg-white border border-borderLight rounded-xl uppercase font-mono text-xs"
                    />
                  </div>
                  <span className="text-[10px] text-secondary block">
                    Digunakan untuk palang pengumuman, latar hero, dan footer.
                  </span>
                </div>

                {/* Accent Gold */}
                <div className="p-3 bg-cream/40 rounded-xl border border-borderLight space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-forest-dark">Warna Emas (Gold Accent)</label>
                    <span className="font-mono text-[11px] text-secondary">{config.theme.accentGoldColor}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.theme.accentGoldColor}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          theme: { ...config.theme, accentGoldColor: e.target.value },
                        })
                      }
                      className="w-10 h-10 rounded-xl cursor-pointer border border-borderLight p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={config.theme.accentGoldColor}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          theme: { ...config.theme, accentGoldColor: e.target.value },
                        })
                      }
                      className="flex-1 px-3 py-2 bg-white border border-borderLight rounded-xl uppercase font-mono text-xs"
                    />
                  </div>
                  <span className="text-[10px] text-secondary block">
                    Digunakan untuk bintang penarafan, border emas, dan ikon kelebihan.
                  </span>
                </div>

                {/* Background Warm White */}
                <div className="p-3 bg-cream/40 rounded-xl border border-borderLight space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-forest-dark">Warna Latar (Background)</label>
                    <span className="font-mono text-[11px] text-secondary">{config.theme.backgroundColor}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.theme.backgroundColor}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          theme: { ...config.theme, backgroundColor: e.target.value },
                        })
                      }
                      className="w-10 h-10 rounded-xl cursor-pointer border border-borderLight p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={config.theme.backgroundColor}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          theme: { ...config.theme, backgroundColor: e.target.value },
                        })
                      }
                      className="flex-1 px-3 py-2 bg-white border border-borderLight rounded-xl uppercase font-mono text-xs"
                    />
                  </div>
                  <span className="text-[10px] text-secondary block">
                    Warna dasar keseluruhan laman web (Default: Putih Bersih #FFFFFF).
                  </span>
                </div>

                {/* Section Cream Tint */}
                <div className="p-3 bg-cream/40 rounded-xl border border-borderLight space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-forest-dark">Warna Seksyen (Section Tint)</label>
                    <span className="font-mono text-[11px] text-secondary">{config.theme.creamColor}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.theme.creamColor}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          theme: { ...config.theme, creamColor: e.target.value },
                        })
                      }
                      className="w-10 h-10 rounded-xl cursor-pointer border border-borderLight p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={config.theme.creamColor}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          theme: { ...config.theme, creamColor: e.target.value },
                        })
                      }
                      className="flex-1 px-3 py-2 bg-white border border-borderLight rounded-xl uppercase font-mono text-xs"
                    />
                  </div>
                  <span className="text-[10px] text-secondary block">
                    Warna selang seli seksyen seperti Review, Lookbook, dan Kategori.
                  </span>
                </div>

                {/* Sale / Promo Red */}
                <div className="p-3 bg-cream/40 rounded-xl border border-borderLight space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-forest-dark">Aksen Tawaran & Jualan (Sale)</label>
                    <span className="font-mono text-[11px] text-secondary">{config.theme.saleColor}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.theme.saleColor}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          theme: { ...config.theme, saleColor: e.target.value },
                        })
                      }
                      className="w-10 h-10 rounded-xl cursor-pointer border border-borderLight p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={config.theme.saleColor}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          theme: { ...config.theme, saleColor: e.target.value },
                        })
                      }
                      className="flex-1 px-3 py-2 bg-white border border-borderLight rounded-xl uppercase font-mono text-xs"
                    />
                  </div>
                  <span className="text-[10px] text-secondary block">
                    Warna diskaun, tag jualan hangat, dan promosi masa terhad.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: HERO CAROUSEL & DECORATIVE SLIDES                                  */}
        {/* ========================================================================= */}
        {activeTab === 'hero' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-warmwhite p-4 sm:p-6 rounded-2xl border border-borderLight shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-forest-dark">
                  Pengurusan Slaid & Gambar Hiasan Utama (Hero Carousel)
                </h3>
                <p className="text-xs text-secondary mt-0.5">
                  Ubah tajuk besar, butang tindakan, dan gambar latar belakang beresolusi tinggi di bahagian atas muka depan.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddSlide}
                className="flex items-center space-x-1.5 px-4 py-2 bg-forest text-warmwhite rounded-xl text-xs font-bold hover:bg-forest-dark transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Slaid Baru</span>
              </button>
            </div>

            {/* Slides List */}
            <div className="space-y-4">
              {config.hero.slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="bg-warmwhite rounded-2xl border border-borderLight p-4 sm:p-6 space-y-4 shadow-xs"
                >
                  <div className="flex items-center justify-between border-b border-borderLight pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-forest/10 text-forest font-bold text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      <h4 className="font-bold text-sm text-forest-dark truncate max-w-xs sm:max-w-md">
                        {slide.title || 'Slaid Tanpa Tajuk'}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteSlide(slide.id)}
                      className="p-1.5 text-secondary hover:text-sale rounded-lg hover:bg-sale/10 transition-colors cursor-pointer"
                      title="Padam slaid"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Left: Slide Form Fields */}
                    <div className="lg:col-span-2 space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-charcoal mb-1">
                          Lencana Atas (Badge / Tag)
                        </label>
                        <input
                          type="text"
                          value={slide.badge}
                          onChange={(e) => handleUpdateSlide(slide.id, { badge: e.target.value })}
                          placeholder="Contoh: 100% Malaysian Organic Latex"
                          className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-charcoal mb-1">
                          Tajuk Utama Slaid (Headline) *
                        </label>
                        <input
                          type="text"
                          required
                          value={slide.title}
                          onChange={(e) => handleUpdateSlide(slide.id, { title: e.target.value })}
                          placeholder="Better nights begin with the right mattress."
                          className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl font-serif text-sm font-bold outline-none focus:border-forest"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-charcoal mb-1">
                          Penerangan Ringkas (Subtitle)
                        </label>
                        <textarea
                          rows={2}
                          value={slide.subtitle}
                          onChange={(e) => handleUpdateSlide(slide.id, { subtitle: e.target.value })}
                          placeholder="Penerangan keistimewaan tilam..."
                          className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-charcoal mb-1">Teks Butang Utama</label>
                          <input
                            type="text"
                            value={slide.ctaText}
                            onChange={(e) => handleUpdateSlide(slide.id, { ctaText: e.target.value })}
                            placeholder="Explore Mattresses"
                            className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-charcoal mb-1">Pautan Butang Utama</label>
                          <input
                            type="text"
                            value={slide.ctaLink}
                            onChange={(e) => handleUpdateSlide(slide.id, { ctaLink: e.target.value })}
                            placeholder="/collections/mattress"
                            className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest font-mono text-[11px]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-charcoal mb-1">Teks Butang Kedua</label>
                          <input
                            type="text"
                            value={slide.secondaryCtaText}
                            onChange={(e) => handleUpdateSlide(slide.id, { secondaryCtaText: e.target.value })}
                            placeholder="Take Mattress Finder Quiz"
                            className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-charcoal mb-1">Pautan Butang Kedua</label>
                          <input
                            type="text"
                            value={slide.secondaryCtaLink}
                            onChange={(e) => handleUpdateSlide(slide.id, { secondaryCtaLink: e.target.value })}
                            placeholder="/finder"
                            className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest font-mono text-[11px]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-charcoal mb-1">
                          URL Gambar Latar Belakang (High-Res Image) *
                        </label>
                        <input
                          type="text"
                          required
                          value={slide.imageUrl}
                          onChange={(e) => handleUpdateSlide(slide.id, { imageUrl: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest font-mono text-[11px]"
                        />
                      </div>

                      {/* Quick 1-click Sample Bedding Image Presets */}
                      <div className="pt-1">
                        <span className="text-[10px] text-secondary font-bold block mb-1.5">
                          Atau Pilih Gambar Hiasan Siap Sedia (1-Klik):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {SAMPLE_BEDROOM_IMAGES.map((sample, sIdx) => (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => handleUpdateSlide(slide.id, { imageUrl: sample.url })}
                              className="px-2 py-1 bg-cream hover:bg-gold/20 text-[#1E4E8C] border border-borderLight rounded-lg text-[10px] font-medium transition-colors cursor-pointer"
                            >
                              {sample.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Live Image Preview Thumbnail */}
                    <div className="flex flex-col space-y-2">
                      <span className="text-xs font-bold text-charcoal">Pratonton Gambar Slaid:</span>
                      <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden border border-borderLight bg-neutral-900 group">
                        {slide.imageUrl ? (
                          <>
                            <img
                              src={slide.imageUrl}
                              alt={slide.title}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                              <span className="text-[9px] uppercase font-bold text-[#D4AF37]">
                                {slide.badge || 'Lencana'}
                              </span>
                              <p className="font-serif font-bold text-xs truncate">{slide.title}</p>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                            Tiada URL gambar
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ANNOUNCEMENT BAR                                                   */}
        {/* ========================================================================= */}
        {activeTab === 'announcement' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-warmwhite p-4 sm:p-6 rounded-2xl border border-borderLight shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-borderLight pb-3">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-gold" />
                  <h3 className="font-serif text-base sm:text-lg font-bold text-forest-dark">
                    Palang Pengumuman Teratas (Top Announcement Bar)
                  </h3>
                </div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.announcement.enabled}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        announcement: { ...config.announcement, enabled: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-forest rounded accent-forest"
                  />
                  <span className="text-xs font-bold text-charcoal">Aktifkan Palang</span>
                </label>
              </div>

              {/* Announcement Bar Live Preview */}
              <div className="rounded-xl overflow-hidden border border-borderLight shadow-xs">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block p-2 bg-cream/60 border-b border-borderLight">
                  Pratonton Sebenar di Laman Web:
                </span>
                <div
                  className="py-2.5 px-4 text-xs font-medium tracking-wide flex items-center justify-between transition-colors"
                  style={{
                    backgroundColor: config.announcement.bgColor || config.theme.primaryDarkColor,
                    color: config.announcement.textColor || '#FFFFFF',
                  }}
                >
                  <div className="hidden md:flex items-center space-x-1.5 text-[11px] opacity-80">
                    <Truck className="w-3.5 h-3.5 text-[#B49A58]" />
                    <span>{config.announcement.leftBenefit}</span>
                  </div>
                  <div className="flex-1 md:flex-initial flex items-center justify-center space-x-1.5 text-center">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
                    <span className="text-[11.5px]">
                      {config.announcement.centerText}{' '}
                      <strong className="text-[#D4AF37] font-bold">
                        {config.announcement.highlightCode}
                      </strong>
                    </span>
                  </div>
                  <div className="hidden lg:flex items-center space-x-1 text-[11px] opacity-80">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#B49A58]" />
                    <span>{config.announcement.rightGuarantee}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-charcoal mb-1">
                    Teks Faedah Sebelah Kiri (Desktop)
                  </label>
                  <input
                    type="text"
                    value={config.announcement.leftBenefit}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        announcement: { ...config.announcement, leftBenefit: e.target.value },
                      })
                    }
                    placeholder="Contoh: Complimentary White-Glove In-Home Setup..."
                    className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">
                    Teks Jaminan Sebelah Kanan (Desktop)
                  </label>
                  <input
                    type="text"
                    value={config.announcement.rightGuarantee}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        announcement: { ...config.announcement, rightGuarantee: e.target.value },
                      })
                    }
                    placeholder="Contoh: 10-Year Local Warranty • 100-Night Trial"
                    className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-charcoal mb-1">
                    Mesej Promosi Tengah (Dipaparkan di Telefon & Komputer) *
                  </label>
                  <input
                    type="text"
                    required
                    value={config.announcement.centerText}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        announcement: { ...config.announcement, centerText: e.target.value },
                      })
                    }
                    placeholder="Grand Launch Privileges: Enjoy RM100 Off with code"
                    className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">
                    Kod Baucar / Highlight Emas
                  </label>
                  <input
                    type="text"
                    value={config.announcement.highlightCode}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        announcement: { ...config.announcement, highlightCode: e.target.value.toUpperCase() },
                      })
                    }
                    placeholder="KAMAAR100"
                    className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl uppercase font-mono font-bold outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">
                    Pautan Pengumuman (URL)
                  </label>
                  <input
                    type="text"
                    value={config.announcement.url}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        announcement: { ...config.announcement, url: e.target.value },
                      })
                    }
                    placeholder="/collections/mattress"
                    className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl font-mono text-[11px] outline-none focus:border-forest"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: REASSURANCE PERKS & GUARANTEES                                     */}
        {/* ========================================================================= */}
        {activeTab === 'reassurance' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-warmwhite p-4 sm:p-6 rounded-2xl border border-borderLight shadow-xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-borderLight pb-3">
                <Sparkles className="w-4 h-4 text-gold" />
                <h3 className="font-serif text-base sm:text-lg font-bold text-forest-dark">
                  4 Kelebihan & Jaminan Utama (Reassurance Strip & Footer)
                </h3>
              </div>
              <p className="text-xs text-secondary">
                Bahagian penting untuk membina keyakinan pelanggan sebelum membuat tempahan tilam dalam talian.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {config.reassurance.items.map((item, idx) => (
                  <div key={item.id} className="p-4 bg-cream/40 rounded-2xl border border-borderLight space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                        Kelebihan #{idx + 1}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-forest/10 text-forest text-[10px] font-bold">
                        Ikon: {item.icon}
                      </span>
                    </div>

                    <div>
                      <label className="block font-bold text-charcoal mb-1">Tajuk Kelebihan</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...config.reassurance.items]
                          updated[idx].title = e.target.value
                          setConfig({ ...config, reassurance: { items: updated } })
                        }}
                        className="w-full px-3 py-2 bg-white border border-borderLight rounded-xl font-bold outline-none focus:border-forest"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-charcoal mb-1">Penerangan Jaminan</label>
                      <textarea
                        rows={2}
                        value={item.subtitle}
                        onChange={(e) => {
                          const updated = [...config.reassurance.items]
                          updated[idx].subtitle = e.target.value
                          setConfig({ ...config, reassurance: { items: updated } })
                        }}
                        className="w-full px-3 py-2 bg-white border border-borderLight rounded-xl outline-none focus:border-forest"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: STORY SECTION & ATELIER CRAFTSMANSHIP DECOR                        */}
        {/* ========================================================================= */}
        {activeTab === 'story' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-warmwhite p-4 sm:p-6 rounded-2xl border border-borderLight shadow-xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-borderLight pb-3">
                <BookOpen className="w-4 h-4 text-gold" />
                <h3 className="font-serif text-base sm:text-lg font-bold text-forest-dark">
                  Kisah Jenama & Gambar Hiasan Atelier KAMAAR
                </h3>
              </div>
              <p className="text-xs text-secondary">
                Bahagian naratif eksklusif yang memaparkan falsafah ketukangan tilam organik dan gambar hiasan bengkel tidur.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-charcoal mb-1">Lencana Seksyen (Badge)</label>
                    <input
                      type="text"
                      value={config.storySection.badge}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          storySection: { ...config.storySection, badge: e.target.value },
                        })
                      }
                      placeholder="KAMAAR SLEEP ATELIER"
                      className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-charcoal mb-1">Tajuk Kisah (Headline) *</label>
                    <input
                      type="text"
                      value={config.storySection.headline}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          storySection: { ...config.storySection, headline: e.target.value },
                        })
                      }
                      placeholder="Seni Pembuatan Tilam Mewah Semula Jadi Malaysia"
                      className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl font-serif text-sm font-bold outline-none focus:border-forest"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-charcoal mb-1">Perenggan Naratif 1</label>
                    <textarea
                      rows={3}
                      value={config.storySection.paragraph1}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          storySection: { ...config.storySection, paragraph1: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-charcoal mb-1">Perenggan Naratif 2</label>
                    <textarea
                      rows={3}
                      value={config.storySection.paragraph2}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          storySection: { ...config.storySection, paragraph2: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-charcoal mb-1">Gelaran Tandatangan</label>
                      <input
                        type="text"
                        value={config.storySection.signatureTitle}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            storySection: { ...config.storySection, signatureTitle: e.target.value },
                          })
                        }
                        placeholder="Tukang Mahir Atelier"
                        className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-charcoal mb-1">Sub-Gelaran</label>
                      <input
                        type="text"
                        value={config.storySection.signatureSub}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            storySection: { ...config.storySection, signatureSub: e.target.value },
                          })
                        }
                        placeholder="KAMAAR Sleep Sanctuary Malaysia"
                        className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest"
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Decorative Image for Story */}
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-charcoal mb-1">
                      URL Gambar Hiasan Atelier *
                    </label>
                    <input
                      type="text"
                      value={config.storySection.imageUrl}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          storySection: { ...config.storySection, imageUrl: e.target.value },
                        })
                      }
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl font-mono text-[11px] outline-none focus:border-forest"
                    />
                  </div>

                  <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-borderLight bg-neutral-900 group shadow-xs">
                    {config.storySection.imageUrl ? (
                      <img
                        src={config.storySection.imageUrl}
                        alt="Atelier Craftsman"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400">
                        Tiada URL Gambar
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: PROMOTIONS & LOOKBOOK BANNER                                       */}
        {/* ========================================================================= */}
        {activeTab === 'promotions' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-warmwhite p-4 sm:p-6 rounded-2xl border border-borderLight shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-borderLight pb-3">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-gold" />
                  <h3 className="font-serif text-base sm:text-lg font-bold text-forest-dark">
                    Banner Promosi & Tawaran Khas (Promotional Section)
                  </h3>
                </div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.promotionsBanner.enabled}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        promotionsBanner: { ...config.promotionsBanner, enabled: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-forest rounded accent-forest"
                  />
                  <span className="text-xs font-bold text-charcoal">Aktifkan Seksyen</span>
                </label>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-charcoal mb-1">Lencana Promosi</label>
                    <input
                      type="text"
                      value={config.promotionsBanner.badge}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          promotionsBanner: { ...config.promotionsBanner, badge: e.target.value },
                        })
                      }
                      placeholder="TAWARAN EKSKLUSIF ATELIER"
                      className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-charcoal mb-1">Tajuk Tawaran *</label>
                    <input
                      type="text"
                      value={config.promotionsBanner.headline}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          promotionsBanner: { ...config.promotionsBanner, headline: e.target.value },
                        })
                      }
                      placeholder="Tingkatkan Mutu Tidur Anda dengan Baucar Bernilai RM100"
                      className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl font-serif text-sm font-bold outline-none focus:border-forest"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-charcoal mb-1">Penerangan Promosi</label>
                    <textarea
                      rows={2}
                      value={config.promotionsBanner.description}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          promotionsBanner: { ...config.promotionsBanner, description: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-charcoal mb-1">Kod Baucar Diskaun</label>
                      <input
                        type="text"
                        value={config.promotionsBanner.couponCode}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            promotionsBanner: { ...config.promotionsBanner, couponCode: e.target.value.toUpperCase() },
                          })
                        }
                        placeholder="KAMAAR100"
                        className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl uppercase font-mono font-bold outline-none focus:border-forest"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-charcoal mb-1">Teks Butang Tebus</label>
                      <input
                        type="text"
                        value={config.promotionsBanner.ctaText}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            promotionsBanner: { ...config.promotionsBanner, ctaText: e.target.value },
                          })
                        }
                        placeholder="Tebus Baucar Sekarang"
                        className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-charcoal mb-1">Pautan Butang Tebus</label>
                    <input
                      type="text"
                      value={config.promotionsBanner.ctaLink}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          promotionsBanner: { ...config.promotionsBanner, ctaLink: e.target.value },
                        })
                      }
                      placeholder="/collections/mattress"
                      className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl font-mono text-[11px] outline-none focus:border-forest"
                    />
                  </div>
                </div>

                {/* Right: Promotional Image */}
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-charcoal mb-1">
                      URL Gambar Hiasan Promosi *
                    </label>
                    <input
                      type="text"
                      value={config.promotionsBanner.imageUrl}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          promotionsBanner: { ...config.promotionsBanner, imageUrl: e.target.value },
                        })
                      }
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl font-mono text-[11px] outline-none focus:border-forest"
                    />
                  </div>

                  <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-borderLight bg-neutral-900 group shadow-xs">
                    {config.promotionsBanner.imageUrl ? (
                      <img
                        src={config.promotionsBanner.imageUrl}
                        alt="Promo Banner"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400">
                        Tiada URL Gambar
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: SOCIAL MEDIA & WHATSAPP CHANNELS                                   */}
        {/* ========================================================================= */}
        {activeTab === 'contact' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-warmwhite p-4 sm:p-6 rounded-2xl border border-borderLight shadow-xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-borderLight pb-3">
                <Share2 className="w-4 h-4 text-gold" />
                <h3 className="font-serif text-base sm:text-lg font-bold text-forest-dark">
                  Saluran Perhubungan Rasmi & Media Sosial
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-charcoal mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Nombor WhatsApp Bantuan (Floating Button) *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={config.socialAndContact.whatsappNumber}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        socialAndContact: { ...config.socialAndContact, whatsappNumber: e.target.value },
                      })
                    }
                    placeholder="+60123456789"
                    className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl font-mono outline-none focus:border-forest"
                  />
                  <span className="text-[10px] text-secondary mt-0.5 block">
                    Digunakan untuk butang hijau WhatsApp terapung di bucu kanan bawah.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-gold" />
                    <span>Hotline Concierge Telefon</span>
                  </label>
                  <input
                    type="text"
                    value={config.socialAndContact.phoneDisplay}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        socialAndContact: { ...config.socialAndContact, phoneDisplay: e.target.value },
                      })
                    }
                    placeholder="+603 7722 1199"
                    className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-gold" />
                    <span>Emel Khidmat Pelanggan</span>
                  </label>
                  <input
                    type="email"
                    value={config.socialAndContact.emailDisplay}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        socialAndContact: { ...config.socialAndContact, emailDisplay: e.target.value },
                      })
                    }
                    placeholder="care@kamaarbeddings.com.my"
                    className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gold" />
                    <span>Alamat Showroom / Atelier Rasmi</span>
                  </label>
                  <input
                    type="text"
                    value={config.socialAndContact.addressDisplay}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        socialAndContact: { ...config.socialAndContact, addressDisplay: e.target.value },
                      })
                    }
                    placeholder="KAMAAR Sleep Atelier, Bangsar, 59100 Kuala Lumpur"
                    className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">
                    Pautan Profil Instagram
                  </label>
                  <input
                    type="url"
                    value={config.socialAndContact.instagramUrl}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        socialAndContact: { ...config.socialAndContact, instagramUrl: e.target.value },
                      })
                    }
                    placeholder="https://instagram.com/kamaarbeddings"
                    className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl font-mono text-[11px] outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">
                    Pautan Profil TikTok
                  </label>
                  <input
                    type="url"
                    value={config.socialAndContact.tiktokUrl}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        socialAndContact: { ...config.socialAndContact, tiktokUrl: e.target.value },
                      })
                    }
                    placeholder="https://tiktok.com/@kamaarbeddings"
                    className="w-full px-3 py-2 bg-cream-light border border-borderLight rounded-xl font-mono text-[11px] outline-none focus:border-forest"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: VISUAL EFFECTS & ENTRANCE ANIMATIONS                               */}
        {/* ========================================================================= */}
        {activeTab === 'visual' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-warmwhite p-4 sm:p-6 rounded-2xl border border-borderLight shadow-xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-borderLight pb-3">
                <Wand2 className="w-4 h-4 text-gold" />
                <h3 className="font-serif text-base sm:text-lg font-bold text-forest-dark">
                  Kesan Visual & Animasi Masuk (Entrance Animations)
                </h3>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-cream/40 rounded-2xl border border-borderLight flex items-center justify-between">
                  <div>
                    <span className="font-bold text-forest-dark block">
                      Animasi Masuk Silky-Smooth (Fade-In & Slide-Up)
                    </span>
                    <span className="text-secondary text-[11px]">
                      Mengaktifkan transisi lembut ketika pelawat membuka muka depan dan halaman koleksi tilam.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.appearance.enableEntranceAnimations}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          appearance: {
                            ...config.appearance,
                            enableEntranceAnimations: e.target.checked,
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E4E8C]"></div>
                  </label>
                </div>

                <div className="p-4 bg-cream/40 rounded-2xl border border-borderLight flex items-center justify-between">
                  <div>
                    <span className="font-bold text-forest-dark block">
                      Lencana Terapung Bergerak (Floating Luxury Badges)
                    </span>
                    <span className="text-secondary text-[11px]">
                      Lencana '100% Organic Latex' berayun lembut untuk kesan estetik premium.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.appearance.enableFloatingBadges}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          appearance: {
                            ...config.appearance,
                            enableFloatingBadges: e.target.checked,
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E4E8C]"></div>
                  </label>
                </div>

                <div className="p-4 bg-cream/40 rounded-2xl border border-borderLight space-y-2">
                  <label className="font-bold text-forest-dark block">
                    Gaya Lengkungan Bucu Kad (Border Radius)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'rounded-xl', label: 'Minimalis (12px)' },
                      { id: 'rounded-2xl', label: 'Elegan (16px) - Disyorkan' },
                      { id: 'rounded-3xl', label: 'Mewah Melengkung (24px)' },
                    ].map((rad) => (
                      <button
                        key={rad.id}
                        type="button"
                        onClick={() =>
                          setConfig({
                            ...config,
                            appearance: {
                              ...config.appearance,
                              cardBorderRadius: rad.id as any,
                            },
                          })
                        }
                        className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          config.appearance.cardBorderRadius === rad.id
                            ? 'bg-[#1E4E8C] text-white border-[#1E4E8C] shadow-xs'
                            : 'bg-white border-borderLight text-secondary hover:text-forest-dark'
                        }`}
                      >
                        {rad.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STICKY BOTTOM SAVE ACTION BAR FOR MOBILE & DESKTOP */}
        <div className="sticky bottom-4 z-40 bg-warmwhite/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-[#B49A58]/30 shadow-lg flex items-center justify-between gap-3 animate-fade-in-up">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-secondary hidden sm:inline">
              Perubahan sedia disimpan ke pangkalan data KAMAAR
            </span>
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
            <Link
              href="/"
              target="_blank"
              className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-cream hover:bg-gold/15 text-[#1E4E8C] border border-borderLight rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0"
            >
              <Eye className="w-3.5 h-3.5 text-gold-dark" />
              <span>Lihat Laman</span>
            </Link>

            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-6 py-2.5 bg-[#1E4E8C] hover:bg-[#13325B] text-warmwhite text-xs font-bold rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer hover:scale-[1.02]"
            >
              <Save className="w-4 h-4 text-[#D4AF37]" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan Laman Web'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
