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
      title: 'Tilam Toto Asian Polyester Fibre (Paling Lariss!!)',
      subtitle: 'Isian fiber berkualiti tinggi dengan Random Design pelbagai corak bunga & geometri. Empuk, tebal dan selesa untuk seisi keluarga.',
      tag: 'Paling Lariss!!',
      link: '/collections/tilam-toto',
      imageUrl: '/images/products/tilam-toto-queen.jpg',
    },
    {
      title: 'Tilam Lipat 3 & Bujang Asrama',
      subtitle: 'Tilam lipat mudah alih berzip dan tilam single 3 kaki asrama tahan lasak. Sangat praktikal, jimat ruang dan mudah disimpan.',
      tag: 'Jimat Ruang & Asrama',
      link: '/collections/tilam-lipat',
      imageUrl: '/images/products/tilam-lipat-bujang.jpg',
    },
    {
      title: 'Bantal Tidur Gebu & Bantal Peluk',
      subtitle: 'Isian Asian Polyester Fibre yang gebu, lembut dan tidak mudah kempis dari Unit Bantal & Tilam KAMAAR Beddings.',
      tag: 'Isian Fiber Berkualiti',
      link: '/collections/bantal',
      imageUrl: '/images/products/bantal-gebu-asian-fibre.jpg',
    },
    {
      title: 'Jualan Gudang & Pakej Borong Asrama',
      subtitle: 'Harga pengeluar terus dari kilang Tasek Gelugor untuk pembekal asrama, pusat tahfiz, homestay dan kontraktor.',
      tag: 'Harga Terus Dari Kilang',
      link: '/collections/borong-gudang',
      imageUrl: '/images/products/bantal-peluk-roll-pack.jpg',
    },
  ]

  const supportingCategories = [
    {
      name: 'Set Comforter Tebal Quilting',
      description: 'Jahitan quilting kemas & rapi',
      link: '/collections/cadang-comforter',
      imageUrl: '/images/hero/hero-tilam-toto-lifestyle.jpg',
    },
    {
      name: 'Sarung Tilam Toto Berzip',
      description: 'Kain kapas sejuk mudah dibasuh',
      link: '/collections/cadang-comforter',
      imageUrl: '/images/products/tilam-toto-queen.jpg',
    },
    {
      name: 'Pakej 10 Set Lengkap Asrama',
      description: 'Tilam, bantal & cadar sedondon',
      link: '/collections/borong-gudang',
      imageUrl: '/images/products/bantal-peluk-roll-pack.jpg',
    },
    {
      name: 'Profil Syarikat & 4 Unit Kilang',
      description: 'Tunas Sinar Jaya Enterprise',
      link: '/profil',
      imageUrl: '/images/company/carta-organisasi-kilang.jpg',
    },
  ]

  return (
    <section className="py-16 sm:py-24 bg-warmwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gold-dark flex items-center justify-center space-x-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Koleksi Pengeluaran Kilang Tekstil</span>
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest">
            Produk Paling Laris &amp; Pilihan Ramai
          </h2>
          <p className="text-sm sm:text-base text-charcoal-muted mt-3 leading-relaxed">
            Dihasilkan sendiri oleh tenaga kerja mahir tempatan Tunas Sinar Jaya Enterprise di Tasek Gelugor dengan mutu jahitan kemas dan harga terus kilang.
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
                  <span>Explore Series</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Supporting Categories Strip */}
        <div className="pt-6 border-t border-borderLight">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-serif text-xl sm:text-2xl font-bold text-forest">
              Complete Your Bedroom Sanctuary
            </h4>
            <Link
              href="/collections/mattress"
              className="text-xs font-semibold text-gold-dark hover:text-forest flex items-center space-x-1 transition-colors"
            >
              <span>View All Accessories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
                <div className="p-3.5 sm:p-4 bg-warmwhite">
                  <h5 className="font-serif text-sm sm:text-base font-bold text-charcoal group-hover:text-forest transition-colors truncate">
                    {cat.name}
                  </h5>
                  <p className="text-[11px] text-charcoal-muted mt-0.5 truncate">
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
