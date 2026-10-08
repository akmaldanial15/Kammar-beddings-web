import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { CheckCircle2, Clock, AlertCircle, Printer, ArrowRight, Truck, ShieldCheck, Mail } from 'lucide-react'
import { getOrderById } from '@/lib/db'
import { formatMYR, formatDateTimeMY } from '@/lib/utils/format'
import { PrintButton } from '@/components/order/PrintButton'

interface Props {
  params: { orderId: string }
}

export default async function OrderConfirmedPage({ params }: Props) {
  const order = await getOrderById(params.orderId)

  if (!order) {
    notFound()
  }

  const isPaid = order.paymentStatus === 'paid'

  return (
    <div className="bg-cream-light py-12 sm:py-20 min-h-[85vh]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Status Header */}
        <div className="bg-warmwhite rounded-3xl p-6 sm:p-10 border border-borderLight shadow-card text-center mb-8">
          <div
            className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${
              isPaid
                ? 'bg-blue-100 text-blue-800'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {isPaid ? <CheckCircle2 className="w-10 h-10" /> : <Clock className="w-10 h-10" />}
          </div>

          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-dark block">
            {isPaid ? 'Payment Verified & Confirmed' : 'Payment Awaiting Confirmation'}
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest mt-1">
            {isPaid ? 'Thank You For Your Order' : 'Order Received'}
          </h1>

          <p className="text-sm text-charcoal-muted mt-2 max-w-lg mx-auto">
            {isPaid
              ? `We have confirmed your payment. A formal tax receipt and delivery schedule have been dispatched to ${order.customerEmail}.`
              : 'Your payment attempt is currently being processed by CHIP In Asia (FPX / Touch \'n Go eWallet). Please check back shortly.'}
          </p>

          <div className="mt-6 inline-flex items-center space-x-2 px-4 py-2 bg-cream rounded-full border border-borderLight text-xs font-mono font-bold text-forest">
            <span>Order Number: {order.orderNumber}</span>
          </div>
        </div>

        {/* Itemized Order Receipt */}
        <div className="bg-warmwhite rounded-3xl p-6 sm:p-10 border border-borderLight shadow-card space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-borderLight">
            <h2 className="font-serif text-xl font-bold text-forest">
              Official Purchase Receipt
            </h2>
            <PrintButton />
          </div>

          {/* Delivery & Timeline Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-cream-light rounded-xl border border-borderLight text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Order Placed</span>
              <span className="font-semibold text-charcoal">{formatDateTimeMY(order.createdAt)}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Estimated Dispatch</span>
              <span className="font-semibold text-forest">2 to 4 Working Days (White-Glove Service)</span>
            </div>
          </div>

          {/* Purchased Items */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">
              Order Items ({order.items.length})
            </h3>
            <div className="divide-y divide-borderLight border border-borderLight rounded-xl overflow-hidden bg-cream-light">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex items-center space-x-4 bg-warmwhite">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-cream border border-borderLight flex-shrink-0">
                    <Image
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=400&q=80'}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-charcoal truncate">
                      {item.productName}
                    </h4>
                    <span className="text-xs text-gold-dark font-medium block">
                      Size: {item.sizeName} ({item.dimensions})
                    </span>
                    <span className="text-[11px] text-charcoal-muted">Qty: {item.quantity}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-forest">
                      {formatMYR(item.lineTotalSen)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Address Snapshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-borderLight text-xs">
            <div>
              <h4 className="font-bold text-charcoal uppercase tracking-wider mb-2">
                Delivery Address:
              </h4>
              <p className="text-charcoal-muted font-semibold">{order.shippingAddress.fullName}</p>
              <p className="text-charcoal-muted">{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && (
                <p className="text-charcoal-muted">{order.shippingAddress.addressLine2}</p>
              )}
              <p className="text-charcoal-muted">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postcode}
              </p>
              <p className="text-charcoal-muted">Phone: {order.customerPhone}</p>
            </div>

            <div>
              <h4 className="font-bold text-charcoal uppercase tracking-wider mb-2">
                Delivery Logistics Notes:
              </h4>
              <p className="text-charcoal-muted">
                Lift Access: {order.hasLiftAccess ? 'Elevator Available' : 'Staircase Walk-Up'}
              </p>
              {order.floorLevel && <p className="text-charcoal-muted">Floor: {order.floorLevel}</p>}
              {order.preferredDeliveryDate && (
                <p className="text-charcoal-muted">Requested Date: {order.preferredDeliveryDate}</p>
              )}
              {order.deliveryNotes && (
                <p className="text-charcoal-muted italic mt-1">&ldquo;{order.deliveryNotes}&rdquo;</p>
              )}
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="pt-4 border-t border-borderLight space-y-2 text-xs text-charcoal">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">{formatMYR(order.subtotalSen)}</span>
            </div>
            {order.discountSen > 0 && (
              <div className="flex justify-between text-sale font-semibold">
                <span>Discount ({order.appliedCoupon})</span>
                <span>-{formatMYR(order.discountSen)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-semibold text-forest">
                {order.shippingSen === 0 ? 'FREE' : formatMYR(order.shippingSen)}
              </span>
            </div>
            <div className="pt-3 border-t border-borderLight flex items-baseline justify-between">
              <span className="font-serif text-lg font-bold text-forest">Total Paid</span>
              <span className="text-2xl font-bold text-forest">{formatMYR(order.totalSen)}</span>
            </div>
          </div>

          <div className="pt-6 border-t border-borderLight flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
            <Link
              href="/collections/mattress"
              className="text-xs font-bold text-forest hover:text-gold-dark underline"
            >
              &larr; Continue Exploring Collections
            </Link>

            <Link
              href="/account"
              className="px-6 py-3 bg-forest text-warmwhite text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-forest-dark transition-colors shadow-sm"
            >
              View in My Account &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
