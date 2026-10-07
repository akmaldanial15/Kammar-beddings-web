'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  RotateCcw,
  ShieldCheck,
  Truck,
  Heart,
  Calendar,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Phone,
  Clock,
  Award,
} from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function TrialClient() {
  const { locale } = useLanguage()
  const isBM = locale === 'bm'

  const [deliveryDateInput, setDeliveryDateInput] = useState('')
  const [calculatedDates, setCalculatedDates] = useState<{
    inspectionEnd: string
    trialEnd: string
  } | null>(null)

  const handleCalculateTrial = (e: React.FormEvent) => {
    e.preventDefault()
    if (!deliveryDateInput) return

    const start = new Date(deliveryDateInput)
    if (isNaN(start.getTime())) return

    const inspectionDate = new Date(start)
    inspectionDate.setDate(inspectionDate.getDate() + 7)

    const trialEndDate = new Date(start)
    trialEndDate.setDate(trialEndDate.getDate() + 14)

    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }

    setCalculatedDates({
      inspectionEnd: inspectionDate.toLocaleDateString(isBM ? 'ms-MY' : 'en-MY', options),
      trialEnd: trialEndDate.toLocaleDateString(isBM ? 'ms-MY' : 'en-MY', options),
    })
  }

  const steps = [
    {
      step: '01',
      title: isBM ? 'Penerimaan & Pemeriksaan Awal' : 'Delivery & Initial Inspection',
      desc: isBM
        ? 'Pesanan tilam toto atau kelengkapan tekstil tiba dari kilang Tunas Sinar Jaya. Buka bungkusan plastik lutsinar dan periksa keadaan tilam serta corak fabrik.'
        : 'Your order arrives securely packed from Tunas Sinar Jaya factory. Unpack and inspect the fabric stitching and pattern accuracy.',
      icon: Truck,
    },
    {
      step: '02',
      title: isBM ? 'Uji Keempukan & Keselesaan' : 'Test Comfort in Your Home',
      desc: isBM
        ? 'Bentangkan tilam toto atau tilam kekabu di ruang santai keluarga, bilik tidur, atau asrama. Rasai kegebuan isian Asian Polyester Fibre atau kekabu asli tradisi.'
        : 'Lay out your mattress in your living area or hostel bedroom. Experience the plump Asian Polyester Fibre or traditional Kekabu cushioning.',
      icon: Sparkles,
    },
    {
      step: '03',
      title: isBM ? 'Jaminan Mutu Kilang 14 Hari' : '14-Day Factory Quality Guarantee',
      desc: isBM
        ? 'Sekiranya terdapat sebarang kecacatan jahitan kilang, kerosakan zip keliling, atau salah saiz, maklumkan kepada pihak kilang kami dalam tempoh 14 hari.'
        : 'If there is any factory seam fault, zip defect, or size discrepancy, simply notify our customer care within 14 days of receipt.',
      icon: ShieldCheck,
    },
    {
      step: '04',
      title: isBM ? 'Pertukaran 1-ke-1 Pantas' : 'Swift 1-to-1 Exchange',
      desc: isBM
        ? 'Pihak kilang akan mengaturkan penggantian unit baharu tanpa birokrasi rumit untuk memastikan anda sentiasa berpuas hati 100%.'
        : 'Our factory will arrange a swift 1-to-1 product replacement to ensure you are completely satisfied with your purchase.',
      icon: RotateCcw,
    },
  ]

  const faqs = [
    {
      q: isBM ? 'Apakah yang dilindungi di bawah jaminan 14 hari ini?' : 'What is covered under the 14-day factory guarantee?',
      a: isBM
        ? 'Jaminan ini merangkumi kecacatan jahitan fabrik, zip yang rosak sewaktu penghantaran, salah hantar saiz/corak, dan kerosakan teras isian daripada pengilangan.'
        : 'Covers factory sewing tears, broken zippers on delivery, wrong size or pattern dispatch, and manufacturing core defects.',
    },
    {
      q: isBM ? 'Bagaimanakah cara membuat tuntutan pertukaran?' : 'How do I request an exchange or replacement?',
      a: isBM
        ? 'Ambil gambar bahagian yang bermasalah berserta resit/invois pesanan anda, dan hantar WhatsApp terus kepada khidmat pelanggan kilang kami di 019-478 6991.'
        : 'Simply take a clear photo of the issue along with your order invoice number and WhatsApp our factory team directly at +6019-478 6991.',
    },
    {
      q: isBM ? 'Bolehkah saya menukar tilam jika tersalah pilih saiz?' : 'Can I exchange if I chose the wrong size?',
      a: isBM
        ? 'Boleh, asalkan tilam masih belum digunakan secara melampau dan sarung asal masih dalam keadaan baik. Pertukaran saiz boleh dilakukan di gudang Tasek Gelugor atau melalui kurier.'
        : 'Yes, provided the mattress remains clean and unsoiled. Size adjustments can be arranged via courier or at our Tasek Gelugor factory.',
    },
    {
      q: isBM ? 'Bolehkah saya datang terus ke kilang di Tasek Gelugor?' : 'Can I visit the factory in Tasek Gelugor directly?',
      a: isBM
        ? 'Sangat dialu-alukan! Anda boleh melawat premis dan kilang kami di 7878B Jalan Permatang Berangan, 13300 Tasek Gelugor, Pulau Pinang pada waktu operasi pejabat.'
        : 'You are very welcome! Visit our factory at 7878B Jalan Permatang Berangan, 13300 Tasek Gelugor, Penang during operating hours.',
    },
  ]

  return (
    <div className="space-y-16 md:space-y-24">
      {/* 4 Value Pillars Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: isBM ? 'Jaminan Kilang 14 Hari' : '14-Day Factory Guarantee', sub: isBM ? 'Pertukaran 1-ke-1' : '1-to-1 Replacement', icon: RotateCcw },
          { label: isBM ? 'Penghantaran Terus' : 'Direct Dispatch', sub: isBM ? 'Kilang Tasek Gelugor' : 'Penang Factory Direct', icon: Truck },
          { label: isBM ? 'Jahitan Industri' : 'Industrial Stitching', sub: isBM ? 'Unit Jahitan Berkemahiran' : 'Skilled Tailoring Unit', icon: ShieldCheck },
          { label: isBM ? '100% Milikan Bumiputera' : '100% Malaysian Owned', sub: isBM ? 'Tunas Sinar Jaya Enterprise' : 'Tunas Sinar Jaya Enterprise', icon: Heart },
        ].map((item, i) => {
          const Icon = item.icon
          return (
            <div
              key={i}
              className="bg-warmwhite p-5 rounded-2xl border border-borderLight shadow-xs flex flex-col items-center text-center space-y-2"
            >
              <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold-dark flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-forest-dark text-xs sm:text-sm">{item.label}</h4>
              <p className="text-[11px] text-secondary">{item.sub}</p>
            </div>
          )
        })}
      </div>

      {/* 4 Step Process */}
      <div className="space-y-6">
        <div className="text-center space-y-2 max-w-md mx-auto">
          <span className="text-xs uppercase tracking-widest text-gold font-bold">
            {isBM ? 'Proses Mudah' : 'Simple Process'}
          </span>
          <h3 className="font-serif text-2xl font-bold text-forest-dark">
            {isBM ? 'Cara Jaminan Kualiti Kilang Berfungsi' : 'How the Factory Guarantee Works'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((st, i) => {
            const Icon = st.icon
            return (
              <div
                key={i}
                className="bg-warmwhite rounded-2xl p-6 border border-borderLight shadow-sm space-y-3 relative overflow-hidden"
              >
                <span className="text-3xl font-serif font-black text-gold/30 absolute right-4 top-4">
                  {st.step}
                </span>
                <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-forest-dark text-base">{st.title}</h4>
                <p className="text-xs text-secondary leading-relaxed">{st.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Date Calculator Card */}
      <div className="bg-forest-dark text-warmwhite rounded-3xl p-6 sm:p-10 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            <span>{isBM ? 'Kalkulator Garis Masa Jaminan' : 'Guarantee Window Calculator'}</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-warmwhite leading-tight">
            {isBM ? 'Semak Tempoh Jaminan 14 Hari Pesanan Anda' : 'Check Your 14-Day Guarantee Window'}
          </h3>
          <p className="text-xs sm:text-sm text-warmwhite/80 leading-relaxed">
            {isBM
              ? 'Masukkan tarikh anda menerima barangan untuk melihat tarikh semakan dan tarikh tamat tempoh jaminan gantian kilang.'
              : 'Enter the date your order arrived to view your full 14-day factory inspection and replacement coverage.'}
          </p>

          <form onSubmit={handleCalculateTrial} className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="date"
                value={deliveryDateInput}
                onChange={(e) => setDeliveryDateInput(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-warmwhite/10 border border-warmwhite/20 text-warmwhite text-xs focus:outline-none focus:border-gold"
                required
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-gold hover:bg-gold-light text-forest-dark font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md whitespace-nowrap"
              >
                {isBM ? 'Kira Tarikh' : 'Calculate Window'}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-6 bg-warmwhite/10 rounded-2xl p-6 border border-warmwhite/15">
          {calculatedDates ? (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-forest/40 border border-warmwhite/20 space-y-1">
                <span className="text-[11px] text-warmwhite/70 block uppercase font-bold">
                  {isBM ? 'Tempoh Semakan Awal (Hari ke-7):' : 'Initial Review Period (Day 7):'}
                </span>
                <span className="text-lg font-bold text-warmwhite">
                  {calculatedDates.inspectionEnd}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-gold/15 border border-gold/30 space-y-1">
                <span className="text-[11px] text-gold block uppercase font-bold">
                  {isBM ? 'Tarikh Akhir Jaminan (Hari ke-14):' : 'End of 14-Day Guarantee (Day 14):'}
                </span>
                <span className="text-xl font-serif font-bold text-white">
                  {calculatedDates.trialEnd}
                </span>
                <p className="text-[10px] text-warmwhite/80">
                  {isBM
                    ? 'Hubungi WhatsApp kilang kami sebelum atau pada tarikh ini sekiranya memerlukan sebarang pertukaran.'
                    : 'Contact our factory WhatsApp on or before this date if you require any replacement assistance.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-2 text-warmwhite/60">
              <Clock className="w-8 h-8 mx-auto text-gold/40" />
              <p className="text-xs">
                {isBM
                  ? 'Pilih tarikh di sebelah dan tekan "Kira Tarikh" untuk melihat garis masa.'
                  : 'Select your delivery date on the left to see your guarantee milestones.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Trial FAQ Accordion */}
      <div className="space-y-6">
        <div className="text-center space-y-2 max-w-md mx-auto">
          <span className="text-xs uppercase tracking-widest text-gold font-bold">
            {isBM ? 'Soalan Lazim' : 'Clear & Honest Answers'}
          </span>
          <h3 className="font-serif text-2xl font-bold text-forest-dark">
            {isBM ? 'Pertanyaan Mengenai Jaminan Kilang' : 'Factory Guarantee FAQ'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-warmwhite p-5 rounded-2xl border border-borderLight shadow-xs space-y-2"
            >
              <h4 className="font-bold text-forest-dark text-sm flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-gold-dark flex-shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-secondary leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="bg-cream rounded-3xl p-8 border border-borderLight text-center space-y-4 max-w-2xl mx-auto shadow-sm">
        <Award className="w-10 h-10 text-gold-dark mx-auto" />
        <h3 className="font-serif text-2xl font-bold text-forest-dark">
          {isBM ? 'Kualiti Terjamin Terus Dari Kilang' : 'Factory Direct Quality Assurance'}
        </h3>
        <p className="text-xs sm:text-sm text-secondary">
          {isBM
            ? 'Tunas Sinar Jaya Enterprise komited membekalkan tilam toto, kekabu, dan kelengkapan asrama berkualiti tinggi sejak 2000-an.'
            : 'Tunas Sinar Jaya Enterprise has been delivering premium Malaysian bedding and textile manufacturing excellence since the 2000s.'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/collections/tilam-toto"
            className="px-6 py-3 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all"
          >
            {isBM ? 'Koleksi Tilam Toto' : 'Explore Tilam Toto'}
          </Link>
          <a
            href="https://wa.me/60194786991?text=Salam%20KAMAAR,%20saya%20ingin%20bertanya%20tentang%20produk%20dan%20jaminan%20kilang."
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-warmwhite hover:bg-cream-light text-forest text-xs font-bold uppercase tracking-wider rounded-xl border border-borderLight transition-all flex items-center gap-2"
          >
            <Phone className="w-3.5 h-3.5 text-gold-dark" />
            <span>WhatsApp 019-478 6991</span>
          </a>
        </div>
      </div>
    </div>
  )
}
