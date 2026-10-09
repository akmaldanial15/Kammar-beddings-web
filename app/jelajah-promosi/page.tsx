import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import {
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  Truck,
  ShieldCheck,
  Tag,
  Phone,
  Flame,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jelajah Promosi & Jualan Gudang | KAMAAR Beddings',
  description:
    'Kami bawakan pelbagai produk KAMAAR seperti bantal, tilam, selimut terus dari kilang Tasek Gelugor pada harga promosi istimewa di tempat anda!',
}

export default function JelajahPromosiPage() {
  const promosiLocations = [
    {
      state: 'Pulau Pinang & Kedah',
      venue: 'Gudang Utama & Tapak Promosi Tasek Gelugor',
      address: '7878B Jalan Permatang Berangan, 13300 Tasek Gelugor, Pulau Pinang',
      schedule: 'Setiap Hari (9:00 Pagi - 6:30 Petang)',
      status: 'Lokasi Tetap & Sedang Berlangsung',
      badge: 'GUDANG UTAMA',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      state: 'Perak',
      venue: 'Tapak Ekspo & Dewan Komuniti Jelajah Utara',
      address: 'Ipoh & Taiping, Perak',
      schedule: 'Hujung Minggu Ini (Jumaat - Ahad)',
      status: 'Pameran & Jualan Gudang',
      badge: 'AKAN DATANG',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      state: 'Lembah Klang & Selangor',
      venue: 'Karnival Tekstil & Jualan Terus Dari Kilang',
      address: 'Shah Alam & Bangi, Selangor',
      schedule: 'Pusingan Jelajah Akhir Bulan',
      status: 'Tempahan Awal Dibuka',
      badge: 'TERUS KE LOKASI ANDA',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    },
  ]

  const specialOfferItems = [
    {
      name: 'Toto Single (Poly)',
      size: '90 CM X 200 CM',
      normalPrice: 'RM34.90',
      promoPrice: 'RM29.90',
      material: 'Poly Fibre',
      image: '/images/products/toto-single-poly.png',
      badge: 'TAWARAN ISTIMEWA',
      link: '/products/toto-single-poly',
    },
    {
      name: 'Tilam Gulung A (TC)',
      size: '90 CM X 180 CM',
      normalPrice: 'RM45.00',
      promoPrice: 'RM39.90',
      material: 'TC Shoddy',
      image: '/images/products/tilam-gulung-a-tc.png',
      badge: 'HARGA KILANG',
      link: '/products/tilam-gulung-a-tc',
    },
    {
      name: 'Bantal Tidur Size M (TC)',
      size: '15 X 24 INCH',
      normalPrice: 'RM7.00',
      promoPrice: 'RM4.90',
      material: 'TC Shoddy',
      image: '/images/products/bantal-tidur-m-tc.png',
      badge: 'TERLAJAK JIMAT',
      link: '/products/bantal-m-tc',
    },
    {
      name: 'Bantal Tidur Size L (Poly)',
      size: '17 X 26 INCH',
      normalPrice: 'RM14.90',
      promoPrice: 'RM9.90',
      material: 'Poly Fibre Gebu',
      image: '/images/products/bantal-tidur-l-poly.png',
      badge: 'PALING LARIS',
      link: '/products/bantal-l-poly',
    },
    {
      name: 'Selimut Legend Size M',
      size: '60 X 80 INCH',
      normalPrice: 'RM19.90',
      promoPrice: 'RM14.90',
      material: 'Fabrik Berkualiti Kilang',
      image: '/images/products/selimut-legend-m.png',
      badge: 'SELESA & SEJUK',
      link: '/products/selimut-legend-m',
    },
    {
      name: 'Bantal Sofa Size 14x14',
      size: '14 X 14 INCH',
      normalPrice: 'RM14.90',
      promoPrice: 'RM9.90',
      material: 'Poly Fibre',
      image: '/images/products/bantal-sofa-14x14-poly.png',
      badge: 'KUSYEN COMEL',
      link: '/products/bantal-sofa-14x14',
    },
  ]

  return (
    <div className="bg-warmwhite min-h-screen">
      {/* 1. HERO BANNER */}
      <section className="relative bg-gradient-to-br from-[#13325B] via-[#1E4E8C] to-[#0A1E38] text-warmwhite py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image
            src="/images/promosi/PROMOSI 1.png"
            alt="Jelajah Promosi KAMAAR Beddings"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/20 border border-gold/40 text-gold-light text-xs font-bold uppercase tracking-widest shadow-sm">
            <Flame className="w-4 h-4 text-gold" />
            <span>KAMI KE TEMPAT ANDA</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Jelajah Promosi &amp; Jualan Gudang
          </h1>

          <p className="text-base sm:text-xl text-warmwhite/90 max-w-2xl mx-auto font-sans leading-relaxed">
            Kami bawakan pelbagai produk KAMAAR seperti bantal, tilam, selimut dan pelbagai produk berkualiti terus dari kilang, ditawarkan pada harga promosi istimewa di tempat anda.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-3 sm:gap-4">
            <a
              href="#lokasi"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold-light text-forest-dark font-bold rounded-xl shadow-lg transition-all"
            >
              <MapPin className="w-4 h-4" />
              <span>Lihat Lokasi &amp; Jadual</span>
            </a>
            <a
              href="https://wa.me/60194786991?text=Salam%20KAMAAR%20Beddings,%20saya%20ingin%20tanya%20tentang%20lokasi%20Jelajah%20Promosi%20terkini"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl shadow-lg transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp Khidmat Pelanggan</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. REAL ROADSHOW GALLERY */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-gold-dark font-bold">
            Suasana Sebenar Pameran
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-forest mt-1.5">
            Jualan Gudang Dibanjiri Pelanggan
          </h2>
          <p className="text-sm text-charcoal-muted mt-2">
            Ribuan keluarga dan pembeli borong berpusu-pusu memilih tilam toto, tilam gulung dan bantal gebu terus dari trak kilang kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative h-80 rounded-2xl overflow-hidden shadow-card border border-borderLight">
            <Image
              src="/images/promosi/PROMOSI 1.png"
              alt="Suasana Tapak Jualan Gudang KAMAAR"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-gold">Jelajah Promosi</span>
              <h3 className="font-serif text-lg font-bold">Lautan Pilihan Tilam &amp; Bantal</h3>
              <p className="text-xs text-white/80">Stok penuh dibawakan terus dari kilang pengeluar.</p>
            </div>
          </div>

          <div className="group relative h-80 rounded-2xl overflow-hidden shadow-card border border-borderLight">
            <Image
              src="/images/promosi/PROMOSI 2.png"
              alt="Longgokan Tilam Toto & Bantal KAMAAR"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-gold">Harga Kilang</span>
              <h3 className="font-serif text-lg font-bold">Harga Runtuh Bawah Pasaran</h3>
              <p className="text-xs text-white/80">Jaminan harga paling berpatutan tanpa orang tengah.</p>
            </div>
          </div>

          <div className="group relative h-80 rounded-2xl overflow-hidden shadow-card border border-borderLight">
            <Image
              src="/images/promosi/PROMOSI 3.png"
              alt="Khidmat Pelanggan & Pembungkusan KAMAAR"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-gold">Door to Door</span>
              <h3 className="font-serif text-lg font-bold">Penghantaran &amp; Khidmat Mesra</h3>
              <p className="text-xs text-white/80">Pilihan borong untuk asrama, homestay &amp; keluarga.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TAWARAN ISTIMEWA (PROMOTIONAL CATALOG ITEMS) */}
      <section className="py-12 sm:py-16 bg-cream/60 border-y border-borderLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-gold-dark font-bold">
              Senarai Harga Promosi
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-forest mt-1.5">
              Tawaran Istimewa Jelajah Promosi
            </h2>
            <p className="text-sm text-charcoal-muted mt-2">
              Dapatkan produk terlaris KAMAAR pada harga promosi terus kilang hari ini!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialOfferItems.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 border border-borderLight shadow-subtle hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden mb-3 bg-warmwhite">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2 hover:scale-105 transition-transform"
                    />
                    <span className="absolute top-2 left-2 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-xs">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-forest">
                    {item.name}
                  </h3>
                  <div className="text-xs text-charcoal-muted mt-0.5">
                    Saiz: <span className="font-semibold text-charcoal">{item.size}</span>
                  </div>
                  <div className="text-xs text-charcoal-muted">
                    Isian: <span className="font-semibold text-charcoal">{item.material}</span>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-borderLight flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-charcoal-muted line-through">
                      {item.normalPrice}
                    </div>
                    <div className="text-lg font-bold text-rose-700">
                      {item.promoPrice}
                    </div>
                  </div>

                  <Link
                    href={item.link}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold rounded-lg transition-colors"
                  >
                    <span>Beli Sekarang</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gold" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SCHEDULE & LOCATIONS */}
      <section id="lokasi" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-gold-dark font-bold">
            Jadual &amp; Tempat
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-forest mt-1.5">
            Lokasi Jelajah Promosi Terkini
          </h2>
          <p className="text-sm text-charcoal-muted mt-2">
            Kunjungi reruai kilang kami atau singgah di gudang utama Tunas Sinar Jaya Enterprise di Tasek Gelugor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promosiLocations.map((loc, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-borderLight shadow-subtle hover:border-gold transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider border ${loc.badgeColor}`}>
                  {loc.badge}
                </span>
                <h3 className="font-serif text-lg font-bold text-forest">
                  {loc.venue}
                </h3>
                <div className="space-y-2 text-xs text-charcoal-muted">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                    <span>{loc.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gold-dark shrink-0" />
                    <span>{loc.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-emerald-700 font-semibold">{loc.status}</span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-borderLight">
                <a
                  href={`https://wa.me/60194786991?text=Salam%20KAMAAR,%20saya%20ingin%20tanya%20tentang%20lokasi%20${encodeURIComponent(loc.venue)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold rounded-xl transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-gold" />
                  <span>Dapatkan Panduan Arah (WhatsApp)</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
