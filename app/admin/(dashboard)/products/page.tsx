import React from 'react'
import { getProducts, getCategories } from '@/lib/db'
import { ProductsClient } from './ProductsClient'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const products = await getProducts({ status: 'all' })
  const categories = await getCategories()

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-forest-dark">Product Catalog & Atelier</h1>
        <p className="text-sm text-secondary mt-1">
          Manage handcrafted mattresses, pillows, toppers, and luxury bedroom collections.
        </p>
      </div>

      <ProductsClient initialProducts={products} categories={categories} />
    </div>
  )
}
