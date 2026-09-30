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
    badge: '100% Malaysian Organic Latex',
    title: 'Better nights begin with the right mattress.',
    subtitle: 'Handcrafted with certified organic latex, zero synthetic fillers, and micro-zoned spinal alignment for deep, uninterrupted sleep.',
    ctaText: 'Explore Mattresses',
    ctaLink: '/collections/mattress',
    secondaryCtaText: 'Take Mattress Finder Quiz',
    secondaryCtaLink: '/finder',
    imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1800&q=85',
  },
  {
    id: 'slide-2',
    badge: 'Sub-Zero Active Cooling',
    title: 'Engineered for tropical Malaysian nights.',
    subtitle: 'Combining Japanese Ice-Silk filaments with aerated pinhole natural latex and 7-zone pocket springs for continuous cooling rest.',
    ctaText: 'Discover Cool Night Hybrid',
    ctaLink: '/products/lena-cool-night-hybrid-mattress',
    secondaryCtaText: 'View All Collections',
    secondaryCtaLink: '/collections/mattress',
    imageUrl: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1800&q=85',
  },
  {
    id: 'slide-3',
    badge: '5-Star Presidential Suite Comfort',
    title: 'The Sovereign Luxe Grand Masterpiece.',
    subtitle: 'Multi-tiered 34cm dual-spring architecture, plush Talalay latex pillowtop, and Belgian silk upholstery built for lifetime indulgence.',
    ctaText: 'Experience Sovereign Luxe',
    ctaLink: '/products/lena-sovereign-luxe-mattress',
    secondaryCtaText: 'Book Showroom Trial',
    secondaryCtaLink: '/showrooms',
    imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1800&q=85',
  },
]

export function HeroCarousel() {
  const { t } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(nextSlide, 7000)
    return () => clearInterval(timer)
  }, [isPlaying, nextSlide])

  return (
    <section className="relative w-full h-[600px] sm:h-[680px] lg:h-[750px] overflow-hidden bg-forest-dark" aria-label="Hero Carousel">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {/* Background Image with Dark Vignette Overlay */}
          <div className="absolute inset-0">
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              priority={index === 0}
              className="object-cover object-center transform scale-105 transition-transform duration-10000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-forest-dark/90 via-forest-dark/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-transparent to-transparent" />
          </div>

          {/* Live HTML Content Overlay */}
          <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
            <div className="max-w-2xl space-y-4 sm:space-y-6">
              {/* Badge */}
              <div className={`inline-flex items-center space-x-2 bg-warmwhite/10 backdrop-blur-md px-3.5 py-1 rounded-full border border-gold/40 text-gold text-xs font-semibold tracking-wider uppercase ${
                index === currentSlide ? 'animate-fade-in-down' : ''
              }`}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{slide.badge}</span>
              </div>

              {/* Headline */}
              <h1 className={`font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-warmwhite leading-[1.15] tracking-tight ${
                index === currentSlide ? 'animate-fade-in-up delay-100' : ''
              }`}>
                {slide.title}
              </h1>

              {/* Subhead */}
              <p className={`text-sm sm:text-base lg:text-lg text-warmwhite/80 leading-relaxed font-light ${
                index === currentSlide ? 'animate-fade-in-up delay-200' : ''
              }`}>
                {slide.subtitle}
              </p>

              {/* CTA Buttons */}
              <div className={`pt-2 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 ${
                index === currentSlide ? 'animate-fade-in-up delay-300' : ''
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
          {slides.map((_, idx) => (
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
