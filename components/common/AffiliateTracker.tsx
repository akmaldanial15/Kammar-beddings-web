'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function ReferralHandler() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!searchParams) return

    const ref = searchParams.get('ref') || searchParams.get('aff')
    if (ref) {
      const cleanRef = ref.trim().toUpperCase()
      if (cleanRef.length >= 2 && cleanRef.length <= 30) {
        try {
          // Store in LocalStorage for persistence across tabs
          localStorage.setItem('kamaar_ref', cleanRef)
          localStorage.setItem('kamaar_ref_timestamp', Date.now().toString())

          // Also set 30-day attribution cookie accessible by both client & server
          const maxAge = 30 * 24 * 60 * 60 // 30 days in seconds
          document.cookie = `kamaar_ref=${encodeURIComponent(cleanRef)}; path=/; max-age=${maxAge}; SameSite=Lax`
        } catch (err) {
          // Ignore storage restrictions if private mode
        }
      }
    }
  }, [searchParams])

  return null
}

export function AffiliateTracker() {
  return (
    <Suspense fallback={null}>
      <ReferralHandler />
    </Suspense>
  )
}
