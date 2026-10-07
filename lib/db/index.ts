import fs from 'fs'
import path from 'path'
import {
  Product,
  Category,
  Collection,
  Coupon,
  Order,
  Review,
  Showroom,
  BlogPost,
  WarrantyRegistration,
  ContactEnquiry,
  BusinessEnquiry,
  AppointmentRequest,
  SiteSettings,
  StaffMember,
  AuditLog,
  Affiliate,
  WebsiteConfig,
  PaymentSettings,
  PaymentMethodConfig,
} from '@/types'
import {
  initialCategories,
  initialCollections,
  initialProducts,
  initialCoupons,
  initialShowrooms,
  initialBlogPosts,
  initialSiteSettings,
  initialStaffMembers,
  initialReviews,
  initialAffiliates,
  initialWebsiteConfig,
  initialPaymentSettings,
} from './seedData'

interface DatabaseSchema {
  categories: Category[]
  collections: Collection[]
  products: Product[]
  coupons: Coupon[]
  orders: Order[]
  reviews: Review[]
  showrooms: Showroom[]
  blogPosts: BlogPost[]
  warranties: WarrantyRegistration[]
  contactEnquiries: ContactEnquiry[]
  businessEnquiries: BusinessEnquiry[]
  appointments: AppointmentRequest[]
  siteSettings: SiteSettings
  staffMembers: StaffMember[]
  auditLogs: AuditLog[]
  affiliates: Affiliate[]
  websiteConfig?: WebsiteConfig
  paymentSettings?: PaymentSettings
}

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_FILE = path.join(DATA_DIR, 'lena_db.json')

// In-memory cache with file-sync
let dbCache: DatabaseSchema | null = null

function ensureDb(): DatabaseSchema {
  if (dbCache) return dbCache

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialDb: DatabaseSchema = {
      categories: initialCategories,
      collections: initialCollections,
      products: initialProducts,
      coupons: initialCoupons,
      orders: [],
      reviews: initialReviews,
      showrooms: initialShowrooms,
      blogPosts: initialBlogPosts,
      warranties: [],
      contactEnquiries: [],
      businessEnquiries: [],
      appointments: [],
      siteSettings: initialSiteSettings,
      staffMembers: initialStaffMembers,
      auditLogs: [],
      affiliates: initialAffiliates,
      websiteConfig: initialWebsiteConfig,
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8')
    dbCache = initialDb
    return initialDb
  }

  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8')
    dbCache = JSON.parse(data) as DatabaseSchema
    // Backwards compatibility migration for affiliates
    if (!dbCache.affiliates) {
      dbCache.affiliates = initialAffiliates
      saveDb(dbCache)
    }
    // Backwards compatibility migration for websiteConfig
    if (!dbCache.websiteConfig) {
      dbCache.websiteConfig = initialWebsiteConfig
      saveDb(dbCache)
    } else if (!dbCache.websiteConfig.megaMenu) {
      dbCache.websiteConfig.megaMenu = initialWebsiteConfig.megaMenu
      saveDb(dbCache)
    }

    // Backwards compatibility migration for staff members
    if (dbCache.staffMembers) {
      let migrated = false
      for (const sm of dbCache.staffMembers) {
        if (sm.name.includes('Syed Danial')) {
          sm.name = 'Kamaar Admin'
          migrated = true
        }
        if (sm.name.includes('Nurul Huda')) {
          sm.name = 'Kamaar Catalog Manager'
          migrated = true
        }
        if (sm.name.includes('Kenji Tan')) {
          sm.name = 'Kamaar Order Manager'
          migrated = true
        }
        if (sm.name.includes('Melissa Kaur')) {
          sm.name = 'Kamaar Content Editor'
          migrated = true
        }
        if (sm.email.includes('lenasleep.com.my')) {
          sm.email = sm.email.replace('lenasleep.com.my', 'kamaarbeddings.com')
          migrated = true
        }
      }
      const hasAdmin = dbCache.staffMembers.some((s) => s.email === 'admin@kamaarbeddings.com')
      if (!hasAdmin) {
        dbCache.staffMembers.unshift({
          id: 'staff-admin-main',
          email: 'admin@kamaarbeddings.com',
          name: 'Kamaar Admin',
          role: 'owner',
          isActive: true,
          createdAt: '2026-09-01T00:00:00Z',
        })
        migrated = true
      }
      if (migrated) {
        saveDb(dbCache)
      }
    }

    // Backwards compatibility migration for paymentSettings
    if (!dbCache.paymentSettings) {
      dbCache.paymentSettings = initialPaymentSettings
      saveDb(dbCache)
    }

    return dbCache!
  } catch (err) {
    console.error('Error reading db file, falling back to seed:', err)
    const initialDb: DatabaseSchema = {
      categories: initialCategories,
      collections: initialCollections,
      products: initialProducts,
      coupons: initialCoupons,
      orders: [],
      reviews: initialReviews,
      showrooms: initialShowrooms,
      blogPosts: initialBlogPosts,
      warranties: [],
      contactEnquiries: [],
      businessEnquiries: [],
      appointments: [],
      siteSettings: initialSiteSettings,
      staffMembers: initialStaffMembers,
      auditLogs: [],
      affiliates: initialAffiliates,
      websiteConfig: initialWebsiteConfig,
      paymentSettings: initialPaymentSettings,
    }
    dbCache = initialDb
    return initialDb
  }
}

function saveDb(db: DatabaseSchema) {
  dbCache = db
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8')
  } catch (err) {
    console.error('Failed to write database file:', err)
  }
}

// ==========================================
// CATALOG REPOSITORY
// ==========================================

export async function getProducts(options?: {
  categorySlug?: string
  collectionSlug?: string
  material?: string
  firmness?: string
  search?: string
  status?: 'published' | 'draft' | 'archived' | 'all'
}): Promise<Product[]> {
  const db = ensureDb()
  let list = db.products

  // Default to published only unless explicitly requesting draft/all
  if (!options?.status || options.status === 'published') {
    list = list.filter((p) => p.status === 'published')
  } else if (options.status !== 'all') {
    list = list.filter((p) => p.status === options.status)
  }

  if (options?.categorySlug) {
    const cat = db.categories.find((c) => c.slug === options.categorySlug)
    if (cat) {
      list = list.filter((p) => p.categoryId === cat.id)
    }
  }

  if (options?.material) {
    const m = options.material.toLowerCase()
    list = list.filter((p) => p.material?.toLowerCase().includes(m))
  }

  if (options?.firmness) {
    const f = options.firmness.toLowerCase()
    list = list.filter((p) => p.firmness?.toLowerCase().includes(f))
  }

  if (options?.search) {
    const q = options.search.toLowerCase()
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.material?.toLowerCase().includes(q) ||
        p.features.some((f) => f.toLowerCase().includes(q))
    )
  }

  return list
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = ensureDb()
  const found = db.products.find((p) => p.slug === slug)
  return found || null
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = ensureDb()
  const found = db.products.find((p) => p.id === id)
  return found || null
}

export async function saveProduct(product: Product, actorEmail: string = 'system'): Promise<Product> {
  const db = ensureDb()
  const index = db.products.findIndex((p) => p.id === product.id)
  const now = new Date().toISOString()

  if (index >= 0) {
    db.products[index] = { ...product, updatedAt: now }
    logAdminAction(actorEmail, 'product_updated', 'product', product.id, { name: product.name })
  } else {
    const newProd = { ...product, createdAt: now, updatedAt: now }
    db.products.push(newProd)
    logAdminAction(actorEmail, 'product_created', 'product', product.id, { name: product.name })
  }

  saveDb(db)
  return product
}

export async function deleteProduct(id: string, actorEmail: string = 'system'): Promise<boolean> {
  const db = ensureDb()
  const index = db.products.findIndex((p) => p.id === id)
  if (index >= 0) {
    // Soft delete / archive to protect historic order references
    db.products[index].status = 'archived'
    saveDb(db)
    logAdminAction(actorEmail, 'product_archived', 'product', id)
    return true
  }
  return false
}

export async function getCategories(): Promise<Category[]> {
  const db = ensureDb()
  if (!db.categories) db.categories = []
  return [...db.categories].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
}

export async function getNavCategories(): Promise<Category[]> {
  const categories = await getCategories()
  return categories.filter((c) => c.showInNav !== false && c.isActive !== false)
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const db = ensureDb()
  return db.categories?.find((c) => c.id === id) || null
}

export async function createCategory(
  data: Omit<Category, 'id'>,
  actorEmail: string = 'admin'
): Promise<Category> {
  const db = ensureDb()
  if (!db.categories) db.categories = []

  const cleanSlug = data.slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-')
  const existing = db.categories.find((c) => c.slug.toLowerCase() === cleanSlug)
  if (existing) {
    throw new Error(`Category with slug "${cleanSlug}" already exists.`)
  }

  const newCategory: Category = {
    ...data,
    id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    slug: cleanSlug,
    displayOrder: data.displayOrder ?? db.categories.length + 1,
    showInNav: data.showInNav ?? true,
    hasMegaMenu: data.hasMegaMenu ?? false,
    isActive: data.isActive ?? true,
  }

  db.categories.push(newCategory)
  saveDb(db)

  logAdminAction(actorEmail, 'category_created', 'category', newCategory.id, {
    name: newCategory.name,
    slug: newCategory.slug,
  })

  return newCategory
}

export async function updateCategory(
  id: string,
  updates: Partial<Category>,
  actorEmail: string = 'admin'
): Promise<Category | null> {
  const db = ensureDb()
  if (!db.categories) return null

  const cat = db.categories.find((c) => c.id === id)
  if (!cat) return null

  if (updates.slug) {
    const cleanSlug = updates.slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-')
    const collision = db.categories.find((c) => c.slug.toLowerCase() === cleanSlug && c.id !== id)
    if (collision) {
      throw new Error(`Category slug "${cleanSlug}" is already in use.`)
    }
    updates.slug = cleanSlug
  }

  Object.assign(cat, updates)
  saveDb(db)

  logAdminAction(actorEmail, 'category_updated', 'category', id, updates)
  return cat
}

export async function deleteCategory(id: string, actorEmail: string = 'admin'): Promise<boolean> {
  const db = ensureDb()
  if (!db.categories) return false

  const idx = db.categories.findIndex((c) => c.id === id)
  if (idx >= 0) {
    const name = db.categories[idx].name
    db.categories.splice(idx, 1)
    saveDb(db)
    logAdminAction(actorEmail, 'category_deleted', 'category', id, { name })
    return true
  }
  return false
}

export async function reorderCategories(orderedIds: string[], actorEmail: string = 'admin'): Promise<Category[]> {
  const db = ensureDb()
  if (!db.categories) return []

  orderedIds.forEach((id, index) => {
    const cat = db.categories.find((c) => c.id === id)
    if (cat) {
      cat.displayOrder = index + 1
    }
  })

  saveDb(db)
  logAdminAction(actorEmail, 'categories_reordered', 'category', undefined, { orderedIds })
  return getCategories()
}

export async function getCollections(): Promise<Collection[]> {
  const db = ensureDb()
  return db.collections.sort((a, b) => a.displayOrder - b.displayOrder)
}

// ==========================================
// INVENTORY & STOCK MANAGEMENT
// ==========================================

export async function updateVariantStock(
  variantId: string,
  newQuantity: number,
  reason: string,
  actorEmail: string = 'staff'
): Promise<boolean> {
  const db = ensureDb()
  for (const product of db.products) {
    const v = product.variants.find((vr) => vr.id === variantId)
    if (v) {
      const oldQty = v.stockQuantity
      v.stockQuantity = Math.max(0, newQuantity)
      saveDb(db)
      logAdminAction(actorEmail, 'stock_adjusted', 'variant', variantId, {
        product: product.name,
        size: v.sizeName,
        oldQty,
        newQty: v.stockQuantity,
        reason,
      })
      return true
    }
  }
  return false
}

export async function reserveStock(variantId: string, quantity: number): Promise<{ success: boolean; message?: string }> {
  const db = ensureDb()
  for (const product of db.products) {
    const v = product.variants.find((vr) => vr.id === variantId)
    if (v) {
      if (v.stockQuantity < quantity) {
        return { success: false, message: `Only ${v.stockQuantity} unit(s) left in stock for ${v.sizeName}.` }
      }
      v.stockQuantity -= quantity
      saveDb(db)
      return { success: true }
    }
  }
  return { success: false, message: 'Variant not found' }
}

export async function restoreStock(variantId: string, quantity: number): Promise<void> {
  const db = ensureDb()
  for (const product of db.products) {
    const v = product.variants.find((vr) => vr.id === variantId)
    if (v) {
      v.stockQuantity += quantity
      saveDb(db)
      return
    }
  }
}

// ==========================================
// COUPONS & PROMOTIONS REPOSITORY
// ==========================================

export async function getCoupons(): Promise<Coupon[]> {
  const db = ensureDb()
  return db.coupons
}

export async function validateCoupon(
  code: string,
  subtotalSen: number
): Promise<{ isValid: boolean; coupon?: Coupon; discountSen: number; message: string }> {
  if (!code) return { isValid: false, discountSen: 0, message: 'No coupon code provided.' }

  const db = ensureDb()
  const c = db.coupons.find((cp) => cp.code.toUpperCase() === code.trim().toUpperCase())

  if (!c || !c.isActive) {
    return { isValid: false, discountSen: 0, message: 'Invalid or inactive coupon code.' }
  }

  const now = new Date().toISOString()
  if (now < c.startsAt || now > c.endsAt) {
    return { isValid: false, discountSen: 0, message: 'This coupon has expired.' }
  }

  if (c.usageLimit && c.usageCount >= c.usageLimit) {
    return { isValid: false, discountSen: 0, message: 'This coupon has reached its maximum redemption limit.' }
  }

  if (c.minSpendSen && subtotalSen < c.minSpendSen) {
    const diff = (c.minSpendSen - subtotalSen) / 100
    return { isValid: false, discountSen: 0, message: `Minimum spend of RM${(c.minSpendSen / 100).toFixed(2)} required (Add RM${diff.toFixed(2)} more).` }
  }

  let discountSen = 0
  if (c.discountType === 'percentage') {
    discountSen = Math.round((subtotalSen * c.discountValue) / 100)
    if (c.maxDiscountSen && discountSen > c.maxDiscountSen) {
      discountSen = c.maxDiscountSen
    }
  } else if (c.discountType === 'fixed_amount') {
    discountSen = Math.min(c.discountValue, subtotalSen)
  } else if (c.discountType === 'free_shipping') {
    discountSen = 0 // Free shipping handled in shipping fee calculator
  }

  return { isValid: true, coupon: c, discountSen, message: 'Coupon applied successfully.' }
}

export async function recordCouponUsage(code: string): Promise<void> {
  const db = ensureDb()
  const c = db.coupons.find((cp) => cp.code.toUpperCase() === code.trim().toUpperCase())
  if (c) {
    c.usageCount += 1
    saveDb(db)
  }
}

// ==========================================
// ORDERS REPOSITORY
// ==========================================

export async function getOrders(): Promise<Order[]> {
  const db = ensureDb()
  return [...db.orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getOrderById(id: string): Promise<Order | null> {
  const db = ensureDb()
  return db.orders.find((o) => o.id === id) || null
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const db = ensureDb()
  return db.orders.find((o) => o.orderNumber === orderNumber) || null
}

export async function createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> {
  const db = ensureDb()
  const count = db.orders.length + 1001
  const orderNumber = `LENA-2026-${count}`
  const now = new Date().toISOString()

  const newOrder: Order = {
    ...orderData,
    id: `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    orderNumber,
    createdAt: now,
    updatedAt: now,
  }

  db.orders.push(newOrder)
  saveDb(db)

  // Track coupon usage if any
  if (orderData.appliedCoupon) {
    await recordCouponUsage(orderData.appliedCoupon)
  }

  return newOrder
}

export async function updateOrderStatus(
  orderId: string,
  updates: Partial<Pick<Order, 'paymentStatus' | 'fulfillmentStatus' | 'trackingNumber' | 'carrier' | 'internalNotes' | 'paymentId'>>,
  actorEmail: string = 'system'
): Promise<Order | null> {
  const db = ensureDb()
  const order = db.orders.find((o) => o.id === orderId)
  if (!order) return null

  const previousPaymentStatus = order.paymentStatus
  const previousFulfillmentStatus = order.fulfillmentStatus
  Object.assign(order, updates, { updatedAt: new Date().toISOString() })
  saveDb(db)

  // If order is cancelled or payment fails, automatically return reserved stock back to inventory
  const isNowCancelledOrFailed =
    (updates.fulfillmentStatus === 'cancelled' && previousFulfillmentStatus !== 'cancelled') ||
    (updates.paymentStatus === 'failed' && previousPaymentStatus !== 'failed')

  if (isNowCancelledOrFailed && order.items && order.items.length > 0) {
    for (const item of order.items) {
      await restoreStock(item.variantId, item.quantity)
    }
  }

  // When order becomes paid, credit affiliate if attributed
  if (
    updates.paymentStatus === 'paid' &&
    previousPaymentStatus !== 'paid' &&
    order.affiliateCode
  ) {
    await recordAffiliateSale(
      order.affiliateCode,
      order.totalSen,
      order.affiliateCommissionSen || 0
    )
  }

  logAdminAction(actorEmail, 'order_status_updated', 'order', orderId, updates)
  return order
}

export async function processRefund(
  orderId: string,
  amountSen: number,
  reason: string,
  actorEmail: string
): Promise<{ success: boolean; message: string }> {
  const db = ensureDb()
  const order = db.orders.find((o) => o.id === orderId)
  if (!order) return { success: false, message: 'Order not found' }

  if (amountSen > order.totalSen) {
    return { success: false, message: 'Refund amount cannot exceed order total.' }
  }

  order.paymentStatus = amountSen === order.totalSen ? 'refunded' : 'partially_refunded'
  order.updatedAt = new Date().toISOString()

  saveDb(db)
  logAdminAction(actorEmail, 'order_refunded', 'order', orderId, {
    orderNumber: order.orderNumber,
    amountSen,
    reason,
  })

  return { success: true, message: 'Refund processed successfully.' }
}

// ==========================================
// REVIEWS & WISHLISTS
// ==========================================

export async function getReviews(productId?: string): Promise<Review[]> {
  const db = ensureDb()
  if (productId) {
    return db.reviews.filter((r) => r.productId === productId && r.status === 'approved')
  }
  return db.reviews
}

export async function addReview(review: Omit<Review, 'id' | 'createdAt' | 'status'>): Promise<Review> {
  const db = ensureDb()
  const newRev: Review = {
    ...review,
    id: `rev-${Date.now()}`,
    status: 'approved', // auto-approved for verified purchasers demo
    createdAt: new Date().toISOString(),
  }
  db.reviews.push(newRev)
  saveDb(db)
  return newRev
}

// ==========================================
// SHOWROOMS & APPOINTMENTS
// ==========================================

export async function getShowrooms(): Promise<Showroom[]> {
  const db = ensureDb()
  return db.showrooms.filter((s) => s.isActive).sort((a, b) => a.displayOrder - b.displayOrder)
}

export async function submitAppointment(data: Omit<AppointmentRequest, 'id' | 'status' | 'createdAt'>): Promise<AppointmentRequest> {
  const db = ensureDb()
  const req: AppointmentRequest = {
    ...data,
    id: `apt-${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  db.appointments.push(req)
  saveDb(db)
  return req
}

export async function getAppointments(): Promise<AppointmentRequest[]> {
  const db = ensureDb()
  return db.appointments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// ==========================================
// WARRANTY & SUPPORT ENQUIRIES
// ==========================================

export async function submitWarranty(data: Omit<WarrantyRegistration, 'id' | 'status' | 'createdAt'>): Promise<WarrantyRegistration> {
  const db = ensureDb()
  const reg: WarrantyRegistration = {
    ...data,
    id: `war-${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  db.warranties.push(reg)
  saveDb(db)
  return reg
}

export async function getWarrantyRegistrations(): Promise<WarrantyRegistration[]> {
  const db = ensureDb()
  return db.warranties.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function updateWarrantyStatus(id: string, status: 'pending' | 'verified' | 'rejected', notes?: string): Promise<boolean> {
  const db = ensureDb()
  const w = db.warranties.find((item) => item.id === id)
  if (!w) return false
  w.status = status
  if (notes) w.internalNotes = notes
  saveDb(db)
  return true
}

export async function submitContactEnquiry(data: Omit<ContactEnquiry, 'id' | 'status' | 'createdAt'>): Promise<ContactEnquiry> {
  const db = ensureDb()
  const item: ContactEnquiry = {
    ...data,
    id: `enq-${Date.now()}`,
    status: 'new',
    createdAt: new Date().toISOString(),
  }
  db.contactEnquiries.push(item)
  saveDb(db)
  return item
}

export async function getContactEnquiries(): Promise<ContactEnquiry[]> {
  const db = ensureDb()
  return db.contactEnquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function submitBusinessEnquiry(data: Omit<BusinessEnquiry, 'id' | 'status' | 'createdAt'>): Promise<BusinessEnquiry> {
  const db = ensureDb()
  const item: BusinessEnquiry = {
    ...data,
    id: `biz-${Date.now()}`,
    status: 'new',
    createdAt: new Date().toISOString(),
  }
  db.businessEnquiries.push(item)
  saveDb(db)
  return item
}

export async function getBusinessEnquiries(): Promise<BusinessEnquiry[]> {
  const db = ensureDb()
  return db.businessEnquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// ==========================================
// BLOG & EDITORIAL
// ==========================================

export async function getBlogPosts(): Promise<BlogPost[]> {
  const db = ensureDb()
  return db.blogPosts.filter((b) => b.isPublished).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const db = ensureDb()
  return db.blogPosts.find((b) => b.slug === slug) || null
}

// ==========================================
// SITE SETTINGS & STAFF AUTH
// ==========================================

export async function getSiteSettings(): Promise<SiteSettings> {
  const db = ensureDb()
  return db.siteSettings
}

export async function updateSiteSettings(settings: Partial<SiteSettings>, actorEmail: string = 'owner'): Promise<SiteSettings> {
  const db = ensureDb()
  db.siteSettings = { ...db.siteSettings, ...settings }
  saveDb(db)
  logAdminAction(actorEmail, 'settings_updated', 'settings', 'siteSettings', settings)
  return db.siteSettings
}

export async function getWebsiteConfig(): Promise<WebsiteConfig> {
  const db = ensureDb()
  if (!db.websiteConfig) {
    db.websiteConfig = initialWebsiteConfig
    saveDb(db)
  } else {
    let changed = false
    if (!db.websiteConfig.megaMenu) {
      db.websiteConfig.megaMenu = initialWebsiteConfig.megaMenu
      changed = true
    }
    if (!db.websiteConfig.appearance) {
      db.websiteConfig.appearance = initialWebsiteConfig.appearance || {
        enableEntranceAnimations: true,
        enableFloatingBadges: true,
        cardBorderRadius: 'rounded-2xl',
      }
      changed = true
    }
    if (!db.websiteConfig.companyProfile) {
      db.websiteConfig.companyProfile = initialWebsiteConfig.companyProfile
      changed = true
    }
    if (changed) {
      saveDb(db)
    }
  }
  return db.websiteConfig
}

export async function updateWebsiteConfig(
  config: Partial<WebsiteConfig>,
  actorEmail: string = 'owner'
): Promise<WebsiteConfig> {
  const db = ensureDb()
  const current = db.websiteConfig || initialWebsiteConfig
  db.websiteConfig = {
    ...current,
    ...config,
    theme: {
      ...current.theme,
      ...(config.theme || {}),
    },
    announcement: {
      ...current.announcement,
      ...(config.announcement || {}),
    },
    megaMenu: {
      ...(current.megaMenu || initialWebsiteConfig.megaMenu),
      ...(config.megaMenu || {}),
      columns: config.megaMenu?.columns || (current.megaMenu?.columns ? current.megaMenu.columns : initialWebsiteConfig.megaMenu.columns),
      promoCard: {
        ...(current.megaMenu?.promoCard || initialWebsiteConfig.megaMenu.promoCard),
        ...(config.megaMenu?.promoCard || {}),
      },
    },
    hero: {
      ...current.hero,
      ...(config.hero || {}),
      slides: config.hero?.slides || current.hero.slides,
    },
    reassurance: {
      ...current.reassurance,
      ...(config.reassurance || {}),
      items: config.reassurance?.items || current.reassurance.items,
    },
    promotionsBanner: {
      ...current.promotionsBanner,
      ...(config.promotionsBanner || {}),
    },
    storySection: {
      ...current.storySection,
      ...(config.storySection || {}),
    },
    companyProfile: {
      ...(initialWebsiteConfig.companyProfile || {}),
      ...(current.companyProfile || {}),
      ...(config.companyProfile || {}),
      hero: {
        ...(initialWebsiteConfig.companyProfile?.hero || {}),
        ...(current.companyProfile?.hero || {}),
        ...(config.companyProfile?.hero || {}),
      },
      about: {
        ...(initialWebsiteConfig.companyProfile?.about || {}),
        ...(current.companyProfile?.about || {}),
        ...(config.companyProfile?.about || {}),
      },
      facility: {
        ...(initialWebsiteConfig.companyProfile?.facility || {}),
        ...(current.companyProfile?.facility || {}),
        ...(config.companyProfile?.facility || {}),
      },
      visionMission: {
        ...(initialWebsiteConfig.companyProfile?.visionMission || {}),
        ...(current.companyProfile?.visionMission || {}),
        ...(config.companyProfile?.visionMission || {}),
      },
    } as any,
    socialAndContact: {
      ...current.socialAndContact,
      ...(config.socialAndContact || {}),
    },
    appearance: {
      ...initialWebsiteConfig.appearance,
      ...(current.appearance || {}),
      ...(config.appearance || {}),
    },
  }
  saveDb(db)
  logAdminAction(actorEmail, 'website_config_updated', 'website_config', 'websiteConfig', config)
  return db.websiteConfig
}


export async function getStaffMembers(): Promise<StaffMember[]> {
  const db = ensureDb()
  return db.staffMembers
}

export async function updateStaffMemberName(emailOrId: string, newName: string): Promise<boolean> {
  const db = ensureDb()
  const clean = emailOrId.trim().toLowerCase()
  let changed = false
  for (const s of db.staffMembers) {
    if (
      s.email.toLowerCase() === clean ||
      s.id === emailOrId ||
      (s.role === 'owner' && (clean.includes('owner') || clean.includes('admin') || clean.includes('kamaar')))
    ) {
      s.name = newName.trim()
      changed = true
    }
  }
  if (changed) {
    saveDb(db)
  }
  return changed
}

export function logAdminAction(actorEmail: string, action: string, entityType: string, entityId?: string, details?: Record<string, any>) {
  const db = ensureDb()
  const log: AuditLog = {
    id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    actorEmail,
    action,
    entityType,
    entityId,
    details,
    createdAt: new Date().toISOString(),
  }
  db.auditLogs.unshift(log)
  // Had maksimum simpanan: 100 rekod terkini/terawal sahaja
  if (db.auditLogs.length > 100) {
    db.auditLogs = db.auditLogs.slice(0, 100)
  }
  saveDb(db)
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  const db = ensureDb()
  if (db.auditLogs.length > 100) {
    db.auditLogs = db.auditLogs.slice(0, 100)
    saveDb(db)
  }
  return db.auditLogs
}

export async function deleteAuditLog(id: string): Promise<boolean> {
  const db = ensureDb()
  const initialLength = db.auditLogs.length
  db.auditLogs = db.auditLogs.filter((l) => l.id !== id)
  if (db.auditLogs.length !== initialLength) {
    saveDb(db)
    return true
  }
  return false
}

export async function deleteAuditLogs(ids: string[]): Promise<number> {
  const db = ensureDb()
  const idSet = new Set(ids)
  const initialLength = db.auditLogs.length
  db.auditLogs = db.auditLogs.filter((l) => !idSet.has(l.id))
  const removed = initialLength - db.auditLogs.length
  if (removed > 0) {
    saveDb(db)
  }
  return removed
}

export async function clearAuditLogs(): Promise<boolean> {
  const db = ensureDb()
  db.auditLogs = []
  saveDb(db)
  return true
}

// ==========================================
// PAYMENT GATEWAY & METHODS MANAGEMENT
// ==========================================

export async function getPaymentSettings(): Promise<PaymentSettings> {
  const db = ensureDb()
  if (!db.paymentSettings) {
    db.paymentSettings = initialPaymentSettings
    saveDb(db)
  }
  return db.paymentSettings
}

export async function updatePaymentSettings(
  settings: Partial<PaymentSettings>,
  actorEmail: string = 'admin'
): Promise<PaymentSettings> {
  const db = ensureDb()
  if (!db.paymentSettings) {
    db.paymentSettings = initialPaymentSettings
  }
  db.paymentSettings = {
    ...db.paymentSettings,
    ...settings,
    methods: settings.methods || db.paymentSettings.methods,
  }
  saveDb(db)
  logAdminAction(actorEmail, 'payment_settings_updated', 'payment_settings', 'paymentSettings', settings)
  return db.paymentSettings
}

export async function savePaymentMethod(
  method: PaymentMethodConfig,
  actorEmail: string = 'admin'
): Promise<PaymentMethodConfig> {
  const db = ensureDb()
  if (!db.paymentSettings) {
    db.paymentSettings = { ...initialPaymentSettings }
  }
  const idx = db.paymentSettings.methods.findIndex((m) => m.id === method.id)
  if (idx >= 0) {
    db.paymentSettings.methods[idx] = method
  } else {
    // Determine sortOrder if not provided
    if (!method.sortOrder) {
      method.sortOrder = db.paymentSettings.methods.length + 1
    }
    db.paymentSettings.methods.push(method)
  }
  // If this method is set as default, unset others
  if (method.isDefault) {
    db.paymentSettings.defaultMethodId = method.id
    db.paymentSettings.methods.forEach((m) => {
      if (m.id !== method.id) m.isDefault = false
    })
  }
  saveDb(db)
  logAdminAction(actorEmail, 'payment_method_saved', 'payment_method', method.id, {
    name: method.name,
    enabled: method.enabled,
    providerType: method.providerType,
  })
  return method
}

export async function deletePaymentMethod(
  id: string,
  actorEmail: string = 'admin'
): Promise<boolean> {
  const db = ensureDb()
  if (!db.paymentSettings) return false
  const initialLength = db.paymentSettings.methods.length
  db.paymentSettings.methods = db.paymentSettings.methods.filter((m) => m.id !== id)
  if (db.paymentSettings.methods.length !== initialLength) {
    // If deleted method was default, set first remaining as default
    if (db.paymentSettings.defaultMethodId === id && db.paymentSettings.methods.length > 0) {
      db.paymentSettings.defaultMethodId = db.paymentSettings.methods[0].id
      db.paymentSettings.methods[0].isDefault = true
    }
    saveDb(db)
    logAdminAction(actorEmail, 'payment_method_deleted', 'payment_method', id)
    return true
  }
  return false
}

export async function reorderPaymentMethods(
  orderedIds: string[],
  actorEmail: string = 'admin'
): Promise<PaymentMethodConfig[]> {
  const db = ensureDb()
  if (!db.paymentSettings) {
    db.paymentSettings = initialPaymentSettings
  }
  const methodMap = new Map(db.paymentSettings.methods.map((m) => [m.id, m]))
  const newMethods: PaymentMethodConfig[] = []

  orderedIds.forEach((id, index) => {
    const method = methodMap.get(id)
    if (method) {
      method.sortOrder = index + 1
      newMethods.push(method)
      methodMap.delete(id)
    }
  })

  // Append any methods not in orderedIds list
  methodMap.forEach((method) => {
    method.sortOrder = newMethods.length + 1
    newMethods.push(method)
  })

  db.paymentSettings.methods = newMethods
  saveDb(db)
  logAdminAction(actorEmail, 'payment_methods_reordered', 'payment_settings', 'methods', { count: newMethods.length })
  return db.paymentSettings.methods
}

export async function getOrdersByCustomerEmail(email: string): Promise<Order[]> {
  const db = ensureDb()
  const clean = email.trim().toLowerCase()
  return db.orders
    .filter((o) => o.customerEmail.toLowerCase() === clean)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getWarrantiesByCustomerEmail(email: string): Promise<WarrantyRegistration[]> {
  const db = ensureDb()
  const clean = email.trim().toLowerCase()
  return db.warranties
    .filter((w) => w.customerEmail.toLowerCase() === clean)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function saveCoupon(coupon: Coupon, actorEmail: string = 'staff'): Promise<Coupon> {
  const db = ensureDb()
  const idx = db.coupons.findIndex((c) => c.id === coupon.id)
  if (idx >= 0) {
    db.coupons[idx] = coupon
    logAdminAction(actorEmail, 'coupon_updated', 'coupon', coupon.id, { code: coupon.code })
  } else {
    db.coupons.push(coupon)
    logAdminAction(actorEmail, 'coupon_created', 'coupon', coupon.id, { code: coupon.code })
  }
  saveDb(db)
  return coupon
}

export async function deleteCoupon(id: string, actorEmail: string = 'staff'): Promise<boolean> {
  const db = ensureDb()
  const idx = db.coupons.findIndex((c) => c.id === id)
  if (idx >= 0) {
    db.coupons.splice(idx, 1)
    saveDb(db)
    logAdminAction(actorEmail, 'coupon_deleted', 'coupon', id)
    return true
  }
  return false
}

export async function saveShowroom(showroom: Showroom, actorEmail: string = 'staff'): Promise<Showroom> {
  const db = ensureDb()
  const idx = db.showrooms.findIndex((s) => s.id === showroom.id)
  if (idx >= 0) {
    db.showrooms[idx] = showroom
    logAdminAction(actorEmail, 'showroom_updated', 'showroom', showroom.id, { name: showroom.name })
  } else {
    db.showrooms.push(showroom)
    logAdminAction(actorEmail, 'showroom_created', 'showroom', showroom.id, { name: showroom.name })
  }
  saveDb(db)
  return showroom
}

export async function deleteShowroom(id: string, actorEmail: string = 'staff'): Promise<boolean> {
  const db = ensureDb()
  const idx = db.showrooms.findIndex((s) => s.id === id)
  if (idx >= 0) {
    db.showrooms.splice(idx, 1)
    saveDb(db)
    logAdminAction(actorEmail, 'showroom_deleted', 'showroom', id)
    return true
  }
  return false
}

export async function saveBlogPost(post: BlogPost, actorEmail: string = 'staff'): Promise<BlogPost> {
  const db = ensureDb()
  const idx = db.blogPosts.findIndex((b) => b.id === post.id)
  if (idx >= 0) {
    db.blogPosts[idx] = post
    logAdminAction(actorEmail, 'blog_updated', 'blogPost', post.id, { title: post.title })
  } else {
    db.blogPosts.push(post)
    logAdminAction(actorEmail, 'blog_created', 'blogPost', post.id, { title: post.title })
  }
  saveDb(db)
  return post
}

export async function deleteBlogPost(id: string, actorEmail: string = 'staff'): Promise<boolean> {
  const db = ensureDb()
  const idx = db.blogPosts.findIndex((b) => b.id === id)
  if (idx >= 0) {
    db.blogPosts.splice(idx, 1)
    saveDb(db)
    logAdminAction(actorEmail, 'blog_deleted', 'blogPost', id)
    return true
  }
  return false
}

export async function updateAppointmentStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled'): Promise<boolean> {
  const db = ensureDb()
  const apt = db.appointments.find((a) => a.id === id)
  if (!apt) return false
  apt.status = status
  saveDb(db)
  return true
}

export async function updateContactStatus(id: string, status: 'new' | 'in_progress' | 'resolved'): Promise<boolean> {
  const db = ensureDb()
  const item = db.contactEnquiries.find((c) => c.id === id)
  if (!item) return false
  item.status = status
  saveDb(db)
  return true
}

export async function updateBusinessStatus(id: string, status: 'new' | 'in_progress' | 'resolved'): Promise<boolean> {
  const db = ensureDb()
  const item = db.businessEnquiries.find((b) => b.id === id)
  if (!item) return false
  item.status = status
  saveDb(db)
  return true
}

// ==========================================
// AFFILIATE & REFERRAL REPOSITORY
// ==========================================

export async function getAffiliates(): Promise<Affiliate[]> {
  const db = ensureDb()
  return db.affiliates || []
}

export async function getAffiliateById(id: string): Promise<Affiliate | null> {
  const db = ensureDb()
  return db.affiliates?.find((a) => a.id === id) || null
}

export async function getAffiliateByCode(code: string): Promise<Affiliate | null> {
  const db = ensureDb()
  if (!code) return null
  const clean = code.trim().toUpperCase()
  return db.affiliates?.find((a) => a.code.toUpperCase() === clean && a.isActive) || null
}

export async function getAffiliateByIdentifier(identifier: string): Promise<Affiliate | null> {
  const db = ensureDb()
  if (!identifier) return null
  const clean = identifier.trim().toLowerCase()
  return (
    db.affiliates?.find(
      (a) =>
        (a.code.toLowerCase() === clean || a.email.toLowerCase() === clean) &&
        a.isActive
    ) || null
  )
}

export async function getAffiliateOrders(code: string): Promise<Order[]> {
  const db = ensureDb()
  if (!code) return []
  const clean = code.trim().toUpperCase()
  return (
    db.orders
      ?.filter((o) => o.affiliateCode && o.affiliateCode.trim().toUpperCase() === clean)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) || []
  )
}

export async function createAffiliate(
  data: Omit<Affiliate, 'id' | 'createdAt' | 'totalSalesCount' | 'totalSalesRevenueSen' | 'totalCommissionSen'>,
  actorEmail: string = 'admin'
): Promise<Affiliate> {
  const db = ensureDb()
  if (!db.affiliates) db.affiliates = []

  const cleanCode = data.code.trim().toUpperCase()
  const existing = db.affiliates.find((a) => a.code.toUpperCase() === cleanCode)
  if (existing) {
    throw new Error(`Affiliate code "${cleanCode}" is already in use.`)
  }

  const newAffiliate: Affiliate = {
    ...data,
    id: `aff-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    code: cleanCode,
    totalSalesCount: 0,
    totalSalesRevenueSen: 0,
    totalCommissionSen: 0,
    createdAt: new Date().toISOString(),
  }

  db.affiliates.push(newAffiliate)
  saveDb(db)

  logAdminAction(actorEmail, 'affiliate_created', 'affiliate', newAffiliate.id, {
    code: newAffiliate.code,
    name: newAffiliate.name,
  })

  return newAffiliate
}

export async function updateAffiliate(
  id: string,
  updates: Partial<Affiliate>,
  actorEmail: string = 'admin'
): Promise<Affiliate | null> {
  const db = ensureDb()
  if (!db.affiliates) return null

  const affiliate = db.affiliates.find((a) => a.id === id)
  if (!affiliate) return null

  if (updates.code) {
    const cleanCode = updates.code.trim().toUpperCase()
    const collision = db.affiliates.find((a) => a.code.toUpperCase() === cleanCode && a.id !== id)
    if (collision) {
      throw new Error(`Affiliate code "${cleanCode}" is already in use by another agent.`)
    }
    updates.code = cleanCode
  }

  Object.assign(affiliate, updates)
  saveDb(db)

  logAdminAction(actorEmail, 'affiliate_updated', 'affiliate', id, updates)
  return affiliate
}

export async function deleteAffiliate(id: string, actorEmail: string = 'admin'): Promise<boolean> {
  const db = ensureDb()
  if (!db.affiliates) return false

  const idx = db.affiliates.findIndex((a) => a.id === id)
  if (idx >= 0) {
    const code = db.affiliates[idx].code
    db.affiliates.splice(idx, 1)
    saveDb(db)
    logAdminAction(actorEmail, 'affiliate_deleted', 'affiliate', id, { code })
    return true
  }
  return false
}

export async function recordAffiliateSale(
  code: string,
  saleRevenueSen: number,
  commissionSen: number
): Promise<void> {
  const db = ensureDb()
  if (!db.affiliates) return

  const clean = code.trim().toUpperCase()
  const affiliate = db.affiliates.find((a) => a.code.toUpperCase() === clean)
  if (!affiliate) return

  affiliate.totalSalesCount = (affiliate.totalSalesCount || 0) + 1
  affiliate.totalSalesRevenueSen = (affiliate.totalSalesRevenueSen || 0) + saleRevenueSen
  affiliate.totalCommissionSen = (affiliate.totalCommissionSen || 0) + commissionSen

  saveDb(db)
}

export async function requestAffiliatePasswordReset(
  identifier: string,
  method: 'email' | 'phone'
): Promise<{ affiliate: Affiliate; otp: string } | null> {
  const db = ensureDb()
  if (!db.affiliates) return null
  const clean = identifier.trim().toLowerCase()
  const affiliate = db.affiliates.find(
    (a) => (a.code.toLowerCase() === clean || a.email.toLowerCase() === clean) && a.isActive
  )
  if (!affiliate) return null

  // Generate 6-digit OTP code
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  affiliate.passwordResetOtp = otp
  affiliate.passwordResetMethod = method
  affiliate.passwordResetRequestedAt = new Date().toISOString()
  affiliate.passwordResetVerified = false

  saveDb(db)
  return { affiliate, otp }
}

export async function verifyAffiliatePasswordResetOtp(
  identifier: string,
  otp: string
): Promise<{ success: boolean; affiliate?: Affiliate; error?: string }> {
  const db = ensureDb()
  if (!db.affiliates) return { success: false, error: 'Tiada pangkalan data ejen.' }
  const clean = identifier.trim().toLowerCase()
  const affiliate = db.affiliates.find(
    (a) => (a.code.toLowerCase() === clean || a.email.toLowerCase() === clean) && a.isActive
  )
  if (!affiliate) return { success: false, error: 'Akaun ejen tidak ditemui.' }

  if (!affiliate.passwordResetOtp || affiliate.passwordResetOtp !== otp.trim()) {
    return { success: false, error: 'Kod pengesahan OTP tidak sah. Sila semak semula.' }
  }

  affiliate.passwordResetVerified = true
  affiliate.passwordResetRequested = true
  saveDb(db)

  logAdminAction(affiliate.email, 'affiliate_password_reset_verified', 'affiliate', affiliate.id, {
    code: affiliate.code,
    method: affiliate.passwordResetMethod,
  })

  return { success: true, affiliate }
}

export async function adminResetAffiliatePassword(
  affiliateId: string,
  newPasscode: string,
  adminNote?: string,
  actorEmail: string = 'admin'
): Promise<Affiliate | null> {
  const db = ensureDb()
  if (!db.affiliates) return null
  const affiliate = db.affiliates.find((a) => a.id === affiliateId)
  if (!affiliate) return null

  affiliate.accessKey = newPasscode.trim()
  affiliate.passwordResetRequested = false
  affiliate.passwordResetOtp = undefined
  affiliate.passwordResetVerified = false

  if (adminNote && adminNote.trim()) {
    affiliate.adminNotes = adminNote.trim()
  }

  saveDb(db)
  logAdminAction(actorEmail, 'affiliate_password_reset_by_admin', 'affiliate', affiliate.id, {
    code: affiliate.code,
    name: affiliate.name,
  })

  return affiliate
}
