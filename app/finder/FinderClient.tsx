'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, ArrowRight, RotateCcw, Check, ShoppingBag, ShieldCheck } from 'lucide-react'
import { Product } from '@/types'
import { formatMYR } from '@/lib/utils/format'
import { useCart } from '@/lib/context/CartContext'

interface Question {
  id: string
  title: string
  subtitle: string
  options: {
    label: string
    description: string
    value: string
  }[]
}

const questions: Question[] = [
  {
    id: 'position',
    title: 'What is your primary sleeping position?',
    subtitle: 'Your spine aligns differently depending on your sleep posture.',
    options: [
      { label: 'Side Sleeper', description: 'Requires plush shoulder and hip contouring to eliminate joint numbness.', value: 'side' },
      { label: 'Back Sleeper', description: 'Requires ergonomic lumbar pushback to prevent lower spine sagging.', value: 'back' },
      { label: 'Stomach Sleeper', description: 'Requires a firm surface to prevent excessive hyperextension of the neck and back.', value: 'stomach' },
      { label: 'Combination Sleeper', description: 'Tosses and turns; needs responsive, buoyant bounce for effortless movement.', value: 'combination' },
    ],
  },
  {
    id: 'firmness',
    title: 'How do you like your mattress to feel?',
    subtitle: 'From cloud-like cradling to solid orthopaedic stability.',
    options: [
      { label: 'Plush & Soft (1-3 / 10)', description: 'Gentle, cloud-like cushioning with zero pressure points.', value: 'soft' },
      { label: 'Balanced Medium (4-6 / 10)', description: 'The sweet spot: initial plushness with resilient underlying support.', value: 'medium' },
      { label: 'Ergonomic Firm (7-10 / 10)', description: 'Solid, unyielding posture support favored for spinal recovery.', value: 'firm' },
    ],
  },
  {
    id: 'temperature',
    title: 'How does your bedroom climate feel at night?',
    subtitle: 'Tropical Malaysian weather demands deliberate thermal dissipation.',
    options: [
      { label: 'I Sleep Very Warm (Hot Sleeper)', description: 'Needs active sub-zero Japanese Ice-Silk fabric & aerated latex.', value: 'hot' },
      { label: 'Standard Room Temperature', description: 'Natural convective pinhole latex for neutral breathability.', value: 'neutral' },
      { label: 'Chilled Air-Conditioned Bedroom', description: 'Enjoys plush luxury wrapping with organic wool and tencel.', value: 'cool' },
    ],
  },
  {
    id: 'size',
    title: 'What mattress size are you looking for?',
    subtitle: 'All sizes handcrafted in Malaysian standard dimensions.',
    options: [
      { label: 'Single (91x190cm)', description: 'Ideal for children, teens, or daybed guest rooms.', value: 'Single' },
      { label: 'Super Single (107x190cm)', description: 'Extra shoulder room for solo adult sleepers.', value: 'Super Single' },
      { label: 'Queen (152x190cm)', description: 'Malaysia’s most popular choice for couples and master rooms.', value: 'Queen' },
      { label: 'King (183x190cm)', description: 'Spacious presidential comfort with maximum personal space.', value: 'King' },
    ],
  },
  {
    id: 'budget',
    title: 'What is your intended investment range?',
    subtitle: 'Every LENA SLEEP mattress includes 10-year warranty & 100-night trial.',
    options: [
      { label: 'Accessible Value (Under RM2,500)', description: 'Pure 100% natural latex essential comfort.', value: 'budget' },
      { label: 'Balanced Luxury (RM2,500 - RM4,500)', description: 'Signature 7-zone latex and cool hybrid pocket springs.', value: 'mid' },
      { label: 'Presidential Atelier (Above RM4,500)', description: 'Bespoke 34cm dual-spring and Talalay luxury.', value: 'luxury' },
    ],
  },
]

interface FinderClientProps {
  products: Product[]
}

export function FinderClient({ products }: FinderClientProps) {
  const { addItem } = useCart()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)

  const handleSelectOption = (questionId: string, value: string) => {
    const updated = { ...answers, [questionId]: value }
    setAnswers(updated)

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowResults(true)
    }
  }

  const restartQuiz = () => {
    setAnswers({})
    setCurrentStep(0)
    setShowResults(false)
  }

  // Deterministic Scoring Engine
  const recommendedMattresses = useMemo(() => {
    if (!showResults) return []

    const scored = products
      .filter((p) => p.productType === 'mattress')
      .map((product) => {
        let score = 50
        const reasons: string[] = []

        // Sleep position matching
        if (answers.position === 'side') {
          if (product.firmness?.toLowerCase().includes('soft') || product.firmness?.toLowerCase().includes('medium')) {
            score += 25
            reasons.push('Plush shoulder cushioning ideal for side sleeping')
          }
        } else if (answers.position === 'back' || answers.position === 'stomach') {
          if (product.firmness?.toLowerCase().includes('firm') || (product.firmnessScale && product.firmnessScale >= 6)) {
            score += 25
            reasons.push('Ergonomic non-sag support aligned for back posture')
          }
        } else if (answers.position === 'combination') {
          if (product.material?.includes('Latex')) {
            score += 20
            reasons.push('Buoyant natural latex allows effortless tossing and turning')
          }
        }

        // Temperature preference
        if (answers.temperature === 'hot') {
          if (product.name.includes('Cool Night') || product.material?.includes('Latex')) {
            score += 30
            reasons.push('High thermal dissipation engineered for warm Malaysian nights')
          }
        }

        // Firmness preference
        if (answers.firmness === 'soft' && product.firmness?.toLowerCase().includes('soft')) {
          score += 25
          reasons.push('Matches your requested plush, cloud-like comfort level')
        } else if (answers.firmness === 'medium' && product.firmness?.toLowerCase().includes('medium')) {
          score += 25
          reasons.push('Balanced medium firmness offering universal pressure relief')
        } else if (answers.firmness === 'firm' && product.firmness?.toLowerCase().includes('firm')) {
          score += 25
          reasons.push('Targeted orthopaedic rigidity for spinal stability')
        }

        // Budget matching
        const minPrice = Math.min(...product.variants.map((v) => v.priceSen))
        if (answers.budget === 'budget' && minPrice < 250000) {
          score += 20
          reasons.push('Fits comfortably within your value target')
        } else if (answers.budget === 'mid' && minPrice >= 200000 && minPrice <= 450000) {
          score += 20
          reasons.push('Optimal balance of luxury specifications and value')
        } else if (answers.budget === 'luxury' && minPrice > 400000) {
          score += 20
          reasons.push('Bespoke multi-tiered presidential construction')
        }

        const matchPercent = Math.min(99, Math.max(78, score))
        return { product, matchPercent, reasons: reasons.slice(0, 3) }
      })

    return scored.sort((a, b) => b.matchPercent - a.matchPercent).slice(0, 3)
  }, [showResults, answers, products])

  const q = questions[currentStep]

  return (
    <div className="bg-cream-light min-h-[85vh] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {!showResults ? (
          <div className="bg-warmwhite rounded-3xl p-6 sm:p-10 border border-borderLight shadow-2xl">
            {/* Quiz Progress Header */}
            <div className="flex items-center justify-between pb-6 border-b border-borderLight">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gold-dark flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                  <span>Question {currentStep + 1} of {questions.length}</span>
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest mt-1">
                  {q.title}
                </h1>
                <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
                  {q.subtitle}
                </p>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-forest">
                  {Math.round(((currentStep + 1) / questions.length) * 100)}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-cream h-2 rounded-full overflow-hidden mt-4 mb-8">
              <div
                className="bg-gold h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Options List */}
            <div className="space-y-3.5">
              {q.options.map((opt) => {
                const isSelected = answers[q.id] === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelectOption(q.id, opt.value)}
                    className={`w-full p-4 sm:p-5 rounded-2xl border text-left transition-all flex items-start justify-between group ${
                      isSelected
                        ? 'bg-cream border-forest shadow-md ring-2 ring-forest/20'
                        : 'bg-warmwhite border-borderLight hover:bg-cream-light hover:border-gold shadow-subtle'
                    }`}
                  >
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-charcoal group-hover:text-forest transition-colors">
                        {opt.label}
                      </h3>
                      <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-4 transition-colors ${
                        isSelected ? 'border-forest bg-forest text-warmwhite' : 'border-borderLight'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Back / Skip Controls */}
            <div className="mt-8 pt-4 border-t border-borderLight flex items-center justify-between text-xs">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="text-charcoal-muted hover:text-charcoal disabled:opacity-30 font-semibold"
              >
                &larr; Previous Question
              </button>

              <button
                onClick={() => handleSelectOption(q.id, q.options[0].value)}
                className="text-gold-dark hover:underline font-semibold"
              >
                Skip Question &rarr;
              </button>
            </div>
          </div>
        ) : (
          /* Results View */
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gold-dark flex items-center justify-center space-x-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>Deterministic Scoring Complete</span>
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest">
                Your Ideal Mattress Matches
              </h1>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-2">
                Based on your {answers.position} sleeping position, {answers.firmness} comfort preference, and Malaysian climate profile.
              </p>
              <button
                onClick={restartQuiz}
                className="mt-4 inline-flex items-center space-x-1.5 text-xs font-semibold text-gold-dark hover:text-forest underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz with Different Preferences</span>
              </button>
            </div>

            {/* 3 Recommended Cards */}
            <div className="space-y-6">
              {recommendedMattresses.map(({ product, matchPercent, reasons }, index) => {
                const requestedSize = answers.size || 'Queen'
                const sizeVariant =
                  product.variants.find((v) => v.sizeName.toLowerCase() === requestedSize.toLowerCase()) ||
                  product.variants[0]

                return (
                  <div
                    key={product.id}
                    className="bg-warmwhite rounded-2xl border border-borderLight shadow-card p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-full md:w-56 aspect-[4/3] rounded-xl overflow-hidden bg-cream flex-shrink-0 border border-borderLight">
                      <Image
                        src={product.images[0]?.imageUrl || ''}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-forest text-warmwhite text-[10px] font-bold rounded">
                        #{index + 1} Best Match
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-gold-dark">
                          {product.material}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-900 font-bold text-xs rounded-full">
                          {matchPercent}% Compatibility Match
                        </span>
                      </div>

                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest mt-1">
                        {product.name}
                      </h3>

                      <p className="text-xs text-charcoal-muted mt-1.5 leading-relaxed">
                        {product.shortDescription}
                      </p>

                      {/* Matching rationale */}
                      <div className="mt-3 pt-3 border-t border-borderLight space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal">
                          Why this matches your answers:
                        </span>
                        {reasons.map((r, i) => (
                          <div key={i} className="flex items-center space-x-1.5 text-xs text-charcoal-muted">
                            <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-3 border-t border-borderLight flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <span className="text-[10px] text-charcoal-muted uppercase block">
                            Recommended Size: {sizeVariant.sizeName} ({sizeVariant.dimensions})
                          </span>
                          <span className="text-xl font-bold text-forest">
                            {formatMYR(sizeVariant.priceSen)}
                          </span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() =>
                              addItem({
                                variantId: sizeVariant.id,
                                productId: product.id,
                                productName: product.name,
                                sizeName: sizeVariant.sizeName,
                                sku: sizeVariant.sku,
                                dimensions: sizeVariant.dimensions,
                                priceSen: sizeVariant.priceSen,
                                imageUrl: product.images[0]?.imageUrl || '',
                                quantity: 1,
                                stockAvailable: sizeVariant.stockQuantity,
                              })
                            }
                            className="px-5 py-2.5 bg-forest hover:bg-forest-dark text-warmwhite text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm flex items-center space-x-1.5 transition-colors"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-gold" />
                            <span>Add to Cart</span>
                          </button>

                          <Link
                            href={`/products/${product.slug}`}
                            className="px-4 py-2.5 bg-cream hover:bg-cream-dark text-charcoal text-xs font-semibold rounded-lg border border-borderLight transition-colors"
                          >
                            Full Details &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
