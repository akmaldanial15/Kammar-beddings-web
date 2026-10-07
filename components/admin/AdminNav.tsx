'use client'

import React, { useState, useEffect } from 'react'
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

const navItems = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard, keywords: 'dashboard metrik ringkasan jualan' },
  { label: 'Products & Variants', href: '/admin/products', icon: BedDouble, keywords: 'tilam mattress bantal topper saiz varian harga' },
  { label: 'Categories & Nav', href: '/admin/categories', icon: Layers, keywords: 'kategori menu navigasi tag' },
  { label: 'Website Editor', href: '/admin/website-editor', icon: Palette, isNew: true, keywords: 'banner hero announcement theme warna visual gambar logo' },
  { label: 'Inventory & Stock', href: '/admin/inventory', icon: Boxes, keywords: 'stok baki fizikal sku inventori restock gudang' },
  { label: 'Orders & Fulfilment', href: '/admin/orders', icon: ShoppingBag, keywords: 'pesanan tempahan pelanggan invois bayaran paid delivery' },
  { label: 'Promotions & Coupons', href: '/admin/promotions', icon: Tag, keywords: 'baucar diskaun kupon promosi diskaun kod' },
  { label: 'Payment Settings', href: '/admin/payments', icon: CreditCard, isNew: true, keywords: 'payment bayaran stripe fpx atome duitnow toyyibpay gateway bank' },
  { label: 'Affiliates & Agents', href: '/admin/affiliates', icon: Share2, keywords: 'agen komisen affiliate jualan link referral' },
  { label: 'Showroom Studios', href: '/admin/showrooms', icon: MapPin, keywords: 'galeri studio cawangan kedai fizikal showroom appointment' },
  { label: 'Warranty Registrations', href: '/admin/warranties', icon: ShieldCheck, keywords: 'waranti jaminan pendaftaran tuntutan claim' },
  { label: 'Site Settings', href: '/admin/settings', icon: Settings, keywords: 'tetapan jenama whatsapp telefon email shipping had percuma admin' },
  { label: 'Admin Audit Log', href: '/admin/audits', icon: History, keywords: 'audit log aktiviti keselamatan staf rekod' },
]

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

      {/* ========================================================================= */}
      {/* 2. MOBILE SLIDE-OVER DRAWER NAVIGATION (< md)                            */}
      {/* ========================================================================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 left-0 w-[84%] max-w-xs bg-[#13325B] text-warmwhite shadow-2xl flex flex-col justify-between border-r border-[#B49A58]/20 z-10 animate-in slide-in-from-left duration-300">
            <div className="flex-1 overflow-y-auto">
              {/* Drawer Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block">
                  <KamaarLogo variant="horizontal" size="sm" theme="dark" />
                  <span className="text-[8.5px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold block mt-1.5">
                    Admin Atelier Dashboard
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 cursor-pointer"
                  aria-label="Tutup Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Staff Profile Card */}
              <div className="p-3 border-b border-white/10 bg-white/5">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E4E8C] to-[#2A6DB5] border border-[#B49A58]/40 text-[#D4AF37] flex items-center justify-center font-bold text-sm shadow-md">
                    {adminInitial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-white block truncate">
                      {adminName}
                    </span>
                    <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider font-semibold block">
                      {session.role.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Search & Quick Edit Bar in Mobile Drawer */}
              <div className="p-3 border-b border-white/10 space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari menu / tetapan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-7 py-2 text-xs rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#D4AF37] focus:bg-white/15 transition-all"
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
                  className="w-full py-2 px-3 bg-gradient-to-r from-[#1E4E8C] to-[#13325B] border border-[#B49A58]/40 rounded-xl text-xs font-bold text-[#D4AF37] flex items-center justify-center gap-1.5 shadow-xs cursor-pointer hover:bg-white/10"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>⚡ Quick Edit Settings</span>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="p-3 space-y-1 text-xs font-medium">
                {filteredNavItems.map((item) => {
                  const Icon = item.icon
                  const isActive =
                    item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#1E4E8C] text-white font-bold border-l-4 border-[#D4AF37] shadow-sm'
                          : 'text-neutral-200 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? 'text-[#D4AF37]' : 'text-neutral-400'
                          }`}
                        />
                        <span className="text-xs">{item.label}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        {item.isNew && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 uppercase tracking-wider animate-pulse">
                            Baru
                          </span>
                        )}
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />}
                      </div>
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-4 border-t border-white/10 space-y-2 text-xs bg-[#0F2746]">
              <Link
                href="/"
                target="_blank"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white transition-colors"
              >
                <span className="flex items-center space-x-2">
                  <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Lihat Kedai Awam</span>
                </span>
                <span className="text-[10px] text-[#D4AF37] font-bold">&rarr;</span>
              </Link>

              <AdminLogoutButton />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DESKTOP PERMANENT SIDEBAR (>= md)                                     */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex md:w-64 bg-[#13325B] text-warmwhite flex-shrink-0 flex-col justify-between border-r border-[#B49A58]/20 min-h-screen sticky top-0 h-screen select-none">
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Brand Header */}
          <div className="p-5 border-b border-white/10">
            <Link href="/admin" className="block">
              <KamaarLogo variant="horizontal" size="sm" theme="dark" />
              <span className="text-[8.5px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold block mt-1.5">
                Admin Atelier Dashboard
              </span>
            </Link>

            {/* Staff Info Card */}
            <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1E4E8C] to-[#2A6DB5] border border-[#B49A58]/40 text-[#D4AF37] flex items-center justify-center font-bold text-xs shadow-xs">
                  {adminInitial}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-white block truncate">
                    {adminName}
                  </span>
                  <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider font-semibold block">
                    {session.role.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Quick Edit Controls in Sidebar */}
          <div className="p-3 border-b border-white/10 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari menu & tetapan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-2 text-xs rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#D4AF37] focus:bg-white/15 transition-all"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              ) : (
                <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] px-1 py-0.5 rounded bg-white/10 text-neutral-300 font-mono">
                  ⌘K
                </kbd>
              )}
            </div>

            {/* Quick Edit Trigger Button */}
            <button
              type="button"
              onClick={openQuickSettings}
              className="w-full py-2 px-3 bg-gradient-to-r from-[#1E4E8C] to-[#13325B] hover:from-[#255fa3] hover:to-[#1a4277] border border-[#B49A58]/40 rounded-xl text-xs font-bold text-[#D4AF37] flex items-center justify-between shadow-xs transition-all cursor-pointer group"
              title="Sunting tetapan pantas terus tanpa tukar halaman (Ctrl+K)"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold group-hover:rotate-12 transition-transform" />
                <span>⚡ Quick Edit Settings</span>
              </div>
              <span className="text-[10px] text-white/50 group-hover:text-white">&rarr;</span>
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

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs font-medium">
            {filteredNavItems.length === 0 ? (
              <div className="p-4 text-center text-xs text-neutral-400">
                <p>Tiada menu sepadan</p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-1 text-[#D4AF37] hover:underline font-bold text-[11px] cursor-pointer"
                >
                  Kosongkan carian
                </button>
              </div>
            ) : (
              filteredNavItems.map((item) => {
                const Icon = item.icon
                const isActive =
                  item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-[#1E4E8C] text-white font-bold border-l-4 border-[#D4AF37] shadow-sm'
                        : 'text-neutral-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-[#D4AF37]' : 'text-neutral-400'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      {item.isNew && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 uppercase tracking-wider animate-pulse">
                          Baru
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    </div>
                  </Link>
                )
              })
            )}
          </nav>
        </div>

        {/* Desktop Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2 text-xs bg-[#0F2746]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white transition-colors"
          >
            <span className="flex items-center space-x-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Lihat Kedai Awam</span>
            </span>
            <span className="text-[10px] text-[#D4AF37] font-bold">&rarr;</span>
          </Link>

          <AdminLogoutButton />
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 4. GLOBAL QUICK EDIT SETTINGS MODAL (Accessible from anywhere)           */}
      {/* ========================================================================= */}
      {isQuickSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden font-sans flex flex-col max-h-[90vh]">
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
      )}
    </>
  )
}
