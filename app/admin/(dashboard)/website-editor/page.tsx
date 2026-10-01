import React from 'react'
import { getWebsiteConfig } from '@/lib/db'
import { WebsiteEditorClient } from './WebsiteEditorClient'

export const dynamic = 'force-dynamic'

export default async function AdminWebsiteEditorPage() {
  const config = await getWebsiteConfig()

  return (
    <div className="p-3 sm:p-6 md:p-8 space-y-4 sm:space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-borderLight/60 pb-3 sm:pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#937B3C] border border-[#B49A58]/30">
              Pengurus Visual & Kandungan
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="font-serif text-xl sm:text-3xl font-bold text-forest-dark mt-1">
            Website Visual & Content Editor
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-0.5 max-w-2xl line-clamp-2 sm:line-clamp-none">
            Ubah suai tema warna jenama, gambar hiasan latar, slaid utama, palang pengumuman, kisah atelier, dan pautan media sosial secara langsung.
          </p>
        </div>
      </div>

      <WebsiteEditorClient initialConfig={config} />
    </div>
  )
}
