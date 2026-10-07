import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Shield, Scale } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service | KAMAAR Beddings Malaysia',
  description:
    'Legal terms and conditions governing the purchase of handcrafted mattresses, white-glove delivery, and use of the KAMAAR Beddings website.',
}

export default function TermsPage() {
  const lastUpdated = '1 October 2026'

  return (
    <div className="bg-cream min-h-screen py-12 md:py-20 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            Legal Framework
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-forest-dark">
            Terms of Service
          </h1>
          <p className="text-xs text-secondary">
            Last Updated: {lastUpdated} &bull; Governed under the Laws of Malaysia
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-warmwhite rounded-3xl p-6 sm:p-12 border border-borderLight shadow-sm space-y-8 text-xs sm:text-sm text-charcoal leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-forest-dark">
              1. Agreement to Terms
            </h2>
            <p className="text-secondary">
              These Terms of Service constitute a legally binding agreement made between you (&ldquo;Customer&rdquo;, &ldquo;you&rdquo;) and <strong>KAMAAR BEDDINGS SDN. BHD.</strong> (Company No. 202601099881) (&ldquo;KAMAAR Beddings&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), concerning your access to and use of our website, digital atelier, and the purchase of our sleep products.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-forest-dark">
              2. Products, Pricing & Currency
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-secondary">
              <li>All prices displayed on this website are denominated in <strong>Malaysian Ringgit (MYR)</strong> and inclusive of applicable statutory sales taxes unless explicitly stated otherwise.</li>
              <li>We strive to ensure complete accuracy in product representations, photography, dimensions (e.g. Single, Super Single, Queen, King), and materials. Minor handcrafted variances (&plusmn;1-2cm) inherent in textile sewing and fibre tufting craftsmanship are customary and accepted.</li>
              <li>We reserve the right to correct pricing typographical errors and adjust promotional vouchers prior to final order dispatch.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-forest-dark">
              3. Ordering & Payment Security
            </h2>
            <p className="text-secondary">
              Upon placing an order, you will receive an automated electronic order receipt. Official tax invoices with individual serial and order codes are issued upon successful payment processing via Stripe Malaysia. Full payment is required prior to mattress dispatch from our central logistics atelier.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-forest-dark">
              4. White-Glove In-Home Delivery
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-secondary">
              <li>Complimentary two-person white-glove setup and unboxing is provided for all mattress purchases delivered across Peninsular Malaysia.</li>
              <li>East Malaysia (Sabah, Sarawak, Labuan) orders are fulfilled through subsidized sea-freight door-to-door delivery.</li>
              <li>The customer is responsible for ensuring clear, accessible pathways from the residential entry to the designated bedroom suite.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-forest-dark">
              5. 100-Night Sleep Trial & 10-Year Warranty
            </h2>
            <p className="text-secondary">
              All mattresses purchased through our official online atelier are eligible for our{' '}
              <Link href="/trial" className="text-forest font-bold underline">
                100-Night Sleep Trial
              </Link>{' '}
              and covered by our{' '}
              <Link href="/warranty" className="text-forest font-bold underline">
                10-Year Structural Warranty
              </Link>
              , subject to the conditions outlined in our{' '}
              <Link href="/refunds" className="text-forest font-bold underline">
                Refund & Trial Policy
              </Link>
              .
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-forest-dark">
              6. Intellectual Property Rights
            </h2>
            <p className="text-secondary">
              All trademarks, logos, brand emblems, custom photography, mattress tailoring diagrams, and website designs are the exclusive intellectual property of KAMAAR BEDDINGS SDN. BHD. Any unauthorized duplication or commercial exploitation is strictly prohibited.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 pt-4 border-t border-borderLight">
            <h2 className="font-serif text-xl font-bold text-forest-dark">
              7. Governing Law & Jurisdiction
            </h2>
            <p className="text-secondary">
              These Terms shall be governed by and construed in accordance with the laws of Malaysia. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Kuala Lumpur, Malaysia.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
