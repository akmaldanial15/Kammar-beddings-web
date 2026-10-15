'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, UserCheck, ChevronUp, ChevronDown, Sparkles, X } from 'lucide-react'

interface AffiliateInfo {
  code: string
  name: string
  commissionRate?: number
}

function ReferralHandler() {
  const searchParams = useSearchParams()
  const [activeAffiliate, setActiveAffiliate] = useState<AffiliateInfo | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  // Initialize and synchronize referral across URL, LocalStorage, SessionStorage & Cookies
  useEffect(() => {
    try {
      const urlRef = searchParams?.get('ref') || searchParams?.get('aff')
      let codeToUse = urlRef ? urlRef.trim().toUpperCase() : null

      if (codeToUse && codeToUse.length >= 2 && codeToUse.length <= 30) {
        localStorage.setItem('kamaar_ref', codeToUse)
        sessionStorage.setItem('kamaar_ref', codeToUse)
        const maxAge = 30 * 24 * 60 * 60 // 30 days
        document.cookie = `kamaar_ref=${encodeURIComponent(codeToUse)}; path=/; max-age=${maxAge}; SameSite=Lax`
      } else {
        const stored = localStorage.getItem('kamaar_ref') || sessionStorage.getItem('kamaar_ref')
        if (stored) {
          codeToUse = stored.trim().toUpperCase()
        } else {
          const match = document.cookie.match(/(?:^|;\s*)kamaar_ref=([^;]+)/)
          if (match && match[1]) {
            codeToUse = decodeURIComponent(match[1]).trim().toUpperCase()
          }
        }
      }

      if (codeToUse) {
        // Cached name in localStorage
        const cachedName = localStorage.getItem(`kamaar_ref_name_${codeToUse}`)
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
                localStorage.setItem(`kamaar_ref_name_${data.code}`, data.name)
                sessionStorage.setItem('kamaar_ref_name', data.name)
                document.cookie = `kamaar_ref_name=${encodeURIComponent(data.name)}; path=/; max-age=2592000; SameSite=Lax`
              } catch (_) {}
            }
          })
          .catch(() => {})
      }
    } catch (_) {}
  }, [searchParams])

  if (!activeAffiliate || isDismissed) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 print:hidden transition-all duration-300">
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
              <span className="text-white/80 hidden xs:inline">Rujukan Ejen:</span>
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
            onClick={() => setIsDismissed(true)}
            className="text-white/40 hover:text-white transition-colors p-1 -mr-1 rounded-full hover:bg-white/10"
            title="Sorokkan notis ini"
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
  )
}

export function AffiliateTracker() {
  return (
    <Suspense fallback={null}>
      <ReferralHandler />
    </Suspense>
  )
}
