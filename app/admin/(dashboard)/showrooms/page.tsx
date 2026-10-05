import React from 'react'
import { getShowrooms, getAppointments } from '@/lib/db'
import { ShowroomsClient } from './ShowroomsClient'

export const dynamic = 'force-dynamic'

export default async function AdminShowroomsPage() {
  const showrooms = await getShowrooms(true)
  const appointments = await getAppointments()

  return <ShowroomsClient initialShowrooms={showrooms} initialAppointments={appointments} />
}
