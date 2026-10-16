import { QuantityTier, Coupon } from '@/types'

export interface TierPriceCalculation {
  totalSen: number
  unitPriceSen: number
  regularTotalSen: number
  savingsSen: number
  savingsPercent: number
  appliedTier?: QuantityTier
  isTierApplied: boolean
}

/**
 * Calculates tiered / quantity-based bundle pricing.
 * e.g. Base: RM10 (1000 sen). Tier: 3 units for RM20 (2000 sen).
 * If quantity = 3 -> total = 2000 sen (RM20.00), savings = 1000 sen (RM10.00, 33% off)
 * If quantity = 6 -> total = 4000 sen (RM40.00), savings = 2000 sen
 * If quantity = 4 -> total = 2000 + 1000 = 3000 sen (RM30.00), savings = 1000 sen
 */
export function calculateTieredPrice(
  basePriceSen: number,
  quantity: number,
  quantityTiers?: QuantityTier[]
): TierPriceCalculation {
  const regularTotalSen = Math.max(0, basePriceSen * quantity)

  if (!quantityTiers || quantityTiers.length === 0 || quantity <= 0) {
    return {
      totalSen: regularTotalSen,
      unitPriceSen: basePriceSen,
      regularTotalSen,
      savingsSen: 0,
      savingsPercent: 0,
      isTierApplied: false,
    }
  }

  // Valid tiers: quantity > 1 and priceSen > 0
  const validTiers = [...quantityTiers]
    .filter((t) => t.quantity > 1 && t.priceSen > 0)
    .sort((a, b) => b.quantity - a.quantity)

  if (validTiers.length === 0) {
    return {
      totalSen: regularTotalSen,
      unitPriceSen: basePriceSen,
      regularTotalSen,
      savingsSen: 0,
      savingsPercent: 0,
      isTierApplied: false,
    }
  }

  let remaining = quantity
  let totalSen = 0
  let primaryTier: QuantityTier | undefined

  for (const tier of validTiers) {
    if (remaining >= tier.quantity) {
      const bundles = Math.floor(remaining / tier.quantity)
      totalSen += bundles * tier.priceSen
      remaining -= bundles * tier.quantity
      if (!primaryTier) primaryTier = tier
    }
  }

  // Any remaining single units at regular base price
  totalSen += remaining * basePriceSen

  // Guard against any misconfigured tier costing more than regular
  if (totalSen >= regularTotalSen) {
    return {
      totalSen: regularTotalSen,
      unitPriceSen: basePriceSen,
      regularTotalSen,
      savingsSen: 0,
      savingsPercent: 0,
      isTierApplied: false,
    }
  }

  const savingsSen = regularTotalSen - totalSen
  const savingsPercent = Math.round((savingsSen / regularTotalSen) * 100)
  const unitPriceSen = Math.round(totalSen / quantity)

  return {
    totalSen,
    unitPriceSen,
    regularTotalSen,
    savingsSen,
    savingsPercent,
    appliedTier: primaryTier,
    isTierApplied: true,
  }
}

export interface BestVoucherResult {
  bestCoupon: Coupon | null
  savingsSen: number
  reason: string
  allEligible: {
    coupon: Coupon
    calculatedSavingsSen: number
  }[]
}

/**
 * Smart Algorithm to detect and select the best voucher for a given cart.
 * Considers subtotal, active status, expiration, usage limits, minimum spend,
 * and actual net Ringgit savings (handling fixed amount, percentage, and free shipping).
 */
export function findBestVoucherForCart({
  subtotalSen,
  shippingSen = 1500,
  isPickup = false,
  coupons,
  nowIso = new Date().toISOString(),
}: {
  subtotalSen: number
  shippingSen?: number
  isPickup?: boolean
  coupons: Coupon[]
  nowIso?: string
}): BestVoucherResult {
  if (!coupons || coupons.length === 0 || subtotalSen <= 0) {
    return {
      bestCoupon: null,
      savingsSen: 0,
      reason: 'Tiada baucar atau troli kosong',
      allEligible: [],
    }
  }

  const eligibleCandidates: { coupon: Coupon; calculatedSavingsSen: number }[] = []

  for (const c of coupons) {
    if (!c.isActive) continue
    if (c.startsAt && nowIso < c.startsAt) continue
    if (c.endsAt && nowIso > c.endsAt) continue
    if (c.usageLimit && c.usageCount >= c.usageLimit) continue
    if (c.minSpendSen && subtotalSen < c.minSpendSen) continue

    let savings = 0
    if (c.discountType === 'percentage') {
      savings = Math.round((subtotalSen * c.discountValue) / 100)
      if (c.maxDiscountSen && savings > c.maxDiscountSen) {
        savings = c.maxDiscountSen
      }
    } else if (c.discountType === 'fixed_amount') {
      savings = Math.min(c.discountValue, subtotalSen)
    } else if (c.discountType === 'free_shipping') {
      savings = isPickup ? 0 : Math.max(0, shippingSen)
    }

    if (savings > 0) {
      eligibleCandidates.push({ coupon: c, calculatedSavingsSen: savings })
    }
  }

  if (eligibleCandidates.length === 0) {
    return {
      bestCoupon: null,
      savingsSen: 0,
      reason: 'Tiada baucar yang layak untuk nilai pesanan semasa',
      allEligible: [],
    }
  }

  // Sort by highest savings first.
  // Tie-breaker: lowest minimum spend (more generous to customer), then fixed discount precedence.
  eligibleCandidates.sort((a, b) => {
    if (b.calculatedSavingsSen !== a.calculatedSavingsSen) {
      return b.calculatedSavingsSen - a.calculatedSavingsSen
    }
    const minA = a.coupon.minSpendSen || 0
    const minB = b.coupon.minSpendSen || 0
    return minA - minB
  })

  const best = eligibleCandidates[0]

  return {
    bestCoupon: best.coupon,
    savingsSen: best.calculatedSavingsSen,
    reason: `Penjimatan tertinggi dengan kod ${best.coupon.code}`,
    allEligible: eligibleCandidates,
  }
}
