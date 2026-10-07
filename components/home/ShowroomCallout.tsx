'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, Phone, ArrowRight, Sparkles } from 'lucide-react'
import { Showroom } from '@/types'

interface ShowroomCalloutProps {
  showrooms: Showroom[]
}

export function ShowroomCallout({ showrooms }: ShowroomCalloutProps) {
  return (
    <section className="py-16 sm:py-24 bg-warmwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gold-dark flex items-center space-x-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Lokasi Kilang &amp; Stor Jualan Gudang</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest">
              Kunjungi Premis Kilang Kami di Pulau Pinang
            </h2>
            <p className="text-sm sm:text-base text-charcoal-muted mt-2 max-w-xl">
              Sedia melayan pembelian terus di kilang serta perbincangan tempahan borong untuk asrama, institusi, homestay dan pembekal tekstil.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <Link
              href="/profil"
              className="px-5 py-3 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold uppercase tracking-wider rounded-lg shadow-subtle flex items-center space-x-2 transition-colors"
            >
              <span>Profil Syarikat</span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </Link>
            <a
              href="https://wa.me/601164447908"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-subtle flex items-center space-x-2 transition-colors"
            >
              <span>WhatsApp 011-6444 7908</span>
            </a>
          </div>
        </div>

        {/* Showrooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {showrooms.slice(0, 4).map((showroom) => (
            <div
              key={showroom.id}
              className="bg-cream-light rounded-2xl border border-borderLight overflow-hidden shadow-card flex flex-col justify-between group hover:border-gold transition-colors"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-cream">
                <Image
                  src={showroom.imageUrl || showroom.image || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80'}
                  alt={showroom.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-forest mb-2">
                    {showroom.name}
                  </h3>
                  <div className="space-y-1.5 text-xs text-charcoal-muted">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-gold-dark flex-shrink-0 mt-0.5" />
                      <span>{showroom.address}, {showroom.city}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-gold-dark flex-shrink-0" />
                      <span>{showroom.openingHours}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-gold-dark flex-shrink-0" />
                      <span>{showroom.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-borderLight flex items-center justify-between">
                  <a
                    href={showroom.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-gold-dark hover:text-forest underline"
                  >
                    Google Maps &rarr;
                  </a>
                  <Link
                    href={`/showrooms?book=${encodeURIComponent(showroom.name)}`}
                    className="text-xs font-semibold text-forest hover:text-gold-dark"
                  >
                    Reserve Slot
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
