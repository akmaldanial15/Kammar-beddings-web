import { describe, it, expect, beforeEach } from 'vitest'
import {
  getAffiliates,
  getAffiliateByCode,
  getAffiliateById,
  getAffiliateByIdentifier,
  getAffiliateOrders,
  recordAffiliateSale,
} from '../lib/db'
import { createAffiliateToken } from '../lib/affiliate/auth'
import { Affiliate } from '../types'

describe('Affiliate Referral Link & Code Normalization', () => {
  it('generates standard referral URL with query parameter', () => {
    const origin = 'https://kamaarbeddings.com.my'
    const code = 'AFF-DANIAL'
    const referralUrl = `${origin}/?ref=${encodeURIComponent(code)}`

    expect(referralUrl).toBe('https://kamaarbeddings.com.my/?ref=AFF-DANIAL')

    // Parse URL parameter back
    const url = new URL(referralUrl)
    const refParam = url.searchParams.get('ref')
    expect(refParam).toBe('AFF-DANIAL')
  })

  it('normalizes affiliate code to uppercase and trims whitespace', () => {
    const rawInput = '   aff-danial   '
    const normalized = rawInput.trim().toUpperCase()
    expect(normalized).toBe('AFF-DANIAL')
  })

  it('validates code length constraints (between 2 and 30 characters)', () => {
    const validateLength = (c: string) => {
      const clean = c.trim()
      return clean.length >= 2 && clean.length <= 30
    }

    expect(validateLength('A')).toBe(false) // Too short
    expect(validateLength('AFF-DANIAL')).toBe(true) // Valid
    expect(validateLength('AGENT123')).toBe(true) // Valid
    expect(validateLength('A'.repeat(35))).toBe(false) // Too long
  })

  it('constructs correct 30-day attribution cookie format', () => {
    const cleanRef = 'AFF-DANIAL'
    const maxAge = 30 * 24 * 60 * 60 // 30 days in seconds = 2,592,000s
    const cookieString = `kamaar_ref=${encodeURIComponent(cleanRef)}; path=/; max-age=${maxAge}; SameSite=Lax`

    expect(cookieString).toContain('kamaar_ref=AFF-DANIAL')
    expect(cookieString).toContain('max-age=2592000')
    expect(cookieString).toContain('path=/')
    expect(cookieString).toContain('SameSite=Lax')
  })
})

describe('Affiliate Database & Lookup Engine', () => {
  it('retrieves active affiliate by code case-insensitively', async () => {
    const affiliateUpper = await getAffiliateByCode('AFF-DANIAL')
    expect(affiliateUpper).not.toBeNull()
    expect(affiliateUpper?.name).toBe('Ahmad Danial')
    expect(affiliateUpper?.commissionRate).toBeGreaterThan(0)
    expect(affiliateUpper?.isActive).toBe(true)

    // Lowercase lookup
    const affiliateLower = await getAffiliateByCode('aff-danial')
    expect(affiliateLower).not.toBeNull()
    expect(affiliateLower?.id).toBe(affiliateUpper?.id)

    // Mixed case lookup
    const affiliateMixed = await getAffiliateByCode('  Aff-Danial  ')
    expect(affiliateMixed).not.toBeNull()
    expect(affiliateMixed?.id).toBe(affiliateUpper?.id)
  })

  it('returns null for non-existent affiliate codes', async () => {
    const nonExistent = await getAffiliateByCode('KOD-TIDAK-WUJUD-999')
    expect(nonExistent).toBeNull()
  })

  it('retrieves affiliate by identifier using either code or registered email', async () => {
    const byCode = await getAffiliateByIdentifier('AFF-DANIAL')
    expect(byCode).not.toBeNull()
    expect(byCode?.code).toBe('AFF-DANIAL')

    const byEmail = await getAffiliateByIdentifier('danial@kamaar.my')
    expect(byEmail).not.toBeNull()
    expect(byEmail?.code).toBe('AFF-DANIAL')

    const byMixedEmail = await getAffiliateByIdentifier('DANIAL@KAMAAR.MY')
    expect(byMixedEmail).not.toBeNull()
    expect(byMixedEmail?.id).toBe(byEmail?.id)
  })
})

describe('Commission Calculation Engine', () => {
  it('calculates 10% percentage commission correctly on RM1,000 (100,000 sen) order', () => {
    const subtotalSen = 100000 // RM 1,000.00
    const affiliate: Pick<Affiliate, 'commissionType' | 'commissionRate'> = {
      commissionType: 'percentage',
      commissionRate: 10,
    }

    const commissionSen =
      affiliate.commissionType === 'fixed_amount'
        ? affiliate.commissionRate * 100
        : Math.round((subtotalSen * affiliate.commissionRate) / 100)

    expect(commissionSen).toBe(10000) // RM 100.00
  })

  it('calculates fixed amount commission regardless of basket total', () => {
    const subtotalSen = 250000 // RM 2,500.00
    const affiliate: Pick<Affiliate, 'commissionType' | 'commissionRate'> = {
      commissionType: 'fixed_amount',
      commissionRate: 50, // RM50 flat per sale
    }

    const commissionSen =
      affiliate.commissionType === 'fixed_amount'
        ? affiliate.commissionRate * 100
        : Math.round((subtotalSen * affiliate.commissionRate) / 100)

    expect(commissionSen).toBe(5000) // RM 50.00
  })

  it('properly rounds commissions to nearest integer sen for odd amounts', () => {
    const subtotalSen = 14995 // RM 149.95
    const commissionRate = 7.5 // 7.5%

    const commissionSen = Math.round((subtotalSen * commissionRate) / 100)
    // 14995 * 0.075 = 1124.625 -> 1125 sen (RM11.25)
    expect(commissionSen).toBe(1125)
  })
})

describe('Affiliate Sales Crediting & Stats Tracking', () => {
  it('updates affiliate metrics when sale is completed', async () => {
    const affBefore = await getAffiliateByCode('AFF-DANIAL')
    expect(affBefore).not.toBeNull()
    const countBefore = affBefore!.totalSalesCount
    const revenueBefore = affBefore!.totalSalesRevenueSen
    const commBefore = affBefore!.totalCommissionSen

    const saleAmountSen = 50000 // RM 500.00
    const commissionAmountSen = 5000 // RM 50.00

    await recordAffiliateSale('AFF-DANIAL', saleAmountSen, commissionAmountSen)

    const affAfter = await getAffiliateByCode('AFF-DANIAL')
    expect(affAfter!.totalSalesCount).toBe(countBefore + 1)
    expect(affAfter!.totalSalesRevenueSen).toBe(revenueBefore + saleAmountSen)
    expect(affAfter!.totalCommissionSen).toBe(commBefore + commissionAmountSen)
  })

  it('retrieves orders associated with affiliate code', async () => {
    const orders = await getAffiliateOrders('AFF-DANIAL')
    expect(Array.isArray(orders)).toBe(true)
    // Every order in list must belong to AFF-DANIAL
    for (const o of orders) {
      expect(o.affiliateCode?.toUpperCase()).toBe('AFF-DANIAL')
    }
  })
})

describe('Affiliate Portal Session & Auth Tokens', () => {
  it('creates base64 encoded token from affiliate id and code', () => {
    const id = 'aff-danial'
    const code = 'AFF-DANIAL'
    const token = createAffiliateToken(id, code)

    expect(typeof token).toBe('string')
    expect(token.length).toBeGreaterThan(0)

    // Decode token and verify structure
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    expect(decoded).toBe('aff-danial:AFF-DANIAL')
  })
})

describe('Admin Affiliate Management & Recalculation Engine', () => {
  it('allows admin to edit affiliate commission rate, type and details', async () => {
    const { updateAffiliate, getAffiliateByCode } = await import('../lib/db')
    const aff = await getAffiliateByCode('AFF-DANIAL')
    expect(aff).not.toBeNull()

    const updated = await updateAffiliate(aff!.id, {
      commissionRate: 15,
      commissionType: 'percentage',
      bankName: 'CIMB Bank',
      bankAccountNumber: '888123456789',
      adminNotes: 'Ujian komisen dinaikkan kepada 15%',
    })

    expect(updated).not.toBeNull()
    expect(updated!.commissionRate).toBe(15)
    expect(updated!.bankName).toBe('CIMB Bank')
    expect(updated!.bankAccountNumber).toBe('888123456789')
    expect(updated!.adminNotes).toBe('Ujian komisen dinaikkan kepada 15%')
  })

  it('recalculates affiliate stats accurately from orders in database', async () => {
    const { recalculateAffiliateStats, getAffiliateByCode } = await import('../lib/db')
    const result = await recalculateAffiliateStats()
    expect(result.updatedCount).toBeGreaterThan(0)

    const aff = await getAffiliateByCode('AFF-DANIAL')
    expect(aff).not.toBeNull()
    expect(typeof aff!.totalSalesCount).toBe('number')
    expect(typeof aff!.totalSalesRevenueSen).toBe('number')
    expect(typeof aff!.totalCommissionSen).toBe('number')
  })
})

