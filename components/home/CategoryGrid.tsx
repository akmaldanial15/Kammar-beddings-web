'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function CategoryGrid() {
  const { t } = useLanguage()

  const mattressTypes = [
    {
      title: 'TC SHODDY FIBRE',
      subtitle:
        'TC SHODDY dihasilkan melalui proses reverse engineering daripada "waste yarn" menjadi kapas yang lembut dan gebu, memberikan isian lebih padat, kenyal serta keselesaan optimum kepada pengguna.',
      tag: 'LEBIH JIMAT',
      link: '/collections/tilam-gulung',
      imageUrl: '/images/products/tilam-gulung-a-tc.png',
    },
    {
      title: 'POLYESTER FIBRE',
      subtitle:
        'POLYESTER STAPLE FIBRE (POLY) memberikan isian yang lembut, gebu dan ringan, dengan keanjalan yang baik serta mampu mengekalkan bentuk. Sesuai untuk bantal dan tilam, tahan lama, mudah dijaga dan memberikan keselesaan optimum ketika tidur.',
      tag: 'PALING LARIS',
      link: '/collections/tilam-toto',
      imageUrl: '/images/products/toto-single-poly.png',
    },
    {
      title: 'KEKABU ASLI',
      subtitle:
        'Dihasilkan daripada serat kekabu semula jadi yang ringan dan gebu, memberikan sokongan lembut, pengudaraan yang baik serta rasa nyaman ketika tidur. Pilihan semula jadi untuk tidur yang lebih selesa setiap malam.',
      tag: 'ORGANIK',
      link: '/collections/tilam-kekabu',
      imageUrl: '/images/products/tilam-gulung-kekabu-asli.png',
    },
    {
      title: 'JELAJAH PROMOSI & JUALAN GUDANG',
      subtitle:
        'Kami bawakan pelbagai produk KAMAAR seperti bantal, tilam, selimut dan pelbagai produk berkualiti terus dari kilang, ditawarkan pada harga promosi istimewa di tempat anda.',
      tag: 'KAMI KE TEMPAT ANDA',
      link: '/jelajah-promosi',
      imageUrl: '/images/promosi/PROMOSI 1.png',
    },
  ]

  const supportingCategories = [
    {
      name: 'Bantal Tidur (M, L, XL)',
      description: 'TC, Poly Fibre & Kekabu Asli',
      link: '/collections/bantal-tidur',
      imageUrl: '/images/products/bantal-tidur-l-poly.png',
    },
    {
      name: 'Bantal Peluk Gebu',
      description: 'Isian padat saiz M & L',
      link: '/collections/bantal-peluk',
      imageUrl: '/images/products/bantal-peluk-l-poly.png',
    },
    {
      name: 'Produk Baby Kekabu',
      description: 'Set tilam baby A & B dan bantal',
      link: '/collections/produk-baby',
      imageUrl: '/images/products/set-tilam-baby-a-kekabu-asli.png',
    },
    {
      name: 'Selimut Legend Kilang',
      description: 'Saiz M (60x80) & L (70x90)',
      link: '/collections/selimut',
      imageUrl: '/images/products/selimut-legend-m.png',
    },
    {
      name: 'Bantal Kusyen / Sofa',
      description: 'Saiz 14x14 sehingga 30x30 inci',
      link: '/collections/kusyen-sofa',
      imageUrl: '/images/products/bantal-kusyen-20x20-poly.png',
    },
    {
      name: 'Sarung Tilam Berzip',
      description: 'Single & Queen mudah cuci',
      link: '/collections/sarung-tilam',
      imageUrl: '/images/products/sarung-tilam-single.png',
    },
    {
      name: 'Showroom Studio Live',
      description: 'Lawati studio live di Tasek Gelugor',
      link: '/showrooms',
      imageUrl: '/images/company/SHOWROOM STUDIO.png',
    },
    {
      name: 'Kilang & Unit Jahitan',
      description: 'Tenaga mahir tempatan 4 fasa QC',
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
              className={`group relative h-[320px] sm:h-[380px] rounded-2xl overflow-hidden shadow-card border border-borderLight flex flex-col justify-end p-6 sm:p-8 luxury-card-hover animate-fade-in-up ${
                idx === 0 ? 'delay-50' : idx === 1 ? 'delay-100' : idx === 2 ? 'delay-150' : 'delay-200'
              }`}
            >
              <Image
                src={type.imageUrl}
                alt={type.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/95 via-forest-dark/50 to-transparent" />

              <div className="relative z-10 space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold text-forest-dark shadow-xs">
                  {type.tag}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-warmwhite group-hover:text-gold-light transition-colors">
                  {type.title}
                </h3>
                <p className="text-xs sm:text-sm text-warmwhite/80 line-clamp-2 max-w-md">
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

        {/* Supporting Categories Strip */}
        <div className="pt-6 border-t border-borderLight">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-forest">
                Koleksi Lengkap Jahitan Tekstil Kilang
              </h4>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-0.5">
                Pilihan bantal gebu, selimut patchwork, set bayi, sarung kusyen &amp; tempahan pukal
              </p>
            </div>
            <Link
              href="/collections/tilam-toto"
              className="text-xs font-semibold text-gold-dark hover:text-forest flex items-center space-x-1 transition-colors"
            >
              <span>Semua Produk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-3 sm:gap-3.5">
            {supportingCategories.map((cat, idx) => (
              <Link
                key={idx}
                href={cat.link}
                className={`group relative rounded-xl overflow-hidden bg-cream border border-borderLight shadow-subtle hover:shadow-card transition-all luxury-card-hover animate-fade-in-up ${
                  idx === 0 ? 'delay-100' : idx === 1 ? 'delay-150' : idx === 2 ? 'delay-200' : 'delay-250'
                }`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-transparent to-transparent" />
                </div>
                <div className="p-3 bg-warmwhite">
                  <h5 className="font-serif text-xs sm:text-sm font-bold text-charcoal group-hover:text-forest transition-colors truncate">
                    {cat.name}
                  </h5>
                  <p className="text-[10px] text-charcoal-muted mt-0.5 truncate">
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
