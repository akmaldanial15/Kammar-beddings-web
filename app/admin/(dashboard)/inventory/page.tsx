import React from 'react'
import { getProducts } from '@/lib/db'
import { InventoryClient } from './InventoryClient'

export const dynamic = 'force-dynamic'

export default async function AdminInventoryPage() {
  const products = await getProducts({ status: 'all' })

  // Flatten all variants with their parent product details
  const items = products.flatMap((p) =>
    p.variants.map((v) => ({
      productId: p.id,
      productName: p.name,
      productSlug: p.slug,
      productImage: p.images[0]?.imageUrl || '',
      variantId: v.id,
      sku: v.sku,
      sizeName: v.sizeName,
      dimensions: v.dimensions,
      priceSen: v.priceSen,
      stockQuantity: v.stockQuantity,
      isAvailable: v.isActive,
    }))
  )

  return (
    <div className="p-3.5 sm:p-6 md:p-10 space-y-5 sm:space-y-8">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-dark">Inventory & Stock Movements</h1>
        <p className="text-xs sm:text-sm text-secondary mt-1">
          Monitor real-time warehouse stock, configure safety buffers, and record audited stock adjustments.
        </p>
      </div>

      <InventoryClient initialItems={items} />
    </div>
  )
}
