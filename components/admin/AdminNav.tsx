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
  LogOut,
  Sparkles,
  Palette,
} from 'lucide-react'
import { KamaarLogo } from '@/components/brand/KamaarLogo'
import { AdminLogoutButton } from './AdminLogoutButton'

interface AdminNavProps {
  session: {
    name: string
    email: string
    role: string
  }
}

const navItems = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Products & Variants', href: '/admin/products', icon: BedDouble },
  { label: 'Categories & Nav', href: '/admin/categories', icon: Layers },
  { label: 'Website Editor', href: '/admin/website-editor', icon: Palette, isNew: true },
  { label: 'Inventory & Stock', href: '/admin/inventory', icon: Boxes },
  { label: 'Orders & Fulfilment', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Promotions & Coupons', href: '/admin/promotions', icon: Tag },
  { label: 'Affiliates & Agents', href: '/admin/affiliates', icon: Share2 },
  { label: 'Showroom Studios', href: '/admin/showrooms', icon: MapPin },
  { label: 'Warranty Registrations', href: '/admin/warranties', icon: ShieldCheck },
  { label: 'Site Settings', href: '/admin/settings', icon: Settings },
  { label: 'Admin Audit Log', href: '/admin/audits', icon: History },
]

export function AdminNav({ session }: AdminNavProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Automatically close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  // Ensure admin name displays as Kamaar Admin if empty or legacy
  const adminName =
    session?.name && !session.name.toLowerCase().includes('syed')
      ? session.name
      : 'Kamaar Admin'
  const adminInitial = adminName.charAt(0).toUpperCase() || 'K'

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
      <header className="md:hidden sticky top-0 z-40 bg-[#13325B] text-warmwhite border-b border-[#B49A58]/20 px-4 py-3 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-warmwhite transition-colors cursor-pointer flex items-center justify-center"
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
            <h1 className="text-sm font-bold text-white tracking-tight truncate max-w-[190px] sm:max-w-xs">
              {activeItem.label}
            </h1>
          </div>
        </div>

        {/* Right side: Staff Profile Avatar */}
        <div className="flex items-center space-x-2">
          <Link
            href="/"
            target="_blank"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
            title="Lihat Kedai Awam"
          >
            <ExternalLink className="w-4 h-4 text-[#D4AF37]" />
          </Link>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1E4E8C] to-[#2A6DB5] border border-[#B49A58]/40 text-[#D4AF37] flex items-center justify-center font-bold text-xs shadow-xs cursor-pointer"
            title={`${adminName} (${session.role})`}
          >
            {adminInitial}
          </button>
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
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
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
              <div className="p-4 border-b border-white/10 bg-white/5">
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

              {/* Navigation Links */}
              <nav className="p-3 space-y-1 text-xs font-medium">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive =
                    item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
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
      <aside className="hidden md:flex md:w-64 bg-[#13325B] text-warmwhite flex-shrink-0 flex-col justify-between border-r border-[#B49A58]/20 min-h-screen sticky top-0 h-screen">
        <div className="flex-1 overflow-y-auto">
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

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs font-medium">
            {navItems.map((item) => {
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
            })}
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
    </>
  )
}
