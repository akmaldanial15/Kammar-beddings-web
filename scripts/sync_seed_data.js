const fs = require('fs');
const path = require('path');

const db = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/lena_db.json'), 'utf8'));

const tsContent = `// Rich Seed Dataset for TUNAS SINAR JAYA ENTERPRISE (KAMAAR BEDDINGS)
import {
  Product,
  Category,
  Collection,
  Coupon,
  Showroom,
  BlogPost,
  SiteSettings,
  StaffMember,
  Review,
  Affiliate,
  WebsiteConfig,
  PaymentSettings,
} from '@/types'

export const initialCategories: Category[] = ${JSON.stringify(db.categories, null, 2)}

export const initialCollections: Collection[] = ${JSON.stringify(db.collections, null, 2)}

export const initialProducts: Product[] = ${JSON.stringify(db.products, null, 2)}

export const initialCoupons: Coupon[] = ${JSON.stringify(db.coupons, null, 2)}

export const initialShowrooms: Showroom[] = ${JSON.stringify(db.showrooms, null, 2)}

export const initialBlogPosts: BlogPost[] = ${JSON.stringify(db.blogPosts, null, 2)}

export const initialSiteSettings: SiteSettings = ${JSON.stringify(db.siteSettings, null, 2)}

export const initialStaffMembers: StaffMember[] = ${JSON.stringify(db.staffMembers, null, 2)}

export const initialReviews: Review[] = ${JSON.stringify(db.reviews, null, 2)}

export const initialAffiliates: Affiliate[] = ${JSON.stringify(db.affiliates, null, 2)}

export const initialWebsiteConfig: WebsiteConfig = ${JSON.stringify(db.websiteConfig, null, 2)}

export const initialPaymentSettings: PaymentSettings = ${JSON.stringify(db.paymentSettings, null, 2)}
`;

fs.writeFileSync(path.join(__dirname, '../lib/db/seedData.ts'), tsContent, 'utf8');
console.log('Successfully updated lib/db/seedData.ts!');
