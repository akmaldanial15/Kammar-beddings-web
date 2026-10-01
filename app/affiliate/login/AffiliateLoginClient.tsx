'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Crown,
  KeyRound,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Mail,
  Phone,
  CheckCircle,
  X,
  RotateCcw,
  Send,
} from 'lucide-react'

export function AffiliateLoginClient() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState('')
  const [passcode, setPasscode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Reset Password Modal State
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [resetIdentifier, setResetIdentifier] = useState('')
  const [resetStep, setResetStep] = useState<'lookup' | 'otp' | 'success'>('lookup')
  const [resetAffiliate, setResetAffiliate] = useState<{
    id: string
    name: string
    code: string
    maskedEmail: string
    maskedPhone: string
  } | null>(null)
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'phone'>('email')
  const [otpInput, setOtpInput] = useState('')
  const [demoOtpCode, setDemoOtpCode] = useState<string | null>(null)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetError, setResetError] = useState('')
  const [resetSuccessMsg, setResetSuccessMsg] = useState('')

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

  // RESET PASSWORD FLOW
  const handleOpenReset = () => {
    setIsResetModalOpen(true)
    setResetIdentifier(identifier || '')
    setResetStep('lookup')
    setResetAffiliate(null)
    setOtpInput('')
    setDemoOtpCode(null)
    setResetError('')
    setResetSuccessMsg('')
  }

  const handleLookupAffiliate = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetError('')
    if (!resetIdentifier.trim()) {
      setResetError('Sila masukkan Kod Affiliate atau Emel berdaftar anda.')
      return
    }

    setResetLoading(true)
    try {
      const res = await fetch('/api/affiliate/reset-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'lookup', identifier: resetIdentifier.trim() }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        setResetError(data.error || 'Akaun ejen tidak ditemui. Sila semak semula.')
        return
      }

      setResetAffiliate(data.affiliate)
    } catch {
      setResetError('Ralat rangkaian. Sila cuba sebentar lagi.')
    } finally {
      setResetLoading(false)
    }
  }

  const handleSendOtp = async () => {
    if (!resetAffiliate) return
    setResetError('')
    setResetLoading(true)

    try {
      const res = await fetch('/api/affiliate/reset-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_otp',
          identifier: resetAffiliate.code,
          method: verificationMethod,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        setResetError(data.error || 'Gagal menghantar kod OTP pengesahan.')
        return
      }

      setDemoOtpCode(data.demoOtp || null)
      setResetStep('otp')
    } catch {
      setResetError('Ralat rangkaian semasa menghantar kod OTP.')
    } finally {
      setResetLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetAffiliate) return
    setResetError('')
    if (!otpInput.trim()) {
      setResetError('Sila masukkan kod OTP 6-digit.')
      return
    }

    setResetLoading(true)
    try {
      const res = await fetch('/api/affiliate/reset-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_otp',
          identifier: resetAffiliate.code,
          otp: otpInput.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        setResetError(data.error || 'Kod OTP tidak sah atau telah tamat tempoh.')
        return
      }

      setResetSuccessMsg(data.message)
      setResetStep('success')
    } catch {
      setResetError('Ralat semasa mengesahkan kod OTP.')
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#071326] text-warmwhite flex flex-col justify-center items-center px-4 py-8 sm:py-12 relative overflow-x-hidden">
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
            <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto leading-relaxed">
              Akses papan pemuka pendapatan komisen, pautan rujukan eksklusif & makluman terus daripada pengurusan.
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#0D1F3C]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 relative">
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
              <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Kata Laluan / Kunci Akses Ejen
                </label>
                <span className="text-[10px] text-[#D4AF37]/90 font-medium">
                  (Default: Kod Affiliate atau Pin Admin)
                </span>
              </div>
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

            {/* Forgot Password Trigger Link */}
            <div className="flex justify-end pt-0.5">
              <button
                type="button"
                onClick={handleOpenReset}
                className="text-[11px] text-[#D4AF37] hover:underline transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Lupa kata laluan? Set semula di sini</span>
              </button>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('AFF-DANIAL', 'kamaar123')}
                className="px-2.5 py-2 text-[11px] bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-left transition-colors cursor-pointer"
              >
                <div className="font-semibold text-neutral-200">Ahmad Danial</div>
                <div className="text-[10px] text-[#D4AF37]">AFF-DANIAL</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('AFF-IZZAH', 'kamaar123')}
                className="px-2.5 py-2 text-[11px] bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-left transition-colors cursor-pointer"
              >
                <div className="font-semibold text-neutral-200">Nurul Izzah</div>
                <div className="text-[10px] text-[#D4AF37]">AFF-IZZAH</div>
              </button>
            </div>
          </div>
        </div>

        {/* Security / Back to store footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-400 px-2">
          <div className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Akses Dilindungi & Disahkan</span>
          </div>
          <Link href="/" className="hover:text-white transition-colors text-[11px] underline">
            Kembali ke Kedai Utama
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RESET PASSWORD / FORGOT PASSWORD VERIFICATION MODAL                       */}
      {/* ========================================================================= */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#071326]/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-[#0D1F3C] border border-[#B49A58]/30 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative text-warmwhite my-auto max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsResetModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-2 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#102A4E] to-[#1e467d] border border-[#B49A58]/40 mx-auto flex items-center justify-center shadow-lg">
                <RotateCcw className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">
                Set Semula Kata Laluan Ejen
              </h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                Pengesahan identiti melalui Emel atau Nombor Telefon diperlukan sebelum kata laluan diset semula.
              </p>
            </div>

            {resetError && (
              <div className="mb-4 p-3 bg-red-950/70 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{resetError}</span>
              </div>
            )}

            {/* STEP 1: LOOKUP ACCOUNT & CHOOSE VERIFICATION CHANNEL */}
            {resetStep === 'lookup' && (
              <div className="space-y-4">
                {!resetAffiliate ? (
                  <form onSubmit={handleLookupAffiliate} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Kod Affiliate atau Emel Berdaftar Anda
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="cth: AFF-DANIAL atau danial@kamaar.my"
                        value={resetIdentifier}
                        onChange={(e) => setResetIdentifier(e.target.value)}
                        className="w-full px-4 py-3 bg-[#071326] border border-white/10 rounded-xl text-xs md:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#B49A58]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="w-full py-3 bg-[#B49A58] hover:bg-[#c2a660] text-[#0A192F] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      {resetLoading ? 'Menyemak Akaun...' : 'Cari Akaun Ejen'}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-[#D4AF37] block">
                        Akaun Ejen Ditemui:
                      </span>
                      <p className="text-base font-bold text-white font-serif">{resetAffiliate.name}</p>
                      <span className="text-xs font-mono text-neutral-400 block">
                        Kod: {resetAffiliate.code}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-2">
                        Pilih Saluran Pengesahan Kod OTP:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => setVerificationMethod('email')}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            verificationMethod === 'email'
                              ? 'bg-[#102A4E] border-[#D4AF37] ring-1 ring-[#D4AF37]'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-2 text-xs font-bold text-white">
                            <Mail className="w-4 h-4 text-[#D4AF37]" />
                            <span>Emel Berdaftar</span>
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-1 font-mono truncate">
                            {resetAffiliate.maskedEmail}
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setVerificationMethod('phone')}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            verificationMethod === 'phone'
                              ? 'bg-[#102A4E] border-[#D4AF37] ring-1 ring-[#D4AF37]'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-2 text-xs font-bold text-white">
                            <Phone className="w-4 h-4 text-[#D4AF37]" />
                            <span>SMS / No Telefon</span>
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-1 font-mono truncate">
                            {resetAffiliate.maskedPhone}
                          </p>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setResetAffiliate(null)}
                        className="w-1/3 py-3 border border-white/10 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={resetLoading}
                        className="w-2/3 py-3 bg-[#B49A58] hover:bg-[#c2a660] text-[#0A192F] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{resetLoading ? 'Menghantar OTP...' : 'Hantar Kod Pengesahan'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: ENTER AND VERIFY OTP */}
            {resetStep === 'otp' && resetAffiliate && (
              <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in">
                {demoOtpCode && (
                  <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-emerald-400 block flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Kod Simulasi OTP (Untuk Percubaan Serta-Merta):
                    </span>
                    <p className="text-white text-sm font-mono tracking-widest font-black">
                      {demoOtpCode}
                    </p>
                    <span className="text-[10px] text-neutral-400 block">
                      Kod 6-digit dihantar ke {verificationMethod === 'email' ? resetAffiliate.maskedEmail : resetAffiliate.maskedPhone}.
                    </span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Masukkan Kod Pengesahan 6-Digit (OTP)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="cth: 123456"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-xl tracking-[0.3em] font-mono py-3 bg-[#071326] border border-white/10 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#B49A58]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setResetStep('lookup')}
                    className="w-1/3 py-3 border border-white/10 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-2/3 py-3 bg-[#B49A58] hover:bg-[#c2a660] text-[#0A192F] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{resetLoading ? 'Mengesahkan...' : 'Sahkan & Hantar Permintaan'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: SUCCESS NOTIFICATION */}
            {resetStep === 'success' && resetAffiliate && (
              <div className="space-y-5 text-center animate-in fade-in py-2">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle className="w-8 h-8" />
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-serif text-lg font-bold text-white">
                    Pengesahan Identiti Berjaya!
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed max-w-sm mx-auto">
                    {resetSuccessMsg ||
                      'Permintaan set semula kata laluan anda telah dihantar secara terus ke papan pemuka Admin Atelier KAMAAR.'}
                  </p>
                </div>

                <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 text-left text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#D4AF37] block">
                    Butiran Ejen:
                  </span>
                  <div className="flex justify-between text-neutral-300">
                    <span>Nama Ejen:</span>
                    <strong className="text-white">{resetAffiliate.name}</strong>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>Kod Rujukan:</span>
                    <strong className="font-mono text-[#D4AF37]">{resetAffiliate.code}</strong>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>Status Permintaan:</span>
                    <span className="text-emerald-400 font-bold">Menunggu Penetapan Admin</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(false)}
                  className="w-full py-3 bg-[#B49A58] hover:bg-[#c2a660] text-[#0A192F] font-bold text-xs rounded-xl transition-all"
                >
                  Selesai & Kembali ke Skrin Log Masuk
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
