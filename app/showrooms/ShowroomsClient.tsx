'use client'

import React, { useState } from 'react'
import { Showroom } from '@/types'
import { MapPin, Phone, Clock, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react'

interface ShowroomsClientProps {
  showrooms: Showroom[]
}

export function ShowroomsClient({ showrooms }: ShowroomsClientProps) {
  const [selectedState, setSelectedState] = useState<string>('all')
  const [bookingShowroom, setBookingShowroom] = useState<Showroom | null>(null)

  // Booking Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [preferredDate, setPreferredDate] = useState('')
  const [preferredTime, setPreferredTime] = useState('2:00 PM')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)

  const states = ['all', ...Array.from(new Set(showrooms.map((s) => s.state)))]

  const filtered = showrooms.filter(
    (s) => selectedState === 'all' || s.state === selectedState
  )

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookingShowroom) return

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          showroomId: bookingShowroom.name,
          preferredDate,
          preferredTime,
          notes,
        }),
      })

      if (res.ok) {
        setBookingConfirmed(true)
      }
    } catch {
      alert('Failed to book appointment. Please call our studio directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-10">
      {/* State Filter Pills */}
      <div className="flex items-center justify-center flex-wrap gap-2">
        {states.map((st) => (
          <button
            key={st}
            onClick={() => setSelectedState(st)}
            className={`px-5 py-2 rounded-full text-xs font-bold capitalize transition-all ${
              selectedState === st
                ? 'bg-forest text-warmwhite shadow-md'
                : 'bg-warmwhite border border-borderLight text-secondary hover:text-charcoal'
            }`}
          >
            {st === 'all' ? 'All Malaysian Studios' : st}
          </button>
        ))}
      </div>

      {/* Showroom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="bg-warmwhite rounded-3xl border border-borderLight overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={s.image || s.imageUrl || ''}
                  alt={s.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 px-3 py-1 bg-forest-dark/80 backdrop-blur-md text-gold text-xs font-bold rounded-full">
                  {s.state}
                </span>
              </div>

              <div className="p-6 md:p-8 space-y-4">
                <h3 className="font-serif text-2xl font-bold text-forest-dark">{s.name}</h3>

                <div className="space-y-2.5 text-xs text-secondary">
                  <div className="flex items-start space-x-2.5">
                    <MapPin className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
                    <span>{s.address}</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <Clock className="w-4 h-4 text-forest flex-shrink-0" />
                    <span>{s.openingHours}</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <Phone className="w-4 h-4 text-forest flex-shrink-0" />
                    <span className="font-medium text-charcoal">{s.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 pt-0 flex items-center justify-between gap-4">
              <a
                href={s.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-forest hover:underline flex items-center space-x-1"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => {
                  setBookingShowroom(s)
                  setBookingConfirmed(false)
                }}
                className="px-5 py-2.5 bg-forest text-warmwhite text-xs font-bold rounded-xl hover:bg-forest-dark transition-colors shadow-sm flex items-center space-x-2"
              >
                <Calendar className="w-3.5 h-3.5 text-gold" />
                <span>Book 1-on-1 Session</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {bookingShowroom && (
        <div className="fixed inset-0 z-50 bg-forest-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-warmwhite w-full max-w-lg rounded-3xl border border-borderLight shadow-2xl overflow-hidden">
            <div className="p-6 bg-forest-dark text-warmwhite flex items-center justify-between border-b border-borderLight/20">
              <div>
                <h3 className="font-serif text-lg font-bold text-warmwhite">
                  Book Private Sleep Fitting
                </h3>
                <span className="text-xs text-gold">{bookingShowroom.name}</span>
              </div>
              <button
                onClick={() => setBookingShowroom(null)}
                className="text-warmwhite/60 hover:text-warmwhite text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-forest text-gold flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-serif text-xl font-bold text-forest-dark">
                  Appointment Request Received
                </h4>
                <p className="text-xs text-secondary leading-relaxed">
                  Our sleep concierge at {bookingShowroom.name} will contact you via WhatsApp/Phone
                  within 2 hours to confirm your private room and prepare requested firmness profiles.
                </p>
                <button
                  onClick={() => setBookingShowroom(null)}
                  className="px-6 py-2.5 bg-forest text-warmwhite text-xs font-bold rounded-xl hover:bg-forest-dark"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleBook} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-forest-dark mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-borderLight focus:border-forest"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-forest-dark mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-borderLight focus:border-forest"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-forest-dark mb-1">Phone (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="012-345 6789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-borderLight focus:border-forest"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-forest-dark mb-1">Preferred Date *</label>
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-borderLight focus:border-forest"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-forest-dark mb-1">Preferred Time *</label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-borderLight focus:border-forest bg-warmwhite"
                    >
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="1:00 PM">1:00 PM</option>
                      <option value="2:30 PM">2:30 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                      <option value="6:00 PM">6:00 PM</option>
                      <option value="7:30 PM">7:30 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-forest-dark mb-1">
                    Special Sleep Inquiries or Pain Concerns (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="cth: Pertanyaan tempahan borong asrama, pilihan corak tilam toto, atau saiz kekabu..."
                    className="w-full px-3 py-2 rounded-xl border border-borderLight focus:border-forest"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-borderLight">
                  <button
                    type="button"
                    onClick={() => setBookingShowroom(null)}
                    className="px-4 py-2 font-bold text-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-forest text-warmwhite font-bold rounded-xl hover:bg-forest-dark shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? 'Booking...' : 'Confirm Appointment Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
