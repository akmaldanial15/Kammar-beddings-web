import React from 'react'
import { getOrderById } from '@/lib/db'
import { notFound } from 'next/navigation'
import { OrderDetailAdminClient } from './OrderDetailAdminClient'

export const dynamic = 'force-dynamic'

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const order = await getOrderById(params.id)
  if (!order) {
    notFound()
  }

  return (
    <div className="p-6 md:p-10 space-y-8">
      <OrderDetailAdminClient initialOrder={order} />
    </div>
  )
}
