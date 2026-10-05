import React from 'react'
import Link from 'next/link'
import {
  BedDouble,
  Search,
  Sparkles,
  ArrowRight,
  Home,
  Phone,
  Scale,
  MapPin,
} from 'lucide-react'
import { KamaarLogo } from '@/components/brand/KamaarLogo'

export default function NotFound() {
  return (
    <div className="bg-cream min-h-screen py-16 md:py-24 font-sans flex items-center justify-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-8 animate-fade-in-up">
        {/* Brand emblem */}
        <div className="flex justify-center">
          <KamaarLogo variant="horizontal" size="md" theme="light" />
        </div>

        {/* 404 Headline */}
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-gold font-bold">
            Page Not Found &bull; Ralat 404
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest-dark tracking-tight">
            This Bedroom Suite Does Not Exist
          </h1>
          <p className="text-xs sm:text-sm text-secondary max-w-md mx-auto leading-relaxed">
            The page you are looking for may have been relocated, updated, or is temporarily undergoing atelier tailoring.
          </p>
        </div>

        {/* 4 Recommended Discovery Destinations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-left">
          <Link
            href="/collections/mattress"
            className="p-4 rounded-2xl bg-warmwhite border border-borderLight shadow-xs hover:border-gold/60 transition-all group flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-xl bg-forest/10 text-forest flex items-center justify-center mb-2">
              <BedDouble className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-forest-dark block group-hover:text-forest">
                Mattress Catalog
              </span>
              <span className="text-[10px] text-secondary">
                100% pure natural latex & hybrids
              </span>
            </div>
          </Link>

          <Link
            href="/finder"
            className="p-4 rounded-2xl bg-warmwhite border border-borderLight shadow-xs hover:border-gold/60 transition-all group flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-xl bg-gold/15 text-gold-dark flex items-center justify-center mb-2">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-forest-dark block group-hover:text-forest">
                60-Sec Quiz
              </span>
              <span className="text-[10px] text-secondary">
                Find your personalized firmness fit
              </span>
            </div>
          </Link>

          <Link
            href="/compare"
            className="p-4 rounded-2xl bg-warmwhite border border-borderLight shadow-xs hover:border-gold/60 transition-all group flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-xl bg-forest/10 text-forest flex items-center justify-center mb-2">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-forest-dark block group-hover:text-forest">
                Compare Tool
              </span>
              <span className="text-[10px] text-secondary">
                Side-by-side mattress specs
              </span>
            </div>
          </Link>

          <Link
            href="/showrooms"
            className="p-4 rounded-2xl bg-warmwhite border border-borderLight shadow-xs hover:border-gold/60 transition-all group flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-xl bg-gold/15 text-gold-dark flex items-center justify-center mb-2">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-forest-dark block group-hover:text-forest">
                Showrooms
              </span>
              <span className="text-[10px] text-secondary">
                Experience in Bangsar atelier
              </span>
            </div>
          </Link>
        </div>

        {/* Back to Home CTA */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all"
          >
            <Home className="w-4 h-4 text-gold" />
            <span>Return to Sanctuary Home</span>
          </Link>

          <a
            href="https://wa.me/60123456789?text=Hello%20KAMAAR,%20I%20need%20help%20finding%20a%20product%20on%20your%20website."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-warmwhite hover:bg-cream text-charcoal text-xs font-bold uppercase tracking-wider rounded-xl border border-borderLight transition-all"
          >
            <Phone className="w-3.5 h-3.5 text-gold-dark" />
            <span>WhatsApp Concierge</span>
          </a>
        </div>
      </div>
    </div>
  )
}
