'use client'

import React, { useState } from 'react'
import { Affiliate } from '@/types'
import { formatMYR } from '@/lib/utils/format'
import {
  Users,
  Plus,
  Share2,
  Copy,
  Check,
  TrendingUp,
  DollarSign,
  Search,
  ExternalLink,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  X,
  Edit2,
  Trash2,
} from 'lucide-react'

interface Props {
  initialAffiliates: Affiliate[]
}

const MALAYSIAN_BANKS = [
  'Maybank',
  'CIMB Bank',
  'Public Bank',
  'RHB Bank',
  'Hong Leong Bank',
  'AmBank',
  'Bank Islam',
  'Bank Muamalat',
  'BSN',
  'Alliance Bank',
  'Affin Bank',
  'OCBC Bank',
  'HSBC Bank',
  'Standard Chartered',
  'UOB Malaysia',
]

export function AffiliatesClient({ initialAffiliates }: Props) {
  const [affiliates, setAffiliates] = useState<Affiliate[]>(initialAffiliates)
  const [search, setSearch] = useState('')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // New affiliate form state
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [bankName, setBankName] = useState('Maybank')
  const [bankAccountNumber, setBankAccountNumber] = useState('')
  const [commissionRate, setCommissionRate] = useState(10)

  // Aggregated KPI Metrics
  const activeCount = affiliates.filter((a) => a.isActive).length
  const totalSalesCount = affiliates.reduce((acc, a) => acc + (a.totalSalesCount || 0), 0)
  const totalRevenueSen = affiliates.reduce((acc, a) => acc + (a.totalSalesRevenueSen || 0), 0)
  const totalCommissionSen = affiliates.reduce((acc, a) => acc + (a.totalCommissionSen || 0), 0)

  // Filtered list
  const filteredAffiliates = affiliates.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.code.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleCopyLink = (code: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://kammar-beddings-web.vercel.app'
    const referralUrl = `${origin}/?ref=${encodeURIComponent(code)}`
    navigator.clipboard.writeText(referralUrl)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2500)
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/affiliates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })
      if (res.ok) {
        setAffiliates((prev) =>
          prev.map((a) => (a.id === id ? { ...a, isActive: !currentStatus } : a))
        )
      }
    } catch (err) {
      console.error('Failed to toggle status:', err)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Padam ejen affiliate "${name}"? Tindakan ini tidak boleh diundur.`)) return

    try {
      const res = await fetch(`/api/admin/affiliates/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setAffiliates((prev) => prev.filter((a) => a.id !== id))
      }
    } catch (err) {
      console.error('Failed to delete affiliate:', err)
    }
  }

  const handleCreateAffiliate = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!name.trim() || !code.trim()) {
      setErrorMessage('Sila isi nama dan kod affiliate.')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/admin/affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          code: code.trim().toUpperCase(),
          email: email.trim(),
          phone: phone.trim(),
          bankName,
          bankAccountNumber: bankAccountNumber.trim(),
          commissionType: 'percentage',
          commissionRate: Number(commissionRate) || 10,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || 'Gagal mendaftar ejen affiliate.')
        setIsSubmitting(false)
        return
      }

      setAffiliates((prev) => [data.affiliate, ...prev])
      setIsModalOpen(false)
      // Reset form
      setName('')
      setCode('')
      setEmail('')
      setPhone('')
      setBankAccountNumber('')
      setCommissionRate(10)
    } catch (err: any) {
      setErrorMessage(err.message || 'Ralat sambungan pelayan.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-warmwhite p-6 rounded-2xl border border-borderLight shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
              Ejen Berdaftar
            </span>
            <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center text-forest">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-forest-dark mt-2">
            {affiliates.length}
          </p>
          <span className="text-[11px] text-forest font-medium block mt-1">
            {activeCount} aktif menjana rujukan
          </span>
        </div>

        <div className="bg-warmwhite p-6 rounded-2xl border border-borderLight shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
              Jumlah Jualan (Order)
            </span>
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold-dark">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-forest-dark mt-2">
            {totalSalesCount}
          </p>
          <span className="text-[11px] text-secondary font-medium block mt-1">
            Pesanan melalui kod & link
          </span>
        </div>

        <div className="bg-warmwhite p-6 rounded-2xl border border-borderLight shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
              Hasil Jualan Rujukan
            </span>
            <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center text-forest">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-forest-dark mt-2">
            {formatMYR(totalRevenueSen)}
          </p>
          <span className="text-[11px] text-secondary font-medium block mt-1">
            Nilai jualan bersih (Gross GMV)
          </span>
        </div>

        <div className="bg-warmwhite p-6 rounded-2xl border border-borderLight shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
              Komisen Ejen (Payable)
            </span>
            <div className="w-8 h-8 rounded-full bg-sale/10 flex items-center justify-center text-sale">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-sale mt-2">
            {formatMYR(totalCommissionSen)}
          </p>
          <span className="text-[11px] text-secondary font-medium block mt-1">
            Perlu dibayar kepada ejen
          </span>
        </div>
      </div>

      {/* Controls: Search + Add Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            placeholder="Cari nama, kod ejen, atau emel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-warmwhite rounded-xl border border-borderLight text-xs outline-none focus:border-forest"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 bg-forest text-warmwhite text-xs font-bold rounded-xl hover:bg-forest-dark transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Daftar Ejen Affiliate Baru</span>
        </button>
      </div>

      {/* Affiliates Table */}
      <div className="bg-warmwhite rounded-2xl border border-borderLight shadow-sm overflow-hidden">
        {filteredAffiliates.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-secondary/40 mx-auto mb-3" />
            <p className="text-sm font-bold text-forest-dark">Tiada ejen affiliate dijumpai.</p>
            <p className="text-xs text-secondary mt-1">Daftar ejen pertama untuk mulakan promosi rujukan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream/60 border-b border-borderLight text-secondary uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Nama Ejen & Kontak</th>
                  <th className="py-3.5 px-4">Kod & Pautan Khas</th>
                  <th className="py-3.5 px-4">Kadar Komisen</th>
                  <th className="py-3.5 px-4">Bil. Jualan</th>
                  <th className="py-3.5 px-4">Jumlah Jualan (MYR)</th>
                  <th className="py-3.5 px-4">Komisen Terkumpul</th>
                  <th className="py-3.5 px-4">Akaun Bank Payout</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderLight/60">
                {filteredAffiliates.map((aff) => {
                  const isCopied = copiedCode === aff.code

                  return (
                    <tr key={aff.id} className="hover:bg-cream/20 transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-bold text-forest-dark block text-sm">{aff.name}</span>
                        <div className="flex items-center space-x-2 text-[10.5px] text-secondary mt-0.5">
                          {aff.phone && (
                            <span className="flex items-center space-x-0.5">
                              <Phone className="w-2.5 h-2.5 text-gold" />
                              <span>{aff.phone}</span>
                            </span>
                          )}
                          {aff.email && (
                            <span className="flex items-center space-x-0.5">
                              <Mail className="w-2.5 h-2.5 text-gold" />
                              <span className="truncate max-w-[120px]">{aff.email}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono font-bold px-2 py-0.5 rounded-full bg-gold/20 text-forest-dark text-[11px]">
                            {aff.code}
                          </span>
                          <button
                            onClick={() => handleCopyLink(aff.code)}
                            title="Salin pautan rujukan khas"
                            className="p-1 rounded hover:bg-cream text-secondary hover:text-forest transition-colors"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-forest font-bold" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <span className="text-[9.5px] text-secondary font-mono block mt-1">
                          {isCopied ? (
                            <span className="text-forest font-bold">Pautan disalin!</span>
                          ) : (
                            `?ref=${aff.code}`
                          )}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-bold text-charcoal">
                        {aff.commissionRate}% {aff.commissionType === 'percentage' ? 'Per Sale' : 'Tetap'}
                      </td>

                      <td className="py-4 px-4 font-bold text-forest-dark">
                        {aff.totalSalesCount || 0} order
                      </td>

                      <td className="py-4 px-4 font-bold text-forest">
                        {formatMYR(aff.totalSalesRevenueSen || 0)}
                      </td>

                      <td className="py-4 px-4 font-bold text-sale">
                        {formatMYR(aff.totalCommissionSen || 0)}
                      </td>

                      <td className="py-4 px-4 text-charcoal">
                        <span className="font-bold block text-[11px]">{aff.bankName || 'Maybank'}</span>
                        <span className="font-mono text-[10.5px] text-secondary">
                          {aff.bankAccountNumber || '— Belum diisi'}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleStatus(aff.id, aff.isActive)}
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                            aff.isActive
                              ? 'bg-forest/10 text-forest hover:bg-forest/20'
                              : 'bg-charcoal/10 text-secondary hover:bg-charcoal/20'
                          }`}
                        >
                          {aff.isActive ? 'Aktif' : 'Nyahaktif'}
                        </button>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleDelete(aff.id, aff.name)}
                          className="p-1.5 text-secondary hover:text-sale rounded-lg hover:bg-sale/10 transition-colors"
                          title="Padam ejen"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Register New Affiliate */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-forest-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-warmwhite w-full max-w-lg rounded-3xl border border-borderLight shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-forest text-warmwhite flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold">Daftar Ejen Affiliate KAMAAR</h3>
                <p className="text-xs text-warmwhite/80 mt-0.5">
                  Cipta kod khas untuk ejen kongsi di media sosial, TikTok, atau WhatsApp.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-warmwhite/80 hover:text-warmwhite rounded-lg hover:bg-warmwhite/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAffiliate} className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3 bg-sale/10 border border-sale/20 rounded-xl text-sale text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">
                    Nama Penuh Ejen <span className="text-sale">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ahmad Danial"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">
                    Kod Khas Affiliate <span className="text-sale">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: AFF-DANIAL"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2 text-xs bg-cream-light border border-borderLight rounded-xl uppercase font-mono outline-none focus:border-forest"
                  />
                  <span className="text-[10px] text-secondary mt-0.5 block">
                    Link: ?ref={code.trim().toUpperCase() || 'KOD'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">
                    Nombor Telefon / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="012 345 6789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">
                    Alamat Emel
                  </label>
                  <input
                    type="email"
                    placeholder="ejen@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-charcoal block mb-1">
                  Kadar Komisen (% Peratusan Jualan)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-28 px-3.5 py-2 text-xs bg-cream-light border border-borderLight rounded-xl outline-none focus:border-forest font-bold"
                  />
                  <span className="text-xs text-secondary font-medium">
                    % daripada nilai bersih tilam & perabot
                  </span>
                </div>
              </div>

              <div className="p-4 bg-cream/40 rounded-2xl border border-borderLight space-y-3">
                <span className="text-xs font-bold text-forest-dark block">
                  Maklumat Pembayaran Komisen (Payout)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-secondary block mb-1">
                      Bank Malaysia
                    </label>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-warmwhite border border-borderLight rounded-xl outline-none focus:border-forest"
                    >
                      {MALAYSIAN_BANKS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-secondary block mb-1">
                      Nombor Akaun Bank
                    </label>
                    <input
                      type="text"
                      placeholder="164012345678"
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-warmwhite border border-borderLight rounded-xl font-mono outline-none focus:border-forest"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-borderLight">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-secondary hover:text-charcoal transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Mendaftar...' : 'Sahkan & Cipta Kod'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
