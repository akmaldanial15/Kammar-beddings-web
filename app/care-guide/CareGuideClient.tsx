'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Sun,
  RotateCw,
  BedDouble,
  Droplets,
  Wind,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function CareGuideClient() {
  const { locale } = useLanguage()
  const isBM = locale === 'bm'

  const [selectedMonth, setSelectedMonth] = useState('1')

  const months = [
    { value: '1', name: isBM ? 'Januari' : 'January' },
    { value: '2', name: isBM ? 'Februari' : 'February' },
    { value: '3', name: isBM ? 'Mac' : 'March' },
    { value: '4', name: isBM ? 'April' : 'April' },
    { value: '5', name: isBM ? 'Mei' : 'May' },
    { value: '6', name: isBM ? 'Jun' : 'June' },
    { value: '7', name: isBM ? 'Julai' : 'July' },
    { value: '8', name: isBM ? 'Ogos' : 'August' },
    { value: '9', name: isBM ? 'September' : 'September' },
    { value: '10', name: isBM ? 'Oktober' : 'October' },
    { value: '11', name: isBM ? 'November' : 'November' },
    { value: '12', name: isBM ? 'Disember' : 'December' },
  ]

  const getRotationMonths = (start: number) => {
    const list = []
    for (let i = 1; i <= 4; i++) {
      const target = ((start - 1 + i * 3) % 12) + 1
      list.push(months.find((m) => m.value === String(target))?.name || '')
    }
    return list
  }

  const rotationDates = getRotationMonths(parseInt(selectedMonth, 10))

  const careRules = [
    {
      title: isBM ? 'JANGAN Jemur di Bawah Terik Matahari' : 'NEVER Expose to Direct Sunlight',
      badge: isBM ? 'Kritikal' : 'Critical',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
      icon: Sun,
      iconColor: 'text-amber-500',
      desc: isBM
        ? 'Sinar UV matahari akan merosakkan dan mengeraskan sel getah lateks semulajadi. Anginkan tilam di dalam bilik yang berventilasi baik atau pasang kipas/aircond.'
        : 'Ultraviolet rays break down and harden the cellular bonds of natural organic latex rubber. Always air dry your mattress in a well-ventilated, shaded bedroom.',
    },
    {
      title: isBM ? 'Pusingkan Kepala ke Kaki (Rotate 180°)' : 'Rotate Head-to-Toe Every 3-6 Months',
      badge: isBM ? 'Wajib' : 'Essential',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: RotateCw,
      iconColor: 'text-forest',
      desc: isBM
        ? 'Pusingkan tilam 180 darjah (bahagian kepala beralih ke kaki) setiap 3 bulan untuk tahun pertama bagi memastikan tekanan badan diagihkan secara sekata. Jangan terbalikkan muka (jangan flip).'
        : 'Rotate your mattress 180 degrees every 3 months for the first year, then every 6 months. Do NOT flip upside down, as our mattresses feature a dedicated multi-zone top comfort layer.',
    },
    {
      title: isBM ? 'Gunakan Rangka Katil yang Rata & Kukuh' : 'Pair with a Flat, Supportive Bed Base',
      badge: isBM ? 'Sokongan' : 'Support',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: BedDouble,
      iconColor: 'text-blue-600',
      desc: isBM
        ? 'Gunakan rangka katil divan padu atau bilah kayu (slats) dengan jarak tidak melebihi 7cm. Rangka yang melengkung atau bilah terlalu jauh akan menyebabkan tilam kendur.'
        : 'Ensure bedframe slats are spaced no wider than 7 cm (2.8 inches) apart. Solid divans or hardwood slatted frames preserve the internal core warranty integrity.',
    },
    {
      title: isBM ? 'Gunakan Pelindung Tilam Kalis Air' : 'Always Use a Breathable Mattress Protector',
      badge: isBM ? 'Perlindungan' : 'Protection',
      badgeClass: 'bg-gold/20 text-forest-dark border-gold/30',
      icon: Droplets,
      iconColor: 'text-gold-dark',
      desc: isBM
        ? 'Pelindung tilam kalis air buluh/tencel kami menghalang peluh tropika dan tumpahan cecair daripada meresap ke dalam teras lateks, sambil mengekalkan pengudaraan sejuk.'
        : 'A breathable organic bamboo protector shields your latex core from sweat, dead skin, and liquid spills while preserving airflow and valid warranty coverage.',
    },
  ]

  return (
    <div className="space-y-16 md:space-y-24">
      {/* 4 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {careRules.map((rule, idx) => {
          const Icon = rule.icon
          return (
            <div
              key={idx}
              className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-borderLight shadow-sm space-y-4 hover:border-gold/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl bg-cream flex items-center justify-center ${rule.iconColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${rule.badgeClass}`}>
                  {rule.badge}
                </span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-forest-dark">
                {rule.title}
              </h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                {rule.desc}
              </p>
            </div>
          )
        })}
      </div>

      {/* Interactive Quarterly Rotation Schedule Tool */}
      <div className="bg-forest-dark text-warmwhite rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-warmwhite/10 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-gold/20 text-gold text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>{isBM ? 'Jadual Pusingan Tilam' : 'Quarterly Rotation Scheduler'}</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-warmwhite">
              {isBM ? 'Kira Tarikh Pusingan 180° Tilam Anda' : 'Calculate Your 4 Annual Rotation Milestones'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-warmwhite/80 font-bold whitespace-nowrap">
              {isBM ? 'Bulan Mula Beli:' : 'Purchase Month:'}
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-warmwhite/10 border border-warmwhite/20 text-warmwhite text-xs focus:outline-none focus:border-gold font-bold"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value} className="bg-slate-900 text-white">
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {rotationDates.map((monthName, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-warmwhite/10 border border-warmwhite/15 space-y-2 flex flex-col justify-between"
            >
              <span className="text-[10px] font-bold text-gold uppercase tracking-wider">
                {isBM ? `Pusingan Ke-${i + 1}` : `Rotation #${i + 1}`}
              </span>
              <span className="font-serif text-xl font-bold text-white block">
                {monthName}
              </span>
              <p className="text-[11px] text-warmwhite/70">
                {isBM ? 'Pusingkan kepala ke hujung kaki' : 'Rotate head 180° to foot'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Cleaning and Spill Management */}
      <div className="bg-warmwhite rounded-3xl p-6 sm:p-10 border border-borderLight shadow-sm space-y-6">
        <h3 className="font-serif text-2xl font-bold text-forest-dark">
          {isBM ? 'Cara Menangani Tumpahan Cecair & Pembersihan' : 'Spill Management & Stain Cleaning'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-secondary leading-relaxed">
          <div className="p-5 rounded-2xl bg-cream/40 border border-borderLight space-y-2">
            <span className="w-6 h-6 rounded-full bg-forest text-warmwhite font-bold flex items-center justify-center text-xs">
              1
            </span>
            <h4 className="font-bold text-forest-dark text-sm">
              {isBM ? 'Tekap Segera (Jangan Gosok)' : 'Blot Immediately (Do Not Rub)'}
            </h4>
            <p>
              {isBM
                ? 'Gunakan kain mikrofiber atau tuala kering bersih untuk menyerap sebanyak mungkin cecair. Jangan gosok kerana ini boleh menolak cecair lebih dalam.'
                : 'Press a clean dry towel firmly onto the affected area to absorb excess moisture immediately. Avoid vigorous scrubbing to protect the surface fibres.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-cream/40 border border-borderLight space-y-2">
            <span className="w-6 h-6 rounded-full bg-forest text-warmwhite font-bold flex items-center justify-center text-xs">
              2
            </span>
            <h4 className="font-bold text-forest-dark text-sm">
              {isBM ? 'Lap dengan Sabun Lembut' : 'Spot Clean with Mild Detergent'}
            </h4>
            <p>
              {isBM
                ? 'Campurkan sedikit sabun mesra fabrik dengan air suam. Celup kain bersih, perah sehingga lembap dan tekap perlahan pada kesan kotoran.'
                : 'Mix a small droplet of gentle organic detergent with lukewarm water. Dampen a cloth and gently dab the stain without soaking the inner core.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-cream/40 border border-borderLight space-y-2">
            <span className="w-6 h-6 rounded-full bg-forest text-warmwhite font-bold flex items-center justify-center text-xs">
              3
            </span>
            <h4 className="font-bold text-forest-dark text-sm">
              {isBM ? 'Keringkan dengan Kipas Angin' : 'Air Dry in Fan-Cooled Shade'}
            </h4>
            <p>
              {isBM
                ? 'Pasang kipas angin atau penyahlembap (dehumidifier) menghadap tilam sehingga benar-benar kering sebelum memasang kembali cadar.'
                : 'Direct a standing fan or room dehumidifier directly at the spot until 100% dry before reapplying your bedding sheets.'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Link to Warranty */}
      <div className="bg-cream rounded-3xl p-8 border border-borderLight text-center space-y-4 max-w-2xl mx-auto shadow-sm">
        <ShieldCheck className="w-10 h-10 text-gold-dark mx-auto" />
        <h3 className="font-serif text-2xl font-bold text-forest-dark">
          {isBM ? 'Pastikan Waranti 10-Tahun Anda Diaktifkan' : 'Keep Your 10-Year Warranty Protected'}
        </h3>
        <p className="text-xs sm:text-sm text-secondary">
          {isBM
            ? 'Penjagaan mengikut panduan ini memastikan keselesaan maksimum selama bertahun-tahun dan melayakkan jaminan struktur rasmi.'
            : 'Adhering to these simple practices ensures decade-long resilience and upholds your official structural guarantee.'}
        </p>
        <div className="pt-2">
          <Link
            href="/warranty"
            className="inline-flex items-center gap-2 px-6 py-3 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm"
          >
            <span>{isBM ? 'Daftar Waranti Tilam Anda' : 'Register Your Warranty'}</span>
            <ArrowRight className="w-4 h-4 text-gold" />
          </Link>
        </div>
      </div>
    </div>
  )
}
