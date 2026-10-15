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
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleOpenMega = (menuKey: string) => {
    // Clear pending close
    if (megaTimeoutRef.current) {
      clearTimeout(megaTimeoutRef.current)
      megaTimeoutRef.current = null
    }

    // If no menu is open, open immediately
    if (!activeMega) {
      setActiveMega(menuKey)
      return
    }

    // If the same menu is already open, do nothing
    if (activeMega === menuKey) return

    // If switching between menus, require 100ms intentional hover
    // so fast diagonal mouse movements towards dropdown items don't accidentally switch
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current)
    openTimeoutRef.current = setTimeout(() => {
      setActiveMega(menuKey)
    }, 100)
  }

  const handleKeepMega = (menuKey: string) => {
    if (megaTimeoutRef.current) {
      clearTimeout(megaTimeoutRef.current)
      megaTimeoutRef.current = null
    }
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current)
      openTimeoutRef.current = null
    }
    setActiveMega(menuKey)
  }

  const handleCloseMega = () => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current)
      openTimeoutRef.current = null
    }
    if (megaTimeoutRef.current) {
      clearTimeout(megaTimeoutRef.current)
    }
    megaTimeoutRef.current = setTimeout(() => {
      setActiveMega(null)
    }, 350) // 350ms generous intent buffer: ensures mouse transit never drops menu
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
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current)
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current)
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
      <header className="sticky top-0 z-40 w-full bg-[#FAF7F2] transition-all duration-300 shadow-xs">
        {/* ========================================================================= */}
        {/* DESKTOP VIEW: 2-TIER LUXURY ARCHITECTURE (ZERO OVERLAP GUARANTEED)        */}
        {/* ========================================================================= */}
        <div className="hidden lg:block">
          {/* TIER 1: BRAND LOGO & EXECUTIVE UTILITY BAR */}
          <div
            className={`transition-all duration-300 ${
              isScrolled
                ? 'py-2 bg-[#FAF7F2] border-b border-borderLight/60 shadow-xs'
                : 'py-3.5 bg-[#FAF7F2] border-b border-borderLight/40'
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
                    className="flex items-center space-x-1.5 text-xs text-charcoal-muted hover:text-forest transition-colors font-bold uppercase tracking-wider"
                  >
                    <MapPin className="w-3.5 h-3.5 text-gold-dark" />
                    <span>SHOWROOM</span>
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

          {/* TIER 2: DEDICATED CATEGORY NAVIGATION ROW (ORGANIZED, BALANCED & CENTERED) */}
          <div className="bg-[#FAF7F2] border-b border-[#E8E1D5] shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <nav className="flex items-center justify-center gap-1.5 xl:gap-2.5 py-2 text-[13px] font-medium text-charcoal">
                
                {/* 1. TILAM TOTO (HERO BESTSELLER MEGA MENU) */}
                <div
                  className="relative"
                  onMouseEnter={() => handleOpenMega('toto')}
                  onMouseLeave={handleCloseMega}
                >
                  <Link
                    href="/collections/tilam-toto"
                    onClick={() => setActiveMega(null)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-150 whitespace-nowrap group ${
                      pathname.startsWith('/collections/tilam-toto')
                        ? 'bg-white text-forest font-bold shadow-xs border border-gold/50 ring-2 ring-gold/20'
                        : 'hover:bg-forest/5 hover:text-forest text-charcoal font-medium border border-transparent'
                    }`}
                  >
                    <Sparkles className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${
                      pathname.startsWith('/collections/tilam-toto') ? 'text-amber-500 scale-105' : 'text-amber-500'
                    }`} />
                    <span>Tilam Toto</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
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
                      onMouseEnter={() => handleKeepMega('toto')}
                      onMouseLeave={handleCloseMega}
                    >
                      <div className="w-[min(calc(100vw-3rem),820px)] max-w-[820px] bg-warmwhite rounded-2xl shadow-[0_25px_50px_-12px_rgba(19,50,91,0.18)] border border-borderLight p-4 sm:p-5 grid grid-cols-12 gap-3 sm:gap-4 lg:gap-5 animate-[fadeIn_0.15s_ease-out]">
                        {/* Col 1: Pilihan Saiz & Corak (4 cols) */}
                        <div className="col-span-4 border-r border-borderLight/80 pr-3">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-gold-dark pb-2 border-b border-borderLight mb-2.5 flex items-center justify-between">
                            <span>Pilihan Saiz Kilang</span>
                            <span className="text-[10px] text-charcoal-muted font-normal lowercase">asian fibre</span>
                          </h4>
                          <ul className="space-y-1.5 text-xs text-charcoal-muted">
                            <li>
                              <Link
                                href="/products/toto-queen-poly"
                                onClick={() => setActiveMega(null)}
                                className="hover:text-forest hover:font-bold block transition-colors group p-1.5 rounded-lg hover:bg-cream"
                              >
                                <div className="font-semibold text-charcoal group-hover:text-forest">Toto Queen (Poly) – RM59.90</div>
                                <div className="text-[11px] text-charcoal-muted">Size 150 cm x 200 cm • Tebal & Empuk</div>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/products/toto-single-poly"
                                onClick={() => setActiveMega(null)}
                                className="hover:text-forest hover:font-bold block transition-colors group p-1.5 rounded-lg hover:bg-cream"
                              >
                                <div className="font-semibold text-charcoal group-hover:text-forest">Toto Single (Poly) – RM34.90</div>
                                <div className="text-[11px] text-charcoal-muted">Size 90 cm x 200 cm • Paling Laris</div>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/products/sarung-tilam-queen"
                                onClick={() => setActiveMega(null)}
                                className="hover:text-forest hover:font-bold block transition-colors group p-1.5 rounded-lg hover:bg-cream"
                              >
                                <div className="font-semibold text-charcoal group-hover:text-forest">Sarung Tilam Queen – RM19.90</div>
                                <div className="text-[11px] text-charcoal-muted">Size 150 cm x 200 cm • Kain Berzip</div>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/products/sarung-tilam-single"
                                onClick={() => setActiveMega(null)}
                                className="hover:text-forest hover:font-bold block transition-colors group p-1.5 rounded-lg hover:bg-cream"
                              >
                                <div className="font-semibold text-charcoal group-hover:text-forest">Sarung Tilam Single – RM14.90</div>
                                <div className="text-[11px] text-charcoal-muted">Size 90 cm x 200 cm • Kain Berzip</div>
                              </Link>
                            </li>
                          </ul>
                        </div>

                        {/* Col 2: Kelebihan Mutu (4 cols) */}
                        <div className="col-span-4 border-r border-borderLight/80 pr-3">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-gold-dark pb-2 border-b border-borderLight mb-2.5">
                            Kelebihan Toto KAMAAR
                          </h4>
                          <div className="space-y-2.5 text-xs text-charcoal-muted">
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
                                <div className="text-[11px] leading-relaxed">Selesa cuaca Malaysia untuk tidur santai lantai atau atas katil.</div>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <div>
                                <div className="font-semibold text-charcoal">Percuma Beg Simpanan</div>
                                <div className="text-[11px] leading-relaxed">Setiap toto disertakan beg berzip untuk mudah disimpan & melancong.</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Col 3: Visual Lifestyle Showcase Card (4 cols) */}
                        <div className="col-span-4 bg-cream rounded-xl p-3 flex flex-col justify-between border border-borderLight overflow-hidden">
                          <div className="relative h-28 w-full rounded-lg overflow-hidden mb-2">
                            <Image
                              src="/images/products/toto-single-poly.png"
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
                              Tilam Toto Asli Dari Kilang
                            </h5>
                            <p className="text-[11px] text-charcoal-muted mt-0.5 leading-relaxed line-clamp-2">
                              Jahitan quilting kemas, random floral eksklusif. Jimat terus dari pengeluar!
                            </p>
                            <div className="text-xs font-bold text-forest mt-1">
                              Dari <span className="text-sm text-gold-dark font-black">RM34.90</span>
                            </div>
                          </div>
                          <Link
                            href="/collections/tilam-toto"
                            onClick={() => setActiveMega(null)}
                            className="mt-2 inline-flex items-center justify-between px-3 py-1.5 bg-forest text-warmwhite text-xs font-bold rounded-lg hover:bg-forest-dark transition-all group"
                          >
                            <span>Beli Tilam Toto Sekarang</span>
                            <ArrowRight className="w-3.5 h-3.5 text-gold group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. TILAM GULUNG (TC & KEKABU) */}
                <div
                  className="relative"
                  onMouseEnter={() => handleOpenMega('gulung')}
                  onMouseLeave={handleCloseMega}
                >
                  <Link
                    href="/collections/tilam-gulung"
                    onClick={() => setActiveMega(null)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-150 whitespace-nowrap group ${
                      pathname.startsWith('/collections/tilam-gulung')
                        ? 'bg-white text-forest font-bold shadow-xs border border-gold/50 ring-2 ring-gold/20'
                        : 'hover:bg-forest/5 hover:text-forest text-charcoal font-medium border border-transparent'
                    }`}
                  >
                    <Layers className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${
                      pathname.startsWith('/collections/tilam-gulung') ? 'text-gold-dark scale-105' : 'text-forest'
                    }`} />
                    <span>Tilam Gulung</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs">
                      TC & KEKABU
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 text-gold-dark transition-transform duration-200 ${
                        activeMega === 'gulung' ? 'rotate-180' : ''
                      }`}
                    />
                  </Link>

                  {/* Mega Menu: Tilam Gulung */}
                  {activeMega === 'gulung' && (
                    <div
                      className="absolute top-full left-0 pt-2 z-50 pointer-events-auto"
                      onMouseEnter={() => handleKeepMega('gulung')}
                      onMouseLeave={handleCloseMega}
                    >
                      <div className="w-[min(calc(100vw-3rem),720px)] max-w-[720px] bg-warmwhite rounded-2xl shadow-[0_25px_50px_-12px_rgba(19,50,91,0.18)] border border-borderLight p-4 sm:p-5 grid grid-cols-12 gap-3 sm:gap-4 lg:gap-5 animate-[fadeIn_0.15s_ease-out]">
                        <div className="col-span-7">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-gold-dark pb-2 border-b border-borderLight mb-2.5">
                            Koleksi Tilam Gulung Kilang Tunas Sinar Jaya
                          </h4>
                          <div className="space-y-2 text-xs text-charcoal-muted">
                            <Link
                              href="/products/tilam-gulung-a-tc"
                              onClick={() => setActiveMega(null)}
                              className="p-2 rounded-lg hover:bg-cream border border-transparent hover:border-borderLight transition-all block group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-charcoal group-hover:text-forest">TILAM GULUNG A (TC)</span>
                                <span className="font-bold text-forest text-xs">RM39.90</span>
                              </div>
                              <div className="text-[11px] text-charcoal-muted mt-0.5">Size 90 cm x 180 cm • Isian Poly Fibre / TC Shoddy padat</div>
                            </Link>
                            <Link
                              href="/products/tilam-gulung-b-tc"
                              onClick={() => setActiveMega(null)}
                              className="p-2 rounded-lg hover:bg-cream border border-transparent hover:border-borderLight transition-all block group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-charcoal group-hover:text-forest">TILAM GULUNG B (TC)</span>
                                <span className="font-bold text-forest text-xs">RM34.90</span>
                              </div>
                              <div className="text-[11px] text-charcoal-muted mt-0.5">Size 90 cm x 180 cm • Jimat, ringan dan mudah digulung</div>
                            </Link>
                            <Link
                              href="/products/tilam-gulung-kekabu-asli"
                              onClick={() => setActiveMega(null)}
                              className="p-2 rounded-lg hover:bg-cream border border-transparent hover:border-borderLight transition-all block group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-charcoal group-hover:text-forest">TILAM GULUNG (KEKABU ASLI)</span>
                                <span className="font-bold text-forest text-xs">RM99.90</span>
                              </div>
                              <div className="text-[11px] text-charcoal-muted mt-0.5">Size 90 cm x 180 cm • 100% serat kekabu asli sejuk dan selesa</div>
                            </Link>
                          </div>
                          <div className="mt-3 pt-2.5 border-t border-borderLight text-[11px] text-forest flex items-center gap-1.5 font-medium">
                            <ShieldCheck className="w-4 h-4 text-forest" />
                            <span>Kualiti jahitan kemas terus dari kilang di Tasek Gelugor.</span>
                          </div>
                        </div>

                        <div className="col-span-5 bg-cream rounded-xl p-3 flex flex-col justify-between border border-borderLight">
                          <div className="relative h-28 w-full rounded-lg overflow-hidden mb-2">
                            <Image
                              src="/images/products/tilam-gulung-a-tc.png"
                              alt="Tilam Gulung Kilang KAMAAR"
                              fill
                              className="object-cover"
                              sizes="240px"
                            />
                            <div className="absolute top-2 left-2 bg-forest text-warmwhite text-[9px] font-bold px-2 py-0.5 rounded shadow">
                              JIMAT & PRAKTIKAL
                            </div>
                          </div>
                          <div>
                            <h5 className="font-serif text-sm font-bold text-forest">
                              Sesuai Untuk Asrama & Homestay
                            </h5>
                            <p className="text-[11px] text-charcoal-muted mt-0.5 leading-relaxed">
                              Ringan, mudah digulung dan disimpan. Pilihan paling menjimatkan untuk tilam tambahan tetamu.
                            </p>
                          </div>
                          <Link
                            href="/collections/tilam-gulung"
                            onClick={() => setActiveMega(null)}
                            className="mt-2 inline-flex items-center justify-between px-3 py-1.5 bg-forest text-warmwhite text-xs font-bold rounded-lg hover:bg-forest-dark transition-all group"
                          >
                            <span>Lihat Koleksi Tilam Gulung</span>
                            <ArrowRight className="w-3.5 h-3.5 text-gold group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. BANTAL & BANTAL PELUK */}
                <div
                  className="relative"
                  onMouseEnter={() => handleOpenMega('bantal')}
                  onMouseLeave={handleCloseMega}
                >
                  <Link
                    href="/collections/bantal-tidur"
                    onClick={() => setActiveMega(null)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-150 whitespace-nowrap group ${
                      pathname.startsWith('/collections/bantal-tidur') || pathname.startsWith('/collections/bantal-peluk')
                        ? 'bg-white text-forest font-bold shadow-xs border border-gold/50 ring-2 ring-gold/20'
                        : 'hover:bg-forest/5 hover:text-forest text-charcoal font-medium border border-transparent'
                    }`}
                  >
                    <Award className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${
                      pathname.startsWith('/collections/bantal-tidur') || pathname.startsWith('/collections/bantal-peluk')
                        ? 'text-gold-dark scale-105'
                        : 'text-forest'
                    }`} />
                    <span>Bantal & Peluk</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold tracking-wider bg-gold/15 text-gold-dark border border-gold/30">
                      GEBU
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 text-gold-dark transition-transform duration-200 ${
                        activeMega === 'bantal' ? 'rotate-180' : ''
                      }`}
                    />
                  </Link>

                  {/* Mega Menu: Bantal & Peluk */}
                  {activeMega === 'bantal' && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 pointer-events-auto"
                      onMouseEnter={() => handleKeepMega('bantal')}
                      onMouseLeave={handleCloseMega}
                    >
                      <div className="w-[min(calc(100vw-3rem),820px)] max-w-[820px] bg-warmwhite rounded-2xl shadow-[0_25px_50px_-12px_rgba(19,50,91,0.18)] border border-borderLight p-4 sm:p-5 grid grid-cols-12 gap-3 sm:gap-4 lg:gap-5 animate-[fadeIn_0.15s_ease-out]">
                        {/* Col 1: Bantal Tidur */}
                        <div className="col-span-4 border-r border-borderLight/80 pr-3">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-gold-dark pb-2 border-b border-borderLight mb-2.5 flex items-center justify-between">
                            <span>Bantal Tidur</span>
                            <span className="text-[10px] text-charcoal-muted font-normal">4 Pilihan</span>
                          </h4>
                          <div className="space-y-1.5 text-xs text-charcoal-muted">
                            <Link
                              href="/products/bantal-m-tc"
                              onClick={() => setActiveMega(null)}
                              className="p-1.5 rounded-lg hover:bg-cream border border-transparent hover:border-borderLight transition-all block group"
                            >
                              <div className="flex items-center justify-between font-semibold text-charcoal group-hover:text-forest">
                                <span>Bantal M (TC)</span>
                                <span className="font-bold text-forest">RM4.90</span>
                              </div>
                              <div className="text-[10.5px] text-charcoal-muted">Size 15" x 24" • Paling jimat ekonomi</div>
                            </Link>
                            <Link
                              href="/products/bantal-l-poly"
                              onClick={() => setActiveMega(null)}
                              className="p-1.5 rounded-lg hover:bg-cream border border-transparent hover:border-borderLight transition-all block group"
                            >
                              <div className="flex items-center justify-between font-semibold text-charcoal group-hover:text-forest">
                                <span>Bantal L (Poly)</span>
                                <span className="font-bold text-forest">RM9.90</span>
                              </div>
                              <div className="text-[10.5px] text-charcoal-muted">Size 17" x 26" • Gebu Asian Polyester</div>
                            </Link>
                            <Link
                              href="/products/bantal-l-kekabu-asli"
                              onClick={() => setActiveMega(null)}
                              className="p-1.5 rounded-lg hover:bg-cream border border-transparent hover:border-borderLight transition-all block group"
                            >
                              <div className="flex items-center justify-between font-semibold text-charcoal group-hover:text-forest">
                                <span>Bantal L (Kekabu)</span>
                                <span className="font-bold text-forest">RM24.90</span>
                              </div>
                              <div className="text-[10.5px] text-charcoal-muted">Size 17" x 26" • Serat pokok asli sejuk</div>
                            </Link>
                            <Link
                              href="/products/bantal-xl-kekabu-asli"
                              onClick={() => setActiveMega(null)}
                              className="p-1.5 rounded-lg hover:bg-cream border border-transparent hover:border-borderLight transition-all block group"
                            >
                              <div className="flex items-center justify-between font-semibold text-charcoal group-hover:text-forest">
                                <span>Bantal XL (Kekabu)</span>
                                <span className="font-bold text-forest">RM34.90</span>
                              </div>
                              <div className="text-[10.5px] text-charcoal-muted">Size 18" x 28" • Ekstra besar & padat</div>
                            </Link>
                          </div>
                        </div>

                        {/* Col 2: Bantal Peluk */}
                        <div className="col-span-4 border-r border-borderLight/80 pr-3">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-gold-dark pb-2 border-b border-borderLight mb-2.5 flex items-center justify-between">
                            <span>Bantal Peluk</span>
                            <span className="text-[10px] text-charcoal-muted font-normal">4 Pilihan</span>
                          </h4>
                          <div className="space-y-1.5 text-xs text-charcoal-muted">
                            <Link
                              href="/products/bantal-peluk-m-poly"
                              onClick={() => setActiveMega(null)}
                              className="p-1.5 rounded-lg hover:bg-cream border border-transparent hover:border-borderLight transition-all block group"
                            >
                              <div className="flex items-center justify-between font-semibold text-charcoal group-hover:text-forest">
                                <span>Peluk M (Poly)</span>
                                <span className="font-bold text-forest">RM13.90</span>
                              </div>
                              <div className="text-[10.5px] text-charcoal-muted">Size 60 x 80 cm • Gebu selesa dipeluk</div>
                            </Link>
                            <Link
                              href="/products/bantal-peluk-l-tc"
                              onClick={() => setActiveMega(null)}
                              className="p-1.5 rounded-lg hover:bg-cream border border-transparent hover:border-borderLight transition-all block group"
                            >
                              <div className="flex items-center justify-between font-semibold text-charcoal group-hover:text-forest">
                                <span>Peluk L (TC)</span>
                                <span className="font-bold text-forest">RM14.90</span>
                              </div>
                              <div className="text-[10.5px] text-charcoal-muted">Size 70 x 90 cm • Tahan lasak padat</div>
                            </Link>
                            <Link
                              href="/products/bantal-peluk-l-poly"
                              onClick={() => setActiveMega(null)}
                              className="p-1.5 rounded-lg hover:bg-cream border border-transparent hover:border-borderLight transition-all block group"
                            >
                              <div className="flex items-center justify-between font-semibold text-charcoal group-hover:text-forest">
                                <span>Peluk L (Poly)</span>
                                <span className="font-bold text-forest">RM24.90</span>
                              </div>
                              <div className="text-[10.5px] text-charcoal-muted">Size 70 x 90 cm • Ekstra gebu Asian fibre</div>
                            </Link>
                            <Link
                              href="/products/bantal-peluk-l-kekabu-asli"
                              onClick={() => setActiveMega(null)}
                              className="p-1.5 rounded-lg hover:bg-cream border border-transparent hover:border-borderLight transition-all block group"
                            >
                              <div className="flex items-center justify-between font-semibold text-charcoal group-hover:text-forest">
                                <span>Peluk L (Kekabu)</span>
                                <span className="font-bold text-forest">RM34.90</span>
                              </div>
                              <div className="text-[10.5px] text-charcoal-muted">Size 70 x 90 cm • 100% kekabu asli</div>
                            </Link>
                          </div>
                        </div>

                        {/* Col 3: Visual Showcase */}
                        <div className="col-span-4 bg-cream rounded-xl p-3 flex flex-col justify-between border border-borderLight overflow-hidden">
                          <div className="relative h-28 w-full rounded-lg overflow-hidden mb-2">
                            <Image
                              src="/images/products/bantal-l-poly.png"
                              alt="Bantal Tidur Gebu KAMAAR Beddings"
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300"
                              sizes="240px"
                            />
                            <div className="absolute top-2 left-2 bg-forest text-warmwhite text-[9px] font-bold px-2 py-0.5 rounded shadow">
                              DARI RM4.90
                            </div>
                          </div>
                          <div>
                            <h5 className="font-serif text-sm font-bold text-forest leading-snug">
                              Gebu, Padat & Selesa Leher
                            </h5>
                            <p className="text-[11px] text-charcoal-muted mt-0.5 leading-relaxed line-clamp-2">
                              Pilihan isian Poly Fibre berkualiti & serat 100% kekabu asli tradisi.
                            </p>
                          </div>
                          <Link
                            href="/collections/bantal-tidur"
                            onClick={() => setActiveMega(null)}
                            className="mt-2 inline-flex items-center justify-between px-3 py-1.5 bg-forest text-warmwhite text-xs font-bold rounded-lg hover:bg-forest-dark transition-all group"
                          >
                            <span>Lihat Semua Bantal</span>
                            <ArrowRight className="w-3.5 h-3.5 text-gold group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. KOLEKSI KHAS (BAYI, SELIMUT, KUSYEN SOFA) */}
                <div
                  className="relative"
                  onMouseEnter={() => handleOpenMega('khas')}
                  onMouseLeave={handleCloseMega}
                >
                  <Link
                    href="/collections/produk-baby"
                    onClick={() => setActiveMega(null)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-150 whitespace-nowrap group ${
                      pathname.startsWith('/collections/produk-baby') ||
                      pathname.startsWith('/collections/selimut') ||
                      pathname.startsWith('/collections/kusyen-sofa')
                        ? 'bg-white text-forest font-bold shadow-xs border border-gold/50 ring-2 ring-gold/20'
                        : 'hover:bg-forest/5 hover:text-forest text-charcoal font-medium border border-transparent'
                    }`}
                  >
                    <Package className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${
                      pathname.startsWith('/collections/produk-baby') ||
                      pathname.startsWith('/collections/selimut') ||
                      pathname.startsWith('/collections/kusyen-sofa')
                        ? 'text-gold-dark scale-105'
                        : 'text-gold-dark'
                    }`} />
                    <span>Koleksi Khas</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-gold/15 text-gold-dark border border-gold/30">
                      BABY & KUSYEN
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 text-gold-dark transition-transform duration-200 ${
                        activeMega === 'khas' ? 'rotate-180' : ''
                      }`}
                    />
                  </Link>

                  {/* Dropdown: Koleksi Khas */}
                  {activeMega === 'khas' && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 pointer-events-auto"
                      onMouseEnter={() => handleKeepMega('khas')}
                      onMouseLeave={handleCloseMega}
                    >
                      <div className="w-[min(calc(100vw-3rem),660px)] max-w-[660px] bg-warmwhite rounded-2xl shadow-[0_20px_45px_-10px_rgba(19,50,91,0.18)] border border-borderLight p-4 animate-[fadeIn_0.15s_ease-out]">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-gold-dark pb-1.5 border-b border-borderLight mb-3">
                          Koleksi Jahitan Khas & Produk Terus Dari Kilang
                        </h4>
                        <div className="grid grid-cols-3 gap-2.5">
                          {/* Card 1: Produk Baby */}
                          <Link
                            href="/collections/produk-baby"
                            onClick={() => setActiveMega(null)}
                            className="group bg-cream/70 hover:bg-cream rounded-xl p-2.5 border border-borderLight/80 hover:border-gold transition-all block"
                          >
                            <div className="relative h-20 w-full rounded-lg overflow-hidden mb-1.5">
                              <Image
                                src="/images/products/set-tilam-baby-a-kekabu-asli.png"
                                alt="Produk Baby Kekabu Asli KAMAAR"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform"
                                sizes="180px"
                              />
                            </div>
                            <div className="font-semibold text-xs text-charcoal group-hover:text-forest">Produk Baby (Kekabu)</div>
                            <div className="text-[10.5px] text-charcoal-muted line-clamp-1">Bantal & Set Tilam Bayi</div>
                            <div className="text-xs font-bold text-forest mt-1">Dari RM9.90</div>
                          </Link>

                          {/* Card 2: Selimut Legend */}
                          <Link
                            href="/collections/selimut"
                            onClick={() => setActiveMega(null)}
                            className="group bg-cream/70 hover:bg-cream rounded-xl p-2.5 border border-borderLight/80 hover:border-gold transition-all block"
                          >
                            <div className="relative h-20 w-full rounded-lg overflow-hidden mb-1.5">
                              <Image
                                src="/images/products/selimut-legend-m.png"
                                alt="Selimut Legend KAMAAR"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform"
                                sizes="180px"
                              />
                            </div>
                            <div className="font-semibold text-xs text-charcoal group-hover:text-forest">Selimut Legend</div>
                            <div className="text-[10.5px] text-charcoal-muted line-clamp-1">Corak klasik saiz M & L</div>
                            <div className="text-xs font-bold text-forest mt-1">Dari RM14.90</div>
                          </Link>

                          {/* Card 3: Bantal Kusyen Sofa */}
                          <Link
                            href="/collections/kusyen-sofa"
                            onClick={() => setActiveMega(null)}
                            className="group bg-cream/70 hover:bg-cream rounded-xl p-2.5 border border-borderLight/80 hover:border-gold transition-all block"
                          >
                            <div className="relative h-20 w-full rounded-lg overflow-hidden mb-1.5">
                              <Image
                                src="/images/products/bantal-sofa-14x14.png"
                                alt="Bantal Kusyen Sofa KAMAAR"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform"
                                sizes="180px"
                              />
                            </div>
                            <div className="font-semibold text-xs text-charcoal group-hover:text-forest">Kusyen / Sofa</div>
                            <div className="text-[10.5px] text-charcoal-muted line-clamp-1">6 Saiz (14x14 - 30x30)</div>
                            <div className="text-xs font-bold text-forest mt-1">Dari RM9.90</div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. CUSTOM (OEM) */}
                <div
                  className="relative"
                  onMouseEnter={() => handleOpenMega('oem')}
                  onMouseLeave={handleCloseMega}
                >
                  <Link
                    href="/collections/custom-oem"
                    onClick={() => setActiveMega(null)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-150 whitespace-nowrap group ${
                      pathname.startsWith('/collections/custom-oem')
                        ? 'bg-white text-forest font-bold shadow-xs border border-gold/50 ring-2 ring-gold/20'
                        : 'hover:bg-forest/5 hover:text-forest text-charcoal font-medium border border-transparent'
                    }`}
                  >
                    <Sparkles className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${
                      pathname.startsWith('/collections/custom-oem') ? 'text-amber-500 scale-105' : 'text-amber-500'
                    }`} />
                    <span>Custom (OEM)</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                      PUKAL RM1000
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 text-gold-dark transition-transform duration-200 ${
                        activeMega === 'oem' ? 'rotate-180' : ''
                      }`}
                    />
                  </Link>

                  {/* Dropdown: Custom (OEM) */}
                  {activeMega === 'oem' && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 pointer-events-auto"
                      onMouseEnter={() => handleKeepMega('oem')}
                      onMouseLeave={handleCloseMega}
                    >
                      <div className="w-[min(calc(100vw-3rem),660px)] max-w-[660px] bg-warmwhite rounded-2xl shadow-[0_20px_45px_-10px_rgba(19,50,91,0.18)] border border-borderLight p-4 animate-[fadeIn_0.15s_ease-out]">
                        <div className="flex items-center justify-between pb-2 border-b border-borderLight mb-3">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-gold-dark">
                            Tempahan Pukal & Jahitan Custom (OEM)
                          </h4>
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            Minima Tempahan RM1,000
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <Link
                            href="/products/bantal-tidur-oem"
                            onClick={() => setActiveMega(null)}
                            className="p-2 rounded-xl bg-cream/70 hover:bg-cream border border-borderLight hover:border-gold transition-all block group text-center"
                          >
                            <div className="text-xl mb-1">🛏️</div>
                            <div className="font-bold text-xs text-charcoal group-hover:text-forest">Bantal OEM</div>
                            <div className="text-[10px] text-charcoal-muted mt-0.5">Pukal Kilang</div>
                            <div className="text-xs font-black text-forest mt-1">RM1,000</div>
                          </Link>
                          <Link
                            href="/products/tilam-toto-oem"
                            onClick={() => setActiveMega(null)}
                            className="p-2 rounded-xl bg-cream/70 hover:bg-cream border border-borderLight hover:border-gold transition-all block group text-center"
                          >
                            <div className="text-xl mb-1">✨</div>
                            <div className="font-bold text-xs text-charcoal group-hover:text-forest">Toto OEM</div>
                            <div className="text-[10px] text-charcoal-muted mt-0.5">Pukal Kilang</div>
                            <div className="text-xs font-black text-forest mt-1">RM1,000</div>
                          </Link>
                          <Link
                            href="/products/tilam-gulung-oem"
                            onClick={() => setActiveMega(null)}
                            className="p-2 rounded-xl bg-cream/70 hover:bg-cream border border-borderLight hover:border-gold transition-all block group text-center"
                          >
                            <div className="text-xl mb-1">📜</div>
                            <div className="font-bold text-xs text-charcoal group-hover:text-forest">Gulung OEM</div>
                            <div className="text-[10px] text-charcoal-muted mt-0.5">Pukal Kilang</div>
                            <div className="text-xs font-black text-forest mt-1">RM1,000</div>
                          </Link>
                          <Link
                            href="/products/kusyen-sofa-oem"
                            onClick={() => setActiveMega(null)}
                            className="p-2 rounded-xl bg-cream/70 hover:bg-cream border border-borderLight hover:border-gold transition-all block group text-center"
                          >
                            <div className="text-xl mb-1">🛋️</div>
                            <div className="font-bold text-xs text-charcoal group-hover:text-forest">Kusyen OEM</div>
                            <div className="text-[10px] text-charcoal-muted mt-0.5">Pukal Kilang</div>
                            <div className="text-xs font-black text-forest mt-1">RM1,000</div>
                          </Link>
                        </div>
                        <div className="mt-3 pt-2 border-t border-borderLight flex items-center justify-between">
                          <span className="text-[11px] text-charcoal-muted">
                            Khas untuk jenama sendiri, tender institusi, hotel & asrama.
                          </span>
                          <Link
                            href="/collections/custom-oem"
                            onClick={() => setActiveMega(null)}
                            className="text-xs font-bold text-forest hover:text-gold-dark flex items-center gap-1"
                          >
                            <span>Terokai Pakej OEM</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* VERTICAL DIVIDER */}
                <div className="h-5 w-px bg-borderLight mx-1" />

                {/* 6. JELAJAH PROMOSI ( LOKASI TERKINI) */}
                <div
                  className="relative"
                  onMouseEnter={() => handleOpenMega('promosi')}
                  onMouseLeave={handleCloseMega}
                >
                  <Link
                    href="/jelajah-promosi"
                    onClick={() => setActiveMega(null)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 hover:from-amber-200 hover:to-amber-100 text-amber-950 border border-amber-300 font-bold transition-all shadow-xs group whitespace-nowrap ${
                      pathname.startsWith('/jelajah-promosi')
                        ? 'ring-2 ring-amber-400 shadow-sm'
                        : ''
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500/30 animate-pulse" />
                    <span>JELAJAH PROMOSI</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-amber-600 text-white tracking-wider shadow-xs">
                      LOKASI TERKINI
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 text-amber-800 transition-transform duration-200 ${
                        activeMega === 'promosi' ? 'rotate-180' : ''
                      }`}
                    />
                  </Link>

                  {/* Mega Menu: Jelajah Promosi */}
                  {activeMega === 'promosi' && (
                    <div
                      className="absolute top-full right-0 pt-2 z-50 pointer-events-auto"
                      onMouseEnter={() => handleKeepMega('promosi')}
                      onMouseLeave={handleCloseMega}
                    >
                      <div className="w-[min(calc(100vw-3rem),660px)] max-w-[660px] bg-warmwhite rounded-2xl shadow-[0_25px_50px_-12px_rgba(19,50,91,0.22)] border border-amber-200 p-4 sm:p-5 grid grid-cols-12 gap-3 sm:gap-4 lg:gap-5 animate-[fadeIn_0.15s_ease-out]">
                        <div className="col-span-6 border-r border-borderLight pr-4">
                          <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded mb-2">
                            <Flame className="w-3 h-3 text-amber-600" />
                            <span>Jelajah Promosi & Lokasi Terkini</span>
                          </div>
                          <h4 className="font-serif text-sm font-bold text-forest leading-snug">
                            Promosi Terus Dari Kilang Ke Tempat Anda
                          </h4>
                          <p className="text-[11px] text-charcoal-muted mt-1 leading-relaxed">
                            Kami bawakan produk KAMAAR terus ke lokasi promosi terpilih dengan harga promosi jualan gudang terhebat.
                          </p>
                          <div className="mt-2.5 space-y-1.5 text-xs">
                            <div className="flex items-center justify-between p-1.5 rounded bg-amber-50/60 border border-amber-100">
                              <span className="font-medium text-charcoal">Gudang Utama Tasek Gelugor</span>
                              <span className="font-bold text-emerald-700">Sedang Berlangsung</span>
                            </div>
                            <div className="flex items-center justify-between p-1.5 rounded bg-amber-50/60 border border-amber-100">
                              <span className="font-medium text-charcoal">Jelajah Utara (Kedah / Perak)</span>
                              <span className="font-bold text-amber-800">Akan Datang</span>
                            </div>
                            <div className="flex items-center justify-between p-1.5 rounded bg-amber-50/60 border border-amber-100">
                              <span className="font-medium text-charcoal">Karnival Lembah Klang</span>
                              <span className="font-bold text-blue-800">Tempahan Awal</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-6 flex flex-col justify-between">
                          <div className="relative h-28 w-full rounded-lg overflow-hidden mb-2">
                            <Image
                              src="/images/promosi/PROMOSI 2.png"
                              alt="Jelajah Promosi KAMAAR Beddings"
                              fill
                              className="object-cover"
                              sizes="280px"
                            />
                            <div className="absolute bottom-2 left-2 right-2 bg-charcoal/80 backdrop-blur-xs text-warmwhite text-[10px] px-2 py-0.5 rounded">
                              Tapak Promosi & Gudang Tasek Gelugor Dibuka!
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Link
                              href="/jelajah-promosi"
                              onClick={() => setActiveMega(null)}
                              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-forest text-warmwhite text-xs font-bold rounded-lg hover:bg-forest-dark transition-all"
                            >
                              <span>Lihat Semua Lokasi Jelajah</span>
                              <ArrowRight className="w-3.5 h-3.5 text-gold" />
                            </Link>
                            <a
                              href="https://wa.me/60194786991?text=Salam%20KAMAAR%20Beddings,%20saya%20ingin%20tahu%20lokasi%20terkini%20jelajah%20promosi"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#25D366] text-white text-xs font-bold rounded-lg hover:bg-[#20ba59] transition-all shadow-xs"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>WhatsApp Pertanyaan Lokasi</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 7. PROFIL SYARIKAT */}
                <div
                  className="relative"
                  onMouseEnter={() => handleOpenMega('kilang')}
                  onMouseLeave={handleCloseMega}
                >
                  <Link
                    href="/profil"
                    onClick={() => setActiveMega(null)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-150 whitespace-nowrap group ${
                      pathname.startsWith('/profil') || pathname.startsWith('/business')
                        ? 'bg-white text-forest font-bold shadow-xs border border-gold/50 ring-2 ring-gold/20'
                        : 'hover:bg-forest/5 hover:text-forest text-charcoal font-medium border border-transparent'
                    }`}
                  >
                    <Building2 className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${
                      pathname.startsWith('/profil') || pathname.startsWith('/business')
                        ? 'text-gold-dark scale-105'
                        : 'text-forest/80'
                    }`} />
                    <span>PROFIL SYARIKAT</span>
                    <ChevronDown
                      className={`w-3 h-3 text-gold-dark transition-transform duration-200 ${
                        activeMega === 'kilang' ? 'rotate-180' : ''
                      }`}
                    />
                  </Link>

                  {/* Dropdown: Kilang & OEM */}
                  {activeMega === 'kilang' && (
                    <div
                      className="absolute top-full right-0 pt-2 z-50 pointer-events-auto"
                      onMouseEnter={() => handleKeepMega('kilang')}
                      onMouseLeave={handleCloseMega}
                    >
                      <div className="w-[min(calc(100vw-3rem),360px)] max-w-[360px] bg-warmwhite rounded-2xl shadow-[0_20px_45px_-10px_rgba(19,50,91,0.18)] border border-borderLight p-4 animate-[fadeIn_0.15s_ease-out]">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-gold-dark pb-1.5 border-b border-borderLight mb-2.5">
                          Tunas Sinar Jaya Enterprise
                        </h4>
                        <div className="space-y-2">
                          <Link
                            href="/profil"
                            onClick={() => setActiveMega(null)}
                            className="block p-2 rounded-lg hover:bg-cream border border-transparent hover:border-borderLight transition-all group"
                          >
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-forest" />
                              <div className="font-semibold text-xs text-charcoal group-hover:text-forest">Profil Syarikat & 4 Unit Kilang</div>
                            </div>
                            <div className="text-[11px] text-charcoal-muted mt-0.5 pl-6">
                              Carta organisasi, fasiliti pemotongan, jahitan & stor siap.
                            </div>
                          </Link>

                          <Link
                            href="/business"
                            onClick={() => setActiveMega(null)}
                            className="block p-2 rounded-lg hover:bg-cream border border-transparent hover:border-borderLight transition-all group"
                          >
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-gold-dark" />
                              <div className="font-semibold text-xs text-charcoal group-hover:text-forest">Tempahan Pukal & OEM</div>
                            </div>
                            <div className="text-[11px] text-charcoal-muted mt-0.5 pl-6">
                              Khidmat jahitan jenama sendiri & tender kerajaan/swasta.
                            </div>
                          </Link>

                          <div className="pt-2 border-t border-borderLight/80">
                            <a
                              href="https://wa.me/60194786991?text=Salam%20KAMAAR%20Beddings,%20saya%20nak%20tanya%20produk%20kilang"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full flex items-center justify-between p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-forest border border-blue-200/80 transition-colors"
                            >
                              <div className="flex items-center gap-2 text-xs font-semibold">
                                <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
                                <span>Hotline Kilang (WhatsApp)</span>
                              </div>
                              <span className="text-xs font-mono font-bold">019-478 6991</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </nav>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE VIEW (< 1024px): COMPACT & BALANCED TOP BAR                        */}
        {/* ========================================================================= */}
        <div className="lg:hidden bg-[#FAF7F2] border-b border-borderLight py-3 px-4 shadow-xs">
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
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          isMobileMenuOpen
            ? 'pointer-events-auto visible'
            : 'pointer-events-none invisible delay-300'
        }`}
      >
        {/* Backdrop with silky blur */}
        <div
          className={`fixed inset-0 bg-forest-dark/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Drawer Panel */}
        <div
          className={`fixed inset-y-0 left-0 max-w-[340px] w-[88vw] bg-warmwhite shadow-2xl flex flex-col justify-between overflow-hidden transform transition-transform duration-300 ease-out will-change-transform ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
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

              {/* 3 SLEEK QUICK-ACCESS PILLS (Compact & Modern) */}
              <div className="px-3.5 py-2.5 bg-warmwhite border-b border-borderLight/60">
                <div className="grid grid-cols-3 gap-2">
                  <Link
                    href="/showrooms"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center space-x-1.5 py-2 px-1 rounded-xl bg-cream/60 hover:bg-cream border border-borderLight text-forest font-bold text-[11px] transition-all shadow-2xs group"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#B49A58] flex-shrink-0" />
                    <span className="truncate">{locale === 'bm' ? 'Showroom' : 'Showrooms'}</span>
                  </Link>

                  <Link
                    href="/jelajah-promosi"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center space-x-1.5 py-2 px-1 rounded-xl bg-amber-50 hover:bg-amber-100/70 border border-amber-200/80 text-amber-900 font-bold text-[11px] transition-all shadow-2xs group"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span className="truncate">{locale === 'bm' ? 'Promosi' : 'Offers'}</span>
                  </Link>

                  <Link
                    href="/profil"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center space-x-1.5 py-2 px-1 rounded-xl bg-cream/60 hover:bg-cream border border-borderLight text-forest font-bold text-[11px] transition-all shadow-2xs group"
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#1E4E8C] flex-shrink-0" />
                    <span className="truncate">{locale === 'bm' ? 'Kilang TSJ' : 'Factory'}</span>
                  </Link>
                </div>
              </div>

              {/* 4. KOLEKSI PRODUK KILANG (Clean, Flat, Non-Cluttered List) */}
              <div className="p-3.5 space-y-2">
                <div className="px-1 flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-secondary">
                    {locale === 'bm' ? 'Koleksi Produk Kilang' : 'Factory Collections'}
                  </span>
                  <span className="text-[10px] font-semibold text-gold-dark">
                    {locale === 'bm' ? 'Terus Dari Kilang' : 'Direct From Factory'}
                  </span>
                </div>

                {/* Explore All Products Card */}
                <Link
                  href="/collections"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-[#1E4E8C] to-[#2A6DB5] text-white shadow-xs hover:opacity-95 transition-all text-xs font-bold"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-base">✨</span>
                    <span>{locale === 'bm' ? 'Lihat Semua Produk & Saiz' : 'Explore All Collections'}</span>
                  </div>
                  <span className="text-xs opacity-90">&rarr;</span>
                </Link>

                {/* Clean Category Rows */}
                <nav className="space-y-1 pt-1">
                  {navCategories.map((cat) => {
                    const targetUrl = cat.customUrl || `/collections/${cat.slug}`
                    const label = getCategoryLabel(cat)
                    const isSaleCategory = cat.badge?.toUpperCase() === 'SALE' || cat.slug === 'offers' || cat.badge?.toUpperCase() === 'HARGA KILANG'

                    const categoryIcons: Record<string, string> = {
                      'tilam-toto': '🛏️',
                      'tilam-gulung': '🌀',
                      'tilam-kekabu': '🌿',
                      'bantal-tidur': '🪶',
                      'bantal-peluk': '🛋️',
                      'produk-baby': '👶',
                      selimut: '🧵',
                      'kusyen-sofa': '🛋️',
                      'sarung-tilam': '🛡️',
                      'custom-oem': '🏭',
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
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isSaleCategory
                            ? 'bg-amber-50/60 border border-amber-200/50 text-amber-900 hover:bg-amber-100/60'
                            : 'text-charcoal hover:bg-cream/80 hover:text-forest'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="w-7 h-7 rounded-lg bg-cream/70 flex items-center justify-center text-xs flex-shrink-0">
                            {categoryIcons[cat.slug] || '✨'}
                          </span>
                          <span className="leading-snug">{label}</span>
                        </div>

                        <div className="flex items-center space-x-1.5 flex-shrink-0">
                          {cat.badge && (
                            <span
                              className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-extrabold ${
                                isSaleCategory
                                  ? 'bg-amber-600 text-white shadow-2xs'
                                  : 'bg-[#B49A58]/20 text-[#8C6B1C]'
                              }`}
                            >
                              {cat.badge}
                            </span>
                          )}
                          <span className="text-secondary text-base leading-none">&rsaquo;</span>
                        </div>
                      </Link>
                    )
                  })}
                </nav>
              </div>

              {/* 5. PERKHIDMATAN & MAKLUMAT (Clean & Organized) */}
              <div className="px-3.5 pb-3.5 space-y-1 border-t border-borderLight/60 pt-3">
                <div className="px-1 pb-1">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-secondary">
                    {locale === 'bm' ? 'Perkhidmatan & Maklumat' : 'Services & Support'}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <Link
                    href="/account/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-charcoal hover:bg-cream hover:text-forest transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-6 h-6 rounded-lg bg-cream flex items-center justify-center text-xs text-gold-dark">
                        <Package className="w-3.5 h-3.5" />
                      </span>
                      <span>{locale === 'bm' ? 'Jejak Status Tempahan' : 'Track Order Status'}</span>
                    </div>
                    <span className="text-secondary text-sm">&rsaquo;</span>
                  </Link>

                  <Link
                    href="/warranty"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-charcoal hover:bg-cream hover:text-forest transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-6 h-6 rounded-lg bg-cream flex items-center justify-center text-xs text-gold-dark">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </span>
                      <span>{locale === 'bm' ? 'Daftar & Semak Waranti' : 'Warranty Registration'}</span>
                    </div>
                    <span className="text-secondary text-sm">&rsaquo;</span>
                  </Link>

                  <Link
                    href="/compare"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-charcoal hover:bg-cream hover:text-forest transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-6 h-6 rounded-lg bg-cream flex items-center justify-center text-xs text-gold-dark">
                        <Scale className="w-3.5 h-3.5" />
                      </span>
                      <span>{locale === 'bm' ? 'Bandingkan Tilam' : 'Compare Mattresses'}</span>
                    </div>
                    {compareCount > 0 ? (
                      <span className="px-1.5 py-0.5 rounded-full bg-gold text-forest-dark text-[10px] font-bold">
                        {compareCount}
                      </span>
                    ) : (
                      <span className="text-secondary text-sm">&rsaquo;</span>
                    )}
                  </Link>

                  <Link
                    href="/affiliate"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-charcoal hover:bg-cream hover:text-forest transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-6 h-6 rounded-lg bg-cream flex items-center justify-center text-xs text-gold-dark">
                        <Sparkles className="w-3.5 h-3.5" />
                      </span>
                      <span>{locale === 'bm' ? 'Program Ejen Affiliate' : 'Affiliate Partner Program'}</span>
                    </div>
                    <span className="text-secondary text-sm">&rsaquo;</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* 6. STICKY BOTTOM ACTION FOOTER (Thumb Zone) */}
            <div className="p-3 border-t border-borderLight bg-warmwhite/95 backdrop-blur-md space-y-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-lg">
              {/* Language & Account bar */}
              <div className="flex items-center justify-between text-xs px-1">
                <div className="flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-gold-dark" />
                  <div className="inline-flex p-0.5 bg-cream rounded-full border border-borderLight text-[11px]">
                    <button
                      onClick={() => setLocale('en')}
                      className={`px-2.5 py-0.5 rounded-full font-bold transition-all ${
                        locale === 'en' ? 'bg-[#1E4E8C] text-white shadow-xs' : 'text-secondary hover:text-charcoal'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setLocale('bm')}
                      className={`px-2.5 py-0.5 rounded-full font-bold transition-all ${
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
                className="w-full py-2.5 px-3 bg-gradient-to-r from-forest to-forest-light hover:from-forest-dark hover:to-forest text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 text-sky-200" />
                <span>{locale === 'bm' ? 'WhatsApp Kilang (019-478 6991)' : 'WhatsApp (019-478 6991)'}</span>
              </a>
            </div>
          </div>
        </div>

      {/* Global Predictive Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
