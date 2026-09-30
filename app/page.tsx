import React from 'react'
import { getProducts, getCoupons, getShowrooms, getBlogPosts, getReviews } from '@/lib/db'
import { HeroCarousel } from '@/components/home/HeroCarousel'
import { ReassuranceStrip } from '@/components/home/ReassuranceStrip'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { CuratedCollection } from '@/components/home/CuratedCollection'
import { OffersSection } from '@/components/home/OffersSection'
import { LookbookSection } from '@/components/home/LookbookSection'
import { MaterialAnatomy } from '@/components/home/MaterialAnatomy'
import { FinderCallout } from '@/components/home/FinderCallout'
import { ReviewsSection } from '@/components/home/ReviewsSection'
import { ShowroomCallout } from '@/components/home/ShowroomCallout'
import { JournalSection } from '@/components/home/JournalSection'

export const revalidate = 60 // ISR revalidation

export default async function HomePage() {
  const [products, coupons, showrooms, blogPosts, reviews] = await Promise.all([
    getProducts({ status: 'published' }),
    getCoupons(),
    getShowrooms(),
    getBlogPosts(),
    getReviews(),
  ])

  return (
    <div className="flex flex-col w-full">
      {/* 1. Large Editorial Hero Carousel */}
      <HeroCarousel />

      {/* 2. Compact Reassurance Strip */}
      <ReassuranceStrip />

      {/* 3. Shop by Mattress Type & Supporting Categories */}
      <CategoryGrid />

      {/* 4. Curated Mattress Showcase */}
      <CuratedCollection products={products} />

      {/* 5. Offers Section with Real Coupon Conditions */}
      <OffersSection coupons={coupons} />

      {/* 6. Shoppable Bedroom Lookbook with Hotspots */}
      <LookbookSection />

      {/* 7. Mattress Comfort & Material Layer Explanation */}
      <MaterialAnatomy />

      {/* 8. Mattress Finder Callout */}
      <FinderCallout />

      {/* 9. Verified Customer Reviews */}
      <ReviewsSection reviews={reviews} />

      {/* 10. Physical Showrooms Callout */}
      <ShowroomCallout showrooms={showrooms} />

      {/* 11. Sleep Science Journal Previews */}
      <JournalSection articles={blogPosts} />
    </div>
  )
}
