import { describe, it, expect } from 'vitest'
import {
  createOrder,
  getOrderById,
  upsertOrder,
  updateOrderStatus,
  getAffiliateByCode,
  recordAffiliateSale,
} from '../lib/db'
import { Order } from '../types'

describe('Order Upsert & Vercel Recovery Fail-safe', () => {
  it('creates an order and allows upserting updates seamlessly', async () => {
    const dummyOrder: Order = {
      id: `ord-test-recover-${Date.now()}`,
      orderNumber: `LENA-TEST-${Date.now().toString().slice(-4)}`,
      customerEmail: 'customer@kamaar.my',
      customerName: 'Ahmad Pelanggan',
      customerPhone: '0191234567',
      shippingAddress: {
        fullName: 'Ahmad Pelanggan',
        phone: '0191234567',
        addressLine1: 'No 1, Jalan Bunga',
        city: 'Tasek Gelugor',
        state: 'Pulau Pinang',
        postcode: '13300',
        country: 'Malaysia',
      },
      billingAddress: {
        fullName: 'Ahmad Pelanggan',
        phone: '0191234567',
        addressLine1: 'No 1, Jalan Bunga',
        city: 'Tasek Gelugor',
        state: 'Pulau Pinang',
        postcode: '13300',
        country: 'Malaysia',
      },
      subtotalSen: 45000,
      discountSen: 0,
      shippingSen: 0,
      taxSen: 0,
      totalSen: 45000,
      paymentStatus: 'unpaid',
      fulfillmentStatus: 'unfulfilled',
      paymentProvider: 'chip',
      items: [
        {
          id: 'item-1',
          orderId: '',
          variantId: 'var-1',
          productName: 'Tilam Lipat Kekabu Asli',
          sizeName: 'Single 3ft',
          sku: 'TL-SGL',
          dimensions: '3ft x 6ft',
          unitPriceSen: 45000,
          quantity: 1,
          lineTotalSen: 45000,
        },
      ],
      affiliateCode: 'AFF-DANIAL',
      affiliateCommissionSen: 4500, // 10%
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const saved = await upsertOrder(dummyOrder)
    expect(saved.id).toBe(dummyOrder.id)
    expect(saved.paymentStatus).toBe('unpaid')

    // Lookup
    const fetched = await getOrderById(dummyOrder.id)
    expect(fetched).not.toBeNull()
    expect(fetched?.customerName).toBe('Ahmad Pelanggan')
  })

  it('credits affiliate exactly once when payment becomes paid via updateOrderStatus', async () => {
    const affBefore = await getAffiliateByCode('AFF-DANIAL')
    const countBefore = affBefore?.totalSalesCount || 0
    const commBefore = affBefore?.totalCommissionSen || 0

    const orderId = `ord-aff-test-${Date.now()}`
    const order: Order = {
      id: orderId,
      orderNumber: `LENA-AFF-${Date.now().toString().slice(-4)}`,
      customerEmail: 'aff.buyer@kamaar.my',
      customerName: 'Pembeli Affiliate',
      customerPhone: '0191234567',
      shippingAddress: {
        fullName: 'Pembeli Affiliate',
        phone: '0191234567',
        addressLine1: 'No 2, Jalan Mawar',
        city: 'Tasek Gelugor',
        state: 'Pulau Pinang',
        postcode: '13300',
        country: 'Malaysia',
      },
      billingAddress: {
        fullName: 'Pembeli Affiliate',
        phone: '0191234567',
        addressLine1: 'No 2, Jalan Mawar',
        city: 'Tasek Gelugor',
        state: 'Pulau Pinang',
        postcode: '13300',
        country: 'Malaysia',
      },
      subtotalSen: 30000,
      discountSen: 0,
      shippingSen: 0,
      taxSen: 0,
      totalSen: 30000,
      paymentStatus: 'unpaid',
      fulfillmentStatus: 'unfulfilled',
      paymentProvider: 'chip',
      affiliateCode: 'AFF-DANIAL',
      affiliateCommissionSen: 3000,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await upsertOrder(order)

    // First transition to paid -> affiliate credited
    await updateOrderStatus(orderId, { paymentStatus: 'paid' })

    const affAfter1 = await getAffiliateByCode('AFF-DANIAL')
    expect(affAfter1?.totalSalesCount).toBe(countBefore + 1)
    expect(affAfter1?.totalCommissionSen).toBe(commBefore + 3000)

    // Second transition (e.g. repeated webhook or page reload) -> MUST NOT DOUBLE CREDIT
    await updateOrderStatus(orderId, { paymentStatus: 'paid', fulfillmentStatus: 'processing' })

    const affAfter2 = await getAffiliateByCode('AFF-DANIAL')
    expect(affAfter2?.totalSalesCount).toBe(countBefore + 1)
    expect(affAfter2?.totalCommissionSen).toBe(commBefore + 3000)
  })

  it('credits affiliate properly when upserted directly as paid from recovery snapshot', async () => {
    const affBefore = await getAffiliateByCode('AFF-DANIAL')
    const countBefore = affBefore?.totalSalesCount || 0
    const commBefore = affBefore?.totalCommissionSen || 0

    const orderId = `ord-recovery-paid-${Date.now()}`
    const paidSnapshot: Order = {
      id: orderId,
      orderNumber: `LENA-REC-${Date.now().toString().slice(-4)}`,
      customerEmail: 'recovery.buyer@kamaar.my',
      customerName: 'Pembeli Recovery',
      customerPhone: '0191234567',
      shippingAddress: {
        fullName: 'Pembeli Recovery',
        phone: '0191234567',
        addressLine1: 'No 3, Jalan Melati',
        city: 'Tasek Gelugor',
        state: 'Pulau Pinang',
        postcode: '13300',
        country: 'Malaysia',
      },
      billingAddress: {
        fullName: 'Pembeli Recovery',
        phone: '0191234567',
        addressLine1: 'No 3, Jalan Melati',
        city: 'Tasek Gelugor',
        state: 'Pulau Pinang',
        postcode: '13300',
        country: 'Malaysia',
      },
      subtotalSen: 20000,
      discountSen: 0,
      shippingSen: 0,
      taxSen: 0,
      totalSen: 20000,
      paymentStatus: 'paid',
      fulfillmentStatus: 'processing',
      paymentProvider: 'chip',
      affiliateCode: 'AFF-DANIAL',
      affiliateCommissionSen: 2000,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Upserting with paid status
    const saved = await upsertOrder(paidSnapshot)
    expect(saved.affiliateCredited).toBe(true)

    const affAfter = await getAffiliateByCode('AFF-DANIAL')
    expect(affAfter?.totalSalesCount).toBe(countBefore + 1)
    expect(affAfter?.totalCommissionSen).toBe(commBefore + 2000)

    // Repeated upsert of same paid order -> NO DUPLICATE
    await upsertOrder(saved)
    const affAfterAgain = await getAffiliateByCode('AFF-DANIAL')
    expect(affAfterAgain?.totalSalesCount).toBe(countBefore + 1)
    expect(affAfterAgain?.totalCommissionSen).toBe(commBefore + 2000)
  })
})
