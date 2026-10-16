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

  it('charges standard RM15 for Peninsular accessories below RM200 threshold', () => {
    const res = calculateShippingFee({
      subtotalSen: 15000, // RM150.00
      state: 'WP Kuala Lumpur',
      hasBulkyItem: false,
    })
    expect(res.shippingSen).toBe(1500) // RM15.00
    expect(res.isFreeShipping).toBe(false)
  })

  it('grants free shipping for Peninsular accessories at or above RM200 threshold', () => {
    const res = calculateShippingFee({
      subtotalSen: 20000, // RM200.00
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

  it('validates KAMAAR3 with RM3 discount when minimum spend is met', async () => {
    const res = await validateCoupon('KAMAAR3', 2500) // RM25 spend (min RM20)
    expect(res.isValid).toBe(true)
    expect(res.discountSen).toBe(300)
  })

  it('validates KAMAAR5 with RM5 discount when minimum spend is met', async () => {
    const res = await validateCoupon('KAMAAR5', 5000) // RM50 spend (min RM45)
    expect(res.isValid).toBe(true)
    expect(res.discountSen).toBe(500)
  })

  it('validates KAMAAR10 with RM10 discount when minimum spend is met', async () => {
    const res = await validateCoupon('KAMAAR10', 10000) // RM100 spend (min RM90)
    expect(res.isValid).toBe(true)
    expect(res.discountSen).toBe(1000)
  })

  it('validates BORONG20 with RM20 discount when minimum spend is met', async () => {
    const res = await validateCoupon('BORONG20', 25000) // RM250 spend (min RM200)
    expect(res.isValid).toBe(true)
    expect(res.discountSen).toBe(2000)
  })

  it('rejects coupon when minimum spend is not met', async () => {
    const res = await validateCoupon('KAMAAR10', 5000) // KAMAAR10 requires min RM90 spend
    expect(res.isValid).toBe(false)
    expect(res.discountSen).toBe(0)
    expect(res.message).toContain('Minimum spend')
  })

  it('applies percentage coupon with max cap constraint', async () => {
    const res = await validateCoupon('WELCOME10', 20000) // 10% of RM200 = RM20, cap is RM15 (1500 sen)
    expect(res.isValid).toBe(true)
    expect(res.discountSen).toBe(1500) // Capped at RM15.00
  })
})
