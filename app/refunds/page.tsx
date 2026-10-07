import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { RotateCcw, ShieldCheck, CheckCircle2, AlertCircle, Phone, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Refund & Trial Terms | KAMAAR Beddings Malaysia',
  description:
    'Comprehensive refund and return terms for our 100-Night Sleep Trial, pillow hygiene policies, complimentary collection, and 100% full money-back guarantee.',
}

export default function RefundsPage() {
  const lastUpdated = '1 October 2026'

  return (
    <div className="bg-cream min-h-screen py-12 md:py-20 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            Transparent Guarantees
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-forest-dark">
            Refund & 100-Night Trial Policy
          </h1>
          <p className="text-xs text-secondary">
            Last Updated: {lastUpdated} &bull; 100% Zero-Hassle Customer Protection
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-warmwhite rounded-3xl p-6 sm:p-12 border border-borderLight shadow-sm space-y-8 text-xs sm:text-sm text-charcoal leading-relaxed">
          {/* Highlight Card */}
          <div className="p-5 rounded-2xl bg-forest/5 border border-forest/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-serif text-base font-bold text-forest-dark flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-gold-dark" />
                <span>100-Night Sleep Trial Protection</span>
              </h3>
              <p className="text-xs text-secondary">
                We believe you must experience sleeping on a mattress in your own bedroom. If you do not love it, we arrange complimentary pickup and issue a 100% refund.
              </p>
            </div>
            <Link
              href="/trial"
              className="px-4 py-2 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold rounded-xl transition-all whitespace-nowrap self-start sm:self-center"
            >
              Trial Overview &rarr;
            </Link>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-forest-dark">
              1. Jaminan Kepuasan Kilang 14 Hari & Pertukaran Produk
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-secondary">
              <li>Jaminan Kepuasan & Pertukaran Kilang terpakai untuk semua pembelian produk tilam toto, tilam kekabu, tilam asrama dan tekstil KAMAAR buatan Tunas Sinar Jaya Enterprise.</li>
              <li><strong>Pemeriksaan 14 Hari:</strong> Pelanggan diberikan tempoh 14 hari selepas penerimaan untuk memeriksa mutu jahitan kilang, zip keliling dan keadaan tilam. Sebarang kecacatan pengilangan layak untuk pertukaran 1-ke-1 secara pantas.</li>
              <li>Pertukaran boleh diaturkan melalui kurier atau secara terus di gudang kilang kami di Tasek Gelugor, Pulau Pinang.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-forest-dark">
              2. Mattress Condition Requirements
            </h2>
            <p className="text-secondary">
              To qualify for a 100% full refund:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-secondary">
              <li>The mattress must have been used with a protective mattress cover throughout the trial period.</li>
              <li>The mattress must be structurally sound and free from deliberate tears, severe biological stains, burns, smoke odor, or liquid damage.</li>
              <li>The original law tag/label attached to the mattress edge must remain intact for serial identification.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-forest-dark">
              3. Complimentary Pickup & Zero Restocking Fees
            </h2>
            <p className="text-secondary">
              Across Peninsular Malaysia, our logistics team will collect the mattress directly from your bedroom at <strong>zero cost to you</strong>. There are no restocking fees, no transport deductions, and no hidden penalties.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-forest-dark">
              4. Pillows, Bed Linen & Accessories Policy
            </h2>
            <p className="text-secondary">
              Due to strict health and personal hygiene regulations:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-secondary">
              <li>Bantal gebu, sarung bantal peluk, cadar berzip dan comforter yang telah dibuka daripada bungkusan plastik lutsinar kilang adalah <strong>tidak boleh dikembalikan</strong> atas faktor kebersihan, melainkan terdapat kecacatan jahitan kilang yang nyata semasa mula diterima.</li>
              <li>Barangan yang belum dibuka dan masih dalam bungkusan asal kilang boleh ditukar dalam tempoh 14 hari selepas penerimaan.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-forest-dark">
              5. Refund Timeline & Settlement
            </h2>
            <p className="text-secondary">
              Once our logistics team has collected the mattress and verified its condition:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-secondary">
              <li>A 100% full refund of the original purchase amount will be credited back to your original payment method (Stripe Credit/Debit Card or FPX Online Banking).</li>
              <li>Refunds typically reflect in your Malaysian bank account or credit card statement within <strong>5 to 10 business days</strong> depending on your issuing bank.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 pt-4 border-t border-borderLight">
            <h2 className="font-serif text-xl font-bold text-forest-dark">
              6. How to Initiate a Return or Claim
            </h2>
            <p className="text-secondary">
              To request a trial return, please contact our concierge team with your Order Invoice Number (e.g. <code>INV-...</code>):
            </p>
            <div className="bg-cream/40 p-4 rounded-xl border border-borderLight text-xs space-y-1.5 text-charcoal">
              <p><strong>KAMAAR Concierge Support</strong></p>
              <p>Email: <a href="mailto:concierge@kamaarbeddings.com" className="text-forest underline font-semibold">concierge@kamaarbeddings.com</a></p>
              <p>WhatsApp Hotline: <a href="https://wa.me/60123456789" className="text-forest underline font-semibold">+60 12-345 6789</a></p>
              <p>Operating Hours: Monday – Sunday, 10:00 AM – 8:00 PM (Malaysia Time)</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
