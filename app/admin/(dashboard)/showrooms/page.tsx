import React from 'react'
import { getShowrooms, getAppointments } from '@/lib/db'
import { ShowroomsClient } from './ShowroomsClient'

export const dynamic = 'force-dynamic'

export default async function AdminShowroomsPage() {
  const showrooms = await getShowrooms()
  const appointments = await getAppointments()

  return (
    <div className="p-6 md:p-10 space-y-8 animate-fade-in">
      <div>
        <h1 className="font-serif text-3xl font-bold text-forest-dark">Showroom Studios & Appointments</h1>
        <p className="text-sm text-secondary mt-1">
          Manage physical showroom galleries across Malaysia and confirm private customer mattress testing sessions.
        </p>
      </div>

      <ShowroomsClient initialShowrooms={showrooms} initialAppointments={appointments} />
    </div>
  )
}
