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
      type="button"
      onClick={handleLogout}
      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-rose-300/80 hover:text-rose-100 hover:bg-rose-500/15 border border-transparent hover:border-rose-500/25 transition-all text-xs font-semibold cursor-pointer group"
    >
      <span className="flex items-center space-x-2">
        <LogOut className="w-3.5 h-3.5 text-rose-400 group-hover:-translate-x-0.5 transition-transform" />
        <span>Log Keluar (Sign Out)</span>
      </span>
      <span className="text-[10px] text-rose-300/50 group-hover:text-rose-200 uppercase font-mono tracking-wider">
        Keluar
      </span>
    </button>
  )
}
