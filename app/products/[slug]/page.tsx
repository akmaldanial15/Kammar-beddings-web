import React from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getProductBySlug, getProducts, getReviews } from '@/lib/db'
import { ProductDetailClient } from './ProductDetailClient'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  if (!product) return { title: 'Product Not Found | KAMAAR Beddings' }

  return {
    title: `${product.name} | KAMAAR Beddings Malaysia`,
    description: product.shortDescription || product.description,
    openGraph: {
      title: product.name,
      description: product.shortDescription || product.description,
      images: [
        {
          url: product.images[0]?.imageUrl || '',
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const [allProducts, reviews] = await Promise.all([
    getProducts({ status: 'published' }),
    getReviews(product.id),
  ])

  // Matching accessories (pillows, toppers, protectors, linen)
  const matchingAccessories = allProducts.filter(
    (p) => p.productType !== 'mattress' && p.id !== product.id
  ).slice(0, 4)

  // Related mattresses
  const relatedProducts = allProducts.filter(
    (p) => p.productType === 'mattress' && p.id !== product.id
  ).slice(0, 4)

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map((i) => i.imageUrl),
    description: product.shortDescription || product.description,
    brand: {
      '@type': 'Brand',
      name: 'KAMAAR Beddings',
    },
    offers: product.variants.map((v) => ({
      '@type': 'Offer',
      sku: v.sku,
      price: (v.priceSen / 100).toFixed(2),
      priceCurrency: 'MYR',
      availability: v.stockQuantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient
        product={product}
        initialReviews={reviews}
        matchingAccessories={matchingAccessories}
        relatedProducts={relatedProducts}
      />
    </>
  )
}
