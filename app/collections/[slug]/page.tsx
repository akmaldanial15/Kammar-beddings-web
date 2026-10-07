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

  const title = cat?.name || col?.name || (slug === 'mattress' || slug === 'mattresses' ? 'Koleksi Tilam Keluaran Kilang' : 'Katalog Produk Kilang')
  return {
    title: `${title} | KAMAAR Beddings - Tunas Sinar Jaya Enterprise`,
    description: cat?.description || col?.description || 'Koleksi tilam toto Asian fibre, kekabu tradisi, tilam asrama, bantal gebu, dan tekstil buatan Tunas Sinar Jaya Enterprise Tasek Gelugor.',
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
  let pageTitle = 'Koleksi Produk Kilang Tunas Sinar Jaya'
  let pageDescription = 'Pengeluar dan pembekal kelengkapan tilam toto, kekabu asli, tilam asrama, bantal gebu, dan tekstil rumah terus dari kilang Tasek Gelugor, Pulau Pinang.'

  if (category) {
    relevantProducts = allProducts.filter((p) => p.categoryId === category.id)
    pageTitle = `${category.name}`
    pageDescription = category.description || ''
  } else if (collection) {
    if (slug === 'koleksi-toto') {
      relevantProducts = allProducts.filter((p) => p.categoryId === 'cat-tilam-toto' || p.name.toLowerCase().includes('toto'))
    } else if (slug === 'koleksi-kekabu') {
      relevantProducts = allProducts.filter((p) => p.categoryId === 'cat-tilam-kekabu' || p.name.toLowerCase().includes('kekabu'))
    } else if (slug === 'tilam-lipat-asrama') {
      relevantProducts = allProducts.filter((p) => p.categoryId === 'cat-tilam-lipat' || p.name.toLowerCase().includes('lipat') || p.name.toLowerCase().includes('asrama'))
    } else if (slug === 'bantal-gebu-kamaar') {
      relevantProducts = allProducts.filter((p) => p.categoryId === 'cat-bantal' || p.name.toLowerCase().includes('bantal'))
    } else if (slug === 'comforter-patchwork') {
      relevantProducts = allProducts.filter((p) => p.categoryId === 'cat-cadang-comforter' || p.categoryId === 'cat-selimut-patchwork')
    } else if (slug === 'jualan-gudang-borong') {
      relevantProducts = allProducts.filter((p) => p.categoryId === 'cat-jualan-gudang' || p.name.toLowerCase().includes('pakej') || p.name.toLowerCase().includes('borong'))
    }
    pageTitle = collection.name
    pageDescription = collection.description
  } else if (slug === 'mattress' || slug === 'mattresses') {
    relevantProducts = allProducts.filter((p) => p.productType === 'mattress' || p.categoryId?.includes('tilam'))
    pageTitle = 'Koleksi Tilam Keluaran Kilang'
    pageDescription = 'Tilam Toto Asian Polyester Fibre tebal, tilam kekabu asli tradisi, tilam lipat 3 berzip, dan tilam bujang asrama standard 3 kaki terus dari kilang pengeluar Tasek Gelugor.'
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
