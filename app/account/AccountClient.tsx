'use client'

import React, { useState, useEffect } from 'react'
import { Product, Order, WarrantyRegistration } from '@/types'
import { formatMYR, formatKLDate } from '@/lib/utils/format'
import { useWishlist } from '@/lib/context/WishlistContext'
import { useCart } from '@/lib/context/CartContext'
import {
  Package,
  Truck,
  ShieldCheck,
  Heart,
  Search,
  ExternalLink,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

interface AccountClientProps {
  allProducts: Product[]
}

export function AccountClient({ allProducts }: AccountClientProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'warranty' | 'wishlist'>('orders')
  const [emailInput, setEmailInput] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [warranties, setWarranties] = useState<WarrantyRegistration[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const { wishlistIds, toggleWishlist } = useWishlist()
  const { addItem } = useCart()

  // Match wishlist products
  const wishlistProducts = allProducts.filter((p) => wishlistIds.includes(p.id))

  // On mount, check if there is an email stored from a recent checkout in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lena_customer_email')
    if (saved) {
      setEmailInput(saved)
      fetchCustomerData(saved)
    }
  }, [])

  const fetchCustomerData = async (email: string) => {
    if (!email.trim()) return
    setIsLoading(true)
    setHasSearched(true)

    try {
      // Fetch orders for customer
      const ordRes = await fetch(`/api/orders?email=${encodeURIComponent(email.trim())}`)
      const ordData = await ordRes.json()
      if (ordRes.ok && ordData.orders) {
        setOrders(ordData.orders)
      }

      // Fetch warranties for customer
      const warRes = await fetch(`/api/warranties?email=${encodeURIComponent(email.trim())}`)
      const warData = await warRes.json()
      if (warRes.ok && warData.warranties) {
        setWarranties(warData.warranties)
      }

      localStorage.setItem('lena_customer_email', email.trim())
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchCustomerData(emailInput)
  }

  return (
    <div className="space-y-8">
      {/* Lookup Bar */}
      <div className="bg-warmwhite p-6 rounded-3xl border border-borderLight shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-secondary absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="Enter your order billing email (e.g. nurul@example.com.my)..."
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-xs md:text-sm rounded-2xl bg-cream/40 border border-borderLight focus:border-forest"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-forest text-warmwhite text-xs md:text-sm font-bold rounded-2xl hover:bg-forest-dark transition-colors shadow-sm disabled:opacity-50 whitespace-nowrap"
          >
            {isLoading ? 'Retrieving Records...' : 'Access My Sanctuary'}
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-borderLight space-x-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-3 text-xs md:text-sm font-bold transition-all flex items-center space-x-2 border-b-2 ${
            activeTab === 'orders'
              ? 'border-forest text-forest'
              : 'border-transparent text-secondary hover:text-charcoal'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('warranty')}
          className={`px-5 py-3 text-xs md:text-sm font-bold transition-all flex items-center space-x-2 border-b-2 ${
            activeTab === 'warranty'
              ? 'border-forest text-forest'
              : 'border-transparent text-secondary hover:text-charcoal'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Registered Warranties ({warranties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`px-5 py-3 text-xs md:text-sm font-bold transition-all flex items-center space-x-2 border-b-2 ${
            activeTab === 'wishlist'
              ? 'border-forest text-forest'
              : 'border-transparent text-secondary hover:text-charcoal'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Mattresses ({wishlistIds.length})</span>
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {!hasSearched ? (
            <div className="p-12 text-center bg-warmwhite rounded-3xl border border-borderLight space-y-2">
              <Package className="w-12 h-12 text-secondary/40 mx-auto" />
              <p className="text-sm font-bold text-forest-dark">Enter your email above to load your orders.</p>
              <p className="text-xs text-secondary">
                Orders placed with KAMAAR Beddings are securely attached to your billing address.
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center bg-warmwhite rounded-3xl border border-borderLight space-y-2">
              <Package className="w-12 h-12 text-secondary/40 mx-auto" />
              <p className="text-sm font-bold text-forest-dark">No orders found for {emailInput}.</p>
              <p className="text-xs text-secondary">
                If you made a purchase with a different email, please try searching with that address.
              </p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-warmwhite p-6 md:p-8 rounded-3xl border border-borderLight shadow-sm space-y-6"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-borderLight pb-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-lg text-forest-dark">
                        {ord.orderNumber}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ord.paymentStatus === 'paid'
                            ? 'bg-forest/10 text-forest'
                            : 'bg-gold/20 text-forest-dark'
                        }`}
                      >
                        {ord.paymentStatus.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-xs text-secondary block mt-1">
                      Placed on {formatKLDate(ord.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="font-serif text-xl font-bold text-forest">
                      {formatMYR(ord.totalSen)}
                    </span>
                    <Link
                      href={`/order/confirmed/${ord.id}`}
                      target="_blank"
                      className="px-4 py-2 bg-cream text-forest text-xs font-bold rounded-xl hover:bg-forest hover:text-warmwhite transition-colors"
                    >
                      Official Tax Invoice
                    </Link>
                  </div>
                </div>

                {/* Fulfilment Timeline Step Indicator */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-forest-dark uppercase tracking-wider">
                    Fulfilment Status
                  </span>
                  <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                    {[
                      { step: 'unfulfilled', label: '1. Received' },
                      { step: 'processing', label: '2. Crafting' },
                      { step: 'shipped', label: '3. Dispatched' },
                      { step: 'delivered', label: '4. Delivered' },
                    ].map((st, i) => {
                      const isComplete =
                        (ord.fulfillmentStatus === 'delivered' && i <= 3) ||
                        (ord.fulfillmentStatus === 'shipped' && i <= 2) ||
                        (ord.fulfillmentStatus === 'processing' && i <= 1) ||
                        (ord.fulfillmentStatus === 'unfulfilled' && i === 0)

                      return (
                        <div
                          key={st.step}
                          className={`p-2.5 rounded-xl border text-[10px] md:text-xs font-bold transition-all ${
                            isComplete
                              ? 'bg-forest text-warmwhite border-forest'
                              : 'bg-cream/40 text-secondary border-borderLight'
                          }`}
                        >
                          {st.label}
                        </div>
                      )
                    })}
                  </div>

                  {ord.trackingNumber && (
                    <div className="p-3 bg-cream/50 rounded-xl border border-borderLight text-xs flex items-center justify-between mt-2">
                      <span className="text-secondary">
                        Carrier: <strong>{ord.carrier || 'KAMAAR White-Glove Fleet'}</strong>
                      </span>
                      <span className="font-mono font-bold text-forest">
                        Waybill: {ord.trackingNumber}
                      </span>
                    </div>
                  )}
                </div>

                {/* Items in this order */}
                <div className="divide-y divide-borderLight/60">
                  {ord.items.map((item) => (
                    <div key={item.variantId} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center space-x-3 min-w-0">
                        <img
                          src={item.imageUrl || item.image || ''}
                          alt={item.productName}
                          className="w-12 h-12 rounded-xl object-cover border border-borderLight flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-forest-dark text-xs truncate">
                            {item.productName}
                          </h4>
                          <p className="text-[10px] text-secondary">
                            {item.sizeName} ({item.dimensions}) • Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-forest text-xs">
                        {formatMYR((item.unitPriceSen || item.priceSen || 0) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Warranties Tab */}
      {activeTab === 'warranty' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-warmwhite p-4 rounded-2xl border border-borderLight">
            <span className="text-xs text-secondary">
              Digital warranty guarantees registered under {emailInput || 'your account'}.
            </span>
            <Link
              href="/warranty"
              className="px-4 py-2 bg-forest text-warmwhite text-xs font-bold rounded-xl hover:bg-forest-dark transition-colors"
            >
              + Register New Invoice
            </Link>
          </div>

          {warranties.length === 0 ? (
            <div className="p-12 text-center bg-warmwhite rounded-3xl border border-borderLight space-y-2">
              <ShieldCheck className="w-12 h-12 text-secondary/40 mx-auto" />
              <p className="text-sm font-bold text-forest-dark">No warranty certificates found.</p>
              <p className="text-xs text-secondary">
                Register your mattress invoice number to activate your 10 to 15-year guarantee.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {warranties.map((w) => (
                <div
                  key={w.id}
                  className="bg-warmwhite p-6 rounded-2xl border border-borderLight shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-forest-dark text-base">
                        {w.productName}
                      </h4>
                      <span className="font-mono text-xs text-forest font-semibold block">
                        Invoice: {w.invoiceNumber}
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        w.status === 'verified'
                          ? 'bg-forest/10 text-forest'
                          : 'bg-gold/20 text-forest-dark'
                      }`}
                    >
                      {w.status}
                    </span>
                  </div>

                  <div className="text-xs text-secondary space-y-1">
                    <div>Purchased: {w.purchaseDate}</div>
                    <div>Store: {w.retailer}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Wishlist Tab */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          {wishlistProducts.length === 0 ? (
            <div className="p-12 text-center bg-warmwhite rounded-3xl border border-borderLight space-y-2">
              <Heart className="w-12 h-12 text-secondary/40 mx-auto" />
              <p className="text-sm font-bold text-forest-dark">Your wishlist is currently empty.</p>
              <p className="text-xs text-secondary">
                Tap the heart icon on any mattress to save it for future comparison.
              </p>
              <Link
                href="/collections/mattress"
                className="inline-block mt-3 px-6 py-2.5 bg-forest text-warmwhite text-xs font-bold rounded-xl"
              >
                Browse Mattresses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {wishlistProducts.map((item) => (
                <div
                  key={item.id}
                  className="bg-warmwhite rounded-2xl border border-borderLight p-4 shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div>
                    <img
                      src={item.images[0]?.imageUrl || ''}
                      alt={item.name}
                      className="w-full h-40 object-cover rounded-xl border border-borderLight"
                    />
                    <h4 className="font-serif font-bold text-forest-dark text-sm mt-3 line-clamp-1">
                      {item.name}
                    </h4>
                    <span className="font-bold text-forest text-sm block mt-1">
                      {formatMYR(item.variants[0]?.priceSen || 0)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-borderLight text-xs">
                    <button
                      onClick={() => toggleWishlist(item.id)}
                      className="text-sale font-bold hover:underline"
                    >
                      Remove
                    </button>
                    <Link
                      href={`/products/${item.slug}`}
                      className="px-3 py-1.5 bg-forest text-warmwhite font-bold rounded-lg hover:bg-forest-dark"
                    >
                      View Options
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
