'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, UserCheck, ChevronUp, ChevronDown, Sparkles, X, Minimize2 } from 'lucide-react'

interface AffiliateInfo {
  code: string
  name: string
  commissionRate?: number
}

function ReferralHandler() {
  const searchParams = useSearchParams()
  const [activeAffiliate, setActiveAffiliate] = useState<AffiliateInfo | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  // Initialize and synchronize referral strictly per browser tab session
  useEffect(() => {
    try {
      // 1. Check if referral query exists in current URL (e.g. ?ref=AFF-DANIAL or ?aff=AFF-DANIAL)
      const urlRef = searchParams?.get('ref') || searchParams?.get('aff')
      const cleanUrlRef = urlRef?.trim().toUpperCase()

      // Immediately purge any legacy 30-day persistent cookies or localStorage from previous visits
      try {
        localStorage.removeItem('kamaar_ref')
        localStorage.removeItem('kamaar_ref_name')
        document.cookie = 'kamaar_ref=; path=/; max-age=0; SameSite=Lax'
        document.cookie = 'kamaar_ref_name=; path=/; max-age=0; SameSite=Lax'
      } catch (_) {}

      let codeToUse: string | null = null

      if (cleanUrlRef && cleanUrlRef.length >= 2 && cleanUrlRef.length <= 30) {
        // User arrived explicitly via an affiliate link in this tab
        codeToUse = cleanUrlRef
        sessionStorage.setItem('kamaar_session_ref', codeToUse)
        try {
          sessionStorage.removeItem('kamaar_session_badge_hidden')
        } catch (_) {}
        setIsDismissed(false)
      } else {
        // Normal URL (no ?ref= in URL):
        // Only retain affiliate if THIS SPECIFIC TAB already had an active session!
        // In a new tab, sessionStorage is completely empty, so no affiliate is detected.
        const tabSession = sessionStorage.getItem('kamaar_session_ref')
        if (tabSession) {
          codeToUse = tabSession.trim().toUpperCase()
          try {
            if (sessionStorage.getItem('kamaar_session_badge_hidden') === 'true') {
              setIsDismissed(true)
            }
          } catch (_) {}
        } else {
          setActiveAffiliate(null)
          return
        }
      }

      if (codeToUse) {
        const cachedName = sessionStorage.getItem('kamaar_session_ref_name')
        if (cachedName) {
          setActiveAffiliate({ code: codeToUse, name: cachedName })
        } else {
          setActiveAffiliate({ code: codeToUse, name: codeToUse })
        }

        // Fetch authoritative agent name from server
        fetch(`/api/affiliate/info?code=${encodeURIComponent(codeToUse)}`)
          .then((r) => r.json())
          .then((data) => {
            if (data.isValid && data.name) {
              setActiveAffiliate({
                code: data.code,
                name: data.name,
                commissionRate: data.commissionRate,
              })
              try {
                sessionStorage.setItem('kamaar_session_ref', data.code)
                sessionStorage.setItem('kamaar_session_ref_name', data.name)
              } catch (_) {}
            } else {
              // Invalid code: clear session
              sessionStorage.removeItem('kamaar_session_ref')
              sessionStorage.removeItem('kamaar_session_ref_name')
              setActiveAffiliate(null)
            }
          })
          .catch(() => {})
      }
    } catch (_) {}
  }, [searchParams])

  const handleDismiss = () => {
    // Sembunyikan paparan terapung (UI) sahaja untuk tab ini agar tidak menghalang skrin,
    // TETAPI KEKALKAN rujukan affiliate dalam session supaya komisen/earnings ejen TIDAK HILANG!
    try {
      sessionStorage.setItem('kamaar_session_badge_hidden', 'true')
    } catch (_) {}
    setIsDismissed(true)
  }

  if (!activeAffiliate || isDismissed) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 print:hidden transition-all duration-300">
      {/* =========================================================================
          1. PHONE / MOBILE VIEW (< sm): Sleek Minimized Floating Icon
         ========================================================================= */}
      <div className="block sm:hidden">
        {!isMobileOpen ? (
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="relative w-11 h-11 rounded-full bg-[#13325B] text-white border border-[#B49A58]/60 shadow-xl shadow-black/50 flex items-center justify-center transition-all active:scale-95 hover:scale-105 cursor-pointer backdrop-blur-md"
            aria-label={`Rujukan Ejen: ${activeAffiliate.name}`}
            title={`Rujukan Ejen: ${activeAffiliate.name} (${activeAffiliate.code}) - Klik untuk maklumat`}
          >
            {/* Live Pulsing Dot */}
            <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-[#13325B]"></span>
            </span>
            <UserCheck className="w-5 h-5 text-[#D4AF37]" />
          </button>
        ) : (
          <div className="bg-[#13325B] text-white rounded-2xl shadow-2xl border border-white/15 backdrop-blur-md p-3 max-w-[280px] animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                <span className="text-[11px] font-semibold text-white/80">Rujukan:</span>
                <span className="text-xs text-[#B49A58] font-bold truncate">
                  {activeAffiliate.name}
                </span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsMobileOpen(false)}
                  className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10"
                  title="Kecilkan ke ikon semula"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/10"
                  title="Tutup paparan rujukan (komisen ejen tetap aktif)"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="pt-2 text-[10.5px] text-white/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-medium text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Sesi Aktif
                </span>
                <span className="font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/90">
                  {activeAffiliate.code}
                </span>
              </div>
              <p className="text-[10px] text-white/60 leading-tight">
                Pembelian anda dalam sesi ini dikreditkan terus kepada rakan niaga ini.
              </p>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="w-full mt-1 py-1.5 text-center text-[10px] font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
              >
                Kecilkan ke Ikon
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          2. DESKTOP VIEW (>= sm): Full Floating Pill
         ========================================================================= */}
      <div className="hidden sm:block">
        <div className="bg-[#13325B] text-white rounded-2xl shadow-2xl border border-white/15 backdrop-blur-md overflow-hidden max-w-sm sm:max-w-md">
          {/* Pill / Header Bar */}
          <div className="flex items-center justify-between px-3.5 py-2.5 gap-2.5">
            <div
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 cursor-pointer select-none group"
              title="Klik untuk melihat maklumat rujukan ejen rasmi"
            >
              <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>

              <div className="flex items-center gap-1.5 text-xs font-semibold leading-tight">
                <span className="text-white/80">Rujukan Ejen:</span>
                <span className="text-[#B49A58] font-bold group-hover:underline">
                  {activeAffiliate.name}
                </span>
                <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded font-mono font-bold tracking-wider text-white/90">
                  {activeAffiliate.code}
                </span>
              </div>

              <button
                type="button"
                className="text-white/60 hover:text-white transition-colors ml-0.5"
                aria-label={isExpanded ? 'Tutup maklumat' : 'Buka maklumat'}
              >
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              className="text-white/40 hover:text-white transition-colors p-1 -mr-1 rounded-full hover:bg-white/10"
              title="Tutup paparan badge (rujukan komisen tetap aktif)"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Expanded Info Drawer */}
          {isExpanded && (
            <div className="px-4 pb-3.5 pt-1 text-xs border-t border-white/10 space-y-2 bg-[#0E2442]/90">
              <div className="flex items-start gap-2 text-white/90">
                <Sparkles className="w-4 h-4 text-[#B49A58] flex-shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Anda kini sedang membeli-belah melalui pautan rujukan khas rakan niaga{' '}
                  <strong className="text-white font-bold">{activeAffiliate.name}</strong>. Semua pembelian anda dalam sesi ini dikreditkan secara automatik kepada ejen.
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 text-[10px] text-white/70">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  Penjejakan Sesi Aktif
                </span>
                <span className="font-mono text-white/50">Kod: {activeAffiliate.code}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function AffiliateTracker() {
  return (
    <Suspense fallback={null}>
      <ReferralHandler />
    </Suspense>
  )
}
