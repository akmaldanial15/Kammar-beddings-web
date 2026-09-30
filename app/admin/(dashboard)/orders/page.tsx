import React from 'react'
import { getOrders } from '@/lib/db'
import { OrdersClient } from './OrdersClient'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-forest-dark">Orders & Fulfilment</h1>
        <p className="text-sm text-secondary mt-1">
          Track customer purchases, schedule bulky mattress white-glove delivery, and manage payment states.
        </p>
      </div>

      <OrdersClient initialOrders={orders} />
    </div>
  )
}
