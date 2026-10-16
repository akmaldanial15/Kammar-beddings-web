'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface Slide {
  id: string
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  secondaryCtaText: string
  secondaryCtaLink: string
  badge: string
  imageUrl: string
}

const slides: Slide[] = [
  {
    id: 'slide-1',
    badge: 'PALING LARISS!! ASIAN POLYESTER FIBRE',
    title: 'Tilam Toto Tebal & Selesa Terus Dari Kilang',
    subtitle: 'Isian Asian Polyester Fibre bermutu tinggi, pelbagai corak menarik Random Design & Floral. Empuk, tidak mudah leper dan jimat.',
    ctaText: 'Beli Tilam Toto Sekarang',
    ctaLink: '/collections/tilam-toto',
    secondaryCtaText: 'Profil Kilang Kami',
    secondaryCtaLink: '/profil',
    imageUrl: '/images/products/toto-single-poly.png',
  },
  {
    id: 'slide-2',
    badge: 'PENGILANG TEKSTIL BUMIPUTERA',
    title: 'Kualiti Jahitan, Kepuasan Terjamin',
    subtitle: 'Menjahit Kepercayaan, Menyulam Masa Depan. Operasi sistematik merangkumi Unit Potong Kain, Unit Jahitan, Unit Bantal & Tilam.',
    ctaText: 'Aktiviti Pengilangan',
    ctaLink: '/profil#aktiviti-pengilangan',
    secondaryCtaText: 'Carta Organisasi',
    secondaryCtaLink: '/profil#carta-organisasi',
    imageUrl: '/images/company/KILANG OPERASI KAMAAR.jpeg',
  },
  {
    id: 'slide-3',
    badge: '100% KEKABU ASLI TRADISI',
    title: 'Tilam & Bantal Kekabu Asli Buatan Tempatan',
    subtitle: 'Kelembutan semulajadi yang sejuk, padat dan selesa dengan teknik jahitan butang tufting tradisi yang tahan lasak turun-temurun.',
    ctaText: 'Koleksi Kekabu Asli',
    ctaLink: '/collections/tilam-kekabu',
    secondaryCtaText: 'Tempah Sekarang',
    secondaryCtaLink: '/products/tilam-gulung-kekabu-asli',
    imageUrl: '/images/products/tilam-gulung-kekabu-asli.png',
  },
  {
    id: 'slide-4',
    badge: 'JELAJAH PROMOSI & JUALAN GUDANG',
    title: 'Jelajah Promosi & Jualan Terus Dari Kilang',
    subtitle: 'Kami membawakan tilam toto, tilam gulung dan bantal berkualiti terus ke komuniti anda dengan tawaran harga terendah dalam pasaran.',
    ctaText: 'Lokasi Jelajah Terkini',
    ctaLink: '/jelajah-promosi',
    secondaryCtaText: 'WhatsApp 019-478 6991',
    secondaryCtaLink: 'https://wa.me/60194786991',
    imageUrl: '/images/promosi/PROMOSI 1.png',
  },
]

export function HeroCarousel() {
  const { t } = useLanguage()
  const [activeSlides, setActiveSlides] = useState<Slide[]>(slides)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    fetch('/api/website-config', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.config?.hero?.slides && Array.isArray(data.config.hero.slides) && data.config.hero.slides.length > 0) {
          const validSlides = data.config.hero.slides.filter((s: any) => s.isActive !== false)
          if (validSlides.length > 0) {
            setActiveSlides(validSlides)
          }
        }
      })
      .catch((err) => console.error('Failed to load hero slides:', err))
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % (activeSlides.length || 1))
  }, [activeSlides.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + (activeSlides.length || 1)) % (activeSlides.length || 1))
  }, [activeSlides.length])

  useEffect(() => {
    if (!isPlaying || activeSlides.length <= 1) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [isPlaying, activeSlides.length])

  const [dragOffset, setDragOffset] = useState<number>(0)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const dragStartX = React.useRef<number | null>(null)

  const onDragStart = (clientX: number) => {
    dragStartX.current = clientX
    setDragOffset(0)
    setIsDragging(true)
  }

  const onDragMove = (clientX: number) => {
    if (dragStartX.current === null) return
    const diff = clientX - dragStartX.current
    if ((currentSlide === 0 && diff > 0) || (currentSlide === activeSlides.length - 1 && diff < 0)) {
      setDragOffset(diff * 0.2)
    } else {
      setDragOffset(diff)
    }
  }

  const onDragEnd = () => {
    if (dragStartX.current === null) return
    setIsDragging(false)
    const threshold = 35 // px threshold to trigger slide change
    if (dragOffset < -threshold) {
      nextSlide()
    } else if (dragOffset > threshold) {
      prevSlide()
    }
    setDragOffset(0)
    dragStartX.current = null
  }

  return (
    <section
      className="relative w-full h-[620px] sm:h-[680px] lg:h-[750px] overflow-hidden bg-forest-dark select-none touch-pan-y cursor-grab active:cursor-grabbing"
      aria-label="Hero Carousel"
      onTouchStart={(e) => onDragStart(e.targetTouches[0].clientX)}
      onTouchMove={(e) => onDragMove(e.targetTouches[0].clientX)}
      onTouchEnd={onDragEnd}
      onMouseDown={(e) => onDragStart(e.clientX)}
      onMouseMove={(e) => {
        if (isDragging) onDragMove(e.clientX)
      }}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
    >
      {/* Slides */}
      {activeSlides.map((slide, index) => {
        const isActive = index === currentSlide
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image with Dark Atmospheric Vignette Overlay */}
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={slide.imageUrl}
                alt={slide.title}
                fill
                priority={index === 0}
                className={`object-cover object-center sm:object-right lg:object-center transform transition-transform duration-[7000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
                sizes="100vw"
              />
              {/* Comprehensive dark gradient overlay so text is 100% readable on both mobile and desktop */}
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark via-forest-dark/80 to-forest-dark/45 sm:hidden" />
              <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-forest-dark/95 via-forest-dark/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/85 via-transparent to-black/25" />
            </div>

            {/* Live HTML Content Overlay */}
            <div className="relative z-20 max-w-7xl mx-auto h-full px-5 sm:px-6 lg:px-8 flex flex-col justify-center pb-16 sm:pb-0">
              <div className="max-w-2xl space-y-4 sm:space-y-6">
                {/* Badge */}
                <div
                  className={`inline-flex items-center space-x-2 bg-warmwhite/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-gold/40 text-gold text-xs font-semibold tracking-wider uppercase transform transition-all duration-700 ease-out ${
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-gold flex-shrink-0 animate-pulse" />
                  <span className="truncate max-w-[280px] sm:max-w-none">{slide.badge}</span>
                </div>

                {/* Headline */}
                <h1
                  className={`font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-warmwhite leading-[1.15] tracking-tight transform transition-all duration-700 delay-100 ease-out ${
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  {slide.title}
                </h1>

                {/* Subhead */}
                <p
                  className={`text-sm sm:text-base lg:text-lg text-warmwhite/80 leading-relaxed font-light max-w-xl line-clamp-3 sm:line-clamp-none transform transition-all duration-700 delay-200 ease-out ${
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  {slide.subtitle}
                </p>

                {/* CTA Buttons */}
                <div
                  className={`pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 transform transition-all duration-700 delay-300 ease-out ${
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <Link
                    href={slide.ctaLink}
                    className="px-7 py-3.5 bg-forest hover:bg-forest/90 active:scale-98 text-warmwhite text-xs sm:text-sm font-bold tracking-wider uppercase rounded-xl shadow-card border border-gold/40 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] luxury-btn"
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-4 h-4 text-gold" />
                  </Link>

                  <Link
                    href={slide.secondaryCtaLink}
                    className="px-7 py-3.5 bg-warmwhite/15 hover:bg-warmwhite/25 active:scale-98 text-warmwhite text-xs sm:text-sm font-semibold tracking-wide rounded-xl backdrop-blur-md border border-warmwhite/20 flex items-center justify-center transition-all hover:scale-[1.02]"
                  >
                    <span>{slide.secondaryCtaText}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* Navigation Controls (Dots & Arrows) */}
      <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 z-30 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 flex items-center justify-between pointer-events-auto">
        {/* Indicators + Pause/Play */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsPlaying(false)
                setCurrentSlide(idx)
              }}
              className={`h-2 rounded-full transition-all duration-500 ease-out cursor-pointer ${
                currentSlide === idx
                  ? 'w-8 bg-gradient-to-r from-gold to-gold-light shadow-xs'
                  : 'w-2 bg-warmwhite/40 hover:bg-warmwhite/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsPlaying((p) => !p)
            }}
            className="p-1.5 text-warmwhite/70 hover:text-warmwhite ml-2 flex items-center gap-1 text-[11px] transition-colors cursor-pointer"
            title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-gold" />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-gold" />
                <span className="hidden sm:inline">Play</span>
              </>
            )}
          </button>
        </div>

        {/* Prev / Next Arrows */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              prevSlide()
            }}
            className="p-2.5 sm:p-3 rounded-full bg-warmwhite/10 hover:bg-warmwhite/20 active:scale-90 text-white backdrop-blur-md border border-warmwhite/20 transition-all shadow-md cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              nextSlide()
            }}
            className="p-2.5 sm:p-3 rounded-full bg-warmwhite/10 hover:bg-warmwhite/20 active:scale-90 text-white backdrop-blur-md border border-warmwhite/20 transition-all shadow-md cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
