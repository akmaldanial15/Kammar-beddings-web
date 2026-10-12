import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { CheckCircle2, Clock, AlertCircle, Printer, ArrowRight, Truck, ShieldCheck, Mail } from 'lucide-react'
import { getOrderById, updateOrderStatus } from '@/lib/db'
import { chipProvider } from '@/lib/payment/chip'
import { formatMYR, formatDateTimeMY } from '@/lib/utils/format'
import { PrintButton } from '@/components/order/PrintButton'

interface Props {
  params: { orderId: string }
}

export default async function OrderConfirmedPage({ params }: Props) {
  let order = await getOrderById(params.orderId)

  if (!order) {
    notFound()
  }

  // Auto-verify with CHIP gateway if paymentStatus is not yet confirmed as paid
  if (order.paymentStatus !== 'paid' && order.paymentId) {
    const purchase = await chipProvider.getPurchase(order.paymentId)
    if (purchase && (purchase.status === 'paid' || purchase.status === 'cleared')) {
      await updateOrderStatus(
        order.id,
        {
          paymentStatus: 'paid',
          fulfillmentStatus: 'processing',
        },
        'chip_sync'
      )
      const refreshed = await getOrderById(params.orderId)
      if (refreshed) order = refreshed
    }
  }

  const isPaid = order.paymentStatus === 'paid'

  return (
    <div className="bg-cream-light py-8 sm:py-16 min-h-[85vh] print:bg-white print:py-0 print:min-h-0 print:text-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 print:max-w-none print:px-0 print:mx-0">
        {/* Status Header: Web only (Hidden in Print) */}
        <div className="bg-warmwhite rounded-3xl p-6 sm:p-10 border border-borderLight shadow-card text-center mb-8 print:hidden">
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

        {/* ====================================================================
            OFFICIAL RECEIPT CONTAINER
            - Web: Luxury rounded card with border and shadow
            - Print: Crisp, unbordered, full A4 corporate invoice letterhead
           ==================================================================== */}
        <div className="bg-warmwhite rounded-3xl p-6 sm:p-10 border border-borderLight shadow-card space-y-6 print:bg-white print:rounded-none print:p-0 print:border-none print:shadow-none print:space-y-4">
          
          {/* 1. PRINT-ONLY OFFICIAL CORPORATE LETTERHEAD */}
          <div className="print-only border-b-2 border-black pb-4 mb-4 page-break-avoid">
            <div className="flex items-start justify-between">
              {/* Left: Brand Logo & Company Registration */}
              <div className="flex items-start space-x-3.5">
                <div className="relative w-36 h-12 flex-shrink-0">
                  <Image
                    src="/images/kamaar-logo-clean.png"
                    alt="KAMAAR Beddings"
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </div>
                <div className="text-[10px] leading-tight text-gray-800">
                  <h2 className="font-bold text-sm text-black uppercase tracking-wide">
                    TUNAS SINAR JAYA ENTERPRISE
                  </h2>
                  <p className="font-medium text-gray-700">
                    No. Pendaftaran Perniagaan (SSM): <strong className="font-mono text-black">PG0395419W</strong>
                  </p>
                  <p className="text-gray-600 mt-0.5">
                    No. 7878 B, Jalan Permatang Berangan, Kg Pokok Tampang, 13300 Tasek Gelugor, Pulau Pinang.
                  </p>
                  <p className="text-gray-600 mt-0.5">
                    Tel: 019-478 6991 / 012-421 2119 &bull; Emel: tunassinar@gmail.com &bull; Web: www.kamaarbeddings.com.my
                  </p>
                </div>
              </div>

              {/* Right: Official Tax Receipt Meta */}
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-black text-white text-[11px] font-bold uppercase tracking-widest rounded-xs">
                  RESIT RASMI / OFFICIAL RECEIPT
                </span>
                <div className="mt-2 text-[10px] space-y-0.5 text-gray-800">
                  <p>
                    <span className="text-gray-500">No. Resit:</span>{' '}
                    <strong className="font-mono text-black text-[11px]">{order.orderNumber}</strong>
                  </p>
                  <p>
                    <span className="text-gray-500">Tarikh:</span>{' '}
                    <strong>{formatDateTimeMY(order.createdAt)}</strong>
                  </p>
                  <p>
                    <span className="text-gray-500">Status:</span>{' '}
                    <strong className="text-emerald-700 uppercase font-bold">
                      {isPaid ? 'PAID / LULUS' : 'MENUNGGU PENGESAHAN'}
                    </strong>
                  </p>
                  <p>
                    <span className="text-gray-500">Gerbang:</span>{' '}
                    <strong>CHIP In Asia (FPX / TNG)</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. WEB-ONLY HEADER (Heading + Print Button) */}
          <div className="flex items-center justify-between pb-4 border-b border-borderLight print:hidden">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-dark block">
                TUNAS SINAR JAYA ENTERPRISE (PG0395419W)
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest">
                Official Purchase Receipt
              </h2>
            </div>
            <PrintButton />
          </div>

          {/* 3. ORDER TIMELINE & DISPATCH STRIP (Web View) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-cream-light rounded-xl border border-borderLight text-xs print:hidden">
            <div>
              <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Order Placed</span>
              <span className="font-semibold text-charcoal">{formatDateTimeMY(order.createdAt)}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Estimated Dispatch</span>
              <span className="font-semibold text-forest">2 to 4 Working Days (White-Glove Direct Factory)</span>
            </div>
          </div>

          {/* 4. BILLING & SHIPPING ADDRESS SUMMARY (Crisp in both Web & Print) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-borderLight bg-cream-light/60 print:bg-white print:border print:border-gray-300 print:p-3 text-xs page-break-avoid">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted print:text-gray-600 block mb-1">
                DIBIL KEPADA (BILLED TO):
              </span>
              <p className="font-bold text-charcoal print:text-black">{order.shippingAddress.fullName}</p>
              <p className="text-charcoal-muted print:text-gray-700">{order.customerEmail}</p>
              <p className="text-charcoal-muted print:text-gray-700">Tel: {order.customerPhone}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted print:text-gray-600 block mb-1">
                DIHANTAR KEPADA (SHIP TO):
              </span>
              <p className="font-bold text-charcoal print:text-black">{order.shippingAddress.fullName}</p>
              <p className="text-charcoal-muted print:text-gray-700">{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && (
                <p className="text-charcoal-muted print:text-gray-700">{order.shippingAddress.addressLine2}</p>
              )}
              <p className="text-charcoal-muted print:text-gray-700">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postcode}
              </p>
              {(order.hasLiftAccess !== undefined || order.deliveryNotes) && (
                <p className="text-[10px] text-charcoal-muted print:text-gray-600 mt-1">
                  Logistik: {order.hasLiftAccess ? 'Lif Ada' : 'Tangga'}
                  {order.floorLevel ? ` (Tingkat ${order.floorLevel})` : ''}
                  {order.deliveryNotes ? ` &bull; "${order.deliveryNotes}"` : ''}
                </p>
              )}
            </div>
          </div>

          {/* 5. ITEM TABLE (Clean & Formal for Print, Interactive for Web) */}
          <div className="space-y-2 page-break-avoid">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal print:text-black">
              Senarai Item Pesanan ({order.items.length})
            </h3>
            
            <div className="overflow-hidden rounded-xl border border-borderLight print:border print:border-gray-300 bg-warmwhite print:bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-cream print:bg-gray-100 border-b border-borderLight print:border-gray-300 text-[10px] uppercase font-bold text-charcoal print:text-black">
                    <th className="py-2 px-3 w-8 text-center">#</th>
                    <th className="py-2 px-3">Keterangan Produk (Description)</th>
                    <th className="py-2 px-3 text-center w-16">Kuantiti</th>
                    <th className="py-2 px-3 text-right w-28">Harga Seunit</th>
                    <th className="py-2 px-3 text-right w-28">Jumlah (MYR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderLight print:divide-gray-300">
                  {order.items.map((item, idx) => (
                    <tr key={item.id} className="text-charcoal print:text-black">
                      <td className="py-2.5 px-3 text-center text-charcoal-muted print:text-gray-500 font-mono text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-charcoal print:text-black text-xs sm:text-sm">
                          {item.productName}
                        </div>
                        <div className="text-[11px] text-gold-dark print:text-gray-600 font-medium">
                          Saiz: {item.sizeName} ({item.dimensions})
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-semibold text-xs">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[11px] text-charcoal-muted print:text-gray-700">
                        {formatMYR(item.unitPriceSen)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-xs sm:text-sm text-forest print:text-black">
                        {formatMYR(item.lineTotalSen)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. PRICING TOTALS TABLE */}
          <div className="flex justify-end pt-2 page-break-avoid">
            <div className="w-full sm:w-80 print:w-72 space-y-1.5 text-xs text-charcoal print:text-black">
              <div className="flex justify-between py-1 border-b border-borderLight print:border-gray-200">
                <span className="text-charcoal-muted print:text-gray-600">Jumlah Kecil (Subtotal)</span>
                <span className="font-mono font-semibold">{formatMYR(order.subtotalSen)}</span>
              </div>

              {order.discountSen > 0 && (
                <div className="flex justify-between py-1 border-b border-borderLight print:border-gray-200 text-sale print:text-black">
                  <span>Diskaun ({order.appliedCoupon})</span>
                  <span className="font-mono font-semibold">-{formatMYR(order.discountSen)}</span>
                </div>
              )}

              <div className="flex justify-between py-1 border-b border-borderLight print:border-gray-200">
                <span className="text-charcoal-muted print:text-gray-600">Caj Penghantaran</span>
                <span className="font-mono font-semibold text-forest print:text-black">
                  {order.shippingSen === 0 ? 'PERCUMA' : formatMYR(order.shippingSen)}
                </span>
              </div>

              <div className="flex justify-between py-2 border-t-2 border-forest print:border-black items-baseline">
                <span className="font-serif text-base sm:text-lg font-bold text-forest print:text-black uppercase">
                  JUMLAH DIBAYAR
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-forest print:text-black">
                  {formatMYR(order.totalSen)}
                </span>
              </div>
            </div>
          </div>

          {/* 7. PRINT-ONLY CORPORATE FOOTER & VALIDATION STAMP */}
          <div className="print-only pt-4 mt-6 border-t-2 border-black text-[10px] text-gray-700 page-break-avoid">
            <div className="flex justify-between items-start gap-6">
              <div className="space-y-1 max-w-md">
                <p className="font-bold text-black uppercase">Terma &amp; Pengesahan Rasmi:</p>
                <p>1. Ini adalah resit janaan komputer yang sah bagi <strong>TUNAS SINAR JAYA ENTERPRISE (PG0395419W)</strong>. Tiada tandatangan fizikal diperlukan.</p>
                <p>2. Barang diproses dan dihantar terus dari kilang KAMAAR Beddings di Tasek Gelugor, Pulau Pinang.</p>
                <p>3. Untuk pertanyaan status penghantaran atau tuntutan jaminan, sila hubungi talian kilang: <strong>019-478 6991</strong>.</p>
              </div>

              <div className="border border-dashed border-gray-500 p-2.5 rounded text-center w-40 bg-gray-50/50 flex-shrink-0">
                <div className="text-[8px] uppercase tracking-wider font-bold text-gray-500">PENGESAHAN BAYARAN</div>
                <div className="text-xs font-mono font-bold text-emerald-800 my-0.5">LULUS / PAID</div>
                <div className="text-[8px] text-gray-600">CHIP IN ASIA GATEWAY</div>
              </div>
            </div>

            <div className="text-center text-[9px] text-gray-500 mt-4 pt-2 border-t border-gray-200">
              KAMAAR BEDDINGS &bull; Menjahit Kepercayaan, Menyulam Masa Depan &bull; www.kamaarbeddings.com.my
            </div>
          </div>

          {/* 8. WEB-ONLY ACTION BUTTONS */}
          <div className="pt-6 border-t border-borderLight flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
            <Link
              href="/collections/mattress"
              className="text-xs font-bold text-forest hover:text-gold-dark underline"
            >
              &larr; Teruskan Membeli-Belah
            </Link>

            <Link
              href="/account"
              className="px-6 py-3 bg-forest text-warmwhite text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-forest-dark transition-colors shadow-sm"
            >
              Lihat Dalam Akaun Saya &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
