'use client'

import React, { useState } from 'react'
import { Showroom, AppointmentRequest } from '@/types'
import { formatKLDate } from '@/lib/utils/format'
import { MapPin, Calendar, Plus, Edit2, CheckCircle, Clock, ExternalLink } from 'lucide-react'

interface ShowroomsClientProps {
  initialShowrooms: Showroom[]
  initialAppointments: AppointmentRequest[]
}

export function ShowroomsClient({
  initialShowrooms,
  initialAppointments,
}: ShowroomsClientProps) {
  const [showrooms, setShowrooms] = useState<Showroom[]>(initialShowrooms)
  const [appointments, setAppointments] = useState<AppointmentRequest[]>(initialAppointments)
  const [activeTab, setActiveTab] = useState<'showrooms' | 'appointments'>('showrooms')
  const [editingShowroom, setEditingShowroom] = useState<Showroom | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleSaveShowroom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingShowroom) return

    setIsSaving(true)
    setFeedback(null)

    try {
      const res = await fetch('/api/admin/showrooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showroom: editingShowroom }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setShowrooms((prev) => {
          const idx = prev.findIndex((s) => s.id === data.showroom.id)
          if (idx >= 0) {
            const next = [...prev]
            next[idx] = data.showroom
            return next
          }
          return [...prev, data.showroom]
        })
        setFeedback('Showroom studio saved.')
        setEditingShowroom(null)
      }
    } catch {
      setFeedback('Error saving showroom.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateAppointment = async (
    appointmentId: string,
    status: 'pending' | 'confirmed' | 'cancelled'
  ) => {
    try {
      const res = await fetch('/api/admin/showrooms', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, status }),
      })

      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === appointmentId ? { ...a, status } : a))
        )
        setFeedback(`Appointment marked as ${status}.`)
      }
    } catch {
      setFeedback('Failed to update appointment.')
    }
  }

  return (
    <div className="space-y-6">
      {feedback && (
        <div className="p-3 bg-forest/10 border border-forest/20 text-forest text-xs rounded-xl font-bold flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-borderLight pb-2 animate-fade-in-up">
        <button
          onClick={() => setActiveTab('showrooms')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center space-x-2 ${
            activeTab === 'showrooms'
              ? 'bg-forest text-warmwhite'
              : 'bg-warmwhite text-secondary hover:text-charcoal'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Showroom Studios ({showrooms.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center space-x-2 ${
            activeTab === 'appointments'
              ? 'bg-forest text-warmwhite'
              : 'bg-warmwhite text-secondary hover:text-charcoal'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Consultation Bookings ({appointments.length})</span>
        </button>
      </div>

      {activeTab === 'showrooms' ? (
        <div className="space-y-4 animate-fade-in-up delay-100">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setEditingShowroom({
                  id: `shw-${Date.now()}`,
                  name: 'KAMAAR Sleep Atelier',
                  slug: `studio-${Date.now()}`,
                  state: 'Kuala Lumpur',
                  address: 'Level 2, Premium Lifestyle Mall, Jalan Bukit Bintang',
                  phone: '+60 3-2141 8900',
                  openingHours: 'Daily: 10:00 AM – 9:00 PM',
                  mapUrl: 'https://maps.google.com',
                  image:
                    'https://images.unsplash.com/photo-1540518614846-7ede433c4550?q=80&w=800',
                  isActive: true,
                  displayOrder: showrooms.length + 1,
                })
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-forest text-warmwhite text-xs font-bold rounded-xl hover:bg-forest-dark transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-gold" />
              <span>Add Showroom Studio</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {showrooms.map((s) => (
              <div
                key={s.id}
                className="bg-warmwhite rounded-2xl border border-borderLight p-5 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-gold uppercase tracking-wider font-bold block">
                        {s.state}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-forest-dark">{s.name}</h3>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        s.isActive ? 'bg-forest/10 text-forest' : 'bg-sale/10 text-sale'
                      }`}
                    >
                      {s.isActive ? 'Open' : 'Inactive'}
                    </span>
                  </div>

                  <p className="text-xs text-secondary">{s.address}</p>

                  <div className="text-xs space-y-1 text-charcoal">
                    <p>
                      <strong>Hours:</strong> {s.openingHours}
                    </p>
                    <p>
                      <strong>Phone:</strong> {s.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-borderLight text-xs">
                  <a
                    href={s.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-forest hover:underline flex items-center space-x-1"
                  >
                    <span>View Map</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => setEditingShowroom({ ...s })}
                    className="flex items-center space-x-1 text-forest font-bold hover:underline"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Studio</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-warmwhite rounded-2xl border border-borderLight shadow-sm overflow-hidden">
          {appointments.length === 0 ? (
            <div className="p-8 text-center text-xs text-secondary">
              No private mattress consultation bookings recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream/60 border-b border-borderLight text-secondary uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Studio / Preferred Date</th>
                    <th className="py-3.5 px-4">Notes</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderLight/60">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-cream/20 transition-colors">
                      <td className="py-4 px-4 font-bold text-forest-dark">{apt.customerName}</td>
                      <td className="py-4 px-4 text-secondary">
                        <div>{apt.customerEmail}</div>
                        <div>{apt.customerPhone}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-charcoal block">{apt.showroomId}</span>
                        <span className="text-[10px] text-secondary">
                          {apt.preferredDate} at {apt.preferredTime}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-secondary max-w-xs truncate">
                        {apt.notes || 'None'}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            apt.status === 'confirmed'
                              ? 'bg-forest/10 text-forest'
                              : apt.status === 'cancelled'
                              ? 'bg-sale/10 text-sale'
                              : 'bg-gold/20 text-forest-dark'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        {apt.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateAppointment(apt.id, 'confirmed')}
                            className="px-2.5 py-1 bg-forest text-warmwhite text-[10px] font-bold rounded hover:bg-forest-dark"
                          >
                            Confirm
                          </button>
                        )}
                        {apt.status !== 'cancelled' && (
                          <button
                            onClick={() => handleUpdateAppointment(apt.id, 'cancelled')}
                            className="px-2.5 py-1 border border-sale text-sale text-[10px] font-bold rounded hover:bg-sale/10"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Edit Showroom Modal */}
      {editingShowroom && (
        <div className="fixed inset-0 z-50 bg-forest-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-warmwhite w-full max-w-md rounded-3xl border border-borderLight shadow-2xl overflow-hidden">
            <div className="p-6 bg-forest-dark text-warmwhite flex items-center justify-between border-b border-borderLight/20">
              <h3 className="font-serif text-lg font-bold">Edit Showroom Studio</h3>
              <button
                onClick={() => setEditingShowroom(null)}
                className="text-warmwhite/60 hover:text-warmwhite text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveShowroom} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-forest-dark mb-1">Studio Name *</label>
                <input
                  type="text"
                  required
                  value={editingShowroom.name}
                  onChange={(e) =>
                    setEditingShowroom({ ...editingShowroom, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-borderLight"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-dark mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={editingShowroom.state}
                  onChange={(e) =>
                    setEditingShowroom({ ...editingShowroom, state: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-borderLight"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-dark mb-1">Full Address *</label>
                <textarea
                  rows={2}
                  required
                  value={editingShowroom.address}
                  onChange={(e) =>
                    setEditingShowroom({ ...editingShowroom, address: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-borderLight"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-dark mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingShowroom.phone}
                    onChange={(e) =>
                      setEditingShowroom({ ...editingShowroom, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-borderLight"
                  />
                </div>
                <div>
                  <label className="block font-bold text-forest-dark mb-1">Opening Hours</label>
                  <input
                    type="text"
                    value={editingShowroom.openingHours}
                    onChange={(e) =>
                      setEditingShowroom({ ...editingShowroom, openingHours: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-borderLight"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-forest-dark mb-1">Google Maps URL</label>
                <input
                  type="url"
                  value={editingShowroom.mapUrl}
                  onChange={(e) =>
                    setEditingShowroom({ ...editingShowroom, mapUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-borderLight"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveShowroom"
                  checked={editingShowroom.isActive}
                  onChange={(e) =>
                    setEditingShowroom({ ...editingShowroom, isActive: e.target.checked })
                  }
                  className="w-4 h-4 accent-forest"
                />
                <label htmlFor="isActiveShowroom" className="font-bold text-forest-dark cursor-pointer">
                  Showroom is open and receiving appointments
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-borderLight">
                <button
                  type="button"
                  onClick={() => setEditingShowroom(null)}
                  className="px-4 py-2 font-bold text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-forest text-warmwhite font-bold rounded-xl hover:bg-forest-dark shadow-sm"
                >
                  {isSaving ? 'Saving...' : 'Save Showroom'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
