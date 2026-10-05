import React from 'react'
import { getProducts, getCategories } from '@/lib/db'
import { ProductsClient } from './ProductsClient'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const products = await getProducts({ status: 'all' })
  const categories = await getCategories()

  return <ProductsClient initialProducts={products} categories={categories} />
}
