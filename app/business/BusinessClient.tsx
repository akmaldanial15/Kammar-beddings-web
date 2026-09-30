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
      {/* Hospitality Perks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-warmwhite p-6 rounded-2xl border border-borderLight shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center">
            <Hotel className="w-5 h-5" />
          </div>
          <h4 className="font-serif font-bold text-forest-dark text-lg">
            Commercial Fire-Retardant & Anti-Bacterial
          </h4>
          <p className="text-xs text-secondary leading-relaxed">
            Meets Malaysian and international hotel safety certifications with certified natural latex cores and sanitized damask covers.
          </p>
        </div>

        <div className="bg-warmwhite p-6 rounded-2xl border border-borderLight shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-gold/20 text-forest flex items-center justify-center">
            <Award className="w-5 h-5 text-gold" />
          </div>
          <h4 className="font-serif font-bold text-forest-dark text-lg">
            Custom Sizing & Dual Firmness
          </h4>
          <p className="text-xs text-secondary leading-relaxed">
            Tailored bespoke dimensions for luxury resort villas, custom upholstered bedframes, and zip-and-link twin/super king configurations.
          </p>
        </div>

        <div className="bg-warmwhite p-6 rounded-2xl border border-borderLight shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-serif font-bold text-forest-dark text-lg">
            Volume Pricing & Dedicated Account Director
          </h4>
          <p className="text-xs text-secondary leading-relaxed">
            Tiered commercial contract pricing, scheduled staggered site deliveries, and direct factory warranty guarantees.
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
              Hospitality RFP Received
            </h4>
            <p className="text-xs text-secondary max-w-md mx-auto leading-relaxed">
              Our Commercial Accounts Director will review your project requirements and prepare a formal quotation and sample swatch kit within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="border-b border-borderLight pb-4 mb-4">
              <h3 className="font-serif text-xl font-bold text-forest-dark">
                Request a Commercial Bedding Proposal
              </h3>
              <p className="text-secondary text-xs mt-1">
                Fill in your project specifications to receive contract pricing and sample units.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-forest-dark mb-1">Company / Organization *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Banjaran Hotsprings Retreat"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-borderLight focus:border-forest"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-dark mb-1">Contact Person *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Encik Farhan (Procurement Director)"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-borderLight focus:border-forest"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-forest-dark mb-1">Business Email *</label>
                <input
                  type="email"
                  required
                  placeholder="procurement@hotel.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-borderLight focus:border-forest"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-dark mb-1">Direct Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="03-1234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-borderLight focus:border-forest"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-forest-dark mb-1">Project Classification</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-borderLight focus:border-forest bg-warmwhite"
                >
                  <option value="Boutique Hotel / Luxury Villa">Boutique Hotel / Luxury Villa</option>
                  <option value="5-Star Commercial Hotel">5-Star Commercial Hotel</option>
                  <option value="Serviced Residence / AirBnB Host">Serviced Residence / AirBnB Host</option>
                  <option value="Interior Design / Architecture Firm">Interior Design / Architecture Firm</option>
                  <option value="Corporate / Healthcare">Corporate / Healthcare</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-forest-dark mb-1">Estimated Unit Requirement</label>
                <select
                  value={estimatedQuantity}
                  onChange={(e) => setEstimatedQuantity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-borderLight focus:border-forest bg-warmwhite"
                >
                  <option value="5–15 units">5–15 units</option>
                  <option value="20–50 units">20–50 units</option>
                  <option value="50–100 units">50–100 units</option>
                  <option value="100+ units">100+ units</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-forest-dark mb-1">Project Details & Delivery Timeline *</label>
              <textarea
                rows={3}
                required
                placeholder="Mention required sizes (King, Queen, Single), desired delivery date, and site location..."
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
                {isSubmitting ? 'Submitting...' : 'Request Contract Quotation'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
