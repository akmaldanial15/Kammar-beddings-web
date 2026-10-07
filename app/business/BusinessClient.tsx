'use client'

import React, { useState } from 'react'
import { Building2, Hotel, CheckCircle2, Award, ShieldCheck, Sparkles } from 'lucide-react'

export function BusinessClient() {
  const [companyName, setCompanyName] = useState('')
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [businessType, setBusinessType] = useState('Boutique Hotel / Luxury Villa')
  const [estimatedQuantity, setEstimatedQuantity] = useState('20–50 units')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          contactName,
          email,
          phone,
          businessType,
          estimatedQuantity,
          message,
        }),
      })

      if (res.ok) {
        setIsSuccess(true)
      }
    } catch {
      alert('Error submitting inquiry.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-12">
      {/* Factory Procurement Perks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-warmwhite p-6 rounded-2xl border border-borderLight shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <h4 className="font-serif font-bold text-forest-dark text-lg">
            Pengilangan Sendiri di Tasek Gelugor
          </h4>
          <p className="text-xs text-secondary leading-relaxed">
            Fasiliti pengeluaran berstruktur 4 unit: Unit Potong Kain, Unit Jahitan, Unit Bantal &amp; Tilam, serta Stor Produk Siap memastikan kawalan mutu dan kapasiti pengeluaran pukal yang pantas.
          </p>
        </div>

        <div className="bg-warmwhite p-6 rounded-2xl border border-borderLight shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-gold/20 text-forest flex items-center justify-center">
            <Award className="w-5 h-5 text-gold" />
          </div>
          <h4 className="font-serif font-bold text-forest-dark text-lg">
            Khidmat Jenama Sendiri (OEM) &amp; Saiz Khas
          </h4>
          <p className="text-xs text-secondary leading-relaxed">
            Membantu syarikat dan usahawan menghasilkan tilam toto, tilam bujang, comforter dan bantal dengan penjenamaan sendiri, pilihan fabrik kustom, serta spesifikasi tender kerajaan.
          </p>
        </div>

        <div className="bg-warmwhite p-6 rounded-2xl border border-borderLight shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-serif font-bold text-forest-dark text-lg">
            Harga Borong Terus Kilang &amp; Invois Rasmi
          </h4>
          <p className="text-xs text-secondary leading-relaxed">
            Penjimatan harga pengeluar terus tanpa orang tengah untuk asrama, maahad tahfiz, homestay dan kontraktor dengan sokongan sebut harga rasmi serta penghantaran lori ke lokasi.
          </p>
        </div>
      </div>

      {/* Inquiry Form */}
      <div className="bg-warmwhite p-8 md:p-12 rounded-3xl border border-borderLight shadow-sm max-w-3xl mx-auto">
        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-forest text-gold flex items-center justify-center mx-auto shadow">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="font-serif text-2xl font-bold text-forest-dark">
              Permohonan Sebut Harga Diterima
            </h4>
            <p className="text-xs text-secondary max-w-md mx-auto leading-relaxed">
              Pengurusan Tunas Sinar Jaya Enterprise akan menyemak keperluan projek anda dan menyediakan sebut harga rasmi serta jadual penghantaran dalam tempoh 24 jam.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="border-b border-borderLight pb-4 mb-4">
              <h3 className="font-serif text-xl font-bold text-forest-dark">
                Borang Permohonan Sebut Harga Borong / OEM
              </h3>
              <p className="text-secondary text-xs mt-1">
                Sila lengkapkan maklumat organisasi anda untuk menerima sebut harga rasmi terus dari kilang.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-forest-dark mb-1">Nama Organisasi / Syarikat *</label>
                <input
                  type="text"
                  required
                  placeholder="cth. Maahad Tahfiz Al-Quran / Homestay Sejahtera"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-borderLight focus:border-forest"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-dark mb-1">Pegawai Untuk Dihubungi *</label>
                <input
                  type="text"
                  required
                  placeholder="cth. Ustaz Ridzuan / En. Razif (Pegawai Perolehan)"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-borderLight focus:border-forest"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-forest-dark mb-1">Emel Organisasi *</label>
                <input
                  type="email"
                  required
                  placeholder="pengurusan@asrama.edu.my"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-borderLight focus:border-forest"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-dark mb-1">Nombor Telefon / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="011-xxxx xxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-borderLight focus:border-forest"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-forest-dark mb-1">Kategori Pesanan</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-borderLight focus:border-forest bg-warmwhite"
                >
                  <option value="Asrama Sekolah / Institusi Pendidikan">Asrama Sekolah / Institusi Pendidikan</option>
                  <option value="Maahad Tahfiz / Pusat Pengajian">Maahad Tahfiz / Pusat Pengajian</option>
                  <option value="Homestay / Hotel Bajet / Chalet">Homestay / Hotel Bajet / Chalet</option>
                  <option value="Agensi Kerajaan / Kem Latihan / Kuarters">Agensi Kerajaan / Kem Latihan / Kuarters</option>
                  <option value="Pemborong Tekstil / Peniaga Pasar">Pemborong Tekstil / Peniaga Pasar</option>
                  <option value="Projek OEM / Jenama Sendiri">Projek OEM / Jenama Sendiri</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-forest-dark mb-1">Anggaran Kuantiti</label>
                <select
                  value={estimatedQuantity}
                  onChange={(e) => setEstimatedQuantity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-borderLight focus:border-forest bg-warmwhite"
                >
                  <option value="10–25 set">10–25 set</option>
                  <option value="26–50 set">26–50 set</option>
                  <option value="51–100 set">51–100 set</option>
                  <option value="100+ set (Pukal Lori)">100+ set (Pukal Lori)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-forest-dark mb-1">Butiran Produk &amp; Lokasi Penghantaran *</label>
              <textarea
                rows={3}
                required
                placeholder="Nyatakan produk diperlukan (contoh: 30 Tilam Bujang Asrama 4 Inci + 30 Bantal Gebu), lokasi tapak, dan anggaran tarikh penghantaran..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-borderLight focus:border-forest"
              />
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-forest text-warmwhite font-bold text-xs rounded-xl hover:bg-forest-dark transition-colors shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Menghantar...' : 'Dapatkan Sebut Harga Rasmi Kilang'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
