'use client'

import React, { useState } from 'react'
import { Phone, Mail, MessageSquare, MapPin, CheckCircle2, Clock } from 'lucide-react'

export function ContactClient() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('Product Recommendation')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message }),
      })

      if (res.ok) {
        setIsSuccess(true)
      }
    } catch {
      alert('Error sending message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Contact Channels Card */}
      <div className="bg-forest-dark text-warmwhite p-8 rounded-3xl space-y-6 shadow-xl flex flex-col justify-between">
        <div className="space-y-6">
          <h3 className="font-serif text-2xl font-bold text-warmwhite">
            Saluran Hubungan Kilang
          </h3>

          <div className="space-y-4 text-xs text-warmwhite/80">
            <div className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-warmwhite block">Alamat Kilang & Stor</span>
                <span>TUNAS SINAR JAYA ENTERPRISE</span>
                <span className="block text-warmwhite/70">7878B Jalan Permatang Berangan, 13300 Tasek Gelugor, Pulau Pinang</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-warmwhite block">Telefon / WhatsApp</span>
                <a href="https://wa.me/601164447908" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                  011-6444 7908
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-warmwhite block">Emel Rasmi</span>
                <span>tunassinar@gmail.com</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-warmwhite block">Waktu Operasi Kilang</span>
                <span>Isnin – Sabtu: 8:30 AM – 6:00 PM</span>
                <span className="block text-warmwhite/70">Ahad: Jualan Gudang & Temujanji Borong</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-warmwhite/10 text-xs text-warmwhite/70">
          <p>
            Pengeluar tekstil Bumiputera dengan penghantaran pantas ke seluruh Semenanjung Malaysia.
          </p>
        </div>
      </div>

      {/* Inquiry Form */}
      <div className="md:col-span-2 bg-warmwhite p-8 rounded-3xl border border-borderLight shadow-sm">
        {isSuccess ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-14 h-14 rounded-full bg-forest text-gold flex items-center justify-center mx-auto shadow">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="font-serif text-2xl font-bold text-forest-dark">
              Enquiry Received
            </h4>
            <p className="text-xs text-secondary max-w-sm mx-auto leading-relaxed">
              Thank you for reaching out. One of our senior bedding advisors will respond within 4 business hours via email or WhatsApp.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false)
                setMessage('')
              }}
              className="px-6 py-2.5 bg-forest text-warmwhite text-xs font-bold rounded-xl hover:bg-forest-dark"
            >
              Send Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-forest-dark mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-borderLight focus:border-forest"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-dark mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-borderLight focus:border-forest"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-forest-dark mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="012-345 6789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-borderLight focus:border-forest"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-dark mb-1">Inquiry Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-borderLight focus:border-forest bg-warmwhite"
                >
                  <option value="Product Recommendation">Product & Firmness Advice</option>
                  <option value="Order Status">Delivery & Order Status</option>
                  <option value="Warranty Claim">10-Year Warranty Claim</option>
                  <option value="Custom Sizing">Custom Sizing / Bedframe Fitting</option>
                  <option value="Other Inquiry">Other Inquiry</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-forest-dark mb-1">Message *</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can our sleep team help you today?"
                className="w-full px-3 py-2.5 rounded-xl border border-borderLight focus:border-forest"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-forest text-warmwhite font-bold text-xs rounded-xl hover:bg-forest-dark transition-colors shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Inquiry to Concierge'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
