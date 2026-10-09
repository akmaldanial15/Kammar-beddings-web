'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight, ShieldCheck, Truck } from 'lucide-react'
import { initialWebsiteConfig } from '@/lib/db/seedData'

export function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState(initialWebsiteConfig.announcement)

  useEffect(() => {
    fetch('/api/website-config', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.config?.announcement) {
          setAnnouncement(data.config.announcement)
        }
      })
      .catch((err) => console.error('Failed to load announcement config:', err))
  }, [])

  if (announcement.enabled === false) {
    return null
  }

  return (
    <div
      className="text-warmwhite py-2 px-4 text-xs font-medium tracking-wide border-b border-gold/20 transition-colors"
      style={{
        backgroundColor: announcement.bgColor || '#13325B',
        color: announcement.textColor || '#FFFFFF',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left benefit */}
        <div className="hidden md:flex items-center space-x-2 text-[11px] text-warmwhite/90 font-bold uppercase tracking-wider">
          <Truck className="w-3.5 h-3.5 text-gold flex-shrink-0" />
          <span>{announcement.leftBenefit || 'PENGHANTARAN SELURUH MALAYSIA'}</span>
        </div>

        {/* Center promotional notice */}
        <div className="flex-1 md:flex-initial flex items-center justify-center space-x-2 text-center">
          <Sparkles className="w-3.5 h-3.5 text-gold flex-shrink-0 animate-pulse" />
          <span className="font-bold text-warmwhite text-[11.5px] sm:text-xs tracking-wider uppercase">
            {announcement.centerText || 'PENGILANG & PEMASAR PRODUK JAHITAN TEKSTIL'}
            {announcement.highlightCode && (
              <strong className="text-gold font-bold tracking-wider ml-1.5">
                {announcement.highlightCode}
              </strong>
            )}
          </span>
          {announcement.url && (
            <Link
              href={announcement.url}
              className="hidden sm:inline-flex items-center space-x-1 text-gold hover:text-gold-light font-bold underline ml-1.5 transition-colors"
            >
              <span>Lihat Tawaran Kilang</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {/* Right guarantee */}
        <div className="hidden lg:flex items-center space-x-1.5 text-[11px] text-warmwhite/90 font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-gold flex-shrink-0" />
          <span>{announcement.rightGuarantee || 'JAMINAN HARGA TERENDAH'}</span>
        </div>
      </div>
    </div>
  )
}

