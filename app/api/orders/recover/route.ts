import { NextRequest, NextResponse } from 'next/server'
import { getOrderById, updateOrderStatus, upsertOrder, recordAffiliateSale } from '@/lib/db'
import { chipProvider } from '@/lib/payment/chip'
import { Order } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, order, paymentId } = body

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 })
    }

    let existingOrder: Order | null = null

    // 1. If full order snapshot provided from client session/cookie storage
    if (order && typeof order === 'object') {
      const candidate: Order = { ...order, id: orderId }

      // Check payment with CHIP gateway
      const pid = paymentId || candidate.paymentId
      if (pid) {
        try {
          const purchase = await chipProvider.getPurchase(pid)
          if (purchase && (purchase.status === 'paid' || purchase.status === 'cleared')) {
            candidate.paymentStatus = 'paid'
            candidate.fulfillmentStatus = 'processing'
            candidate.paymentId = pid
          }
        } catch (gatewayErr) {
          console.warn('CHIP gateway verification warning during recovery:', gatewayErr)
        }
      }

      existingOrder = await upsertOrder(candidate)
      return NextResponse.json({ success: true, order: existingOrder, recoveredFrom: 'client_snapshot' })
    }

    // 2. Try looking up order in database
    existingOrder = await getOrderById(orderId)

    if (existingOrder) {
      const pid = paymentId || existingOrder.paymentId
      if (pid && existingOrder.paymentStatus !== 'paid') {
        const purchase = await chipProvider.getPurchase(pid)
        if (purchase && (purchase.status === 'paid' || purchase.status === 'cleared')) {
          await updateOrderStatus(
            existingOrder.id,
            {
              paymentStatus: 'paid',
              fulfillmentStatus: 'processing',
              paymentId: pid,
            },
            'recovery_api'
          )
          const refreshed = await getOrderById(orderId)
          if (refreshed) existingOrder = refreshed
        }
      }
      return NextResponse.json({ success: true, order: existingOrder, recoveredFrom: 'db' })
    }

    // 3. Fallback: If DB had cold reset and no snapshot, reconstruct from authoritative CHIP purchase
    if (paymentId) {
      const purchase = await chipProvider.getPurchase(paymentId)
      if (purchase) {
        const isPaid = purchase.status === 'paid' || purchase.status === 'cleared'
        const now = new Date().toISOString()
        const reconstructed: Order = {
          id: orderId,
          orderNumber: `LENA-2026-${Date.now().toString().slice(-4)}`,
          customerEmail: purchase.client?.email || 'customer@kamaarbeddings.com.my',
          customerName: purchase.client?.full_name || 'Pelanggan KAMAAR',
          customerPhone: purchase.client?.phone || '',
          shippingAddress: {
            fullName: purchase.client?.full_name || 'Pelanggan KAMAAR',
            phone: purchase.client?.phone || '',
            addressLine1: purchase.client?.street_address || 'Alamat Kediaman',
            city: purchase.client?.city || 'Tasek Gelugor',
            state: purchase.client?.state || 'Pulau Pinang',
            postcode: purchase.client?.zip_code || '13300',
            country: 'Malaysia',
          },
          billingAddress: {
            fullName: purchase.client?.full_name || 'Pelanggan KAMAAR',
            phone: purchase.client?.phone || '',
            addressLine1: purchase.client?.street_address || 'Alamat Kediaman',
            city: purchase.client?.city || 'Tasek Gelugor',
            state: purchase.client?.state || 'Pulau Pinang',
            postcode: purchase.client?.zip_code || '13300',
            country: 'Malaysia',
          },
          subtotalSen: purchase.purchase?.total || 0,
          discountSen: 0,
          shippingSen: 0,
          taxSen: 0,
          totalSen: purchase.purchase?.total || 0,
          paymentStatus: isPaid ? 'paid' : 'unpaid',
          fulfillmentStatus: isPaid ? 'processing' : 'unfulfilled',
          paymentProvider: 'chip',
          paymentId,
          items: (purchase.purchase?.products || []).map((p: any, idx: number) => {
            const price = typeof p.price === 'number' ? p.price : purchase.purchase?.total || 0
            const qty = parseInt(p.quantity, 10) || 1
            return {
              id: `item-${Date.now()}-${idx}`,
              orderId,
              variantId: `var-${idx}`,
              productName: p.name || 'Produk KAMAAR Beddings',
              sizeName: 'Standard',
              sku: `KMR-${idx}`,
              dimensions: 'White-Glove Factory Delivery',
              unitPriceSen: price,
              quantity: qty,
              lineTotalSen: price * qty,
              imageUrl: '/images/kamaar-logo-clean.png',
            }
          }),
          createdAt: now,
          updatedAt: now,
        }

        const saved = await upsertOrder(reconstructed)
        return NextResponse.json({ success: true, order: saved, recoveredFrom: 'chip_gateway' })
      }
    }

    return NextResponse.json({ error: 'Order not found and could not be recovered' }, { status: 404 })
  } catch (err: any) {
    console.error('Order recovery endpoint error:', err)
    return NextResponse.json({ error: err.message || 'Recovery failed' }, { status: 500 })
  }
}
