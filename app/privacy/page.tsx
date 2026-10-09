import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | KAMAAR Beddings Malaysia',
  description:
    'Our commitment to safeguarding your personal data in accordance with the Malaysian Personal Data Protection Act 2010 (PDPA).',
}

export default function PrivacyPage() {
  const lastUpdated = '1 October 2026'

  return (
    <div className="bg-cream min-h-screen py-12 md:py-20 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            Data Protection & Trust
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-forest-dark">
            Privacy Policy
          </h1>
          <p className="text-xs text-secondary">
            Last Updated: {lastUpdated} &bull; Regulated under Malaysian PDPA 2010
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-warmwhite rounded-3xl p-6 sm:p-12 border border-borderLight shadow-sm space-y-8 text-xs sm:text-sm text-charcoal leading-relaxed">
          {/* Quick Notice */}
          <div className="p-4 rounded-2xl bg-forest/5 border border-forest/20 flex items-start space-x-3">
            <Lock className="w-5 h-5 text-forest flex-shrink-0 mt-0.5" />
            <p className="text-xs text-forest-dark">
              <strong>Your Privacy Guarantee:</strong> KAMAAR Beddings (Tunas Sinar Jaya Enterprise) respects your confidentiality. We do not sell, rent, or trade your personal information to third-party data brokers. All financial transactions are processed securely through encrypted CHIP In Asia payment gateway infrastructure.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-forest-dark">
              1. Introduction & Scope
            </h2>
            <p className="text-secondary">
              This Privacy Policy outlines how <strong>KAMAAR BEDDINGS SDN. BHD.</strong> (Company Registration No. 202601099881) (&ldquo;KAMAAR Beddings&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) collects, uses, protects, and discloses personal information obtained through our official website, physical showroom studios, concierge lines, and related customer services in accordance with the <em>Personal Data Protection Act 2010</em> (PDPA) of Malaysia.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-forest-dark">
              2. Information We Collect
            </h2>
            <p className="text-secondary">
              We collect information necessary to provide luxury sleep products and white-glove delivery services, including:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-secondary">
              <li><strong>Contact Information:</strong> Full name, telephone number, email address, delivery residence address, state, and 5-digit postcode.</li>
              <li><strong>Order & Purchase Records:</strong> Mattress models selected, sizes, invoice numbers, delivery dates, and warranty registration details.</li>
              <li><strong>Payment Verification:</strong> Transaction reference IDs, payment method tokens, and billing confirmations via CHIP In Asia. (We do not store your bank credentials or raw payment secrets).</li>
              <li><strong>Digital Identifiers & Cookies:</strong> IP address, device type, browser settings, and user session cookies for cart persistence and bilingual preferences.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-forest-dark">
              3. Purpose of Processing Personal Data
            </h2>
            <p className="text-secondary">Your data is processed strictly for legitimate operational purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-secondary">
              <li>Processing, billing, and fulfilling your product order.</li>
              <li>Coordinating two-person white-glove bedroom delivery and in-home setup.</li>
              <li>Administering our 100-Night Sleep Trial and 10-Year Structural Warranty claims.</li>
              <li>Providing customer concierge support via telephone, WhatsApp, or email.</li>
              <li>Sending optional educational mattress care guides and exclusive promotional offers (only with your express consent).</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-forest-dark">
              4. Disclosure of Personal Information
            </h2>
            <p className="text-secondary">
              We may share necessary data only with vetted service providers bound by strict confidentiality agreements:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-secondary">
              <li><strong>Logistics & Freight Crews:</strong> Authorized delivery partners responsible for delivering heavy mattresses directly into your residence.</li>
              <li><strong>Payment Processors:</strong> CHIP In Asia (Chip Technology Sdn. Bhd.) for secure Bank Negara Malaysia &amp; PayNet compliant FPX online banking, Touch &apos;n Go eWallet, and card settlements.</li>
              <li><strong>Legal & Regulatory Authorities:</strong> When required by Malaysian court order, statutory regulation, or law enforcement.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-forest-dark">
              5. Data Security & Storage Integrity
            </h2>
            <p className="text-secondary">
              All communications between your browser and our web application are protected by 256-bit TLS (Transport Layer Security) encryption. Database records are maintained in secure facilities with restricted role-based operational permissions and audit logging.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-forest-dark">
              6. Your Rights Under Malaysian Law
            </h2>
            <p className="text-secondary">
              Under the Malaysian PDPA, you retain the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-secondary">
              <li>Request access to your stored personal records.</li>
              <li>Request correction of inaccurate or outdated contact information.</li>
              <li>Withdraw consent to receive marketing newsletters at any time via the unsubscribe link or contacting our concierge.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 pt-4 border-t border-borderLight">
            <h2 className="font-serif text-xl font-bold text-forest-dark">
              7. Data Protection Officer Contact
            </h2>
            <p className="text-secondary">
              For any questions regarding this Privacy Policy or your personal information, please write to our Data Privacy Officer:
            </p>
            <div className="bg-cream/40 p-4 rounded-xl border border-borderLight text-xs space-y-1 text-charcoal">
              <p><strong>KAMAAR BEDDINGS SDN. BHD.</strong></p>
              <p>Attention: Data Protection & Compliance Officer</p>
              <p>Flagship Atelier: No. 88, Jalan Maarof, Bangsar, 59100 Kuala Lumpur, Malaysia</p>
              <p>Email: <a href="mailto:privacy@kamaarbeddings.com" className="text-forest underline font-semibold">privacy@kamaarbeddings.com</a></p>
              <p>Telephone: +60 3-7722 1199</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
