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
    adjustmentEnd: string
    trialEnd: string
  } | null>(null)

  const handleCalculateTrial = (e: React.FormEvent) => {
    e.preventDefault()
    if (!deliveryDateInput) return

    const start = new Date(deliveryDateInput)
    if (isNaN(start.getTime())) return

    const adjustmentDate = new Date(start)
    adjustmentDate.setDate(adjustmentDate.getDate() + 30)

    const trialEndDate = new Date(start)
    trialEndDate.setDate(trialEndDate.getDate() + 100)

    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }

    setCalculatedDates({
      adjustmentEnd: adjustmentDate.toLocaleDateString(isBM ? 'ms-MY' : 'en-MY', options),
      trialEnd: trialEndDate.toLocaleDateString(isBM ? 'ms-MY' : 'en-MY', options),
    })
  }

  const steps = [
    {
      step: '01',
      title: isBM ? 'Hantar & Pasang Percuma' : 'Free In-Home Delivery & Setup',
      desc: isBM
        ? 'Tilam baharu dihantar terus ke bilik tidur anda dengan perkhidmatan white-glove setup percuma di seluruh Semenanjung Malaysia.'
        : 'Your handcrafted mattress is delivered straight to your bedroom with free white-glove setup anywhere across Peninsular Malaysia.',
      icon: Truck,
    },
    {
      step: '02',
      title: isBM ? 'Tempoh Penyesuaian 30 Hari' : 'The 30-Night Adjustment Period',
      desc: isBM
        ? 'Badan anda memerlukan sekurang-kurangnya 3-4 minggu untuk membiasakan postur tulang belakang dengan sokongan lateks semulajadi.'
        : 'Your body needs 3 to 4 weeks to adjust to ergonomic spinal alignment after years of sleeping on depleted traditional mattresses.',
      icon: MoonIcon,
    },
    {
      step: '03',
      title: isBM ? 'Tidur Lena Sehingga 100 Malam' : 'Sleep Deeply for up to 100 Nights',
      desc: isBM
        ? 'Nikmati keselesaan sejuk dan kelegaan tekanan di rumah anda. Rasai perbezaan tidur tanpa toksik dan sokongan ergonomik.'
        : 'Enjoy cool, pressure-relieving sleep in your real bedroom setting. Truly experience what non-toxic organic latex feels like.',
      icon: Sparkles,
    },
    {
      step: '04',
      title: isBM ? 'Puas Hati atau 100% Pulangan Wang' : 'Love It or 100% Full Refund',
      desc: isBM
        ? 'Jika anda tidak jatuh cinta sepenuhnya antara hari ke-31 hingga hari ke-100, pasukan kami akan kutip semula dan pulangkan wang anda sepenuhnya.'
        : 'If you are not deeply rested between Day 31 and Day 100, we will arrange a complimentary return pickup and issue a 100% refund.',
      icon: RotateCcw,
    },
  ]

  const faqs = [
    {
      q: isBM ? 'Mengapa ada tempoh bertenang minimum 30 malam?' : 'Why is there a minimum 30-night break-in period?',
      a: isBM
        ? 'Sama seperti kasut kulit berkualiti atau postur kerusi ergonomik baharu, otot dan tulang belakang anda mengambil masa 21 hingga 30 hari untuk menyesuaikan diri dengan penjajaran ergonomik lateks semulajadi.'
        : 'Just like breaking into bespoke ergonomic footwear, your spinal column and muscles require 21 to 30 nights to reset posture from previous sagging beds to proper orthopaedic latex support.',
    },
    {
      q: isBM ? 'Adakah kos penghantaran balik ditanggung oleh saya?' : 'Do I need to pay for return shipping?',
      a: isBM
        ? 'Tidak sama sekali untuk Semenanjung Malaysia! Pasukan logistik KAMAAR akan datang terus ke rumah anda untuk mengambil tilam tanpa sebarang caj tambahan atau potongan yuran restock.'
        : 'Zero return fees across Peninsular Malaysia! Our dedicated logistics team will pick up the mattress directly from your bedroom with zero restocking fees.',
    },
    {
      q: isBM ? 'Apa yang KAMAAR lakukan pada tilam yang dipulangkan?' : 'What happens to returned mattresses?',
      a: isBM
        ? 'Kami TIDAK PERNAH menjual semula tilam yang dipulangkan. Setiap unit dibersihkan secara kebersihan hospital dan disumbangkan kepada rumah kebajikan rakan kongsi atau dikitar semula secara mampan.'
        : 'We never resell returned trial mattresses. Every unit is industrially sanitized and donated to registered Malaysian charity homes or recycled sustainably.',
    },
    {
      q: isBM ? 'Apakah syarat untuk melayakkan pulangan wang 100%?' : 'What are the conditions for a 100% refund?',
      a: isBM
        ? 'Tilam mestilah digunakan dengan pelapik tilam kalis air (mattress protector) dan bebas daripada koyakan buatan, kotoran cecair melampau, atau kerosakan struktur fizikal yang disengajakan.'
        : 'The mattress must have been used with a mattress protector and be free from deliberate damage, severe stains, biological spills, or smoke damage.',
    },
  ]

  return (
    <div className="space-y-16 md:space-y-24">
      {/* 4 Value Pillars Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: isBM ? '100 Malam Percubaan' : '100-Night Home Trial', sub: isBM ? 'Bebas Risiko 100%' : '100% Risk-Free Guarantee', icon: RotateCcw },
          { label: isBM ? 'Kutipan Percuma' : 'Free In-Home Pickup', sub: isBM ? 'Semenanjung Malaysia' : 'Peninsular Malaysia', icon: Truck },
          { label: isBM ? '100% Pulangan Wang' : '100% Full Refund', sub: isBM ? 'Tiada caj tersembunyi' : 'Zero Restocking Fees', icon: ShieldCheck },
          { label: isBM ? 'Sumbangan Amal' : 'Ethical Donation', sub: isBM ? 'Tidak dijual semula' : 'Never Resold to Others', icon: Heart },
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

      {/* Step by Step Timeline */}
      <div className="bg-warmwhite rounded-3xl p-6 sm:p-10 border border-borderLight shadow-md space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest text-gold font-bold">
            {isBM ? 'Proses Percubaan Mudah' : 'Simple, Transparent Process'}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-dark">
            {isBM ? 'Cara Percubaan 100 Malam Berfungsi' : 'How Your 100-Night Sleep Trial Works'}
          </h2>
          <p className="text-xs sm:text-sm text-secondary">
            {isBM
              ? 'Kami ingin memastikan anda benar-benar menyukai tilam anda, tanpa sebarang tekanan membeli-belah di kedai.'
              : 'Take your time. Sleep through rainy monsoons and humid afternoons to truly experience the difference.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon
            return (
              <div
                key={idx}
                className="relative bg-cream/40 rounded-2xl p-5 border border-borderLight/80 flex flex-col justify-between space-y-4 hover:border-gold/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl font-bold text-gold/60">{s.step}</span>
                  <div className="w-9 h-9 rounded-xl bg-forest/10 text-forest flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-forest-dark text-sm sm:text-base leading-snug">
                    {s.title}
                  </h4>
                  <p className="text-xs text-secondary leading-relaxed">{s.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Interactive Trial Window Calculator */}
      <div className="bg-forest-dark text-warmwhite rounded-3xl p-6 sm:p-10 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            <span>{isBM ? 'Kalkulator Tempoh Percubaan' : 'Trial Window Calculator'}</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-warmwhite leading-snug">
            {isBM
              ? 'Semak Tarikh Akhir Percubaan 100 Malam Anda'
              : 'Calculate Your Exact 100-Night Sleep Window'}
          </h3>
          <p className="text-xs sm:text-sm text-warmwhite/80 leading-relaxed">
            {isBM
              ? 'Masukkan tarikh penghantaran tilam anda untuk mengetahui tarikh tamat penyesuaian 30 hari serta hari ke-100 jaminan pulangan.'
              : 'Enter the date your KAMAAR mattress was (or will be) delivered into your home to view your key milestones.'}
          </p>

          <form onSubmit={handleCalculateTrial} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-gold uppercase tracking-wider mb-1">
                {isBM ? 'Tarikh Penghantaran Tilam:' : 'Mattress Delivery Date:'}
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  required
                  value={deliveryDateInput}
                  onChange={(e) => setDeliveryDateInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-warmwhite/10 border border-warmwhite/20 text-warmwhite text-xs focus:outline-none focus:border-gold"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gold hover:bg-gold-light text-forest-dark font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isBM ? 'Kira Tarikh' : 'Calculate'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Calculation Result Card */}
        <div className="bg-warmwhite/10 backdrop-blur-md rounded-2xl p-6 border border-warmwhite/15 space-y-4">
          <h4 className="text-xs uppercase tracking-widest text-gold font-bold">
            {isBM ? 'Garis Masa Percubaan Anda' : 'Your Personalized Timeline'}
          </h4>

          {calculatedDates ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-forest/40 border border-forest/60 space-y-1">
                <span className="text-[11px] text-warmwhite/70 block uppercase font-semibold">
                  {isBM ? 'Tamat Tempoh Penyesuaian (Hari ke-30):' : 'Adjustment Period Ends (Day 30):'}
                </span>
                <span className="text-lg font-serif font-bold text-gold">
                  {calculatedDates.adjustmentEnd}
                </span>
                <p className="text-[10px] text-warmwhite/70">
                  {isBM
                    ? 'Badan anda telah selesai menyesuaikan postur dengan sokongan ergonomik.'
                    : 'Your body has fully calibrated to optimal spinal pressure relief.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gold/15 border border-gold/30 space-y-1">
                <span className="text-[11px] text-gold block uppercase font-bold">
                  {isBM ? 'Tarikh Akhir Percubaan (Hari ke-100):' : 'Last Day to Request Return (Day 100):'}
                </span>
                <span className="text-xl font-serif font-bold text-white">
                  {calculatedDates.trialEnd}
                </span>
                <p className="text-[10px] text-warmwhite/80">
                  {isBM
                    ? 'Hubungi concierge kami sebelum atau pada tarikh ini untuk memulakan pemulangan 100% percuma.'
                    : 'Contact our concierge on or before this date for a zero-hassle complimentary return.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-2 text-warmwhite/60">
              <Clock className="w-8 h-8 mx-auto text-gold/40" />
              <p className="text-xs">
                {isBM
                  ? 'Pilih tarikh di sebelah dan tekan "Kira Tarikh" untuk melihat garis masa.'
                  : 'Select your delivery date on the left to see your sleep milestones.'}
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
            {isBM ? 'Pertanyaan Mengenai Percubaan 100 Malam' : '100-Night Sleep Trial FAQ'}
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
          {isBM ? 'Sedia Untuk Tidur Lebih Nyenyak?' : 'Ready to Experience Restorative Sleep?'}
        </h3>
        <p className="text-xs sm:text-sm text-secondary">
          {isBM
            ? 'Semua tilam KAMAAR Beddings layak untuk Percubaan 100 Malam tanpa sebarang risiko.'
            : 'Every handcrafted organic latex and hybrid mattress is protected by our 100-Night Risk-Free Trial.'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/collections/mattress"
            className="px-6 py-3 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all"
          >
            {isBM ? 'Terokai Koleksi Tilam' : 'Explore All Mattresses'}
          </Link>
          <a
            href="https://wa.me/60123456789?text=Hello%20KAMAAR,%20I%20have%20questions%20about%20the%20100-night%20sleep%20trial."
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-warmwhite hover:bg-cream-light text-forest text-xs font-bold uppercase tracking-wider rounded-xl border border-borderLight transition-all flex items-center gap-2"
          >
            <Phone className="w-3.5 h-3.5 text-gold-dark" />
            <span>WhatsApp Concierge</span>
          </a>
        </div>
      </div>
    </div>
  )
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}
