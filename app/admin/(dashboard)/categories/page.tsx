import React from 'react'
import { getCategories } from '@/lib/db'
import { CategoriesClient } from './CategoriesClient'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="p-4 sm:p-6 md:p-10 space-y-6 md:space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-dark">Kategori & Navigasi Utama</h1>
        <p className="text-xs sm:text-sm text-secondary mt-1">
          Kawal sepenuhnya senarai kategori produk, susunan paparan, dan pautan bar navigasi (Header) di kedai KAMAAR.
        </p>
      </div>

      <CategoriesClient initialCategories={categories} />
    </div>
  )
}
