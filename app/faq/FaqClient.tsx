'use client'

import React, { useState } from 'react'
import { Search, ChevronDown, MessageSquare, Phone } from 'lucide-react'
import Link from 'next/link'

interface FaqItem {
  id: string
  category: string
  question: string
  answer: string
}

const FAQ_LIST: FaqItem[] = [
  {
    id: 'f-1',
    category: 'Delivery & Setup',
    question: 'How does complimentary white-glove mattress delivery work in Peninsular Malaysia?',
    answer:
      'All mattress orders include complimentary two-man delivery directly into your bedroom of choice, unboxing, proper bedframe placement, and complete removal of all protective packaging. For condos and landed residences, our delivery fleet will call ahead 24 hours prior to confirm elevator access and time windows.',
  },
  {
    id: 'f-2',
    category: 'Delivery & Setup',
    question: 'Do you deliver to Sabah, Sarawak, and Labuan?',
    answer:
      'Yes, we ship nationwide across East Malaysia via specialized sea-freight logistics. Bulky mattresses incur a flat rate of RM280 per piece, and parcel accessories (pillows, bed linen, protectors) are charged at RM65 per shipment.',
  },
  {
    id: 'f-3',
    category: '100-Night Trial',
    question: 'How does the 100-Night Risk-Free Sleep Trial work?',
    answer:
      'We understand that your body needs 3 to 4 weeks to adjust to proper orthopedic alignment. Sleep on your LENA mattress for at least 30 nights. If you are not thoroughly satisfied within 100 nights, contact our concierge for a hassle-free return and 100% full refund.',
  },
  {
    id: 'f-4',
    category: '10-Year Warranty',
    question: 'What is covered under the 10-Year Comprehensive Structural Warranty?',
    answer:
      'Our warranty protects against permanent indentations greater than 2.0 cm, coil spring deformation or breakage, and latex degradation under proper foundation support. Register your invoice on our website within 30 days of delivery to activate your digital certificate.',
  },
  {
    id: 'f-5',
    category: 'Materials & Care',
    question: 'Why choose 100% natural Malaysian latex over synthetic memory foam?',
    answer:
      'Malaysian natural latex is harvested sustainably from local Hevea brasiliensis rubber trees. It features an open-cell breathable structure that prevents heat retention in Malaysia’s tropical humidity, provides instantaneous buoyant pushback without sinking, and is naturally hypoallergenic and anti-dust mite.',
  },
  {
    id: 'f-6',
    category: 'Materials & Care',
    question: 'Do I need to flip my LENA mattress?',
    answer:
      'No. LENA mattresses are engineered with a dedicated multi-layer comfort core on top and a high-density foundation base at the bottom. We simply recommend rotating the mattress 180 degrees head-to-toe once every 3 to 6 months to ensure even wear.',
  },
  {
    id: 'f-7',
    category: 'Payments & Instalments',
    question: 'What payment methods do you accept online?',
    answer:
      'We accept Visa, Mastercard, and FPX Online Banking via Stripe’s bank-grade encrypted checkout gateway. All transactions are securely processed in Malaysian Ringgit (MYR).',
  },
]

export function FaqClient() {
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('All')
  const [openId, setOpenId] = useState<string | null>('f-1')

  const categories = ['All', 'Delivery & Setup', '100-Night Trial', '10-Year Warranty', 'Materials & Care', 'Payments & Instalments']

  const filtered = FAQ_LIST.filter((item) => {
    const matchesCat = selectedCat === 'All' || item.category === selectedCat
    const matchesSearch =
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto">
        <Search className="w-5 h-5 text-secondary absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search question, keyword, or topic..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 text-sm rounded-2xl bg-warmwhite border border-borderLight focus:outline-none focus:border-forest shadow-sm"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedCat === cat
                ? 'bg-forest text-warmwhite shadow-sm'
                : 'bg-warmwhite border border-borderLight text-secondary hover:text-charcoal'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-warmwhite rounded-2xl border border-borderLight text-secondary text-sm">
            No questions matched your search query. Please contact our concierge below.
          </div>
        ) : (
          filtered.map((item) => {
            const isOpen = openId === item.id
            return (
              <div
                key={item.id}
                className="bg-warmwhite rounded-2xl border border-borderLight overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-cream/20 transition-colors"
                >
                  <span className="font-serif font-bold text-forest-dark text-base md:text-lg">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gold flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-5 pt-0 text-xs md:text-sm text-secondary leading-relaxed border-t border-borderLight/40 bg-cream/20">
                    <p className="mt-3">{item.answer}</p>
                    <div className="mt-3 text-[10px] uppercase tracking-wider text-gold font-bold">
                      Category: {item.category}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Concierge Support CTA */}
      <div className="bg-forest-dark text-warmwhite p-8 rounded-3xl max-w-3xl mx-auto text-center space-y-4 shadow-xl">
        <h3 className="font-serif text-2xl font-bold text-warmwhite">
          Still Have Questions About Our Sleep Systems?
        </h3>
        <p className="text-xs md:text-sm text-warmwhite/80 max-w-lg mx-auto">
          Our certified Malaysian sleep ergonomists are on standby via WhatsApp and phone to assist with firmness selection and delivery scheduling.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/contact"
            className="px-6 py-2.5 bg-gold text-forest-dark text-xs font-bold rounded-xl hover:bg-gold/90 transition-colors shadow-sm"
          >
            Contact Customer Concierge
          </Link>
          <a
            href="https://wa.me/60123456789"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-2.5 bg-warmwhite/10 border border-warmwhite/20 text-warmwhite text-xs font-bold rounded-xl hover:bg-warmwhite/20 transition-colors"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
