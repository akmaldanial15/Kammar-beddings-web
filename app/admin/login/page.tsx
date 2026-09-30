'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, ShieldCheck, UserCheck, AlertCircle, ArrowRight } from 'lucide-react'
import { KamaarLogo } from '@/components/brand/KamaarLogo'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('owner@lenasleep.com.my')
  const [secretKey, setSecretKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, secretKey }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        setIsLoading(false)
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('Network connection error.')
      setIsLoading(false)
    }
  }

  const handleQuickSelect = (roleEmail: string) => {
    setEmail(roleEmail)
    setError('')
  }

  return (
    <div className="min-h-screen bg-forest-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-warmwhite rounded-3xl p-8 border border-borderLight shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <KamaarLogo variant="full" size="lg" theme="light" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold-dark font-bold block pt-1">
            Administrative Operations & Atelier Portal
          </span>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-sale text-xs rounded-xl border border-red-200 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-charcoal block mb-1">
              Authorized Staff Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. owner@lenasleep.com.my"
              className="w-full px-3.5 py-2.5 text-xs bg-cream-light border border-borderLight rounded-xl outline-none focus:border-gold font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-charcoal block mb-1">
              Security Passkey / Secret
            </label>
            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter master bootstrap passkey or leave blank for demo"
              className="w-full px-3.5 py-2.5 text-xs bg-cream-light border border-borderLight rounded-xl outline-none focus:border-gold"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-forest hover:bg-forest/90 text-warmwhite text-xs font-bold uppercase tracking-wider rounded-xl shadow-card transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Lock className="w-4 h-4 text-gold" />
            <span>{isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
          </button>
        </form>

        {/* Demo Fast Account Selector */}
        <div className="pt-4 border-t border-borderLight space-y-2">
          <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block">
            Quick Demo Staff Role Profiles:
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickSelect('owner@lenasleep.com.my')}
              className={`p-2 rounded-lg border text-left transition-colors ${
                email === 'owner@lenasleep.com.my'
                  ? 'bg-forest text-warmwhite font-bold border-forest'
                  : 'bg-cream text-charcoal border-borderLight hover:border-gold'
              }`}
            >
              <span className="block font-semibold">Owner</span>
              <span className="text-[10px] opacity-80">Full permissions</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickSelect('catalog@lenasleep.com.my')}
              className={`p-2 rounded-lg border text-left transition-colors ${
                email === 'catalog@lenasleep.com.my'
                  ? 'bg-forest text-warmwhite font-bold border-forest'
                  : 'bg-cream text-charcoal border-borderLight hover:border-gold'
              }`}
            >
              <span className="block font-semibold">Catalog Manager</span>
              <span className="text-[10px] opacity-80">Products & variants</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickSelect('orders@lenasleep.com.my')}
              className={`p-2 rounded-lg border text-left transition-colors ${
                email === 'orders@lenasleep.com.my'
                  ? 'bg-forest text-warmwhite font-bold border-forest'
                  : 'bg-cream text-charcoal border-borderLight hover:border-gold'
              }`}
            >
              <span className="block font-semibold">Order Manager</span>
              <span className="text-[10px] opacity-80">Fulfilment & tracking</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickSelect('editor@lenasleep.com.my')}
              className={`p-2 rounded-lg border text-left transition-colors ${
                email === 'editor@lenasleep.com.my'
                  ? 'bg-forest text-warmwhite font-bold border-forest'
                  : 'bg-cream text-charcoal border-borderLight hover:border-gold'
              }`}
            >
              <span className="block font-semibold">Content Editor</span>
              <span className="text-[10px] opacity-80">Blog & showroom</span>
            </button>
          </div>
        </div>

        <div className="pt-2 text-center">
          <Link href="/" className="text-xs text-charcoal-muted hover:text-forest underline">
            &larr; Return to Public Storefront
          </Link>
        </div>
      </div>
    </div>
  )
}
