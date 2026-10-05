'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Lock,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  ArrowRight,
  Sparkles,
  KeyRound,
  ExternalLink,
} from 'lucide-react'
import { KamaarLogo } from '@/components/brand/KamaarLogo'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@kamaarbeddings.com')
  const [secretKey, setSecretKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const executeLogin = async (targetEmail: string, key: string = '') => {
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, secretKey: key }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Log masuk gagal.')
        setIsLoading(false)
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('Ralat sambungan rangkaian.')
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    await executeLogin(email, secretKey)
  }

  const handleQuickLogin = (roleEmail: string) => {
    setEmail(roleEmail)
    executeLogin(roleEmail, secretKey)
  }

  return (
    <div className="min-h-screen bg-[#0B1E38] text-warmwhite flex items-center justify-center p-4 sm:p-6 relative overflow-x-hidden font-sans">
      {/* Background Royal Sapphire Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#1E4E8C]/60 via-[#B49A58]/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-20 right-5 w-80 h-80 bg-[#2A6DB5]/30 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-md w-full bg-[#13325B]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl shadow-black/60 space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1E4E8C] to-[#2A6DB5] border border-[#B49A58]/40 shadow-lg mb-1">
            <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <KamaarLogo variant="full" size="md" theme="dark" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold block pt-1 font-sans">
            Admin Atelier & Operations Portal
          </span>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-950/70 text-rose-200 text-xs rounded-xl border border-rose-500/40 flex items-center space-x-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span className="font-sans">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1.5 font-sans">
              Emel Rasmi Pentadbir (Staff Email)
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cth: owner@kamaarbeddings.com"
              className="w-full px-4 py-3 text-xs sm:text-sm bg-[#0B1E38]/80 border border-white/15 rounded-xl text-white placeholder-neutral-500 outline-none focus:border-[#B49A58] font-sans font-medium transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5 font-sans">
              <label className="text-xs font-semibold text-neutral-300">
                Kunci Akses / Passkey
              </label>
              <span className="text-[10px] text-[#D4AF37] font-bold">
                (Kosongkan untuk mod demo)
              </span>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Kosongkan atau taip 'kamaar'"
                className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-[#0B1E38]/80 border border-white/15 rounded-xl text-white placeholder-neutral-500 outline-none focus:border-[#B49A58] transition-all font-mono"
              />
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#B49A58] hover:bg-[#c2a660] active:scale-[0.99] text-[#0A192F] text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer min-h-[44px] font-sans"
            >
              <Lock className="w-4 h-4 text-[#0A192F]" />
              <span>{isLoading ? 'Mengesahkan Akses...' : 'Log Masuk ke Papan Pemuka'}</span>
            </button>

            {/* Quick One-Click Owner Login */}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickLogin('admin@kamaarbeddings.com')}
              className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl border border-white/15 transition-all flex items-center justify-center space-x-2 cursor-pointer font-sans"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>⚡ Masuk Segera Sebagai Kamaar Admin (1-Klik)</span>
            </button>
          </div>
        </form>

        {/* Quick Demo Staff Role Profiles (Touch-friendly for mobile) */}
        <div className="pt-3 border-t border-white/10 space-y-2 font-sans">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-neutral-400 uppercase tracking-wider block">
              Pilihan Profil Peranan Pantas:
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold">
              Klik untuk terus log masuk
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickLogin('admin@kamaarbeddings.com')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer min-h-[46px] ${
                email === 'admin@kamaarbeddings.com' || email === 'owner@kamaarbeddings.com'
                  ? 'bg-[#1E4E8C] text-white font-bold border-[#D4AF37] shadow-sm'
                  : 'bg-white/5 text-neutral-200 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="block font-semibold text-white">Kamaar Admin</span>
                <span className="text-[9px] px-1 py-0.2 bg-gold/20 text-[#D4AF37] rounded font-bold">1-Klik</span>
              </div>
              <span className="text-[10px] text-neutral-300 block">Semua Akses (Owner)</span>
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickLogin('catalog@kamaarbeddings.com')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer min-h-[46px] ${
                email === 'catalog@kamaarbeddings.com'
                  ? 'bg-[#1E4E8C] text-white font-bold border-[#D4AF37] shadow-sm'
                  : 'bg-white/5 text-neutral-200 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="block font-semibold text-white">Kamaar Catalog</span>
                <span className="text-[9px] px-1 py-0.2 bg-white/20 text-white rounded font-bold">1-Klik</span>
              </div>
              <span className="text-[10px] text-neutral-300 block">Katalog & Produk</span>
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickLogin('orders@kamaarbeddings.com')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer min-h-[46px] ${
                email === 'orders@kamaarbeddings.com'
                  ? 'bg-[#1E4E8C] text-white font-bold border-[#D4AF37] shadow-sm'
                  : 'bg-white/5 text-neutral-200 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="block font-semibold text-white">Kamaar Orders</span>
                <span className="text-[9px] px-1 py-0.2 bg-white/20 text-white rounded font-bold">1-Klik</span>
              </div>
              <span className="text-[10px] text-neutral-300 block">Pesanan & Resit</span>
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickLogin('editor@kamaarbeddings.com')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer min-h-[46px] ${
                email === 'editor@kamaarbeddings.com'
                  ? 'bg-[#1E4E8C] text-white font-bold border-[#D4AF37] shadow-sm'
                  : 'bg-white/5 text-neutral-200 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="block font-semibold text-white">Kamaar Editor</span>
                <span className="text-[9px] px-1 py-0.2 bg-white/20 text-white rounded font-bold">1-Klik</span>
              </div>
              <span className="text-[10px] text-neutral-300 block">Blog & Showroom</span>
            </button>
          </div>
        </div>

        <div className="pt-2 text-center space-y-1">
          <p className="text-[11px] text-neutral-400">
            Kawasan Pengurusan Khas Atelier &bull; Sesi Dilindungi
          </p>
          <Link
            href="/"
            target="_blank"
            className="text-[11px] text-[#D4AF37] hover:underline inline-flex items-center gap-1 font-semibold pt-1"
          >
            <span>Buka Kedai Awam Dalam Tab Baharu</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
