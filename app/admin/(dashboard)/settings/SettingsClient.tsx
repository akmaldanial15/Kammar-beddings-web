'use client'

import React, { useState } from 'react'
import { SiteSettings } from '@/types'
import { Save, CheckCircle, AlertCircle, Building, Phone, Mail, MessageSquare, Truck, Bell } from 'lucide-react'

interface SettingsClientProps {
  initialSettings: SiteSettings
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setFeedback(null)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSettings(data.settings)
        setFeedback({ text: 'Site settings updated and saved to persistent database.', type: 'success' })
      } else {
        setFeedback({ text: data.error || 'Failed to save settings.', type: 'error' })
      }
    } catch {
      setFeedback({ text: 'Network failure while saving settings.', type: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-sm ${
            feedback.type === 'success'
              ? 'bg-forest/10 border border-forest/20 text-forest-dark'
              : 'bg-sale/10 border border-sale/20 text-sale'
          }`}
        >
          <div className="flex items-center space-x-2">
            {feedback.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-forest" />
            ) : (
              <AlertCircle className="w-5 h-5 text-sale" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-xs font-bold underline">
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand & Store Identity */}
        <div className="bg-warmwhite p-6 rounded-2xl border border-borderLight shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-borderLight pb-3">
            <Building className="w-4 h-4 text-gold" />
            <h3 className="font-serif text-lg font-bold text-forest-dark">
              Brand Identity & Atelier Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-forest-dark mb-1">
                Brand Name * (Customizable)
              </label>
              <input
                type="text"
                required
                value={settings.brandName}
                onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-borderLight focus:border-forest"
              />
              <span className="text-[10px] text-secondary mt-1 block">
                Update brand name dynamically across the storefront and admin.
              </span>
            </div>

            <div>
              <label className="block font-bold text-forest-dark mb-1">
                Tagline / Brand Philosophy
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-borderLight focus:border-forest"
              />
            </div>
          </div>
        </div>

        {/* Storefront Announcement Bar */}
        <div className="bg-warmwhite p-6 rounded-2xl border border-borderLight shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-borderLight pb-3">
            <Bell className="w-4 h-4 text-gold" />
            <h3 className="font-serif text-lg font-bold text-forest-dark">
              Top Announcement Banner
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-forest-dark mb-1">
                Announcement Message (Displayed on all public pages)
              </label>
              <input
                type="text"
                value={settings.announcementText}
                onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-borderLight focus:border-forest"
              />
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="isAnnounceActive"
                checked={Boolean(settings.isAnnouncementActive ?? settings.announcementActive)}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    isAnnouncementActive: e.target.checked,
                    announcementActive: e.target.checked,
                  })
                }
                className="w-4 h-4 accent-forest"
              />
              <label htmlFor="isAnnounceActive" className="font-bold text-forest-dark cursor-pointer">
                Display announcement bar to storefront visitors
              </label>
            </div>
          </div>
        </div>

        {/* Contact Channels & Concierge */}
        <div className="bg-warmwhite p-6 rounded-2xl border border-borderLight shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-borderLight pb-3">
            <Phone className="w-4 h-4 text-gold" />
            <h3 className="font-serif text-lg font-bold text-forest-dark">
              Concierge & Customer Care Channels
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-forest-dark mb-1">
                Contact Phone Number
              </label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-borderLight focus:border-forest"
              />
            </div>

            <div>
              <label className="block font-bold text-forest-dark mb-1">
                Concierge Email Address
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-borderLight focus:border-forest"
              />
            </div>

            <div>
              <label className="block font-bold text-forest-dark mb-1">
                WhatsApp Direct Link Number
              </label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="+60123456789"
                className="w-full px-3 py-2 rounded-xl border border-borderLight focus:border-forest"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Commerce Thresholds */}
        <div className="bg-warmwhite p-6 rounded-2xl border border-borderLight shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-borderLight pb-3">
            <Truck className="w-4 h-4 text-gold" />
            <h3 className="font-serif text-lg font-bold text-forest-dark">
              Malaysian Shipping & Free Delivery Threshold
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-forest-dark mb-1">
                Free Delivery Threshold (RM)
              </label>
              <input
                type="number"
                step="0.01"
                value={(settings.freeShippingThresholdSen / 100).toFixed(2)}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0
                  setSettings({ ...settings, freeShippingThresholdSen: Math.round(val * 100) })
                }}
                className="w-full px-3 py-2 rounded-xl border border-borderLight focus:border-forest font-mono"
              />
              <span className="text-[10px] text-secondary mt-1 block">
                Orders with accessories exceeding this value qualify for free Peninsular delivery. Mattresses include complimentary white-glove installation.
              </span>
            </div>

            <div>
              <label className="block font-bold text-forest-dark mb-1">
                Currency Code & Symbol
              </label>
              <input
                type="text"
                disabled
                value={`${settings.currency} (${settings.currencySymbol})`}
                className="w-full px-3 py-2 rounded-xl border border-borderLight bg-cream/40 text-secondary"
              />
              <span className="text-[10px] text-secondary mt-1 block">
                Standardized to Malaysian Ringgit (MYR). Formatted as RM1,299.00.
              </span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-2.5 bg-forest text-warmwhite text-xs font-bold rounded-xl hover:bg-forest-dark transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-gold" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Site Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
