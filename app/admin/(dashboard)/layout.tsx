import React from 'react'
import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin/auth'
import { AdminNav } from '@/components/admin/AdminNav'

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession()

  // Protect all /admin dashboard routes
  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row text-charcoal">
      {/* Responsive Navigation: Sticky Header + Drawer on Mobile, Left Sidebar on Desktop */}
      <AdminNav session={session} />

      {/* Main Administrative Content Area */}
      <main className="flex-1 p-3.5 sm:p-6 md:p-8 overflow-x-hidden max-w-[1500px] w-full min-w-0">
        {children}
      </main>
    </div>
  )
}
