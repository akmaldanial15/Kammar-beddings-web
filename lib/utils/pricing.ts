import { QuantityTier } from '@/types'

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
