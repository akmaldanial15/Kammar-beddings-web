'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  Shield,
  Award,
} from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { KamaarLogo } from '@/components/brand/KamaarLogo'

export function Footer() {
  const { t, locale } = useLanguage()
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const isBM = locale === 'bm'

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !consent) return
    setIsSubscribed(true)
    setEmail('')
  }

  const reassuranceItems = [
    {
      icon: Sparkles,
      badge: isBM ? '100% Organik' : '100% Organic',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      title: t.reassureLatex,
      subtitle: t.reassureLatexSub,
      href: '/collections/mattress?material=latex',
      iconGradient: 'from-amber-400/25 via-emerald-400/15 to-transparent text-gold-light border-gold/30',
    },
    {
      icon: RotateCcw,
      badge: isBM ? '100 Malam' : '100 Nights',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      title: t.reassureTrial,
      subtitle: t.reassureTrialSub,
      href: '/trial',
      iconGradient: 'from-amber-400/25 via-amber-600/15 to-transparent text-amber-300 border-amber-400/30',
    },
    {
      icon: ShieldCheck,
      badge: isBM ? '10 Tahun' : '10-Year',
      badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      title: t.reassureWarranty,
      subtitle: t.reassureWarrantySub,
      href: '/warranty',
      iconGradient: 'from-blue-400/25 via-indigo-600/15 to-transparent text-sky-300 border-blue-400/30',
    },
    {
      icon: Truck,
      badge: isBM ? 'Percuma' : 'Free Delivery',
      badgeClass: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      title: t.reassureDelivery,
      subtitle: t.reassureDeliverySub,
      href: '/delivery',
      iconGradient: 'from-teal-400/25 via-emerald-600/15 to-transparent text-teal-300 border-teal-400/30',
    },
  ]

  return (
    <footer className="bg-forest-dark text-warmwhite pt-12 sm:pt-16 pb-8 border-t border-borderLight/20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Reassurance Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 pb-3 border-b border-warmwhite/10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-gold font-sans">
                {isBM ? 'Jaminan Kualiti KAMAAR' : 'KAMAAR Assurance & Guarantee'}
              </span>
            </div>
            <h3 className="font-sans text-lg sm:text-2xl font-bold text-white mt-1 tracking-tight">
              {isBM ? 'Ketenangan Tidur Sepenuhnya Untuk Anda' : 'Sleep With Total Peace of Mind'}
            </h3>
          </div>
          <span className="text-xs text-slate-300/80 font-sans sm:text-right">
            {isBM ? 'Dipercayai oleh 15,000+ Keluarga Malaysia' : 'Trusted by 15,000+ Malaysian Homes'}
          </span>
        </div>

        {/* Reassurance Grid - High Legibility Luxury Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5 pb-12 sm:pb-14 border-b border-warmwhite/10">
          {reassuranceItems.map((item, idx) => {
            const Icon = item.icon
            return (
              <Link
                key={idx}
                href={item.href}
                className="group relative flex items-start space-x-3.5 p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.1] border border-white/10 hover:border-gold/50 transition-all duration-200 shadow-sm"
              >
                {/* Icon Container with luxury glow */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.iconGradient} flex items-center justify-center flex-shrink-0 border shadow-inner group-hover:scale-105 transition-transform duration-200`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content with high contrast readable typography */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-sans font-bold text-sm sm:text-base text-white tracking-tight group-hover:text-gold transition-colors leading-snug">
                      {item.title}
                    </span>
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border flex-shrink-0 ${item.badgeClass}`}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-slate-300 leading-relaxed font-normal">
                    {item.subtitle}
                  </p>
                </div>

                {/* Mobile tap arrow indicator */}
                <ChevronRight className="w-4 h-4 text-warmwhite/30 group-hover:text-gold group-hover:translate-x-0.5 transition-all flex-shrink-0 self-center sm:hidden" />
              </Link>
            )
          })}
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 sm:py-14">
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <Link href="/" className="inline-block">
                <KamaarLogo variant="horizontal" size="lg" theme="dark" />
              </Link>
            </div>
            <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              {t.aboutBrand}
            </p>

            {/* Newsletter form */}
            <div className="pt-2">
              <h5 className="font-sans text-xs font-bold uppercase tracking-wider text-gold">
                {t.newsletterTitle}
              </h5>
              <p className="font-sans text-xs text-slate-300 mt-1">{t.newsletterSub}</p>

              {isSubscribed ? (
                <div className="mt-3 p-3 bg-forest rounded-xl flex items-center space-x-2 text-xs text-gold border border-gold/30">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span className="font-sans font-medium">
                    {isBM
                      ? 'Selamat datang ke Kelab KAMAAR. Semak emel anda sebentar lagi.'
                      : 'Welcome to the KAMAAR Sanctuary Club. Check your inbox soon.'}
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="mt-3 space-y-2">
                  <div className="flex">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.newsletterPlaceholder}
                      className="flex-1 px-3.5 py-2.5 bg-warmwhite/10 text-warmwhite placeholder-warmwhite/40 font-sans text-xs rounded-l-xl border border-warmwhite/20 focus:outline-none focus:border-gold"
                    />
                    <button
                      type="submit"
                      disabled={!consent}
                      className="px-4 py-2.5 bg-gold text-forest-dark font-sans font-bold text-xs rounded-r-xl hover:bg-gold-light disabled:opacity-50 transition-colors flex items-center space-x-1"
                    >
                      <span>{t.subscribeBtn}</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <label className="flex items-start space-x-2 text-[11px] text-slate-300/80 cursor-pointer pt-1 font-sans">
                    <input
                      type="checkbox"
                      required
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 rounded text-gold focus:ring-gold"
                    />
                    <span>
                      {isBM
                        ? 'Saya bersetuju menerima panduan penjagaan tilam dan tawaran eksklusif menurut Polisi Privasi KAMAAR Beddings.'
                        : 'I agree to receive mattress care guides and promotional news in accordance with KAMAAR Beddings’ Privacy Policy.'}
                    </span>
                  </label>
                </form>
              )}
            </div>
          </div>

          {/* Col 2: Shopping */}
          <div className="space-y-3">
            <h5 className="font-sans text-xs font-bold uppercase tracking-widest text-gold pb-1 border-b border-warmwhite/10">
              {t.shoppingCol}
            </h5>
            <ul className="space-y-2 font-sans text-xs text-slate-300">
              <li>
                <Link href="/collections/mattress" className="hover:text-gold transition-colors py-0.5 inline-block">
                  {isBM ? 'Semua Koleksi Tilam' : 'All Mattresses'}
                </Link>
              </li>
              <li>
                <Link href="/collections/mattress?material=latex" className="hover:text-gold transition-colors py-0.5 inline-block">
                  {isBM ? '100% Lateks Semulajadi' : '100% Natural Latex'}
                </Link>
              </li>
              <li>
                <Link href="/collections/mattress?material=hybrid" className="hover:text-gold transition-colors py-0.5 inline-block">
                  {isBM ? 'Tilam Hibrid Sejuk' : 'Cool Night Hybrid'}
                </Link>
              </li>
              <li>
                <Link href="/collections/mattress?material=ortho" className="hover:text-gold transition-colors py-0.5 inline-block">
                  {isBM ? 'Ortopedik Tulang Belakang' : 'Orthopaedic Spinal'}
                </Link>
              </li>
              <li>
                <Link href="/collections/pillows" className="hover:text-gold transition-colors py-0.5 inline-block">
                  {isBM ? 'Bantal Lateks Asli' : 'Natural Latex Pillows'}
                </Link>
              </li>
              <li>
                <Link href="/collections/toppers-protectors" className="hover:text-gold transition-colors py-0.5 inline-block">
                  {isBM ? 'Pelapik & Pelindung Tilam' : 'Mattress Toppers'}
                </Link>
              </li>
              <li>
                <Link href="/collections/bedframes" className="hover:text-gold transition-colors py-0.5 inline-block">
                  {isBM ? 'Rangka Katil Kayu Padu' : 'Hardwood Bedframes'}
                </Link>
              </li>
              <li>
                <Link href="/collections/bedding" className="hover:text-gold transition-colors py-0.5 inline-block">
                  {isBM ? 'Cadaran Buluh 1000TC' : '1000TC Bamboo Bedding'}
                </Link>
              </li>
              <li>
                <Link href="/offers" className="text-gold font-semibold hover:underline py-0.5 inline-block">
                  {isBM ? 'Vaucer & Tawaran Istimewa' : 'Vouchers & Offers'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="space-y-3">
            <h5 className="font-sans text-xs font-bold uppercase tracking-widest text-gold pb-1 border-b border-warmwhite/10">
              {t.careCol}
            </h5>
            <ul className="space-y-2 font-sans text-xs text-slate-300">
              <li>
                <Link href="/trial" className="hover:text-gold transition-colors py-0.5 inline-block">
                  {isBM ? 'Percubaan Tidur 100 Malam' : '100-Night Sleep Trial'}
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="hover:text-gold transition-colors py-0.5 inline-block">
                  {isBM ? 'Pendaftaran Jaminan Kualiti' : 'Warranty Registration'}
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="hover:text-gold transition-colors py-0.5 inline-block">
                  {isBM ? 'Penghantaran & Pemasangan' : 'Shipping & Bulky Delivery'}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gold transition-colors py-0.5 inline-block">
                  {isBM ? 'Soalan Lazim (FAQ)' : 'Frequently Asked Questions'}
                </Link>
              </li>
              <li>
                <Link href="/care-guide" className="hover:text-gold transition-colors py-0.5 inline-block">
                  {isBM ? 'Panduan Penjagaan Tilam' : 'Latex Mattress Care Guide'}
                </Link>
              </li>
              <li>
                <Link href="/finder" className="hover:text-gold transition-colors py-0.5 inline-block">
                  {isBM ? 'Kuiz Pencari Tilam 60s' : 'Mattress Finder Quiz'}
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-gold transition-colors py-0.5 inline-block">
                  {isBM ? 'Bandingkan Tilam' : 'Mattress Comparison Tool'}
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-gold transition-colors py-0.5 inline-block">
                  {isBM ? 'Semak Pesanan & Resit' : 'Order Tracking & Receipts'}
                </Link>
              </li>
              <li>
                <Link
                  href="/affiliate/login"
                  className="text-gold/90 hover:text-gold transition-colors font-medium flex items-center gap-1.5 py-0.5"
                >
                  <span>{isBM ? 'Portal Ejen & Affiliate' : 'Affiliate & Agent Portal'}</span>
                  <span className="text-[9.5px] px-1.5 py-0.5 bg-gold/20 rounded font-bold text-gold">Ejen</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Showrooms & Contact */}
          <div className="space-y-3">
            <h5 className="font-sans text-xs font-bold uppercase tracking-widest text-gold pb-1 border-b border-warmwhite/10">
              {t.contactCol}
            </h5>
            <div className="space-y-2.5 font-sans text-xs text-slate-300">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>Flagship: No. 88, Jalan Maarof, Bangsar, 59100 Kuala Lumpur</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="tel:+60377221199" className="hover:text-gold transition-colors">
                  +603 7722 1199
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="mailto:concierge@kamaarbeddings.com" className="hover:text-gold transition-colors">
                  concierge@kamaarbeddings.com
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>Showroom Hours: Mon - Sun, 10:00 AM - 8:00 PM</span>
              </div>

              <div className="pt-2">
                <Link
                  href="/showrooms"
                  className="inline-block px-3.5 py-2 bg-white/[0.08] hover:bg-gold hover:text-forest-dark text-warmwhite rounded-xl text-xs font-semibold border border-gold/30 transition-all shadow-sm"
                >
                  {isBM ? 'Tempah Temujanji Showroom →' : 'Book Showroom Consultation →'}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Gateways & Copyright */}
        <div className="pt-8 border-t border-warmwhite/10 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 space-y-4 md:space-y-0 font-sans">
          <div>
            <p>&copy; {new Date().getFullYear()} KAMAAR BEDDINGS SDN. BHD. (Company No. 202601099881). {t.allRightsReserved}</p>
            <div className="flex space-x-4 mt-1.5 text-[11px] text-slate-400">
              <Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
              <span>&bull;</span>
              <Link href="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
              <span>&bull;</span>
              <Link href="/refunds" className="hover:text-gold transition-colors">Refund & Trial Terms</Link>
            </div>
          </div>

          {/* Payment Badges */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <span className="text-[11px] text-slate-300 flex items-center space-x-1">
              <CreditCard className="w-3.5 h-3.5 text-gold" />
              <span>{isBM ? 'Pembayaran Selamat Stripe:' : 'Secured by Stripe:'}</span>
            </span>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 bg-white/[0.08] rounded-lg font-bold text-[10px] tracking-wider text-white border border-white/10">
                VISA
              </span>
              <span className="px-2.5 py-1 bg-white/[0.08] rounded-lg font-bold text-[10px] tracking-wider text-white border border-white/10">
                MASTERCARD
              </span>
              <span className="px-2.5 py-1 bg-gold/15 rounded-lg font-bold text-[10px] tracking-wider text-gold border border-gold/30 font-mono">
                FPX ONLINE
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

