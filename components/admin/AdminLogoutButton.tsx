'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export function AdminLogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sale hover:bg-sale/10 transition-colors font-semibold"
    >
      <LogOut className="w-4 h-4" />
      <span>Sign Out</span>
    </button>
  )
}
