import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  LayoutDashboard,
  BedDouble,
  Boxes,
  ShoppingBag,
  Tag,
  Share2,
  MapPin,
  ShieldCheck,
  Settings,
  History,
  ExternalLink,
} from 'lucide-react'
import { getAdminSession } from '@/lib/admin/auth'
import { AdminLogoutButton } from '@/components/admin/AdminLogoutButton'
import { KamaarLogo } from '@/components/brand/KamaarLogo'

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession()

  // Protect all /admin dashboard routes
  if (!session) {
    redirect('/admin/login')
  }

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Products & Variants', href: '/admin/products', icon: BedDouble },
    { label: 'Inventory & Stock', href: '/admin/inventory', icon: Boxes },
    { label: 'Orders & Fulfilment', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Promotions & Coupons', href: '/admin/promotions', icon: Tag },
    { label: 'Affiliates & Agents', href: '/admin/affiliates', icon: Share2 },
    { label: 'Showroom Studios', href: '/admin/showrooms', icon: MapPin },
    { label: 'Warranty Registrations', href: '/admin/warranties', icon: ShieldCheck },
    { label: 'Site Settings', href: '/admin/settings', icon: Settings },
    { label: 'Admin Audit Log', href: '/admin/audits', icon: History },
  ]

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row text-charcoal">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-forest-dark text-warmwhite flex-shrink-0 flex flex-col justify-between border-r border-borderLight/20">
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-warmwhite/10">
            <Link href="/admin" className="block">
              <KamaarLogo variant="horizontal" size="sm" theme="dark" />
              <span className="text-[8.5px] uppercase tracking-[0.2em] text-gold font-bold block mt-1.5">
                Admin Atelier Dashboard
              </span>
            </Link>

            {/* Staff info card */}
            <div className="mt-4 p-3 bg-warmwhite/10 rounded-xl border border-warmwhite/15">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-gold text-forest-dark flex items-center justify-center font-bold text-xs">
                  {session.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-warmwhite block truncate">{session.name}</span>
                  <span className="text-[10px] text-gold uppercase tracking-wider font-semibold">
                    {session.role.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 text-xs font-medium">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-forest text-warmwhite/80 hover:text-warmwhite transition-colors"
                >
                  <Icon className="w-4 h-4 text-gold" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-warmwhite/10 space-y-2 text-xs">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-warmwhite/5 hover:bg-warmwhite/10 text-warmwhite/80 hover:text-warmwhite transition-colors"
          >
            <span className="flex items-center space-x-2">
              <ExternalLink className="w-3.5 h-3.5 text-gold" />
              <span>View Storefront</span>
            </span>
            <span className="text-[10px] text-gold">&rarr;</span>
          </Link>

          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main Administrative Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
