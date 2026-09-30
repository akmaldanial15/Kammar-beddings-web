'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle, CheckCircle, XCircle, ArrowLeft, ShieldAlert, CreditCard, Building2 } from 'lucide-react'
import { Order } from '@/types'
import { formatMYR } from '@/lib/utils/format'

interface Props {
  params: { orderId: string }
}

export default function SandboxPaymentPage({ params }: Props) {
  const { orderId } = params
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [simulating, setSimulating] = useState(false)

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`)
        if (res.ok) {
          const data = await res.json()
          setOrder(data.order)
        }
      } catch (err) {
        console.error('Failed to load order:', err)
      } finally {
        setLoading(false)
      }
    }
    loadOrder()
  }, [orderId])

  const handleSimulatePayment = async (status: 'success' | 'fail') => {
    setSimulating(true)
    try {
      const res = await fetch('/api/webhooks/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: status === 'success' ? 'checkout.session.completed' : 'payment_intent.payment_failed',
          id: `evt_sim_${Date.now()}`,
          orderId,
          data: {
            object: {
              id: `pi_sim_${Date.now()}`,
              metadata: { orderId },
              client_reference_id: orderId,
              amount_received: order?.totalSen,
              currency: 'myr',
            },
          },
        }),
      })

      if (status === 'success') {
        router.push(`/order/confirmed/${orderId}`)
      } else {
        router.push('/checkout?cancelled=true')
      }
    } catch (err) {
      console.error('Simulation error:', err)
      setSimulating(false)
    }
  }

  if (loading) {
    return (
      <div className="py-24 text-center bg-cream-light min-h-[70vh] flex items-center justify-center">
        <p className="text-charcoal-muted text-sm animate-pulse">Loading payment gateway session...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="py-24 text-center bg-cream-light min-h-[70vh]">
        <h2 className="text-xl font-bold text-forest">Order not found</h2>
        <Link href="/" className="text-xs text-gold-dark underline mt-2 inline-block">
          Return to Storefront
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-cream-light py-12 min-h-[85vh]">
      <div className="max-w-2xl mx-auto px-4">
        {/* Warning Banner */}
        <div className="bg-amber-50 border-2 border-amber-400 p-4 rounded-2xl mb-8 flex items-start space-x-3 text-amber-950">
          <ShieldAlert className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-sm block text-amber-900">
              DEVELOPMENT PAYMENT GATEWAY SIMULATOR
            </span>
            <p>
              This is a development sandbox simulator running in isolated test mode. In production with live Stripe credentials, this screen redirects directly to Stripe&apos;s hosted payment page.
            </p>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-warmwhite rounded-2xl p-6 sm:p-8 border border-borderLight shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-borderLight">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-charcoal-muted block">Order Reference</span>
              <span className="font-mono text-base font-bold text-forest">{order.orderNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-charcoal-muted block">Total Payable</span>
              <span className="text-2xl font-bold text-forest">{formatMYR(order.totalSen)}</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <h3 className="font-bold text-charcoal">Delivery Recipient:</h3>
            <p className="text-charcoal-muted">{order.customerName} ({order.customerPhone})</p>
            <p className="text-charcoal-muted">{order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postcode}</p>
          </div>

          <div className="space-y-2 text-xs">
            <h3 className="font-bold text-charcoal">Purchased Items ({order.items.length}):</h3>
            <div className="divide-y divide-borderLight">
              {order.items.map((i) => (
                <div key={i.id} className="py-2 flex justify-between">
                  <span>{i.productName} ({i.sizeName}) x {i.quantity}</span>
                  <span className="font-semibold">{formatMYR(i.lineTotalSen)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Test Buttons */}
          <div className="pt-6 border-t border-borderLight space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest text-center">
              Select Test Simulation Outcome
            </h4>

            <button
              onClick={() => handleSimulatePayment('success')}
              disabled={simulating}
              className="w-full py-3.5 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold uppercase tracking-wider rounded-xl shadow-card flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Simulate Successful Stripe Payment (Mark Order Paid)</span>
            </button>

            <button
              onClick={() => handleSimulatePayment('fail')}
              disabled={simulating}
              className="w-full py-3 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              <span>Simulate Payment Failure / Bank Decline</span>
            </button>

            <Link
              href="/checkout?cancelled=true"
              className="w-full py-2.5 text-center text-xs text-charcoal-muted hover:text-charcoal block underline"
            >
              Simulate Customer Abort & Return to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
