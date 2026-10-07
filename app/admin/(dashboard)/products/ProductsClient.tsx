'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Product, Category, ProductVariant, ProductImage } from '@/types'
import { formatMYR } from '@/lib/utils/format'
import {
  Search,
  Plus,
  Edit2,
  Archive,
  CheckCircle,
  Eye,
  Tag,
  AlertCircle,
  ExternalLink,
  Layers,
  ShieldCheck,
  Image as ImageIcon,
  Sparkles,
  Sliders,
  Trash2,
  Save,
  X,
  BedDouble,
  Check,
  Package,
  Boxes,
  FileText,
  Copy,
  Info,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Palette,
  ZoomIn,
  Maximize2,
  HelpCircle,
  Lightbulb,
  Star,
  Percent,
  Compass,
  BookOpen,
  UploadCloud,
  Upload,
  ImagePlus,
  Loader2,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react'
import Link from 'next/link'

interface ProductsClientProps {
  initialProducts: Product[]
  categories: Category[]
}

type TabType = 'general' | 'variants' | 'specs' | 'images' | 'features'

export function ProductsClient({ initialProducts, categories }: ProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // State for image lightbox modal window
  const [previewImageModal, setPreviewImageModal] = useState<{
    product: Product
    activeImageIndex: number
  } | null>(null)

  // Lock body scroll when editing modal or image lightbox modal is open so the background page cannot scroll
  useEffect(() => {
    if (editingProduct || previewImageModal) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [editingProduct, previewImageModal])

  // Keyboard navigation for image lightbox modal (Esc to close, Left/Right arrows to navigate)
  useEffect(() => {
    if (!previewImageModal) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewImageModal(null)
      } else if (e.key === 'ArrowLeft' && previewImageModal.product.images.length > 1) {
        setPreviewImageModal((prev) =>
          prev
            ? {
                ...prev,
                activeImageIndex:
                  (prev.activeImageIndex - 1 + prev.product.images.length) %
                  prev.product.images.length,
              }
            : null
        )
      } else if (e.key === 'ArrowRight' && previewImageModal.product.images.length > 1) {
        setPreviewImageModal((prev) =>
          prev
            ? {
                ...prev,
                activeImageIndex: (prev.activeImageIndex + 1) % prev.product.images.length,
              }
            : null
        )
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [previewImageModal])

  // Modal specific state
  const [activeTab, setActiveTab] = useState<TabType>('general')
  const [showAdminTips, setShowAdminTips] = useState(true)
  const [copiedSlug, setCopiedSlug] = useState(false)
  const [catDropdownOpen, setCatDropdownOpen] = useState(false)
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false)
  const catDropdownRef = useRef<HTMLDivElement>(null)
  const typeDropdownRef = useRef<HTMLDivElement>(null)
  const [newFeatureText, setNewFeatureText] = useState('')
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newImageAlt, setNewImageAlt] = useState('')
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false)

  // Image Upload states
  const [imageUploadMode, setImageUploadMode] = useState<'upload' | 'url'>('upload')
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const replaceFileInputRef = useRef<HTMLInputElement>(null)
  const [replacingImageIndex, setReplacingImageIndex] = useState<number | null>(null)

  // Close custom dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (catDropdownRef.current && !catDropdownRef.current.contains(e.target as Node)) {
        setCatDropdownOpen(false)
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target as Node)) {
        setTypeDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filtered list
  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.material && p.material.toLowerCase().includes(search.toLowerCase())) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
    const matchesCat = selectedCat === 'all' || p.categoryId === selectedCat
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus
    const totalStock = p.variants.reduce((acc, v) => acc + v.stockQuantity, 0)
    const matchesLowStock = !filterLowStockOnly || totalStock <= 10
    return matchesSearch && matchesCat && matchesStatus && matchesLowStock
  })

  // Executive KPI stats
  const totalProductsCount = products.length
  const publishedCount = products.filter((p) => p.status === 'published').length
  const totalInventoryUnits = products.reduce((acc, p) => acc + p.variants.reduce((vAcc, v) => vAcc + v.stockQuantity, 0), 0)
  const lowStockProductsCount = products.filter((p) => {
    const stock = p.variants.reduce((vAcc, v) => vAcc + v.stockQuantity, 0)
    return stock <= 10
  }).length

  // Keyboard shortcut: Ctrl+S or Cmd+S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        if (editingProduct && !isSaving) {
          e.preventDefault()
          handleSaveProduct()
        }
      }
      if (e.key === 'Escape' && editingProduct && !isSaving) {
        setEditingProduct(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [editingProduct, isSaving])

  const handleEditClick = (p: Product) => {
    setEditingProduct(JSON.parse(JSON.stringify(p)))
    setActiveTab('general')
    setNewFeatureText('')
    setNewImageUrl('')
    setNewImageAlt('')
    setUploadError(null)
    setUploadSuccessMsg(null)
    setImageUploadMode('upload')
  }

  const handleOpenNewProduct = () => {
    const newId = `prod-${Date.now()}`
    const newProd: Product = {
      id: newId,
      name: 'New Luxury Mattress',
      slug: `new-luxury-mattress-${Date.now().toString().slice(-4)}`,
      subtitle: 'Handcrafted Malaysian Comfort with 100% Organic Dunlop Latex',
      tagline: 'Pure Restorative Sleep',
      description:
        'The epitome of handcrafted Malaysian sleep luxury. Made from 100% sustainably harvested organic latex with no toxic polyurethane foam, chemical adhesives, or metal coils.',
      shortDescription: 'Signature 100% organic natural latex mattress with dual-density ergonomic zoning.',
      productType: 'mattress',
      categoryId: categories[0]?.id || 'cat-mattresses',
      material: '100% Natural Latex',
      firmness: 'Medium Firm',
      firmnessScale: 6,
      thicknessCm: 30,
      warrantyYears: 12,
      trialNights: 100,
      features: [
        '100% Organic Malaysian Natural Latex',
        'Zero synthetic foam, zero VOC emissions & hypoallergenic',
        'Naturally dust-mite, fungal & antibacterial resistant',
        'Belgian Organic Tencel zip-off washable cover',
      ],
      layers: [],
      specifications: {},
      faq: [],
      images: [
        {
          id: `img-${Date.now()}`,
          productId: newId,
          imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
          altText: 'New Luxury Mattress',
          displayOrder: 1,
          isPrimary: true,
        },
      ],
      variants: [
        {
          id: `var-${Date.now()}-qen`,
          productId: newId,
          sku: 'KAM-NLM-QEN',
          sizeName: 'Queen',
          dimensions: '152 x 190 x 30 cm',
          priceSen: 229900,
          compareAtPriceSen: 289900,
          stockQuantity: 12,
          isActive: true,
          isAvailable: true,
        },
        {
          id: `var-${Date.now()}-kng`,
          productId: newId,
          sku: 'KAM-NLM-KNG',
          sizeName: 'King',
          dimensions: '183 x 190 x 30 cm',
          priceSen: 279900,
          compareAtPriceSen: 349900,
          stockQuantity: 8,
          isActive: true,
          isAvailable: true,
        },
      ],
      isFeatured: false,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setEditingProduct(newProd)
    setActiveTab('general')
  }

  const handleSaveProduct = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!editingProduct) return

    if (!editingProduct.name.trim() || !editingProduct.slug.trim()) {
      setMessage({ text: 'Nama produk dan slug URL wajib diisi.', type: 'error' })
      return
    }

    if (!editingProduct.variants || editingProduct.variants.length === 0) {
      setMessage({ text: 'Produk mesti mempunyai sekurang-kurangnya satu varian saiz.', type: 'error' })
      setActiveTab('variants')
      return
    }

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
        setMessage({ text: `Produk "${data.product.name}" berjaya disimpan!`, type: 'success' })
        setEditingProduct(null)
      } else {
        setMessage({ text: data.error || 'Gagal menyimpan produk.', type: 'error' })
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Ralat komunikasi pelayan berlaku.', type: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleArchive = async (id: string) => {
    if (!confirm('Adakah anda pasti mahu mengarkibkan produk ini? Produk tidak akan dipaparkan di kedai.')) return

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok && data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: 'archived' as const } : p))
        )
        setMessage({ text: 'Produk berjaya diarkibkan.', type: 'success' })
      } else {
        setMessage({ text: data.error || 'Gagal mengarkibkan produk.', type: 'error' })
      }
    } catch {
      setMessage({ text: 'Ralat semasa mengarkibkan produk.', type: 'error' })
    }
  }

  // Variant Helpers
  const addPresetVariant = (sizeName: string, defaultDims: string, defaultPriceSen: number) => {
    if (!editingProduct) return
    const prefix = editingProduct.slug
      .replace(/[^a-z0-9]/gi, '')
      .slice(0, 4)
      .toUpperCase()
    const sizeCode = sizeName.replace(/[^a-z0-9]/gi, '').slice(0, 3).toUpperCase()
    const newVar: ProductVariant = {
      id: `var-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      productId: editingProduct.id,
      sku: `KAM-${prefix || 'PRD'}-${sizeCode}`,
      sizeName,
      dimensions: defaultDims,
      priceSen: defaultPriceSen,
      compareAtPriceSen: Math.round(defaultPriceSen * 1.25),
      stockQuantity: 10,
      isActive: true,
      isAvailable: true,
    }
    setEditingProduct({
      ...editingProduct,
      variants: [...editingProduct.variants, newVar],
    })
  }

  const removeVariant = (vIdx: number) => {
    if (!editingProduct) return
    if (editingProduct.variants.length <= 1) {
      alert('Produk mesti mempunyai sekurang-kurangnya satu varian saiz.')
      return
    }
    const next = editingProduct.variants.filter((_, idx) => idx !== vIdx)
    setEditingProduct({ ...editingProduct, variants: next })
  }

  // Image Helpers & Upload Handlers
  const handleUploadFiles = async (files: FileList | File[]) => {
    if (!editingProduct || !files || files.length === 0) return
    setIsUploadingImage(true)
    setUploadError(null)
    setUploadSuccessMsg(null)

    try {
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i])
      }

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal memuat naik fail ke server')
      }

      const currentCount = editingProduct.images?.length || 0
      const uploadedList = data.files || [{ url: data.url, originalName: files[0]?.name }]

      const newImgs: ProductImage[] = uploadedList.map((item: any, idx: number) => ({
        id: `img-${Date.now()}-${idx}`,
        productId: editingProduct.id,
        imageUrl: item.url,
        altText: `${editingProduct.name} - Galeri ${currentCount + idx + 1}`,
        displayOrder: currentCount + idx + 1,
        isPrimary: currentCount === 0 && idx === 0,
      }))

      setEditingProduct({
        ...editingProduct,
        images: [...(editingProduct.images || []), ...newImgs],
      })

      setUploadSuccessMsg(`Berjaya memuat naik ${newImgs.length} gambar ke galeri!`)
      setTimeout(() => setUploadSuccessMsg(null), 4000)
    } catch (err: any) {
      console.warn('Server upload failed, falling back to local file reader:', err)
      try {
        const readFilesPromises = Array.from(files).map((file, idx) => {
          return new Promise<ProductImage>((resolve) => {
            const reader = new FileReader()
            reader.onload = (event) => {
              const currentCount = editingProduct.images?.length || 0
              resolve({
                id: `img-${Date.now()}-${idx}`,
                productId: editingProduct.id,
                imageUrl: (event.target?.result as string) || '',
                altText: `${editingProduct.name} - ${file.name.replace(/\.[^/.]+$/, '')}`,
                displayOrder: currentCount + idx + 1,
                isPrimary: currentCount === 0 && idx === 0,
              })
            }
            reader.readAsDataURL(file)
          })
        })
        const readImages = await Promise.all(readFilesPromises)
        setEditingProduct({
          ...editingProduct,
          images: [...(editingProduct.images || []), ...readImages],
        })
        setUploadSuccessMsg(`Imej dimuatkan dari peranti (${readImages.length} fail)`)
        setTimeout(() => setUploadSuccessMsg(null), 4000)
      } catch {
        setUploadError(err.message || 'Gagal membaca fail imej.')
      }
    } finally {
      setIsUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleReplaceImageFile = async (file: File) => {
    if (!editingProduct || replacingImageIndex === null || !file) return
    setIsUploadingImage(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.success && data.url) {
        const next = [...(editingProduct.images || [])]
        next[replacingImageIndex].imageUrl = data.url
        setEditingProduct({ ...editingProduct, images: next })
        setUploadSuccessMsg('Imej berjaya digantikan!')
        setTimeout(() => setUploadSuccessMsg(null), 3000)
      } else {
        throw new Error(data.error || 'Gagal muat naik pengganti')
      }
    } catch {
      // FileReader fallback
      const reader = new FileReader()
      reader.onload = (ev) => {
        const next = [...(editingProduct.images || [])]
        next[replacingImageIndex].imageUrl = ev.target?.result as string
        setEditingProduct({ ...editingProduct, images: next })
        setUploadSuccessMsg('Imej digantikan dari peranti!')
        setTimeout(() => setUploadSuccessMsg(null), 3000)
      }
      reader.readAsDataURL(file)
    } finally {
      setIsUploadingImage(false)
      setReplacingImageIndex(null)
      if (replaceFileInputRef.current) replaceFileInputRef.current.value = ''
    }
  }

  const handleAddImage = () => {
    if (!editingProduct || !newImageUrl.trim()) return
    const newImg: ProductImage = {
      id: `img-${Date.now()}`,
      productId: editingProduct.id,
      imageUrl: newImageUrl.trim(),
      altText: newImageAlt.trim() || editingProduct.name,
      displayOrder: (editingProduct.images?.length || 0) + 1,
      isPrimary: (editingProduct.images?.length || 0) === 0,
    }
    setEditingProduct({
      ...editingProduct,
      images: [...(editingProduct.images || []), newImg],
    })
    setNewImageUrl('')
    setNewImageAlt('')
    setUploadSuccessMsg('Pautan imej berjaya ditambah ke galeri!')
    setTimeout(() => setUploadSuccessMsg(null), 3000)
  }

  const setPrimaryImage = (imgId: string) => {
    if (!editingProduct) return
    const nextImages = (editingProduct.images || []).map((img) => ({
      ...img,
      isPrimary: img.id === imgId,
    }))
    setEditingProduct({ ...editingProduct, images: nextImages })
  }

  const removeImage = (imgId: string) => {
    if (!editingProduct) return
    const nextImages = (editingProduct.images || []).filter((img) => img.id !== imgId)
    if (nextImages.length > 0 && !nextImages.some((img) => img.isPrimary)) {
      nextImages[0].isPrimary = true
    }
    setEditingProduct({ ...editingProduct, images: nextImages })
  }

  // Feature Helpers
  const handleAddFeature = (text?: string) => {
    const feat = (text || newFeatureText).trim()
    if (!editingProduct || !feat) return
    if (editingProduct.features?.includes(feat)) return
    setEditingProduct({
      ...editingProduct,
      features: [...(editingProduct.features || []), feat],
    })
    setNewFeatureText('')
  }

  const handleRemoveFeature = (index: number) => {
    if (!editingProduct) return
    const nextFeatures = (editingProduct.features || []).filter((_, idx) => idx !== index)
    setEditingProduct({ ...editingProduct, features: nextFeatures })
  }

  const getFirmnessLabel = (scale: number): string => {
    if (scale <= 2) return 'Plush Soft'
    if (scale <= 4) return 'Medium Soft'
    if (scale <= 6) return 'Medium Firm'
    if (scale <= 8) return 'Firm'
    return 'Orthopaedic Firm'
  }

  // Primary image for modal header
  const primaryThumb =
    editingProduct?.images?.find((img) => img.isPrimary)?.imageUrl ||
    editingProduct?.images?.[0]?.imageUrl ||
    ''

  const currentCategory = categories.find((c) => c.id === editingProduct?.categoryId)

  const getCategoryMeta = (catName?: string) => {
    const n = (catName || '').toLowerCase()
    if (n.includes('mattress') || n.includes('tilam')) {
      return {
        icon: BedDouble,
        iconColor: 'text-amber-800 bg-amber-100 border-amber-300',
        badgeText: 'Koleksi Tilam Utama',
        desc: 'Koleksi tilam getah asli organik & hybrid luxury',
        short: 'Tilam',
      }
    }
    if (n.includes('pillow') || n.includes('bantal')) {
      return {
        icon: Sparkles,
        iconColor: 'text-purple-800 bg-purple-100 border-purple-300',
        badgeText: 'Bantal Ergonomik',
        desc: 'Bantal kontur getah asli & mikrofiber leher',
        short: 'Bantal',
      }
    }
    if (n.includes('topper') || n.includes('protect')) {
      return {
        icon: Layers,
        iconColor: 'text-blue-800 bg-blue-100 border-blue-300',
        badgeText: 'Lapisan & Pelindung',
        desc: 'Lapisan empuk tilam & pelindung kalis air',
        short: 'Topper',
      }
    }
    if (n.includes('bedframe') || n.includes('katil') || n.includes('frame')) {
      return {
        icon: Package,
        iconColor: 'text-emerald-800 bg-emerald-100 border-emerald-300',
        badgeText: 'Rangka Katil Mewah',
        desc: 'Rangka katil kayu padu & upholsteri baldu',
        short: 'Katil',
      }
    }
    if (n.includes('linen') || n.includes('bedding') || n.includes('cadar')) {
      return {
        icon: Palette,
        iconColor: 'text-rose-800 bg-rose-100 border-rose-300',
        badgeText: 'Cadar Tencel & Tekstil',
        desc: 'Cadar tencel organik, sarung duvet & bantal',
        short: 'Linen',
      }
    }
    if (n.includes('bundle') || n.includes('offer')) {
      return {
        icon: Tag,
        iconColor: 'text-gold-dark bg-gold/20 border-gold/40',
        badgeText: 'Pakej Kombo & Promosi',
        desc: 'Pakej kombo jimat & promosi khas KAMAAR',
        short: 'Kombo',
      }
    }
    return {
      icon: Compass,
      iconColor: 'text-forest bg-forest/10 border-forest/20',
      badgeText: 'Koleksi Tambahan',
      desc: 'Kategori navigasi kedai online',
      short: catName || 'Koleksi',
    }
  }

  const productTypesList = [
    {
      type: 'mattress' as const,
      name: 'Tilam (Mattress)',
      badge: 'Format Lengkap ⭐',
      desc: 'Graf ketegasan 1-10, waranti kilang 10-12 tahun & percubaan 100 malam.',
      icon: BedDouble,
      color: 'text-amber-800 bg-amber-100 border-amber-300',
    },
    {
      type: 'pillow' as const,
      name: 'Bantal (Pillow)',
      badge: 'Aksesori Tidur',
      desc: 'Format bantal getah asli ergonomik, sokongan servikal & sarung tencel.',
      icon: Sparkles,
      color: 'text-purple-800 bg-purple-100 border-purple-300',
    },
    {
      type: 'topper' as const,
      name: 'Topper & Pelindung (Topper)',
      badge: 'Lapisan Tilam',
      desc: 'Format lapisan getah asli tambahan & pelindung kalis air (waterproof).',
      icon: Layers,
      color: 'text-blue-800 bg-blue-100 border-blue-300',
    },
    {
      type: 'bedframe' as const,
      name: 'Rangka Katil (Bedframe)',
      badge: 'Perabot Bilik',
      desc: 'Format rangka katil kayu padu, reka bentuk kepala katil & baldu artisan.',
      icon: Package,
      color: 'text-emerald-800 bg-emerald-100 border-emerald-300',
    },
    {
      type: 'bedding' as const,
      name: 'Cadar & Linen (Bed Linen)',
      badge: 'Tekstil Bilik',
      desc: 'Format tekstil organik (cadar getah sekeliling, sarung bantal & duvet).',
      icon: Palette,
      color: 'text-rose-800 bg-rose-100 border-rose-300',
    },
  ]

  return (
    <div className="space-y-5 md:space-y-6 max-w-full font-sans">
      {/* Toast Notification */}
      {message && (
        <div
          className={`p-3.5 sm:p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm shadow-sm animate-fade-in border ${
            message.type === 'success'
              ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
              : 'bg-rose-50/90 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 underline ml-3 flex-shrink-0 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* 1. Integrated Luxury Header & Atelier Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pb-1">
        <div className="space-y-0.5 sm:space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="text-[10px] font-bold tracking-wider uppercase text-forest-dark/75">
              KAMAAR Atelier Suite
            </span>
          </div>
          <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-forest-dark tracking-tight">
            Katalog Produk & Inventori
          </h1>
          <p className="text-xs text-secondary max-w-xl hidden sm:block">
            Uruskan spesifikasi tilam, bantal anatomi, stok saiz & varian harga secara langsung.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleOpenNewProduct}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-forest-dark to-forest hover:from-forest hover:to-forest-dark text-warmwhite px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm hover:shadow active:scale-98 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-gold flex-shrink-0" />
            <span>Tambah Produk Baharu</span>
          </button>
        </div>
      </div>

      {/* 2. Executive KPI Summary Ribbon (Unified Luxury Metric Strip) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3 sm:p-4 font-sans">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {/* Metric 1: Total Products */}
          <div className="flex items-center justify-between p-2 sm:px-3 sm:py-1">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Jumlah Produk
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl sm:text-2xl font-bold text-forest-dark">{totalProductsCount}</span>
                <span className="text-[11px] text-slate-500 font-medium">SKU Utama</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Merangkumi semua kategori</span>
            </div>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-50/80 border border-blue-100 text-forest flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5" />
            </div>
          </div>

          {/* Metric 2: Published / Active */}
          <div className="flex items-center justify-between p-2 sm:px-4 sm:py-1 pt-3 sm:pt-1">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Aktif di Kedai
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl sm:text-2xl font-bold text-emerald-700">{publishedCount}</span>
                <span className="text-[11px] text-emerald-600 font-semibold">Tersedia</span>
              </div>
              <span className="text-[10px] text-emerald-600/90 block mt-0.5 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span> Live untuk pembeli
              </span>
            </div>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50/80 border border-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>

          {/* Metric 3: Total Stock Units */}
          <div className="flex items-center justify-between p-2 sm:px-4 sm:py-1 pt-3 sm:pt-1">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Stok Fizikal
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl sm:text-2xl font-bold text-forest-dark">{totalInventoryUnits.toLocaleString()}</span>
                <span className="text-[11px] text-slate-500 font-medium">unit</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Semua saiz & varian</span>
            </div>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-50/80 border border-amber-100 text-gold-dark flex items-center justify-center flex-shrink-0">
              <Boxes className="w-5 h-5" />
            </div>
          </div>

          {/* Metric 4: Low Stock Alert (Interactive filter toggle) */}
          <div className="p-2 sm:px-4 sm:py-1 pt-3 sm:pt-1">
            <button
              type="button"
              onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
              className={`w-full h-full flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer text-left ${
                filterLowStockOnly
                  ? 'bg-amber-100/80 border-amber-400 ring-2 ring-amber-400/50 shadow-xs'
                  : 'bg-slate-50/70 hover:bg-amber-50/50 border-slate-200/80 hover:border-amber-300'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-800">
                    Stok Terhad
                  </span>
                  {filterLowStockOnly && (
                    <span className="text-[9px] px-1.5 py-0.2 bg-amber-600 text-white rounded font-bold">
                      Aktif
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xl sm:text-2xl font-bold text-amber-700">{lowStockProductsCount}</span>
                  <span className="text-[11px] text-amber-700/80 font-medium">SKU</span>
                </div>
                <span className="text-[10px] text-amber-700/90 block mt-0.5 font-medium">
                  {filterLowStockOnly ? '✓ Menapis stok rendah' : 'Klik untuk tapis ≤10 unit'}
                </span>
              </div>
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  filterLowStockOnly ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700'
                }`}
              >
                <AlertCircle className="w-5 h-5" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Streamlined Search & Filter Atelier Console */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3.5 sm:p-4 space-y-3 font-sans">
        {/* Search Row + Status Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari produk mengikut nama, slug, saiz atau bahan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50/70 border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200 transition-all cursor-pointer"
                title="Kosongkan carian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative min-w-[150px] flex-1 sm:flex-initial">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all cursor-pointer appearance-none pr-8"
              >
                <option value="all">Semua Status</option>
                <option value="published">Diterbitkan (Live)</option>
                <option value="draft">Draf (Draft)</option>
                <option value="archived">Diarkib (Archived)</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Sliders className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Reset Filters Button if any filter active */}
            {(search || selectedCat !== 'all' || selectedStatus !== 'all' || filterLowStockOnly) && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setSelectedCat('all')
                  setSelectedStatus('all')
                  setFilterLowStockOnly(false)
                }}
                className="px-3 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200/80 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                title="Reset semua penapis"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Navigation Pills (Horizontal Luxury Carousel / Tabs) */}
        <div className="flex items-center gap-1.5 pt-2.5 border-t border-slate-100 overflow-x-auto no-scrollbar scroll-smooth">
          <button
            type="button"
            onClick={() => setSelectedCat('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 flex-shrink-0 ${
              selectedCat === 'all'
                ? 'bg-forest-dark text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
            }`}
          >
            <span>Semua Koleksi</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                selectedCat === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {products.length}
            </span>
          </button>

          {categories.map((c) => {
            const count = products.filter((p) => p.categoryId === c.id).length
            const isSelected = selectedCat === c.id
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCat(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 flex-shrink-0 ${
                  isSelected
                    ? 'bg-forest-dark text-white font-bold shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                }`}
              >
                <span>{c.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* MOBILE PRODUCT CARDS (Optimized for Mobile View) */}
      <div className="md:hidden space-y-3 animate-fade-in-up delay-100">
        <div className="flex items-center justify-between text-xs text-charcoal-muted px-1">
          <span>Menunjukkan <strong className="text-forest-dark font-bold">{filtered.length}</strong> daripada {products.length} produk</span>
          {(search || selectedCat !== 'all' || selectedStatus !== 'all') && (
            <button
              onClick={() => {
                setSearch('')
                setSelectedCat('all')
                setSelectedStatus('all')
              }}
              className="text-[11px] font-bold text-forest hover:underline"
            >
              Set Semula
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-warmwhite rounded-2xl border border-borderLight p-8 text-center space-y-2 shadow-xs">
            <BedDouble className="w-10 h-10 text-charcoal-muted mx-auto opacity-40" />
            <p className="font-bold text-forest-dark text-sm">Tiada produk sepadan</p>
            <p className="text-xs text-secondary">Cuba tukar kata kunci carian atau penapis kategori/status.</p>
          </div>
        ) : (
          filtered.map((product) => {
            const category = categories.find((c) => c.id === product.categoryId)
            const minPrice = Math.min(...product.variants.map((v) => v.priceSen))
            const totalStock = product.variants.reduce((acc, v) => acc + v.stockQuantity, 0)
            const primaryImg =
              product.images.find((img) => img.isPrimary)?.imageUrl ||
              product.images[0]?.imageUrl ||
              ''

            return (
              <div
                key={product.id}
                className="bg-warmwhite rounded-2xl border border-borderLight shadow-xs p-4 space-y-3.5 transition-all hover:border-gold/40 animate-fade-in-up"
              >
                {/* Header: Thumbnail + Category Pill + Name + Status */}
                <div className="flex items-start space-x-3">
                  <button
                    type="button"
                    onClick={() => setPreviewImageModal({ product, activeImageIndex: 0 })}
                    className="relative w-16 h-16 rounded-xl overflow-hidden border border-borderLight flex-shrink-0 bg-cream/30 shadow-2xs group/mthumb cursor-zoom-in text-left focus:outline-none focus:ring-2 focus:ring-gold/50"
                    title="Klik untuk besarkan gambar produk"
                  >
                    {primaryImg ? (
                      <>
                        <img
                          src={primaryImg}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover/mthumb:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-forest-dark/35 opacity-0 group-hover/mthumb:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                          <ZoomIn className="w-5 h-5 text-white drop-shadow-md" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-charcoal-muted">
                        <BedDouble className="w-6 h-6 text-gold-dark" />
                      </div>
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1.5 mb-1">
                      <span className="text-[10px] font-bold text-forest-dark bg-cream px-2 py-0.5 rounded-md uppercase tracking-wider truncate max-w-[150px]">
                        {category ? category.name : 'Umum'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex-shrink-0 ${
                          product.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : product.status === 'draft'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                        }`}
                      >
                        {product.status === 'published' ? 'Aktif' : product.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-forest-dark text-sm leading-snug line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-[10px] text-charcoal-muted font-mono truncate mt-0.5">
                      /products/{product.slug}
                    </p>
                  </div>
                </div>

                {/* Key Metrics: Price, Stock, Variants, Specs */}
                <div className="bg-cream/40 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs border border-borderLight/60">
                  <div>
                    <span className="text-[10px] text-charcoal-muted block uppercase tracking-wider font-bold">
                      Harga Bermula
                    </span>
                    <span className="font-serif font-bold text-forest-dark text-base">
                      {formatMYR(minPrice)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-charcoal-muted block uppercase tracking-wider font-bold">
                      Baki Stok
                    </span>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mt-0.5 ${
                        totalStock === 0
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : totalStock <= 5
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {totalStock === 0 ? 'Habis Stok' : `${totalStock} unit`}
                    </span>
                  </div>

                  {(product.firmness || product.material) && (
                    <div className="col-span-2 pt-2 border-t border-borderLight/40 flex items-center justify-between text-[11px] text-secondary">
                      <span className="truncate">
                        {product.firmness && <strong className="text-forest font-medium">{product.firmness}</strong>}
                        {product.firmness && product.material && ' • '}
                        {product.material && <span className="text-charcoal-muted">{product.material}</span>}
                      </span>
                      <span className="text-[10px] text-charcoal-muted font-mono ml-2 flex-shrink-0">
                        {product.variants.length} saiz
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons: Full Thumb Friendly */}
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs active:scale-98 transition-all cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-gold" />
                    <span>Sunting Produk</span>
                  </button>

                  <Link
                    href={`/products/${product.slug}`}
                    target="_blank"
                    title="Pratonton di laman web"
                    className="py-2.5 px-3 rounded-xl bg-cream hover:bg-cream/80 text-charcoal text-xs font-semibold flex items-center justify-center space-x-1 border border-borderLight transition-all active:scale-98"
                  >
                    <Eye className="w-3.5 h-3.5 text-charcoal-muted" />
                    <span>Pratonton</span>
                  </Link>

                  {product.status !== 'archived' && (
                    <button
                      onClick={() => handleArchive(product.id)}
                      title="Arkibkan produk"
                      className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors border border-rose-200/50 active:scale-98 cursor-pointer"
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Desktop Products Table (Redesigned for PC Clarity) */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden animate-fade-in-up delay-200 font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-600 font-bold tracking-wider uppercase text-[11px]">
                <th className="py-3.5 px-4">Produk Atelier</th>
                <th className="py-3.5 px-3">Kategori</th>
                <th className="py-3.5 px-3">Ketegasan & Bahan</th>
                <th className="py-3.5 px-3 text-right">Harga Bermula</th>
                <th className="py-3.5 px-3 text-center">Baki Stok</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <BedDouble className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="font-bold text-slate-700 text-sm">Tiada produk sepadan</p>
                      <p className="text-xs text-slate-400">Cuba laraskan kata kunci carian atau penapis kategori di atas.</p>
                      {(search || selectedCat !== 'all' || selectedStatus !== 'all' || filterLowStockOnly) && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearch('')
                            setSelectedCat('all')
                            setSelectedStatus('all')
                            setFilterLowStockOnly(false)
                          }}
                          className="mt-2 text-xs font-bold text-forest hover:underline"
                        >
                          Set Semula Semua Penapis
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((product) => {
                  const category = categories.find((c) => c.id === product.categoryId)
                  const minPrice = Math.min(...product.variants.map((v) => v.priceSen))
                  const maxPrice = Math.max(...product.variants.map((v) => v.priceSen))
                  const totalStock = product.variants.reduce((acc, v) => acc + v.stockQuantity, 0)
                  const primaryImg =
                    product.images.find((img) => img.isPrimary)?.imageUrl ||
                    product.images[0]?.imageUrl ||
                    ''

                  return (
                    <tr key={product.id} className="hover:bg-blue-50/30 transition-colors group">
                      {/* Product Thumbnail + Name + Variant Meta */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={() => setPreviewImageModal({ product, activeImageIndex: 0 })}
                            className="relative w-13 h-11 rounded-xl overflow-hidden border border-slate-200 shadow-2xs bg-slate-50 flex-shrink-0 flex items-center justify-center group/thumb hover:border-gold transition-all cursor-zoom-in text-left focus:outline-none focus:ring-2 focus:ring-gold/50"
                            title="Klik untuk besarkan gambar produk"
                          >
                            {primaryImg ? (
                              <>
                                <img
                                  src={primaryImg}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-forest-dark/35 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                                  <ZoomIn className="w-4 h-4 text-white drop-shadow-md" />
                                </div>
                              </>
                            ) : (
                              <BedDouble className="w-5 h-5 text-gold-dark" />
                            )}
                          </button>
                          <div className="min-w-0">
                            <span className="font-bold text-forest-dark text-sm block truncate group-hover:text-forest transition-colors">
                              {product.name}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] text-slate-500 font-medium">
                                {product.variants.length} saiz varian
                              </span>
                              <span className="text-slate-300">&bull;</span>
                              <Link
                                href={`/products/${product.slug}`}
                                target="_blank"
                                className="text-[11px] text-gold-dark hover:underline inline-flex items-center gap-0.5 font-medium"
                              >
                                <span>Lihat live</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category Pill */}
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
                          {category ? category.name : 'Umum'}
                        </span>
                      </td>

                      {/* Feel & Material */}
                      <td className="py-3.5 px-3">
                        {product.firmness ? (
                          <span className="inline-block font-semibold text-xs text-forest px-2 py-0.5 rounded-md bg-forest/5 border border-forest/15">
                            {product.firmness}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                        <span className="text-[11px] text-slate-500 block truncate max-w-[150px] mt-0.5">
                          {product.material || 'Lateks & Gentian Asli'}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-3 text-right">
                        <span className="font-bold text-forest-dark text-sm block font-sans">
                          {formatMYR(minPrice)}
                        </span>
                        {maxPrice > minPrice && (
                          <span className="text-[10px] text-slate-400 block font-normal">
                            hingga {formatMYR(maxPrice)}
                          </span>
                        )}
                      </td>

                      {/* Inventory Stock Pill */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            totalStock === 0
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : totalStock <= 10
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            totalStock === 0 ? 'bg-rose-500' : totalStock <= 10 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} />
                          <span>{totalStock === 0 ? 'Habis' : `${totalStock} unit`}</span>
                        </span>
                      </td>

                      {/* Store Status */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            product.status === 'published'
                              ? 'bg-emerald-100/70 text-emerald-800 border border-emerald-300'
                              : product.status === 'draft'
                              ? 'bg-amber-100/70 text-amber-800 border border-amber-300'
                              : 'bg-slate-100 text-slate-600 border border-slate-300'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            product.status === 'published' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                          }`} />
                          <span>{product.status === 'published' ? 'Live' : product.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleEditClick(product)}
                            title="Sunting produk atelier"
                            className="px-2.5 py-1.5 rounded-lg bg-forest/10 hover:bg-forest text-forest hover:text-white font-semibold text-xs border border-forest/20 transition-all flex items-center space-x-1 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Sunting</span>
                          </button>

                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            title="Pratonton di laman web"
                            className="p-1.5 text-slate-400 hover:text-forest transition-colors rounded-lg hover:bg-slate-100 border border-transparent hover:border-slate-200"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {product.status !== 'archived' && (
                            <button
                              onClick={() => handleArchive(product.id)}
                              title="Arkibkan produk"
                              className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50 border border-transparent hover:border-rose-200 cursor-pointer"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Desktop Table Footer Info */}
        <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Menunjukkan <strong className="text-slate-800 font-bold">{filtered.length}</strong> daripada {products.length} produk atelier
          </span>
          {(search || selectedCat !== 'all' || selectedStatus !== 'all' || filterLowStockOnly) && (
            <button
              onClick={() => {
                setSearch('')
                setSelectedCat('all')
                setSelectedStatus('all')
                setFilterLowStockOnly(false)
              }}
              className="text-xs font-bold text-forest hover:underline cursor-pointer"
            >
              Set Semula Penapis
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* REDESIGNED LUXURY PRODUCT EDIT MODAL                                      */}
      {/* ========================================================================= */}
      {editingProduct && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] bg-forest-dark/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden animate-fade-in">
          <div className="bg-warmwhite w-full max-w-5xl rounded-2xl sm:rounded-3xl border border-borderLight shadow-2xl overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[92vh] my-auto animate-scale-in">
            {/* Modal Header: Royal Midnight Navy & Warm Gold */}
            <div className="px-4 py-3 sm:px-6 sm:py-4 bg-forest-dark text-warmwhite flex items-center justify-between border-b border-warmwhite/10 flex-shrink-0">
              <div className="flex items-center space-x-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-gold/40 bg-warmwhite/10 flex-shrink-0 flex items-center justify-center shadow-inner">
                  {primaryThumb ? (
                    <img src={primaryThumb} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <BedDouble className="w-6 h-6 text-gold" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold bg-gold/20 px-2 py-0.5 rounded">
                      {currentCategory?.name || 'Atelier'}
                    </span>
                    <span className="text-[11px] font-mono text-warmwhite/50 truncate">
                      ID: {editingProduct.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        editingProduct.status === 'published'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : editingProduct.status === 'draft'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-zinc-500/20 text-zinc-300 border border-zinc-500/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          editingProduct.status === 'published'
                            ? 'bg-emerald-400 animate-pulse'
                            : editingProduct.status === 'draft'
                            ? 'bg-amber-400'
                            : 'bg-zinc-400'
                        }`}
                      />
                      <span>
                        {editingProduct.status === 'published'
                          ? 'Live di Web'
                          : editingProduct.status === 'draft'
                          ? 'Draf Simpanan'
                          : 'Diarkib'}
                      </span>
                    </span>
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-warmwhite truncate mt-0.5">
                    {editingProduct.name || 'Produk Baharu'}
                  </h3>
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Live URL Link Pill in Header */}
                <div className="hidden md:flex items-center space-x-2 bg-warmwhite/10 px-2.5 py-1.5 rounded-lg border border-warmwhite/15 text-xs text-warmwhite">
                  <span className="text-[10.5px] text-warmwhite/70 font-mono">/products/{editingProduct.slug}</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        navigator.clipboard.writeText(`${window.location.origin}/products/${editingProduct.slug}`)
                        setCopiedSlug(true)
                        setTimeout(() => setCopiedSlug(false), 2000)
                      }
                    }}
                    className="text-gold hover:text-gold-light transition-colors"
                    title="Salin pautan"
                  >
                    {copiedSlug ? (
                      <span className="text-emerald-400 flex items-center gap-0.5 text-[10px]">
                        <Check className="w-3 h-3" /> Disalin
                      </span>
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>

                <Link
                  href={`/products/${editingProduct.slug}`}
                  target="_blank"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-warmwhite/10 hover:bg-warmwhite/20 border border-warmwhite/15 text-xs font-semibold text-warmwhite transition-colors"
                  title="Buka paparan produk sebenar di kedai"
                >
                  <span>Lihat di Kedai</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gold" />
                </Link>

                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="w-8 h-8 rounded-full bg-warmwhite/10 hover:bg-warmwhite/20 flex items-center justify-center text-warmwhite/80 hover:text-warmwhite transition-colors"
                  title="Tutup (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Interactive Tab Navigation Bar */}
            <div className="bg-cream/70 border-b border-borderLight px-3 sm:px-6 flex items-center space-x-2 overflow-x-auto flex-shrink-0 py-2">
              <button
                type="button"
                onClick={() => setActiveTab('general')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'general'
                    ? 'bg-warmwhite text-forest shadow-xs border border-borderLight ring-2 ring-forest/10'
                    : 'text-charcoal-muted hover:text-charcoal hover:bg-warmwhite/50'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-gold-dark" />
                <span>1. Maklumat Asas & Paparan</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('variants')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'variants'
                    ? 'bg-warmwhite text-forest shadow-xs border border-borderLight ring-2 ring-forest/10'
                    : 'text-charcoal-muted hover:text-charcoal hover:bg-warmwhite/50'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-gold-dark" />
                <span>2. Varian & Harga</span>
                <span className="w-5 h-5 rounded-full bg-forest/10 text-forest text-[10px] font-black flex items-center justify-center">
                  {editingProduct.variants?.length || 0}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('specs')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'specs'
                    ? 'bg-warmwhite text-forest shadow-xs border border-borderLight ring-2 ring-forest/10'
                    : 'text-charcoal-muted hover:text-charcoal hover:bg-warmwhite/50'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-gold-dark" />
                <span>3. Spesifikasi & Jaminan</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('images')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'images'
                    ? 'bg-warmwhite text-forest shadow-xs border border-borderLight ring-2 ring-forest/10'
                    : 'text-charcoal-muted hover:text-charcoal hover:bg-warmwhite/50'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-gold-dark" />
                <span>4. Galeri Media</span>
                <span className="w-5 h-5 rounded-full bg-forest/10 text-forest text-[10px] font-black flex items-center justify-center">
                  {editingProduct.images?.length || 0}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('features')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'features'
                    ? 'bg-warmwhite text-forest shadow-xs border border-borderLight ring-2 ring-forest/10'
                    : 'text-charcoal-muted hover:text-charcoal hover:bg-warmwhite/50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
                <span>5. Ciri-Ciri Khas</span>
                <span className="w-5 h-5 rounded-full bg-forest/10 text-forest text-[10px] font-black flex items-center justify-center">
                  {editingProduct.features?.length || 0}
                </span>
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
              {/* ============================================================= */}
              {/* TAB 1: MAKLUMAT ASAS & PAPARAN                                */}
              {/* ============================================================= */}
              {activeTab === 'general' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Status Paparan Produk */}
                  <div className="p-4 rounded-2xl bg-warmwhite border border-borderLight shadow-2xs space-y-2">
                    <label className="text-xs font-bold text-forest-dark uppercase tracking-wider block">
                      Status Paparan Produk di Kedai
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingProduct({ ...editingProduct, status: 'published' })
                        }
                        className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                          editingProduct.status === 'published'
                            ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                            : 'bg-cream/30 border-borderLight hover:bg-cream/60'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                          <div>
                            <span className="text-xs font-bold text-forest-dark block">Diterbitkan (Live)</span>
                            <span className="text-[10.5px] text-charcoal-muted">Aktif &amp; boleh dibeli di web</span>
                          </div>
                        </div>
                        {editingProduct.status === 'published' && (
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setEditingProduct({ ...editingProduct, status: 'draft' })
                        }
                        className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                          editingProduct.status === 'draft'
                            ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                            : 'bg-cream/30 border-borderLight hover:bg-cream/60'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" />
                          <div>
                            <span className="text-xs font-bold text-forest-dark block">Draf Simpanan</span>
                            <span className="text-[10.5px] text-charcoal-muted">Tersembunyi dari awam</span>
                          </div>
                        </div>
                        {editingProduct.status === 'draft' && (
                          <Check className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setEditingProduct({ ...editingProduct, status: 'archived' })
                        }
                        className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                          editingProduct.status === 'archived'
                            ? 'bg-zinc-100 border-zinc-500 ring-2 ring-zinc-500/20 shadow-xs'
                            : 'bg-cream/30 border-borderLight hover:bg-cream/60'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-zinc-400 flex-shrink-0" />
                          <div>
                            <span className="text-xs font-bold text-forest-dark block">Diarkib (Lama)</span>
                            <span className="text-[10.5px] text-charcoal-muted">Jualan telah ditamatkan</span>
                          </div>
                        </div>
                        {editingProduct.status === 'archived' && (
                          <Check className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Nama Produk & Slug URL */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-warmwhite border border-borderLight shadow-2xs space-y-1.5">
                      <label className="text-xs font-bold text-forest-dark uppercase tracking-wider block">
                        Nama Penuh Produk <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Kamaar Royal Heritage 100% Natural Latex Mattress"
                        value={editingProduct.name}
                        onChange={(e) => {
                          const name = e.target.value
                          setEditingProduct({
                            ...editingProduct,
                            name,
                          })
                        }}
                        className="w-full px-3.5 py-2.5 text-xs font-bold text-forest-dark rounded-xl bg-cream/40 border border-borderLight focus:outline-none focus:ring-1 focus:ring-gold"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-warmwhite border border-borderLight shadow-2xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-forest-dark uppercase tracking-wider block">
                          Slug URL Web <span className="text-rose-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const generated = editingProduct.name
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, '-')
                              .replace(/(^-|-$)+/g, '')
                            setEditingProduct({ ...editingProduct, slug: generated })
                          }}
                          className="text-[10.5px] text-forest font-bold hover:underline whitespace-nowrap"
                        >
                          ⚡ Jana dari Nama
                        </button>
                      </div>
                      <div className="flex items-center">
                        <span className="px-3 py-2.5 bg-cream border border-r-0 border-borderLight rounded-l-xl text-xs font-mono text-charcoal-muted select-none">
                          /products/
                        </span>
                        <input
                          type="text"
                          required
                          value={editingProduct.slug}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              slug: e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/(^-|-$)+/g, ''),
                            })
                          }
                          className="w-full px-3 py-2.5 text-xs rounded-r-xl bg-cream/40 border border-borderLight font-mono focus:outline-none focus:ring-1 focus:ring-gold font-bold text-forest"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SEKSYEN 3: KATEGORI vs JENIS PRODUK */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-cream/30 border border-borderLight space-y-3">
                    <span className="text-xs font-bold text-forest-dark uppercase tracking-wider block">
                      Klasifikasi & Format Produk
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 1. Kategori Navigasi Kedai */}
                      <div
                        className="p-4 bg-warmwhite rounded-2xl border border-borderLight shadow-2xs space-y-2.5 relative"
                        ref={catDropdownRef}
                      >
                        <div>
                          <label className="text-xs font-bold text-forest-dark block">
                            Kategori Navigasi Kedai
                          </label>
                          <span className="text-[10.5px] text-charcoal-muted">
                            Menu utama & halaman koleksi web
                          </span>
                        </div>

                        {/* Luxury Custom Dropdown Trigger */}
                        <div className="relative">
                          {(() => {
                            const selectedCat =
                              categories.find((c) => c.id === editingProduct.categoryId) || categories[0]
                            const meta = getCategoryMeta(selectedCat?.name)
                            const IconComp = meta.icon

                            return (
                              <div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCatDropdownOpen(!catDropdownOpen)
                                    setTypeDropdownOpen(false)
                                  }}
                                  className={`w-full p-2.5 sm:p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                                    catDropdownOpen
                                      ? 'bg-cream/60 border-gold ring-2 ring-gold/25 shadow-xs'
                                      : 'bg-warmwhite border-borderLight hover:border-gold/60 hover:bg-cream/30'
                                  }`}
                                >
                                  <div className="flex items-center space-x-3 min-w-0">
                                    <div
                                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${meta.iconColor}`}
                                    >
                                      <IconComp className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                      <span className="text-xs font-bold text-forest-dark block truncate">
                                        {selectedCat?.name || 'Pilih Kategori'}
                                      </span>
                                      <span className="text-[10.5px] text-charcoal-muted block truncate">
                                        {meta.badgeText} &bull; /collections/{selectedCat?.slug}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-1.5 flex-shrink-0 ml-2">
                                    <span className="text-[10px] font-bold text-gold-dark bg-gold/15 px-2 py-0.5 rounded">
                                      Tukar
                                    </span>
                                    <ChevronDown
                                      className={`w-4 h-4 text-charcoal-muted transition-transform duration-200 ${
                                        catDropdownOpen ? 'transform rotate-180 text-forest' : ''
                                      }`}
                                    />
                                  </div>
                                </button>

                                {/* Custom Popover Dropdown Menu */}
                                {catDropdownOpen && (
                                  <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-warmwhite rounded-2xl border border-gold/40 shadow-2xl p-2 space-y-1 animate-scale-in max-h-72 overflow-y-auto">
                                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-charcoal-muted border-b border-borderLight/60 mb-1 flex items-center justify-between">
                                      <span>Pilih Kategori Paparan Kedai</span>
                                      <span className="text-forest font-mono">{categories.length} Kategori</span>
                                    </div>

                                    {categories.map((c) => {
                                      const itemMeta = getCategoryMeta(c.name)
                                      const ItemIcon = itemMeta.icon
                                      const isSelected = c.id === editingProduct.categoryId

                                      return (
                                        <button
                                          key={c.id}
                                          type="button"
                                          onClick={() => {
                                            setEditingProduct({ ...editingProduct, categoryId: c.id })
                                            setCatDropdownOpen(false)
                                          }}
                                          className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer ${
                                            isSelected
                                              ? 'bg-cream/80 border border-gold/40 text-forest-dark font-bold'
                                              : 'hover:bg-cream/40 text-charcoal border border-transparent'
                                          }`}
                                        >
                                          <div className="flex items-center space-x-2.5 min-w-0">
                                            <div
                                              className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border ${itemMeta.iconColor}`}
                                            >
                                              <ItemIcon className="w-3.5 h-3.5" />
                                            </div>
                                            <div className="min-w-0">
                                              <span className="text-xs block truncate font-bold text-forest-dark">
                                                {c.name}
                                              </span>
                                              <span className="text-[10px] text-charcoal-muted block truncate">
                                                {itemMeta.desc}
                                              </span>
                                            </div>
                                          </div>

                                          {isSelected ? (
                                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 ml-2">
                                              <Check className="w-3 h-3" />
                                            </span>
                                          ) : (
                                            <span className="text-[10px] font-mono text-charcoal-muted/60 flex-shrink-0 ml-2">
                                              /{c.slug}
                                            </span>
                                          )}
                                        </button>
                                      )
                                    })}
                                  </div>
                                )}
                              </div>
                            )
                          })()}
                        </div>

                      </div>

                      {/* 2. Jenis Produk (Product Type) */}
                      <div
                        className="p-4 bg-warmwhite rounded-2xl border border-borderLight shadow-2xs space-y-2.5 relative"
                        ref={typeDropdownRef}
                      >
                        <div>
                          <label className="text-xs font-bold text-forest-dark block">
                            Jenis Produk (Product Type)
                          </label>
                          <span className="text-[10.5px] text-charcoal-muted">
                            Format spesifikasi & atribut teknikal
                          </span>
                        </div>

                        {/* Luxury Custom Dropdown Trigger */}
                        <div className="relative">
                          {(() => {
                            const currentTypeObj =
                              productTypesList.find((t) => t.type === editingProduct.productType) ||
                              productTypesList[0]
                            const IconComp = currentTypeObj.icon

                            return (
                              <div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTypeDropdownOpen(!typeDropdownOpen)
                                    setCatDropdownOpen(false)
                                  }}
                                  className={`w-full p-2.5 sm:p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                                    typeDropdownOpen
                                      ? 'bg-cream/60 border-gold ring-2 ring-gold/25 shadow-xs'
                                      : 'bg-warmwhite border-borderLight hover:border-gold/60 hover:bg-cream/30'
                                  }`}
                                >
                                  <div className="flex items-center space-x-3 min-w-0">
                                    <div
                                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${currentTypeObj.color}`}
                                    >
                                      <IconComp className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                      <span className="text-xs font-bold text-forest-dark block truncate">
                                        {currentTypeObj.name}
                                      </span>
                                      <span className="text-[10.5px] text-charcoal-muted block truncate">
                                        {currentTypeObj.badge} &bull; {currentTypeObj.desc.slice(0, 36)}...
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-1.5 flex-shrink-0 ml-2">
                                    <span className="text-[10px] font-bold text-gold-dark bg-gold/15 px-2 py-0.5 rounded">
                                      Tukar
                                    </span>
                                    <ChevronDown
                                      className={`w-4 h-4 text-charcoal-muted transition-transform duration-200 ${
                                        typeDropdownOpen ? 'transform rotate-180 text-forest' : ''
                                      }`}
                                    />
                                  </div>
                                </button>

                                {/* Custom Popover Dropdown Menu */}
                                {typeDropdownOpen && (
                                  <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-warmwhite rounded-2xl border border-gold/40 shadow-2xl p-2 space-y-1 animate-scale-in">
                                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-charcoal-muted border-b border-borderLight/60 mb-1 flex items-center justify-between">
                                      <span>Pilih Format Spesifikasi Produk</span>
                                      <span className="text-forest font-mono">{productTypesList.length} Jenis</span>
                                    </div>

                                    {productTypesList.map((t) => {
                                      const ItemIcon = t.icon
                                      const isSelected = t.type === editingProduct.productType

                                      return (
                                        <button
                                          key={t.type}
                                          type="button"
                                          onClick={() => {
                                            setEditingProduct({
                                              ...editingProduct,
                                              productType: t.type as any,
                                            })
                                            setTypeDropdownOpen(false)
                                          }}
                                          className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer ${
                                            isSelected
                                              ? 'bg-cream/80 border border-gold/40 text-forest-dark font-bold'
                                              : 'hover:bg-cream/40 text-charcoal border border-transparent'
                                          }`}
                                        >
                                          <div className="flex items-center space-x-3 min-w-0">
                                            <div
                                              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${t.color}`}
                                            >
                                              <ItemIcon className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0">
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-bold text-forest-dark">
                                                  {t.name}
                                                </span>
                                                <span className="text-[9.5px] font-bold bg-cream px-1.5 py-0.5 rounded border border-borderLight/60 text-charcoal-muted">
                                                  {t.badge}
                                                </span>
                                              </div>
                                              <span className="text-[10px] text-charcoal-muted block truncate mt-0.5">
                                                {t.desc}
                                              </span>
                                            </div>
                                          </div>

                                          {isSelected && (
                                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 ml-2">
                                              <Check className="w-3 h-3" />
                                            </span>
                                          )}
                                        </button>
                                      )
                                    })}
                                  </div>
                                )}
                              </div>
                            )
                          })()}
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* SEKSYEN 4: SUB-TAJUK vs TAGLINE PROMOSI */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Sub-Tajuk */}
                    <div className="p-4 rounded-2xl bg-warmwhite border border-borderLight shadow-2xs space-y-1.5">
                      <label className="text-xs font-bold text-forest-dark uppercase tracking-wider block">
                        Sub-Tajuk / Spesifikasi Ringkas
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: 100% Pure Organic Dunlop Latex with Belgian Tencel Cover"
                        value={editingProduct.subtitle || ''}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, subtitle: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-cream/40 border border-borderLight focus:outline-none focus:ring-1 focus:ring-gold font-medium"
                      />
                    </div>

                    {/* Tagline Promosi */}
                    <div className="p-4 rounded-2xl bg-warmwhite border border-borderLight shadow-2xs space-y-1.5">
                      <label className="text-xs font-bold text-forest-dark uppercase tracking-wider block">
                        Tagline Promosi (Slogan)
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Signature Handcrafted Malaysian Sleep Luxury"
                        value={editingProduct.tagline || ''}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, tagline: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-cream/40 border border-borderLight focus:outline-none focus:ring-1 focus:ring-gold font-medium"
                      />
                    </div>
                  </div>

                  {/* SEKSYEN 5: PENERANGAN PENUH PRODUK */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-warmwhite border border-borderLight shadow-2xs space-y-2">
                    <label className="text-xs font-bold text-forest-dark uppercase tracking-wider block">
                      Penerangan Penuh Produk (Product Story)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tulis penerangan lengkap mengenai kelebihan produk, teknologi pembuatan, dan jaminan keselesaan..."
                      value={editingProduct.description}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, description: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-cream/40 border border-borderLight focus:outline-none focus:ring-1 focus:ring-gold leading-relaxed font-sans"
                    />
                  </div>

                  {/* SEKSYEN 6: TAMPIL SEBAGAI PRODUK PILIHAN HOMEPAGE */}
                  <div className="p-4 sm:p-5 bg-warmwhite rounded-2xl border border-borderLight shadow-2xs flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-forest-dark block">
                        Tampil Sebagai Produk Pilihan (Featured Collection)
                      </span>
                      <span className="text-[11px] text-charcoal-muted block mt-0.5">
                        Paparkan produk ini di bahagian koleksi pilihan pada muka depan (Homepage kamaar.my)
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
                      <input
                        type="checkbox"
                        checked={Boolean(editingProduct.isFeatured)}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-12 h-6 bg-borderLight peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-warmwhite after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-warmwhite after:border-borderLight after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-forest"></div>
                    </label>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 2: VARIAN SAIZ, HARGA & INVENTORI                         */}
              {/* ============================================================= */}
              {activeTab === 'variants' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Top Stats Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-cream/40 p-3.5 rounded-2xl border border-borderLight">
                      <span className="text-[10px] uppercase font-bold text-charcoal-muted">Pilihan Saiz</span>
                      <p className="text-xl font-bold font-serif text-forest-dark mt-0.5">
                        {editingProduct.variants.length} Saiz
                      </p>
                    </div>

                    <div className="bg-cream/40 p-3.5 rounded-2xl border border-borderLight">
                      <span className="text-[10px] uppercase font-bold text-charcoal-muted">Jumlah Stok Gudang</span>
                      <p className="text-xl font-bold font-serif text-emerald-700 mt-0.5">
                        {editingProduct.variants.reduce((a, v) => a + Number(v.stockQuantity || 0), 0)} Unit
                      </p>
                    </div>

                    <div className="bg-cream/40 p-3.5 rounded-2xl border border-borderLight">
                      <span className="text-[10px] uppercase font-bold text-charcoal-muted">Harga Terendah</span>
                      <p className="text-xl font-bold font-serif text-forest mt-0.5">
                        {formatMYR(
                          editingProduct.variants.length > 0
                            ? Math.min(...editingProduct.variants.map((v) => v.priceSen))
                            : 0
                        )}
                      </p>
                    </div>

                    <div className="bg-cream/40 p-3.5 rounded-2xl border border-borderLight">
                      <span className="text-[10px] uppercase font-bold text-charcoal-muted">Harga Tertinggi</span>
                      <p className="text-xl font-bold font-serif text-forest-dark mt-0.5">
                        {formatMYR(
                          editingProduct.variants.length > 0
                            ? Math.max(...editingProduct.variants.map((v) => v.priceSen))
                            : 0
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Fast Preset Buttons for Malaysian Standard Sizes */}
                  <div className="p-3.5 bg-cream/30 rounded-2xl border border-borderLight space-y-2">
                    <span className="text-xs font-bold text-forest-dark uppercase tracking-wider block">
                      Tambah Saiz Piawai Malaysia Pantas
                    </span>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => addPresetVariant('Single', '90 x 190 x 30 cm', 139900)}
                        className="px-3 py-1.5 rounded-xl bg-warmwhite border border-borderLight text-xs font-bold text-forest hover:bg-forest hover:text-warmwhite transition-colors shadow-2xs"
                        title="Tambah Single (90x190cm)"
                      >
                        + Single (90 x 190 cm)
                      </button>
                      <button
                        type="button"
                        onClick={() => addPresetVariant('Super Single', '107 x 190 x 30 cm', 169900)}
                        className="px-3 py-1.5 rounded-xl bg-warmwhite border border-borderLight text-xs font-bold text-forest hover:bg-forest hover:text-warmwhite transition-colors shadow-2xs"
                        title="Tambah Super Single (107x190cm)"
                      >
                        + Super Single (107 x 190 cm)
                      </button>
                      <button
                        type="button"
                        onClick={() => addPresetVariant('Queen', '152 x 190 x 30 cm', 229900)}
                        className="px-3 py-1.5 rounded-xl bg-warmwhite border border-borderLight text-xs font-bold text-forest hover:bg-forest hover:text-warmwhite transition-colors shadow-2xs"
                        title="Tambah Queen (152x190cm) - Saiz Paling Popular"
                      >
                        + Queen (152 x 190 cm) ⭐
                      </button>
                      <button
                        type="button"
                        onClick={() => addPresetVariant('King', '183 x 190 x 30 cm', 279900)}
                        className="px-3 py-1.5 rounded-xl bg-warmwhite border border-borderLight text-xs font-bold text-forest hover:bg-forest hover:text-warmwhite transition-colors shadow-2xs"
                        title="Tambah King (183x190cm)"
                      >
                        + King (183 x 190 cm)
                      </button>
                      <button
                        type="button"
                        onClick={() => addPresetVariant('Custom Size', 'Bespoke Order', 199900)}
                        className="px-3 py-1.5 rounded-xl bg-warmwhite border border-borderLight text-xs font-bold text-gold-dark hover:bg-gold hover:text-forest-dark transition-colors shadow-2xs"
                        title="Tambah Saiz Khas Tempahan"
                      >
                        + Saiz Khas (Bespoke)
                      </button>
                    </div>
                  </div>

                  {/* Variants Cards List */}
                  <div className="space-y-4">
                    {editingProduct.variants.map((variant, vIdx) => {
                      const isLowStock = variant.stockQuantity > 0 && variant.stockQuantity <= 5
                      const isOutOfStock = variant.stockQuantity === 0
                      const hasDiscount =
                        Boolean(variant.compareAtPriceSen) &&
                        Number(variant.compareAtPriceSen) > variant.priceSen
                      const discountAmount = hasDiscount
                        ? Number(variant.compareAtPriceSen) - variant.priceSen
                        : 0
                      const discountPercent = hasDiscount
                        ? Math.round((discountAmount / Number(variant.compareAtPriceSen)) * 100)
                        : 0

                      return (
                        <div
                          key={variant.id}
                          className="p-5 bg-warmwhite rounded-2xl border border-borderLight shadow-2xs hover:shadow-xs transition-shadow space-y-4"
                        >
                          {/* Variant Card Header */}
                          <div className="flex flex-wrap items-center justify-between border-b border-borderLight/60 pb-3 gap-2">
                            <div className="flex items-center space-x-2.5">
                              <span className="w-6 h-6 rounded-full bg-forest text-warmwhite text-xs font-bold flex items-center justify-center">
                                {vIdx + 1}
                              </span>
                              <span className="font-bold text-forest-dark text-sm">
                                {variant.sizeName || 'Varian'}
                              </span>
                              <span className="text-[10px] font-mono text-charcoal-muted bg-cream px-2 py-0.5 rounded border border-borderLight">
                                SKU: {variant.sku}
                              </span>
                              {variant.dimensions && (
                                <span className="text-[10px] text-charcoal-muted hidden sm:inline">
                                  ({variant.dimensions})
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-3">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                                  isOutOfStock
                                    ? 'bg-rose-100 text-rose-700'
                                    : isLowStock
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-emerald-100 text-emerald-700'
                                }`}
                              >
                                <span>
                                  {isOutOfStock
                                    ? '🔴 Habis Stok (Sold Out)'
                                    : isLowStock
                                    ? `🟡 Stok Terhad (${variant.stockQuantity} Unit)`
                                    : `🟢 Stok Sedia Ada (${variant.stockQuantity} Unit)`}
                                </span>
                              </span>

                              <button
                                type="button"
                                onClick={() => removeVariant(vIdx)}
                                className="p-1.5 rounded-lg text-charcoal-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Padam saiz ini"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Variant Inputs Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                            {/* Nama Saiz */}
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-forest-dark block">
                                Nama Saiz <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                placeholder="Queen"
                                value={variant.sizeName}
                                onChange={(e) => {
                                  const next = [...editingProduct.variants]
                                  next[vIdx].sizeName = e.target.value
                                  setEditingProduct({ ...editingProduct, variants: next })
                                }}
                                className="w-full px-3 py-2 text-xs rounded-xl bg-cream/40 border border-borderLight focus:outline-none focus:ring-1 focus:ring-gold font-medium"
                              />
                            </div>

                            {/* SKU */}
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-forest-dark block">
                                Kod SKU
                              </label>
                              <input
                                type="text"
                                placeholder="KAM-HER-QEN"
                                value={variant.sku}
                                onChange={(e) => {
                                  const next = [...editingProduct.variants]
                                  next[vIdx].sku = e.target.value
                                  setEditingProduct({ ...editingProduct, variants: next })
                                }}
                                className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-cream/40 border border-borderLight focus:outline-none focus:ring-1 focus:ring-gold font-bold text-forest"
                              />
                            </div>

                            {/* Dimensi */}
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-forest-dark block">
                                Dimensi (cm)
                              </label>
                              <input
                                type="text"
                                placeholder="152 x 190 x 30 cm"
                                value={variant.dimensions || ''}
                                onChange={(e) => {
                                  const next = [...editingProduct.variants]
                                  next[vIdx].dimensions = e.target.value
                                  setEditingProduct({ ...editingProduct, variants: next })
                                }}
                                className="w-full px-3 py-2 text-xs rounded-xl bg-cream/40 border border-borderLight focus:outline-none focus:ring-1 focus:ring-gold font-medium"
                              />
                            </div>

                            {/* Harga Jualan Sebenar */}
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-forest-dark block">
                                Harga Jualan <span className="text-rose-500">*</span>
                              </label>
                              <div className="flex items-center">
                                <span className="px-2 py-2 bg-cream border border-r-0 border-borderLight rounded-l-xl text-xs font-bold text-forest">
                                  RM
                                </span>
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
                                  className="w-full px-2.5 py-2 text-xs rounded-r-xl bg-cream/40 border border-borderLight font-bold text-forest-dark focus:outline-none focus:ring-1 focus:ring-gold"
                                />
                              </div>
                            </div>

                            {/* Harga Asal Coret (Compare-At) */}
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-forest-dark block">
                                Harga Asal (Coret)
                              </label>
                              <div className="flex items-center">
                                <span className="px-2 py-2 bg-cream border border-r-0 border-borderLight rounded-l-xl text-xs font-bold text-charcoal-muted">
                                  RM
                                </span>
                                <input
                                  type="number"
                                  step="0.01"
                                  placeholder="0.00"
                                  value={
                                    variant.compareAtPriceSen
                                      ? (variant.compareAtPriceSen / 100).toFixed(2)
                                      : ''
                                  }
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0
                                    const next = [...editingProduct.variants]
                                    next[vIdx].compareAtPriceSen =
                                      val > 0 ? Math.round(val * 100) : undefined
                                    setEditingProduct({ ...editingProduct, variants: next })
                                  }}
                                  className="w-full px-2.5 py-2 text-xs rounded-r-xl bg-cream/40 border border-borderLight text-charcoal font-medium focus:outline-none focus:ring-1 focus:ring-gold"
                                />
                              </div>
                            </div>

                            {/* Baki Stok Fizikal */}
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-forest-dark block">
                                Baki Stok <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={variant.stockQuantity}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0
                                  const next = [...editingProduct.variants]
                                  next[vIdx].stockQuantity = val
                                  setEditingProduct({ ...editingProduct, variants: next })
                                }}
                                className={`w-full px-3 py-2 text-xs rounded-xl border font-bold focus:outline-none focus:ring-1 focus:ring-gold ${
                                  isOutOfStock
                                    ? 'bg-rose-50 border-rose-300 text-rose-700'
                                    : isLowStock
                                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                                    : 'bg-cream/40 border-borderLight text-forest-dark'
                                }`}
                              />
                            </div>
                          </div>

                          {/* Live Discount Calculation Badge */}
                          {hasDiscount && (
                            <div className="pt-1 flex items-center space-x-2 text-[11px] text-emerald-800 bg-emerald-50/80 px-3 py-1.5 rounded-xl border border-emerald-200">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                              <span>
                                <strong>Diskaun Aktif di Web:</strong> Pelanggan nampak penjimatan{' '}
                                <strong className="text-emerald-900">{formatMYR(discountAmount)}</strong>{' '}
                                ({discountPercent}% OFF) dengan harga asal dipotong coret.
                              </span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 3: SPESIFIKASI & JAMINAN                                  */}
              {/* ============================================================= */}
              {activeTab === 'specs' && (
                <div className="space-y-5 animate-fade-in">
                  {/* Material Core */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-warmwhite border border-borderLight shadow-2xs space-y-1.5">
                    <label className="text-xs font-bold text-forest-dark uppercase tracking-wider block">
                      Bahan Teras (Core Material)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 100% Pure Organic Latex & Cool Night Pocket Springs"
                      value={editingProduct.material || ''}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, material: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-cream/40 border border-borderLight focus:outline-none focus:ring-1 focus:ring-gold font-medium"
                    />
                  </div>

                  {/* Firmness Slider (1 to 10) */}
                  <div className="p-5 bg-warmwhite rounded-2xl border border-borderLight shadow-2xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="text-xs font-bold text-forest-dark uppercase tracking-wider block">
                        Skala Ketegasan Tilam (Firmness Rating 1 - 10)
                      </label>
                      <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-gold/20 text-forest-dark border border-gold/40 shadow-2xs self-start sm:self-auto">
                        Skor: {editingProduct.firmnessScale || 6} / 10 &bull;{' '}
                        {getFirmnessLabel(editingProduct.firmnessScale || 6)}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={editingProduct.firmnessScale || 6}
                      onChange={(e) => {
                        const scale = parseInt(e.target.value) || 6
                        setEditingProduct({
                          ...editingProduct,
                          firmnessScale: scale,
                          firmness: getFirmnessLabel(scale),
                        })
                      }}
                      className="w-full accent-forest cursor-pointer h-2.5 bg-borderLight rounded-lg"
                    />

                    {/* Firmness Level Guide */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center pt-1">
                      <div
                        className={`p-2 rounded-xl border text-[10.5px] transition-colors ${
                          (editingProduct.firmnessScale || 6) <= 2
                            ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-900'
                            : 'bg-cream/30 border-borderLight text-charcoal-muted'
                        }`}
                      >
                        <span className="block font-bold">1 - 2</span>
                        <span>Plush Soft</span>
                      </div>

                      <div
                        className={`p-2 rounded-xl border text-[10.5px] transition-colors ${
                          (editingProduct.firmnessScale || 6) >= 3 && (editingProduct.firmnessScale || 6) <= 4
                            ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-900'
                            : 'bg-cream/30 border-borderLight text-charcoal-muted'
                        }`}
                      >
                        <span className="block font-bold">3 - 4</span>
                        <span>Medium Soft</span>
                      </div>

                      <div
                        className={`p-2 rounded-xl border text-[10.5px] transition-colors ${
                          (editingProduct.firmnessScale || 6) >= 5 && (editingProduct.firmnessScale || 6) <= 6
                            ? 'bg-gold/20 border-gold-dark font-bold text-forest-dark ring-2 ring-gold/20'
                            : 'bg-cream/30 border-borderLight text-charcoal-muted'
                        }`}
                      >
                        <span className="block font-bold">5 - 6 (Popular ⭐)</span>
                        <span>Medium Firm</span>
                      </div>

                      <div
                        className={`p-2 rounded-xl border text-[10.5px] transition-colors ${
                          (editingProduct.firmnessScale || 6) >= 7 && (editingProduct.firmnessScale || 6) <= 8
                            ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-900'
                            : 'bg-cream/30 border-borderLight text-charcoal-muted'
                        }`}
                      >
                        <span className="block font-bold">7 - 8</span>
                        <span>Firm</span>
                      </div>

                      <div
                        className={`p-2 rounded-xl border text-[10.5px] transition-colors ${
                          (editingProduct.firmnessScale || 6) >= 9
                            ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-900'
                            : 'bg-cream/30 border-borderLight text-charcoal-muted'
                        }`}
                      >
                        <span className="block font-bold">9 - 10</span>
                        <span>Orthopaedic</span>
                      </div>
                    </div>
                  </div>

                  {/* Thickness, Warranty, Trial Nights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Ketebalan Tilam */}
                    <div className="p-4 rounded-2xl bg-warmwhite border border-borderLight shadow-2xs space-y-1.5">
                      <label className="text-xs font-bold text-forest-dark uppercase tracking-wider block">
                        Ketebalan Tilam (cm)
                      </label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          min="1"
                          placeholder="30"
                          value={editingProduct.thicknessCm || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              thicknessCm: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3.5 py-2.5 text-xs rounded-l-xl bg-cream/40 border border-borderLight focus:outline-none focus:ring-1 focus:ring-gold font-bold text-forest-dark"
                        />
                        <span className="px-3 py-2.5 bg-cream border border-l-0 border-borderLight rounded-r-xl text-xs font-bold text-charcoal-muted">
                          cm
                        </span>
                      </div>
                    </div>

                    {/* Jaminan Rasmi Kilang */}
                    <div className="p-4 rounded-2xl bg-warmwhite border border-borderLight shadow-2xs space-y-1.5">
                      <label className="text-xs font-bold text-forest-dark uppercase tracking-wider block">
                        Jaminan Rasmi (Tahun)
                      </label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          min="0"
                          placeholder="12"
                          value={editingProduct.warrantyYears || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              warrantyYears: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3.5 py-2.5 text-xs rounded-l-xl bg-cream/40 border border-borderLight focus:outline-none focus:ring-1 focus:ring-gold font-bold text-forest-dark"
                        />
                        <span className="px-3 py-2.5 bg-cream border border-l-0 border-borderLight rounded-r-xl text-xs font-bold text-charcoal-muted">
                          Tahun
                        </span>
                      </div>
                    </div>

                    {/* Percubaan Tidur Di Rumah */}
                    <div className="p-4 rounded-2xl bg-warmwhite border border-borderLight shadow-2xs space-y-1.5">
                      <label className="text-xs font-bold text-forest-dark uppercase tracking-wider block">
                        Percubaan Rumah (Malam)
                      </label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          min="0"
                          placeholder="100"
                          value={editingProduct.trialNights || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              trialNights: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3.5 py-2.5 text-xs rounded-l-xl bg-cream/40 border border-borderLight focus:outline-none focus:ring-1 focus:ring-gold font-bold text-forest-dark"
                        />
                        <span className="px-3 py-2.5 bg-cream border border-l-0 border-borderLight rounded-r-xl text-xs font-bold text-charcoal-muted">
                          Malam
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 4: GALERI MEDIA & IMEJ                                    */}
              {/* ============================================================= */}
              {activeTab === 'images' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Hidden file inputs for upload & replace */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleUploadFiles(e.target.files)
                      }
                    }}
                    className="hidden"
                  />
                  <input
                    ref={replaceFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleReplaceImageFile(e.target.files[0])
                      }
                    }}
                    className="hidden"
                  />

                  {/* Top Summary Bar */}
                  <div className="p-3.5 bg-warmwhite rounded-2xl border border-borderLight shadow-2xs flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-forest-dark uppercase tracking-wider text-xs block">
                        Galeri Foto & Imej Produk
                      </span>
                      <span className="text-[11px] text-charcoal-muted">
                        Pilih sekurang-kurangnya 1 foto sebagai sampul utama
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-cream/60 border border-borderLight text-[11px] font-semibold text-charcoal-muted">
                        Jumlah: <strong>{editingProduct.images?.length || 0} Imej</strong>
                      </span>
                      {editingProduct.images?.some((img) => img.isPrimary) ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Sampul Aktif
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-[11px] font-semibold text-amber-700 flex items-center gap-1">
                          ⚠️ Tiada Sampul
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add New Image Form with Mode Switcher */}
                  <div className="bg-warmwhite rounded-2xl border border-borderLight shadow-2xs overflow-hidden">
                    {/* Header with Luxury Mode Tabs */}
                    <div className="p-4 sm:px-5 sm:py-3.5 bg-cream/40 border-b border-borderLight flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-forest-dark uppercase tracking-wider block">
                          + Tambah Imej Baharu ke Galeri Produk
                        </span>
                        <span className="text-[11px] text-charcoal-muted">
                          Pilih kaedah muat naik fail atau pautan URL luar
                        </span>
                      </div>

                      {/* Mode Switcher Tabs */}
                      <div className="flex items-center p-1 bg-warmwhite rounded-xl border border-borderLight/80 shadow-2xs self-stretch sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setImageUploadMode('upload')}
                          className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                            imageUploadMode === 'upload'
                              ? 'bg-forest text-warmwhite shadow-xs'
                              : 'text-charcoal-muted hover:text-charcoal'
                          }`}
                        >
                          <UploadCloud className="w-3.5 h-3.5 text-gold" />
                          <span>Muat Naik Fail (Upload)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageUploadMode('url')}
                          className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                            imageUploadMode === 'url'
                              ? 'bg-forest text-warmwhite shadow-xs'
                              : 'text-charcoal-muted hover:text-charcoal'
                          }`}
                        >
                          <Tag className="w-3.5 h-3.5 text-gold" />
                          <span>Pautan URL / CDN</span>
                        </button>
                      </div>
                    </div>

                    {/* Mode 1: Luxury File Upload Dropzone */}
                    {imageUploadMode === 'upload' ? (
                      <div className="p-4 sm:p-6 space-y-4">
                        <div
                          onDragOver={(e) => {
                            e.preventDefault()
                            setIsDraggingOver(true)
                          }}
                          onDragLeave={() => setIsDraggingOver(false)}
                          onDrop={(e) => {
                            e.preventDefault()
                            setIsDraggingOver(false)
                            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                              handleUploadFiles(e.dataTransfer.files)
                            }
                          }}
                          onClick={() => fileInputRef.current?.click()}
                          className={`relative rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center group ${
                            isDraggingOver
                              ? 'border-gold bg-gold/10 scale-[1.01] shadow-md'
                              : 'border-gold/40 hover:border-gold hover:bg-gold/5 bg-cream/30'
                          }`}
                        >
                          <div className="w-14 h-14 rounded-2xl bg-gold/20 flex items-center justify-center text-gold-dark group-hover:scale-110 transition-transform mb-3 shadow-2xs">
                            <UploadCloud className="w-7 h-7" />
                          </div>

                          <span className="text-sm font-bold text-forest-dark block mb-1">
                            Klik untuk Pilih Fail Gambar dari Komputer / Telefon
                          </span>
                          <span className="text-xs text-charcoal-muted block mb-3">
                            atau seret & lepaskan fail gambar (Drag & Drop) di sini
                          </span>

                          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                            <span className="text-[10px] font-semibold bg-warmwhite px-2.5 py-1 rounded-full border border-borderLight text-charcoal-muted">
                              Menyokong JPG, PNG, WEBP, GIF, AVIF
                            </span>
                            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                              ⚡ Boleh pilih banyak gambar sekaligus (Multi-Select)
                            </span>
                          </div>

                          <button
                            type="button"
                            className="px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold shadow-xs flex items-center space-x-2 transition-all group-hover:shadow-md"
                          >
                            <ImagePlus className="w-4 h-4 text-gold" />
                            <span>Pilih Fail Gambar dari Peranti</span>
                          </button>
                        </div>

                        {/* Uploading progress indicator */}
                        {isUploadingImage && (
                          <div className="flex items-center justify-center space-x-3 p-3.5 bg-gold/10 border border-gold/30 rounded-xl text-xs text-forest-dark animate-pulse">
                            <Loader2 className="w-4 h-4 animate-spin text-gold-dark" />
                            <span className="font-semibold">
                              Sedang memproses dan memuat naik fail imej ke server KAMAAR...
                            </span>
                          </div>
                        )}

                        {/* Status Feedback Banners */}
                        {uploadSuccessMsg && (
                          <div className="flex items-center space-x-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 animate-fade-in">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <span className="font-medium">{uploadSuccessMsg}</span>
                          </div>
                        )}

                        {uploadError && (
                          <div className="flex items-center space-x-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 animate-fade-in">
                            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                            <span className="font-medium">{uploadError}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Mode 2: URL / CDN Input */
                      <div className="p-4 sm:p-5 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                          <div className="md:col-span-2">
                            <label className="block text-[10.5px] font-bold text-charcoal-muted mb-1">
                              Alamat URL Imej (Web URL atau /images/...)
                            </label>
                            <input
                              type="text"
                              placeholder="Masukkan URL imej (cth: https://images.unsplash.com/... atau /images/products/...)"
                              value={newImageUrl}
                              onChange={(e) => setNewImageUrl(e.target.value)}
                              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-cream/40 border border-borderLight focus:outline-none focus:ring-1 focus:ring-gold font-mono"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[10.5px] font-bold text-charcoal-muted mb-1">
                              Alt Text (Untuk SEO Google)
                            </label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                placeholder="Cth: Tilam Queen Latex"
                                value={newImageAlt}
                                onChange={(e) => setNewImageAlt(e.target.value)}
                                className="w-full px-3 py-2.5 text-xs rounded-xl bg-cream/40 border border-borderLight focus:outline-none focus:ring-1 focus:ring-gold"
                              />
                              <button
                                type="button"
                                onClick={handleAddImage}
                                className="px-4 py-2.5 bg-forest text-warmwhite text-xs font-bold rounded-xl hover:bg-forest-dark transition-colors whitespace-nowrap shadow-xs"
                              >
                                Tambah
                              </button>
                            </div>
                          </div>
                        </div>

                        {uploadSuccessMsg && (
                          <div className="flex items-center space-x-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <span>{uploadSuccessMsg}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Images Grid Header */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-bold text-forest-dark uppercase tracking-wider block">
                      Senarai Galeri Imej Produk ({editingProduct.images?.length || 0})
                    </span>
                    <span className="text-[11px] text-charcoal-muted">
                      Klik <strong>&ldquo;Jadikan Sampul Utama&rdquo;</strong> untuk memilih foto utama di katalog
                    </span>
                  </div>

                  {/* Images Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {(editingProduct.images || []).map((img, iIdx) => (
                      <div
                        key={img.id || iIdx}
                        className={`p-3 bg-warmwhite rounded-2xl border transition-all relative group flex flex-col justify-between ${
                          img.isPrimary
                            ? 'border-gold ring-2 ring-gold/25 shadow-xs'
                            : 'border-borderLight hover:border-gold/40'
                        }`}
                      >
                        <div className="w-full h-48 rounded-xl overflow-hidden bg-cream border border-borderLight mb-3 relative flex items-center justify-center">
                          {img.imageUrl ? (
                            <img
                              src={img.imageUrl}
                              alt={img.altText}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <BedDouble className="w-10 h-10 text-gold/40" />
                          )}

                          {img.isPrimary ? (
                            <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gold text-forest-dark shadow-md flex items-center space-x-1">
                              <Star className="w-3 h-3 fill-forest-dark" />
                              <span>GAMBAR SAMPUL UTAMA</span>
                            </span>
                          ) : (
                            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[9px] font-bold bg-forest-dark/80 text-warmwhite backdrop-blur-xs">
                              Galeri #{iIdx + 1}
                            </span>
                          )}

                          {/* Quick Replace Overlay Button */}
                          <button
                            type="button"
                            title="Ganti fail imej ini dengan imej baru"
                            onClick={() => {
                              setReplacingImageIndex(iIdx)
                              replaceFileInputRef.current?.click()
                            }}
                            className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-warmwhite/90 text-forest-dark hover:bg-warmwhite hover:text-forest shadow-xs backdrop-blur-xs flex items-center space-x-1 opacity-90 hover:opacity-100 transition-opacity"
                          >
                            <RefreshCw className="w-3 h-3 text-gold-dark" />
                            <span>Ganti Fail</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <div className="flex items-center justify-between mb-0.5">
                              <label className="text-[10px] font-bold text-charcoal-muted uppercase">
                                Pautan Fail Gambar
                              </label>
                              <span className="text-[9.5px] font-mono text-slate-400 truncate max-w-[120px]">
                                {img.imageUrl?.startsWith('data:') ? 'Base64 Local' : img.imageUrl?.slice(-20)}
                              </span>
                            </div>
                            <input
                              type="text"
                              value={img.imageUrl}
                              onChange={(e) => {
                                const next = [...(editingProduct.images || [])]
                                next[iIdx].imageUrl = e.target.value
                                setEditingProduct({ ...editingProduct, images: next })
                              }}
                              className="w-full px-2.5 py-1.5 text-[11px] font-mono rounded-lg bg-cream/40 border border-borderLight text-charcoal-muted focus:text-charcoal focus:bg-warmwhite"
                            />
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-borderLight/60">
                            {!img.isPrimary ? (
                              <button
                                type="button"
                                onClick={() => setPrimaryImage(img.id)}
                                className="text-[11px] text-forest font-bold hover:underline flex items-center gap-1"
                              >
                                <Star className="w-3 h-3 text-gold-dark" />
                                <span>Jadikan Sampul Utama</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-gold-dark font-bold flex items-center gap-1">
                                <Check className="w-3 h-3" /> Foto Sampul Aktif
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => removeImage(img.id)}
                              className="text-[11px] text-rose-600 font-bold hover:underline"
                            >
                              Padam
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 5: CIRI-CIRI KHAS & KEISTIMEWAAN                         */}
              {/* ============================================================= */}
              {activeTab === 'features' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Add Feature Form */}
                  <div className="p-4 sm:p-5 bg-warmwhite rounded-2xl border border-borderLight shadow-2xs space-y-3">
                    <span className="text-xs font-bold text-forest-dark uppercase tracking-wider block">
                      Tambah Ciri Keistimewaan Produk (Highlights)
                    </span>

                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Contoh: 100% Organic Malaysian Natural Latex (Tekan Enter atau klik Tambah)"
                        value={newFeatureText}
                        onChange={(e) => setNewFeatureText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddFeature()
                          }
                        }}
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-cream/40 border border-borderLight focus:outline-none focus:ring-1 focus:ring-gold font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddFeature()}
                        className="px-5 py-2.5 bg-forest text-warmwhite text-xs font-bold rounded-xl hover:bg-forest-dark transition-colors whitespace-nowrap shadow-xs"
                      >
                        + Tambah
                      </button>
                    </div>

                    {/* Quick Preset Highlights */}
                    <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-charcoal-muted">
                      <span className="font-bold text-forest text-[11px]">Pilihan Pantas (1-Klik):</span>
                      {[
                        '100% Organic Malaysian Natural Latex',
                        'Zero Synthetic Polyurethane Foam',
                        'Belgian Organic Tencel Washable Cover',
                        'Naturally Anti-Dustmite & Hypoallergenic',
                        '7-Zone Ergonomic Pocket Spring Support',
                        'Zero Motion Transfer Partner Sleep',
                        'Eco-Friendly & OEKO-TEX Certified',
                        'Buatan Tangan Berkualiti Tinggi Malaysia',
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handleAddFeature(preset)}
                          className="px-2.5 py-1 rounded-lg bg-cream/60 border border-borderLight hover:border-gold hover:text-forest transition-colors text-[10.5px] font-medium"
                        >
                          + {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Features Active List */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-forest-dark uppercase tracking-wider block px-1">
                      Senarai Poin Yang Aktif Pada Produk Ini ({editingProduct.features?.length || 0})
                    </span>

                    {(editingProduct.features || []).map((feat, fIdx) => (
                      <div
                        key={fIdx}
                        className="p-3.5 bg-warmwhite rounded-xl border border-borderLight flex items-center justify-between group hover:border-gold/50 transition-colors shadow-2xs"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                            ✓
                          </span>
                          <span className="text-xs font-medium text-forest-dark">{feat}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(fIdx)}
                          className="text-charcoal-muted hover:text-rose-600 p-1.5 rounded transition-colors"
                          title="Padam ciri ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {(editingProduct.features || []).length === 0 && (
                      <div className="p-6 text-center text-xs text-charcoal-muted bg-cream/30 rounded-2xl border border-dashed border-borderLight">
                        Tiada ciri khas ditambah lagi. Klik cadangan pantas di atas atau taip ciri kelebihan produk anda.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Invisible submit button to allow form submit on Enter in inputs */}
              <button type="submit" className="hidden" />
            </form>

            {/* Fixed Sticky Footer */}
            <div className="px-4 py-3 sm:px-6 sm:py-4 bg-warmwhite border-t border-borderLight flex items-center justify-between flex-shrink-0 shadow-lg">
              <div className="hidden sm:flex items-center space-x-2 text-xs text-charcoal-muted">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  Menyunting:{' '}
                  <strong className="text-forest-dark">{editingProduct.name}</strong>
                </span>
                <span className="text-borderLight">&bull;</span>
                <span className="text-[11px] text-charcoal-muted font-mono">
                  Tip: Ctrl + S untuk simpan
                </span>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-xs font-bold text-charcoal-muted hover:text-charcoal rounded-xl hover:bg-cream transition-colors"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveProduct()}
                  disabled={isSaving}
                  className="inline-flex items-center space-x-2 px-5 sm:px-6 py-2.5 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-warmwhite border-t-transparent rounded-full animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-gold" />
                      <span>Simpan Produk &amp; Varian</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* LUXURY PRODUCT IMAGE LIGHTBOX / POPUP WINDOW                              */}
      {/* ========================================================================= */}
      {previewImageModal && mounted && createPortal(
        <div
          className="fixed inset-0 z-[100000] bg-forest-dark/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewImageModal(null)
          }}
        >
          <div className="relative max-w-4xl w-full bg-slate-900/95 text-warmwhite rounded-2xl sm:rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[94vh] animate-scale-in">
            {/* Header */}
            <div className="px-5 py-4 bg-slate-950/80 border-b border-white/10 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-3 min-w-0 pr-4">
                <div className="w-9 h-9 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold flex-shrink-0">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold bg-gold/20 px-2 py-0.5 rounded">
                      {categories.find((c) => c.id === previewImageModal.product.categoryId)?.name || 'Koleksi Atelier'}
                    </span>
                    {previewImageModal.product.images.length > 1 && (
                      <span className="text-[11px] text-slate-400 font-mono">
                        Foto {previewImageModal.activeImageIndex + 1} / {previewImageModal.product.images.length}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-white truncate mt-0.5">
                    {previewImageModal.product.name}
                  </h3>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Link
                  href={`/products/${previewImageModal.product.slug}`}
                  target="_blank"
                  className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white transition-colors"
                  title="Buka produk di kedai"
                >
                  <span>Lihat di Kedai</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gold" />
                </Link>

                <button
                  onClick={() => {
                    const prod = previewImageModal.product
                    setPreviewImageModal(null)
                    handleEditClick(prod)
                  }}
                  className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gold/20 hover:bg-gold/30 border border-gold/40 text-xs font-semibold text-gold transition-colors cursor-pointer"
                  title="Sunting produk ini"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Sunting</span>
                </button>

                <button
                  onClick={() => setPreviewImageModal(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-rose-500/80 hover:text-white text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                  title="Tutup (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Image Stage */}
            <div className="relative flex-1 bg-black/60 flex items-center justify-center p-4 sm:p-8 min-h-[300px] max-h-[62vh] select-none overflow-hidden">
              {(() => {
                const currentImg =
                  previewImageModal.product.images[previewImageModal.activeImageIndex] ||
                  previewImageModal.product.images[0]

                if (!currentImg?.imageUrl) {
                  return (
                    <div className="text-center py-12 text-slate-400">
                      <BedDouble className="w-16 h-16 mx-auto mb-2 text-gold/40" />
                      <p className="text-sm">Tiada gambar tersedia untuk produk ini.</p>
                    </div>
                  )
                }

                return (
                  <div className="relative max-h-full max-w-full flex items-center justify-center">
                    <img
                      src={currentImg.imageUrl}
                      alt={currentImg.altText || previewImageModal.product.name}
                      className="max-h-[58vh] w-auto max-w-full object-contain rounded-xl shadow-2xl ring-1 ring-white/15"
                    />

                    {currentImg.isPrimary && (
                      <div className="absolute top-3 left-3 bg-forest-dark/80 backdrop-blur-md text-gold text-[11px] font-bold px-2.5 py-1 rounded-full border border-gold/30 flex items-center gap-1.5 shadow-md">
                        <Sparkles className="w-3 h-3" />
                        <span>Gambar Utama</span>
                      </div>
                    )}
                  </div>
                )
              })()}

              {/* Prev / Next Chevrons (if multiple images) */}
              {previewImageModal.product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setPreviewImageModal((prev) =>
                        prev
                          ? {
                              ...prev,
                              activeImageIndex:
                                (prev.activeImageIndex - 1 + prev.product.images.length) %
                                prev.product.images.length,
                            }
                          : null
                      )
                    }
                    className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-gold hover:text-forest-dark border border-white/20 text-white flex items-center justify-center transition-all shadow-xl cursor-pointer"
                    title="Gambar sebelumnya (←)"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() =>
                      setPreviewImageModal((prev) =>
                        prev
                          ? {
                              ...prev,
                              activeImageIndex:
                                (prev.activeImageIndex + 1) % prev.product.images.length,
                            }
                          : null
                      )
                    }
                    className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-gold hover:text-forest-dark border border-white/20 text-white flex items-center justify-center transition-all shadow-xl cursor-pointer"
                    title="Gambar seterusnya (→)"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Gallery Thumbnail Strip & Meta */}
            <div className="px-5 py-3 bg-slate-950/90 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Thumbnail Strip */}
              {previewImageModal.product.images.length > 1 ? (
                <div className="flex items-center space-x-2 overflow-x-auto py-1 max-w-full">
                  {previewImageModal.product.images.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      onClick={() =>
                        setPreviewImageModal((prev) =>
                          prev ? { ...prev, activeImageIndex: idx } : null
                        )
                      }
                      className={`relative w-12 h-10 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                        previewImageModal.activeImageIndex === idx
                          ? 'border-gold ring-2 ring-gold/40 scale-105'
                          : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/50'
                      }`}
                    >
                      <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400">
                  {previewImageModal.product.images[0]?.altText || previewImageModal.product.name}
                </div>
              )}

              {/* Keyboard Hints & Quick Info */}
              <div className="flex items-center space-x-3 text-[11px] text-slate-400 flex-shrink-0">
                <span className="hidden md:inline">
                  Guna kekunci <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-slate-300">Esc</kbd> untuk tutup
                </span>
                {previewImageModal.product.images.length > 1 && (
                  <span className="hidden md:inline">
                    &bull; <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-slate-300">&larr;</kbd> <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-slate-300">&rarr;</kbd> navigasi
                  </span>
                )}
                <a
                  href={previewImageModal.product.images[previewImageModal.activeImageIndex]?.imageUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gold hover:underline font-medium inline-flex items-center gap-1"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Buka Tab Penuh</span>
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
