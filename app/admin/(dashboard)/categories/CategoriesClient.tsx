'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Category } from '@/types'
import {
  Plus,
  Layers,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Sparkles,
  LayoutGrid,
  Menu,
} from 'lucide-react'

interface CategoriesClientProps {
  initialCategories: Category[]
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [filterSearch, setFilterSearch] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (editingCategory) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [editingCategory])

  const showNotification = (text: string, type: 'success' | 'error') => {
    setFeedback({ text, type })
    setTimeout(() => {
      setFeedback(null)
    }, 4000)
  }

  // Quick stats
  const totalCategories = categories.length
  const activeCategories = categories.filter((c) => c.isActive !== false).length
  const navCategories = categories.filter((c) => c.showInNav && c.isActive !== false).length
  const megaMenuCategories = categories.filter((c) => c.hasMegaMenu && c.isActive !== false).length

  // Filtered
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(filterSearch.toLowerCase()) ||
    c.slug.toLowerCase().includes(filterSearch.toLowerCase()) ||
    (c.badge && c.badge.toLowerCase().includes(filterSearch.toLowerCase()))
  )

  // Open modal for new category
  const handleOpenNew = () => {
    setIsNew(true)
    setEditingCategory({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      displayOrder: categories.length + 1,
      showInNav: true,
      hasMegaMenu: false,
      badge: '',
      customUrl: '',
      isActive: true,
    })
  }

  // Open modal for editing category
  const handleOpenEdit = (category: Category) => {
    setIsNew(false)
    setEditingCategory({ ...category })
  }

  // Auto-slugify when typing name (only for new categories)
  const handleNameChange = (name: string) => {
    if (!editingCategory) return
    const updates: Partial<Category> = { name }
    if (isNew) {
      updates.slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    }
    setEditingCategory((prev) => ({ ...prev, ...updates }))
  }

  // Save (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory?.name?.trim() || !editingCategory?.slug?.trim()) {
      showNotification('Nama kategori dan slug tidak boleh kosong.', 'error')
      return
    }

    setIsSubmitting(true)
    try {
      if (isNew) {
        const res = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingCategory),
        })
        const data = await res.json()
        if (res.ok && data.category) {
          setCategories((prev) => [...prev, data.category])
          showNotification(`Kategori "${data.category.name}" berjaya ditambah!`, 'success')
          setEditingCategory(null)
        } else {
          showNotification(data.error || 'Gagal menambah kategori.', 'error')
        }
      } else {
        const id = editingCategory.id!
        const res = await fetch(`/api/admin/categories/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingCategory),
        })
        const data = await res.json()
        if (res.ok && data.category) {
          setCategories((prev) =>
            prev.map((c) => (c.id === id ? data.category : c))
          )
          showNotification(`Kategori "${data.category.name}" berjaya dikemas kini!`, 'success')
          setEditingCategory(null)
        } else {
          showNotification(data.error || 'Gagal mengemas kini kategori.', 'error')
        }
      }
    } catch {
      showNotification('Ralat rangkaian semasa menyimpan kategori.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Toggle single field (e.g. showInNav, hasMegaMenu, isActive)
  const handleToggleField = async (category: Category, field: 'showInNav' | 'hasMegaMenu' | 'isActive') => {
    const updatedValue = !category[field]
    const originalCategories = [...categories]

    // Optimistic update
    setCategories((prev) =>
      prev.map((c) => (c.id === category.id ? { ...c, [field]: updatedValue } : c))
    )

    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: updatedValue }),
      })
      const data = await res.json()
      if (!res.ok || !data.category) {
        setCategories(originalCategories)
        showNotification(data.error || 'Gagal mengubah tetapan kategori.', 'error')
      } else {
        const fieldLabels: Record<string, string> = {
          showInNav: 'Paparan Nav Bar',
          hasMegaMenu: 'Dropdown Mega Menu',
          isActive: 'Status Aktif',
        }
        showNotification(
          `${fieldLabels[field]} untuk "${category.name}" ${updatedValue ? 'diaktifkan' : 'dinyahaktifkan'}.`,
          'success'
        )
      }
    } catch {
      setCategories(originalCategories)
      showNotification('Ralat komunikasi dengan pelayan.', 'error')
    }
  }

  // Delete category
  const handleDelete = async (category: Category) => {
    if (!confirm(`Adakah anda pasti mahu memadam kategori "${category.name}"? Tindakan ini tidak boleh diundur.`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setCategories((prev) => prev.filter((c) => c.id !== category.id))
        showNotification(`Kategori "${category.name}" telah dipadam.`, 'success')
      } else {
        showNotification(data.error || 'Gagal memadam kategori.', 'error')
      }
    } catch {
      showNotification('Ralat rangkaian semasa memadam kategori.', 'error')
    }
  }

  // Move Category Up or Down in order
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= categories.length) return

    const newCategories = [...categories]
    const [moved] = newCategories.splice(index, 1)
    newCategories.splice(targetIndex, 0, moved)

    // Update display orders
    newCategories.forEach((c, idx) => {
      c.displayOrder = idx + 1
    })

    setCategories(newCategories)

    try {
      const orderedIds = newCategories.map((c) => c.id)
      const res = await fetch('/api/admin/categories/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      })
      const data = await res.json()
      if (res.ok && data.categories) {
        setCategories(data.categories)
        showNotification('Susunan kategori berjaya dikemas kini!', 'success')
      }
    } catch {
      showNotification('Gagal menyimpan susunan kategori.', 'error')
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {feedback && (
        <div
          className={`flex items-center space-x-3 p-4 rounded-xl shadow-md border animate-fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{feedback.text}</span>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-warmwhite p-5 rounded-2xl border border-borderLight shadow-xs animate-fade-in-up delay-50 luxury-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">Jumlah Kategori</span>
            <Layers className="w-4 h-4 text-gold-dark" />
          </div>
          <p className="text-2xl font-bold font-serif text-forest-dark mt-2">{totalCategories}</p>
          <span className="text-[11px] text-charcoal-muted mt-1 block">Semua dalam pangkalan data</span>
        </div>

        <div className="bg-warmwhite p-5 rounded-2xl border border-borderLight shadow-xs animate-fade-in-up delay-100 luxury-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">Paparan Nav Bar</span>
            <Menu className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold font-serif text-emerald-700 mt-2">{navCategories}</p>
          <span className="text-[11px] text-charcoal-muted mt-1 block">Aktif pada bar navigasi atas</span>
        </div>

        <div className="bg-warmwhite p-5 rounded-2xl border border-borderLight shadow-xs animate-fade-in-up delay-150 luxury-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">Megamenu Dropdown</span>
            <LayoutGrid className="w-4 h-4 text-gold-dark" />
          </div>
          <p className="text-2xl font-bold font-serif text-gold-dark mt-2">{megaMenuCategories}</p>
          <span className="text-[11px] text-charcoal-muted mt-1 block">Kategori dengan menu bertingkat</span>
        </div>

        <div className="bg-warmwhite p-5 rounded-2xl border border-borderLight shadow-xs animate-fade-in-up delay-200 luxury-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">Status Aktif</span>
            <Sparkles className="w-4 h-4 text-forest" />
          </div>
          <p className="text-2xl font-bold font-serif text-forest-dark mt-2">{activeCategories}</p>
          <span className="text-[11px] text-charcoal-muted mt-1 block">Boleh dilayari pembeli</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-warmwhite p-4 rounded-2xl border border-borderLight shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 animate-fade-in-up delay-250">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Cari kategori mengikut nama, slug atau badge..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-borderLight bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
          />
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleOpenNew}
            className="inline-flex items-center space-x-2 bg-forest hover:bg-forest-dark text-warmwhite px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:shadow transition-all"
          >
            <Plus className="w-4 h-4 text-gold" />
            <span>Tambah Kategori Baru</span>
          </button>
        </div>
      </div>

      {/* Main Categories Table */}
      <div className="bg-warmwhite rounded-2xl border border-borderLight shadow-xs overflow-hidden animate-fade-in-up delay-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-cream/70 border-b border-borderLight text-charcoal font-semibold tracking-wider uppercase text-[11px]">
                <th className="py-3.5 px-4 w-16 text-center">Susun</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Pautan Navigasi (URL)</th>
                <th className="py-3.5 px-4 text-center">Badge</th>
                <th className="py-3.5 px-4 text-center">Tampil Nav Bar</th>
                <th className="py-3.5 px-4 text-center">Mega Menu</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLight/60">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-charcoal-muted">
                    Tiada kategori dijumpai.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat, index) => {
                  const targetUrl = cat.customUrl || `/collections/${cat.slug}`
                  return (
                    <tr key={cat.id} className="hover:bg-cream/30 transition-colors">
                      {/* Reorder Buttons */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => handleMove(index, 'up')}
                            disabled={index === 0}
                            title="Gerak Ke Atas"
                            className="p-1 rounded hover:bg-cream disabled:opacity-30 disabled:cursor-not-allowed text-charcoal-muted hover:text-forest transition-colors"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-bold text-[11px] text-charcoal min-w-[14px]">
                            {cat.displayOrder || index + 1}
                          </span>
                          <button
                            onClick={() => handleMove(index, 'down')}
                            disabled={index === categories.length - 1}
                            title="Gerak Ke Bawah"
                            className="p-1 rounded hover:bg-cream disabled:opacity-30 disabled:cursor-not-allowed text-charcoal-muted hover:text-forest transition-colors"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Name & Details */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          {cat.imageUrl ? (
                            <img
                              src={cat.imageUrl}
                              alt={cat.name}
                              className="w-10 h-10 rounded-lg object-cover border border-borderLight flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-cream border border-borderLight flex items-center justify-center text-charcoal-muted flex-shrink-0">
                              <Layers className="w-5 h-5 text-gold-dark" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="font-bold text-forest-dark text-sm block truncate">
                              {cat.name}
                            </span>
                            <span className="text-[11px] text-charcoal-muted block truncate font-mono">
                              slug: {cat.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* URL */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1.5 font-mono text-[11px] text-charcoal-muted">
                          <span className="truncate max-w-[180px]">{targetUrl}</span>
                          <a
                            href={targetUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-forest hover:text-gold transition-colors"
                            title="Buka pautan di tab baru"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </td>

                      {/* Badge */}
                      <td className="py-3.5 px-4 text-center">
                        {cat.badge ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200">
                            {cat.badge}
                          </span>
                        ) : (
                          <span className="text-charcoal-muted/40 text-[11px]">&mdash;</span>
                        )}
                      </td>

                      {/* Toggle: Show in Nav Bar */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleField(cat, 'showInNav')}
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                            cat.showInNav
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-cream text-charcoal-muted hover:bg-borderLight/60'
                          }`}
                          title="Klik untuk ubah paparan di Navigation Bar"
                        >
                          {cat.showInNav ? (
                            <>
                              <Eye className="w-3 h-3 text-emerald-600" />
                              <span>Tampil</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-charcoal-muted" />
                              <span>Sembunyi</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Toggle: Mega Menu */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleField(cat, 'hasMegaMenu')}
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                            cat.hasMegaMenu
                              ? 'bg-gold/20 text-forest-dark font-bold hover:bg-gold/30'
                              : 'bg-cream text-charcoal-muted hover:bg-borderLight/60'
                          }`}
                          title="Klik untuk aktifkan/matikan Mega Menu dropdown"
                        >
                          <span>{cat.hasMegaMenu ? 'Aktif' : 'Tiada'}</span>
                        </button>
                      </td>

                      {/* Toggle: Active */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleField(cat, 'isActive')}
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                            cat.isActive !== false
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                          }`}
                          title="Klik untuk menukar status kategori"
                        >
                          {cat.isActive !== false ? 'Aktif' : 'Nyahaktif'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenEdit(cat)}
                            className="p-1.5 rounded-lg hover:bg-cream text-charcoal-muted hover:text-forest transition-colors"
                            title="Edit Kategori"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-charcoal-muted hover:text-rose-600 transition-colors"
                            title="Padam Kategori"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {editingCategory && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-forest-dark/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-warmwhite w-full max-w-lg rounded-2xl shadow-2xl border border-borderLight overflow-hidden animate-scale-in my-auto max-h-[94vh] flex flex-col">
            <div className="p-6 border-b border-borderLight bg-cream/40 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-forest-dark">
                  {isNew ? 'Tambah Kategori Baru' : `Edit Kategori: ${editingCategory.name}`}
                </h3>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Konfigurasikan perincian kategori dan fungsi navigasi kedai.
                </p>
              </div>
              <button
                onClick={() => setEditingCategory(null)}
                className="text-charcoal-muted hover:text-charcoal p-1.5 rounded-lg hover:bg-cream"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">
                  Nama Kategori <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Luxury Quilts, Mattresses, Bed Linen"
                  value={editingCategory.name || ''}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-borderLight bg-cream/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">
                  Slug URL <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-cream border border-r-0 border-borderLight rounded-l-xl text-xs font-mono text-charcoal-muted">
                    /collections/
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="luxury-quilts"
                    value={editingCategory.slug || ''}
                    onChange={(e) =>
                      setEditingCategory((prev) => ({
                        ...prev,
                        slug: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)+/g, ''),
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-r-xl border border-borderLight bg-cream/30 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                  />
                </div>
              </div>

              {/* Custom URL & Badge */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">
                    Custom URL (Pilihan)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: /offers atau /blog"
                    value={editingCategory.customUrl || ''}
                    onChange={(e) =>
                      setEditingCategory((prev) => ({ ...prev, customUrl: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-borderLight bg-cream/30 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                  />
                  <span className="text-[10px] text-charcoal-muted mt-0.5 block">
                    Tinggalkan kosong untuk guna /collections/[slug]
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">
                    Badge Tag (Pilihan)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: SALE, NEW, HOT"
                    value={editingCategory.badge || ''}
                    onChange={(e) =>
                      setEditingCategory((prev) => ({ ...prev, badge: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-borderLight bg-cream/30 text-xs focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                  />
                  <span className="text-[10px] text-charcoal-muted mt-0.5 block">
                    Pelekat teks kecil di sebelah nama
                  </span>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">
                  URL Imej Kategori
                </label>
                <input
                  type="text"
                  placeholder="https://... atau /images/..."
                  value={editingCategory.imageUrl || ''}
                  onChange={(e) =>
                    setEditingCategory((prev) => ({ ...prev, imageUrl: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-borderLight bg-cream/30 text-xs focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-1">
                  Penerangan Ringkas
                </label>
                <textarea
                  rows={2}
                  placeholder="Penerangan keistimewaan koleksi untuk SEO & paparan katalog..."
                  value={editingCategory.description || ''}
                  onChange={(e) =>
                    setEditingCategory((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-borderLight bg-cream/30 text-xs focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                />
              </div>

              {/* Toggles */}
              <div className="bg-cream/40 p-3.5 rounded-xl border border-borderLight space-y-3">
                {/* Show in Nav Bar */}
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-forest block">Tampil di Navigation Bar (Header)</span>
                    <span className="text-[11px] text-charcoal-muted">
                      Kategori akan dipaparkan di menu atas untuk semua pelawat web.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={editingCategory.showInNav ?? true}
                    onChange={(e) =>
                      setEditingCategory((prev) => ({ ...prev, showInNav: e.target.checked }))
                    }
                    className="w-4 h-4 rounded text-forest focus:ring-gold"
                  />
                </label>

                {/* Has MegaMenu */}
                <label className="flex items-center justify-between cursor-pointer border-t border-borderLight/60 pt-2.5">
                  <div>
                    <span className="text-xs font-bold text-forest block">Aktifkan Dropdown Mega Menu</span>
                    <span className="text-[11px] text-charcoal-muted">
                      Membuka panel dropdown mega menu (Material, Saiz, Firmness & Quiz).
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(editingCategory.hasMegaMenu)}
                    onChange={(e) =>
                      setEditingCategory((prev) => ({ ...prev, hasMegaMenu: e.target.checked }))
                    }
                    className="w-4 h-4 rounded text-forest focus:ring-gold"
                  />
                </label>

                {/* Active Status */}
                <label className="flex items-center justify-between cursor-pointer border-t border-borderLight/60 pt-2.5">
                  <div>
                    <span className="text-xs font-bold text-forest block">Status Kategori Aktif</span>
                    <span className="text-[11px] text-charcoal-muted">
                      Jika dimatikan, kategori ini akan disembunyikan sepenuhnya.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={editingCategory.isActive ?? true}
                    onChange={(e) =>
                      setEditingCategory((prev) => ({ ...prev, isActive: e.target.checked }))
                    }
                    className="w-4 h-4 rounded text-forest focus:ring-gold"
                  />
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-borderLight">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal-muted hover:bg-cream transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-forest hover:bg-forest-dark text-warmwhite transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : isNew ? 'Tambah Kategori' : 'Kemas Kini Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
