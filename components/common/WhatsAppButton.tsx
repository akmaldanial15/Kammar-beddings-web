'use client'

import React, { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'

interface WhatsAppButtonProps {
  phoneNumber?: string
}

export function WhatsAppButton({ phoneNumber = '+601164447908' }: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!phoneNumber) return null

  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '')
  const defaultMessage = encodeURIComponent(
    'Salam Tunas Sinar Jaya (Kamaar Beddings), saya berminat untuk bertanya tentang tilam toto, tilam lipat, bantal atau tempahan borong kilang.'
  )
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${defaultMessage}`

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {isOpen && (
        <div className="mb-3 w-72 bg-warmwhite rounded-xl shadow-2xl border border-borderLight p-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-borderLight">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-forest">Tunas Sinar Jaya (Kamaar)</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-charcoal-muted hover:text-charcoal p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
            Perlukan bantuan tempahan tilam toto, tilam lipat, bantal gebu atau belian borong asrama? Hubungi pengurusan kilang kami di Tasek Gelugor terus via WhatsApp.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat WhatsApp Kilang</span>
          </a>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 group"
        aria-label="Hubungi via WhatsApp"
        title="WhatsApp Tunas Sinar Jaya Kilang"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  )
}
