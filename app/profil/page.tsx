import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Building2,
  Target,
  Eye,
  Users,
  Scissors,
  Package,
  Layers,
  Truck,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  Sparkles,
  ChevronRight,
  ExternalLink,
  ShoppingBag,
  CheckCircle2,
  Store,
  Factory,
  BadgePercent,
  HeartHandshake,
  ArrowUpRight,
} from 'lucide-react'

import { getWebsiteConfig } from '@/lib/db'
import { initialWebsiteConfig } from '@/lib/db/seedData'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Profil Syarikat | TUNAS SINAR JAYA ENTERPRISE (KAMAAR BEDDINGS)',
  description:
    'Profil rasmi Tunas Sinar Jaya Enterprise (Kamaar Beddings) - Pengeluar tekstil Bumiputera terkemuka di Tasek Gelugor, Pulau Pinang. Menghasilkan Tilam Toto, Tilam Lipat, Bantal dan Kelengkapan Bilik Tidur berkualiti tinggi.',
}

const factoryUnits = [
  {
    name: 'Unit Potong Kain',
    description: 'Proses pemotongan fabrik tekstil dengan mesin berketepatan tinggi untuk memastikan ukuran seragam dan jimat bahan.',
    badge: 'Fasa 1: Penyediaan Fabrik',
    icon: Scissors,
    image: '/images/company/unit-potong-kain.jpg',
  },
  {
    name: 'Unit Jahitan',
    description: 'Barisan mesin jahit industri yang dikendalikan tenaga kerja mahir tempatan bagi menghasilkan jahitan yang kemas, kukuh dan rapi.',
    badge: 'Fasa 2: Jahitan & Kemasan',
    icon: Layers,
    image: '/images/company/unit-jahitan.jpg',
  },
  {
    name: 'Unit Bantal & Tilam',
    description: 'Pemasangan isian Asian Polyester Fibre bermutu tinggi, pembentukan tilam toto empuk, tilam lipat serta bantal tidur gebu.',
    badge: 'Fasa 3: Isian & Quilting',
    icon: Sparkles,
    image: '/images/company/unit-bantal-tilam.jpg',
  },
  {
    name: 'Stor Produk Siap',
    description: 'Gudang penyimpanan sistematik dengan kawalan kualiti (QC) ketat sebelum pembungkusan dan pengedaran ke seluruh Malaysia.',
    badge: 'Fasa 4: QC & Logistik',
    icon: Package,
    image: '/images/company/unit-stor-siap.jpg',
  },
]

const orgStructure = {
  leader: {
    title: 'Pengurus Operasi',
    name: 'HAZIZI MD RASHID',
    role: 'Menerajui pengurusan keseluruhan operasi kilang dan perancangan strategik syarikat.',
  },
  departments: [
    {
      dept: 'Bahagian Pentadbiran',
      head: 'HEZWAN MD RASHID',
      scopes: ['Pengurusan Pejabat', 'Kewangan & Perakaunan', 'Sumber Manusia (HR)'],
      color: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      dept: 'Bahagian Pembelian',
      head: 'ELIAS MAT RASHID',
      scopes: ['Pembelian Bahan Mentah', 'Pengurusan Pembekal Tekstil', 'Kawalan Kos Bahan'],
      color: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      dept: 'Bahagian Pengeluaran',
      head: 'CHE JAM DARUS',
      scopes: ['Pemotongan', 'Jahitan Industri', 'Quilting', 'Pembungkusan', 'Kawalan Mutu (QC)'],
      color: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      dept: 'Bahagian Pemasaran',
      head: 'YAHYA BIN ISHAK',
      scopes: ['Pemasaran & Promosi', 'Jualan Gudang & Runcit', 'Khidmat Pelanggan'],
      color: 'bg-purple-50 text-purple-800 border-purple-200',
    },
    {
      dept: 'Bahagian Logistik',
      head: 'ZUKI MUSA',
      scopes: ['Stor & Inventori', 'Kawalan Stok Siap', 'Penghantaran & Logistik'],
      color: 'bg-orange-50 text-orange-800 border-orange-200',
    },
  ],
}

const companyPillars = [
  {
    num: '01',
    title: 'Kualiti Terjamin',
    desc: 'Penggunaan bahan mentah bermutu tinggi dan pemantauan kualiti ketat di setiap stesen.',
    badge: '100% Kawalan QC',
    highlight: 'Bahan Premium & Tahan Lasak',
    icon: ShieldCheck,
    iconBg: 'bg-blue-50 text-blue-700 border-blue-200/80',
    accentGradient: 'from-blue-600 via-sky-500 to-blue-700',
  },
  {
    num: '02',
    title: 'Pengeluaran Cekap',
    desc: 'Operasi kilang sistematik yang mampu memenuhi tempahan pukal mahupun individu dengan pantas.',
    badge: 'Skala Industri',
    highlight: 'Kapasiti Harian Tinggi',
    icon: Factory,
    iconBg: 'bg-forest/10 text-forest border-forest/20',
    accentGradient: 'from-[#1E4E8C] via-[#153D73] to-[#13325B]',
  },
  {
    num: '03',
    title: 'Harga Berpatutan',
    desc: 'Harga terus dari kilang tanpa orang tengah untuk penjimatan maksimum setiap pelanggan.',
    badge: 'Terus Dari Kilang',
    highlight: 'Tiada Markup Ejen',
    icon: BadgePercent,
    iconBg: 'bg-amber-50 text-amber-700 border-amber-200/80',
    accentGradient: 'from-gold-dark via-gold to-amber-500',
  },
  {
    num: '04',
    title: 'Komitmen Pelanggan',
    desc: 'Khidmat layanan mesra dan jaminan kepuasan pelanggan adalah tunjang perniagaan kami.',
    badge: 'Layanan Mesra',
    highlight: 'Jaminan Kepuasan Penuh',
    icon: HeartHandshake,
    iconBg: 'bg-rose-50 text-rose-700 border-rose-200/80',
    accentGradient: 'from-rose-600 via-amber-600 to-rose-700',
  },
]

export default async function ProfilPage() {
  const config = await getWebsiteConfig().catch(() => initialWebsiteConfig)
  const profile = config.companyProfile || initialWebsiteConfig.companyProfile!
  const hero = profile.hero
  const about = profile.about
  const facility = profile.facility
  const visionMission = profile.visionMission

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2A26] font-sans antialiased selection:bg-gold/20 selection:text-forest">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1E4E8C] via-[#153D73] to-[#0F2D54] text-white pt-16 sm:pt-20 pb-24 sm:pb-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold-light text-xs font-semibold tracking-wide uppercase">
                <Building2 className="w-4 h-4 text-gold" />
                <span>{hero.badge}</span>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-bold tracking-[0.2em] uppercase text-sky-300 block">
                  {hero.companyName}
                </span>
                <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-warmwhite leading-tight">
                  {hero.brandTitle}
                </h1>
                <p className="text-gold italic text-lg sm:text-xl font-serif">
                  {hero.slogan}
                </p>
              </div>

              <p className="text-warmwhite/80 text-sm sm:text-base leading-relaxed max-w-2xl">
                {hero.description}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="#tentang-kami"
                  className="px-6 py-3 rounded-xl bg-gold hover:bg-gold-light text-forest font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  Tentang Kilang Kami
                </a>
                <a
                  href="#carta-organisasi"
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-warmwhite border border-white/20 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Carta Organisasi
                </a>
                <Link
                  href="/collections/tilam-toto"
                  className="px-6 py-3 rounded-xl bg-forest hover:bg-forest-light text-warmwhite font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Lihat Produk Kilang</span>
                </Link>
              </div>

              {/* Slogan Banner */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-warmwhite/70">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-gold" />
                  Kualiti Jahitan, Kepuasan Terjamin
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-4 h-4 text-gold" />
                  Menjahit Kepercayaan, Menyulam Masa Depan
                </span>
              </div>
            </div>

            {/* Right: Featured Banner Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border-2 border-gold/30 shadow-2xl bg-white/5 backdrop-blur-sm group">
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={hero.featuredImageUrl || '/images/hero/hero-tilam-toto-lifestyle.jpg'}
                    alt={hero.featuredTitle}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-[11px] font-bold tracking-widest uppercase text-gold">
                    {hero.featuredBadge}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-warmwhite">
                    {hero.featuredTitle}
                  </h3>
                  <p className="text-xs text-warmwhite/80 mt-1">
                    {hero.featuredSubtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Section - Floating Modern Deck */}
      <section className="relative z-20 -mt-14 sm:-mt-20 lg:-mt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10 sm:mb-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {companyPillars.map((p) => {
            const Icon = p.icon
            return (
              <div
                key={p.num}
                className="group relative bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-[#E8E2D8]/90 hover:border-gold/60 shadow-[0_12px_30px_-8px_rgba(19,50,91,0.1),0_4px_6px_-2px_rgba(19,50,91,0.03)] hover:shadow-[0_22px_45px_-10px_rgba(212,175,55,0.25)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Top Glowing Gradient Accent Bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${p.accentGradient} opacity-70 group-hover:opacity-100 transition-opacity duration-300`}
                />

                {/* Subtle Ambient Radial Glow on hover */}
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-gold/10 rounded-full blur-2xl group-hover:bg-gold/20 transition-all duration-500 pointer-events-none" />

                <div>
                  {/* Top Bar: Serif Number + Styled Icon Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-br from-gold-dark via-gold to-amber-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform origin-left">
                      {p.num}
                    </span>
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs transition-all duration-300 group-hover:scale-110 group-hover:shadow-md ${p.iconBg}`}
                    >
                      <Icon className="w-5 h-5 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Micro Pill Badge */}
                  <div className="mb-2.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FAF7F2] text-forest/75 border border-[#E8E2D8] group-hover:border-gold/50 group-hover:bg-gold/10 group-hover:text-forest transition-all">
                      <Sparkles className="w-3 h-3 text-gold" />
                      {p.badge}
                    </span>
                  </div>

                  {/* Pillar Title */}
                  <h3 className="font-serif text-lg font-bold text-forest group-hover:text-gold-dark transition-colors tracking-tight mb-2">
                    {p.title}
                  </h3>

                  {/* Pillar Description */}
                  <p className="text-xs sm:text-[13px] text-charcoal-muted leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                {/* Bottom Highlight Feature / Trust Footnote */}
                <div className="mt-5 pt-3.5 border-t border-[#F2ECE1] flex items-center justify-between text-[11px] font-semibold text-forest/80 group-hover:text-forest transition-colors">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-forest group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span>{p.highlight}</span>
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gold opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Tentang Kami & Aktiviti Pengilangan */}
      <section id="tentang-kami" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-dark block">
                {about.badge}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest leading-tight">
                {about.title}
              </h2>
              <div className="w-16 h-1 bg-gold rounded-full" />
            </div>

            <div className="prose prose-sm text-charcoal-muted leading-relaxed space-y-4">
              {about.paragraphs.map((p, idx) => (
                <p key={idx} className="whitespace-pre-line leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            {/* Moto Box */}
            <div className="p-5 rounded-2xl bg-forest text-warmwhite border border-gold/30 space-y-1 shadow-md">
              <span className="text-[11px] font-bold uppercase tracking-widest text-gold block">
                {about.motoBadge}
              </span>
              <blockquote className="font-serif text-lg font-bold italic text-gold-light">
                {about.motoText}
              </blockquote>
            </div>
          </div>

          {/* Right Image Feature */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-3xl overflow-hidden border border-[#E8E2D8] shadow-lg bg-white">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={facility.imageUrl || '/images/company/hadapan-kilang.jpg'}
                  alt={facility.title || 'Premis Kilang'}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5 bg-white border-t border-[#E8E2D8]">
                <span className="text-xs font-bold uppercase tracking-wider text-gold-dark block">
                  {facility.badge}
                </span>
                <h4 className="font-serif text-base font-bold text-forest">
                  {facility.title}
                </h4>
                <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                  {facility.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Factory Units Grid */}
        <div className="mt-16 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-dark">
              Infrastruktur Pengeluaran
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
              4 Unit Pengilangan Produk Tekstil
            </h3>
            <p className="text-xs text-charcoal-muted">
              Setiap proses pengeluaran dijalankan mengikut piawaian ketat dari fabrik asas hingga produk siap dibungkus.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {factoryUnits.map((u, i) => {
              const Icon = u.icon
              return (
                <div
                  key={u.name}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E8E2D8] hover:border-forest/40 hover:shadow-lg transition-all space-y-0 group flex flex-col"
                >
                  <div className="relative aspect-[4/3] w-full bg-cream overflow-hidden">
                    <Image
                      src={u.image}
                      alt={u.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-forest/85 backdrop-blur-xs text-gold flex items-center justify-center shadow">
                      <Icon className="w-4 h-4 text-gold" />
                    </div>
                  </div>
                  <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cream text-forest border border-borderLight inline-block mb-1.5">
                        {u.badge}
                      </span>
                      <h4 className="font-bold text-forest text-base">{u.name}</h4>
                    </div>
                    <p className="text-xs text-charcoal-muted leading-relaxed">{u.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Visi & Misi Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[#1E4E8C] via-[#153D73] to-[#0F2D54] text-white border-y border-gold/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Mission & Vision */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/15 text-gold-light text-xs font-semibold uppercase">
                  <Target className="w-4 h-4 text-gold" />
                  <span>{visionMission.badge}</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-warmwhite">
                  {visionMission.title}
                </h2>
              </div>

              {/* Misi Box */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center space-x-2 text-gold font-bold text-sm uppercase tracking-wider">
                  <Target className="w-5 h-5 text-gold" />
                  <span>{visionMission.missionTitle}</span>
                </div>
                <p className="font-serif text-lg sm:text-xl text-warmwhite leading-relaxed">
                  {visionMission.missionText}
                </p>
              </div>

              {/* Visi 5 Teras */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gold font-bold text-sm uppercase tracking-wider">
                  <Eye className="w-5 h-5 text-gold" />
                  <span>{visionMission.visionTitle}</span>
                </div>

                <div className="space-y-2.5">
                  {visionMission.visionPoints.map((visi, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-3 p-3 rounded-xl bg-white/5 border border-white/5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-warmwhite/90 leading-relaxed">
                        {visi}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Jualan Gudang Photo */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border-2 border-gold/40 shadow-2xl bg-black/40">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={visionMission.eventImageUrl || '/images/company/misi-visi-jualan-gudang.jpg'}
                    alt={visionMission.eventTitle}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5 bg-gradient-to-t from-black via-black/80 to-transparent absolute bottom-0 inset-x-0">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-widest block">
                    {visionMission.eventBadge}
                  </span>
                  <h4 className="font-serif text-base font-bold text-warmwhite">
                    {visionMission.eventTitle}
                  </h4>
                  <p className="text-xs text-warmwhite/70 mt-1">
                    {visionMission.eventSubtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carta Organisasi Section */}
      <section id="carta-organisasi" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cream text-forest text-xs font-semibold uppercase border border-borderLight">
            <Users className="w-4 h-4 text-gold" />
            <span>Kepimpinan &amp; Pengurusan</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest">
            Carta Organisasi Kilang
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
            Struktur pengurusan profesional dan bahagian operasi kilang Tunas Sinar Jaya Enterprise yang memastikan setiap pesanan disiapkan dengan mutu terbaik.
          </p>
        </div>

        {/* Team Photo Banner */}
        <div className="mb-12 relative rounded-3xl overflow-hidden border border-[#E8E2D8] shadow-md bg-white">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full max-h-[420px]">
            <Image
              src="/images/company/carta-organisasi-kilang.jpg"
              alt="Pasukan Pengurusan dan Kakitangan Tunas Sinar Jaya Enterprise / Kamaar Beddings"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="p-4 sm:p-5 bg-white border-t border-[#E8E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-bold text-forest text-sm sm:text-base">
                Warga Kerja Tunas Sinar Jaya Enterprise (KAMAAR BEDDINGS)
              </h4>
              <p className="text-xs text-charcoal-muted">
                Bergambar di hadapan premis kilang &amp; stor simpanan utama di Tasek Gelugor, Pulau Pinang.
              </p>
            </div>
            <span className="text-xs font-bold text-gold-dark shrink-0">
              Tenaga Mahir Bumiputera 100%
            </span>
          </div>
        </div>

        {/* Organogram Chart */}
        <div className="space-y-8">
          {/* Top Leader */}
          <div className="flex justify-center">
            <div className="w-full max-w-md p-6 rounded-2xl bg-forest text-warmwhite border-2 border-gold text-center shadow-lg space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-gold block">
                {orgStructure.leader.title}
              </span>
              <h3 className="font-serif text-2xl font-bold tracking-wide text-warmwhite">
                {orgStructure.leader.name}
              </h3>
              <p className="text-xs text-warmwhite/80 pt-1 leading-relaxed">
                {orgStructure.leader.role}
              </p>
            </div>
          </div>

          {/* Connecting Line */}
          <div className="flex justify-center">
            <div className="w-0.5 h-8 bg-forest/30" />
          </div>

          {/* 5 Departments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {orgStructure.departments.map((d) => (
              <div
                key={d.dept}
                className="p-5 rounded-2xl bg-white border border-[#E8E2D8] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
                    Bahagian
                  </span>
                  <h4 className="font-bold text-forest text-sm">{d.dept}</h4>
                  <div className="pt-2 border-t border-neutral-100">
                    <span className="text-[10px] text-charcoal-muted block">Ketua Bahagian:</span>
                    <strong className="text-xs text-forest block font-serif tracking-wide">
                      {d.head}
                    </strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100 space-y-1.5">
                  <span className="text-[10px] font-bold text-charcoal-muted uppercase block">
                    Skop Tanggungjawab:
                  </span>
                  <ul className="space-y-1">
                    {d.scopes.map((s, idx) => (
                      <li key={idx} className="text-[11px] text-charcoal-muted flex items-start space-x-1.5">
                        <span className="text-gold font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeri Fasiliti Kilang & Stor Bahan Mentah */}
      <section className="py-16 sm:py-20 bg-[#FAF7F2] border-t border-[#E8E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-dark">
              Gambar Sebenar Kilang
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
              Fasiliti Pengilangan &amp; Stor Bahan Mentah
            </h3>
            <p className="text-xs text-charcoal-muted">
              Gambar sebenar dari lantai operasi kilang Tunas Sinar Jaya Enterprise di Tasek Gelugor, Pulau Pinang.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Hadapan Kilang */}
            <div className="bg-white rounded-2xl overflow-hidden border border-[#E8E2D8] shadow-2xs group">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/images/company/hadapan-kilang.jpg"
                  alt="Hadapan Kilang Tasek Gelugor"
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark block">Premis Kilang</span>
                <h5 className="font-bold text-forest text-sm">Hadapan Kilang &amp; Stor</h5>
                <p className="text-[11px] text-charcoal-muted">Premis operasi di Permatang Berangan, Tasek Gelugor.</p>
              </div>
            </div>

            {/* 2. Ruang Dalam Kilang */}
            <div className="bg-white rounded-2xl overflow-hidden border border-[#E8E2D8] shadow-2xs group">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/images/company/dalam-kilang-1.jpg"
                  alt="Ruang Pengeluaran Dalam Kilang"
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark block">Pengeluaran</span>
                <h5 className="font-bold text-forest text-sm">Stesen Jahitan Industri</h5>
                <p className="text-[11px] text-charcoal-muted">Ruang jahitan kemas berhawa sejuk &amp; tersusun rapi.</p>
              </div>
            </div>

            {/* 3. Stor Kain & Fabrik */}
            <div className="bg-white rounded-2xl overflow-hidden border border-[#E8E2D8] shadow-2xs group">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/images/company/stor-kain.jpg"
                  alt="Stor Gulungan Kain & Fabrik"
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark block">Bahan Mentah</span>
                <h5 className="font-bold text-forest text-sm">Stor Gulungan Fabrik</h5>
                <p className="text-[11px] text-charcoal-muted">Stok fabrik pelbagai corak menarik Random &amp; Floral.</p>
              </div>
            </div>

            {/* 4. Stor Isian Batting */}
            <div className="bg-white rounded-2xl overflow-hidden border border-[#E8E2D8] shadow-2xs group">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/images/company/stor-polyester.jpg"
                  alt="Stor Isian Batting Polyester & Kekabu"
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark block">Isian Bermutu</span>
                <h5 className="font-bold text-forest text-sm">Isian Polyester Fibre</h5>
                <p className="text-[11px] text-charcoal-muted">Bungkusan batting poliester gebu Gred A untuk tilam toto.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Maklumat Hubungi & Lokasi Kilang */}
      <section className="py-16 sm:py-20 bg-white border-t border-[#E8E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FAF7F2] rounded-3xl p-8 sm:p-12 border border-[#E8E2D8] shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-gold-dark block">
                    Hubungi Kilang
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
                    TUNAS SINAR JAYA ENTERPRISE
                  </h3>
                  <p className="text-xs text-charcoal-muted">
                    Sedia melayani pertanyaan pembelian runcit, tempahan jualan gudang, mahupun tender borong asrama &amp; institusi.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-forest block">Alamat Kilang &amp; Stor:</strong>
                      <span className="text-charcoal-muted leading-relaxed">
                        7878B Jalan Permatang Berangan, 13300 Tasek Gelugor SPU, Pulau Pinang
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gold shrink-0" />
                    <div>
                      <strong className="text-forest block">Telefon / WhatsApp:</strong>
                      <a href="tel:0194786991" className="text-forest hover:text-gold font-bold">
                        019-478 6991 / 04-573 6991
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gold shrink-0" />
                    <div>
                      <strong className="text-forest block">Alamat Emel:</strong>
                      <a href="mailto:tunassinar@gmail.com" className="text-forest hover:text-gold">
                        tunassinar@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Social media */}
                <div className="pt-4 border-t border-[#E8E2D8] space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-muted block">
                    Saluran Media Sosial Rasmi
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#D5CEC2] hover:border-forest text-forest font-semibold"
                    >
                      Facebook: Jualan Gudang
                    </a>
                    <a
                      href="https://tiktok.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#D5CEC2] hover:border-forest text-forest font-semibold"
                    >
                      TikTok: @KAMAAR_SHOP
                    </a>
                  </div>
                </div>
              </div>

              {/* Payment & Order CTA */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E2D8] flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4 text-forest" />
                    <span>Kaedah Pembayaran Sahaja: FPX &amp; Touch &apos;n Go</span>
                  </div>

                  <h4 className="font-serif text-xl font-bold text-forest">
                    Urus Niaga Selamat Melalui Perbankan Tempatan
                  </h4>

                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    Bagi memastikan keselamatan setiap transaksi dan kemudahan pelanggan, jualan rasmi KAMAAR Beddings hanya menerima transaksi secara <strong>FPX (Online Banking semua bank Malaysia)</strong> dan <strong>Touch &apos;n Go (TNG) eWallet</strong>.
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    {/* FPX Logo Badge */}
                    <div
                      className="h-9 px-3 bg-white rounded-xl flex items-center justify-center border border-[#E8E2D8] shadow-xs hover:border-gold/50 transition-colors"
                      title="FPX Online Banking"
                    >
                      <Image
                        src="/images/payments/fpx.svg"
                        alt="FPX Online Banking"
                        width={60}
                        height={20}
                        className="h-5 w-auto object-contain"
                      />
                    </div>

                    {/* Touch 'n Go eWallet Logo Badge */}
                    <div
                      className="h-9 px-3 bg-white rounded-xl flex items-center justify-center gap-2 border border-[#E8E2D8] shadow-xs hover:border-gold/50 transition-colors"
                      title="Touch 'n Go eWallet"
                    >
                      <Image
                        src="/images/payments/tng-ewallet.svg"
                        alt="Touch 'n Go eWallet"
                        width={24}
                        height={24}
                        className="h-6 w-6 object-contain rounded-xs"
                      />
                      <span className="font-bold text-xs text-[#015CA9] font-sans tracking-tight">
                        Touch &apos;n Go <span className="font-medium text-slate-600 text-[11px]">eWallet</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-100 flex flex-wrap gap-3">
                  <Link
                    href="/collections/tilam-toto"
                    className="px-6 py-3.5 rounded-xl bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2"
                  >
                    <span>Tempah Tilam Toto Sekarang</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="https://wa.me/60194786991?text=Salam%20Tunas%20Sinar%20Jaya%2C%20saya%20berminat%20dengan%20produk%20Kamaar%20Beddings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2"
                  >
                    <span>WhatsApp Concierge (019-478 6991)</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
