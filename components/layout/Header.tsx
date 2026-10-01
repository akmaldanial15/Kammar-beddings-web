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
} from 'lucide-react'
import { Category } from '@/types'
import { initialCategories } from '@/lib/db/seedData'
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
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>('mattresses')
  const [navCategories, setNavCategories] = useState<Category[]>(() =>
    initialCategories.filter((c) => c.showInNav && c.isActive !== false)
  )

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

    // Sync when category is updated in admin, tab gets focused, or route changes
    const handleUpdate = () => fetchCategories()
    window.addEventListener('kamaar:categories_updated', handleUpdate)
    window.addEventListener('focus', handleUpdate)

    return () => {
      window.removeEventListener('kamaar:categories_updated', handleUpdate)
      window.removeEventListener('focus', handleUpdate)
    }
  }, [fetchCategories, pathname])

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

                            <div className="w-[860px] bg-warmwhite rounded-2xl shadow-2xl border border-borderLight p-6 grid grid-cols-4 gap-6 animate-fade-in-down">
                              {/* Col 1: By Material */}
                              <div>
                                <h4 className="text-[11px] font-bold uppercase tracking-wider text-gold-dark pb-2 border-b border-borderLight mb-3">
                                  {t.byMaterial}
                                </h4>
                                <ul className="space-y-2.5 text-xs text-charcoal-muted">
                                  <li>
                                    <Link
                                      href="/collections/mattress?material=latex"
                                      className="hover:text-forest hover:font-semibold block transition-colors"
                                    >
                                      {t.naturalLatex}
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href="/collections/mattress?material=hybrid"
                                      className="hover:text-forest hover:font-semibold block transition-colors"
                                    >
                                      {t.hybridSpring}
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href="/collections/mattress?material=memory"
                                      className="hover:text-forest hover:font-semibold block transition-colors"
                                    >
                                      {t.memoryFoam}
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href="/collections/mattress?material=ortho"
                                      className="hover:text-forest hover:font-semibold block transition-colors"
                                    >
                                      {t.orthopaedic}
                                    </Link>
                                  </li>
                                </ul>
                              </div>

                              {/* Col 2: By Size */}
                              <div>
                                <h4 className="text-[11px] font-bold uppercase tracking-wider text-gold-dark pb-2 border-b border-borderLight mb-3">
                                  {t.bySize}
                                </h4>
                                <ul className="space-y-2.5 text-xs text-charcoal-muted">
                                  <li>
                                    <Link
                                      href="/collections/mattress?size=single"
                                      className="hover:text-forest hover:font-semibold block transition-colors"
                                    >
                                      {t.single}
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href="/collections/mattress?size=supersingle"
                                      className="hover:text-forest hover:font-semibold block transition-colors"
                                    >
                                      {t.superSingle}
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href="/collections/mattress?size=queen"
                                      className="hover:text-forest hover:font-semibold block transition-colors"
                                    >
                                      {t.queen}
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href="/collections/mattress?size=king"
                                      className="hover:text-forest hover:font-semibold block transition-colors"
                                    >
                                      {t.king}
                                    </Link>
                                  </li>
                                </ul>
                              </div>

                              {/* Col 3: By Firmness */}
                              <div>
                                <h4 className="text-[11px] font-bold uppercase tracking-wider text-gold-dark pb-2 border-b border-borderLight mb-3">
                                  {t.byFirmness}
                                </h4>
                                <ul className="space-y-2.5 text-xs text-charcoal-muted">
                                  <li>
                                    <Link
                                      href="/collections/mattress?firmness=soft"
                                      className="hover:text-forest hover:font-semibold block transition-colors"
                                    >
                                      {t.soft}
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href="/collections/mattress?firmness=medium"
                                      className="hover:text-forest hover:font-semibold block transition-colors"
                                    >
                                      {t.medium}
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href="/collections/mattress?firmness=firm"
                                      className="hover:text-forest hover:font-semibold block transition-colors"
                                    >
                                      {t.firm}
                                    </Link>
                                  </li>
                                </ul>
                              </div>

                              {/* Col 4: Interactive Quiz Card */}
                              <div className="bg-cream rounded-xl p-4 flex flex-col justify-between border border-borderLight shadow-sm">
                                <div>
                                  <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-forest bg-gold/25 px-2 py-0.5 rounded mb-2">
                                    <Sparkles className="w-3 h-3 text-gold-dark" />
                                    <span>Personalized Fit</span>
                                  </span>
                                  <h5 className="font-serif text-sm font-bold text-forest leading-snug">
                                    Unsure which mattress suits your body?
                                  </h5>
                                  <p className="text-[11px] text-charcoal-muted mt-1 leading-relaxed">
                                    Take our 60-second Mattress Finder quiz for personalized firmness recommendations.
                                  </p>
                                </div>
                                <Link
                                  href="/finder"
                                  className="mt-3 inline-flex items-center justify-between px-3 py-2 bg-forest text-warmwhite text-xs font-bold rounded-lg hover:bg-forest-dark transition-all group"
                                >
                                  <span>Start Mattress Quiz</span>
                                  <ArrowRight className="w-3.5 h-3.5 text-gold group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                              </div>
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
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-forest-dark/60 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-warmwhite shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-in-left">
            <div>
              {/* Drawer Top Header */}
              <div className="p-4 border-b border-borderLight flex items-center justify-between bg-cream/50">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
                  <KamaarLogo variant="horizontal" size="sm" theme="light" />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-charcoal-muted hover:text-forest rounded-full hover:bg-warmwhite transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Fast Action Buttons */}
              <div className="p-4 bg-forest-dark text-warmwhite space-y-2">
                <Link
                  href="/finder"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-warmwhite/10 hover:bg-warmwhite/20 border border-gold/30 text-xs font-bold transition-all text-warmwhite"
                >
                  <span className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span>60-Sec Mattress Finder Quiz</span>
                  </span>
                  <span className="text-gold">&rarr;</span>
                </Link>

                <Link
                  href="/showrooms"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-warmwhite/5 hover:bg-warmwhite/10 border border-warmwhite/10 text-xs font-medium transition-all text-warmwhite/90"
                >
                  <span className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gold" />
                    <span>Book Showroom Appointment</span>
                  </span>
                  <span className="text-gold">&rarr;</span>
                </Link>
              </div>

              {/* Accordion & Category Links */}
              <nav className="p-4 space-y-1 text-sm font-medium">
                {navCategories.map((cat) => {
                  const targetUrl = cat.customUrl || `/collections/${cat.slug}`
                  const label = getCategoryLabel(cat)
                  const isSaleCategory = cat.badge?.toUpperCase() === 'SALE' || cat.slug === 'offers'

                  if (cat.hasMegaMenu) {
                    const isExpanded = mobileExpandedSection === cat.id || (mobileExpandedSection === 'mattresses' && cat.slug === 'mattress')
                    return (
                      <div key={cat.id} className="border-b border-borderLight/60 pb-1">
                        <button
                          onClick={() =>
                            setMobileExpandedSection(isExpanded ? null : cat.id)
                          }
                          className="w-full flex items-center justify-between py-2.5 text-forest font-bold text-left"
                        >
                          <span>{label}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-gold-dark transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {isExpanded && (
                          <div className="pl-3 pb-2 space-y-2 text-xs text-charcoal-muted animate-fade-in">
                            <Link
                              href={targetUrl}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block py-1 text-forest font-bold underline"
                            >
                              All {label} Collection &rarr;
                            </Link>
                            <Link
                              href={`${targetUrl}?material=latex`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block py-1 hover:text-forest"
                            >
                              100% Pure Natural Latex
                            </Link>
                            <Link
                              href={`${targetUrl}?material=hybrid`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block py-1 hover:text-forest"
                            >
                              Cool Night Hybrid Series
                            </Link>
                            <Link
                              href={`${targetUrl}?material=ortho`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block py-1 hover:text-forest"
                            >
                              Orthopaedic Spinal Firm
                            </Link>
                            <div className="pt-1.5 border-t border-borderLight/40 flex items-center space-x-3 text-[11px] font-semibold text-gold-dark">
                              <Link
                                href={`${targetUrl}?size=single`}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                Single
                              </Link>
                              <span>&bull;</span>
                              <Link
                                href={`${targetUrl}?size=queen`}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                Queen
                              </Link>
                              <span>&bull;</span>
                              <Link
                                href={`${targetUrl}?size=king`}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                King
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  }

                  return (
                    <Link
                      key={cat.id}
                      href={targetUrl}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between py-2.5 border-b border-borderLight/60 ${
                        isSaleCategory ? 'text-sale font-bold' : 'text-charcoal hover:text-forest'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {isSaleCategory && <Tag className="w-4 h-4 text-sale" />}
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
                      </div>
                      <span className="text-xs text-charcoal-muted">&rarr;</span>
                    </Link>
                  )
                })}

                {/* Compare */}
                <Link
                  href="/compare"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 text-charcoal hover:text-forest"
                >
                  <span className="flex items-center space-x-2">
                    <Scale className="w-4 h-4 text-gold-dark" />
                    <span>Compare Mattresses</span>
                  </span>
                  {compareCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-gold text-forest-dark text-[11px] font-bold flex items-center justify-center">
                      {compareCount}
                    </span>
                  )}
                </Link>
              </nav>
            </div>

            {/* Drawer Bottom Controls */}
            <div className="p-4 border-t border-borderLight bg-cream/70 space-y-3">
              {/* Language Switcher */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-charcoal-muted font-medium">Language / Bahasa:</span>
                <div className="flex items-center space-x-1 bg-warmwhite px-2 py-1 rounded-full border border-borderLight">
                  <button
                    onClick={() => setLocale('en')}
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      locale === 'en' ? 'bg-forest text-warmwhite' : 'text-charcoal-muted'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLocale('bm')}
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      locale === 'bm' ? 'bg-forest text-warmwhite' : 'text-charcoal-muted'
                    }`}
                  >
                    BM
                  </button>
                </div>
              </div>

              {/* Direct WhatsApp Concierge */}
              <a
                href="https://wa.me/60123456789?text=Hello%20KAMAAR%20Beddings,%20I%20would%20like%20to%20enquire%20about%20your%20mattresses."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 text-gold" />
                <span>WhatsApp Concierge</span>
              </a>

              {/* Customer Account */}
              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2 bg-warmwhite hover:bg-cream text-charcoal border border-borderLight text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-gold-dark" />
                <span>Customer Sanctuary Portal</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Global Predictive Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
