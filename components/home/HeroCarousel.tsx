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

  return (
    <section className="relative w-full h-[600px] sm:h-[680px] lg:h-[750px] overflow-hidden bg-forest-dark" aria-label="Hero Carousel">
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
              className={`object-cover object-center transform transition-transform duration-[7000ms] ease-out ${
                index === currentSlide ? 'scale-105' : 'scale-100'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-forest-dark/90 via-forest-dark/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-transparent to-transparent" />
          </div>

          {/* Live HTML Content Overlay */}
          <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
            <div className="max-w-2xl space-y-4 sm:space-y-6">
              {/* Badge */}
              <div className={`inline-flex items-center space-x-2 bg-warmwhite/10 backdrop-blur-md px-3.5 py-1 rounded-full border border-gold/40 text-gold text-xs font-semibold tracking-wider uppercase transform transition-all duration-700 ease-out ${
                index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
              }`}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{slide.badge}</span>
              </div>

              {/* Headline */}
              <h1 className={`font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-warmwhite leading-[1.15] tracking-tight transform transition-all duration-700 delay-100 ease-out ${
                index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                {slide.title}
              </h1>

              {/* Subhead */}
              <p className={`text-sm sm:text-base lg:text-lg text-warmwhite/80 leading-relaxed font-light transform transition-all duration-700 delay-200 ease-out ${
                index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                {slide.subtitle}
              </p>

              {/* CTA Buttons */}
              <div className={`pt-2 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 transform transition-all duration-700 delay-300 ease-out ${
                index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <Link
                  href={slide.ctaLink}
                  className="px-7 py-3.5 bg-forest hover:bg-forest/90 text-warmwhite text-sm font-bold tracking-wider uppercase rounded-lg shadow-card border border-gold/40 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] luxury-btn"
                >
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-4 h-4 text-gold" />
                </Link>

                <Link
                  href={slide.secondaryCtaLink}
                  className="px-7 py-3.5 bg-warmwhite/15 hover:bg-warmwhite/25 text-warmwhite text-sm font-semibold tracking-wide rounded-lg backdrop-blur-md border border-warmwhite/20 flex items-center justify-center transition-all hover:scale-[1.02]"
                >
                  <span>{slide.secondaryCtaText}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-0 right-0 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Indicators */}
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

        {/* Prev / Next Arrows */}
        <div className="flex items-center space-x-2">
          <button
            onClick={prevSlide}
            className="p-2.5 rounded-full bg-warmwhite/10 hover:bg-warmwhite/20 text-warmwhite backdrop-blur-md border border-warmwhite/20 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2.5 rounded-full bg-warmwhite/10 hover:bg-warmwhite/20 text-warmwhite backdrop-blur-md border border-warmwhite/20 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
