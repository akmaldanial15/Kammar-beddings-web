'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, Scissors, Layers, Package, ArrowRight, Award } from 'lucide-react'

export function MaterialAnatomy() {
  const [activeUnit, setActiveUnit] = useState(0)

  const units = [
    {
      title: 'Unit Potong Kain',
      phase: 'Fasa 1: Penyediaan Fabrik',
      role: 'Pemotongan Presisi & Kawalan Saiz',
      description: 'Tenaga kerja membentang gulungan fabrik tekstil dan memotong mengikut pola piawaian menggunakan mesin pemotong industri untuk menjamin ketepatan saiz tilam toto dan cadar.',
      icon: Scissors,
      stats: '100% Ukuran Tepat',
      imageUrl: '/images/company/unit-potong-kain.jpg',
    },
    {
      title: 'Unit Jahitan Industri',
      phase: 'Fasa 2: Jahitan & Kemasan',
      role: 'Jahitan Rapi & Kelim Tahan Lasak',
      description: 'Barisan mesin jahit industri yang dikendalikan tukang jahit mahir tempatan bagi menjahit sarung, tepi piping kukuh serta sulaman quilting corak yang teguh dan kemas.',
      icon: Layers,
      stats: 'Jahitan Gred Industri',
      imageUrl: '/images/company/unit-jahitan.jpg',
    },
    {
      title: 'Unit Bantal & Tilam',
      phase: 'Fasa 3: Isian & Quilting',
      role: 'Asian Polyester Fibre Berkualiti Tinggi',
      description: 'Pemasangan isian Asian Polyester Fibre bermutu tinggi ke dalam tilam toto dan bantal. Serat berketumpatan optimum yang memberikan keempukan selesa tanpa mudah mendap.',
      icon: Sparkles,
      stats: 'Asian Polyester Fibre',
      imageUrl: '/images/company/unit-bantal-tilam.jpg',
    },
    {
      title: 'Stor Produk Siap & QC',
      phase: 'Fasa 4: QC & Pembungkusan',
      role: 'Pemeriksaan Mutu & Kawalan Stok',
      description: 'Setiap produk melalui pemeriksaan kawalan kualiti (QC) rapi sebelum dimasukkan ke dalam pembungkusan kedap udara/plastik tahan debu untuk edaran terus ke pelanggan dan pemborong.',
      icon: Package,
      stats: 'QC 100% Lulus',
      imageUrl: '/images/company/unit-stor-siap.jpg',
    },
  ]

  return (
    <section className="py-16 sm:py-24 bg-warmwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gold-dark flex items-center justify-center space-x-1.5 mb-2">
            <Award className="w-3.5 h-3.5 text-gold" />
            <span>Fasiliti Pengilangan Tekstil Bumiputera</span>
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest">
            Aktiviti Pengilangan Produk
          </h2>
          <p className="text-sm sm:text-base text-charcoal-muted mt-3 leading-relaxed">
            TUNAS SINAR JAYA ENTERPRISE mengamalkan proses pengeluaran sistematik dari pemotongan kain, jahitan quilting kemas, isian serat berkualiti sehinggalah ke stor simpanan produk siap.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Interactive Unit Selectors */}
          <div className="lg:col-span-5 space-y-3">
            {units.map((unit, idx) => {
              const Icon = unit.icon
              const isSelected = activeUnit === idx
              return (
                <div
                  key={idx}
                  onClick={() => setActiveUnit(idx)}
                  className={`p-4 sm:p-5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cream border-forest shadow-card'
                      : 'bg-warmwhite border-borderLight hover:bg-cream-light hover:border-gold'
                  }`}
                >
                  <div className="flex items-start space-x-3.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected ? 'bg-forest text-gold' : 'bg-cream text-charcoal-muted'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark">
                          {unit.phase}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-charcoal mt-0.5">
                        {unit.title}
                      </h4>
                      <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                        {unit.role}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right: Detailed Unit Visual Showcase with real factory photo */}
          <div className="lg:col-span-7 bg-cream-light rounded-2xl border border-borderLight p-6 sm:p-8 flex flex-col justify-between shadow-card">
            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-cream border border-borderLight mb-6">
              <Image
                src={units[activeUnit].imageUrl}
                alt={units[activeUnit].title}
                fill
                className="object-cover transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/85 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-warmwhite">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold text-forest-dark">
                  Unit Operasi: #{activeUnit + 1}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold mt-1 text-white">
                  {units[activeUnit].title}
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-forest">
                Peranan &amp; Piawaian Kualiti Kilang
              </h4>
              <p className="text-sm text-charcoal-muted leading-relaxed">
                {units[activeUnit].description}
              </p>

              <div className="pt-4 border-t border-borderLight grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-warmwhite rounded-lg border border-borderLight">
                  <span className="text-xs sm:text-sm font-bold text-forest block">100% Buatan</span>
                  <span className="text-[10px] text-charcoal-muted uppercase">Bumiputera</span>
                </div>
                <div className="p-3 bg-warmwhite rounded-lg border border-borderLight">
                  <span className="text-xs sm:text-sm font-bold text-forest block">Harga Kilang</span>
                  <span className="text-[10px] text-charcoal-muted uppercase">Tanpa Ejen</span>
                </div>
                <div className="p-3 bg-warmwhite rounded-lg border border-borderLight">
                  <span className="text-xs sm:text-sm font-bold text-forest block">QC Ketat</span>
                  <span className="text-[10px] text-charcoal-muted uppercase">Kualiti Jahitan</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  href="/profil"
                  className="text-xs font-bold text-forest hover:text-gold flex items-center space-x-1"
                >
                  <span>Ketahui Lebih Lanjut Profil Kilang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
