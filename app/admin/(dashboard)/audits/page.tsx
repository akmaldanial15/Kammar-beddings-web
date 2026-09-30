import React from 'react'
import { getAuditLogs } from '@/lib/db'
import { formatKLDate } from '@/lib/utils/format'
import { History, Shield, User, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminAuditsPage() {
  const logs = await getAuditLogs()

  return (
    <div className="p-6 md:p-10 space-y-8 animate-fade-in">
      <div>
        <h1 className="font-serif text-3xl font-bold text-forest-dark">Administrative Audit Trail</h1>
        <p className="text-sm text-secondary mt-1">
          Immutable operational log tracking staff authentication, catalog adjustments, stock movements, and refunds.
        </p>
      </div>

      <div className="bg-warmwhite rounded-2xl border border-borderLight shadow-sm overflow-hidden animate-fade-in-up delay-100">
        {logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-secondary">
            No administrative events recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream/60 border-b border-borderLight text-secondary uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Timestamp (MYT)</th>
                  <th className="py-3.5 px-4">Staff Member</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Entity</th>
                  <th className="py-3.5 px-4">Change Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderLight/60">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-cream/20 transition-colors">
                    <td className="py-4 px-4 font-mono text-secondary text-[11px] whitespace-nowrap">
                      {formatKLDate(log.createdAt)}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-forest-dark block">{log.actorEmail}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          log.action.includes('refund')
                            ? 'bg-sale/10 text-sale'
                            : log.action.includes('stock')
                            ? 'bg-gold/20 text-forest-dark'
                            : 'bg-forest/10 text-forest'
                        }`}
                      >
                        {log.action.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-charcoal">
                      {log.entityType}
                      {log.entityId && (
                        <span className="text-secondary text-[10px] block">
                          #{log.entityId}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 max-w-xs truncate font-mono text-[10px] text-secondary">
                      {log.details ? JSON.stringify(log.details) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
