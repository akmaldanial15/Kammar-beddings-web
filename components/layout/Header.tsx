'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
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
  const [isMattressMegaOpen, setIsMattressMegaOpen] = useState(false)
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

  const handleOpenMega = () => {
    if (megaTimeoutRef.current) {
      clearTimeout(megaTimeoutRef.current)
      megaTimeoutRef.current = null
    }
    setIsMattressMegaOpen(true)
  }

  const handleCloseMega = () => {
    if (megaTimeoutRef.current) {
      clearTimeout(megaTimeoutRef.current)
    }
    megaTimeoutRef.current = setTimeout(() => {
      setIsMattressMegaOpen(false)
    }, 220) // 220ms intent buffer: ensures mouse crossing gap never drops menu
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
    setIsMattressMegaOpen(false)
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

          {/* TIER 2: DEDICATED CATEGORY NAVIGATION ROW (100% UNCLUTTERED) */}
          <div className="bg-warmwhite/95 backdrop-blur-md border-b border-borderLight shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <nav className="flex items-center justify-center space-x-8 xl:space-x-12 py-2.5 text-[13.5px] xl:text-[14px] font-medium text-charcoal">
                {navCategories.map((cat) => {
                  const targetUrl = cat.customUrl || `/collections/${cat.slug}`
                  const isActive =
                    targetUrl === '/collections/mattress'
                      ? pathname.startsWith('/collections/mattress')
                      : targetUrl === '/blog'
                      ? pathname.startsWith('/blog')
                      : pathname === targetUrl
                  const label = getCategoryLabel(cat)

                  if (cat.hasMegaMenu) {
                    return (
                      <div
                        key={cat.id}
                        className="py-1"
                        onMouseEnter={handleOpenMega}
                        onMouseLeave={handleCloseMega}
                      >
                        <Link
                          href={targetUrl}
                          className={`flex items-center space-x-1.5 py-1.5 hover:text-forest transition-colors group ${
                            isActive ? 'text-forest font-bold border-b-2 border-gold' : ''
                          }`}
                        >
                          <span className="tracking-wide">{label}</span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-gold-dark transition-transform duration-200 ${
                              isMattressMegaOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </Link>

                        {/* Mega Menu Dropdown Centered in Category Nav Row */}
                        {isMattressMegaOpen && (
                          <div
                            className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 pointer-events-auto"
                            onMouseEnter={handleOpenMega}
                            onMouseLeave={handleCloseMega}
                          >
                            {/* Invisible Hover Bridge: covers gap between button and card */}
                            <div className="absolute -top-3 left-0 right-0 h-4 bg-transparent" />

                            <div className={`w-[860px] bg-warmwhite rounded-2xl shadow-2xl border border-borderLight p-6 grid ${megaMenuConfig.promoCard?.enabled !== false ? 'grid-cols-4' : 'grid-cols-3'} gap-6 animate-fade-in-down`}>
                              {/* Dynamic Columns configured by admin */}
                              {megaMenuConfig.columns?.map((col) => {
                                const colTitle = locale === 'bm' && col.titleBm ? col.titleBm : col.title
                                return (
                                  <div key={col.id}>
                                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-gold-dark pb-2 border-b border-borderLight mb-3">
                                      {colTitle}
                                    </h4>
                                    <ul className="space-y-2.5 text-xs text-charcoal-muted">
                                      {col.items?.map((item) => {
                                        const itemLabel = locale === 'bm' && item.labelBm ? item.labelBm : item.label
                                        return (
                                          <li key={item.id}>
                                            <Link
                                              href={item.href}
                                              className="hover:text-forest hover:font-semibold block transition-colors"
                                              onClick={() => setIsMattressMegaOpen(false)}
                                            >
                                              {itemLabel}
                                            </Link>
                                          </li>
                                        )
                                      })}
                                    </ul>
                                  </div>
                                )
                              })}

                              {/* Col 4: Interactive Quiz Card */}
                              {megaMenuConfig.promoCard?.enabled !== false && (
                                <div className="bg-cream rounded-xl p-4 flex flex-col justify-between border border-borderLight shadow-sm">
                                  <div>
                                    <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-forest bg-gold/25 px-2 py-0.5 rounded mb-2">
                                      <Sparkles className="w-3 h-3 text-gold-dark" />
                                      <span>{megaMenuConfig.promoCard.badge || 'PERSONALIZED FIT'}</span>
                                    </span>
                                    <h5 className="font-serif text-sm font-bold text-forest leading-snug">
                                      {megaMenuConfig.promoCard.title || 'Unsure which mattress suits your body?'}
                                    </h5>
                                    <p className="text-[11px] text-charcoal-muted mt-1 leading-relaxed">
                                      {megaMenuConfig.promoCard.description || 'Take our 60-second Mattress Finder quiz for personalized firmness recommendations.'}
                                    </p>
                                  </div>
                                  <Link
                                    href={megaMenuConfig.promoCard.buttonUrl || '/finder'}
                                    onClick={() => setIsMattressMegaOpen(false)}
                                    className="mt-3 inline-flex items-center justify-between px-3 py-2 bg-forest text-warmwhite text-xs font-bold rounded-lg hover:bg-forest-dark transition-all group"
                                  >
                                    <span>{megaMenuConfig.promoCard.buttonText || 'Start Mattress Quiz'}</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-gold group-hover:translate-x-0.5 transition-transform" />
                                  </Link>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  }

                  const isSaleCategory = cat.badge?.toUpperCase() === 'SALE' || cat.slug === 'offers'
                  return (
                    <Link
                      key={cat.id}
                      href={targetUrl}
                      className={`flex items-center space-x-1.5 py-1 transition-colors tracking-wide ${
                        isSaleCategory
                          ? `text-sale hover:text-forest ${
                              isActive ? 'font-bold border-b-2 border-sale' : 'font-semibold'
                            }`
                          : `hover:text-forest ${
                              isActive ? 'text-forest font-bold border-b-2 border-gold' : ''
                            }`
                      }`}
                    >
                      {isSaleCategory && <Tag className="w-3.5 h-3.5" />}
                      <span>{label}</span>
                      {cat.badge && (
                        <span
                          className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-bold ${
                            isSaleCategory
                              ? 'bg-sale/10 text-sale'
                              : 'bg-gold/20 text-forest-dark'
                          }`}
                        >
                          {cat.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
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
