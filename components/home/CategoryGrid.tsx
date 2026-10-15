'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function CategoryGrid() {
  const { t } = useLanguage()

  interface MattressType {
    title: string
    subtitle: React.ReactNode
    tag: string
    link: string
    imageUrl: string
  }

  const mattressTypes: MattressType[] = [
    {
      title: 'TC SHODDY FIBRE',
      subtitle: (
        <>
          <strong className="font-bold text-white">TC SHODDY</strong> dihasilkan melalui proses{' '}
          <span className="italic">reverse engineering</span> daripada &ldquo;waste yarn&rdquo; menjadi kapas yang lembut dan gebu, memberikan isian lebih padat, kenyal serta keselesaan optimum kepada pengguna.
        </>
      ),
      tag: 'LEBIH JIMAT',
      link: '/collections/tilam-gulung',
      imageUrl: '/images/products/tilam-gulung-a-tc.png',
    },
    {
      title: 'POLYESTER FIBRE',
      subtitle: (
        <>
          <strong className="font-bold text-white">POLYESTER STAPLE FIBRE (POLY)</strong> memberikan isian yang lembut, gebu dan ringan, dengan keanjalan yang baik serta mampu mengekalkan bentuk. Sesuai untuk{' '}
          <strong className="font-bold text-white">bantal dan tilam</strong>, tahan lama, mudah dijaga dan memberikan keselesaan optimum ketika tidur.
        </>
      ),
      tag: 'PALING LARIS',
      link: '/collections/tilam-toto',
      imageUrl: '/images/products/toto-single-poly.png',
    },
    {
      title: 'KEKABU ASLI',
      subtitle: (
        <>
          Dihasilkan daripada serat kekabu semula jadi yang ringan dan gebu, memberikan sokongan lembut, pengudaraan yang baik serta rasa nyaman ketika tidur.{' '}
          <strong className="font-bold text-white">Pilihan semula jadi untuk tidur yang lebih selesa setiap malam.</strong>
        </>
      ),
      tag: 'ORGANIK',
      link: '/collections/tilam-kekabu',
      imageUrl: '/images/products/tilam-gulung-kekabu-asli.png',
    },
    {
      title: 'JELAJAH PROMOSI & JUALAN GUDANG',
      subtitle: (
        <>
          Kami bawakan pelbagai produk <strong className="font-bold text-white">KAMAAR</strong> seperti bantal, tilam, selimut dan pelbagai produk berkualiti{' '}
          <strong className="font-bold text-white">terus dari kilang</strong>, ditawarkan pada{' '}
          <strong className="font-bold text-white">harga promosi istimewa di tempat anda.</strong>
        </>
      ),
      tag: 'KAMI KE TEMPAT ANDA',
      link: '/jelajah-promosi',
      imageUrl: '/images/promosi/PROMOSI 2.png',
    },
  ]

  const supportingCategories = [
    {
      name: 'Bantal Tidur (M, L, XL)',
      description: 'TC, Poly Fibre & Kekabu Asli',
      badge: 'GEBU & EMPUK',
      link: '/collections/bantal-tidur',
      imageUrl: '/images/products/bantal-tidur-l-poly.png',
    },
    {
      name: 'Bantal Peluk Gebu',
      description: 'Isian padat saiz M & L',
      badge: 'PILIHAN RAMAI',
      link: '/collections/bantal-peluk',
      imageUrl: '/images/products/bantal-peluk-l-poly.png',
    },
    {
      name: 'Produk Baby Kekabu',
      description: 'Set tilam baby A & B dan bantal',
      badge: '100% ORGANIK',
      link: '/collections/produk-baby',
      imageUrl: '/images/products/set-tilam-baby-a-kekabu-asli.png',
    },
    {
      name: 'Selimut Legend Kilang',
      description: 'Saiz M (60x80) & L (70x90)',
      badge: 'EDISI KLASIK',
      link: '/collections/selimut',
      imageUrl: '/images/products/selimut-legend-m.png',
    },
    {
      name: 'Bantal Kusyen / Sofa',
      description: 'Saiz 14x14 sehingga 30x30 inci',
      badge: 'PELBAGAI SAIZ',
      link: '/collections/kusyen-sofa',
      imageUrl: '/images/products/bantal-kusyen-20x20-poly.png',
    },
    {
      name: 'Sarung Tilam Berzip',
      description: 'Single & Queen mudah cuci',
      badge: 'MUDAH CUCI',
      link: '/collections/sarung-tilam',
      imageUrl: '/images/products/sarung-tilam-single.png',
    },
    {
      name: 'Showroom Studio Live',
      description: 'Lawati studio live di Tasek Gelugor',
      badge: 'TASEK GELUGOR',
      link: '/showrooms',
      imageUrl: '/images/company/SHOWROOM STUDIO.png',
    },
    {
      name: 'Kilang & Unit Jahitan',
      description: 'Tenaga mahir tempatan 4 fasa QC',
      badge: 'KILANG TSJ',
      link: '/profil',
      imageUrl: '/images/company/UNIT JAHITAN.png',
    },
  ]

  return (
    <section className="py-16 sm:py-24 bg-warmwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Exactly Slide 2 of PERUBAHAN DI MUKA DEPAN.pptx */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-gold-dark flex items-center justify-center space-x-1.5 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>KOLEKSI KAMAAR</span>
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest tracking-tight">
            KOLEKSI KAMAAR PALING LARIS &amp; PILIHAN RAMAI
          </h2>
          <p className="text-sm sm:text-base text-charcoal-muted mt-3.5 leading-relaxed font-sans uppercase text-xs sm:text-sm tracking-wide">
            DIHASILKAN OLEH TENAGA MAHIR TEMPATAN MENGGUNAKAN BAHAN BERKUALITI TINGGI, DENGAN KAWALAN KUALITI TELITI DAN HARGA TERBAIK DI PASARAN.
          </p>
        </div>

        {/* 4 Main Mattress Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {mattressTypes.map((type, idx) => (
            <Link
              key={idx}
              href={type.link}
              className={`group relative min-h-[380px] sm:min-h-[440px] rounded-2xl overflow-hidden shadow-card border border-borderLight flex flex-col justify-end p-6 sm:p-8 luxury-card-hover animate-fade-in-up ${
                idx === 0 ? 'delay-50' : idx === 1 ? 'delay-100' : idx === 2 ? 'delay-150' : 'delay-200'
              }`}
            >
              <Image
                src={type.imageUrl}
                alt={type.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/95 via-forest-dark/60 to-transparent" />

              <div className="relative z-10 space-y-2.5">
                <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold text-forest-dark shadow-xs">
                  {type.tag}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-warmwhite group-hover:text-gold-light transition-colors">
                  {type.title}
                </h3>
                <p className="text-xs sm:text-sm text-warmwhite/95 leading-relaxed">
                  {type.subtitle}
                </p>
                <div className="pt-2 flex items-center space-x-2 text-xs font-bold text-gold uppercase tracking-wider">
                  <span>Lihat Produk</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Supporting Categories Strip - Luxurious 4-Column Responsive Grid */}
        <div className="pt-12 sm:pt-16 border-t border-borderLight/80">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream text-gold-dark text-[10px] font-bold uppercase tracking-widest border border-borderLight mb-2.5">
                <Sparkles className="w-3 h-3 text-gold" />
                <span>Katalog Lengkap Tekstil Kilang</span>
              </span>
              <h4 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest tracking-tight">
                Koleksi Lengkap Jahitan Tekstil Kilang
              </h4>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-1.5 max-w-2xl leading-relaxed">
                Pilihan bantal tidur gebu, selimut patchwork legenda, kelengkapan bayi organik, sarung tilam tahan lasak dan tempahan pukal terus dari lantai kilang Tunas Sinar Jaya.
              </p>
            </div>
            <Link
              href="/collections/tilam-toto"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white hover:bg-forest text-forest hover:text-white border border-borderLight text-xs font-bold transition-all shadow-2xs group flex-shrink-0 self-start md:self-end"
            >
              <span>Semua Produk</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {supportingCategories.map((cat, idx) => (
              <Link
                key={idx}
                href={cat.link}
                className="group relative rounded-2xl overflow-hidden bg-white border border-[#E8E2D7] hover:border-[#B49A58] shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-cream/30">
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  
                  {/* Floating Pill Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-white/95 text-forest shadow-xs backdrop-blur-xs border border-white/60">
                    {cat.badge}
                  </span>
                </div>

                <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
                  <div>
                    <h5 className="font-serif text-base sm:text-lg font-bold text-forest group-hover:text-gold-dark transition-colors leading-snug">
                      {cat.name}
                    </h5>
                    <p className="text-xs text-charcoal-muted mt-1.5 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-borderLight/60 flex items-center justify-between text-xs font-bold text-[#1E4E8C] group-hover:text-gold-dark transition-colors">
                    <span className="text-[10px] uppercase tracking-wider text-secondary font-medium font-sans">
                      Terus Dari Kilang
                    </span>
                    <span className="inline-flex items-center gap-1 group-hover:underline">
                      <span>Terokai</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
