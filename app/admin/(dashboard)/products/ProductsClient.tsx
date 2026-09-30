'use client'

import React, { useState } from 'react'
import { Product, Category, ProductVariant } from '@/types'
import { formatMYR } from '@/lib/utils/format'
import { Search, Plus, Edit2, Archive, CheckCircle, Eye, Tag, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface ProductsClientProps {
  initialProducts: Product[]
  categories: Category[]
}

export function ProductsClient({ initialProducts, categories }: ProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  // Filtered list
  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.material && p.material.toLowerCase().includes(search.toLowerCase()))
    const matchesCat = selectedCat === 'all' || p.categoryId === selectedCat
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus
    return matchesSearch && matchesCat && matchesStatus
  })

  const handleEditClick = (p: Product) => {
    // Deep clone to allow safe editing
    setEditingProduct(JSON.parse(JSON.stringify(p)))
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    setIsSaving(true)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: editingProduct }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setProducts((prev) => {
          const idx = prev.findIndex((p) => p.id === editingProduct.id)
          if (idx >= 0) {
            const next = [...prev]
            next[idx] = data.product
            return next
          }
          return [data.product, ...prev]
        })
        setMessage({ text: 'Product updated successfully.', type: 'success' })
        setEditingProduct(null)
      } else {
        setMessage({ text: data.error || 'Failed to save product.', type: 'error' })
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Network error occurred.', type: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleArchive = async (id: string) => {
    if (!confirm('Are you sure you want to archive this product? It will be hidden from storefront.')) return

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok && data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: 'archived' as const } : p))
        )
        setMessage({ text: 'Product archived successfully.', type: 'success' })
      } else {
        setMessage({ text: data.error || 'Failed to archive.', type: 'error' })
      }
    } catch {
      setMessage({ text: 'Failed to archive product.', type: 'error' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {message && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-sm ${
            message.type === 'success'
              ? 'bg-forest/10 border border-forest/20 text-forest-dark'
              : 'bg-sale/10 border border-sale/20 text-sale'
          }`}
        >
          <div className="flex items-center space-x-2">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-forest" />
            ) : (
              <AlertCircle className="w-5 h-5 text-sale" />
            )}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-xs font-bold underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-warmwhite p-4 rounded-2xl border border-borderLight flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm animate-fade-in">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products or material..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-cream/50 border border-borderLight focus:outline-none focus:border-forest"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl bg-cream/50 border border-borderLight focus:outline-none focus:border-forest"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl bg-cream/50 border border-borderLight focus:outline-none focus:border-forest"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          <button
            onClick={() => {
              const newId = `prod-${Date.now()}`
              const newProd: Product = {
                id: newId,
                name: 'New Luxury Mattress',
                slug: `new-mattress-${Date.now()}`,
                subtitle: 'Handcrafted Malaysian Comfort',
                description: 'Detailed description of the new product.',
                productType: 'mattress',
                categoryId: categories[0]?.id || 'cat-mattresses',
                material: 'Natural Latex & Pocket Spring',
                firmness: 'Medium Firm',
                firmnessScale: 6,
                thicknessCm: 28,
                warrantyYears: 10,
                trialNights: 100,
                features: ['Zero Motion Transfer', 'Cooling Tencel Cover', 'Organic Latex Core'],
                layers: [],
                specifications: {},
                faq: [],
                images: [
                  {
                    id: `img-${Date.now()}`,
                    productId: newId,
                    imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800',
                    altText: 'New Mattress',
                    displayOrder: 1,
                    isPrimary: true,
                  },
                ],
                isFeatured: false,
                status: 'draft',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                variants: [
                  {
                    id: `var-${Date.now()}-1`,
                    productId: newId,
                    sku: `KAMAAR-NEW-QN`,
                    sizeName: 'Queen',
                    dimensions: '152 x 190 x 28 cm',
                    priceSen: 189900,
                    stockQuantity: 10,
                    isActive: true,
                  },
                ],
              }
              setEditingProduct(newProd)
            }}
            className="flex items-center space-x-2 bg-forest text-warmwhite px-4 py-2 rounded-xl text-xs font-bold hover:bg-forest-dark transition-colors shadow-sm luxury-btn"
          >
            <Plus className="w-3.5 h-3.5 text-gold" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-warmwhite rounded-2xl border border-borderLight shadow-sm overflow-hidden animate-fade-in-up delay-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream/60 border-b border-borderLight text-secondary uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Material / Firmness</th>
                <th className="py-3.5 px-4">From Price</th>
                <th className="py-3.5 px-4">Variants & Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLight/60">
              {filtered.map((prod) => {
                const cat = categories.find((c) => c.id === prod.categoryId)
                const minPrice = Math.min(...prod.variants.map((v) => v.priceSen))
                const totalStock = prod.variants.reduce((acc, v) => acc + v.stockQuantity, 0)

                return (
                  <tr key={prod.id} className="hover:bg-cream/20 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={prod.images[0]?.imageUrl || ''}
                          alt={prod.name}
                          className="w-12 h-12 rounded-lg object-cover border border-borderLight flex-shrink-0"
                        />
                        <div>
                          <span className="font-bold text-forest-dark block line-clamp-1">
                            {prod.name}
                          </span>
                          <span className="text-[10px] text-secondary font-mono">
                            /{prod.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-secondary">
                      {cat?.name || prod.categoryId}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-charcoal block">{prod.material || 'Standard'}</span>
                      {prod.firmness && (
                        <span className="text-[10px] text-secondary">{prod.firmness}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-bold text-forest">
                      {formatMYR(minPrice)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <span className="font-semibold block">
                          {prod.variants.length} variant(s)
                        </span>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            totalStock === 0
                              ? 'bg-sale/10 text-sale'
                              : totalStock < 5
                              ? 'bg-gold/20 text-forest-dark'
                              : 'bg-forest/10 text-forest'
                          }`}
                        >
                          {totalStock === 0 ? 'Out of stock' : `${totalStock} units available`}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          prod.status === 'published'
                            ? 'bg-forest/10 text-forest'
                            : prod.status === 'draft'
                            ? 'bg-gold/20 text-forest-dark'
                            : 'bg-secondary/10 text-secondary'
                        }`}
                      >
                        {prod.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {prod.status === 'published' && (
                          <Link
                            href={`/products/${prod.slug}`}
                            target="_blank"
                            title="View on storefront"
                            className="p-1.5 text-secondary hover:text-forest transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        <button
                          onClick={() => handleEditClick(prod)}
                          title="Edit product & variants"
                          className="p-1.5 text-secondary hover:text-forest transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {prod.status !== 'archived' && (
                          <button
                            onClick={() => handleArchive(prod.id)}
                            title="Archive product"
                            className="p-1.5 text-secondary hover:text-sale transition-colors"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-forest-dark/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-warmwhite w-full max-w-3xl rounded-3xl border border-borderLight shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-forest-dark text-warmwhite flex items-center justify-between border-b border-borderLight/20">
              <div>
                <h3 className="font-serif text-xl font-bold text-warmwhite">
                  Edit Atelier Product
                </h3>
                <span className="text-xs text-gold">Product ID: {editingProduct.id}</span>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-warmwhite/60 hover:text-warmwhite text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-forest-dark mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-borderLight focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest-dark mb-1">
                    Slug (URL identifier) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.slug}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, slug: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-borderLight focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest-dark mb-1">
                    Category
                  </label>
                  <select
                    value={editingProduct.categoryId}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, categoryId: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-borderLight focus:border-forest"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest-dark mb-1">
                    Status
                  </label>
                  <select
                    value={editingProduct.status}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        status: e.target.value as 'published' | 'draft' | 'archived',
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-borderLight focus:border-forest"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest-dark mb-1">
                    Material Core
                  </label>
                  <input
                    type="text"
                    value={editingProduct.material || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, material: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-borderLight focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest-dark mb-1">
                    Firmness Level
                  </label>
                  <input
                    type="text"
                    value={editingProduct.firmness || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, firmness: e.target.value })
                    }
                    placeholder="e.g. Medium Soft (4/10), Firm (8/10)"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-borderLight focus:border-forest"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-dark mb-1">
                  Tagline / Subheading
                </label>
                <input
                  type="text"
                  value={editingProduct.tagline || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, tagline: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-borderLight focus:border-forest"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-dark mb-1">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-borderLight focus:border-forest"
                />
              </div>

              {/* Variants Section */}
              <div className="border-t border-borderLight pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-forest-dark uppercase tracking-wider">
                    Purchasable Variants (Sizes & Pricing)
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newVar: ProductVariant = {
                        id: `var-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                        productId: editingProduct.id,
                        sku: `SKU-${Date.now()}`,
                        sizeName: 'Custom Size',
                        dimensions: '152 x 190 x 25 cm',
                        priceSen: 159900,
                        stockQuantity: 5,
                        isActive: true,
                        isAvailable: true,
                      }
                      setEditingProduct({
                        ...editingProduct,
                        variants: [...editingProduct.variants, newVar],
                      })
                    }}
                    className="text-xs text-forest font-bold hover:underline"
                  >
                    + Add Size Variant
                  </button>
                </div>

                <div className="space-y-3">
                  {editingProduct.variants.map((variant, vIdx) => (
                    <div
                      key={variant.id}
                      className="p-3 bg-cream/40 rounded-xl border border-borderLight grid grid-cols-2 md:grid-cols-5 gap-2 items-center"
                    >
                      <div>
                        <label className="block text-[10px] text-secondary font-semibold">
                          Size Name
                        </label>
                        <input
                          type="text"
                          value={variant.sizeName}
                          onChange={(e) => {
                            const next = [...editingProduct.variants]
                            next[vIdx].sizeName = e.target.value
                            setEditingProduct({ ...editingProduct, variants: next })
                          }}
                          className="w-full px-2 py-1 text-xs rounded border border-borderLight bg-warmwhite"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-secondary font-semibold">
                          SKU
                        </label>
                        <input
                          type="text"
                          value={variant.sku}
                          onChange={(e) => {
                            const next = [...editingProduct.variants]
                            next[vIdx].sku = e.target.value
                            setEditingProduct({ ...editingProduct, variants: next })
                          }}
                          className="w-full px-2 py-1 text-xs rounded border border-borderLight bg-warmwhite"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-secondary font-semibold">
                          Price (RM)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={(variant.priceSen / 100).toFixed(2)}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0
                            const next = [...editingProduct.variants]
                            next[vIdx].priceSen = Math.round(val * 100)
                            setEditingProduct({ ...editingProduct, variants: next })
                          }}
                          className="w-full px-2 py-1 text-xs rounded border border-borderLight bg-warmwhite"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-secondary font-semibold">
                          Stock Quantity
                        </label>
                        <input
                          type="number"
                          value={variant.stockQuantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0
                            const next = [...editingProduct.variants]
                            next[vIdx].stockQuantity = val
                            setEditingProduct({ ...editingProduct, variants: next })
                          }}
                          className="w-full px-2 py-1 text-xs rounded border border-borderLight bg-warmwhite"
                        />
                      </div>

                      <div className="flex items-center justify-end space-x-2 pt-3 md:pt-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (editingProduct.variants.length <= 1) {
                              alert('Product must have at least one variant.')
                              return
                            }
                            const next = editingProduct.variants.filter((_, idx) => idx !== vIdx)
                            setEditingProduct({ ...editingProduct, variants: next })
                          }}
                          className="text-[11px] text-sale font-bold hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-borderLight">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-xs font-bold text-secondary hover:text-charcoal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-forest text-warmwhite text-xs font-bold rounded-xl hover:bg-forest-dark transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSaving ? 'Saving Changes...' : 'Save Product & Variants'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
