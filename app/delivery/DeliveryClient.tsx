'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  PackageCheck,
  CheckCircle2,
  Calendar,
  Phone,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Recycle,
} from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function DeliveryClient() {
  const { locale } = useLanguage()
  const isBM = locale === 'bm'

  const [postcodeInput, setPostcodeInput] = useState('')
  const [deliveryResult, setDeliveryResult] = useState<{
    region: string
    state: string
    eta: string
    type: string
    cost: string
    whiteGlove: boolean
  } | null>(null)

  const handleCheckPostcode = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = postcodeInput.trim()
    if (!/^\d{5}$/.test(clean)) {
      alert(isBM ? 'Sila masukkan 5-digit poskod Malaysia yang sah.' : 'Please enter a valid 5-digit Malaysian postcode.')
      return
    }

    const num = parseInt(clean, 10)

    if (num >= 50000 && num <= 68100) {
      setDeliveryResult({
        region: 'Klang Valley (Metropolitan)',
        state: num >= 62000 && num <= 62988 ? 'Putrajaya' : num >= 50000 && num <= 60000 ? 'Kuala Lumpur' : 'Selangor',
        eta: isBM ? '2 - 4 Hari Bekerja' : '2 - 4 Business Days',
        type: isBM ? 'Penghantaran Ekspres White-Glove' : 'Express White-Glove Dedicated Crew',
        cost: isBM ? 'PERCUMA (Ditaja Penuh)' : 'FREE (Fully Complimentary)',
        whiteGlove: true,
      })
    } else if ((num >= 40000 && num <= 49999) || (num >= 63000 && num <= 68999)) {
      setDeliveryResult({
        region: 'Greater Selangor & Klang Valley Outer',
        state: 'Selangor',
        eta: isBM ? '3 - 5 Hari Bekerja' : '3 - 5 Business Days',
        type: isBM ? 'Penghantaran White-Glove KAMAAR' : 'KAMAAR In-House White-Glove',
        cost: isBM ? 'PERCUMA' : 'FREE',
        whiteGlove: true,
      })
    } else if (num >= 70000 && num <= 86999) {
      setDeliveryResult({
        region: 'Southern Peninsular (Negeri Sembilan, Melaka, Johor)',
        state: num >= 70000 && num <= 73999 ? 'Negeri Sembilan' : num >= 75000 && num <= 78999 ? 'Melaka' : 'Johor',
        eta: isBM ? '3 - 6 Hari Bekerja' : '3 - 6 Business Days',
        type: isBM ? 'Logistik Perabot Khas Peninsular' : 'Peninsular Bulky Freight Logistics',
        cost: isBM ? 'PERCUMA' : 'FREE',
        whiteGlove: true,
      })
    } else if (num >= 10000 && num <= 36999) {
      setDeliveryResult({
        region: 'Northern Peninsular (Perak, Penang, Kedah, Perlis)',
        state: num >= 10000 && num <= 14999 ? 'Penang' : num >= 30000 && num <= 36999 ? 'Perak' : num >= 1000 && num <= 9999 ? 'Perlis' : 'Kedah',
        eta: isBM ? '3 - 6 Hari Bekerja' : '3 - 6 Business Days',
        type: isBM ? 'Logistik Perabot Khas Peninsular' : 'Peninsular Bulky Freight Logistics',
        cost: isBM ? 'PERCUMA' : 'FREE',
        whiteGlove: true,
      })
    } else if (num >= 20000 && num <= 29999) {
      setDeliveryResult({
        region: 'East Coast (Pahang, Terengganu, Kelantan)',
        state: num >= 25000 && num <= 28999 ? 'Pahang' : num >= 20000 && num <= 24999 ? 'Terengganu' : 'Kelantan',
        eta: isBM ? '4 - 7 Hari Bekerja' : '4 - 7 Business Days',
        type: isBM ? 'Logistik Perabot Khas Peninsular' : 'Peninsular Bulky Freight Logistics',
        cost: isBM ? 'PERCUMA' : 'FREE',
        whiteGlove: true,
      })
    } else if (num >= 87000 && num <= 99999) {
      setDeliveryResult({
        region: 'East Malaysia (Sabah, Sarawak, Labuan)',
        state: num >= 93000 && num <= 98999 ? 'Sarawak' : num >= 87000 && num <= 87999 ? 'Labuan' : 'Sabah',
        eta: isBM ? '10 - 14 Hari Bekerja (Penghantaran Laut/Udara)' : '10 - 14 Business Days (Secure Sea Freight)',
        type: isBM ? 'Logistik Khas Borneo' : 'Specialized Borneo Freight Handler',
        cost: 'RM250 - RM350 (Subsidized)',
        whiteGlove: false,
      })
    } else {
      setDeliveryResult({
        region: 'Peninsular Malaysia General',
        state: 'Malaysia',
        eta: isBM ? '3 - 6 Hari Bekerja' : '3 - 6 Business Days',
        type: isBM ? 'Penghantaran Percuma Semenanjung' : 'Complimentary Peninsular Delivery',
        cost: isBM ? 'PERCUMA' : 'FREE',
        whiteGlove: true,
      })
    }
  }

  const deliveryFeatures = [
    {
      title: isBM ? 'Pemasangan Bilik Tidur White-Glove' : 'White-Glove Room Placement',
      desc: isBM
        ? 'Pasukan logistik terlatih kami akan mengangkat dan memasang tilam terus ke atas katil di bilik tidur pilihan anda.'
        : 'Our courteous two-person crew carries and places your mattress directly onto your bedframe in your room of choice.',
      icon: Truck,
    },
    {
      title: isBM ? 'Pembuangan Plastik & Pembungkusan' : 'Unboxing & Packaging Disposal',
      desc: isBM
        ? 'Kami membuka balutan pelindung kebersihan tebal dan membawa keluar semua kotak dan plastik untuk dikitar semula.'
        : 'We unbox the heavy sanitary protective plastic film and remove all packaging debris from your premises for recycling.',
      icon: PackageCheck,
    },
    {
      title: isBM ? 'Panggilan Janji Temu 24-Jam Awal' : '24-Hour Pre-Delivery Call',
      desc: isBM
        ? 'Pemandu kami akan menghubungi anda sehari sebelum untuk mengesahkan slot masa ketibaan yang selesa bagi anda.'
        : 'Our transport dispatch calls 24 hours prior to confirm an accurate morning or afternoon arrival window that fits your schedule.',
      icon: Phone,
    },
    {
      title: isBM ? 'Pelupusan Tilam Lama Mesra Alam' : 'Eco-Friendly Old Mattress Disposal',
      desc: isBM
        ? 'Perlukan bantuan membuang tilam lama? Pilih servis pelupusan mesra alam semasa pembayaran (RM80 - RM120).'
        : 'Need your old sagging mattress removed? Add eco-disposal at checkout and our crew will responsibly haul it away for recycling.',
      icon: Recycle,
    },
  ]

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Interactive Postcode Estimator */}
      <div className="bg-forest-dark text-warmwhite rounded-3xl p-6 sm:p-10 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>{isBM ? 'Semakan Poskod Seluruh Malaysia' : 'Nationwide Postcode Checker'}</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-warmwhite leading-snug">
            {isBM
              ? 'Semak Tempoh & Kelayakan Penghantaran ke Rumah Anda'
              : 'Estimate Delivery Timeline for Your Postcode'}
          </h2>
          <p className="text-xs sm:text-sm text-warmwhite/80 leading-relaxed">
            {isBM
              ? 'Masukkan 5-digit poskod anda untuk melihat tempoh penghantaran, perkhidmatan white-glove, dan caj (jika ada).'
              : 'Enter your 5-digit Malaysian postal code below to instantly verify lead time, white-glove assembly, and free freight eligibility.'}
          </p>

          <form onSubmit={handleCheckPostcode} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-gold uppercase tracking-wider mb-1">
                {isBM ? 'Poskod Malaysia (5 Digit):' : 'Malaysian Postcode (5 Digits):'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={5}
                  required
                  placeholder="e.g. 50480, 47400, 10050"
                  value={postcodeInput}
                  onChange={(e) => setPostcodeInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-warmwhite/10 border border-warmwhite/20 text-warmwhite placeholder-warmwhite/40 text-xs focus:outline-none focus:border-gold font-mono"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gold hover:bg-gold-light text-forest-dark font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isBM ? 'Semak Poskod' : 'Check'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Postcode Result Display */}
        <div className="bg-warmwhite/10 backdrop-blur-md rounded-2xl p-6 border border-warmwhite/15 space-y-4">
          <h4 className="text-xs uppercase tracking-widest text-gold font-bold">
            {isBM ? 'Status Logistik Lokasi Anda' : 'Your Logistics & Route Status'}
          </h4>

          {deliveryResult ? (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-forest/40 border border-forest/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-warmwhite/70 block uppercase font-bold">
                    {isBM ? 'Wilayah / Negeri' : 'Destination Zone'}
                  </span>
                  <span className="text-sm font-bold text-white">
                    {deliveryResult.region} ({deliveryResult.state})
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                  {deliveryResult.cost}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-warmwhite/5 border border-warmwhite/10">
                  <span className="text-[10px] text-gold block uppercase font-bold mb-0.5">
                    {isBM ? 'Anggaran Masa Sampai:' : 'Estimated Lead Time:'}
                  </span>
                  <span className="font-bold text-white">{deliveryResult.eta}</span>
                </div>
                <div className="p-3 rounded-xl bg-warmwhite/5 border border-warmwhite/10">
                  <span className="text-[10px] text-gold block uppercase font-bold mb-0.5">
                    {isBM ? 'Pemasangan White-Glove:' : 'White-Glove Setup:'}
                  </span>
                  <span className="font-bold text-white">
                    {deliveryResult.whiteGlove ? (isBM ? 'Termasuk Percuma' : 'Included Free') : (isBM ? 'Kargo Pintu ke Pintu' : 'Doorstep Freight')}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-warmwhite/5 border border-warmwhite/10 text-xs text-warmwhite/80">
                <span className="font-semibold text-white block mb-0.5">{isBM ? 'Jenis Kenderaan:' : 'Service Level:'}</span>
                <span>{deliveryResult.type}</span>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-2 text-warmwhite/60">
              <Truck className="w-8 h-8 mx-auto text-gold/40" />
              <p className="text-xs">
                {isBM
                  ? 'Masukkan poskod anda di sebelah untuk melihat perincian jadual penghantaran.'
                  : 'Enter your 5-digit Malaysian postcode to check delivery timeframes.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 4 Delivery Features */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest text-gold font-bold">
            {isBM ? 'Perkhidmatan White-Glove Khas' : 'Premium White-Glove Standard'}
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest-dark">
            {isBM ? 'Pengalaman Penghantaran Tanpa Beban' : 'Effortless In-Home Delivery Experience'}
          </h3>
          <p className="text-xs sm:text-sm text-secondary">
            {isBM
              ? 'Kelengkapan tidur terus dari kilang Tunas Sinar Jaya dibungkus kemas dan dihantar selamat dengan lori kilang atau kurier rasmi ke pintu rumah anda.'
              : 'Factory direct bedding and mattresses packed securely and delivered safely via factory transport or certified courier right to your doorstep.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {deliveryFeatures.map((f, i) => {
            const Icon = f.icon
            return (
              <div
                key={i}
                className="bg-warmwhite rounded-2xl p-6 border border-borderLight shadow-xs hover:border-gold/50 transition-colors space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-forest-dark text-sm sm:text-base leading-snug">
                  {f.title}
                </h4>
                <p className="text-xs text-secondary leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Regional Shipping Guidelines */}
      <div className="bg-warmwhite rounded-3xl p-6 sm:p-10 border border-borderLight shadow-sm space-y-6">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest-dark">
          {isBM ? 'Garis Panduan Penghantaran Mengikut Wilayah' : 'Regional Delivery Timelines & Coverage'}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-cream/60 border-b border-borderLight text-secondary uppercase font-semibold text-[10px] tracking-wider">
                <th className="py-3 px-4">{isBM ? 'Wilayah' : 'Region'}</th>
                <th className="py-3 px-4">{isBM ? 'Negeri / Zon' : 'Covered States'}</th>
                <th className="py-3 px-4">{isBM ? 'Tempoh Masa' : 'Delivery Lead Time'}</th>
                <th className="py-3 px-4">{isBM ? 'Pemasangan' : 'Installation'}</th>
                <th className="py-3 px-4 text-right">{isBM ? 'Kos' : 'Shipping Fee'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLight/60">
              <tr>
                <td className="py-3.5 px-4 font-bold text-forest">Klang Valley</td>
                <td className="py-3.5 px-4 text-secondary">Kuala Lumpur, Selangor, Putrajaya</td>
                <td className="py-3.5 px-4 font-semibold text-charcoal">2 – 4 Hari Bekerja</td>
                <td className="py-3.5 px-4 text-emerald-700 font-bold">White-Glove Termasuk</td>
                <td className="py-3.5 px-4 text-right font-bold text-forest">PERCUMA</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-forest">Semenanjung (Luar Lembah Klang)</td>
                <td className="py-3.5 px-4 text-secondary">Johor, Melaka, N.Sembilan, Perak, Pulau Pinang, Kedah, Perlis, Pahang, Terengganu, Kelantan</td>
                <td className="py-3.5 px-4 font-semibold text-charcoal">3 – 6 Hari Bekerja</td>
                <td className="py-3.5 px-4 text-emerald-700 font-bold">White-Glove Termasuk</td>
                <td className="py-3.5 px-4 text-right font-bold text-forest">PERCUMA</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-forest">Malaysia Timur</td>
                <td className="py-3.5 px-4 text-secondary">Sabah, Sarawak, Wilayah Persekutuan Labuan</td>
                <td className="py-3.5 px-4 font-semibold text-charcoal">10 – 14 Hari Bekerja</td>
                <td className="py-3.5 px-4 text-secondary">Kargo Pintu ke Pintu</td>
                <td className="py-3.5 px-4 text-right font-medium text-secondary">RM250 – RM350</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Building Access Policy Accordion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-cream/50 rounded-2xl p-6 border border-borderLight space-y-3">
          <h4 className="font-bold text-forest-dark text-sm flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-gold-dark" />
            <span>{isBM ? 'Akses Kondominium & Pengurusan Lif' : 'Condominium & Lift Access'}</span>
          </h4>
          <p className="text-xs text-secondary leading-relaxed">
            {isBM
              ? 'Sila pastikan pihak pengurusan bangunan anda (JMB) dimaklumkan sekiranya permohonan kebenaran masuk lori (Move-In Permit) diperlukan pada hari bekerja atau hujung minggu.'
              : 'Please check if your building management requires a Move-In Permit or security deposit for bulky cargo elevators. Our team will present their delivery order upon arrival.'}
          </p>
        </div>

        <div className="bg-cream/50 rounded-2xl p-6 border border-borderLight space-y-3">
          <h4 className="font-bold text-forest-dark text-sm flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-gold-dark" />
            <span>{isBM ? 'Polisi Tangga Tanpa Lif' : 'Walk-up Staircase Guidelines'}</span>
          </h4>
          <p className="text-xs text-secondary leading-relaxed">
            {isBM
              ? 'Penghantaran menggunakan tangga adalah percuma sehingga Tingkat 3. Untuk tingkat 4 ke atas tanpa lif, sedikit saguhati tenaga kru (RM20/tingkat) dikenakan.'
              : 'Walk-up delivery is completely complimentary up to the 3rd floor. For residences 4th floor and above without service lifts, a modest heavy-handling surcharge of RM20/floor applies.'}
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-forest-dark text-warmwhite rounded-3xl p-8 text-center space-y-4 max-w-2xl mx-auto shadow-xl">
        <Sparkles className="w-10 h-10 text-gold mx-auto" />
        <h3 className="font-serif text-2xl font-bold text-warmwhite">
          {isBM ? 'Perlukan Jadual Penghantaran Khas?' : 'Require Custom Delivery Scheduling?'}
        </h3>
        <p className="text-xs sm:text-sm text-warmwhite/80">
          {isBM
            ? 'Adakah rumah baharu anda masih dalam pengubahsuaian? Kami boleh menahan pesanan anda di gudang kami secara percuma sehingga 60 hari.'
            : 'Renovating your master suite? We can hold your ordered mattress securely in our climate-controlled atelier warehouse for up to 60 days free of charge.'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="https://wa.me/60123456789?text=Hello%20KAMAAR,%20I%20would%20like%20to%20arrange%20special%20delivery%20timing."
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-gold hover:bg-gold-light text-forest-dark text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>WhatsApp Logistics Team</span>
          </a>
        </div>
      </div>
    </div>
  )
}
