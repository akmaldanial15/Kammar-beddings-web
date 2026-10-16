/**
 * Resolves the canonical, publicly accessible application URL for customer-facing redirects
 * (CHIP Payment Gateway, WhatsApp concierge, email links, etc.).
 *
 * CRITICAL FOR VERCEL & MOBILE:
 * Vercel automatically sets process.env.VERCEL_URL to internal deployment domains
 * (e.g. kammar-beddings-web-xxxx.vercel.app or *-git-*.vercel.app).
 * These preview/deployment URLs have "Vercel Authentication / Deployment Protection" enabled,
 * meaning any mobile user or customer who is NOT logged into the developer's Vercel account
 * will be blocked and redirected to `vercel.com/login?next=...`!
 *
 * To prevent this, all customer-facing URLs on Vercel MUST use the public production domain:
 * `https://kammar-beddings-web.vercel.app` (or custom domain).
 */
export function resolvePublicAppUrl(candidateOrigin?: string): string {
  // 1. If explicit client/request origin is provided
  if (candidateOrigin && typeof candidateOrigin === 'string') {
    const trimmed = candidateOrigin.trim().replace(/\/+$/, '')
    // Localhost in development mode
    if (trimmed.includes('localhost') || trimmed.includes('127.0.0.1')) {
      if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
        return trimmed
      }
    } else {
      // If it's any vercel preview/branch/hash deployment URL (*.vercel.app),
      // normalize to the public production domain:
      if (trimmed.includes('.vercel.app')) {
        return 'https://kammar-beddings-web.vercel.app'
      }
      return trimmed
    }
  }

  // 2. Next, check NEXT_PUBLIC_APP_URL
  const envAppUrl = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/+$/, '')
  if (envAppUrl) {
    if (envAppUrl.includes('localhost') || envAppUrl.includes('127.0.0.1')) {
      if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
        return envAppUrl
      }
    } else {
      if (envAppUrl.includes('.vercel.app')) {
        return 'https://kammar-beddings-web.vercel.app'
      }
      return envAppUrl
    }
  }

  // 3. Vercel production project domain (if set by Vercel)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`.replace(/\/+$/, '')
  }

  // 4. Default for Vercel / Production deployment
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    return 'https://kammar-beddings-web.vercel.app'
  }

  // 5. Default local development fallback
  return 'http://localhost:3000'
}
