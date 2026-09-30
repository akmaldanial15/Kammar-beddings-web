import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  getProductById,
  validateCoupon,
  reserveStock,
  createOrder,
  getAffiliateByCode,
} from '@/lib/db'
import { calculateShippingFee, validateMalaysianPostcode, validateMalaysianPhone } from '@/lib/utils/format'
import { stripeProvider } from '@/lib/payment/stripe'

const CheckoutRequestSchema = z.object({
  items: z.array(
    z.object({
      variantId: z.string(),
      productId: z.string(),
      quantity: z.number().int().positive(),
    })
  ).min(1, 'Cart cannot be empty'),
  customer: z.object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().refine(validateMalaysianPhone, 'Valid Malaysian phone number required'),
  }),
  shippingAddress: z.object({
    addressLine1: z.string().min(3, 'Address line 1 is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    postcode: z.string().refine(validateMalaysianPostcode, '5-digit Malaysian postcode required'),
    country: z.string().default('Malaysia'),
  }),
  deliveryDetails: z.object({
    notes: z.string().optional(),
    hasLiftAccess: z.boolean().default(true),
    floorLevel: z.string().optional(),
    preferredDeliveryDate: z.string().optional(),
  }).optional(),
  couponCode: z.string().optional(),
  affiliateCode: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json()
    const parseResult = CheckoutRequestSchema.safeParse(rawBody)

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0]?.message || 'Validation failed' },
        { status: 400 }
      )
    }

    const { items, customer, shippingAddress, deliveryDetails, couponCode, affiliateCode } = parseResult.data

    // 1. Re-validate each item price and stock against server database (Never trust client)
    let subtotalSen = 0
    let hasBulkyMattress = false
    const validatedOrderItems = []

    for (const clientItem of items) {
      const product = await getProductById(clientItem.productId)
      if (!product || product.status !== 'published') {
        return NextResponse.json(
          { error: `Product is no longer available.` },
          { status: 400 }
        )
      }

      const variant = product.variants.find((v) => v.id === clientItem.variantId)
      if (!variant || !variant.isActive) {
        return NextResponse.json(
          { error: `Selected variant for ${product.name} is no longer available.` },
          { status: 400 }
        )
      }

      if (variant.stockQuantity < clientItem.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name} (${variant.sizeName}). Only ${variant.stockQuantity} unit(s) remaining.` },
          { status: 400 }
        )
      }

      const lineTotalSen = variant.priceSen * clientItem.quantity
      subtotalSen += lineTotalSen

      if (product.productType === 'mattress') {
        hasBulkyMattress = true
      }

      validatedOrderItems.push({
        variantId: variant.id,
        productName: product.name,
        sizeName: variant.sizeName,
        sku: variant.sku,
        dimensions: variant.dimensions,
        unitPriceSen: variant.priceSen, // authoritative server price
        quantity: clientItem.quantity,
        lineTotalSen,
        imageUrl: product.images[0]?.imageUrl || '',
      })
    }

    // 2. Validate Coupon server-side
    let discountSen = 0
    let appliedCoupon: string | undefined = undefined

    if (couponCode) {
      const couponCheck = await validateCoupon(couponCode, subtotalSen)
      if (couponCheck.isValid && couponCheck.coupon) {
        discountSen = couponCheck.discountSen
        appliedCoupon = couponCheck.coupon.code
      }
    }

    // 3. Authoritative server calculation for Malaysian Shipping
    const shippingCalc = calculateShippingFee({
      subtotalSen,
      state: shippingAddress.state,
      hasBulkyItem: hasBulkyMattress,
      freeShippingPromo: couponCode === 'FREESHIP',
    })

    const totalSen = Math.max(0, subtotalSen - discountSen + shippingCalc.shippingSen)

    // 4. Resolve Affiliate & Referral attribution (if any)
    let affiliateAttribution: {
      code: string
      name: string
      commissionSen: number
      remark: string
    } | undefined = undefined

    if (affiliateCode) {
      const affiliate = await getAffiliateByCode(affiliateCode)
      if (affiliate && affiliate.isActive) {
        const commSen =
          affiliate.commissionType === 'fixed_amount'
            ? affiliate.commissionRate * 100
            : Math.round((subtotalSen * affiliate.commissionRate) / 100)

        affiliateAttribution = {
          code: affiliate.code,
          name: affiliate.name,
          commissionSen: commSen,
          remark: `Sale dirujuk oleh Affiliate: ${affiliate.name} (Kod: ${affiliate.code}) | Komisen: RM ${(commSen / 100).toFixed(2)} (${affiliate.commissionRate}%)`,
        }
      }
    }

    // 5. Reserve stock atomically
    for (const item of validatedOrderItems) {
      const res = await reserveStock(item.variantId, item.quantity)
      if (!res.success) {
        return NextResponse.json({ error: res.message || 'Stock reservation failed' }, { status: 400 })
      }
    }

    // 6. Persist order in database with immutable snapshot
    const order = await createOrder({
      customerEmail: customer.email,
      customerName: customer.fullName,
      customerPhone: customer.phone,
      affiliateCode: affiliateAttribution?.code,
      affiliateName: affiliateAttribution?.name,
      affiliateCommissionSen: affiliateAttribution?.commissionSen,
      affiliateRemark: affiliateAttribution?.remark,
      shippingAddress: {
        fullName: customer.fullName,
        phone: customer.phone,
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postcode: shippingAddress.postcode,
        country: shippingAddress.country,
      },
      billingAddress: {
        fullName: customer.fullName,
        phone: customer.phone,
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postcode: shippingAddress.postcode,
        country: shippingAddress.country,
      },
      deliveryNotes: deliveryDetails?.notes,
      preferredDeliveryDate: deliveryDetails?.preferredDeliveryDate,
      hasLiftAccess: deliveryDetails?.hasLiftAccess,
      floorLevel: deliveryDetails?.floorLevel,
      subtotalSen,
      discountSen,
      shippingSen: shippingCalc.shippingSen,
      taxSen: 0,
      totalSen,
      appliedCoupon,
      paymentStatus: 'unpaid',
      fulfillmentStatus: 'unfulfilled',
      paymentProvider: 'stripe',
      items: validatedOrderItems.map((item, idx) => ({
        ...item,
        id: `item-${Date.now()}-${idx}`,
        orderId: '',
      })),
    })

    // 6. Create Stripe Checkout Session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const session = await stripeProvider.createCheckoutSession({
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerEmail: customer.email,
      customerName: customer.fullName,
      amountSen: totalSen,
      currency: 'MYR',
      successUrl: `${appUrl}/order/confirmed/${order.id}`,
      cancelUrl: `${appUrl}/checkout?cancelled=true`,
      items: validatedOrderItems.map((i) => ({
        name: `${i.productName} (${i.sizeName})`,
        quantity: i.quantity,
        unitPriceSen: i.unitPriceSen,
      })),
    })

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      checkoutUrl: session.checkoutUrl,
    })
  } catch (err: any) {
    console.error('Checkout error:', err)
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred during checkout.' },
      { status: 500 }
    )
  }
}
