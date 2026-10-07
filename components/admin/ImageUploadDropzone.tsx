'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
  UploadCloud,
  Camera,
  ImageIcon,
  Clipboard,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Trash2,
  RefreshCw,
  Sparkles,
} from 'lucide-react'

export interface ImageUploadDropzoneProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  helperText?: string
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto'
  className?: string
  compact?: boolean
  required?: boolean
}

/**
 * Compresses an image file on the client using HTML5 Canvas before uploading.
 * Converts large 10-15MB smartphone camera photos into high-quality WebP (~300-600KB)
 * in under 100ms, making phone upload ultra-fast and reliable.
 */
export async function optimizeImageForUpload(file: File, maxDimension = 1920, quality = 0.85): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file
  }

  return new Promise((resolve) => {
    const img = new window.Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      let { width, height } = img

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width)
          width = maxDimension
        } else {
          width = Math.round((width * maxDimension) / height)
          height = maxDimension
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(file)
        return
      }

      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            resolve(file)
          } else {
            const extClean = file.name.replace(/\.[^.]+$/, '')
            const optimizedFile = new File([blob], `${extClean}.webp`, {
              type: 'image/webp',
              lastModified: Date.now(),
            })
            resolve(optimizedFile)
          }
        },
        'image/webp',
        quality
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(file)
    }

    img.src = objectUrl
  })
}

export function ImageUploadDropzone({
  value,
  onChange,
  label = 'Imej / Foto',
  helperText,
  aspectRatio = 'square',
  className = '',
  compact = false,
  required = false,
}: ImageUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [manualUrl, setManualUrl] = useState(value || '')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const dropzoneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setManualUrl(value || '')
  }, [value])

  const handleUploadFile = useCallback(
    async (rawFile: File) => {
      if (!rawFile) return

      // Validate image type
      if (!rawFile.type.startsWith('image/') && !/\.(jpe?g|png|webp|gif|avif)$/i.test(rawFile.name)) {
        setUploadError('Hanya fail imej (JPG, PNG, WEBP, dsb.) dibenarkan.')
        return
      }

      setIsUploading(true)
      setUploadError(null)
      setUploadSuccess(null)

      try {
        // Fast client-side optimization for camera / big files
        const optimizedFile = await optimizeImageForUpload(rawFile)

        const formData = new FormData()
        formData.append('file', optimizedFile)

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })

        const data = await res.json()

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Gagal memuat naik fail imej')
        }

        const uploadedUrl = data.url || (data.files && data.files[0]?.url)
        if (uploadedUrl) {
          onChange(uploadedUrl)
          setManualUrl(uploadedUrl)
          setUploadSuccess('Gambar berjaya dimuat naik!')
          setTimeout(() => setUploadSuccess(null), 3000)
        }
      } catch (err: any) {
        setUploadError(err?.message || 'Ralat semasa memuat naik fail.')
      } finally {
        setIsUploading(false)
      }
    },
    [onChange]
  )

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFile(e.dataTransfer.files[0])
    }
  }

  // Clipboard paste support (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!dropzoneRef.current) return
      // Check if mouse is hovering or active in dropzone or if user is focused near this element
      const activeEl = document.activeElement
      const isInput = activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA'
      if (isInput && activeEl !== dropzoneRef.current) return

      if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0]
        if (file.type.startsWith('image/')) {
          e.preventDefault()
          handleUploadFile(file)
        }
      }
    }

    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [handleUploadFile])

  const handleManualUrlSave = () => {
    if (manualUrl.trim()) {
      onChange(manualUrl.trim())
      setShowUrlInput(false)
      setUploadSuccess('Pautan imej dikemaskini!')
      setTimeout(() => setUploadSuccess(null), 3000)
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
    setManualUrl('')
    setUploadSuccess(null)
    setUploadError(null)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label & URL toggle bar */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-forest uppercase tracking-wider">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-semibold text-gold-dark hover:text-forest flex items-center gap-1 cursor-pointer transition-colors"
        >
          {showUrlInput ? (
            <>
              <UploadCloud className="w-3 h-3" />
              <span>Guna Fail / Kamera</span>
            </>
          ) : (
            <>
              <ExternalLink className="w-3 h-3" />
              <span>Guna Pautan URL</span>
            </>
          )}
        </button>
      </div>

      {/* Hidden File Inputs */}
      {/* 1. General File Input (Opens gallery on phone, file picker on PC) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleUploadFile(e.target.files[0])
            e.target.value = ''
          }
        }}
        className="hidden"
      />

      {/* 2. Direct Camera Capture Input (Ultra-easy on smartphones) */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleUploadFile(e.target.files[0])
            e.target.value = ''
          }
        }}
        className="hidden"
      />

      {/* Manual URL Input Form */}
      {showUrlInput ? (
        <div className="p-3 bg-cream/40 rounded-xl border border-borderLight space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="https://... atau /images/products/..."
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-lg border border-borderLight bg-white font-mono focus:outline-none focus:ring-1 focus:ring-gold"
            />
            <button
              type="button"
              onClick={handleManualUrlSave}
              className="px-3.5 py-2 bg-forest text-warmwhite text-xs font-bold rounded-lg hover:bg-forest-dark transition-colors cursor-pointer"
            >
              Simpan
            </button>
          </div>
          <span className="text-[10px] text-charcoal-muted block">
            Masukkan pautan terus fail imej dari web atau CDN
          </span>
        </div>
      ) : value ? (
        /* Preview State when Image Exists */
        <div className="relative group/prev rounded-2xl border border-borderLight bg-warmwhite overflow-hidden shadow-xs">
          <div className="flex items-center p-3 gap-3">
            {/* Thumbnail */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-cream border border-borderLight/80 shrink-0">
              <img
                src={value}
                alt="Pratonton Imej"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info & Change Actions */}
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-flex items-center gap-1 mb-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Imej Aktif</span>
              </span>
              <p className="text-xs font-mono text-charcoal-muted truncate block" title={value}>
                {value}
              </p>

              {/* Action buttons */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-cream hover:bg-borderLight/60 text-charcoal flex items-center gap-1 transition-colors cursor-pointer"
                  title="Tukar imej baharu"
                >
                  <RefreshCw className="w-3 h-3 text-gold-dark" />
                  <span>Tukar Fail</span>
                </button>
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="sm:hidden px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Ambil foto kamera baru"
                >
                  <Camera className="w-3 h-3 text-amber-600" />
                  <span>Kamera</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-2 py-1 text-[11px] font-bold rounded-lg text-rose-600 hover:bg-rose-50 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Padam imej ini"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Padam</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State: The Ultra-Convenient Drag & Drop + Mobile Upload Center */
        <div
          ref={dropzoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-2xl border-2 border-dashed transition-all ${
            isDragging
              ? 'border-gold bg-gold/10 scale-[1.01] shadow-md'
              : 'border-borderLight hover:border-gold/60 bg-cream/30 hover:bg-cream/50'
          } ${compact ? 'p-3.5 sm:p-5' : 'p-4 sm:p-6'}`}
        >
          {isUploading ? (
            /* Uploading state */
            <div className="py-6 flex flex-col items-center justify-center space-y-2 text-forest-dark animate-pulse">
              <Loader2 className="w-7 h-7 animate-spin text-gold-dark" />
              <span className="text-xs font-bold">Sedang memproses & memuat naik imej...</span>
              <span className="text-[10px] text-charcoal-muted">Mengoptimumkan saiz fail untuk kelajuan maksima</span>
            </div>
          ) : (
            <div className="space-y-3 text-center">
              {/* PC Desktop Interactive Drop Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer group flex flex-col items-center justify-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-gold/15 group-hover:bg-gold/25 text-gold-dark flex items-center justify-center mb-2 transition-transform group-hover:scale-105 shadow-2xs">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-forest-dark block">
                  Seret & Lepas Gambar ke Sini (Drag & Drop)
                </span>
                <span className="text-[11px] text-charcoal-muted mt-0.5 hidden sm:block">
                  atau klik untuk pilih fail dari komputer • Boleh juga tekan <strong>Ctrl + V</strong> untuk Paste!
                </span>
              </div>

              {/* Mobile Phone Quick Action Buttons (Ultra Senang) */}
              <div className="pt-2 border-t border-borderLight/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block mb-2 sm:hidden">
                  Pilihan Mudah Telefon Pintar:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {/* Phone Option 1: Direct Camera */}
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-xs shadow-xs hover:shadow active:scale-98 transition-all cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-amber-100" />
                    <span>Ambil Foto (Kamera)</span>
                  </button>

                  {/* Phone Option 2: Choose from Photo Gallery */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-forest hover:bg-forest-dark text-warmwhite font-bold text-xs shadow-xs hover:shadow active:scale-98 transition-all cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4 text-gold" />
                    <span>Galeri Foto</span>
                  </button>
                </div>
              </div>

              {/* Supported formats tag */}
              <div className="flex items-center justify-center gap-2 text-[10px] text-charcoal-muted">
                <span>Format: JPG, PNG, WEBP, AVIF</span>
                <span>•</span>
                <span>Dimampatkan secara automatik</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Success notification banner */}
      {uploadSuccess && (
        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 animate-fade-in">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{uploadSuccess}</span>
        </div>
      )}

      {/* Error notification banner */}
      {uploadError && (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200 animate-fade-in">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span className="font-medium">{uploadError}</span>
          </div>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="text-rose-600 font-bold hover:underline"
          >
            Tutup
          </button>
        </div>
      )}

      {helperText && (
        <span className="text-[11px] text-charcoal-muted block">
          {helperText}
        </span>
      )}
    </div>
  )
}
