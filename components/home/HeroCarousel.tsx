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
    setActiveSlides((currentSlides) => {
      setCurrentSlide((prev) => (prev + 1) % currentSlides.length)
      return currentSlides
    })
  }, [])

  const prevSlide = useCallback(() => {
    setActiveSlides((currentSlides) => {
      setCurrentSlide((prev) => (prev - 1 + currentSlides.length) % currentSlides.length)
      return currentSlides
    })
  }, [])

  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(nextSlide, 7000)
    return () => clearInterval(timer)
  }, [isPlaying, nextSlide])

  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState<number>(0)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX)
    setDragOffset(0)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return
    const currentX = e.targetTouches[0].clientX
    const diff = currentX - touchStartX
    // Add rubber-band resistance at boundary edges
    if ((currentSlide === 0 && diff > 0) || (currentSlide === activeSlides.length - 1 && diff < 0)) {
      setDragOffset(diff * 0.25)
    } else {
      setDragOffset(diff)
    }
  }

  const handleTouchEnd = () => {
    if (touchStartX === null) return
    setIsDragging(false)
    const threshold = 45 // drag distance in px to trigger slide change
    if (dragOffset < -threshold) {
      nextSlide()
    } else if (dragOffset > threshold) {
      prevSlide()
    }
    setDragOffset(0)
    setTouchStartX(null)
  }

  return (
    <section className="relative w-full overflow-hidden bg-forest-dark" aria-label="Hero Carousel">
      {/* ================= DESKTOP & TABLET LAYOUT (md:block) ================= */}
      <div className="hidden md:block relative w-full h-[650px] lg:h-[720px] overflow-hidden">
        {/* Slides */}
        {activeSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image with Dark Vignette Overlay */}
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={slide.imageUrl}
                alt={slide.title}
                fill
                priority={index === 0}
                className={`object-cover object-right lg:object-center transform transition-transform duration-[7000ms] ease-out ${
                  index === currentSlide ? 'scale-105' : 'scale-100'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-forest-dark/95 via-forest-dark/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-transparent to-transparent" />
            </div>

            {/* Live HTML Content Overlay */}
            <div className="relative z-20 max-w-7xl mx-auto h-full px-6 lg:px-8 flex flex-col justify-center">
              <div className="max-w-2xl space-y-5 lg:space-y-6">
                {/* Badge */}
                <div className={`inline-flex items-center space-x-2 bg-warmwhite/10 backdrop-blur-md px-3.5 py-1 rounded-full border border-gold/40 text-gold text-xs font-semibold tracking-wider uppercase transform transition-all duration-700 ease-out ${
                  index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
                }`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{slide.badge}</span>
                </div>

                {/* Headline */}
                <h1 className={`font-serif text-4xl lg:text-6xl font-bold text-warmwhite leading-[1.15] tracking-tight transform transition-all duration-700 delay-100 ease-out ${
                  index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  {slide.title}
                </h1>

                {/* Subhead */}
                <p className={`text-base lg:text-lg text-warmwhite/80 leading-relaxed font-light max-w-xl transform transition-all duration-700 delay-200 ease-out ${
                  index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  {slide.subtitle}
                </p>

                {/* CTA Buttons */}
                <div className={`pt-2 flex items-center space-x-4 transform transition-all duration-700 delay-300 ease-out ${
                  index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <Link
                    href={slide.ctaLink}
                    className="px-7 py-3.5 bg-forest hover:bg-forest/90 text-warmwhite text-sm font-bold tracking-wider uppercase rounded-xl shadow-card border border-gold/40 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] luxury-btn"
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-4 h-4 text-gold" />
                  </Link>

                  <Link
                    href={slide.secondaryCtaLink}
                    className="px-7 py-3.5 bg-warmwhite/15 hover:bg-warmwhite/25 text-warmwhite text-sm font-semibold tracking-wide rounded-xl backdrop-blur-md border border-warmwhite/20 flex items-center justify-center transition-all hover:scale-[1.02]"
                  >
                    <span>{slide.secondaryCtaText}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Desktop Navigation Controls */}
        <div className="absolute bottom-8 left-0 right-0 z-30 max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-8 bg-gold' : 'w-2 bg-warmwhite/40 hover:bg-warmwhite/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 text-warmwhite/60 hover:text-warmwhite ml-2"
              title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={prevSlide}
              className="p-2.5 rounded-full bg-warmwhite/10 hover:bg-warmwhite/20 text-warmwhite backdrop-blur-md border border-warmwhite/20 transition-colors cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2.5 rounded-full bg-warmwhite/10 hover:bg-warmwhite/20 text-warmwhite backdrop-blur-md border border-warmwhite/20 transition-colors cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= MOBILE PHONE VIEW LAYOUT (md:hidden) ================= */}
      {/* Allows the full product poster to be seen cleanly in proper 4:3 proportions with silky smooth horizontal animation */}
      <div
        className="block md:hidden relative w-full bg-forest-dark select-none overflow-hidden touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Horizontal Sliding Track with Buttery Smooth Transition */}
        <div
          className={`flex w-full ${
            isDragging ? 'transition-none' : 'transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)]'
          }`}
          style={{
            transform: `translateX(calc(-${currentSlide * 100}% + ${dragOffset}px))`,
          }}
        >
          {activeSlides.map((slide, index) => (
            <div key={slide.id} className="w-full flex-shrink-0 flex flex-col">
              {/* 1. Dedicated Image Showcase - Shows the full product banner properly */}
              <div className="relative w-full aspect-[4/3] bg-black/40 overflow-hidden">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  className={`object-cover object-center transition-transform duration-[6000ms] ease-out ${
                    index === currentSlide ? 'scale-105' : 'scale-100'
                  }`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                {/* Subtle top & bottom ambient shadow */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest-dark via-transparent to-black/25 pointer-events-none" />

                {/* Floating Badge */}
                <div className="absolute top-3 left-3 z-10 inline-flex items-center space-x-1.5 bg-forest-dark/90 backdrop-blur-md px-3 py-1 rounded-full border border-gold/40 text-gold text-[10px] font-bold tracking-wider uppercase shadow-xs">
                  <Sparkles className="w-3 h-3 text-gold flex-shrink-0 animate-pulse" />
                  <span className="truncate max-w-[220px]">{slide.badge}</span>
                </div>

                {/* Mini Prev/Next Chevron Controls on image */}
                <div className="absolute bottom-3 right-3 z-10 flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      prevSlide()
                    }}
                    className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 active:scale-90 text-white backdrop-blur-md border border-white/25 transition-all shadow-md cursor-pointer"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      nextSlide()
                    }}
                    className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 active:scale-90 text-white backdrop-blur-md border border-white/25 transition-all shadow-md cursor-pointer"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 2. Structured Content Card below image - High contrast, no collision with graphic */}
              <div className="p-4 sm:p-5 flex flex-col space-y-3 bg-forest-dark">
                <h1 className="font-serif text-2xl font-bold text-warmwhite leading-snug">
                  {slide.title}
                </h1>

                <p className="text-xs text-warmwhite/80 leading-relaxed font-light line-clamp-3">
                  {slide.subtitle}
                </p>

                {/* Action Buttons */}
                <div className="pt-1 flex flex-col gap-2.5">
                  <Link
                    href={slide.ctaLink}
                    className="w-full py-3 bg-forest hover:bg-forest/90 active:scale-98 text-warmwhite text-xs font-bold tracking-wider uppercase rounded-xl shadow-md border border-gold/40 flex items-center justify-center space-x-2 transition-all"
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gold" />
                  </Link>

                  <Link
                    href={slide.secondaryCtaLink}
                    className="w-full py-2.5 bg-warmwhite/10 hover:bg-warmwhite/20 active:scale-98 text-warmwhite text-xs font-semibold tracking-wide rounded-xl backdrop-blur-md border border-warmwhite/15 flex items-center justify-center transition-all"
                  >
                    <span>{slide.secondaryCtaText}</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Navigation Status & Animated Dots */}
        <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-white/10">
          <div className="flex items-center space-x-2">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setIsPlaying(false)
                  setCurrentSlide(idx)
                }}
                className={`h-1.5 rounded-full transition-all duration-500 ease-out cursor-pointer ${
                  currentSlide === idx ? 'w-8 bg-gradient-to-r from-gold to-gold-light shadow-xs' : 'w-2 bg-warmwhite/30 hover:bg-warmwhite/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 text-warmwhite/60 hover:text-warmwhite flex items-center gap-1 text-[11px] transition-colors cursor-pointer"
            title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3" />
                <span>Mainkan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
