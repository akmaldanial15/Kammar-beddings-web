'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BedDouble,
  Layers,
  Boxes,
  ShoppingBag,
  Tag,
  Share2,
  MapPin,
  ShieldCheck,
  Settings,
  History,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Palette,
  CreditCard,
  Search,
  Sliders,
  Save,
  Phone,
  Bell,
  Truck,
  Building,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { KamaarLogo } from '@/components/brand/KamaarLogo'
import { AdminLogoutButton } from './AdminLogoutButton'
import { SiteSettings } from '@/types'

interface AdminNavProps {
  session: {
    name: string
    email: string
    role: string
  }
}

export interface NavItem {
  label: string
  href: string
  icon: any
  keywords: string
  isNew?: boolean
}

export interface NavGroup {
  id: string
  title: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    id: 'operations',
    title: 'Operasi & Pesanan',
    items: [
      { label: 'Overview', href: '/admin', icon: LayoutDashboard, keywords: 'dashboard metrik ringkasan jualan' },
      { label: 'Orders & Fulfilment', href: '/admin/orders', icon: ShoppingBag, keywords: 'pesanan tempahan pelanggan invois bayaran paid delivery' },
      { label: 'Inventory & Stock', href: '/admin/inventory', icon: Boxes, keywords: 'stok baki fizikal sku inventori restock gudang' },
    ],
  },
  {
    id: 'storefront',
    title: 'Katalog & Kedai',
    items: [
      { label: 'Products & Variants', href: '/admin/products', icon: BedDouble, keywords: 'tilam mattress bantal topper saiz varian harga' },
      { label: 'Categories & Nav', href: '/admin/categories', icon: Layers, keywords: 'kategori menu navigasi tag' },
      { label: 'Website Editor', href: '/admin/website-editor', icon: Palette, isNew: true, keywords: 'banner hero announcement theme warna visual gambar logo' },
      { label: 'Promotions & Coupons', href: '/admin/promotions', icon: Tag, keywords: 'baucar diskaun kupon promosi diskaun kod' },
    ],
  },
  {
    id: 'retail',
    title: 'Pemasaran & Cawangan',
    items: [
      { label: 'Affiliates & Agents', href: '/admin/affiliates', icon: Share2, keywords: 'agen komisen affiliate jualan link referral' },
      { label: 'Showroom Studios', href: '/admin/showrooms', icon: MapPin, keywords: 'galeri studio cawangan kedai fizikal showroom appointment' },
      { label: 'Warranty Registrations', href: '/admin/warranties', icon: ShieldCheck, keywords: 'waranti jaminan pendaftaran tuntutan claim' },
    ],
  },
  {
    id: 'settings',
    title: 'Sistem & Tetapan',
    items: [
      { label: 'Payment Settings', href: '/admin/payments', icon: CreditCard, isNew: true, keywords: 'payment bayaran stripe fpx atome duitnow toyyibpay gateway bank' },
      { label: 'Site Settings', href: '/admin/settings', icon: Settings, keywords: 'tetapan jenama whatsapp telefon email shipping had percuma admin' },
      { label: 'Admin Audit Log', href: '/admin/audits', icon: History, keywords: 'audit log aktiviti keselamatan staf rekod' },
    ],
  },
]

const navItems = navGroups.flatMap((g) => g.items)

export function AdminNav({ session }: AdminNavProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Quick Settings Drawer / Modal State
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false)
  const [quickSettings, setQuickSettings] = useState<Partial<SiteSettings> & { adminName?: string }>({
    brandName: 'KAMAAR Beddings',
    tagline: 'Pengeluar Tilam Toto, Kekabu & Tekstil Asrama Tunas Sinar Jaya',
    announcementText: 'Jualan Gudang Terus Dari Kilang • Penghantaran ke Seluruh Semenanjung Malaysia',
    isAnnouncementActive: true,
    contactPhone: '019-478 6991',
    contactEmail: 'tunassinar@gmail.com',
    whatsappNumber: '+60194786991',
    freeShippingThresholdSen: 20000,
    adminName: session?.name || 'Kamaar Admin',
  })
  const [isQuickSaving, setIsQuickSaving] = useState(false)
  const [quickFeedback, setQuickFeedback] = useState<string | null>(null)

  // Automatically close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevent background scrolling when mobile drawer or quick settings is open
  useEffect(() => {
    if (isMobileMenuOpen || isQuickSettingsOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen, isQuickSettingsOpen])

  // Global Keyboard Shortcut: Ctrl+K or Cmd+K to open Quick Settings / Focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsQuickSettingsOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Load current settings when quick settings modal opens
  const openQuickSettings = async () => {
    setIsQuickSettingsOpen(true)
    setQuickFeedback(null)
    try {
      const res = await fetch('/api/admin/settings')
      if (res.ok) {
        const data = await res.json()
        if (data.settings) {
          setQuickSettings({
            ...data.settings,
            adminName: session?.name || 'Kamaar Admin',
          })
        }
      }
    } catch {
      // Fallback to initial state
    }
  }

  // Handle Quick Save
  const handleSaveQuickSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsQuickSaving(true)
    setQuickFeedback(null)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: quickSettings,
          adminName: quickSettings.adminName,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setQuickFeedback('Tetapan utama berjaya disimpan!')
        setTimeout(() => {
          setQuickFeedback(null)
          setIsQuickSettingsOpen(false)
        }, 1200)
      } else {
        setQuickFeedback(data.error || 'Gagal menyimpan tetapan pantas.')
      }
    } catch {
      setQuickFeedback('Ralat rangkaian semasa menyimpan.')
    } finally {
      setIsQuickSaving(false)
    }
  }

  // Ensure admin name displays as Kamaar Admin if empty or legacy
  const adminName =
    session?.name && !session.name.toLowerCase().includes('syed')
      ? session.name
      : 'Kamaar Admin'
  const adminInitial = adminName.charAt(0).toUpperCase() || 'K'

  // Filtered navigation items based on search query
  const q = searchQuery.toLowerCase().trim()
  const filteredNavItems = navItems.filter(
    (item) =>
      !q ||
      item.label.toLowerCase().includes(q) ||
      item.keywords.toLowerCase().includes(q) ||
      item.href.toLowerCase().includes(q)
  )

  // Quick settings matching keywords
  const matchesQuickSettingsKeywords =
    q &&
    ('whatsapp phone telefon contact hubungi announcement banner pengumuman brand jenama shipping penghantaran free delivery currency ringgit admin profile'.includes(
      q
    ))

  // Find active item title for mobile header
  const activeItem = navItems.find((item) => {
    if (item.href === '/admin') return pathname === '/admin'
    return pathname.startsWith(item.href)
  }) || { label: 'Admin Atelier', href: '/admin' }

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. MOBILE STICKY TOP APP BAR (< md)                                      */}
      {/* ========================================================================= */}
      <header className="md:hidden sticky top-0 z-40 bg-[#13325B] text-warmwhite border-b border-[#B49A58]/20 px-3.5 py-2.5 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          {/* Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-1 rounded-xl bg-white/10 hover:bg-white/15 text-warmwhite transition-colors cursor-pointer flex items-center justify-center"
            aria-label="Buka Menu Navigasi Admin"
          >
            <Menu className="w-5 h-5 text-[#D4AF37]" />
          </button>

          {/* Current Page Title & Mini Logo */}
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold">
                KAMAAR ATELIER
              </span>
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
            </div>
            <h1 className="text-sm font-bold text-white tracking-tight truncate max-w-[170px] sm:max-w-xs">
              {activeItem.label}
            </h1>
          </div>
        </div>

        {/* Right side: Quick Settings trigger + Staff Profile Avatar */}
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={openQuickSettings}
            className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-[#D4AF37] text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
            title="Buka Quick Edit Tetapan"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick Edit</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
            title="Lihat Kedai Awam"
          >
            <ExternalLink className="w-4 h-4 text-[#D4AF37]" />
          </Link>
        </div>
      </header>

      {/* Helper to render navigation items */}
      {(() => {
        const renderSingleNavItem = (item: NavItem, onItemClick?: () => void) => {
          const Icon = item.icon
          const isActive =
            item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={`group/nav flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#1E4E8C] to-[#153D73] text-white font-bold border-l-2 border-[#D4AF37] shadow-sm shadow-black/25 ring-1 ring-white/10'
                  : 'text-blue-100/75 hover:bg-white/[0.08] hover:text-white font-medium'
              }`}
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <div
                  className={`p-1 rounded-lg transition-colors flex-shrink-0 ${
                    isActive
                      ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                      : 'text-blue-200/50 group-hover/nav:text-[#D4AF37] group-hover/nav:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">{item.label}</span>
              </div>
              <div className="flex items-center space-x-1.5 flex-shrink-0">
                {item.isNew && (
                  <span className="px-1.5 py-0.2 text-[8.5px] font-bold rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 uppercase tracking-wider animate-pulse">
                    Baru
                  </span>
                )}
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37] transition-transform group-hover/nav:translate-x-0.5" />
                )}
              </div>
            </Link>
          )
        }

        const renderNavContent = (onItemClick?: () => void) => {
          if (filteredNavItems.length === 0) {
            return (
              <div className="p-6 text-center text-xs text-neutral-400">
                <p>Tiada menu sepadan</p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-2 px-3 py-1 bg-white/10 hover:bg-white/20 text-[#D4AF37] rounded-lg font-bold text-[11px] cursor-pointer transition-colors"
                >
                  Kosongkan carian
                </button>
              </div>
            )
          }

          if (q) {
            return (
              <div className="p-2 space-y-1">
                <div className="px-3 py-1 text-[9.5px] font-bold uppercase tracking-wider text-[#D4AF37]">
                  Hasil Carian ({filteredNavItems.length})
                </div>
                {filteredNavItems.map((item) => renderSingleNavItem(item, onItemClick))}
              </div>
            )
          }

          return (
            <nav className="p-2.5 space-y-3.5 text-xs">
              {navGroups.map((group) => {
                return (
                  <div key={group.id} className="space-y-1">
                    <div className="px-3 pt-1 pb-1 flex items-center justify-between text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#D4AF37]/80 select-none">
                      <span>{group.title}</span>
                    </div>
                    <div className="space-y-0.5">
                      {group.items.map((item) => renderSingleNavItem(item, onItemClick))}
                    </div>
                  </div>
                )
              })}
            </nav>
          )
        }

        return (
          <>
            {/* ========================================================================= */}
            {/* 2. MOBILE SLIDE-OVER DRAWER NAVIGATION (< md)                            */}
            {/* ========================================================================= */}
            <div
              className={`fixed inset-0 z-50 md:hidden ${
                isMobileMenuOpen
                  ? 'pointer-events-auto visible'
                  : 'pointer-events-none invisible delay-300'
              }`}
            >
              {/* Backdrop Blur Overlay */}
              <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${
                  isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Drawer Container */}
              <div
                className={`fixed inset-y-0 left-0 w-[84%] max-w-xs bg-gradient-to-b from-[#11294A] via-[#0E223D] to-[#0A192E] text-warmwhite shadow-2xl flex flex-col justify-between border-r border-[#B49A58]/25 z-10 transform transition-transform duration-300 ease-out will-change-transform ${
                  isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
              >
                  <div className="flex-1 overflow-y-auto">
                    {/* Drawer Header */}
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <Link
                          href="/admin"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block flex-1 mr-2"
                        >
                          <div className="bg-white rounded-2xl p-2.5 px-3 border border-white/40 shadow-sm flex items-center justify-between">
                            <div className="relative h-10 w-44">
                              <Image
                                src="/images/kamaar-logo-clean.png"
                                alt="KAMAAR Beddings"
                                fill
                                className="object-contain object-left"
                                priority
                              />
                            </div>
                            <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider bg-[#13325B] text-white border border-[#D4AF37]/40 flex-shrink-0">
                              HQ
                            </span>
                          </div>
                        </Link>

                        <button
                          type="button"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="p-2 rounded-xl text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                          aria-label="Tutup Menu"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between px-1">
                        <span className="text-[8.5px] uppercase tracking-[0.22em] text-[#D4AF37] font-extrabold">
                          OPERATIONS ATELIER
                        </span>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[8.5px] font-bold text-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          SISTEM AKTIF
                        </span>
                      </div>

                      {/* Staff Profile Card */}
                      <div className="mt-3 p-2.5 bg-white/[0.05] rounded-2xl border border-white/10">
                        <div className="flex items-center space-x-2.5">
                          <div className="relative flex-shrink-0">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#B49A58] to-[#8C6B1C] text-forest-dark flex items-center justify-center font-black text-xs shadow-md border border-white/20">
                              {adminInitial}
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0E223D] rounded-full" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-white block truncate">
                              {adminName}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[8.5px] font-bold uppercase tracking-wider text-[#D4AF37] bg-gold/15 px-1.5 py-0.2 rounded border border-gold/25">
                                {session.role.replace('_', ' ')}
                              </span>
                              <span className="text-[9px] text-blue-200/60 truncate">
                                Tunas Sinar Jaya
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Search & Quick Edit Bar in Mobile Drawer */}
                    <div className="p-3 border-b border-white/10 space-y-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-blue-200/50 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Cari menu & tetapan..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-8 pr-7 py-2 text-xs rounded-xl bg-black/25 border border-white/10 text-white placeholder:text-blue-200/50 focus:outline-none focus:border-[#D4AF37] focus:bg-black/35 transition-all shadow-inner"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          openQuickSettings()
                        }}
                        className="w-full py-2 px-3 bg-gradient-to-r from-gold/20 via-gold/10 to-transparent hover:from-gold/30 hover:to-gold/15 border border-gold/40 rounded-xl text-xs font-bold text-[#F3E5AB] flex items-center justify-between shadow-xs cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Quick Edit Settings</span>
                        </div>
                        <span className="text-[10px] text-[#D4AF37] font-bold">&rarr;</span>
                      </button>
                    </div>

                    {/* Navigation Links */}
                    {renderNavContent(() => setIsMobileMenuOpen(false))}
                  </div>

                  {/* Drawer Bottom Actions */}
                  <div className="p-3.5 border-t border-white/10 space-y-2 text-xs bg-gradient-to-b from-[#11294A] to-[#0A192E]">
                    <Link
                      href="/"
                      target="_blank"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-neutral-200 hover:text-white transition-all shadow-xs"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center text-gold">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 text-left">
                          <span className="text-xs font-bold text-white block leading-tight">Lihat Kedai Awam</span>
                          <span className="text-[9.5px] text-blue-200/70 block truncate">kamaarbeddings.my</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-[#D4AF37] font-bold">&rarr;</span>
                    </Link>

                    <AdminLogoutButton />
                  </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* 3. DESKTOP PERMANENT SIDEBAR (>= md)                                     */}
            {/* ========================================================================= */}
            <aside className="hidden md:flex md:w-68 lg:w-72 bg-gradient-to-b from-[#11294A] via-[#0E223D] to-[#0A192E] text-warmwhite flex-shrink-0 flex-col justify-between border-r border-[#B49A58]/25 min-h-screen sticky top-0 h-screen select-none shadow-2xl z-20">
              <div className="flex-1 overflow-y-auto no-scrollbar">
                {/* Brand Header */}
                <div className="p-4 border-b border-white/10 relative">
                  <Link href="/admin" className="block group">
                    <div className="bg-white rounded-2xl p-3 px-3.5 border border-white/50 shadow-md flex items-center justify-between transition-all group-hover:border-gold/80 group-hover:shadow-lg">
                      <div className="relative h-11 w-44">
                        <Image
                          src="/images/kamaar-logo-clean.png"
                          alt="KAMAAR Beddings (Tunas Sinar Jaya)"
                          fill
                          className="object-contain object-left"
                          priority
                        />
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[8.5px] font-black uppercase tracking-wider bg-[#13325B] text-white border border-[#D4AF37]/50 shadow-xs flex-shrink-0">
                        HQ
                      </span>
                    </div>
                  </Link>

                  <div className="flex items-center justify-between mt-2.5 px-1">
                    <span className="text-[8.5px] uppercase tracking-[0.22em] text-[#D4AF37] font-extrabold">
                      OPERATIONS ATELIER
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[8.5px] font-bold text-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      SISTEM AKTIF
                    </span>
                  </div>

                  {/* Staff Info Card */}
                  <div className="mt-3 p-2.5 bg-white/[0.05] hover:bg-white/[0.08] rounded-2xl border border-white/10 transition-all backdrop-blur-sm shadow-2xs group/staff">
                    <div className="flex items-center space-x-2.5">
                      <div className="relative flex-shrink-0">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#B49A58] to-[#8C6B1C] text-forest-dark flex items-center justify-center font-black text-xs shadow-md border border-white/20">
                          {adminInitial}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0E223D] rounded-full" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-white block truncate tracking-tight group-hover/staff:text-gold-light transition-colors">
                          {adminName}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[8.5px] font-bold uppercase tracking-wider text-[#D4AF37] bg-gold/15 px-1.5 py-0.2 rounded border border-gold/25">
                            {session.role.replace('_', ' ')}
                          </span>
                          <span className="text-[9px] text-blue-200/60 truncate">
                            Tunas Sinar Jaya
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search & Quick Edit Controls in Sidebar */}
                <div className="p-3 border-b border-white/10 space-y-2">
                  <div className="relative group">
                    <Search className="w-3.5 h-3.5 text-blue-200/50 absolute left-3 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#D4AF37]" />
                    <input
                      type="text"
                      placeholder="Cari menu & tetapan..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-12 py-2 text-xs rounded-xl bg-black/25 border border-white/10 text-white placeholder:text-blue-200/50 focus:outline-none focus:border-[#D4AF37] focus:bg-black/35 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all shadow-inner"
                    />
                    {searchQuery ? (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    ) : (
                      <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-blue-200/70 font-mono border border-white/10">
                        ⌘K
                      </kbd>
                    )}
                  </div>

                  {/* Quick Edit Trigger Button */}
                  <button
                    type="button"
                    onClick={openQuickSettings}
                    className="w-full py-2 px-3 bg-gradient-to-r from-gold/20 via-gold/10 to-transparent hover:from-gold/30 hover:to-gold/15 border border-gold/40 hover:border-gold/60 rounded-xl text-xs font-bold text-[#F3E5AB] hover:text-white flex items-center justify-between shadow-xs transition-all cursor-pointer group"
                    title="Sunting tetapan pantas terus tanpa tukar halaman (Ctrl+K)"
                  >
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] group-hover:rotate-12 transition-transform" />
                      <span>Quick Edit Settings</span>
                    </div>
                    <span className="text-[10px] text-[#D4AF37] font-bold group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                  </button>
                </div>

                {/* Quick Settings Shortcut Banner when searching settings keywords */}
                {matchesQuickSettingsKeywords && (
                  <div className="m-3 p-2.5 rounded-xl bg-amber-500/10 border border-[#D4AF37]/30 text-xs space-y-1.5 animate-fade-in">
                    <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                      ⚡ Tetapan Ditemui
                    </span>
                    <p className="text-[11px] text-neutral-200">
                      Padanan kata kunci untuk tetapan kedai dijumpai.
                    </p>
                    <button
                      type="button"
                      onClick={openQuickSettings}
                      className="w-full py-1.5 bg-[#D4AF37] hover:bg-[#c29f2e] text-[#13325B] font-bold rounded-lg text-xs transition-colors cursor-pointer text-center block"
                    >
                      Buka Quick Edit Sekarang
                    </button>
                  </div>
                )}

                {/* Categorized Navigation Links */}
                {renderNavContent()}
              </div>

              {/* Desktop Footer Actions */}
              <div className="p-3.5 border-t border-white/10 space-y-2 text-xs bg-gradient-to-b from-[#11294A] to-[#0A192E]">
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-gold/40 text-neutral-200 hover:text-white transition-all shadow-xs group"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center text-gold group-hover:scale-105 transition-transform">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 text-left">
                      <span className="text-xs font-bold text-white block leading-tight">Lihat Kedai Awam</span>
                      <span className="text-[9.5px] text-blue-200/70 block truncate">kamaarbeddings.my</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#D4AF37] font-bold group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </Link>

                <AdminLogoutButton />

                <div className="pt-1 text-center">
                  <span className="text-[9px] text-blue-200/40 tracking-wider">
                    TSJ Admin v2.4 • Tasek Gelugor
                  </span>
                </div>
              </div>
            </aside>
          </>
        )
      })()}

      {/* ========================================================================= */}
      {/* 4. GLOBAL QUICK EDIT SETTINGS MODAL (Accessible from anywhere)           */}
      {/* ========================================================================= */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 transition-all duration-300 ease-in-out ${
          isQuickSettingsOpen
            ? 'pointer-events-auto opacity-100 visible'
            : 'pointer-events-none opacity-0 invisible delay-150'
        }`}
      >
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${
            isQuickSettingsOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsQuickSettingsOpen(false)}
        />
        <div
          className={`relative z-10 bg-white w-full max-w-xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden font-sans flex flex-col max-h-[90vh] transform transition-all duration-300 ease-out will-change-transform ${
            isQuickSettingsOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'
          }`}
        >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[#13325B] text-warmwhite flex items-center justify-between border-b border-[#B49A58]/20 flex-shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-[#B49A58]/40 text-[#D4AF37] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-white leading-tight">
                    Quick Edit & Tetapan Pantas
                  </h3>
                  <p className="text-[11px] text-neutral-300">
                    Kemaskini tetapan asas tanpa perlu keluar dari halaman semasa.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsQuickSettingsOpen(false)}
                className="text-neutral-300 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Feedback Toast */}
            {quickFeedback && (
              <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{quickFeedback}</span>
                </div>
              </div>
            )}

            {/* Quick Edit Form Body */}
            <form onSubmit={handleSaveQuickSettings} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {/* Brand & Admin Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-dark mb-1">
                    Nama Jenama (Brand Name)
                  </label>
                  <input
                    type="text"
                    required
                    value={quickSettings.brandName || ''}
                    onChange={(e) => setQuickSettings({ ...quickSettings, brandName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-dark mb-1">
                    Nama Pentadbir (Admin Name)
                  </label>
                  <input
                    type="text"
                    required
                    value={quickSettings.adminName || ''}
                    onChange={(e) => setQuickSettings({ ...quickSettings, adminName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Announcement Bar Quick Edit */}
              <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-purple-900 text-xs">
                    <Bell className="w-3.5 h-3.5 text-purple-700" />
                    <span>Top Announcement Banner</span>
                  </div>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-purple-800">
                    <input
                      type="checkbox"
                      checked={Boolean(quickSettings.isAnnouncementActive ?? quickSettings.announcementActive)}
                      onChange={(e) =>
                        setQuickSettings({
                          ...quickSettings,
                          isAnnouncementActive: e.target.checked,
                          announcementActive: e.target.checked,
                        })
                      }
                      className="w-3.5 h-3.5 accent-purple-700 rounded"
                    />
                    <span>Aktif</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={quickSettings.announcementText || ''}
                  onChange={(e) => setQuickSettings({ ...quickSettings, announcementText: e.target.value })}
                  placeholder="Mesej banner kedai..."
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 focus:border-purple-500 bg-white text-xs"
                />
              </div>

              {/* WhatsApp & Contact Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-dark mb-1">
                    No. WhatsApp Rasmi
                  </label>
                  <input
                    type="text"
                    value={quickSettings.whatsappNumber || ''}
                    onChange={(e) => setQuickSettings({ ...quickSettings, whatsappNumber: e.target.value })}
                    placeholder="+60123456789"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-gold bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-dark mb-1">
                    No. Telefon Atelier
                  </label>
                  <input
                    type="text"
                    value={quickSettings.contactPhone || ''}
                    onChange={(e) => setQuickSettings({ ...quickSettings, contactPhone: e.target.value })}
                    placeholder="+60 3-2141 8900"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-gold bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Free Shipping Threshold */}
              <div>
                <label className="block font-bold text-forest-dark mb-1">
                  Had Minimum Penghantaran Percuma (RM)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    RM
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={((quickSettings.freeShippingThresholdSen || 0) / 100).toFixed(2)}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0
                      setQuickSettings({
                        ...quickSettings,
                        freeShippingThresholdSen: Math.round(val * 100),
                      })
                    }}
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 focus:border-gold font-mono bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Footer Actions inside Modal */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/admin/settings"
                  onClick={() => setIsQuickSettingsOpen(false)}
                  className="text-xs font-bold text-[#1E4E8C] hover:underline"
                >
                  Buka Tetapan Penuh (Full Settings) &rarr;
                </Link>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsQuickSettingsOpen(false)}
                    className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    disabled={isQuickSaving}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-forest-dark hover:bg-forest text-warmwhite font-bold rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isQuickSaving ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5 text-gold" />
                        <span>Simpan Segera</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
    </>
  )
}
