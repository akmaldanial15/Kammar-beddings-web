'use client'

import React, { useState } from 'react'
import { Search, ChevronDown, MessageSquare, Phone, Factory, Package, Truck, ShieldCheck, CreditCard } from 'lucide-react'
import Link from 'next/link'

interface FaqItem {
  id: string
  category: string
  question: string
  answer: string
}

const FAQ_LIST: FaqItem[] = [
  {
    id: 'f-1',
    category: 'Produk & Bahan',
    question: 'Apakah kelebihan Tilam Toto berisian Asian Polyester Fibre?',
    answer:
      'Isian 100% Asian Polyester Fibre keluaran kilang kami sangat padat, anjal (high resilience), empuk dan tidak mudah kemek atau leper walau digulung berulang kali. Sarung luarnya diperbuat daripada kain kapas mikrofiber sejuk dengan pelbagai corak floral menarik, dilengkapi zip keliling tahan lasak agar mudah ditanggalkan untuk dibasuh mesin.',
  },
  {
    id: 'f-2',
    category: 'Produk & Bahan',
    question: 'Adakah tilam dan bantal kekabu KAMAAR menggunakan 100% kekabu asli?',
    answer:
      'Ya! Kami menggunakan 100% serat kekabu asli gred terpilih yang diproses bersih tanpa campuran habuk. Tilam kekabu tradisi dijahit sulam butang (tufted) kemas untuk mengekalkan bentuk gebu dan sejuk semulajadi, sangat selesa untuk mereka yang menghargai tilam tradisi Melayu.',
  },
  {
    id: 'f-3',
    category: 'Tempahan Borong & Asrama',
    question: 'Bolehkah saya membuat tempahan borong untuk asrama sekolah atau kolej?',
    answer:
      'Boleh dan dialu-alukan! Tunas Sinar Jaya Enterprise berpengalaman luas membekalkan tilam bujang asrama standard (saiz 3 kaki x 6 kaki / 90cm x 190cm) dengan ketebalan 4 hingga 6 inci untuk sekolah berasrama penuh, MRSM, SBP, pusat tahfiz, dan kolej latihan di seluruh Malaysia.',
  },
  {
    id: 'f-4',
    category: 'Penghantaran & Pengambilan',
    question: 'Bagaimanakah penghantaran dilakukan? Bolehkah ambil sendiri di kilang?',
    answer:
      'Untuk pesanan runcit online, kami menghantar ke seluruh Semenanjung dan Sabah/Sarawak menggunakan kurier pantas berinsurans. Untuk tempahan pukal/borong, kami menggunakan khidmat lori kilang Tunas Sinar Jaya. Anda juga boleh datang sendiri (Self-Pickup) di gudang kilang kami di Tasek Gelugor, Pulau Pinang.',
  },
  {
    id: 'f-5',
    category: 'OEM & Tender Kerajaan',
    question: 'Adakah Tunas Sinar Jaya menerima tempahan tender kerajaan atau OEM jenama sendiri?',
    answer:
      'Ya! Tunas Sinar Jaya Enterprise (No. Pendaftaran: PG 0244795-A) memiliki 4 unit operasi lengkap termasuk Unit Jahitan Industri dan Unit Tilam & Bantal. Kami menerima tender kerajaan (ePerolehan), pesanan tempatan (LO), serta jahitan pukal OEM untuk pemilik jenama tekstil.',
  },
  {
    id: 'f-6',
    category: 'Penjagaan & Jaminan',
    question: 'Bagaimanakah cara menjaga dan membasuh Tilam Toto KAMAAR?',
    answer:
      'Sangat mudah! Buka zip keliling dan tanggalkan sarung fabrik cotton untuk dibasuh menggunakan mesin basuh dengan kitaran lembut. Bahagian teras isian fibre boleh dijemur di bawah cahaya matahari pagi selama 1-2 jam untuk menggebukan kembali serat dan menyahbau secara semulajadi.',
  },
  {
    id: 'f-7',
    category: 'Pembayaran',
    question: 'Apakah kaedah pembayaran yang disokong di laman web ini?',
    answer:
      'Kami menyokong pembayaran dalam talian melalui FPX Online Banking (Maybank, CIMB, Bank Islam, RHB, Public Bank, dll.), Touch \'n Go eWallet, dan kad debit/kredit melalui gerbang pembayaran selamat.',
  },
]

export function FaqClient() {
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('Semua')
  const [openId, setOpenId] = useState<string | null>('f-1')

  const categories = [
    'Semua',
    'Produk & Bahan',
    'Tempahan Borong & Asrama',
    'Penghantaran & Pengambilan',
    'OEM & Tender Kerajaan',
    'Penjagaan & Jaminan',
    'Pembayaran',
  ]

  const filtered = FAQ_LIST.filter((item) => {
    const matchesCat = selectedCat === 'Semua' || item.category === selectedCat
    const matchesSearch =
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto">
        <Search className="w-5 h-5 text-secondary absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cari soalan, produk toto, kekabu, asrama..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-warmwhite border border-borderLight text-xs md:text-sm focus:outline-none focus:border-forest text-forest-dark placeholder-charcoal-muted shadow-xs"
        />
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCat(c)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCat === c
                ? 'bg-forest text-warmwhite shadow-sm'
                : 'bg-warmwhite text-secondary hover:bg-cream border border-borderLight'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-secondary text-xs">
            Tiada soalan ditemui untuk carian &ldquo;{search}&rdquo;. Sila hubungi kami terus.
          </div>
        ) : (
          filtered.map((item) => {
            const isOpen = openId === item.id
            return (
              <div
                key={item.id}
                className="bg-warmwhite rounded-2xl border border-borderLight overflow-hidden transition-colors hover:border-gold/40 shadow-xs"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-serif font-bold text-base sm:text-lg text-forest-dark">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gold-dark flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-forest' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-secondary leading-relaxed border-t border-borderLight/60 bg-cream/20">
                    {item.answer}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Direct Contact Prompt */}
      <div className="bg-forest-dark text-warmwhite p-8 rounded-3xl text-center space-y-4 shadow-md max-w-2xl mx-auto">
        <Factory className="w-10 h-10 text-gold mx-auto" />
        <h3 className="font-serif text-2xl font-bold">Ada Pertanyaan Lain Mengenai Kilang Kami?</h3>
        <p className="text-xs sm:text-sm text-warmwhite/80 max-w-lg mx-auto">
          Hubungi terus Pengurus Kilang Tunas Sinar Jaya Enterprise atau kunjungi premis kami di Tasek Gelugor, Pulau Pinang.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <a
            href="https://wa.me/60194786991?text=Salam%20Tunas%20Sinar%20Jaya,%20saya%20ada%20pertanyaan%20mengenai%20produk%20dan%20tempahan."
            target="_blank"
            rel="noreferrer"
            className="px-6 py-2.5 bg-gold text-forest-dark rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gold-light transition-colors flex items-center gap-2 shadow-sm"
          >
            <Phone className="w-4 h-4" />
            <span>WhatsApp 019-478 6991</span>
          </a>
          <Link
            href="/profil"
            className="px-6 py-2.5 bg-warmwhite/10 hover:bg-warmwhite/20 text-warmwhite rounded-xl text-xs font-bold uppercase tracking-wider border border-warmwhite/20 transition-colors"
          >
            Lihat Profil Syarikat &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}
