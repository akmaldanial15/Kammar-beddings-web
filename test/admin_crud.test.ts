import { describe, it, expect, afterAll } from 'vitest'
import {
  // Products
  saveProduct,
  deleteProduct,
  getProductById,
  getProducts,
  // Categories
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
  getCategories,
  // Inventory
  updateVariantStock,
  // Orders
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderById,
  // Coupons
  saveCoupon,
  deleteCoupon,
  getCoupons,
  validateCoupon,
  // Affiliates
  createAffiliate,
  updateAffiliate,
  deleteAffiliate,
  getAffiliateByCode,
  // Showrooms
  saveShowroom,
  deleteShowroom,
  getShowrooms,
  // Site Settings & Config
  getSiteSettings,
  updateSiteSettings,
  getWebsiteConfig,
  updateWebsiteConfig,
  // Payments
  getPaymentSettings,
  savePaymentMethod,
  deletePaymentMethod,
  // Warranties
  submitWarranty,
  getWarrantyRegistrations,
  updateWarrantyStatus,
} from '../lib/db'
import { Product, Coupon, Showroom, PaymentMethodConfig } from '../types'

describe('Comprehensive Admin CRUD & Editing Automation Suite', () => {
  const actorEmail = 'admin@kamaarbeddings.com'
  const testIdSuffix = `test-${Date.now()}`

  // Track created IDs for foolproof cleanup
  const cleanup = {
    productId: `prod-crud-${testIdSuffix}`,
    categoryId: `cat-crud-${testIdSuffix}`,
    orderId: `ord-crud-${testIdSuffix}`,
    couponId: `cpn-crud-${testIdSuffix}`,
    couponCode: `CPN-CRUD-${testIdSuffix.slice(-6).toUpperCase()}`,
    affiliateCode: `AFF-CRUD-${testIdSuffix.slice(-6).toUpperCase()}`,
    showroomId: `shw-crud-${testIdSuffix}`,
    warrantySerial: `WAR-CRUD-${testIdSuffix.slice(-6).toUpperCase()}`,
    paymentMethodId: `pay-crud-${testIdSuffix}`,
  }

  afterAll(async () => {
    // Teardown: Clean up all test entities so data/lena_db.json stays pristine
    try {
      await deleteProduct(cleanup.productId, actorEmail)
    } catch (_) {}
    try {
      await deleteCategory(cleanup.categoryId, actorEmail)
    } catch (_) {}
    try {
      await deleteOrder(cleanup.orderId, actorEmail)
    } catch (_) {}
    try {
      await deleteCoupon(cleanup.couponId, actorEmail)
    } catch (_) {}
    try {
      const aff = await getAffiliateByCode(cleanup.affiliateCode)
      if (aff) await deleteAffiliate(aff.id, actorEmail)
    } catch (_) {}
    try {
      await deleteShowroom(cleanup.showroomId, actorEmail)
    } catch (_) {}
    try {
      await deletePaymentMethod(cleanup.paymentMethodId, actorEmail)
    } catch (_) {}
  })

  // =========================================================================
  // 1. PRODUCTS CRUD (Create, Read, Update, Delete)
  // =========================================================================
  describe('Admin Products CRUD', () => {
    it('creates a new product with full specifications and variants', async () => {
      const productPayload: Product = {
        id: cleanup.productId,
        name: 'Tilam Ujian CRUD Kilang',
        slug: `tilam-ujian-crud-${testIdSuffix}`,
        subtitle: 'Tilam prototaip bagi pengesahan kualiti',
        description: 'Penerangan tilam ujian berkualiti tinggi terus dari kilang TSJ.',
        category: 'tilam-toto',
        categorySlug: 'tilam-toto',
        badge: 'BARU & EKSKLUSIF',
        isBestSeller: true,
        isFeatured: true,
        status: 'published',
        rating: 5,
        reviewCount: 1,
        features: ['100% Cotton Padat', 'Mudah Dicuci'],
        specifications: {
          material: 'Polyester TC & Cotton',
          thickness: '4 Inci',
          warrantyYears: 2,
        },
        images: ['/images/products/toto-single-poly.png'],
        variants: [
          {
            id: `var-${cleanup.productId}-1`,
            sku: `SKU-CRUD-${testIdSuffix.slice(-4)}`,
            name: 'Single 3ft',
            sizeName: 'Single',
            dimensions: '90 cm x 200 cm',
            priceSen: 4990,
            originalPriceSen: 6990,
            stockQuantity: 25,
            isDefault: true,
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const saved = await saveProduct(productPayload, actorEmail)
      expect(saved.id).toBe(cleanup.productId)
      expect(saved.name).toBe('Tilam Ujian CRUD Kilang')

      // Read verification
      const fetched = await getProductById(cleanup.productId)
      expect(fetched).not.toBeNull()
      expect(fetched?.slug).toBe(`tilam-ujian-crud-${testIdSuffix}`)
      expect(fetched?.variants).toHaveLength(1)
      expect(fetched?.variants[0].stockQuantity).toBe(25)
    })

    it('updates product pricing, stock, description and status', async () => {
      const existing = await getProductById(cleanup.productId)
      expect(existing).not.toBeNull()

      const updatedPayload: Product = {
        ...existing!,
        name: 'Tilam Ujian CRUD (Dikemaskini)',
        status: 'published',
        variants: [
          {
            ...existing!.variants[0],
            priceSen: 5500, // Price updated to RM55.00
            stockQuantity: 40, // Stock increased to 40
          },
        ],
      }

      const updated = await saveProduct(updatedPayload, actorEmail)
      expect(updated.name).toBe('Tilam Ujian CRUD (Dikemaskini)')
      expect(updated.variants[0].priceSen).toBe(5500)
      expect(updated.variants[0].stockQuantity).toBe(40)

      const reFetched = await getProductById(cleanup.productId)
      expect(reFetched?.variants[0].priceSen).toBe(5500)
    })

    it('archives / deletes a product successfully', async () => {
      const result = await deleteProduct(cleanup.productId, actorEmail)
      expect(result).toBe(true)

      const reFetched = await getProductById(cleanup.productId)
      // Product is archived / soft deleted
      expect(reFetched?.status).toBe('archived')
    })
  })

  // =========================================================================
  // 2. CATEGORIES CRUD
  // =========================================================================
  describe('Admin Categories CRUD', () => {
    it('creates, reads, updates and reorders a category', async () => {
      // 1. Create
      const newCat = await createCategory(
        {
          name: 'Kategori Ujian CRUD',
          slug: `kategori-crud-${testIdSuffix}`,
          description: 'Kategori baharu untuk ujian automasi admin.',
          imageUrl: '/images/categories/test.png',
          displayOrder: 99,
          showInNav: true,
          hasMegaMenu: false,
          badge: 'PROMO',
          isActive: true,
        },
        actorEmail
      )
      cleanup.categoryId = newCat.id
      expect(newCat.name).toBe('Kategori Ujian CRUD')

      // 2. Read
      const allCats = await getCategories()
      const found = allCats.find((c) => c.id === newCat.id)
      expect(found).toBeDefined()
      expect(found?.slug).toBe(`kategori-crud-${testIdSuffix}`)

      // 3. Update
      const updated = await updateCategory(
        newCat.id,
        {
          name: 'Kategori Ujian CRUD (Dikemaskini)',
          description: 'Penerangan kategori yang telah diedit.',
        },
        actorEmail
      )
      expect(updated.name).toBe('Kategori Ujian CRUD (Dikemaskini)')

      // 4. Reorder
      const reorderResult = await reorderCategories(
        [newCat.id, ...allCats.filter((c) => c.id !== newCat.id).map((c) => c.id)],
        actorEmail
      )
      expect(Array.isArray(reorderResult)).toBe(true)

      // 5. Delete
      const deleted = await deleteCategory(newCat.id, actorEmail)
      expect(deleted).toBe(true)
    })
  })

  // =========================================================================
  // 3. INVENTORY / STOCK EDITING
  // =========================================================================
  describe('Admin Inventory CRUD', () => {
    it('updates variant stock quantity with audit reason', async () => {
      const products = await getProducts({ status: 'all' })
      expect(products.length).toBeGreaterThan(0)

      const targetVariant = products[0].variants[0]
      const originalStock = targetVariant.stockQuantity
      const newStock = originalStock + 10

      const success = await updateVariantStock(
        targetVariant.id,
        newStock,
        'Penambahan stok stokis ujian automasi',
        actorEmail
      )
      expect(success).toBe(true)

      const refreshedProducts = await getProducts({ status: 'all' })
      const updatedVariant = refreshedProducts[0].variants.find((v) => v.id === targetVariant.id)
      expect(updatedVariant?.stockQuantity).toBe(newStock)

      // Revert stock back cleanly
      await updateVariantStock(targetVariant.id, originalStock, 'Pembalikkan ujian', actorEmail)
    })
  })

  // =========================================================================
  // 4. ORDERS CRUD & STATUS WORKFLOW
  // =========================================================================
  describe('Admin Orders CRUD & State Transition', () => {
    it('creates an order, updates fulfillment & payment status, and deletes', async () => {
      // 1. Create
      const newOrder = await createOrder({
        customerEmail: 'admin.crud.test@kamaar.my',
        customerName: 'Ahmad Pelanggan CRUD',
        customerPhone: '0191234567',
        shippingAddress: {
          fullName: 'Ahmad Pelanggan CRUD',
          phone: '0191234567',
          addressLine1: 'No. 88, Jalan Industri Kilang',
          city: 'Tasek Gelugor',
          state: 'Pulau Pinang',
          postcode: '13300',
          country: 'Malaysia',
        },
        billingAddress: {
          fullName: 'Ahmad Pelanggan CRUD',
          phone: '0191234567',
          addressLine1: 'No. 88, Jalan Industri Kilang',
          city: 'Tasek Gelugor',
          state: 'Pulau Pinang',
          postcode: '13300',
          country: 'Malaysia',
        },
        subtotalSen: 9900,
        discountSen: 0,
        shippingSen: 0,
        taxSen: 0,
        totalSen: 9900,
        paymentStatus: 'unpaid',
        fulfillmentStatus: 'unfulfilled',
        paymentProvider: 'chip',
        items: [],
      })
      cleanup.orderId = newOrder.id
      expect(newOrder.id).toBeDefined()
      expect(newOrder.paymentStatus).toBe('unpaid')

      // 2. Read
      const fetched = await getOrderById(newOrder.id)
      expect(fetched).not.toBeNull()
      expect(fetched?.orderNumber).toContain('LENA-2026-')

      // 3. Update status (Admin marks as Paid & Processing)
      await updateOrderStatus(
        newOrder.id,
        {
          paymentStatus: 'paid',
          fulfillmentStatus: 'processing',
          notes: 'Disahkan oleh Kamaar Admin melalui panggilan telefon.',
        },
        actorEmail
      )

      const updated = await getOrderById(newOrder.id)
      expect(updated?.paymentStatus).toBe('paid')
      expect(updated?.fulfillmentStatus).toBe('processing')

      // 4. Delete
      const delRes = await deleteOrder(newOrder.id, actorEmail)
      expect(delRes.success).toBe(true)

      const deletedOrder = await getOrderById(newOrder.id)
      expect(deletedOrder).toBeNull()
    })
  })

  // =========================================================================
  // 5. PROMOTIONS / COUPONS CRUD
  // =========================================================================
  describe('Admin Promotions & Coupons CRUD', () => {
    it('creates, validates, edits and deletes a promotional coupon', async () => {
      // 1. Create
      const newCoupon: Coupon = {
        id: cleanup.couponId,
        code: cleanup.couponCode,
        description: 'Diskaun Ujian CRUD Automasi',
        discountType: 'percentage',
        discountValue: 15, // 15% off
        minSpendSen: 5000, // RM50 min spend
        maxDiscountSen: 2000, // RM20 max discount cap
        usageLimit: 100,
        usageCount: 0,
        perCustomerLimit: 1,
        startsAt: new Date().toISOString(),
        endsAt: new Date(Date.now() + 30 * 86400000).toISOString(),
        isActive: true,
      }

      const saved = await saveCoupon(newCoupon, actorEmail)
      expect(saved.code).toBe(cleanup.couponCode)

      // 2. Validate
      const validation = await validateCoupon(cleanup.couponCode, 10000) // Spend RM100
      expect(validation.isValid).toBe(true)
      expect(validation.discountSen).toBe(1500) // 15% of RM100 = RM15

      // 3. Update (Increase discount to 20%)
      const updatedCoupon = await saveCoupon(
        {
          ...newCoupon,
          discountValue: 20,
          description: 'Diskaun Ujian CRUD Dikemaskini 20%',
        },
        actorEmail
      )
      expect(updatedCoupon.discountValue).toBe(20)

      const reVal = await validateCoupon(cleanup.couponCode, 10000)
      expect(reVal.discountSen).toBe(2000) // 20% capped at RM20

      // 4. Delete by ID
      const del = await deleteCoupon(cleanup.couponId, actorEmail)
      expect(del).toBe(true)

      const postDel = await validateCoupon(cleanup.couponCode, 10000)
      expect(postDel.isValid).toBe(false)
    })
  })

  // =========================================================================
  // 6. AFFILIATES CRUD
  // =========================================================================
  describe('Admin Affiliates CRUD', () => {
    it('creates, looks up, updates commission and deletes an affiliate', async () => {
      // 1. Create
      const newAff = await createAffiliate(
        {
          name: 'Ejen Ujian Automasi CRUD',
          code: cleanup.affiliateCode,
          email: `ejen.crud.${testIdSuffix}@kamaar.my`,
          phone: '01112345678',
          bankName: 'Maybank',
          bankAccountNumber: '123456789012',
          commissionType: 'percentage',
          commissionRate: 12,
          isActive: true,
        },
        actorEmail
      )
      expect(newAff.id).toBeDefined()
      expect(newAff.code).toBe(cleanup.affiliateCode)

      // 2. Read (Lookup with and without prefix)
      const found = await getAffiliateByCode(cleanup.affiliateCode)
      expect(found).not.toBeNull()
      expect(found?.name).toBe('Ejen Ujian Automasi CRUD')

      // Strip prefix test
      const strippedCode = cleanup.affiliateCode.replace(/^AFF-/, '')
      const foundStripped = await getAffiliateByCode(strippedCode)
      expect(foundStripped).not.toBeNull()

      // 3. Update commission
      const updated = await updateAffiliate(
        newAff.id,
        {
          commissionRate: 18,
          adminNotes: 'Komisen dinaikkan kepada 18% atas prestasi cemerlang.',
        },
        actorEmail
      )
      expect(updated.commissionRate).toBe(18)

      // 4. Delete
      const deleted = await deleteAffiliate(newAff.id, actorEmail)
      expect(deleted).toBe(true)

      const postDel = await getAffiliateByCode(cleanup.affiliateCode)
      expect(postDel).toBeNull()
    })
  })

  // =========================================================================
  // 7. SHOWROOMS CRUD
  // =========================================================================
  describe('Admin Showrooms CRUD', () => {
    it('creates, updates details, and deletes a showroom studio', async () => {
      // 1. Create
      const newShowroom: Showroom = {
        id: cleanup.showroomId,
        name: 'Showroom TSJ Cawangan Ujian',
        slug: `showroom-ujian-${testIdSuffix}`,
        address: 'No. 12, Pusat Perniagaan Tasek Gelugor',
        city: 'Tasek Gelugor',
        state: 'Pulau Pinang',
        postcode: '13300',
        phone: '019-478 6991',
        email: 'tasek.showroom@kamaar.my',
        operatingHours: '9:00 AM - 6:00 PM',
        latitude: 5.4833,
        longitude: 100.4933,
        googleMapsUrl: 'https://maps.google.com',
        wazeUrl: 'https://waze.com',
        images: ['/images/showroom/showroom-main.jpg'],
        features: ['Bilik Ujian Tilam', 'Parkir Percuma'],
        isMain: false,
        isActive: true,
      }

      const saved = await saveShowroom(newShowroom, actorEmail)
      expect(saved.id).toBe(cleanup.showroomId)

      // 2. Read
      const all = await getShowrooms()
      expect(all.some((s) => s.id === cleanup.showroomId)).toBe(true)

      // 3. Update
      const updated = await saveShowroom(
        {
          ...newShowroom,
          name: 'Showroom TSJ Cawangan Ujian (VIP Studio)',
          operatingHours: '8:30 AM - 7:00 PM',
        },
        actorEmail
      )
      expect(updated.name).toContain('VIP Studio')
      expect(updated.operatingHours).toBe('8:30 AM - 7:00 PM')

      // 4. Delete
      const del = await deleteShowroom(cleanup.showroomId, actorEmail)
      expect(del).toBe(true)

      const postAll = await getShowrooms()
      expect(postAll.some((s) => s.id === cleanup.showroomId)).toBe(false)
    })
  })

  // =========================================================================
  // 8. SITE SETTINGS & BRAND OPERATIONS CRUD
  // =========================================================================
  describe('Admin Site Settings & Config CRUD', () => {
    it('reads and updates core site operational parameters', async () => {
      const initial = await getSiteSettings()
      expect(initial.brandName).toBeDefined()

      const originalThreshold = initial.freeShippingThresholdSen
      const newThreshold = 18800 // RM188.00

      const updated = await updateSiteSettings(
        {
          freeShippingThresholdSen: newThreshold,
          announcementText: 'KAMAAR BEDDINGS: PENGHANTARAN TERUS DARI KILANG TASEK GELUGOR',
        },
        actorEmail
      )
      expect(updated.freeShippingThresholdSen).toBe(newThreshold)
      expect(updated.announcementText).toContain('TASEK GELUGOR')

      // Revert back cleanly
      await updateSiteSettings({ freeShippingThresholdSen: originalThreshold }, actorEmail)
    })
  })

  // =========================================================================
  // 9. WEBSITE THEME & CONFIG EDITOR CRUD
  // =========================================================================
  describe('Admin Website Editor CRUD', () => {
    it('reads and updates website configuration, theme colors & announcement', async () => {
      const initialConfig = await getWebsiteConfig()
      expect(initialConfig.theme).toBeDefined()

      const updated = await updateWebsiteConfig(
        {
          announcement: {
            ...initialConfig.announcement,
            centerText: 'PENGILANG & PEMASAR PRODUK JAHITAN TEKSTIL TERBAIK',
          },
        },
        actorEmail
      )
      expect(updated.announcement.centerText).toBe('PENGILANG & PEMASAR PRODUK JAHITAN TEKSTIL TERBAIK')

      // Revert back cleanly
      await updateWebsiteConfig(
        {
          announcement: {
            ...updated.announcement,
            centerText: initialConfig.announcement.centerText,
          },
        },
        actorEmail
      )
    })
  })

  // =========================================================================
  // 10. PAYMENT METHODS & GATEWAY CONFIG CRUD
  // =========================================================================
  describe('Admin Payment Settings & Methods CRUD', () => {
    it('creates, toggles, updates and deletes payment methods', async () => {
      // 1. Create custom payment method
      const newMethod: PaymentMethodConfig = {
        id: cleanup.paymentMethodId,
        providerId: 'manual_transfer',
        name: 'Pindahan Bank Manual (Ujian CRUD)',
        description: 'Bayar secara manual ke akaun kilang TSJ',
        badge: 'MANUAL',
        enabled: true,
        isCustom: true,
        displayOrder: 99,
      }

      const saved = await savePaymentMethod(newMethod, actorEmail)
      expect(saved.id).toBe(cleanup.paymentMethodId)

      // 2. Read
      const settings = await getPaymentSettings()
      expect(settings.methods.some((m) => m.id === cleanup.paymentMethodId)).toBe(true)

      // 3. Update / Toggle enabled
      const toggled = await savePaymentMethod({ ...newMethod, enabled: false }, actorEmail)
      expect(toggled.enabled).toBe(false)

      // 4. Delete
      const deleted = await deletePaymentMethod(cleanup.paymentMethodId, actorEmail)
      expect(deleted).toBe(true)

      const postSettings = await getPaymentSettings()
      expect(postSettings.methods.some((m) => m.id === cleanup.paymentMethodId)).toBe(false)
    })
  })

  // =========================================================================
  // 11. WARRANTIES CRUD
  // =========================================================================
  describe('Admin Warranties CRUD', () => {
    it('registers a warranty and allows admin to review and approve', async () => {
      const reg = await submitWarranty({
        customerName: 'Ahmad Pelanggan Warranty',
        customerEmail: 'warranty.test@kamaar.my',
        customerPhone: '0191234567',
        productName: 'Tilam Lipat Kekabu Asli (3ft)',
        invoiceNumber: cleanup.warrantySerial,
        purchaseDate: '2026-10-01',
        retailer: 'Showroom Kilang Tasek Gelugor',
      })
      expect(reg.id).toBeDefined()
      expect(reg.status).toBe('pending')

      const all = await getWarrantyRegistrations()
      expect(all.some((w) => w.invoiceNumber === cleanup.warrantySerial)).toBe(true)

      // Admin approves warranty
      const approved = await updateWarrantyStatus(reg.id, 'verified', 'Disahkan admin')
      expect(approved).toBe(true)

      const refreshed = await getWarrantyRegistrations()
      const approvedItem = refreshed.find((w) => w.id === reg.id)
      expect(approvedItem?.status).toBe('verified')
    })
  })
})
