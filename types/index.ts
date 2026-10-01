// Core Type Definitions for LENA SLEEP Platform

export type ProductType = 'mattress' | 'pillow' | 'topper' | 'bedframe' | 'bedding'

export type Firmness = 'Soft' | 'Medium Soft' | 'Medium' | 'Medium Firm' | 'Firm' | 'Orthopaedic'

export type MattressMaterial = '100% Natural Latex' | 'Hybrid Pocket Spring' | 'Memory Foam' | 'Orthopaedic Support'

export type SizeName = 'Single' | 'Super Single' | 'Queen' | 'King' | 'Standard' | 'King Pillow'

export interface ProductVariant {
  id: string
  productId: string
  sku: string
  sizeName: SizeName | string
  dimensions: string
  priceSen: number         // RM1,299.00 = 129900
  compareAtPriceSen?: number
  stockQuantity: number
  leadTimeDays?: number
  isActive: boolean
  isAvailable?: boolean
}

export interface ProductImage {
  id: string
  productId: string
  imageUrl: string
  altText: string
  displayOrder: number
  isPrimary: boolean
}

export interface ProductLayer {
  number: number
  name: string
  description: string
  thickness?: string
}

export interface ProductFAQ {
  question: string
  answer: string
}

export interface Product {
  id: string
  name: string
  slug: string
  subtitle?: string
  tagline?: string
  description: string
  shortDescription?: string
  categoryId?: string
  productType: ProductType
  material?: MattressMaterial | string
  firmness?: Firmness | string
  firmnessScale?: number // 1 to 10
  thicknessCm?: number
  warrantyYears: number
  trialNights: number
  features: string[]
  layers: ProductLayer[]
  specifications: Record<string, string>
  faq: ProductFAQ[]
  seoTitle?: string
  seoDescription?: string
  status: 'draft' | 'published' | 'archived'
  isFeatured: boolean
  variants: ProductVariant[]
  images: ProductImage[]
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  imageUrl: string
  displayOrder: number
}

export interface Collection {
  id: string
  name: string
  slug: string
  description: string
  bannerUrl: string
  displayOrder: number
  isFeatured: boolean
}

export interface CartItem {
  variantId: string
  productId: string
  productName: string
  sizeName: string
  sku: string
  dimensions: string
  priceSen: number
  compareAtPriceSen?: number
  imageUrl: string
  quantity: number
  stockAvailable: number
}

export interface Cart {
  items: CartItem[]
  couponCode?: string
  notes?: string
}

export interface Coupon {
  id: string
  code: string
  description: string
  discountType: 'percentage' | 'fixed_amount' | 'free_shipping'
  discountValue: number // percentage e.g. 15 for 15%, or sen e.g. 10000 for RM100
  minSpendSen: number
  maxDiscountSen?: number
  usageLimit?: number
  usageCount: number
  perCustomerLimit?: number
  startsAt: string
  endsAt: string
  isActive: boolean
}

export interface Address {
  fullName: string
  name?: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postcode: string
  country: string
  deliveryNotes?: string
}

export type PaymentStatus = 'unpaid' | 'pending' | 'paid' | 'failed' | 'partially_refunded' | 'refunded'

export type FulfillmentStatus = 'unfulfilled' | 'processing' | 'scheduled' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  id: string
  orderId: string
  variantId: string
  productName: string
  sizeName: string
  sku: string
  dimensions: string
  unitPriceSen: number
  priceSen?: number
  quantity: number
  lineTotalSen: number
  imageUrl?: string
  image?: string
}

export interface Order {
  id: string
  orderNumber: string
  userId?: string
  customerEmail: string
  customerName: string
  customerPhone: string
  shippingAddress: Address
  billingAddress: Address
  deliveryNotes?: string
  preferredDeliveryDate?: string
  hasLiftAccess?: boolean
  floorLevel?: string
  subtotalSen: number
  discountSen: number
  shippingSen: number
  shippingFeeSen?: number
  taxSen: number
  totalSen: number
  appliedCoupon?: string
  paymentStatus: PaymentStatus
  fulfillmentStatus: FulfillmentStatus
  paymentProvider: string
  paymentId?: string
  items: OrderItem[]
  trackingNumber?: string
  carrier?: string
  internalNotes?: string
  affiliateCode?: string
  affiliateName?: string
  affiliateCommissionSen?: number
  affiliateRemark?: string
  createdAt: string
  updatedAt: string
}

export interface Affiliate {
  id: string
  code: string // e.g. 'AFF-DANIAL', 'SITI10'
  name: string
  email: string
  phone: string
  bankName: string
  bankAccountNumber: string
  commissionType: 'percentage' | 'fixed_amount'
  commissionRate: number // e.g. 10 for 10%
  totalSalesCount: number
  totalSalesRevenueSen: number
  totalCommissionSen: number
  isActive: boolean
  createdAt: string
  adminNotes?: string // Private notes or payout communications sent from admin to agent
  accessKey?: string // Passcode/PIN for agent login
}

export interface Review {
  id: string
  productId: string
  customerName: string
  rating: number // 1 to 5
  title: string
  content: string
  isVerifiedPurchase: boolean
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

export interface Showroom {
  id: string
  name: string
  slug?: string
  address: string
  city?: string
  state: string
  postcode?: string
  phone: string
  openingHours: string
  mapUrl: string
  imageUrl?: string
  image?: string
  displayOrder: number
  isActive: boolean
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  imageUrl: string
  tags: string[]
  publishedAt: string
  isPublished: boolean
}

export interface WarrantyRegistration {
  id: string
  fullName?: string
  customerName: string
  email?: string
  customerEmail: string
  phone?: string
  customerPhone?: string
  productName: string
  sizeName?: string
  invoiceNumber: string
  purchaseDate: string
  deliveryDate?: string
  retailer: string
  receiptFileUrl?: string
  status: 'pending' | 'verified' | 'rejected'
  internalNotes?: string
  createdAt: string
}

export interface ContactEnquiry {
  id: string
  name: string
  email: string
  phone?: string
  orderNumber?: string
  subject?: string
  enquiryType?: string
  message: string
  status: 'new' | 'in_progress' | 'resolved'
  createdAt: string
}

export interface BusinessEnquiry {
  id: string
  companyName: string
  contactName?: string
  contactPerson?: string
  email: string
  phone: string
  businessType?: string
  projectType?: string
  estimatedQuantity?: string
  estimatedUnits?: number
  message?: string
  details?: string
  status: 'new' | 'in_progress' | 'resolved'
  createdAt: string
}

export interface AppointmentRequest {
  id: string
  showroomId?: string
  showroomName?: string
  customerName: string
  customerEmail?: string
  email?: string
  customerPhone?: string
  phone?: string
  preferredDate: string
  preferredTime?: string
  preferredTimeSlot?: string
  mattressInterests?: string
  notes?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
}

export interface SiteSettings {
  brandName: string
  logoText: string
  tagline: string
  currency: string
  currencySymbol?: string
  contactEmail: string
  contactPhone: string
  whatsappNumber: string
  announcementText: string
  announcementUrl?: string
  isAnnouncementActive: boolean
  announcementActive?: boolean
  freeShippingThresholdSen: number
  peninsularShippingSen: number
  eastMalaysiaShippingSen: number
  warrantyDefaultYears: number
  trialDefaultNights: number
}

export type StaffRole = 'owner' | 'catalog_manager' | 'order_manager' | 'content_editor'

export interface StaffMember {
  id: string
  email: string
  name: string
  role: StaffRole
  isActive: boolean
  createdAt: string
}

export interface AuditLog {
  id: string
  actorEmail: string
  action: string
  entityType: string
  entityId?: string
  details?: Record<string, any>
  createdAt: string
}
