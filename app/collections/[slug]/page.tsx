import React from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getProducts, getCategories, getCollections } from '@/lib/db'
import { CollectionClient } from './CollectionClient'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params
  const categories = await getCategories()
  const collections = await getCollections()

  const cat = categories.find((c) => c.slug === slug)
  const col = collections.find((c) => c.slug === slug)

  const title = cat?.name || col?.name || (slug === 'mattress' || slug === 'mattresses' ? 'Luxury Mattresses Collection' : 'Catalog Collection')
  return {
    title: `${title} | KAMAAR Beddings Malaysia`,
    description: cat?.description || col?.description || 'Browse handcrafted organic natural latex and ergonomic hybrid sleep products.',
  }
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = params
  const [allProducts, categories, collections] = await Promise.all([
    getProducts({ status: 'published' }),
    getCategories(),
    getCollections(),
  ])

  const category = categories.find((c) => c.slug === slug || (slug === 'mattresses' && c.slug === 'mattress'))
  const collection = collections.find((c) => c.slug === slug)

  let relevantProducts = allProducts
  let pageTitle = 'Luxury Bedding Collection'
  let pageDescription = 'Explore our certified organic natural latex mattresses, cervical contour pillows, and bedding essentials.'

  if (category) {
    relevantProducts = allProducts.filter((p) => p.categoryId === category.id)
    pageTitle = `${category.name} Collection`
    pageDescription = category.description || ''
  } else if (collection) {
    if (slug === 'natural-latex') {
      relevantProducts = allProducts.filter((p) => p.material?.toLowerCase().includes('latex'))
    } else if (slug === 'cool-night-hybrid') {
      relevantProducts = allProducts.filter((p) => p.material?.toLowerCase().includes('hybrid'))
    } else if (slug === 'orthopaedic-support') {
      relevantProducts = allProducts.filter((p) => p.material?.toLowerCase().includes('ortho'))
    } else if (slug === 'hotel-collection') {
      relevantProducts = allProducts.filter((p) => p.name.includes('Sovereign') || p.name.includes('Heritage'))
    }
    pageTitle = collection.name
    pageDescription = collection.description
  } else if (slug === 'mattress' || slug === 'mattresses') {
    relevantProducts = allProducts.filter((p) => p.productType === 'mattress')
    pageTitle = 'Luxury Natural Latex & Hybrid Mattresses'
    pageDescription = 'Handcrafted in Malaysia with 100% pure organic latex, zero synthetic fillers, and micro-zoned spinal alignment for deep, restorative sleep.'
  }

  return (
    <CollectionClient
      products={relevantProducts}
      category={category}
      collection={collection}
      title={pageTitle}
      description={pageDescription}
    />
  )
}
