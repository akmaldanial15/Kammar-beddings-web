'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  WebsiteConfig,
  HeroSlideConfig,
  ReassuranceItemConfig,
  MegaMenuConfig,
  MegaMenuColumnConfig,
  MegaMenuItemConfig,
  MegaMenuPromoConfig,
} from '@/types'
import { initialWebsiteConfig } from '@/lib/db/seedData'
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
  ChevronLeft,
  ChevronDown,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw as TrialIcon,
  Phone,
  Mail,
  MapPin,
  HelpCircle,
  Layers,
  ArrowUp,
  ArrowDown,
  ExternalLink as LinkIcon,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { ImageUploadDropzone } from '@/components/admin/ImageUploadDropzone'

interface Props {
  initialConfig: WebsiteConfig
}

type TabType = 'theme' | 'hero' | 'announcement' | 'megamenu' | 'reassurance' | 'story' | 'promotions' | 'contact' | 'visual'

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
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('kamaar:website_config_updated'))
        }
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

  // Mega Menu Handlers
  const handleUpdateMegaColumnTitle = (colId: string, title: string, titleBm: string) => {
    setConfig((prev) => {
      const curMenu = prev.megaMenu || initialWebsiteConfig.megaMenu
      return {
        ...prev,
        megaMenu: {
          ...curMenu,
          columns: curMenu.columns.map((col) =>
            col.id === colId ? { ...col, title, titleBm } : col
          ),
        },
      }
    })
  }

  const handleAddMegaMenuItem = (colId: string) => {
    const newItem: MegaMenuItemConfig = {
      id: `item-${Date.now()}`,
      label: 'New Link Item',
      labelBm: 'Pautan Baru',
      href: '/collections/mattress',
    }
    setConfig((prev) => {
      const curMenu = prev.megaMenu || initialWebsiteConfig.megaMenu
      return {
        ...prev,
        megaMenu: {
          ...curMenu,
          columns: curMenu.columns.map((col) =>
            col.id === colId ? { ...col, items: [...col.items, newItem] } : col
          ),
        },
      }
    })
  }

  const handleDeleteMegaMenuItem = (colId: string, itemId: string) => {
    setConfig((prev) => {
      const curMenu = prev.megaMenu || initialWebsiteConfig.megaMenu
      return {
        ...prev,
        megaMenu: {
          ...curMenu,
          columns: curMenu.columns.map((col) =>
            col.id === colId
              ? { ...col, items: col.items.filter((item) => item.id !== itemId) }
              : col
          ),
        },
      }
    })
  }

  const handleUpdateMegaMenuItem = (
    colId: string,
    itemId: string,
    updates: Partial<MegaMenuItemConfig>
  ) => {
    setConfig((prev) => {
      const curMenu = prev.megaMenu || initialWebsiteConfig.megaMenu
      return {
        ...prev,
        megaMenu: {
          ...curMenu,
          columns: curMenu.columns.map((col) =>
            col.id === colId
              ? {
                  ...col,
                  items: col.items.map((item) =>
                    item.id === itemId ? { ...item, ...updates } : item
                  ),
                }
              : col
          ),
        },
      }
    })
  }

  const handleMoveMegaMenuItem = (colId: string, itemId: string, direction: 'up' | 'down') => {
    setConfig((prev) => {
      const curMenu = prev.megaMenu || initialWebsiteConfig.megaMenu
      return {
        ...prev,
        megaMenu: {
          ...curMenu,
          columns: curMenu.columns.map((col) => {
            if (col.id !== colId) return col
            const items = [...col.items]
            const index = items.findIndex((i) => i.id === itemId)
            if (index < 0) return col
            const targetIndex = direction === 'up' ? index - 1 : index + 1
            if (targetIndex < 0 || targetIndex >= items.length) return col
            const temp = items[index]
            items[index] = items[targetIndex]
            items[targetIndex] = temp
            return { ...col, items }
          }),
        },
      }
    })
  }

  const handleUpdateMegaPromo = (updates: Partial<MegaMenuPromoConfig>) => {
    setConfig((prev) => {
      const curMenu = prev.megaMenu || initialWebsiteConfig.megaMenu
      return {
        ...prev,
        megaMenu: {
          ...curMenu,
          promoCard: {
            ...curMenu.promoCard,
            ...updates,
          },
        },
      }
    })
  }

  const handleResetMegaMenuToDefaults = () => {
    if (
      !confirm(
        'Adakah anda pasti mahu memulihkan susunan asal Mega Menu (Pilihan Bahan, Saiz, Ketegasan & Kuis)? Perubahan yang belum disimpan akan digantikan dengan tetapan rasmi.'
      )
    )
      return
    setConfig((prev) => ({
      ...prev,
      megaMenu: initialWebsiteConfig.megaMenu,
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
    { id: 'theme', label: 'Warna & Tema', shortLabel: 'Warna', icon: Palette, num: '1/9' },
    { id: 'hero', label: 'Slaid Hero & Gambar', shortLabel: 'Hero Slaid', icon: ImageIcon, num: '2/9' },
    { id: 'announcement', label: 'Palang Pengumuman', shortLabel: 'Pengumuman', icon: Bell, num: '3/9' },
    { id: 'megamenu', label: 'Navigasi & Mega Menu', shortLabel: 'Mega Menu', icon: Layers, num: '4/9' },
    { id: 'reassurance', label: 'Jaminan & Kelebihan', shortLabel: 'Kelebihan', icon: Sparkles, num: '5/9' },
    { id: 'story', label: 'Kisah Atelier', shortLabel: 'Kisah', icon: BookOpen, num: '6/9' },
    { id: 'promotions', label: 'Banner Promosi', shortLabel: 'Promosi', icon: Tag, num: '7/9' },
    { id: 'contact', label: 'WhatsApp & Sosial', shortLabel: 'Sosial', icon: Share2, num: '8/9' },
    { id: 'visual', label: 'Animasi & Kesan', shortLabel: 'Animasi', icon: Wand2, num: '9/9' },
  ] as const

  const [isMobileSelectorOpen, setIsMobileSelectorOpen] = useState(false)
  const [activeMegaSection, setActiveMegaSection] = useState<string>('col-material')
  const [isMegaPreviewOpen, setIsMegaPreviewOpen] = useState<boolean>(true)
  const tabListRef = useRef<HTMLDivElement>(null)

  // Listen to ?tab= query parameter on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tabParam = params.get('tab') as TabType
      if (tabParam && tabs.some((t) => t.id === tabParam)) {
        setActiveTab(tabParam)
      }
    }
  }, [])

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId)
    setIsMobileSelectorOpen(false)
    if (typeof window !== 'undefined') {
      const el = document.getElementById(`tab-pill-${tabId}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }

  const currentTabIndex = tabs.findIndex((t) => t.id === activeTab)
  const currentTab = tabs[currentTabIndex] || tabs[0]
  const hasPrevTab = currentTabIndex > 0
  const hasNextTab = currentTabIndex < tabs.length - 1

  const goToPrevTab = () => {
    if (hasPrevTab) handleTabChange(tabs[currentTabIndex - 1].id as TabType)
  }
  const goToNextTab = () => {
    if (hasNextTab) handleTabChange(tabs[currentTabIndex + 1].id as TabType)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
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
      <div className="flex items-center justify-between gap-2.5 bg-warmwhite p-3 sm:p-4 rounded-2xl border border-borderLight shadow-xs animate-fade-in-up delay-50">
        <div className="flex items-center space-x-2 min-w-0">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-cream hover:bg-gold/15 text-[#1E4E8C] border border-borderLight rounded-xl text-xs font-semibold transition-all hover:scale-[1.02] shrink-0 cursor-pointer"
          >
            <span>Buka Laman Web Awam</span>
            <ExternalLink className="w-3.5 h-3.5 text-gold-dark" />
          </Link>
          <span className="hidden md:inline-flex items-center space-x-1 text-[11px] text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Kemas kini langsung disegerakkan ke pangkalan data</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="hidden sm:flex items-center space-x-2">
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving}
              className="flex items-center space-x-2 px-5 py-2.5 bg-[#1E4E8C] hover:bg-[#13325B] text-warmwhite text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer hover:scale-[1.02]"
            >
              <Save className="w-4 h-4 text-[#D4AF37]" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
          <span className="sm:hidden text-[10px] font-bold px-2.5 py-1 bg-cream text-forest-dark rounded-xl border border-borderLight flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>8 Bahagian</span>
          </span>
        </div>
      </div>

      {/* MOBILE INTERACTIVE SECTION PICKER & STEP CONTROLLER (sm:hidden) */}
      <div className="sm:hidden space-y-2 animate-fade-in-up delay-75">
        <div className="bg-gradient-to-r from-[#13325B] to-[#1E4E8C] text-white p-2.5 rounded-2xl shadow-sm flex items-center justify-between gap-2 border border-[#B49A58]/20">
          {/* Section selector button */}
          <button
            type="button"
            onClick={() => setIsMobileSelectorOpen(!isMobileSelectorOpen)}
            className="flex-1 flex items-center space-x-2.5 text-left p-1 rounded-xl hover:bg-white/10 transition-colors cursor-pointer min-w-0"
          >
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-[#D4AF37] shrink-0">
              {React.createElement(currentTab.icon, { className: 'w-4 h-4' })}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#D4AF37]">
                  Bahagian {currentTab.num}
                </span>
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
              </div>
              <div className="text-xs font-bold text-white truncate flex items-center space-x-1">
                <span>{currentTab.label}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#D4AF37] transition-transform duration-200 shrink-0 ${
                    isMobileSelectorOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>
          </button>

          {/* Quick Prev & Next step buttons */}
          <div className="flex items-center space-x-1 shrink-0">
            <button
              type="button"
              disabled={!hasPrevTab}
              onClick={goToPrevTab}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-25 disabled:pointer-events-none flex items-center justify-center text-white transition-all cursor-pointer"
              title="Bahagian Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={!hasNextTab}
              onClick={goToNextTab}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-25 disabled:pointer-events-none flex items-center justify-center text-white transition-all cursor-pointer"
              title="Bahagian Seterusnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dropdown sheet for mobile */}
        {isMobileSelectorOpen && (
          <div className="bg-warmwhite rounded-2xl border border-borderLight shadow-xl p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-secondary border-b border-borderLight/60 mb-1 flex items-center justify-between">
              <span>Lompat Terus ke Bahagian:</span>
              <span className="text-forest font-mono">{currentTab.num}</span>
            </div>
            <div className="grid grid-cols-1 gap-1 max-h-72 overflow-y-auto no-scrollbar">
              {tabs.map((tab) => {
                const TabIcon = tab.icon
                const isAct = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id as TabType)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      isAct
                        ? 'bg-[#1E4E8C] text-white shadow-xs'
                        : 'text-forest-dark hover:bg-cream/80'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <TabIcon className={`w-4 h-4 shrink-0 ${isAct ? 'text-[#D4AF37]' : 'text-gold-dark'}`} />
                      <span>{tab.label}</span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isAct ? 'bg-white/20 text-white font-mono' : 'bg-cream text-secondary font-mono'
                      }`}
                    >
                      {tab.num}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* HORIZONTAL SWIPEABLE PILLS RAIL (Mobile & Desktop) */}
      <div className="relative bg-warmwhite rounded-2xl border border-borderLight p-1.5 shadow-xs animate-fade-in-up delay-100">
        <div
          ref={tabListRef}
          className="flex items-center space-x-1 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-0.5 px-0.5"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                id={`tab-pill-${tab.id}`}
                type="button"
                onClick={() => handleTabChange(tab.id as TabType)}
                className={`snap-start shrink-0 flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1E4E8C] text-white shadow-xs scale-[1.01]'
                    : 'text-secondary hover:text-forest-dark hover:bg-cream/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#D4AF37]' : 'text-secondary'}`} />
                <span className="sm:hidden">{tab.shortLabel}</span>
                <span className="hidden sm:inline">{tab.label}</span>
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

                      <ImageUploadDropzone
                        label="Gambar Latar Belakang Slaid (High-Res)"
                        helperText="Seret & lepas gambar dari PC, guna kamera fon, atau pilih dari galeri."
                        value={slide.imageUrl}
                        onChange={(url) => handleUpdateSlide(slide.id, { imageUrl: url })}
                        aspectRatio="video"
                      />

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
        {/* TAB 4: MEGA MENU & MATTRESS NAVIGATION                                    */}
        {/* ========================================================================= */}
        {activeTab === 'megamenu' && (() => {
          const menu = config.megaMenu || initialWebsiteConfig.megaMenu
          const activeCol = menu.columns.find((c) => c.id === activeMegaSection)
          const isPromoActive = activeMegaSection === 'promo-card'

          return (
            <div className="space-y-5 animate-fade-in-up">
              {/* Header & Quick Actions Bar */}
              <div className="bg-warmwhite p-4 sm:p-5 rounded-2xl border border-borderLight shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-[#1E4E8C]/10 text-[#1E4E8C] flex items-center justify-center">
                      <Layers className="w-4 h-4 text-[#B49A58]" />
                    </div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-forest-dark">
                      Pengurusan Mega Menu (Kawasan Tilam)
                    </h3>
                  </div>
                  <p className="text-xs text-secondary">
                    Pilih bahagian di bawah untuk edit tajuk, pautan URL, dan kad kuis mengikut keselesaan anda di telefon dan PC.
                  </p>
                </div>

                <div className="flex items-center space-x-2 self-stretch sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsMegaPreviewOpen(!isMegaPreviewOpen)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-3 py-2 bg-cream hover:bg-gold/15 text-forest border border-borderLight rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    title="Tunjuk atau sembunyikan pratonton langsung"
                  >
                    <Eye className="w-3.5 h-3.5 text-gold-dark" />
                    <span>{isMegaPreviewOpen ? 'Sembunyi Pratonton' : 'Tunjuk Pratonton'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetMegaMenuToDefaults}
                    className="inline-flex items-center justify-center space-x-1 px-3 py-2 bg-cream hover:bg-red-50 text-secondary hover:text-red-600 border border-borderLight rounded-xl text-xs font-medium transition-all cursor-pointer"
                    title="Pulihkan susunan asal KAMAAR"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-gold-dark" />
                    <span className="hidden md:inline">Reset Default</span>
                  </button>
                </div>
              </div>

              {/* COLLAPSIBLE LIVE STOREFRONT PREVIEW */}
              {isMegaPreviewOpen && (
                <div className="bg-warmwhite p-4 sm:p-5 rounded-2xl border border-borderLight shadow-xs space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-borderLight pb-2.5">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-bold text-forest-dark uppercase tracking-wider">
                        Pratonton Sebenar Mega Menu (Live Preview)
                      </span>
                    </div>
                    <span className="text-[11px] text-secondary hidden sm:inline">
                      Klik mana-mana lajur pada pratonton untuk terus menyuntingnya
                    </span>
                  </div>

                  <div className="p-3 sm:p-6 bg-[#0E1A2B]/5 rounded-2xl border border-borderLight/80 overflow-x-auto no-scrollbar">
                    <div className="text-[10px] text-secondary sm:hidden mb-2 text-center">
                      👉 Leret ke tepi untuk lihat semua 4 bahagian
                    </div>

                    <div className="min-w-[800px] max-w-[860px] mx-auto bg-warmwhite rounded-2xl shadow-xl border border-borderLight p-6 grid grid-cols-4 gap-6">
                      {menu.columns.map((col, idx) => {
                        const isColSelected = activeMegaSection === col.id
                        return (
                          <div
                            key={col.id}
                            onClick={() => setActiveMegaSection(col.id)}
                            className={`p-3 rounded-xl transition-all cursor-pointer border ${
                              isColSelected
                                ? 'bg-gold/10 border-gold shadow-md ring-2 ring-gold/40'
                                : 'border-transparent hover:bg-cream/60'
                            }`}
                            title="Klik untuk sunting lajur ini"
                          >
                            <div className="flex items-center justify-between pb-1.5 border-b border-borderLight mb-2.5">
                              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#B49A58] truncate">
                                {col.titleBm || col.title || `Lajur #${idx + 1}`}
                              </h4>
                              {isColSelected && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-gold text-forest font-bold shrink-0">
                                  Aktif
                                </span>
                              )}
                            </div>
                            <ul className="space-y-1.5 text-xs text-charcoal-muted">
                              {col.items.map((item) => (
                                <li key={item.id} className="truncate">
                                  <span className="font-medium text-charcoal block truncate">
                                    {item.labelBm || item.label}
                                  </span>
                                  <span className="text-[9px] text-secondary font-mono block truncate">
                                    {item.href}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      })}

                      {/* Promo / Quiz Card Preview */}
                      <div
                        onClick={() => setActiveMegaSection('promo-card')}
                        className={`rounded-xl transition-all cursor-pointer border ${
                          isPromoActive
                            ? 'ring-2 ring-gold/60 shadow-md border-gold'
                            : 'border-transparent hover:opacity-90'
                        }`}
                        title="Klik untuk sunting kad kuis ini"
                      >
                        {menu.promoCard.enabled !== false ? (
                          <div className="bg-cream h-full rounded-xl p-4 flex flex-col justify-between border border-borderLight shadow-xs">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="inline-flex items-center space-x-1 text-[9px] font-bold uppercase tracking-wider text-forest bg-gold/25 px-2 py-0.5 rounded">
                                  <Sparkles className="w-3 h-3 text-gold-dark" />
                                  <span>{menu.promoCard.badge || 'PERSONALIZED FIT'}</span>
                                </span>
                                {isPromoActive && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-gold text-forest font-bold">
                                    Aktif
                                  </span>
                                )}
                              </div>
                              <h5 className="font-serif text-xs font-bold text-forest leading-snug line-clamp-2">
                                {menu.promoCard.title || 'Tajuk Kuis'}
                              </h5>
                              <p className="text-[10px] text-charcoal-muted mt-1 leading-relaxed line-clamp-2">
                                {menu.promoCard.description || 'Penerangan kuis.'}
                              </p>
                            </div>
                            <div className="mt-3 inline-flex items-center justify-between px-2.5 py-1.5 bg-forest text-warmwhite text-[11px] font-bold rounded-lg pointer-events-none">
                              <span className="truncate">{menu.promoCard.buttonText || 'Mula Sekarang'}</span>
                              <ChevronRight className="w-3 h-3 text-gold shrink-0 ml-1" />
                            </div>
                          </div>
                        ) : (
                          <div className="h-full border border-dashed border-borderLight rounded-xl p-4 flex flex-col items-center justify-center text-center text-xs text-secondary italic bg-cream/30">
                            <span>Kad Kuis Dinonaktifkan</span>
                            <span className="text-[10px] text-gold-dark font-semibold mt-1">Klik untuk aktifkan</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-NAVIGATION PILLS (Switch between Columns & Promo Card) */}
              <div className="bg-warmwhite p-2 rounded-2xl border border-borderLight shadow-xs">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-1 px-1">
                  {menu.columns.map((col, idx) => {
                    const isAct = activeMegaSection === col.id
                    const colIcons = ['🌿', '📏', '⚖️']
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => setActiveMegaSection(col.id)}
                        className={`snap-start shrink-0 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border cursor-pointer ${
                          isAct
                            ? 'bg-[#1E4E8C] text-white border-[#1E4E8C] shadow-md scale-[1.01]'
                            : 'bg-warmwhite text-charcoal hover:bg-cream border-borderLight'
                        }`}
                      >
                        <span className="text-sm">{colIcons[idx] || '📑'}</span>
                        <div className="text-left">
                          <span className="block truncate max-w-[130px] sm:max-w-none">
                            {col.titleBm || col.title || `Lajur #${idx + 1}`}
                          </span>
                          <span className={`text-[10px] font-normal block ${isAct ? 'text-white/80' : 'text-secondary'}`}>
                            Lajur #{idx + 1} • {col.items.length} pautan
                          </span>
                        </div>
                      </button>
                    )
                  })}

                  {/* Promo Card Sub-Tab */}
                  <button
                    type="button"
                    onClick={() => setActiveMegaSection('promo-card')}
                    className={`snap-start shrink-0 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border cursor-pointer ${
                      isPromoActive
                        ? 'bg-[#1E4E8C] text-white border-[#1E4E8C] shadow-md scale-[1.01]'
                        : 'bg-warmwhite text-charcoal hover:bg-cream border-borderLight'
                    }`}
                  >
                    <span className="text-sm">✨</span>
                    <div className="text-left">
                      <span className="block">Kad Kuis & Promosi</span>
                      <span className={`text-[10px] font-normal block ${isPromoActive ? 'text-white/80' : 'text-secondary'}`}>
                        Lajur #4 • {menu.promoCard.enabled !== false ? 'Aktif' : 'Tutup'}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* ACTIVE COLUMN EDITOR (Spacious, Full-Width, Touch-Friendly) */}
              {activeCol && !isPromoActive && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Card 1: Column Titles (BM & EN) */}
                  <div className="bg-warmwhite rounded-2xl border border-borderLight p-4 sm:p-6 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between border-b border-borderLight pb-3">
                      <div className="flex items-center space-x-2">
                        <span className="w-7 h-7 rounded-xl bg-forest/10 text-forest font-bold text-xs flex items-center justify-center">
                          {menu.columns.findIndex((c) => c.id === activeCol.id) + 1}
                        </span>
                        <div>
                          <h4 className="font-serif text-base font-bold text-forest-dark">
                            Tajuk Lajur: {activeCol.titleBm || activeCol.title}
                          </h4>
                          <span className="text-[11px] text-secondary">
                            Tajuk ini dipaparkan di bahagian paling atas lajur dropdown
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-bold text-charcoal mb-1 flex items-center space-x-1.5">
                          <span>🇲🇾</span>
                          <span>Tajuk Lajur (Bahasa Melayu)</span>
                        </label>
                        <input
                          type="text"
                          value={activeCol.titleBm || ''}
                          onChange={(e) =>
                            handleUpdateMegaColumnTitle(activeCol.id, activeCol.title, e.target.value)
                          }
                          placeholder="Contoh: Pilihan Bahan"
                          className="w-full px-3.5 py-2.5 bg-cream-light border border-borderLight rounded-xl text-xs font-semibold outline-none focus:border-forest"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-charcoal mb-1 flex items-center space-x-1.5">
                          <span>🇬🇧</span>
                          <span>Tajuk Lajur (English)</span>
                        </label>
                        <input
                          type="text"
                          value={activeCol.title || ''}
                          onChange={(e) =>
                            handleUpdateMegaColumnTitle(activeCol.id, e.target.value, activeCol.titleBm || '')
                          }
                          placeholder="e.g. Shop by Material"
                          className="w-full px-3.5 py-2.5 bg-cream-light border border-borderLight rounded-xl text-xs outline-none focus:border-forest"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Link Items Inside Column */}
                  <div className="bg-warmwhite rounded-2xl border border-borderLight p-4 sm:p-6 space-y-4 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-borderLight pb-3">
                      <div>
                        <h4 className="font-serif text-base font-bold text-forest-dark">
                          Senarai Pautan Tilam ({activeCol.items.length})
                        </h4>
                        <p className="text-xs text-secondary mt-0.5">
                          Pelanggan boleh klik pautan ini untuk melihat tilam mengikut pilihan spesifik.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddMegaMenuItem(activeCol.id)}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-forest text-warmwhite text-xs font-bold rounded-xl hover:bg-forest-dark transition-all cursor-pointer shadow-xs shrink-0 self-start sm:self-auto"
                      >
                        <Plus className="w-4 h-4 text-gold" />
                        <span>Tambah Pautan Baru</span>
                      </button>
                    </div>

                    {/* Links List */}
                    <div className="space-y-3">
                      {activeCol.items.map((item, itemIdx) => (
                        <div
                          key={item.id}
                          className="p-3.5 sm:p-4 bg-cream/40 rounded-2xl border border-borderLight space-y-3 hover:border-gold/50 transition-colors shadow-2xs"
                        >
                          {/* Item Header & Reordering */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="w-6 h-6 rounded-lg bg-warmwhite text-forest font-mono font-bold text-xs flex items-center justify-center border border-borderLight">
                                {itemIdx + 1}
                              </span>
                              <span className="text-xs font-bold text-forest-dark">
                                {item.labelBm || item.label || 'Pautan Baru'}
                              </span>
                            </div>

                            <div className="flex items-center space-x-1">
                              <button
                                type="button"
                                disabled={itemIdx === 0}
                                onClick={() => handleMoveMegaMenuItem(activeCol.id, item.id, 'up')}
                                className="p-1.5 rounded-lg bg-warmwhite hover:bg-cream border border-borderLight disabled:opacity-25 text-charcoal transition-all cursor-pointer"
                                title="Alih pautan ke atas"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={itemIdx === activeCol.items.length - 1}
                                onClick={() => handleMoveMegaMenuItem(activeCol.id, item.id, 'down')}
                                className="p-1.5 rounded-lg bg-warmwhite hover:bg-cream border border-borderLight disabled:opacity-25 text-charcoal transition-all cursor-pointer"
                                title="Alih pautan ke bawah"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteMegaMenuItem(activeCol.id, item.id)}
                                className="p-1.5 rounded-lg bg-warmwhite hover:bg-red-50 border border-borderLight text-red-500 hover:text-red-700 transition-all cursor-pointer"
                                title="Padam pautan ini"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Inputs: BM & EN Names */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="block text-[11px] font-bold text-charcoal mb-1">
                                Nama Pautan (Bahasa Melayu)
                              </label>
                              <input
                                type="text"
                                value={item.labelBm || ''}
                                onChange={(e) =>
                                  handleUpdateMegaMenuItem(activeCol.id, item.id, { labelBm: e.target.value })
                                }
                                placeholder="Contoh: 100% Lateks Semula Jadi"
                                className="w-full px-3 py-2 bg-warmwhite border border-borderLight rounded-xl text-xs font-semibold outline-none focus:border-forest"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-charcoal mb-1">
                                English Label
                              </label>
                              <input
                                type="text"
                                value={item.label || ''}
                                onChange={(e) =>
                                  handleUpdateMegaMenuItem(activeCol.id, item.id, { label: e.target.value })
                                }
                                placeholder="e.g. 100% Natural Latex"
                                className="w-full px-3 py-2 bg-warmwhite border border-borderLight rounded-xl text-xs outline-none focus:border-forest"
                              />
                            </div>
                          </div>

                          {/* Full-Width URL Input */}
                          <div className="space-y-1.5 text-xs">
                            <label className="block text-[11px] font-bold text-charcoal">
                              Pautan Destinasi (URL)
                            </label>
                            <div className="flex items-center space-x-2">
                              <div className="relative flex-1">
                                <input
                                  type="text"
                                  value={item.href || ''}
                                  onChange={(e) =>
                                    handleUpdateMegaMenuItem(activeCol.id, item.id, { href: e.target.value })
                                  }
                                  placeholder="/collections/mattress?material=latex"
                                  className="w-full pl-3 pr-8 py-2 bg-warmwhite border border-borderLight rounded-xl font-mono text-xs outline-none focus:border-forest"
                                />
                                {item.href && (
                                  <Link
                                    href={item.href}
                                    target="_blank"
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-forest"
                                    title="Uji buka pautan di tab baru"
                                  >
                                    <LinkIcon className="w-3.5 h-3.5" />
                                  </Link>
                                )}
                              </div>
                            </div>

                            {/* Quick Suggestion Chips */}
                            <div className="flex items-center gap-1.5 flex-wrap pt-1">
                              <span className="text-[10px] text-secondary">Pintasan Cepat:</span>
                              {activeCol.id === 'col-material' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateMegaMenuItem(activeCol.id, item.id, { href: '/collections/mattress?material=latex' })}
                                    className="text-[10px] px-2 py-0.5 rounded-lg bg-warmwhite hover:bg-gold/15 text-forest border border-borderLight font-mono cursor-pointer"
                                  >
                                    ?material=latex
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateMegaMenuItem(activeCol.id, item.id, { href: '/collections/mattress?material=hybrid' })}
                                    className="text-[10px] px-2 py-0.5 rounded-lg bg-warmwhite hover:bg-gold/15 text-forest border border-borderLight font-mono cursor-pointer"
                                  >
                                    ?material=hybrid
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateMegaMenuItem(activeCol.id, item.id, { href: '/collections/mattress?material=memory' })}
                                    className="text-[10px] px-2 py-0.5 rounded-lg bg-warmwhite hover:bg-gold/15 text-forest border border-borderLight font-mono cursor-pointer"
                                  >
                                    ?material=memory
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateMegaMenuItem(activeCol.id, item.id, { href: '/collections/mattress?material=ortho' })}
                                    className="text-[10px] px-2 py-0.5 rounded-lg bg-warmwhite hover:bg-gold/15 text-forest border border-borderLight font-mono cursor-pointer"
                                  >
                                    ?material=ortho
                                  </button>
                                </>
                              )}

                              {activeCol.id === 'col-size' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateMegaMenuItem(activeCol.id, item.id, { href: '/collections/mattress?size=single' })}
                                    className="text-[10px] px-2 py-0.5 rounded-lg bg-warmwhite hover:bg-gold/15 text-forest border border-borderLight font-mono cursor-pointer"
                                  >
                                    ?size=single
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateMegaMenuItem(activeCol.id, item.id, { href: '/collections/mattress?size=supersingle' })}
                                    className="text-[10px] px-2 py-0.5 rounded-lg bg-warmwhite hover:bg-gold/15 text-forest border border-borderLight font-mono cursor-pointer"
                                  >
                                    ?size=supersingle
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateMegaMenuItem(activeCol.id, item.id, { href: '/collections/mattress?size=queen' })}
                                    className="text-[10px] px-2 py-0.5 rounded-lg bg-warmwhite hover:bg-gold/15 text-forest border border-borderLight font-mono cursor-pointer"
                                  >
                                    ?size=queen
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateMegaMenuItem(activeCol.id, item.id, { href: '/collections/mattress?size=king' })}
                                    className="text-[10px] px-2 py-0.5 rounded-lg bg-warmwhite hover:bg-gold/15 text-forest border border-borderLight font-mono cursor-pointer"
                                  >
                                    ?size=king
                                  </button>
                                </>
                              )}

                              {activeCol.id === 'col-firmness' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateMegaMenuItem(activeCol.id, item.id, { href: '/collections/mattress?firmness=soft' })}
                                    className="text-[10px] px-2 py-0.5 rounded-lg bg-warmwhite hover:bg-gold/15 text-forest border border-borderLight font-mono cursor-pointer"
                                  >
                                    ?firmness=soft
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateMegaMenuItem(activeCol.id, item.id, { href: '/collections/mattress?firmness=medium' })}
                                    className="text-[10px] px-2 py-0.5 rounded-lg bg-warmwhite hover:bg-gold/15 text-forest border border-borderLight font-mono cursor-pointer"
                                  >
                                    ?firmness=medium
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateMegaMenuItem(activeCol.id, item.id, { href: '/collections/mattress?firmness=firm' })}
                                    className="text-[10px] px-2 py-0.5 rounded-lg bg-warmwhite hover:bg-gold/15 text-forest border border-borderLight font-mono cursor-pointer"
                                  >
                                    ?firmness=firm
                                  </button>
                                </>
                              )}

                              <button
                                type="button"
                                onClick={() => handleUpdateMegaMenuItem(activeCol.id, item.id, { href: '/collections/mattress' })}
                                className="text-[10px] px-2 py-0.5 rounded-lg bg-warmwhite hover:bg-gold/15 text-forest border border-borderLight font-mono cursor-pointer"
                              >
                                /collections/mattress
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddMegaMenuItem(activeCol.id)}
                      className="w-full py-3 px-4 border border-dashed border-forest/40 hover:border-forest bg-forest/5 hover:bg-forest/10 text-forest rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Pautan Baru Dalam Lajur {activeCol.titleBm || activeCol.title}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ACTIVE PROMO CARD EDITOR (Lajur ke-4) */}
              {isPromoActive && (
                <div className="bg-warmwhite p-4 sm:p-6 rounded-2xl border border-borderLight shadow-xs space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-borderLight pb-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gold/20 text-gold-dark flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-gold-dark" />
                      </div>
                      <div>
                        <h4 className="font-serif text-base font-bold text-forest-dark">
                          Kad Kuis & Promosi Interaktif (Lajur ke-4)
                        </h4>
                        <p className="text-xs text-secondary">
                          Kad sorotan berwarna krim di sebelah kanan mega menu untuk menarik minat pelanggan ke kuiz tilam atau tawaran istimewa.
                        </p>
                      </div>
                    </div>

                    <label className="flex items-center space-x-2 cursor-pointer bg-cream px-3 py-1.5 rounded-xl border border-borderLight">
                      <input
                        type="checkbox"
                        checked={menu.promoCard.enabled !== false}
                        onChange={(e) => handleUpdateMegaPromo({ enabled: e.target.checked })}
                        className="w-4 h-4 text-forest rounded accent-forest cursor-pointer"
                      />
                      <span className="text-xs font-bold text-charcoal">
                        {menu.promoCard.enabled !== false ? 'Kad Aktif' : 'Kad Ditutup'}
                      </span>
                    </label>
                  </div>

                  {menu.promoCard.enabled !== false ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-bold text-charcoal mb-1">
                          Teks Lencana Kecil (Badge)
                        </label>
                        <input
                          type="text"
                          value={menu.promoCard.badge || ''}
                          onChange={(e) => handleUpdateMegaPromo({ badge: e.target.value })}
                          placeholder="Contoh: PERSONALIZED FIT"
                          className="w-full px-3.5 py-2.5 bg-cream-light border border-borderLight rounded-xl font-semibold outline-none focus:border-forest"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-charcoal mb-1">
                          Pautan Destinasi Butang (URL)
                        </label>
                        <input
                          type="text"
                          value={menu.promoCard.buttonUrl || ''}
                          onChange={(e) => handleUpdateMegaPromo({ buttonUrl: e.target.value })}
                          placeholder="/finder atau /trial"
                          className="w-full px-3.5 py-2.5 bg-cream-light border border-borderLight rounded-xl font-mono text-xs outline-none focus:border-forest"
                        />
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="text-[10px] text-secondary">Pintasan:</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateMegaPromo({ buttonUrl: '/finder' })}
                            className="text-[10px] px-2 py-0.5 rounded bg-cream hover:bg-gold/15 text-forest border border-borderLight font-mono cursor-pointer"
                          >
                            /finder
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateMegaPromo({ buttonUrl: '/trial' })}
                            className="text-[10px] px-2 py-0.5 rounded bg-cream hover:bg-gold/15 text-forest border border-borderLight font-mono cursor-pointer"
                          >
                            /trial
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateMegaPromo({ buttonUrl: '/showrooms' })}
                            className="text-[10px] px-2 py-0.5 rounded bg-cream hover:bg-gold/15 text-forest border border-borderLight font-mono cursor-pointer"
                          >
                            /showrooms
                          </button>
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-charcoal mb-1">
                          Tajuk Utama Kad (Headline)
                        </label>
                        <input
                          type="text"
                          value={menu.promoCard.title || ''}
                          onChange={(e) => handleUpdateMegaPromo({ title: e.target.value })}
                          placeholder="Contoh: Unsure which mattress suits your body?"
                          className="w-full px-3.5 py-2.5 bg-cream-light border border-borderLight rounded-xl font-serif text-sm font-bold outline-none focus:border-forest"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-charcoal mb-1">
                          Penerangan / Arahan Kuis (Description)
                        </label>
                        <textarea
                          rows={2}
                          value={menu.promoCard.description || ''}
                          onChange={(e) => handleUpdateMegaPromo({ description: e.target.value })}
                          placeholder="Contoh: Take our 60-second Mattress Finder quiz for personalized firmness recommendations."
                          className="w-full px-3.5 py-2.5 bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest leading-relaxed text-xs"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-charcoal mb-1">
                          Teks Pada Butang Tindakan (CTA)
                        </label>
                        <input
                          type="text"
                          value={menu.promoCard.buttonText || ''}
                          onChange={(e) => handleUpdateMegaPromo({ buttonText: e.target.value })}
                          placeholder="Contoh: Start Mattress Quiz"
                          className="w-full px-3.5 py-2.5 bg-cream-light border border-borderLight rounded-xl font-bold outline-none focus:border-forest"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-cream/40 rounded-2xl border border-dashed border-borderLight space-y-2">
                      <p className="text-xs text-charcoal-muted">
                        Kad kuis ini kini ditutup. Hanya 3 lajur pautan tilam yang akan dipaparkan kepada pelanggan di storefront.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleUpdateMegaPromo({ enabled: true })}
                        className="px-4 py-2 bg-forest text-warmwhite text-xs font-bold rounded-xl hover:bg-forest-dark transition-all cursor-pointer"
                      >
                        Aktifkan Semula Kad Kuis
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* BOTTOM SAVE CONTROLLER */}
              <div className="bg-warmwhite p-4 rounded-2xl border border-borderLight shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-secondary flex items-center space-x-1.5 text-center sm:text-left">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span>Kemas kini akan disegerakkan terus ke storefront desktop & menu telefon tanpa reload.</span>
                </span>

                <button
                  type="button"
                  onClick={() => handleSave()}
                  disabled={isSaving}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#1E4E8C] hover:bg-[#13325B] text-warmwhite text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4 text-[#D4AF37]" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan Mega Menu'}</span>
                </button>
              </div>
            </div>
          )
        })()}

        {/* ========================================================================= */}
        {/* TAB 5: REASSURANCE PERKS & GUARANTEES                                     */}
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
                  <ImageUploadDropzone
                    label="Gambar Hiasan Atelier & Kisah KAMAAR"
                    helperText="Seret & lepas foto, tangkap gambar dengan kamera telefon, atau pilih dari galeri."
                    value={config.storySection.imageUrl}
                    onChange={(url) =>
                      setConfig({
                        ...config,
                        storySection: { ...config.storySection, imageUrl: url },
                      })
                    }
                    aspectRatio="square"
                  />
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
                  <ImageUploadDropzone
                    label="Gambar Hiasan Promosi & Tawaran Khas"
                    helperText="Poster tawaran, bilik tidur atau diskaun istimewa."
                    value={config.promotionsBanner.imageUrl}
                    onChange={(url) =>
                      setConfig({
                        ...config,
                        promotionsBanner: { ...config.promotionsBanner, imageUrl: url },
                      })
                    }
                    aspectRatio="video"
                  />
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
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

        {/* MOBILE / DESKTOP SEQUENTIAL STEP NAVIGATION */}
        <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3.5 bg-warmwhite rounded-2xl border border-borderLight shadow-xs">
          <button
            type="button"
            disabled={!hasPrevTab}
            onClick={goToPrevTab}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-borderLight bg-cream/50 text-forest-dark disabled:opacity-30 disabled:pointer-events-none hover:bg-cream transition-all cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-forest" />
            <span className="hidden xs:inline text-secondary font-normal">Sebelum:</span>
            <span className="font-bold">{hasPrevTab ? tabs[currentTabIndex - 1].shortLabel : 'Mula'}</span>
          </button>

          <div className="text-center">
            <span className="text-[11px] font-bold text-forest-dark block truncate max-w-[130px] xs:max-w-none">
              {currentTab.label}
            </span>
            <span className="text-[10px] text-secondary">
              Seksyen {currentTabIndex + 1} daripada {tabs.length}
            </span>
          </div>

          <button
            type="button"
            disabled={!hasNextTab}
            onClick={goToNextTab}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-borderLight bg-cream/50 text-forest-dark disabled:opacity-30 disabled:pointer-events-none hover:bg-cream transition-all cursor-pointer"
          >
            <span className="hidden xs:inline text-secondary font-normal">Seterusnya:</span>
            <span className="font-bold">{hasNextTab ? tabs[currentTabIndex + 1].shortLabel : 'Tamat'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-forest" />
          </button>
        </div>

        {/* STICKY BOTTOM SAVE ACTION BAR FOR MOBILE & DESKTOP */}
        <div className="sticky bottom-2 sm:bottom-4 z-40 bg-warmwhite/95 backdrop-blur-md p-2.5 sm:p-4 rounded-2xl border border-[#B49A58]/30 shadow-lg flex items-center justify-between gap-2 sm:gap-3 animate-fade-in-up pb-[max(0.625rem,env(safe-area-inset-bottom))]">
          <div className="hidden sm:flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-secondary">
              Perubahan sedia disimpan ke pangkalan data KAMAAR
            </span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center space-x-1.5 px-3.5 py-2.5 bg-cream hover:bg-gold/15 text-[#1E4E8C] border border-borderLight rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0"
            >
              <Eye className="w-3.5 h-3.5 text-gold-dark" />
              <span>Lihat Laman</span>
            </Link>

            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 bg-[#1E4E8C] hover:bg-[#13325B] text-warmwhite text-xs font-bold rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer hover:scale-[1.02]"
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
