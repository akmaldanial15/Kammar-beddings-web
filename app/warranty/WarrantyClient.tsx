'use client'

import React, { useState } from 'react'
import { ShieldCheck, CheckCircle2, Search, FileText, Sparkles, Clock } from 'lucide-react'
import { formatKLDate } from '@/lib/utils/format'

interface WarrantyClientProps {
  mattressOptions: string[]
}

export function WarrantyClient({ mattressOptions }: WarrantyClientProps) {
  const [tab, setTab] = useState<'register' | 'lookup'>('register')

  // Register state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [productName, setProductName] = useState(mattressOptions[0] || 'Tilam Toto Asian Fibre Premium')
  const [purchaseDate, setPurchaseDate] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [retailer, setRetailer] = useState('KAMAAR Beddings / Kilang Tunas Sinar Jaya')
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registeredResult, setRegisteredResult] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Lookup state
  const [searchInvoice, setSearchInvoice] = useState('')
  const [lookupResult, setLookupResult] = useState<any>(null)
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [lookupError, setLookupError] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await fetch('/api/warranties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          productName,
          purchaseDate,
          deliveryDate,
          retailer,
          invoiceNumber,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setRegisteredResult(data.registration)
      } else {
        setErrorMsg(data.error || 'Failed to submit registration.')
      }
    } catch {
      setErrorMsg('Network error while registering warranty.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchInvoice.trim()) return

    setIsLookingUp(true)
    setLookupError(null)
    setLookupResult(null)

    try {
      const res = await fetch(`/api/warranties?invoice=${encodeURIComponent(searchInvoice.trim())}`)
      const data = await res.json()
      if (res.ok && data.warranty) {
        setLookupResult(data.warranty)
      } else {
        setLookupError('No warranty registration found for this invoice number. Please verify your invoice format or submit a new registration.')
      }
    } catch {
      setLookupError('Network failure while checking status.')
    } finally {
      setIsLookingUp(false)
    }
  }

  return (
    <div className="bg-warmwhite rounded-3xl border border-borderLight shadow-xl overflow-hidden">
      {/* Tab Selectors */}
      <div className="flex border-b border-borderLight bg-cream/30">
        <button
          onClick={() => setTab('register')}
          className={`flex-1 py-4 text-xs md:text-sm font-bold transition-all text-center flex items-center justify-center space-x-2 border-b-2 ${
            tab === 'register'
              ? 'border-forest text-forest bg-warmwhite'
              : 'border-transparent text-secondary hover:text-charcoal'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-gold" />
          <span>Register New Mattress</span>
        </button>

        <button
          onClick={() => setTab('lookup')}
          className={`flex-1 py-4 text-xs md:text-sm font-bold transition-all text-center flex items-center justify-center space-x-2 border-b-2 ${
            tab === 'lookup'
              ? 'border-forest text-forest bg-warmwhite'
              : 'border-transparent text-secondary hover:text-charcoal'
          }`}
        >
          <Search className="w-4 h-4 text-gold" />
          <span>Check Existing Certificate</span>
        </button>
      </div>

      <div className="p-6 md:p-10">
        {tab === 'register' ? (
          <div>
            {registeredResult ? (
              <div className="text-center py-8 space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-forest text-gold flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-forest-dark">
                  Warranty Successfully Registered
                </h3>
                <p className="text-xs text-secondary leading-relaxed">
                  Your 10-Year Comprehensive Warranty for <strong>{registeredResult.productName}</strong> has been logged in our central registry.
                </p>
                <div className="p-4 bg-cream/60 rounded-2xl border border-borderLight text-xs text-left space-y-1 font-mono">
                  <div>Certificate ID: {registeredResult.id}</div>
                  <div>Invoice Number: {registeredResult.invoiceNumber}</div>
                  <div>Status: Verified & Active</div>
                </div>
                <button
                  onClick={() => {
                    setRegisteredResult(null)
                    setInvoiceNumber('')
                  }}
                  className="px-6 py-2.5 bg-forest text-warmwhite text-xs font-bold rounded-xl hover:bg-forest-dark"
                >
                  Register Another Product
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-6">
                {errorMsg && (
                  <div className="p-4 rounded-xl bg-sale/10 border border-sale/20 text-sale text-xs font-bold">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-forest-dark mb-1">
                      Full Customer Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nurul Huda Binti Ahmad"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-borderLight focus:border-forest"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-forest-dark mb-1">
                      Email Address * (For certificate dispatch)
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. nurul@example.com.my"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-borderLight focus:border-forest"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-forest-dark mb-1">
                      Malaysian Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 012-345 6789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-borderLight focus:border-forest"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-forest-dark mb-1">
                      Mattress Model *
                    </label>
                    <select
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-borderLight focus:border-forest bg-warmwhite"
                    >
                      {mattressOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-forest-dark mb-1">
                      Official Invoice / Order Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. LENA-2026-1001 or INV-8921"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-borderLight focus:border-forest font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-forest-dark mb-1">
                      Purchased From
                    </label>
                    <input
                      type="text"
                      value={retailer}
                      onChange={(e) => setRetailer(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-borderLight focus:border-forest"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-forest-dark mb-1">
                      Purchase Date
                    </label>
                    <input
                      type="date"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-borderLight focus:border-forest"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-forest-dark mb-1">
                      Delivery Date
                    </label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-borderLight focus:border-forest"
                    />
                  </div>
                </div>

                <div className="p-4 bg-cream/40 rounded-2xl border border-borderLight text-xs text-secondary leading-relaxed">
                  <span className="font-bold text-forest-dark block mb-1">Syarat & Liputan Jaminan:</span>
                  Merangkumi kecacatan jahitan fabrik kilang, kerosakan zip keliling, dan penurunan mendadak keanjalan isian di bawah penggunaan domestik atau asrama yang wajar. Bantal dan kelengkapan lain dilindungi jaminan kilang standard.
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-forest text-warmwhite font-bold text-xs rounded-xl hover:bg-forest-dark transition-colors shadow-md disabled:opacity-50 flex items-center space-x-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-gold" />
                    <span>{isSubmitting ? 'Mendaftar...' : 'Aktifkan Jaminan Kilang'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <form onSubmit={handleLookup} className="flex gap-3 max-w-md">
              <input
                type="text"
                placeholder="No. Invois / Pesanan (cth: TSJ-2026-1001)"
                value={searchInvoice}
                onChange={(e) => setSearchInvoice(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-borderLight focus:border-forest font-mono"
              />
              <button
                type="submit"
                disabled={isLookingUp}
                className="px-5 py-2.5 bg-forest text-warmwhite text-xs font-bold rounded-xl hover:bg-forest-dark disabled:opacity-50"
              >
                {isLookingUp ? 'Mencari...' : 'Semak'}
              </button>
            </form>

            {lookupError && (
              <div className="p-4 rounded-xl bg-sale/10 border border-sale/20 text-sale text-xs">
                {lookupError}
              </div>
            )}

            {lookupResult && (
              <div className="p-6 bg-cream/50 rounded-2xl border border-borderLight space-y-4 max-w-lg">
                <div className="flex items-center justify-between border-b border-borderLight pb-3">
                  <h4 className="font-serif text-lg font-bold text-forest-dark">
                    Warranty Certificate
                  </h4>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      lookupResult.status === 'verified'
                        ? 'bg-forest/10 text-forest'
                        : lookupResult.status === 'rejected'
                        ? 'bg-sale/10 text-sale'
                        : 'bg-gold/20 text-forest-dark'
                    }`}
                  >
                    {lookupResult.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-secondary block">Model</span>
                    <span className="font-bold text-charcoal">{lookupResult.productName}</span>
                  </div>
                  <div>
                    <span className="text-secondary block">Customer</span>
                    <span className="font-bold text-charcoal">{lookupResult.customerName}</span>
                  </div>
                  <div>
                    <span className="text-secondary block">Invoice Number</span>
                    <span className="font-mono font-bold text-forest">{lookupResult.invoiceNumber}</span>
                  </div>
                  <div>
                    <span className="text-secondary block">Purchase Date</span>
                    <span className="font-medium text-charcoal">{lookupResult.purchaseDate}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
