'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Sun,
  RotateCw,
  FolderArchive,
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
      title: isBM ? 'Jemur di Bawah Cahaya Matahari Berkala' : 'Sun-Air Regularly Under Sunlight',
      badge: isBM ? 'Disyorkan' : 'Recommended',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: Sun,
      iconColor: 'text-amber-500',
      desc: isBM
        ? 'Jemur tilam toto Asian fibre dan tilam kekabu anda selama 1-2 jam di bawah matahari pagi atau petang. Ini membantu menggebukan kembali serat isian, membunuh kuman/hama, dan menyegarkan fabrik.'
        : 'Sun-dry your Asian fibre Toto and Kekabu mattress for 1-2 hours under morning sunlight. This revitalizes fibre plumpness, naturally eliminates allergens and dust mites, and refreshes the fabrics.',
    },
    {
      title: isBM ? 'Buka Sarung Berzip & Basuh Mesin' : 'Wash Removable Zipper Covers',
      badge: isBM ? 'Mudah Basuh' : 'Machine Washable',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: Droplets,
      iconColor: 'text-forest',
      desc: isBM
        ? 'Semua tilam toto KAMAAR dilengkapi sarung berzip keliling. Buka zip, tanggalkan sarung dan basuh menggunakan mesin basuh (kitaran lembut). Jangan basuh teras isian dalam mesin basuh.'
        : 'Our Toto mattresses feature sturdy circumferential zippers. Unzip and wash the outer cotton cover in standard gentle laundry cycles. Keep the inner core dry.',
    },
    {
      title: isBM ? 'Simpan Kemas Dalam Beg Bertali Kilang' : 'Store in Included Zipper Carrier Bags',
      badge: isBM ? 'Jimat Ruang' : 'Storage Bag',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: FolderArchive,
      iconColor: 'text-blue-600',
      desc: isBM
        ? 'Apabila tidak digunakan selepas santai keluarga atau tetamu bertandang, gulung atau lipat kemas dan simpan di dalam beg lutsinar berpemegang percuma yang dibekalkan daripada kilang.'
        : 'When not in active use, neatly roll or fold your mattress and pack it inside the complimentary factory heavy-duty zipper tote bag to prevent dust buildup.',
    },
    {
      title: isBM ? 'Tepuk & Pusingkan Tilam Secara Berkala' : 'Fluff & Rotate Periodically',
      badge: isBM ? 'Kekal Gebu' : 'Fluffing',
      badgeClass: 'bg-gold/20 text-forest-dark border-gold/30',
      icon: RotateCw,
      iconColor: 'text-gold-dark',
      desc: isBM
        ? 'Untuk tilam bujang asrama, tilam lipat 3 dan bantal peluk, pusingkan kedudukan kepala-ke-kaki setiap beberapa bulan dan tepuk lembut bagi memastikan pengagihan isian kekal sekata.'
        : 'For hostel single mattresses, tri-fold beds, and bolsters, rotate head-to-toe and gently pat down to distribute internal cushioning fibres uniformly.',
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
              <span>{isBM ? 'Jadual Pusingan Tilam Asrama & Bilik' : 'Mattress Rotation Scheduler'}</span>
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
          {isBM ? 'Cara Menangani Tumpahan Cecair & Pembersihan Tilam' : 'Spill Management & Stain Cleaning'}
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
                ? 'Gunakan kain mikrofiber atau tuala kering bersih untuk menyerap sebanyak mungkin cecair. Jangan gosok kerana ini boleh menolak cecair lebih dalam ke serat isian.'
                : 'Press a clean dry towel firmly onto the affected area to absorb excess moisture immediately. Avoid vigorous scrubbing to protect the surface fibres.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-cream/40 border border-borderLight space-y-2">
            <span className="w-6 h-6 rounded-full bg-forest text-warmwhite font-bold flex items-center justify-center text-xs">
              2
            </span>
            <h4 className="font-bold text-forest-dark text-sm">
              {isBM ? 'Tanggalkan Sarung & Basuh' : 'Unzip Cover & Wash Separately'}
            </h4>
            <p>
              {isBM
                ? 'Jika tumpahan banyak, buka zip sarung segera dan basuh sarung luar secara berasingan menggunakan sabun basuh biasa.'
                : 'If a major liquid spill occurs, unzip the outer cover immediately and wash separately using standard gentle laundry detergent.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-cream/40 border border-borderLight space-y-2">
            <span className="w-6 h-6 rounded-full bg-forest text-warmwhite font-bold flex items-center justify-center text-xs">
              3
            </span>
            <h4 className="font-bold text-forest-dark text-sm">
              {isBM ? 'Anginkan atau Jemur Panas' : 'Air Dry or Sun-Dry Completely'}
            </h4>
            <p>
              {isBM
                ? 'Jemur bahagian teras di tempat redup atau panas matahari berventilasi baik sehingga 100% kering sebelum sarung dipasang semula.'
                : 'Sun-dry or air out the inner core in a well-ventilated area until 100% dry before zipping the outer cover back on.'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Link to Warranty */}
      <div className="bg-cream rounded-3xl p-8 border border-borderLight text-center space-y-4 max-w-2xl mx-auto shadow-sm">
        <ShieldCheck className="w-10 h-10 text-gold-dark mx-auto" />
        <h3 className="font-serif text-2xl font-bold text-forest-dark">
          {isBM ? 'Jaminan Mutu Kilang Tunas Sinar Jaya' : 'Factory Quality Assurance'}
        </h3>
        <p className="text-xs sm:text-sm text-secondary">
          {isBM
            ? 'Setiap produk jahitan tilam toto, kekabu dan bantal kami dijamin kualiti jahitan kilang dan ketahanan isian yang memuaskan.'
            : 'Every stitched bedding item produced at our Tasek Gelugor manufacturing workshop carries factory quality assurance.'}
        </p>
        <div className="pt-2">
          <Link
            href="/warranty"
            className="inline-flex items-center gap-2 px-6 py-3 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm"
          >
            <span>{isBM ? 'Daftar Jaminan Produk Anda' : 'Register Your Product Guarantee'}</span>
            <ArrowRight className="w-4 h-4 text-gold" />
          </Link>
        </div>
      </div>
    </div>
  )
}
