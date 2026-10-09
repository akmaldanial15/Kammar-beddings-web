'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ShieldCheck,
  Truck,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  Award,
  ArrowUpRight,
  Facebook,
} from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { KamaarLogo } from '@/components/brand/KamaarLogo'

function TikTokIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.34 6.34 0 0 0 1.86-4.49v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.86-.09z" />
    </svg>
  )
}

function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15-.2.301-.779.98-.955 1.18-.176.201-.352.226-.653.075-1.377-.69-2.314-1.32-3.238-2.908-.246-.423.246-.393.703-1.309.075-.15.038-.276-.019-.39-.075-.113-.678-1.635-.93-2.242-.246-.59-.496-.51-.678-.519-.176-.008-.377-.01-.578-.01-.2 0-.528.075-.804.377-.276.301-1.055 1.03-1.055 2.512s1.08 2.913 1.231 3.114c.15.201 2.124 3.244 5.146 4.549 1.954.845 2.709.846 3.684.701.594-.088 1.78-.728 2.031-1.432.251-.703.251-1.305.176-1.432-.075-.126-.276-.201-.578-.352zM12 21.82a9.77 9.77 0 0 1-4.99-1.37l-.36-.21-3.71.97.99-3.61-.23-.37A9.8 9.8 0 1 1 12 21.82zm0-17.82a8.02 8.02 0 0 0-6.95 12.03l.44.7-.65 2.37 2.43-.64.68.4A8.02 8.02 0 1 0 12 4z" />
    </svg>
  )
}

export function Footer() {
  const { locale } = useLanguage()
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const isBM = locale === 'bm'

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsSubscribed(true)
    setEmail('')
  }

  const reassuranceItems = [
    {
      icon: Sparkles,
      badge: isBM ? 'Terus Dari Kilang' : 'Direct Factory',
      title: 'TERUS DARI KILANG',
      subtitle: 'PRODUK TERUS DARI KILANG DI TASEK GELUGOR PULAU PINANG',
      href: '/profil',
    },
    {
      icon: Award,
      badge: isBM ? 'Harga Terendah' : 'Lowest Price',
      title: 'JAMINAN HARGA TERENDAH',
      subtitle: 'JAMINAN HARGA PALING RENDAH DALAM PASARAN',
      href: '/collections/tilam-toto',
    },
    {
      icon: ShieldCheck,
      badge: isBM ? 'Kawalan Kualiti' : 'Quality Control',
      title: 'KAWALAN KUALITI (QC)',
      subtitle: 'KAWALAN KUALITI YANG TELITI SEBELUM SAMPAI KE PELANGGAN',
      href: '/profil#tentang-kami',
    },
    {
      icon: Truck,
      badge: isBM ? 'Seluruh Malaysia' : 'Nationwide',
      title: 'PENGHANTARAN SELURUH MALAYSIA',
      subtitle: 'RANGKAIAN PENGHANTARAN DI SELURUH MALAYSIA (DOOR TO DOOR SERVICE)',
      href: '/delivery',
    },
  ]

  return (
    <footer className="relative bg-gradient-to-b from-[#1E4E8C] via-[#153D73] to-[#0F2D54] text-white pt-14 sm:pt-20 pb-10 border-t border-white/15 font-sans overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-gold/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 1. Reassurance Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-5 border-b border-white/15">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold-light text-[10px] font-bold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span>{isBM ? 'Jaminan Mutu KAMAAR' : 'KAMAAR Quality Guarantee'}</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {isBM ? 'Ketenangan Tidur Sepenuhnya Untuk Anda' : 'Sleep With Total Peace of Mind'}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-blue-100 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 self-start md:self-auto shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-gold flex-shrink-0" />
            <span>{isBM ? 'Dipercayai oleh 15,000+ Keluarga Malaysia' : 'Trusted by 15,000+ Malaysian Homes'}</span>
          </div>
        </div>

        {/* 2. Reassurance Grid - 4 Floating Glass Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 pb-10 sm:pb-12 border-b border-white/15">
          {reassuranceItems.map((item, idx) => {
            const Icon = item.icon
            return (
              <Link
                key={idx}
                href={item.href}
                className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 hover:border-gold/60 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-black/20 backdrop-blur-sm overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-gold/10 rounded-full blur-xl group-hover:bg-gold/20 transition-all duration-300 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold group-hover:scale-105 group-hover:bg-gold group-hover:text-forest-dark transition-all duration-300 shadow-xs flex-shrink-0">
                      <Icon className="w-5 h-5 transition-transform" />
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-gold-light border border-white/15 group-hover:border-gold/40 group-hover:bg-gold/15 transition-colors">
                      {item.badge}
                    </span>
                  </div>

                  <h4 className="font-serif text-base font-bold text-white group-hover:text-gold transition-colors tracking-tight mb-2 leading-snug">
                    {item.title}
                  </h4>

                  <p className="font-sans text-xs text-blue-100/90 leading-relaxed font-normal">
                    {item.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-medium text-blue-200 group-hover:text-gold transition-colors">
                  <span>{isBM ? 'Ketahui Lebih Lanjut' : 'Learn More'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-gold/80 group-hover:text-gold" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* 3. VIP Newsletter Bar (Ultra-Clean, Dedicated Modern Card) */}
        <div className="my-10 sm:my-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-white/[0.10] via-white/[0.06] to-white/[0.10] border border-white/20 backdrop-blur-md shadow-lg relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-gold/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            <div className="lg:col-span-7 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-[10px] font-bold tracking-widest uppercase">
                <Sparkles className="w-3 h-3 text-gold" />
                <span>{isBM ? 'Kelab Eksklusif KAMAAR' : 'KAMAAR Exclusive Club'}</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {isBM ? 'Tawaran Kilang & Katalog Terkini Terus ke Emel' : 'Receive Exclusive Factory Deals & Catalog'}
              </h3>
              <p className="text-xs sm:text-sm text-blue-100/90 max-w-xl leading-relaxed">
                {isBM
                  ? 'Sertai komuniti kami untuk menerima kemas kini promosi jualan gudang tahunan, diskaun tempahan pukal asrama & panduan penjagaan tilam.'
                  : 'Join our community for seasonal warehouse sales, bulk hostel quotes & expert mattress care tips.'}
              </p>
            </div>

            <div className="lg:col-span-5">
              {isSubscribed ? (
                <div className="p-4 rounded-2xl bg-forest/40 border border-gold/30 flex items-center gap-3 text-gold text-xs">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">
                    {isBM
                      ? 'Terima kasih! Anda kini ahli Kelab KAMAAR. Semak emel anda.'
                      : 'Thank you! You are now part of KAMAAR Club. Check your inbox.'}
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="relative flex items-center">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={isBM ? 'Masukkan alamat emel anda...' : 'Enter your email address...'}
                      className="w-full pl-4 pr-32 sm:pr-36 py-3.5 bg-black/20 text-white placeholder-blue-100/70 text-xs sm:text-sm rounded-2xl border border-white/20 focus:outline-none focus:border-gold focus:bg-black/30 transition-all"
                    />
                    <button
                      type="submit"
                      className="absolute right-1.5 px-4 sm:px-5 py-2.5 bg-gold hover:bg-gold-light text-forest-dark font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 hover:scale-[1.02]"
                    >
                      <span>{isBM ? 'Langgan' : 'Subscribe'}</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[10.5px] text-blue-200/80 pl-1">
                    {isBM
                      ? '🔒 Tanpa spam. Privasi anda dijamin & boleh berhenti bila-bila masa.'
                      : '🔒 No spam. We respect your privacy & you can unsubscribe anytime.'}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 4. Main 4 Columns (Balanced, Clean, Spacious) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 sm:pb-16">
          
          {/* Col 1: Brand & Profile (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <Link href="/" className="inline-block">
                <KamaarLogo variant="horizontal" size="lg" theme="dark" />
              </Link>
            </div>
            
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-sm">
              <strong className="text-white">TUNAS SINAR JAYA ENTERPRISE (KAMAAR BEDDINGS)</strong> merupakan syarikat pengeluar tekstil Bumiputera terkemuka di Tasek Gelugor, Pulau Pinang. Menghasilkan Tilam Toto, Tilam Lipat, Bantal dan Cadar berkualiti tinggi terus dari kilang.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-[11px] text-blue-100 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span>Pengeluar Tekstil Bumiputera (Sejak 2017)</span>
            </div>

            {/* Social Media Glass Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Jualan Gudang"
                className="h-9 px-3 rounded-xl bg-white/10 hover:bg-[#1877F2]/30 hover:text-white border border-white/20 hover:border-[#1877F2]/50 text-blue-100 transition-all flex items-center gap-2 text-xs font-medium"
              >
                <Facebook className="w-3.5 h-3.5" />
                <span>Facebook</span>
              </a>

              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok @KAMAAR_SHOP"
                className="h-9 px-3 rounded-xl bg-white/10 hover:bg-white/20 hover:text-white border border-white/20 hover:border-white/40 text-blue-100 transition-all flex items-center gap-2 text-xs font-medium"
              >
                <TikTokIcon className="w-3.5 h-3.5" />
                <span>TikTok</span>
              </a>

              <a
                href="https://wa.me/60194786991"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Kilang"
                className="h-9 px-3 rounded-xl bg-white/10 hover:bg-[#25D366]/30 hover:text-white border border-white/20 hover:border-[#25D366]/50 text-blue-100 transition-all flex items-center gap-2 text-xs font-medium"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Col 2: Produk & Koleksi (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h5 className="font-serif text-sm font-bold uppercase tracking-wider text-gold flex items-center gap-2 pb-1 border-b border-white/15">
              <span>{isBM ? 'Produk Kilang' : 'Factory Products'}</span>
            </h5>
            <ul className="space-y-2.5 text-xs text-blue-100/90 font-medium">
              <li>
                <Link href="/collections/tilam-toto" className="hover:text-gold hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-white font-semibold">
                  <ChevronRight className="w-3 h-3 text-gold" />
                  <span>Tilam Toto Asian Fibre</span>
                </Link>
              </li>
              <li>
                <Link href="/collections/tilam-kekabu" className="hover:text-gold hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <ChevronRight className="w-3 h-3 text-gold/70" />
                  <span>Tilam & Kekabu Asli</span>
                </Link>
              </li>
              <li>
                <Link href="/collections/tilam-lipat" className="hover:text-gold hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <ChevronRight className="w-3 h-3 text-gold/70" />
                  <span>Tilam Lipat 3 & Bujang</span>
                </Link>
              </li>
              <li>
                <Link href="/collections/bantal" className="hover:text-gold hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <ChevronRight className="w-3 h-3 text-gold/70" />
                  <span>Bantal Tidur Gebu & Peluk</span>
                </Link>
              </li>
              <li>
                <Link href="/collections/cadang-comforter" className="hover:text-gold hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <ChevronRight className="w-3 h-3 text-gold/70" />
                  <span>Cadar & Comforter</span>
                </Link>
              </li>
              <li>
                <Link href="/collections/borong-gudang" className="hover:text-gold hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-gold font-semibold">
                  <ChevronRight className="w-3 h-3 text-gold" />
                  <span>Jualan Gudang & Borong</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Maklumat & Servis (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h5 className="font-serif text-sm font-bold uppercase tracking-wider text-gold flex items-center gap-2 pb-1 border-b border-white/15">
              <span>{isBM ? 'Maklumat & Servis' : 'Company & Services'}</span>
            </h5>
            <ul className="space-y-2.5 text-xs text-blue-100/90 font-medium">
              <li>
                <Link href="/profil" className="hover:text-gold hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-white font-medium">
                  <ChevronRight className="w-3 h-3 text-gold/70" />
                  <span>Profil Tunas Sinar Jaya</span>
                </Link>
              </li>
              <li>
                <Link href="/profil#tentang-kami" className="hover:text-gold hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <ChevronRight className="w-3 h-3 text-gold/70" />
                  <span>Aktiviti Pengilangan 4 Unit</span>
                </Link>
              </li>
              <li>
                <Link href="/profil#carta-organisasi" className="hover:text-gold hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <ChevronRight className="w-3 h-3 text-gold/70" />
                  <span>Carta Organisasi Kilang</span>
                </Link>
              </li>
              <li>
                <Link href="/business" className="hover:text-gold hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <ChevronRight className="w-3 h-3 text-gold/70" />
                  <span>Tempahan OEM & Kerajaan</span>
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-gold hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <ChevronRight className="w-3 h-3 text-gold/70" />
                  <span>Semak Pesanan & Lori</span>
                </Link>
              </li>
              <li>
                <Link href="/affiliate/login" className="hover:text-gold hover:translate-x-1 inline-flex items-center gap-1.5 transition-all group">
                  <ChevronRight className="w-3 h-3 text-gold/70" />
                  <span>Portal Ejen & Affiliate</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-gold/20 text-gold font-bold">Ejen</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Kilang & Hubungi Kami (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-3.5">
            <h5 className="font-serif text-sm font-bold uppercase tracking-wider text-gold flex items-center gap-2 pb-1 border-b border-white/15">
              <span>{isBM ? 'Kilang & Hubungi Kami' : 'Factory & Contact'}</span>
            </h5>
            
            <div className="space-y-3 text-xs text-blue-100">
              {/* Address card */}
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/[0.08] border border-white/15 hover:border-gold/40 transition-colors shadow-xs">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-white block font-medium">Premis Kilang & Stor Utama:</strong>
                  <span className="text-blue-100/90">7878B Jalan Permatang Berangan, 13300 Tasek Gelugor SPU, Pulau Pinang</span>
                </div>
              </div>

              {/* Phone & Email cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href="tel:0194786991"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.08] border border-white/15 hover:border-gold/40 hover:bg-white/15 text-white font-semibold transition-all group shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 text-gold group-hover:scale-110 transition-transform" />
                  <span>019-478 6991</span>
                </a>

                <a
                  href="mailto:tunassinar@gmail.com"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.08] border border-white/15 hover:border-gold/40 hover:bg-white/15 text-white font-medium transition-all group truncate shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5 text-gold group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="truncate text-[11px]">tunassinar@gmail.com</span>
                </a>
              </div>

              {/* Operating hours */}
              <div className="flex items-center gap-2 text-[11px] text-blue-100/80 pl-1">
                <Clock className="w-3.5 h-3.5 text-gold/90 flex-shrink-0" />
                <span>Waktu Operasi Kilang: Isnin – Sabtu (9:00 AM – 6:00 PM)</span>
              </div>

              {/* Fast WhatsApp hotline action */}
              <a
                href="https://wa.me/60194786991?text=Salam%20Tunas%20Sinar%20Jaya%20Kamaar%20Beddings,%20saya%20ingin%20bertanya%20produk%20kilang."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>WhatsApp Hotline Kilang (019-478 6991)</span>
              </a>
            </div>
          </div>
        </div>

        {/* 5. Bottom Copyright & Strict Payment Badges Row */}
        <div className="pt-8 border-t border-white/15 flex flex-col md:flex-row items-center justify-between text-xs text-blue-100/80 gap-4 font-sans">
          <div className="space-y-1 text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} TUNAS SINAR JAYA ENTERPRISE (KAMAAR BEDDINGS). Hak Cipta Terpelihara.</p>
            <p className="text-[11px] text-gold/90 italic">
              &ldquo;Menjahit Kepercayaan, Menyulam Masa Depan&rdquo; &bull; &ldquo;Kualiti Jahitan, Kepuasan Terjamin&rdquo;
            </p>
            <div className="flex items-center justify-center md:justify-start gap-3 pt-0.5 text-[11px] text-blue-200/90">
              <Link href="/privacy" className="hover:text-gold transition-colors">Dasar Privasi</Link>
              <span>&bull;</span>
              <Link href="/terms" className="hover:text-gold transition-colors">Terma &amp; Syarat</Link>
              <span>&bull;</span>
              <Link href="/profil" className="hover:text-gold transition-colors">Profil Syarikat</Link>
            </div>
          </div>

          {/* Payment Badges Container: STRICTLY FPX & Touch 'n Go eWallet */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 bg-white/10 border border-white/20 px-3.5 py-2 rounded-2xl backdrop-blur-xs shadow-xs">
            <span className="text-[11px] text-white flex items-center gap-1.5 font-medium">
              <CreditCard className="w-3.5 h-3.5 text-gold flex-shrink-0" />
              <span>{isBM ? 'Kaedah Pembayaran Sah:' : 'Accepted Payments:'}</span>
            </span>
            <div className="flex items-center gap-2">
              {/* FPX Logo Badge */}
              <div
                className="h-8 px-2.5 bg-white rounded-lg flex items-center justify-center shadow-xs border border-white/20 hover:scale-105 transition-transform"
                title="FPX Online Banking"
              >
                <Image
                  src="/images/payments/fpx.svg"
                  alt="FPX Online Banking"
                  width={54}
                  height={18}
                  className="h-4.5 w-auto object-contain"
                />
              </div>

              {/* Touch 'n Go eWallet Logo Badge */}
              <div
                className="h-8 px-2.5 bg-white rounded-lg flex items-center justify-center gap-1.5 shadow-xs border border-white/20 hover:scale-105 transition-transform"
                title="Touch 'n Go eWallet"
              >
                <Image
                  src="/images/payments/tng-ewallet.svg"
                  alt="Touch 'n Go eWallet"
                  width={20}
                  height={20}
                  className="h-5 w-5 object-contain rounded-xs"
                />
                <span className="font-bold text-[11px] text-[#015CA9] font-sans tracking-tight leading-none">
                  Touch &apos;n Go <span className="font-medium text-slate-600 text-[10px]">eWallet</span>
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}
