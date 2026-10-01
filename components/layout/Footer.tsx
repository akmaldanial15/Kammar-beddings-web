'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CreditCard,
  CheckCircle2,
} from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { KamaarLogo } from '@/components/brand/KamaarLogo'

export function Footer() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !consent) return
    setIsSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="bg-forest-dark text-warmwhite pt-16 pb-8 border-t border-borderLight/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Reassurance Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-warmwhite/10">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center flex-shrink-0 text-gold border border-gold/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-warmwhite">{t.reassureLatex}</h4>
              <p className="text-xs text-warmwhite/70 mt-0.5">{t.reassureLatexSub}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center flex-shrink-0 text-gold border border-gold/20">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-warmwhite">{t.reassureTrial}</h4>
              <p className="text-xs text-warmwhite/70 mt-0.5">{t.reassureTrialSub}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center flex-shrink-0 text-gold border border-gold/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-warmwhite">{t.reassureWarranty}</h4>
              <p className="text-xs text-warmwhite/70 mt-0.5">{t.reassureWarrantySub}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center flex-shrink-0 text-gold border border-gold/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-warmwhite">{t.reassureDelivery}</h4>
              <p className="text-xs text-warmwhite/70 mt-0.5">{t.reassureDeliverySub}</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-14">
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <Link href="/" className="inline-block">
                <KamaarLogo variant="horizontal" size="lg" theme="dark" />
              </Link>
            </div>
            <p className="text-xs text-warmwhite/75 leading-relaxed max-w-sm">
              {t.aboutBrand}
            </p>

            {/* Newsletter form */}
            <div className="pt-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-gold">
                {t.newsletterTitle}
              </h5>
              <p className="text-xs text-warmwhite/70 mt-1">{t.newsletterSub}</p>

              {isSubscribed ? (
                <div className="mt-3 p-3 bg-forest rounded-lg flex items-center space-x-2 text-xs text-gold">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Welcome to the LENA Sleep Club. Check your inbox soon.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="mt-3 space-y-2">
                  <div className="flex">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.newsletterPlaceholder}
                      className="flex-1 px-3.5 py-2.5 bg-warmwhite/10 text-warmwhite placeholder-warmwhite/40 text-xs rounded-l-lg border border-warmwhite/20 focus:outline-none focus:border-gold"
                    />
                    <button
                      type="submit"
                      disabled={!consent}
                      className="px-4 py-2.5 bg-gold text-forest-dark font-bold text-xs rounded-r-lg hover:bg-gold-light disabled:opacity-50 transition-colors flex items-center space-x-1"
                    >
                      <span>{t.subscribeBtn}</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <label className="flex items-start space-x-2 text-[11px] text-warmwhite/60 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      required
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 rounded text-gold focus:ring-gold"
                    />
                    <span>
                      I agree to receive mattress care guides and promotional news in accordance with LENA SLEEP’s Privacy Policy.
                    </span>
                  </label>
                </form>
              )}
            </div>
          </div>

          {/* Col 2: Shopping */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-gold pb-1 border-b border-warmwhite/10">
              {t.shoppingCol}
            </h5>
            <ul className="space-y-2 text-xs text-warmwhite/70">
              <li>
                <Link href="/collections/mattress" className="hover:text-gold transition-colors">
                  All Mattresses
                </Link>
              </li>
              <li>
                <Link href="/collections/mattress?material=latex" className="hover:text-gold transition-colors">
                  100% Natural Latex
                </Link>
              </li>
              <li>
                <Link href="/collections/mattress?material=hybrid" className="hover:text-gold transition-colors">
                  Cool Night Hybrid
                </Link>
              </li>
              <li>
                <Link href="/collections/mattress?material=ortho" className="hover:text-gold transition-colors">
                  Orthopaedic Spinal
                </Link>
              </li>
              <li>
                <Link href="/collections/pillows" className="hover:text-gold transition-colors">
                  Natural Latex Pillows
                </Link>
              </li>
              <li>
                <Link href="/collections/toppers-protectors" className="hover:text-gold transition-colors">
                  Mattress Toppers
                </Link>
              </li>
              <li>
                <Link href="/collections/bedframes" className="hover:text-gold transition-colors">
                  Hardwood Bedframes
                </Link>
              </li>
              <li>
                <Link href="/collections/bedding" className="hover:text-gold transition-colors">
                  1000TC Bamboo Bedding
                </Link>
              </li>
              <li>
                <Link href="/offers" className="text-gold font-semibold hover:underline">
                  Vouchers & Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-gold pb-1 border-b border-warmwhite/10">
              {t.careCol}
            </h5>
            <ul className="space-y-2 text-xs text-warmwhite/70">
              <li>
                <Link href="/trial" className="hover:text-gold transition-colors">
                  100-Night Sleep Trial
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="hover:text-gold transition-colors">
                  Warranty Registration
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="hover:text-gold transition-colors">
                  Shipping & Bulky Delivery
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gold transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/care-guide" className="hover:text-gold transition-colors">
                  Latex Mattress Care Guide
                </Link>
              </li>
              <li>
                <Link href="/finder" className="hover:text-gold transition-colors">
                  Mattress Finder Quiz
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-gold transition-colors">
                  Mattress Comparison Tool
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-gold transition-colors">
                  Order Tracking & Receipts
                </Link>
              </li>
              <li>
                <Link href="/affiliate/login" className="text-gold/90 hover:text-gold transition-colors font-medium flex items-center gap-1.5">
                  <span>Affiliate & Agent Portal</span>
                  <span className="text-[9.5px] px-1.5 py-0.5 bg-gold/20 rounded font-bold text-gold">Ejen</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Showrooms & Contact */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-gold pb-1 border-b border-warmwhite/10">
              {t.contactCol}
            </h5>
            <div className="space-y-2.5 text-xs text-warmwhite/70">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>
                  Flagship: No. 88, Jalan Maarof, Bangsar, 59100 Kuala Lumpur
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="tel:+60377221199" className="hover:text-gold">
                  +603 7722 1199
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="mailto:care@lenasleep.com.my" className="hover:text-gold">
                  care@lenasleep.com.my
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>Showroom Hours: Mon - Sun, 10:00 AM - 8:00 PM</span>
              </div>

              <div className="pt-2">
                <Link
                  href="/showrooms"
                  className="inline-block px-3 py-1.5 bg-forest hover:bg-forest/80 text-warmwhite rounded text-xs border border-gold/30 transition-colors"
                >
                  Book Showroom Consultation &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Gateways & Copyright */}
        <div className="pt-8 border-t border-warmwhite/10 flex flex-col md:flex-row items-center justify-between text-xs text-warmwhite/60 space-y-4 md:space-y-0">
          <div>
            <p>&copy; {new Date().getFullYear()} KAMAAR BEDDINGS SDN. BHD. (Company No. 202601099881). {t.allRightsReserved}</p>
            <div className="flex space-x-4 mt-1 text-[11px] text-warmwhite/50">
              <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
              <span>&bull;</span>
              <Link href="/terms" className="hover:underline">Terms of Service</Link>
              <span>&bull;</span>
              <Link href="/refunds" className="hover:underline">Refund & Trial Terms</Link>
            </div>
          </div>

          {/* Payment Badges */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <span className="text-[11px] text-warmwhite/60 flex items-center space-x-1">
              <CreditCard className="w-3.5 h-3.5 text-gold" />
              <span>Secured by Stripe:</span>
            </span>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-warmwhite/10 rounded font-bold text-[10px] tracking-wider text-warmwhite">
                VISA
              </span>
              <span className="px-2 py-1 bg-warmwhite/10 rounded font-bold text-[10px] tracking-wider text-warmwhite">
                MASTERCARD
              </span>
              <span className="px-2 py-1 bg-warmwhite/10 rounded font-bold text-[10px] tracking-wider text-gold font-mono">
                FPX ONLINE BANKING
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
