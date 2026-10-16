import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { resolvePublicAppUrl } from '@/lib/utils/url'

describe('resolvePublicAppUrl - Mobile & Vercel Redirects', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    process.env = { ...originalEnv }
    delete process.env.VERCEL
    delete process.env.VERCEL_URL
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL
    delete process.env.NEXT_PUBLIC_APP_URL
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('normalizes Vercel preview/branch URLs to public production domain', () => {
    const previewUrl = 'https://kammar-beddings-web-git-main-akmaldanials-projects.vercel.app'
    const result = resolvePublicAppUrl(previewUrl)
    expect(result).toBe('https://kammar-beddings-web.vercel.app')
  })

  it('preserves public production domain when accessed directly on mobile', () => {
    const mobileOrigin = 'https://kammar-beddings-web.vercel.app'
    const result = resolvePublicAppUrl(mobileOrigin)
    expect(result).toBe('https://kammar-beddings-web.vercel.app')
  })

  it('normalizes preview hash deployment URLs to prevent Vercel login wall', () => {
    const hashDeploymentUrl = 'https://kammar-beddings-web-3q8fn29sa.vercel.app'
    const result = resolvePublicAppUrl(hashDeploymentUrl)
    expect(result).toBe('https://kammar-beddings-web.vercel.app')
  })

  it('uses canonical production domain in production when no origin is provided', () => {
    process.env.NODE_ENV = 'production'
    const result = resolvePublicAppUrl()
    expect(result).toBe('https://kammar-beddings-web.vercel.app')
  })

  it('respects localhost during local development', () => {
    process.env.NODE_ENV = 'development'
    const result = resolvePublicAppUrl('http://localhost:3000')
    expect(result).toBe('http://localhost:3000')
  })

  it('allows custom domain when configured', () => {
    const customDomain = 'https://kamaarbeddings.com.my'
    const result = resolvePublicAppUrl(customDomain)
    expect(result).toBe('https://kamaarbeddings.com.my')
  })
})
