'use client'

import React, { useState } from 'react'
import { AuditLog } from '@/types'
import { formatKLDate } from '@/lib/utils/format'
import {
  Trash2,
  AlertTriangle,
  Search,
  Filter,
  CheckSquare,
  Square,
  RefreshCw,
  Eye,
  X,
  CheckCircle2,
  ShieldCheck,
  Info,
} from 'lucide-react'

interface AuditsClientProps {
  initialLogs: AuditLog[]
}

export function AuditsClient({ initialLogs }: AuditsClientProps) {
  const [logs, setLogs] = useState<AuditLog[]>(initialLogs)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Modals state
  const [confirmClearAll, setConfirmClearAll] = useState(false)
  const [confirmDeleteSelected, setConfirmDeleteSelected] = useState(false)
  const [deleteSingleItem, setDeleteSingleItem] = useState<AuditLog | null>(null)
  const [viewMetadataItem, setViewMetadataItem] = useState<AuditLog | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 4000)
  }

  // Filter logs based on search query and category
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      log.actorEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.entityId && log.entityId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.details && JSON.stringify(log.details).toLowerCase().includes(searchQuery.toLowerCase()))

    if (!matchesSearch) return false

    if (actionFilter === 'all') return true
    if (actionFilter === 'auth') return log.action.includes('login') || log.action.includes('logged')
    if (actionFilter === 'stock') return log.action.includes('stock')
    if (actionFilter === 'order') return log.action.includes('order') || log.action.includes('refund')
    if (actionFilter === 'settings')
      return (
        log.action.includes('config') ||
        log.action.includes('setting') ||
        log.action.includes('category') ||
        log.action.includes('product')
      )

    return true
  })

  // Select / Deselect All
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredLogs.length && filteredLogs.length > 0) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredLogs.map((l) => l.id))
    }
  }

  const handleToggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  // Refresh logs from API
  const refreshLogs = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/audits')
      if (res.ok) {
        const data = await res.json()
        setLogs(data.logs || [])
        setSelectedIds([])
      }
    } catch {
      showToast('Gagal memuat semula log', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Delete Single Log
  const handleDeleteSingle = async (log: AuditLog) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/audits?id=${encodeURIComponent(log.id)}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setLogs((prev) => prev.filter((item) => item.id !== log.id))
        setSelectedIds((prev) => prev.filter((id) => id !== log.id))
        showToast('Rekod audit berjaya dipadam.')
      } else {
        showToast(data.error || 'Gagal memadam rekod log', 'error')
      }
    } catch {
      showToast('Ralat sambungan rangkaian', 'error')
    } finally {
      setIsLoading(false)
      setDeleteSingleItem(null)
    }
  }

  // Delete Selected Logs (Bulk)
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/audits', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        const set = new Set(selectedIds)
        setLogs((prev) => prev.filter((item) => !set.has(item.id)))
        setSelectedIds([])
        showToast(`${data.count || selectedIds.length} rekod audit berjaya dipadam.`)
      } else {
        showToast(data.error || 'Gagal memadam rekod terpilih', 'error')
      }
    } catch {
      showToast('Ralat sambungan rangkaian', 'error')
    } finally {
      setIsLoading(false)
      setConfirmDeleteSelected(false)
    }
  }

  // Clear All Logs
  const handleClearAll = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/audits?all=true', {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setLogs([])
        setSelectedIds([])
        showToast('Semua rekod audit trail telah berjaya dikosongkan.')
      } else {
        showToast(data.error || 'Gagal mengosongkan log', 'error')
      }
    } catch {
      showToast('Ralat sambungan rangkaian', 'error')
    } finally {
      setIsLoading(false)
      setConfirmClearAll(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-xs font-semibold text-white transition-all transform animate-fade-in ${
            toast.type === 'success' ? 'bg-forest' : 'bg-rose-600'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-200" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Info Banner & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Info & Capacity Indicator */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-4 sm:p-5 border border-borderLight shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-forest/10 border border-forest/15 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-forest" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-forest-dark text-sm">
                  Kapasiti Simpanan Audit Trail
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  Maksimum 100 Rekod
                </span>
              </div>
              <p className="text-xs text-secondary mt-0.5">
                Sistem automatik mengehadkan kepada <strong>100 rekod terawal/terkini</strong> untuk memastikan kelajuan &amp; prestasi sistem sentiasa pantas.
              </p>
            </div>
          </div>

          <div className="text-right flex-shrink-0 pl-3 border-l border-borderLight">
            <span className="font-serif text-xl sm:text-2xl font-bold text-forest-dark block">
              {logs.length} <span className="text-xs text-secondary font-sans font-normal">/ 100</span>
            </span>
            <span className="text-[10px] text-secondary">Tersimpan</span>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="lg:col-span-5 flex flex-wrap items-center justify-start lg:justify-end gap-2.5">
          <button
            onClick={refreshLogs}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-white border border-borderLight hover:bg-cream/40 text-forest-dark transition-all disabled:opacity-50"
            title="Muat Semula Rekod"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {selectedIds.length > 0 && (
            <button
              onClick={() => setConfirmDeleteSelected(true)}
              disabled={isLoading}
              className="px-3.5 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
            >
              <Trash2 className="w-4 h-4" />
              <span>Padam Terpilih ({selectedIds.length})</span>
            </button>
          )}

          <button
            onClick={() => setConfirmClearAll(true)}
            disabled={isLoading || logs.length === 0}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 hover:text-rose-800 border border-borderLight hover:border-rose-200 text-xs font-bold transition-all flex items-center gap-2 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Kosongkan Semua Log</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-borderLight shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari staf, tindakan, entiti, atau data..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-cream/40 border border-borderLight text-xs focus:outline-none focus:border-gold focus:bg-white transition-all text-charcoal"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-charcoal"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'auth', label: 'Log Masuk' },
            { id: 'stock', label: 'Stok' },
            { id: 'order', label: 'Pesanan' },
            { id: 'settings', label: 'Tetapan & Laman' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActionFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                actionFilter === cat.id
                  ? 'bg-forest text-warmwhite shadow-xs'
                  : 'bg-cream/40 text-secondary hover:text-forest-dark hover:bg-cream/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-borderLight shadow-xs overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Info className="w-8 h-8 text-secondary/40 mx-auto" />
            <p className="text-sm font-semibold text-forest-dark">Tiada Rekod Audit Ditemui</p>
            <p className="text-xs text-secondary max-w-sm mx-auto">
              {logs.length === 0
                ? 'Tiada rekod audit log tersimpan pada masa ini.'
                : 'Tiada rekod yang sepadan dengan carian atau penapis anda.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] border-b border-borderLight text-secondary uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 w-10 text-center">
                    <button
                      onClick={handleToggleSelectAll}
                      className="text-secondary hover:text-forest-dark transition-colors"
                      title={selectedIds.length === filteredLogs.length ? 'Nyahpilih Semua' : 'Pilih Semua'}
                    >
                      {selectedIds.length > 0 && selectedIds.length === filteredLogs.length ? (
                        <CheckSquare className="w-4 h-4 text-forest" />
                      ) : selectedIds.length > 0 ? (
                        <div className="w-4 h-4 bg-forest/20 border border-forest rounded flex items-center justify-center">
                          <div className="w-2 h-0.5 bg-forest" />
                        </div>
                      ) : (
                        <Square className="w-4 h-4 text-secondary/60" />
                      )}
                    </button>
                  </th>
                  <th className="py-3.5 px-4">Masa (MYT)</th>
                  <th className="py-3.5 px-4">Staf / Pelaku</th>
                  <th className="py-3.5 px-4">Tindakan</th>
                  <th className="py-3.5 px-4">Entiti Terlibat</th>
                  <th className="py-3.5 px-4">Metadata Perubahan</th>
                  <th className="py-3.5 px-4 text-right">Pilihan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderLight/60">
                {filteredLogs.map((log) => {
                  const isSelected = selectedIds.includes(log.id)
                  return (
                    <tr
                      key={log.id}
                      className={`hover:bg-[#FAF7F2]/50 transition-colors ${
                        isSelected ? 'bg-forest/5' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleSelectOne(log.id)}
                          className="text-secondary hover:text-forest-dark transition-colors"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-forest" />
                          ) : (
                            <Square className="w-4 h-4 text-secondary/50" />
                          )}
                        </button>
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-4 font-mono text-secondary text-[11px] whitespace-nowrap">
                        {formatKLDate(log.createdAt)}
                      </td>

                      {/* Staff Actor */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-forest-dark block truncate max-w-[180px]">
                          {log.actorEmail}
                        </span>
                      </td>

                      {/* Action Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            log.action.includes('refund') || log.action.includes('cleared')
                              ? 'bg-rose-100 text-rose-800'
                              : log.action.includes('stock')
                              ? 'bg-amber-100 text-amber-900'
                              : log.action.includes('order')
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-emerald-100 text-emerald-900'
                          }`}
                        >
                          {log.action.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Entity */}
                      <td className="py-3.5 px-4 font-mono text-charcoal">
                        <span className="font-semibold">{log.entityType}</span>
                        {log.entityId && (
                          <span className="text-secondary text-[10px] block truncate max-w-[150px]">
                            #{log.entityId}
                          </span>
                        )}
                      </td>

                      {/* Change Metadata */}
                      <td className="py-3.5 px-4">
                        {log.details ? (
                          <div className="flex items-center gap-2">
                            <span className="max-w-[180px] truncate font-mono text-[10px] text-secondary">
                              {JSON.stringify(log.details)}
                            </span>
                            <button
                              onClick={() => setViewMetadataItem(log)}
                              className="p-1 rounded hover:bg-cream/80 text-forest transition-colors flex-shrink-0"
                              title="Lihat Butiran Penuh"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-secondary text-[10px]">—</span>
                        )}
                      </td>

                      {/* Row Delete Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setDeleteSingleItem(log)}
                          disabled={isLoading}
                          className="p-1.5 rounded-lg text-secondary hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Padam rekod ini"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Modal: View Formatted Metadata */}
      {viewMetadataItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-borderLight animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-forest-dark">
                  Butiran Metadata Log
                </h3>
                <p className="text-xs text-secondary">
                  {viewMetadataItem.action} &bull; {viewMetadataItem.actorEmail}
                </p>
              </div>
              <button
                onClick={() => setViewMetadataItem(null)}
                className="p-1.5 rounded-xl hover:bg-cream text-secondary hover:text-charcoal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#1B2A1E] text-emerald-300 font-mono text-xs p-4 rounded-xl max-h-72 overflow-y-auto leading-relaxed">
              <pre>{JSON.stringify(viewMetadataItem.details, null, 2)}</pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewMetadataItem(null)}
                className="px-4 py-2 rounded-xl bg-forest text-warmwhite text-xs font-bold hover:bg-forest-light transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirm Delete Single Log */}
      {deleteSingleItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-borderLight animate-fade-in-up">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif text-lg font-bold text-forest-dark">
                Padam Rekod Audit Log Ini?
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                Adakah anda pasti ingin memadam rekod tindakan{' '}
                <strong className="text-charcoal">
                  {deleteSingleItem.action.replace(/_/g, ' ')}
                </strong>{' '}
                oleh <strong className="text-charcoal">{deleteSingleItem.actorEmail}</strong>? Tindakan ini tidak boleh diundur.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteSingleItem(null)}
                className="flex-1 py-2.5 rounded-xl border border-borderLight hover:bg-cream/40 text-xs font-semibold text-secondary transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteSingle(deleteSingleItem)}
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Memadam...' : 'Ya, Padam Rekod'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirm Delete Selected Logs */}
      {confirmDeleteSelected && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-borderLight animate-fade-in-up">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif text-lg font-bold text-forest-dark">
                Padam {selectedIds.length} Rekod Terpilih?
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                Anda telah memilih <strong>{selectedIds.length} rekod</strong> untuk dipadam. Rekod yang dipadam tidak boleh dipulihkan semula.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setConfirmDeleteSelected(false)}
                className="flex-1 py-2.5 rounded-xl border border-borderLight hover:bg-cream/40 text-xs font-semibold text-secondary transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteSelected}
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Memadam...' : `Padam (${selectedIds.length}) Rekod`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirm Clear All Logs */}
      {confirmClearAll && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-borderLight animate-fade-in-up">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-300 text-rose-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif text-lg font-bold text-forest-dark">
                Kosongkan Semua Audit Trail?
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                Amaran: Tindakan ini akan memadam <strong>semua {logs.length} rekod audit log</strong> dalam pangkalan data. Anda tidak akan dapat melihat sejarah log terdahulu lagi.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setConfirmClearAll(false)}
                className="flex-1 py-2.5 rounded-xl border border-borderLight hover:bg-cream/40 text-xs font-semibold text-secondary transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleClearAll}
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors disabled:opacity-50 shadow-md"
              >
                {isLoading ? 'Memadam Semua...' : 'Ya, Kosongkan Semua'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
