'use client'

import React, { useId } from 'react'
import Image from 'next/image'

interface KamaarLogoProps {
  variant?: 'full' | 'horizontal' | 'emblem' | 'text'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  theme?: 'dark' | 'light'
  className?: string
  useImage?: boolean
}

export function KamaarLogo({
  variant = 'horizontal',
  size = 'md',
  theme = 'light',
  className = '',
  useImage = false,
}: KamaarLogoProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const goldGrad1 = `goldGrad1-${uid}`
  const goldGrad2 = `goldGrad2-${uid}`
  const midnightBlue = `midnightBlue-${uid}`

  // Height sizing
  const emblemSizes = {
    sm: 34,
    md: 44,
    lg: 56,
    xl: 72,
  }

  const currentSize = emblemSizes[size] || 44

  // If using the official PNG asset provided by user
  if (useImage) {
    return (
      <div className={`flex items-center space-x-2.5 ${className}`}>
        <Image
          src="/images/kamaar-logo.png"
          alt="KAMAAR Beddings"
          width={currentSize * 2.2}
          height={currentSize * 2.2}
          className="object-contain"
          priority
        />
      </div>
    )
  }

  // Vector SVG emblem matching Image 2:
  // Golden border, navy blue 'K' with gold bevel, gold flared bedding pages at bottom-right
  const Emblem = () => (
    <svg
      width={currentSize}
      height={currentSize}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0 drop-shadow-sm select-none"
    >
      <defs>
        {/* Luxury Gold Gradients */}
        <linearGradient id={goldGrad1} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9E29D" />
          <stop offset="35%" stopColor="#D4AF37" />
          <stop offset="70%" stopColor="#B38F2E" />
          <stop offset="100%" stopColor="#E6C765" />
        </linearGradient>

        <linearGradient id={goldGrad2} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF2BF" />
          <stop offset="45%" stopColor="#C5A059" />
          <stop offset="100%" stopColor="#8C6B1C" />
        </linearGradient>

        {/* Midnight Royal Blue for K fill */}
        <linearGradient id={midnightBlue} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#132B54" />
          <stop offset="50%" stopColor="#0B1A36" />
          <stop offset="100%" stopColor="#071226" />
        </linearGradient>
      </defs>

      {/* Outer Golden Layered Frame (Rounded Square with open cut) */}
      <rect
        x="18"
        y="12"
        width="82"
        height="82"
        rx="16"
        fill={`url(#${midnightBlue})`}
        stroke={`url(#${goldGrad1})`}
        strokeWidth="3.5"
      />

      {/* Decorative Golden Corner Trim / Outer Shield Border */}
      <path
        d="M16 36 V 26 C 16 19 21 14 28 14 H 42"
        stroke={`url(#${goldGrad1})`}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M20 90 V 78"
        stroke={`url(#${goldGrad1})`}
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Golden Book / Mattress Bedding Pages Fan (Bottom-Right) */}
      <path
        d="M62 76 C 70 76 80 82 96 90 C 85 91 74 88 64 86 Z"
        fill={`url(#${goldGrad1})`}
      />
      <path
        d="M64 81 C 74 81 86 86 100 95 C 88 96 76 93 64 91 Z"
        fill={`url(#${goldGrad2})`}
        stroke={`url(#${goldGrad1})`}
        strokeWidth="0.8"
      />
      <path
        d="M62 86 C 72 87 84 92 98 100 C 82 101 70 97 58 95 Z"
        fill={`url(#${goldGrad1})`}
      />

      {/* Stylized Bold Capital 'K' with Gold Bevel Border */}
      {/* Vertical Stem of K */}
      <path
        d="M32 25 H 45 V 75 H 32 Z"
        fill={`url(#${midnightBlue})`}
        stroke={`url(#${goldGrad1})`}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Top Diagonal Arm of K */}
      <path
        d="M45 50 L 72 25 H 85 L 53 54 Z"
        fill={`url(#${midnightBlue})`}
        stroke={`url(#${goldGrad1})`}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Bottom Diagonal Leg of K */}
      <path
        d="M51 49 L 78 75 H 64 L 42 55 Z"
        fill={`url(#${midnightBlue})`}
        stroke={`url(#${goldGrad1})`}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Subtle specular reflection on the K stem */}
      <line x1="36" y1="27" x2="36" y2="73" stroke={`url(#${goldGrad2})`} strokeWidth="1" strokeOpacity="0.7" />
    </svg>
  )

  // Typography for KAMAAR BEDDINGS matching Image 2
  // Letter A is stylized as an inverted chevron Λ
  const BrandText = () => (
    <div className={`flex flex-col ${variant === 'full' ? 'items-center text-center mt-2' : 'items-start'}`}>
      <div className="flex items-center space-x-1 tracking-[0.22em] font-serif leading-none">
        {/* K */}
        <span
          className={`font-bold ${
            theme === 'dark'
              ? 'text-gold text-lg sm:text-2xl drop-shadow'
              : 'text-forest-dark text-lg sm:text-2xl font-black'
          }`}
          style={{
            textShadow: theme === 'dark' ? '0 1px 2px rgba(0,0,0,0.8)' : '0 1px 1px rgba(180,154,88,0.3)',
          }}
        >
          K
        </span>
        {/* Λ (A styled as chevron) */}
        <span
          className={`font-bold ${
            theme === 'dark' ? 'text-gold text-lg sm:text-2xl' : 'text-forest-dark text-lg sm:text-2xl font-black'
          }`}
        >
          &#923;
        </span>
        {/* M */}
        <span
          className={`font-bold ${
            theme === 'dark' ? 'text-gold text-lg sm:text-2xl' : 'text-forest-dark text-lg sm:text-2xl font-black'
          }`}
        >
          M
        </span>
        {/* Λ */}
        <span
          className={`font-bold ${
            theme === 'dark' ? 'text-gold text-lg sm:text-2xl' : 'text-forest-dark text-lg sm:text-2xl font-black'
          }`}
        >
          &#923;
        </span>
        {/* Λ */}
        <span
          className={`font-bold ${
            theme === 'dark' ? 'text-gold text-lg sm:text-2xl' : 'text-forest-dark text-lg sm:text-2xl font-black'
          }`}
        >
          &#923;
        </span>
        {/* R */}
        <span
          className={`font-bold ${
            theme === 'dark' ? 'text-gold text-lg sm:text-2xl' : 'text-forest-dark text-lg sm:text-2xl font-black'
          }`}
        >
          R
        </span>
      </div>

      {/* — B e d d i n g s — */}
      <div className="flex items-center justify-center space-x-1 mt-0.5 w-full">
        <span className="h-[1px] w-2 sm:w-3 bg-gradient-to-r from-transparent to-gold"></span>
        <span
          className="text-[9px] sm:text-[10.5px] uppercase tracking-[0.38em] font-medium text-gold-dark font-sans"
          style={{ letterSpacing: '0.35em' }}
        >
          Beddings
        </span>
        <span className="h-[1px] w-2 sm:w-3 bg-gradient-to-l from-transparent to-gold"></span>
      </div>
    </div>
  )

  if (variant === 'emblem') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <Emblem />
      </div>
    )
  }

  if (variant === 'text') {
    return (
      <div className={className}>
        <BrandText />
      </div>
    )
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <Emblem />
        <BrandText />
      </div>
    )
  }

  // Horizontal variant (default for navbar)
  return (
    <div className={`flex items-center space-x-2.5 sm:space-x-3 group ${className}`}>
      <Emblem />
      <BrandText />
    </div>
  )
}
