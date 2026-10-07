'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Search,
  ShoppingBag,
  Heart,
  Scale,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Tag,
  Phone,
  Globe,
  BookOpen,
  Award,
  Layers,
  Building2,
  Flame,
  CheckCircle2,
  Package,
} from 'lucide-react'
import { Category, MegaMenuConfig } from '@/types'
import { initialCategories, initialWebsiteConfig } from '@/lib/db/seedData'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { useCart } from '@/lib/context/CartContext'
import { useWishlist } from '@/lib/context/WishlistContext'
import { useCompare } from '@/lib/context/CompareContext'
import { SearchModal } from './SearchModal'
import { KamaarLogo } from '@/components/brand/KamaarLogo'

export function Header() {
  const { t, locale, setLocale } = useLanguage()
  const pathname = usePathname()
  const { itemCount, openDrawer } = useCart()
  const { wishlistCount } = useWishlist()
  const { compareCount } = useCompare()

  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeMega, setActiveMega] = useState<string | null>(null)
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null)
  const [navCategories, setNavCategories] = useState<Category[]>(() =>
    initialCategories.filter((c) => c.showInNav && c.isActive !== false)
  )
  const [megaMenuConfig, setMegaMenuConfig] = useState<MegaMenuConfig>(
    () => initialWebsiteConfig.megaMenu
  )

  const fetchWebsiteConfig = useCallback(() => {
    fetch('/api/website-config', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.config?.megaMenu) {
          setMegaMenuConfig(data.config.megaMenu)
        }
      })
      .catch((err) => {
        console.error('Failed to load website config for header:', err)
      })
  }, [])

  const fetchCategories = useCallback(() => {
    fetch('/api/categories', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.categories && Array.isArray(data.categories)) {
          setNavCategories(data.categories)
        }
      })
      .catch((err) => {
        console.error('Failed to load categories for nav:', err)
      })
  }, [])

  useEffect(() => {
    fetchCategories()
    fetchWebsiteConfig()

    // Sync when category or website config is updated in admin, tab gets focused, or route changes
    const handleUpdate = () => {
      fetchCategories()
      fetchWebsiteConfig()
    }
    window.addEventListener('kamaar:categories_updated', handleUpdate)
    window.addEventListener('kamaar:website_config_updated', handleUpdate)
    window.addEventListener('focus', handleUpdate)

    return () => {
      window.removeEventListener('kamaar:categories_updated', handleUpdate)
      window.removeEventListener('kamaar:website_config_updated', handleUpdate)
      window.removeEventListener('focus', handleUpdate)
    }
  }, [fetchCategories, fetchWebsiteConfig, pathname])

  const getCategoryLabel = (cat: Category) => {
    // Only map standard untranslated default English names to Malay when user has selected BM language
    if (locale === 'bm') {
      if (cat.slug === 'mattress' && cat.name === 'Mattresses') return t.navMattresses || cat.name
      if (cat.slug === 'pillows' && cat.name === 'Pillows') return t.navPillows || cat.name
      if (cat.slug === 'toppers-protectors' && cat.name === 'Toppers & Protectors') return t.navToppers || cat.name
      if (cat.slug === 'bedframes' && cat.name === 'Bedframes') return t.navBedframes || cat.name
      if (cat.slug === 'bedding' && cat.name === 'Bed Linen') return t.navBedding || cat.name
      if (cat.slug === 'offers' && cat.name === 'Offers & Bundles') return t.navOffers || cat.name
      if ((cat.slug === 'guide' || cat.customUrl === '/blog') && cat.name === 'Sleep Guide') return t.navSleepGuide || cat.name
    }
    // Return live custom name configured by admin from database
    return cat.name
  }

  const megaTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleOpenMega = (menuKey: string) => {
    if (megaTimeoutRef.current) {
      clearTimeout(megaTimeoutRef.current)
      megaTimeoutRef.current = null
    }
    setActiveMega(menuKey)
  }

  const handleCloseMega = () => {
    if (megaTimeoutRef.current) {
      clearTimeout(megaTimeoutRef.current)
    }
    megaTimeoutRef.current = setTimeout(() => {
      setActiveMega(null)
    }, 200) // Intent buffer: ensures mouse crossing gap never drops menu
  }

  // Scroll listener for sticky header transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menus on route change
  useEffect(() => {
    if (megaTimeoutRef.current) {
      clearTimeout(megaTimeoutRef.current)
    }
    setIsMobileMenuOpen(false)
    setActiveMega(null)
  }, [pathname])

  // Keyboard shortcut (⌘K or Ctrl+K) for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-40 w-full transition-all duration-300">
        {/* ========================================================================= */}
        {/* DESKTOP VIEW: 2-TIER LUXURY ARCHITECTURE (ZERO OVERLAP GUARANTEED)        */}
        {/* ========================================================================= */}
        <div className="hidden lg:block">
          {/* TIER 1: BRAND LOGO & EXECUTIVE UTILITY BAR */}
          <div
            className={`transition-all duration-300 ${
              isScrolled
                ? 'py-2 bg-warmwhite/95 backdrop-blur-md border-b border-borderLight/60 shadow-xs'
                : 'py-3.5 bg-warmwhite border-b border-borderLight/40'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-3 items-center">
                {/* Left: Quick Search & Showroom Studios */}
                <div className="flex items-center space-x-4 justify-start">
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="flex items-center space-x-2 text-charcoal-muted hover:text-forest hover:border-gold px-3.5 py-1.5 rounded-full bg-cream/70 hover:bg-cream border border-borderLight transition-all text-xs"
                    aria-label="Search catalog"
                  >
                    <Search className="w-3.5 h-3.5 text-gold-dark" />
                    <span className="text-xs font-medium">Search mattresses, pillows...</span>
                    <kbd className="text-[9px] bg-warmwhite px-1.5 py-0.5 rounded border border-borderLight text-charcoal-muted font-mono font-semibold">
                      ⌘K
                    </kbd>
                  </button>

                  <Link
                    href="/showrooms"
                    className="flex items-center space-x-1.5 text-xs text-charcoal-muted hover:text-forest transition-colors font-medium"
                  >
                    <MapPin className="w-3.5 h-3.5 text-gold-dark" />
                    <span className="hidden xl:inline">Showroom Studios</span>
                  </Link>
                </div>

                {/* Center: Prestigious KAMAAR Beddings Logo (Honored Center Stage) */}
                <div className="flex items-center justify-center">
                  <Link href="/" className="group flex items-center justify-center">
                    <KamaarLogo
                      variant="horizontal"
                      size={isScrolled ? 'sm' : 'md'}
                      theme="light"
                      className="transition-transform group-hover:scale-[1.02]"
                    />
                  </Link>
                </div>

                {/* Right: Language, Currency, Account, Wishlist, Bag */}
                <div className="flex items-center space-x-3 xl:space-x-4 justify-end">
                  {/* Language Switcher */}
                  <div className="flex items-center space-x-1 bg-cream/60 px-2 py-1 rounded-full border border-borderLight text-xs">
                    <Globe className="w-3 h-3 text-gold-dark" />
                    <button
                      onClick={() => setLocale('en')}
                      className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                        locale === 'en'
                          ? 'bg-forest text-warmwhite font-bold'
                          : 'text-charcoal-muted hover:text-forest'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setLocale('bm')}
                      className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                        locale === 'bm'
                          ? 'bg-forest text-warmwhite font-bold'
                          : 'text-charcoal-muted hover:text-forest'
                      }`}
                    >
                      BM
                    </button>
                  </div>

                  {/* Compare Tool */}
                  <Link
                    href="/compare"
                    className="relative p-2 text-charcoal-muted hover:text-forest transition-colors"
                    title="Compare Mattresses"
                    aria-label="Compare"
                  >
                    <Scale className="w-4 h-4" />
                    {compareCount > 0 && (
                      <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-gold text-forest-dark text-[10px] font-black flex items-center justify-center shadow-xs">
                        {compareCount}
                      </span>
                    )}
                  </Link>

                  {/* Wishlist */}
                  <Link
                    href="/account/wishlist"
                    className="relative p-2 text-charcoal-muted hover:text-forest transition-colors"
                    title="My Wishlist"
                    aria-label="Wishlist"
                  >
                    <Heart className="w-4 h-4" />
                    {wishlistCount > 0 && (
                      <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-forest text-warmwhite text-[10px] font-bold flex items-center justify-center shadow-xs">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  {/* Customer Portal */}
                  <Link
                    href="/account"
                    className="p-2 text-charcoal-muted hover:text-forest transition-colors"
                    title="Customer Sanctuary Portal & Orders"
                    aria-label="Account"
                  >
                    <User className="w-4 h-4" />
                  </Link>

                  {/* Luxury Shopping Bag CTA */}
                  <button
                    onClick={openDrawer}
                    className="flex items-center space-x-2 bg-forest hover:bg-forest-dark text-warmwhite px-3.5 py-1.5 rounded-full shadow-sm hover:shadow transition-all group cursor-pointer"
                    aria-label="Open Shopping Bag"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-gold group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold tracking-wider">Bag</span>
                    <span className="w-5 h-5 rounded-full bg-gold text-forest-dark text-[11px] font-black flex items-center justify-center">
                      {itemCount}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* TIER 2: DEDICATED CATEGORY NAVIGATION ROW (PREMIUM LUXURY REDESIGN - DESKTOP ONLY) */}
          <div className="bg-[#FCFAF7]/95 backdrop-blur-md border-b border-[#E8E1D5] shadow-[0_4px_20px_-4px_rgba(13,40,24,0.03)]">
            <div className="max-w-[1460px] mx-auto px-4 sm:px-6 lg:px-8 relative">
              <nav className="flex items-center justify-between py-2 text-[13px] font-medium text-charcoal">
                
                {/* LEFT & CENTER: CORE BEDDING & TEXTILE PRODUCT PILLS */}
                <div className="flex items-center space-x-1 xl:space-x-2">
                  
                  {/* 1. TILAM TOTO (HERO BESTSELLER MEGA MENU) */}
                  <div
                    className="relative"
                    onMouseEnter={() => handleOpenMega('toto')}
                    onMouseLeave={handleCloseMega}
                  >
                    <Link
                      href="/collections/tilam-toto"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-150 whitespace-nowrap group ${
                        pathname.startsWith('/collections/tilam-toto')
                          ? 'bg-forest text-warmwhite font-semibold shadow-xs'
                          : 'hover:bg-forest/5 hover:text-forest text-charcoal font-medium'
                      }`}
                    >
                      <Sparkles className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${
                        pathname.startsWith('/collections/tilam-toto') ? 'text-gold' : 'text-amber-500'
                      }`} />
                      <span>Tilam Toto</span>
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-700 border border-rose-200">
                        HOT
                      </span>
                      <ChevronDown
                        className={`w-3 h-3 text-gold-dark transition-transform duration-200 ${
                          activeMega === 'toto' ? 'rotate-180' : ''
                        }`}
                      />
                    </Link>

                    {/* Mega Menu: Tilam Toto */}
                    {activeMega === 'toto' && (
                      <div
                        className="absolute top-full left-0 pt-2 z-50 pointer-events-auto"
                        onMouseEnter={() => handleOpenMega('toto')}
                        onMouseLeave={handleCloseMega}
                      >
                        <div className="absolute -top-3 left-0 right-0 h-4 bg-transparent" />
                        <div className="w-[840px] bg-warmwhite rounded-2xl shadow-[0_25px_50px_-12px_rgba(13,40,24,0.18)] border border-borderLight p-6 grid grid-cols-12 gap-6 animate-fade-in-down">
                          {/* Col 1: Pilihan Saiz & Corak (4 cols) */}
                          <div className="col-span-4 border-r border-borderLight/80 pr-4">
                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gold-dark pb-2 border-b border-borderLight mb-3 flex items-center justify-between">
                              <span>Pilihan Saiz Kilang</span>
                              <span className="text-[10px] text-charcoal-muted font-normal lowercase">asian fibre</span>
                            </h4>
                            <ul className="space-y-2 text-xs text-charcoal-muted">
                              <li>
                                <Link
                                  href="/products/tilam-toto-asian-polyester-fibre"
                                  onClick={() => setActiveMega(null)}
                                  className="hover:text-forest hover:font-bold block transition-colors group p-1.5 rounded-lg hover:bg-cream"
                                >
                                  <div className="font-semibold text-charcoal group-hover:text-forest">Tilam Toto Queen (5 Kaki)</div>
                                  <div className="text-[11px] text-charcoal-muted">Paling Laris • Corak Floral & Moden</div>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/products/tilam-toto-asian-polyester-fibre"
                                  onClick={() => setActiveMega(null)}
                                  className="hover:text-forest hover:font-bold block transition-colors group p-1.5 rounded-lg hover:bg-cream"
                                >
                                  <div className="font-semibold text-charcoal group-hover:text-forest">Tilam Toto Single (3 Kaki)</div>
                                  <div className="text-[11px] text-charcoal-muted">Sesuai Bilik Anak & Santai Ruang Tamu</div>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/products/tilam-toto-asian-polyester-fibre"
                                  onClick={() => setActiveMega(null)}
                                  className="hover:text-forest hover:font-bold block transition-colors group p-1.5 rounded-lg hover:bg-cream"
                                >
                                  <div className="font-semibold text-charcoal group-hover:text-forest">Tilam Toto King (6 Kaki)</div>
                                  <div className="text-[11px] text-charcoal-muted">Ekstra Luas Untuk Seisi Keluarga</div>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/collections/tilam-toto"
                                  onClick={() => setActiveMega(null)}
                                  className="hover:text-forest hover:font-bold block transition-colors group p-1.5 rounded-lg hover:bg-cream"
                                >
                                  <div className="font-semibold text-charcoal group-hover:text-forest">Sarung Toto Berzip (Cotton)</div>
                                  <div className="text-[11px] text-charcoal-muted">Ganti Corak & Senang Dicuci</div>
                                </Link>
                              </li>
                            </ul>
                          </div>

                          {/* Col 2: Kelebihan Isian & Mutu (4 cols) */}
                          <div className="col-span-4 border-r border-borderLight/80 pr-4">
                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gold-dark pb-2 border-b border-borderLight mb-3">
                              Kelebihan Produk KAMAAR
                            </h4>
                            <div className="space-y-3 text-xs text-charcoal-muted">
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                  <div className="font-semibold text-charcoal">Isian Asian Polyester Fibre</div>
                                  <div className="text-[11px] leading-relaxed">Padat, empuk, gebu dan tidak mudah leper walaupun kerap guna.</div>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                  <div className="font-semibold text-charcoal">Kain Cotton Lembut & Sejuk</div>
                                  <div className="text-[11px] leading-relaxed">Sesuai cuaca tropika, selesa untuk tidur lantai atau atas tilam.</div>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                  <div className="font-semibold text-charcoal">Percuma Beg Penyimpanan</div>
                                  <div className="text-[11px] leading-relaxed">Setiap toto disertakan beg mudah bawa untuk melancong & simpan.</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Col 3: Visual Lifestyle Showcase Card (4 cols) */}
                          <div className="col-span-4 bg-cream rounded-xl p-3 flex flex-col justify-between border border-borderLight overflow-hidden">
                            <div className="relative h-28 w-full rounded-lg overflow-hidden mb-2.5">
                              <Image
                                src="/images/hero/hero-tilam-toto-lifestyle.jpg"
                                alt="Tilam Toto Asian Polyester Fibre KAMAAR Beddings"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-300"
                                sizes="260px"
                              />
                              <div className="absolute top-2 left-2 bg-forest/90 text-gold text-[9px] font-bold px-2 py-0.5 rounded shadow">
                                PALING LARIS
                              </div>
                            </div>
                            <div>
                              <h5 className="font-serif text-sm font-bold text-forest leading-snug">
                                Tilam Toto Asli Terus Dari Kilang
                              </h5>
                              <p className="text-[11px] text-charcoal-muted mt-1 leading-relaxed line-clamp-2">
                                Jahitan quilting kemas, random floral design eksklusif. Harga terus dari pengeluar!
                              </p>
                              <div className="text-xs font-bold text-forest mt-1.5">
                                Dari <span className="text-sm text-gold-dark font-black">RM38.00</span>
                              </div>
                            </div>
                            <Link
                              href="/collections/tilam-toto"
                              onClick={() => setActiveMega(null)}
                              className="mt-2.5 inline-flex items-center justify-between px-3 py-2 bg-forest text-warmwhite text-xs font-bold rounded-lg hover:bg-forest-dark transition-all group"
                            >
                              <span>Lihat Semua Tilam Toto</span>
                              <ArrowRight className="w-3.5 h-3.5 text-gold group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. TILAM & BANTAL KEKABU (100% ASLI MEGA MENU) */}
                  <div
                    className="relative"
                    onMouseEnter={() => handleOpenMega('kekabu')}
                    onMouseLeave={handleCloseMega}
                  >
                    <Link
                      href="/collections/tilam-kekabu"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-150 whitespace-nowrap group ${
                        pathname.startsWith('/collections/tilam-kekabu')
                          ? 'bg-forest text-warmwhite font-semibold shadow-xs'
                          : 'hover:bg-forest/5 hover:text-forest text-charcoal font-medium'
                      }`}
                    >
                      <Award className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${
                        pathname.startsWith('/collections/tilam-kekabu') ? 'text-gold' : 'text-emerald-600'
                      }`} />
                      <span>Tilam & Kekabu</span>
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-800 border border-emerald-200">
                        100% ASLI
                      </span>
                      <ChevronDown
                        className={`w-3 h-3 text-gold-dark transition-transform duration-200 ${
                          activeMega === 'kekabu' ? 'rotate-180' : ''
                        }`}
                      />
                    </Link>

                    {/* Mega Menu: Kekabu */}
                    {activeMega === 'kekabu' && (
                      <div
                        className="absolute top-full left-0 pt-2 z-50 pointer-events-auto"
                        onMouseEnter={() => handleOpenMega('kekabu')}
                        onMouseLeave={handleCloseMega}
                      >
                        <div className="absolute -top-3 left-0 right-0 h-4 bg-transparent" />
                        <div className="w-[780px] bg-warmwhite rounded-2xl shadow-[0_25px_50px_-12px_rgba(13,40,24,0.18)] border border-borderLight p-6 grid grid-cols-12 gap-6 animate-fade-in-down">
                          <div className="col-span-7">
                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gold-dark pb-2 border-b border-borderLight mb-3">
                              Koleksi Kekabu Asli Tradisi Tempatan
                            </h4>
                            <div className="grid grid-cols-2 gap-3 text-xs text-charcoal-muted">
                              <Link
                                href="/products/tilam-kekabu-asli-tradisi"
                                onClick={() => setActiveMega(null)}
                                className="p-2.5 rounded-lg hover:bg-cream border border-transparent hover:border-borderLight transition-all group"
                              >
                                <div className="font-semibold text-charcoal group-hover:text-forest">Tilam Kekabu Tebal</div>
                                <div className="text-[11px] text-charcoal-muted mt-0.5">Jahitan butang tufting tradisi, sejuk & padat.</div>
                              </Link>
                              <Link
                                href="/collections/tilam-kekabu"
                                onClick={() => setActiveMega(null)}
                                className="p-2.5 rounded-lg hover:bg-cream border border-transparent hover:border-borderLight transition-all group"
                              >
                                <div className="font-semibold text-charcoal group-hover:text-forest">Bantal Kekabu Tradisi</div>
                                <div className="text-[11px] text-charcoal-muted mt-0.5">Corak jalur klasik, gebu & tidak panas.</div>
                              </Link>
                              <Link
                                href="/collections/tilam-kekabu"
                                onClick={() => setActiveMega(null)}
                                className="p-2.5 rounded-lg hover:bg-cream border border-transparent hover:border-borderLight transition-all group"
                              >
                                <div className="font-semibold text-charcoal group-hover:text-forest">Bantal Peluk Kekabu</div>
                                <div className="text-[11px] text-charcoal-muted mt-0.5">Isian serat kekabu pokok asli padat.</div>
                              </Link>
                              <Link
                                href="/collections/tilam-kekabu"
                                onClick={() => setActiveMega(null)}
                                className="p-2.5 rounded-lg hover:bg-cream border border-transparent hover:border-borderLight transition-all group"
                              >
                                <div className="font-semibold text-charcoal group-hover:text-forest">Set Lengkap Tradisi</div>
                                <div className="text-[11px] text-charcoal-muted mt-0.5">Tilam + bantal kepala + bantal peluk.</div>
                              </Link>
                            </div>
                            <div className="mt-4 pt-3 border-t border-borderLight text-[11px] text-forest flex items-center gap-1.5 font-medium">
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                              <span>Dijamin 100% serat kekabu semulajadi, bukan sintetik habuk.</span>
                            </div>
                          </div>

                          <div className="col-span-5 bg-cream rounded-xl p-3 flex flex-col justify-between border border-borderLight">
                            <div className="relative h-32 w-full rounded-lg overflow-hidden mb-2">
                              <Image
                                src="/images/products/tilam-kekabu-asli.jpg"
                                alt="Tilam Kekabu Asli Tunas Sinar Jaya"
                                fill
                                className="object-cover"
                                sizes="240px"
                              />
                              <div className="absolute top-2 left-2 bg-emerald-800 text-warmwhite text-[9px] font-bold px-2 py-0.5 rounded shadow">
                                100% KEKABU POKOK
                              </div>
                            </div>
                            <div>
                              <h5 className="font-serif text-sm font-bold text-forest">
                                Warisan Kekabu Tradisi Sejak 2017
                              </h5>
                              <p className="text-[11px] text-charcoal-muted mt-1 leading-relaxed">
                                Kelembutan semula jadi turun-temurun. Baik untuk postur tulang belakang dan elak panas tidur.
                              </p>
                            </div>
                            <Link
                              href="/collections/tilam-kekabu"
                              onClick={() => setActiveMega(null)}
                              className="mt-3 inline-flex items-center justify-between px-3 py-2 bg-forest text-warmwhite text-xs font-bold rounded-lg hover:bg-forest-dark transition-all group"
                            >
                              <span>Lihat Koleksi Kekabu</span>
                              <ArrowRight className="w-3.5 h-3.5 text-gold group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. TILAM LIPAT & BUJANG (ASRAMA MEGA MENU) */}
                  <div
                    className="relative"
                    onMouseEnter={() => handleOpenMega('lipat')}
                    onMouseLeave={handleCloseMega}
                  >
                    <Link
                      href="/collections/tilam-lipat"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-150 whitespace-nowrap group ${
                        pathname.startsWith('/collections/tilam-lipat')
                          ? 'bg-forest text-warmwhite font-semibold shadow-xs'
                          : 'hover:bg-forest/5 hover:text-forest text-charcoal font-medium'
                      }`}
                    >
                      <Layers className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${
                        pathname.startsWith('/collections/tilam-lipat') ? 'text-gold' : 'text-blue-600'
                      }`} />
                      <span>Tilam Lipat & Bujang</span>
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold tracking-wider bg-blue-500/15 text-blue-800 border border-blue-200">
                        ASRAMA
                      </span>
                      <ChevronDown
                        className={`w-3 h-3 text-gold-dark transition-transform duration-200 ${
                          activeMega === 'lipat' ? 'rotate-180' : ''
                        }`}
                      />
                    </Link>

                    {/* Mega Menu: Tilam Lipat */}
                    {activeMega === 'lipat' && (
                      <div
                        className="absolute top-full left-0 pt-2 z-50 pointer-events-auto"
                        onMouseEnter={() => handleOpenMega('lipat')}
                        onMouseLeave={handleCloseMega}
                      >
                        <div className="absolute -top-3 left-0 right-0 h-4 bg-transparent" />
                        <div className="w-[760px] bg-warmwhite rounded-2xl shadow-[0_25px_50px_-12px_rgba(13,40,24,0.18)] border border-borderLight p-6 grid grid-cols-12 gap-6 animate-fade-in-down">
                          <div className="col-span-7">
                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gold-dark pb-2 border-b border-borderLight mb-3">
                              Pilihan Tilam Lipat & Bujang Asrama
                            </h4>
                            <div className="space-y-2 text-xs text-charcoal-muted">
                              <Link
                                href="/products/tilam-lipat-3-berzip"
                                onClick={() => setActiveMega(null)}
                                className="block p-2.5 rounded-lg hover:bg-cream border border-transparent hover:border-borderLight transition-all group"
                              >
                                <div className="font-semibold text-charcoal group-hover:text-forest">Tilam Lipat 3 Berzip (Boleh Cuci)</div>
                                <div className="text-[11px] text-charcoal-muted">Mudah alih, jimat ruang, sarung berzip senang tanggal untuk basuh.</div>
                              </Link>
                              <Link
                                href="/products/tilam-single-3-kaki-asrama"
                                onClick={() => setActiveMega(null)}
                                className="block p-2.5 rounded-lg hover:bg-cream border border-transparent hover:border-borderLight transition-all group"
                              >
                                <div className="font-semibold text-charcoal group-hover:text-forest">Tilam Bujang 3 Kaki Standard (Tebal 4 Inci)</div>
                                <div className="text-[11px] text-charcoal-muted">Spesifikasi piawai asrama sekolah, MRSM, tahfiz & homestay.</div>
                              </Link>
                              <Link
                                href="/products/pakej-pukal-asrama-homestay"
                                onClick={() => setActiveMega(null)}
                                className="block p-2.5 rounded-lg hover:bg-cream border border-transparent hover:border-borderLight transition-all group"
                              >
                                <div className="font-semibold text-charcoal group-hover:text-forest">Pakej Borong Asrama (10 Set Pukal)</div>
                                <div className="text-[11px] text-charcoal-muted">Diskaun pembekalan terus dari pengilang untuk institusi.</div>
                              </Link>
                            </div>
                          </div>

                          <div className="col-span-5 bg-cream rounded-xl p-3 flex flex-col justify-between border border-borderLight">
                            <div className="relative h-32 w-full rounded-lg overflow-hidden mb-2">
                              <Image
                                src="/images/products/tilam-lipat-bujang.jpg"
                                alt="Tilam Lipat 3 Berzip & Tilam Bujang Asrama"
                                fill
                                className="object-cover"
                                sizes="240px"
                              />
                            </div>
                            <div>
                              <h5 className="font-serif text-sm font-bold text-forest">
                                Praktikal, Tahan Lasak & Jimat Ruang
                              </h5>
                              <p className="text-[11px] text-charcoal-muted mt-1 leading-relaxed">
                                Pilihan utama ibu bapa untuk anak ke asrama & pemilik homestay seluruh Semenanjung.
                              </p>
                            </div>
                            <Link
                              href="/collections/tilam-lipat"
                              onClick={() => setActiveMega(null)}
                              className="mt-3 inline-flex items-center justify-between px-3 py-2 bg-forest text-warmwhite text-xs font-bold rounded-lg hover:bg-forest-dark transition-all group"
                            >
                              <span>Lihat Semua Tilam Lipat</span>
                              <ArrowRight className="w-3.5 h-3.5 text-gold group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 4. BANTAL & BANTAL PELUK */}
                  <Link
                    href="/collections/bantal"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-150 whitespace-nowrap ${
                      pathname.startsWith('/collections/bantal')
                        ? 'bg-forest text-warmwhite font-semibold shadow-xs'
                        : 'hover:bg-forest/5 hover:text-forest text-charcoal font-medium'
                    }`}
                  >
                    <Package className={`w-3.5 h-3.5 ${
                      pathname.startsWith('/collections/bantal') ? 'text-gold' : 'text-gold-dark'
                    }`} />
                    <span>Bantal & Peluk</span>
                  </Link>

                  {/* 5. CADAR & COMFORTER */}
                  <Link
                    href="/collections/cadang-comforter"
                    className={`inline-flex items-center px-3 py-1.5 rounded-full transition-all duration-150 whitespace-nowrap ${
                      pathname.startsWith('/collections/cadang-comforter')
                        ? 'bg-forest text-warmwhite font-semibold shadow-xs'
                        : 'hover:bg-forest/5 hover:text-forest text-charcoal font-medium'
                    }`}
                  >
                    <span>Cadar & Comforter</span>
                  </Link>

                  {/* 6. KOLEKSI LAIN (PATCHWORK, BAYI, KUSYEN SOFA) */}
                  <div
                    className="relative"
                    onMouseEnter={() => handleOpenMega('lain')}
                    onMouseLeave={handleCloseMega}
                  >
                    <button
                      type="button"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-150 whitespace-nowrap ${
                        pathname.startsWith('/collections/selimut-patchwork') ||
                        pathname.startsWith('/collections/set-bayi') ||
                        pathname.startsWith('/collections/kusyen-sofa')
                          ? 'bg-forest text-warmwhite font-semibold shadow-xs'
                          : 'hover:bg-forest/5 hover:text-forest text-charcoal font-medium'
                      }`}
                    >
                      <span>Koleksi Lain</span>
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-charcoal/5 text-charcoal-muted">
                        3
                      </span>
                      <ChevronDown
                        className={`w-3 h-3 text-gold-dark transition-transform duration-200 ${
                          activeMega === 'lain' ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Mega Menu: Koleksi Lain (Visual 3-Card Grid) */}
                    {activeMega === 'lain' && (
                      <div
                        className="absolute top-full left-0 pt-2 z-50 pointer-events-auto"
                        onMouseEnter={() => handleOpenMega('lain')}
                        onMouseLeave={handleCloseMega}
                      >
                        <div className="absolute -top-3 left-0 right-0 h-4 bg-transparent" />
                        <div className="w-[660px] bg-warmwhite rounded-2xl shadow-[0_25px_50px_-12px_rgba(13,40,24,0.18)] border border-borderLight p-5 animate-fade-in-down">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-gold-dark pb-2 border-b border-borderLight mb-3">
                            Koleksi Jahitan Khas & Bermusim
                          </h4>
                          <div className="grid grid-cols-3 gap-3">
                            {/* Card 1: Selimut Patchwork */}
                            <Link
                              href="/collections/selimut-patchwork"
                              onClick={() => setActiveMega(null)}
                              className="group bg-cream/70 hover:bg-cream rounded-xl p-2.5 border border-borderLight/80 hover:border-gold transition-all block"
                            >
                              <div className="relative h-24 w-full rounded-lg overflow-hidden mb-2">
                                <Image
                                  src="/images/products/selimut-patchwork.jpg"
                                  alt="Selimut Patchwork KAMAAR"
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform"
                                  sizes="180px"
                                />
                              </div>
                              <div className="font-semibold text-xs text-charcoal group-hover:text-forest">Selimut Patchwork</div>
                              <div className="text-[10.5px] text-charcoal-muted line-clamp-1">Corak cantuman sejuk</div>
                              <div className="text-xs font-bold text-forest mt-1">Dari RM25.00</div>
                            </Link>

                            {/* Card 2: Set Bayi */}
                            <Link
                              href="/collections/set-bayi"
                              onClick={() => setActiveMega(null)}
                              className="group bg-cream/70 hover:bg-cream rounded-xl p-2.5 border border-borderLight/80 hover:border-gold transition-all block"
                            >
                              <div className="relative h-24 w-full rounded-lg overflow-hidden mb-2">
                                <Image
                                  src="/images/products/set-tilam-bayi.jpg"
                                  alt="Set Tilam Bayi KAMAAR"
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform"
                                  sizes="180px"
                                />
                              </div>
                              <div className="font-semibold text-xs text-charcoal group-hover:text-forest">Set Bayi (4-in-1)</div>
                              <div className="text-[10.5px] text-charcoal-muted line-clamp-1">Tilam + bantal lekuk</div>
                              <div className="text-xs font-bold text-forest mt-1">Dari RM35.00</div>
                            </Link>

                            {/* Card 3: Kusyen Sofa */}
                            <Link
                              href="/collections/kusyen-sofa"
                              onClick={() => setActiveMega(null)}
                              className="group bg-cream/70 hover:bg-cream rounded-xl p-2.5 border border-borderLight/80 hover:border-gold transition-all block"
                            >
                              <div className="relative h-24 w-full rounded-lg overflow-hidden mb-2">
                                <Image
                                  src="/images/products/kusyen-sofa-eksklusif.jpg"
                                  alt="Sarung Kusyen Sofa Aidilfitri"
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform"
                                  sizes="180px"
                                />
                              </div>
                              <div className="font-semibold text-xs text-charcoal group-hover:text-forest">Kusyen Sofa Raya</div>
                              <div className="text-[10.5px] text-charcoal-muted line-clamp-1">Eksklusif & piping tebal</div>
                              <div className="text-xs font-bold text-forest mt-1">Dari RM18.00</div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* DIVIDER LINE */}
                <div className="h-5 w-px bg-borderLight mx-1" />

                {/* RIGHT: FACTORY DIRECT CHANNELS & WHOLESALE (TAK BORING!) */}
                <div className="flex items-center space-x-1 xl:space-x-2">

                  {/* 7. JUALAN GUDANG & BORONG (GLOWING VIP PILL & MEGA MENU) */}
                  <div
                    className="relative"
                    onMouseEnter={() => handleOpenMega('borong')}
                    onMouseLeave={handleCloseMega}
                  >
                    <Link
                      href="/collections/borong-gudang"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 hover:from-amber-200 hover:to-amber-100 text-amber-950 border border-amber-300 font-bold transition-all shadow-xs group whitespace-nowrap"
                    >
                      <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500/30 animate-pulse" />
                      <span>Jualan Gudang & Borong</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-amber-600 text-white tracking-wider shadow-xs">
                        HARGA GUDANG
                      </span>
                      <ChevronDown
                        className={`w-3 h-3 text-amber-800 transition-transform duration-200 ${
                          activeMega === 'borong' ? 'rotate-180' : ''
                        }`}
                      />
                    </Link>

                    {/* Mega Menu: Jualan Gudang & Borong */}
                    {activeMega === 'borong' && (
                      <div
                        className="absolute top-full right-0 pt-2 z-50 pointer-events-auto"
                        onMouseEnter={() => handleOpenMega('borong')}
                        onMouseLeave={handleCloseMega}
                      >
                        <div className="absolute -top-3 left-0 right-0 h-4 bg-transparent" />
                        <div className="w-[680px] bg-warmwhite rounded-2xl shadow-[0_25px_50px_-12px_rgba(13,40,24,0.22)] border border-amber-200 p-5 grid grid-cols-12 gap-5 animate-fade-in-down">
                          <div className="col-span-6 border-r border-borderLight pr-4">
                            <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded mb-2">
                              <Flame className="w-3 h-3 text-amber-600" />
                              <span>Terus Dari Pengeluar Tasek Gelugor</span>
                            </div>
                            <h4 className="font-serif text-sm font-bold text-forest leading-snug">
                              Harga Kilang Untuk Peniaga & Institusi
                            </h4>
                            <p className="text-[11px] text-charcoal-muted mt-1 leading-relaxed">
                              Dapatkan harga diskaun bertingkat untuk pembelian kuantiti banyak terus dari kilang Tunas Sinar Jaya.
                            </p>
                            <div className="mt-3 space-y-1.5 text-xs">
                              <div className="flex items-center justify-between p-1.5 rounded bg-amber-50/60 border border-amber-100">
                                <span className="font-medium text-charcoal">10 – 49 Unit (Homestay / Daycare)</span>
                                <span className="font-bold text-amber-800">Diskaun 15%</span>
                              </div>
                              <div className="flex items-center justify-between p-1.5 rounded bg-amber-50/60 border border-amber-100">
                                <span className="font-medium text-charcoal">50 – 99 Unit (Asrama / Tahfiz)</span>
                                <span className="font-bold text-amber-800">Diskaun 25%</span>
                              </div>
                              <div className="flex items-center justify-between p-1.5 rounded bg-amber-50/60 border border-amber-100">
                                <span className="font-medium text-charcoal">100+ Unit (Tender Pukal)</span>
                                <span className="font-bold text-emerald-800">Harga Kontrak Kilang</span>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-6 flex flex-col justify-between">
                            <div className="relative h-28 w-full rounded-lg overflow-hidden mb-2">
                              <Image
                                src="/images/hero/hero-jualan-gudang-crowd.jpg"
                                alt="Suasana Jualan Gudang Tunas Sinar Jaya Enterprise"
                                fill
                                className="object-cover"
                                sizes="280px"
                              />
                              <div className="absolute bottom-2 left-2 right-2 bg-charcoal/80 backdrop-blur-xs text-warmwhite text-[10px] px-2 py-1 rounded">
                                Walk-in ke Gudang Tasek Gelugor dibuka!
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Link
                                href="/collections/borong-gudang"
                                onClick={() => setActiveMega(null)}
                                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-forest text-warmwhite text-xs font-bold rounded-lg hover:bg-forest-dark transition-all"
                              >
                                <span>Katalog Pakej Borong</span>
                                <ArrowRight className="w-3.5 h-3.5 text-gold" />
                              </Link>
                              <a
                                href="https://wa.me/60194786991?text=Salam%20KAMAAR%20Beddings,%20saya%20berminat%20sebut%20harga%20borong%20jualan%20gudang"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#25D366] text-white text-xs font-bold rounded-lg hover:bg-[#20ba59] transition-all shadow-xs"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>WhatsApp Sebut Harga Borong</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 8. TEMPAHAN OEM */}
                  <Link
                    href="/business"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-150 whitespace-nowrap group ${
                      pathname.startsWith('/business')
                        ? 'bg-forest text-warmwhite font-semibold shadow-xs'
                        : 'hover:bg-forest/5 hover:text-forest text-charcoal font-medium'
                    }`}
                  >
                    <Building2 className={`w-3.5 h-3.5 ${
                      pathname.startsWith('/business') ? 'text-gold' : 'text-charcoal-muted group-hover:text-forest'
                    }`} />
                    <span>Tempahan OEM</span>
                  </Link>

                  {/* 9. PROFIL KILANG */}
                  <Link
                    href="/profil"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-150 whitespace-nowrap group ${
                      pathname.startsWith('/profil')
                        ? 'bg-forest text-warmwhite font-semibold shadow-xs'
                        : 'hover:bg-forest/5 hover:text-forest text-charcoal font-medium'
                    }`}
                  >
                    <ShieldCheck className={`w-3.5 h-3.5 ${
                      pathname.startsWith('/profil') ? 'text-gold' : 'text-emerald-600'
                    }`} />
                    <span>Profil Kilang</span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.2 rounded">
                      4 Unit
                    </span>
                  </Link>

                  {/* 10. HOTLINE PILL DIRECT KILANG */}
                  <a
                    href="https://wa.me/60194786991?text=Salam%20KAMAAR%20Beddings,%20saya%20nak%20tanya%20produk%20kilang"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 transition-colors whitespace-nowrap"
                    title="Hubungi Kilang Terus Melalui WhatsApp"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>019-478 6991</span>
                  </a>

                </div>
              </nav>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE VIEW (< 1024px): COMPACT & BALANCED TOP BAR                        */}
        {/* ========================================================================= */}
        <div className="lg:hidden bg-warmwhite/95 backdrop-blur-md border-b border-borderLight py-3 px-4 shadow-xs">
          <div className="flex items-center justify-between">
            {/* Left: Hamburger + Search */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-1.5 text-charcoal hover:text-forest rounded-lg hover:bg-cream transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5 text-charcoal hover:text-forest rounded-lg hover:bg-cream transition-colors"
                aria-label="Open search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Center: Brand Mark */}
            <Link href="/" className="flex items-center justify-center">
              <KamaarLogo variant="horizontal" size="sm" theme="light" />
            </Link>

            {/* Right: Wishlist + Shopping Bag */}
            <div className="flex items-center space-x-2">
              <Link
                href="/account/wishlist"
                className="relative p-1.5 text-charcoal hover:text-forest transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-forest text-warmwhite text-[10px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                onClick={openDrawer}
                className="flex items-center space-x-1.5 bg-forest text-warmwhite px-3 py-1.5 rounded-full text-xs font-bold"
                aria-label="Open Cart Drawer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-gold" />
                <span className="w-4 h-4 rounded-full bg-gold text-forest-dark text-[10px] font-black flex items-center justify-center">
                  {itemCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MOBILE SLIDE-OVER DRAWER (ACCORDION & EXPANDED CONTROLS)                  */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* MOBILE SLIDE-OVER DRAWER (LUXURY ATELIER EDITION)                         */}
      {/* ========================================================================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop with silky blur */}
          <div
            className="fixed inset-0 bg-forest-dark/60 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 max-w-[340px] w-[88vw] bg-warmwhite shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-in-left">
            {/* SCROLLABLE MAIN CONTENT AREA */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {/* TOP BRAND HEADER */}
              <div className="p-4 border-b border-borderLight flex items-center justify-between bg-warmwhite sticky top-0 z-10 backdrop-blur-md">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
                  <KamaarLogo variant="horizontal" size="sm" theme="light" />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-charcoal-muted hover:text-forest rounded-full bg-cream hover:bg-gold/15 transition-all cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* QUICK SEARCH BAR (High discovery affordance) */}
              <div className="p-3 bg-cream/40 border-b border-borderLight/60">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    setIsSearchOpen(true)
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-warmwhite border border-borderLight text-xs text-charcoal-muted hover:border-gold transition-all shadow-2xs"
                >
                  <span className="flex items-center space-x-2">
                    <Search className="w-3.5 h-3.5 text-gold-dark" />
                    <span>{locale === 'bm' ? 'Cari tilam, bantal, saiz...' : 'Search mattresses, pillows...'}</span>
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cream text-secondary border border-borderLight">
                    Cari
                  </span>
                </button>
              </div>

              {/* 2-COLUMN FACTORY DISCOVERY CARDS */}
              <div className="p-3 bg-gradient-to-b from-cream/20 to-warmwhite border-b border-borderLight/60">
                <div className="grid grid-cols-2 gap-2">
                  {/* Profil Kilang Card */}
                  <Link
                    href="/profil"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-2xl bg-gradient-to-br from-warmwhite to-cream border border-[#B49A58]/35 shadow-2xs hover:border-[#1E4E8C] transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="w-7 h-7 rounded-xl bg-[#B49A58]/15 flex items-center justify-center text-[#B49A58]">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <ArrowRight className="w-3 h-3 text-secondary group-hover:text-forest group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-forest-dark block leading-snug">
                        {locale === 'bm' ? 'Profil Kilang' : 'Factory Profile'}
                      </span>
                      <span className="text-[10px] text-secondary">
                        {locale === 'bm' ? '4 Unit & Pengurusan' : '4 Units & Org'}
                      </span>
                    </div>
                  </Link>

                  {/* Jualan Gudang Card */}
                  <Link
                    href="/collections/borong-gudang"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-2xl bg-gradient-to-br from-warmwhite to-cream border border-[#B49A58]/35 shadow-2xs hover:border-[#1E4E8C] transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="w-7 h-7 rounded-xl bg-[#1E4E8C]/10 flex items-center justify-center text-[#1E4E8C]">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <ArrowRight className="w-3 h-3 text-secondary group-hover:text-forest group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-forest-dark block leading-snug">
                        {locale === 'bm' ? 'Jualan Gudang' : 'Warehouse Sale'}
                      </span>
                      <span className="text-[10px] text-secondary">
                        {locale === 'bm' ? 'Tasek Gelugor Penang' : 'Tasek Gelugor'}
                      </span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* SECTION: STORE COLLECTIONS */}
              <div className="p-3.5 space-y-1">
                <div className="px-2 pb-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-secondary">
                    {locale === 'bm' ? 'Koleksi Utama' : 'Store Collections'}
                  </span>
                  <span className="text-[10px] font-semibold text-gold-dark">
                    100% Terus Dari Kilang
                  </span>
                </div>

                <nav className="space-y-1">
                  {navCategories.map((cat) => {
                    const targetUrl = cat.customUrl || `/collections/${cat.slug}`
                    const label = getCategoryLabel(cat)
                    const isSaleCategory = cat.badge?.toUpperCase() === 'SALE' || cat.slug === 'offers' || cat.badge?.toUpperCase() === 'HARGA KILANG'
                    const isMattress = cat.slug === 'tilam-toto' || cat.slug === 'mattress'

                    if (cat.hasMegaMenu) {
                      const isExpanded = mobileExpandedSection === cat.id || (mobileExpandedSection === 'mattresses' && isMattress)

                      return (
                        <div key={cat.id} className="rounded-2xl transition-colors overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setMobileExpandedSection(isExpanded ? null : cat.id)}
                            className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                              isExpanded
                                ? 'bg-[#1E4E8C] text-white shadow-xs'
                                : 'text-forest-dark hover:bg-cream/80'
                            }`}
                          >
                            <div className="flex items-center space-x-2.5">
                              <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs ${
                                isExpanded ? 'bg-white/15 text-[#D4AF37]' : 'bg-cream text-forest'
                              }`}>
                                🛏️
                              </span>
                              <div>
                                <span className="block">{label}</span>
                                <span className={`text-[10px] font-normal ${isExpanded ? 'text-white/80' : 'text-secondary'}`}>
                                  {locale === 'bm' ? 'Asian Polyester Fibre Gebu & Tebal' : 'Thick Asian Polyester Fibre Toto'}
                                </span>
                              </div>
                            </div>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180 text-[#D4AF37]' : 'text-secondary'
                              }`}
                            />
                          </button>

                          {/* Smooth Collapsible Content */}
                          {isExpanded && (
                            <div className="p-2.5 mt-1 bg-cream/50 rounded-2xl border border-borderLight/60 space-y-2.5 animate-in fade-in duration-200">
                              <Link
                                href={targetUrl}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-between px-3 py-2 bg-warmwhite rounded-xl border border-borderLight text-xs font-bold text-forest hover:bg-forest hover:text-white transition-all shadow-2xs"
                              >
                                <span>{locale === 'bm' ? 'Terokai Semua Koleksi Tilam' : 'Explore All Mattresses'}</span>
                                <span>&rarr;</span>
                              </Link>

                              {megaMenuConfig.columns?.map((col, idx) => {
                                const colTitle = locale === 'bm' && col.titleBm ? col.titleBm : col.title
                                return (
                                  <div key={col.id} className={idx > 0 ? 'pt-2 border-t border-borderLight/60' : ''}>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-secondary px-2 block mb-1.5">
                                      {colTitle}
                                    </span>
                                    <div className="space-y-1">
                                      {col.items?.map((item) => {
                                        const itemLabel = locale === 'bm' && item.labelBm ? item.labelBm : item.label
                                        return (
                                          <Link
                                            key={item.id}
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-charcoal hover:bg-warmwhite hover:text-forest transition-colors"
                                          >
                                            <span>{itemLabel}</span>
                                          </Link>
                                        )
                                      })}
                                    </div>
                                  </div>
                                )
                              })}

                              {megaMenuConfig.promoCard?.enabled !== false && (
                                <div className="pt-2 border-t border-borderLight/60">
                                  <Link
                                    href={megaMenuConfig.promoCard?.buttonUrl || '/finder'}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between p-2.5 bg-gold/15 rounded-xl border border-gold/30 text-xs font-bold text-forest hover:bg-gold/25 transition-all"
                                  >
                                    <div className="flex items-center space-x-1.5">
                                      <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
                                      <span>{megaMenuConfig.promoCard?.title || 'Personalized Fit Quiz'}</span>
                                    </div>
                                    <span>&rarr;</span>
                                  </Link>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    }

                    // Standard category item
                    const categoryIcons: Record<string, string> = {
                      'tilam-toto': '🛏️',
                      'tilam-lipat': '🛋️',
                      bantal: '🪶',
                      'cadang-comforter': '🧵',
                      'borong-gudang': '🏭',
                      profil: '🏢',
                      pillows: '🪶',
                      'toppers-protectors': '☁️',
                      bedframes: '🪵',
                      bedding: '🧵',
                      offers: '🏷️',
                    }

                    return (
                      <Link
                        key={cat.id}
                        href={targetUrl}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all ${
                          isSaleCategory
                            ? 'bg-sale/5 border border-sale/20 text-sale hover:bg-sale/10'
                            : 'text-charcoal hover:bg-cream/80'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="w-7 h-7 rounded-xl bg-cream flex items-center justify-center text-xs">
                            {categoryIcons[cat.slug] || '✨'}
                          </span>
                          <span>{label}</span>
                        </div>

                        <div className="flex items-center space-x-1.5">
                          {cat.badge && (
                            <span
                              className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-extrabold ${
                                isSaleCategory
                                  ? 'bg-sale text-white shadow-2xs'
                                  : 'bg-[#B49A58]/20 text-[#8C6B1C]'
                              }`}
                            >
                              {cat.badge}
                            </span>
                          )}
                          <span className="text-secondary text-sm">&rsaquo;</span>
                        </div>
                      </Link>
                    )
                  })}
                </nav>
              </div>

              {/* SECTION: CARE & SERVICES */}
              <div className="p-3.5 pt-0 space-y-1">
                <div className="px-2 pb-1.5">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-secondary">
                    {locale === 'bm' ? 'Perkhidmatan & Panduan' : 'Services & Care'}
                  </span>
                </div>

                <div className="space-y-1">
                  <Link
                    href="/compare"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-2xl text-xs font-medium text-charcoal hover:bg-cream transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-7 h-7 rounded-xl bg-cream flex items-center justify-center text-xs">
                        <Scale className="w-3.5 h-3.5 text-gold-dark" />
                      </span>
                      <span>{locale === 'bm' ? 'Bandingkan Tilam' : 'Compare Mattresses'}</span>
                    </div>
                    {compareCount > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-gold text-forest-dark text-[10px] font-bold">
                        {compareCount}
                      </span>
                    ) : (
                      <span className="text-secondary text-sm">&rsaquo;</span>
                    )}
                  </Link>

                  <Link
                    href="/blog"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-2xl text-xs font-medium text-charcoal hover:bg-cream transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-7 h-7 rounded-xl bg-cream flex items-center justify-center text-xs">
                        <BookOpen className="w-3.5 h-3.5 text-gold-dark" />
                      </span>
                      <span>{locale === 'bm' ? 'Jurnal Sains Tidur' : 'Sleep Science Journal'}</span>
                    </div>
                    <span className="text-secondary text-sm">&rsaquo;</span>
                  </Link>

                  <Link
                    href="/warranty"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-2xl text-xs font-medium text-charcoal hover:bg-cream transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-7 h-7 rounded-xl bg-cream flex items-center justify-center text-xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-gold-dark" />
                      </span>
                      <span>{locale === 'bm' ? 'Jaminan Kualiti Kilang & QC' : 'Factory Quality & QC Warranty'}</span>
                    </div>
                    <span className="text-secondary text-sm">&rsaquo;</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* STICKY BOTTOM ACTION FOOTER (Thumb Zone) */}
            <div className="p-3.5 border-t border-borderLight bg-warmwhite/95 backdrop-blur-md space-y-2.5 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-lg">
              {/* Language & Account bar */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-gold-dark" />
                  <div className="inline-flex p-0.5 bg-cream rounded-full border border-borderLight text-[11px]">
                    <button
                      onClick={() => setLocale('en')}
                      className={`px-2.5 py-1 rounded-full font-bold transition-all ${
                        locale === 'en' ? 'bg-[#1E4E8C] text-white shadow-xs' : 'text-secondary hover:text-charcoal'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setLocale('bm')}
                      className={`px-2.5 py-1 rounded-full font-bold transition-all ${
                        locale === 'bm' ? 'bg-[#1E4E8C] text-white shadow-xs' : 'text-secondary hover:text-charcoal'
                      }`}
                    >
                      BM
                    </button>
                  </div>
                </div>

                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-1 text-xs font-bold text-forest hover:text-forest-dark"
                >
                  <User className="w-3.5 h-3.5 text-gold-dark" />
                  <span>{locale === 'bm' ? 'Akaun Saya' : 'My Account'}</span>
                </Link>
              </div>

              {/* WhatsApp Concierge Button */}
              <a
                href="https://wa.me/60194786991?text=Salam%20Tunas%20Sinar%20Jaya%20Kamaar%20Beddings,%20saya%20ingin%20bertanya%20tentang%20produk%20dan%20borong."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-200" />
                <span>{locale === 'bm' ? 'WhatsApp Kilang (019-478 6991)' : 'Official WhatsApp (019-478 6991)'}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Global Predictive Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
