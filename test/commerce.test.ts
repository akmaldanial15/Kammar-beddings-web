import { describe, it, expect } from 'vitest'
import {
  formatMYR,
  validateMalaysianPostcode,
  validateMalaysianPhone,
  calculateShippingFee,
  MALAYSIAN_STATES,
} from '../lib/utils/format'
import { validateCoupon } from '../lib/db'

describe('Malaysian Formatting & Validation Rules', () => {
  it('formats integer sen to correct Malaysian Ringgit representation', () => {
    expect(formatMYR(129900)).toBe('RM1,299.00')
    expect(formatMYR(0)).toBe('RM0.00')
    expect(formatMYR(249950)).toBe('RM2,499.50')
    expect(formatMYR(39900)).toBe('RM399.00')
    expect(formatMYR(null)).toBe('RM0.00')
  })

  it('validates 5-digit Malaysian postcodes including leading zeros', () => {
    expect(validateMalaysianPostcode('05000')).toBe(true) // Kedah
    expect(validateMalaysianPostcode('50480')).toBe(true) // KL
    expect(validateMalaysianPostcode('88000')).toBe(true) // Kota Kinabalu
    expect(validateMalaysianPostcode('93000')).toBe(true) // Kuching
    expect(validateMalaysianPostcode('5048')).toBe(false) // 4 digits
    expect(validateMalaysianPostcode('504800')).toBe(false) // 6 digits
    expect(validateMalaysianPostcode('ABCDE')).toBe(false) // non-numeric
  })

  it('validates Malaysian mobile phone numbers', () => {
    expect(validateMalaysianPhone('+60123456789')).toBe(true)
    expect(validateMalaysianPhone('012-345 6789')).toBe(true)
    expect(validateMalaysianPhone('011-12345678')).toBe(true)
    expect(validateMalaysianPhone('0198765432')).toBe(true)
    expect(validateMalaysianPhone('12345')).toBe(false)
  })

  it('verifies complete list of 16 Malaysian states and federal territories', () => {
    expect(MALAYSIAN_STATES).toHaveLength(16)
    expect(MALAYSIAN_STATES).toContain('WP Kuala Lumpur')
    expect(MALAYSIAN_STATES).toContain('Selangor')
    expect(MALAYSIAN_STATES).toContain('Sabah')
    expect(MALAYSIAN_STATES).toContain('Sarawak')
    expect(MALAYSIAN_STATES).toContain('Pulau Pinang')
  })
})

describe('Logistics & Shipping Fee Engine', () => {
  it('grants complimentary white-glove delivery for bulky mattresses in Peninsular Malaysia', () => {
    const res = calculateShippingFee({
      subtotalSen: 129900,
      state: 'Selangor',
      hasBulkyItem: true,
    })
    expect(res.shippingSen).toBe(0)
    expect(res.isFreeShipping).toBe(true)
  })

  it('charges RM280 for East Malaysia bulky mattress sea freight', () => {
    const resSabah = calculateShippingFee({
      subtotalSen: 249900,
      state: 'Sabah',
      hasBulkyItem: true,
    })
    expect(resSabah.shippingSen).toBe(28000) // RM280.00
    expect(resSabah.isFreeShipping).toBe(false)

    const resSarawak = calculateShippingFee({
      subtotalSen: 249900,
      state: 'Sarawak',
      hasBulkyItem: true,
    })
    expect(resSarawak.shippingSen).toBe(28000)
  })

  it('charges RM65 for East Malaysia parcel accessories', () => {
    const res = calculateShippingFee({
      subtotalSen: 29900,
      state: 'Sabah',
      hasBulkyItem: false,
    })
    expect(res.shippingSen).toBe(6500) // RM65.00
  })

  it('charges standard RM35 for Peninsular accessories below RM500 threshold', () => {
    const res = calculateShippingFee({
      subtotalSen: 25000, // RM250.00
      state: 'WP Kuala Lumpur',
      hasBulkyItem: false,
    })
    expect(res.shippingSen).toBe(3500) // RM35.00
    expect(res.isFreeShipping).toBe(false)
  })

  it('grants free shipping for Peninsular accessories at or above RM500 threshold', () => {
    const res = calculateShippingFee({
      subtotalSen: 50000, // RM500.00
      state: 'Johor',
      hasBulkyItem: false,
    })
    expect(res.shippingSen).toBe(0)
    expect(res.isFreeShipping).toBe(true)
  })
})

describe('Promotions & Server-Side Coupon Validation', () => {
  it('rejects invalid or non-existent coupon codes', async () => {
    const res = await validateCoupon('FAKECODE999', 150000)
    expect(res.isValid).toBe(false)
    expect(res.discountSen).toBe(0)
  })

  it('validates TIER100 with RM100 discount when minimum spend is met', async () => {
    const res = await validateCoupon('TIER100', 150000) // RM1,500 spend
    expect(res.isValid).toBe(true)
    expect(res.discountSen).toBe(10000) // RM100.00 discount
  })

  it('rejects coupon when minimum spend is not met', async () => {
    const res = await validateCoupon('TIER100', 100000) // TIER100 requires min RM1,500 spend
    expect(res.isValid).toBe(false)
    expect(res.discountSen).toBe(0)
    expect(res.message).toContain('Minimum spend')
  })

  it('applies percentage coupon with max cap constraint', async () => {
    const res = await validateCoupon('SLEEPVIP', 400000) // 15% of RM4,000 = RM600, cap is RM800
    expect(res.isValid).toBe(true)
    expect(res.discountSen).toBe(60000) // RM600.00 discount
  })
})
