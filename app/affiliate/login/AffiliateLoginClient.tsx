'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Crown, KeyRound, User, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react'

export function AffiliateLoginClient() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState('')
  const [passcode, setPasscode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/affiliate/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, passcode }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || 'Log masuk gagal. Sila semak kod atau kata laluan anda.')
        return
      }

      router.push('/affiliate')
      router.refresh()
    } catch (err) {
      setErrorMessage('Ralat sambungan pelayan. Sila cuba sebentar lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickDemo = (code: string, pass: string) => {
    setIdentifier(code)
    setPasscode(pass)
    setErrorMessage('')
  }

  return (
    <div className="min-h-screen bg-[#071326] text-warmwhite flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient royal glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-[#102A4E]/60 via-[#B49A58]/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-24 right-10 w-96 h-96 bg-[#163660]/40 blur-3xl pointer-events-none rounded-full" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#102A4E] to-[#1e467d] border border-[#B49A58]/40 shadow-xl shadow-black/40">
            <Crown className="w-7 h-7 text-[#D4AF37]" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] block">
              KAMAAR BEDDINGS MALAYSIA
            </span>
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-white mt-1">
              Portal Rakan Ejen Affiliate
            </h1>
            <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
              Akses papan pemuka pendapatan komisen, pautan rujukan eksklusif & makluman terus daripada pengurusan.
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#0D1F3C]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 relative">
          <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-[#B49A58] to-[#D4AF37] text-[#071326] text-[10px] font-black rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
            <Sparkles className="w-3 h-3" /> Ejen Rasmi
          </div>

          {errorMessage && (
            <div className="mb-6 p-3.5 bg-red-950/70 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Kod Affiliate atau Emel Berdaftar
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="cth: AFF-DANIAL atau danial@kamaar.my"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#071326]/70 border border-white/10 rounded-xl text-xs md:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#B49A58] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
                <span>Kata Laluan / Kunci Akses Ejen</span>
                <span className="text-[10px] text-neutral-400 font-normal">
                  (Default: Kod Affiliate atau Pin Admin)
                </span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Masukkan kata laluan / passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#071326]/70 border border-white/10 rounded-xl text-xs md:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#B49A58] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#B49A58] via-[#C9AE66] to-[#B49A58] hover:from-[#c2a660] hover:to-[#c2a660] text-[#0A192F] font-bold text-xs md:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#B49A58]/20 transition-all transform active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-[#0A192F] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Masuk Ke Papan Pemuka Ejen</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo quick fill presets for fast testing */}
          <div className="mt-6 pt-5 border-t border-white/5 space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
              Log Masuk Percubaan (Akaun Demo Ejen):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('AFF-DANIAL', 'kamaar123')}
                className="px-2.5 py-1.5 text-[11px] bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-left transition-colors"
              >
                <div className="font-semibold text-neutral-200">Ahmad Danial</div>
                <div className="text-[10px] text-[#D4AF37]">AFF-DANIAL</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('AFF-IZZAH', 'kamaar123')}
                className="px-2.5 py-1.5 text-[11px] bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-left transition-colors"
              >
                <div className="font-semibold text-neutral-200">Nurul Izzah</div>
                <div className="text-[10px] text-[#D4AF37]">AFF-IZZAH</div>
              </button>
            </div>
          </div>
        </div>

        {/* Security / Back to store footer */}
        <div className="flex items-center justify-between text-xs text-neutral-400 px-2">
          <div className="flex items-center gap-1 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Akses Dilindungi & Disahkan</span>
          </div>
          <Link href="/" className="hover:text-white transition-colors text-[11px] underline">
            Kembali ke Kedai Utama
          </Link>
        </div>
      </div>
    </div>
  )
}
