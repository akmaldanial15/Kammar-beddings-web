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
    id: 'usage',
    title: 'Apakah kegunaan utama tilam yang anda cari?',
    subtitle: 'Setiap rekaan tilam Tunas Sinar Jaya disesuaikan mengikut fungsi ruang dan keselesaan.',
    options: [
      { label: 'Santai Ruang Tamu & Famili', description: 'Tilam toto tebal, empuk dan boleh digulung untuk rehat seisi keluarga menonton TV atau bermain.', value: 'living' },
      { label: 'Tidur Harian Tradisi', description: 'Tilam dan bantal isian kekabu asli yang padat, sejuk dan mengekalkan keselesaan warisan.', value: 'tradisi' },
      { label: 'Asrama Pelajar / Bilik Bujang', description: 'Tilam bujang standard 3 kaki x 6 kaki yang tahan lasak dan menyokong tulang belakang.', value: 'asrama' },
      { label: 'Tetamu Bertandang / Mudah Alih', description: 'Tilam lipat 3 bahagian berzip yang mudah disimpan dalam almari atau dibawa jalan.', value: 'portable' },
    ],
  },
  {
    id: 'material',
    title: 'Apakah jenis isian yang anda gemari?',
    subtitle: 'Kami menggunakan bahan berkualiti tinggi dari unit pengeluaran kilang sendiri.',
    options: [
      { label: 'Asian Polyester Fibre Tebal', description: 'Empuk melantun, ringan, tidak mudah kemek, dan sarung berzip boleh dibasuh mesin.', value: 'fibre' },
      { label: '100% Kekabu Asli Berkualiti', description: 'Serat semulajadi pokok kekabu yang sejuk, padat dengan jahitan butang tufting tradisi.', value: 'kekabu' },
      { label: 'Rebonded Foam / High-Density Foam', description: 'Sokongan padat dan teguh, tidak melendut untuk kegunaan lasak asrama dan homestay.', value: 'foam' },
    ],
  },
  {
    id: 'size',
    title: 'Apakah saiz tilam yang anda perlukan?',
    subtitle: 'Mengikut saiz standard fabrik dan katil Malaysia.',
    options: [
      { label: 'Single Bujang / Asrama (3x6 Kaki)', description: 'Saiz 3 kaki x 6 kaki (90x190cm) - Pilihan asrama sekolah, kolej dan bilik bujang.', value: 'single' },
      { label: 'Queen (60" x 74")', description: 'Saiz 5 kaki - Paling laris untuk tilam toto santai keluarga atau bilik tidur utama.', value: 'queen' },
      { label: 'King (74" x 74")', description: 'Saiz besar 6 kaki - Ruang santai ekstra luas untuk 3-4 orang sekeluarga.', value: 'king' },
      { label: 'Lipat 3 Mudah Alih (3x6 Kaki)', description: 'Boleh dilipat kemas 3 bahagian, menjimatkan ruang penyimpanan di rumah.', value: 'lipat' },
    ],
  },
  {
    id: 'budget',
    title: 'Berapakah anggaran bajet anda?',
    subtitle: 'Semua produk ditawarkan terus pada harga jimat kilang Tunas Sinar Jaya.',
    options: [
      { label: 'Ekonomi Jimat (Bawah RM150)', description: 'Tilam lipat 3 berzip, tilam bujang asrama bajet, atau tilam toto single.', value: 'budget' },
      { label: 'Standard Kilang (RM150 - RM250)', description: 'Tilam toto Queen tebal bunga floral atau tilam bujang asrama tebal 5-inci.', value: 'mid' },
      { label: 'Pakej Premium (RM250 ke atas)', description: 'Tilam toto King bersaiz besar atau tilam kekabu asli tradisi bersulam kemas.', value: 'premium' },
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

  // Scoring engine aligned with Tunas Sinar Jaya products
  const recommendedProducts = useMemo(() => {
    if (!showResults) return []

    const scored = products
      .map((product) => {
        let score = 40
        const reasons: string[] = []
        const nameLower = product.name.toLowerCase()
        const descLower = (product.description || '').toLowerCase()

        if (answers.usage === 'living') {
          if (nameLower.includes('toto') || product.categoryId === 'cat-tilam-toto') {
            score += 35
            reasons.push('Tilam toto tebal sangat praktikal dan empuk untuk santai ruang tamu sekeluarga')
          }
        } else if (answers.usage === 'tradisi') {
          if (nameLower.includes('kekabu') || product.categoryId === 'cat-tilam-kekabu') {
            score += 35
            reasons.push('Isian kekabu asli tradisi memberikan rasa sejuk dan kelembutan semulajadi')
          }
        } else if (answers.usage === 'asrama') {
          if (nameLower.includes('asrama') || nameLower.includes('bujang') || product.categoryId === 'cat-tilam-lipat') {
            score += 35
            reasons.push('Direka mengikut spesifikasi saiz standard asrama Malaysia 3 kaki x 6 kaki')
          }
        } else if (answers.usage === 'portable') {
          if (nameLower.includes('lipat') || nameLower.includes('portable')) {
            score += 35
            reasons.push('Reka bentuk lipat 3 bahagian mudah alih dan jimat ruang penyimpanan')
          }
        }

        if (answers.material === 'fibre') {
          if (descLower.includes('polyester') || descLower.includes('fibre') || nameLower.includes('toto')) {
            score += 20
            reasons.push('Isian Asian Polyester Fibre gebu, anjal dan sarung berzip mudah dibasuh')
          }
        } else if (answers.material === 'kekabu') {
          if (descLower.includes('kekabu') || nameLower.includes('kekabu')) {
            score += 20
            reasons.push('Menggunakan 100% kekabu asli bersih terpilih tanpa bahan sintetik')
          }
        } else if (answers.material === 'foam') {
          if (descLower.includes('foam') || descLower.includes('rebonded') || nameLower.includes('asrama')) {
            score += 20
            reasons.push('Struktur padat berketumpatan tinggi tahan lasak untuk kegunaan harian')
          }
        }

        if (answers.size === 'queen' && nameLower.includes('queen')) {
          score += 15
          reasons.push('Saiz Queen 5-kaki padanan tepat untuk keluasan ruang anda')
        } else if (answers.size === 'king' && nameLower.includes('king')) {
          score += 15
          reasons.push('Saiz King 6-kaki ekstra luas untuk keselesaan maksima')
        } else if ((answers.size === 'single' || answers.size === 'lipat') && (nameLower.includes('single') || nameLower.includes('bujang') || nameLower.includes('lipat'))) {
          score += 15
          reasons.push('Saiz kompak 3-kaki sesuai untuk ruang terhad dan asrama')
        }

        return { product, score, reasons }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)

    return scored
  }, [answers, products, showResults])

  const currentQ = questions[currentStep]

  return (
    <div className="bg-warmwhite py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {!showResults ? (
          <div>
            {/* Header */}
            <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gold-dark flex items-center justify-center space-x-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>Kuis Panduan Tilam Kilang</span>
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest">
                Cari Tilam Yang Tepat Untuk Anda
              </h1>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-2">
                Jawab 4 soalan mudah untuk cadangan tilam toto, kekabu atau asrama yang paling berbaloi terus dari kilang.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs text-charcoal-muted mb-2 font-mono">
                <span>Langkah {currentStep + 1} daripada {questions.length}</span>
                <span>{Math.round(((currentStep + 1) / questions.length) * 100)}% Selesai</span>
              </div>
              <div className="w-full h-1.5 bg-cream rounded-full overflow-hidden">
                <div
                  className="h-full bg-forest transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Question */}
            <div className="bg-cream-light rounded-2xl p-6 sm:p-10 border border-borderLight shadow-card">
              <div className="mb-6 sm:mb-8">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
                  {currentQ.title}
                </h2>
                <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
                  {currentQ.subtitle}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelectOption(currentQ.id, option.value)}
                    className="w-full text-left p-4 sm:p-5 rounded-xl border border-borderLight bg-warmwhite hover:bg-cream hover:border-gold transition-all flex items-start justify-between group shadow-subtle hover:shadow-card"
                  >
                    <div className="pr-4">
                      <div className="font-semibold text-sm sm:text-base text-charcoal group-hover:text-forest transition-colors">
                        {option.label}
                      </div>
                      <div className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                        {option.description}
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full border border-borderLight flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-forest group-hover:bg-forest text-warmwhite transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>

              {/* Back button */}
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="mt-6 text-xs text-charcoal-muted hover:text-forest flex items-center space-x-1 font-semibold"
                >
                  <span>&larr; Soalan Sebelumnya</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Results Screen */
          <div className="space-y-8 animate-fade-in">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gold-dark flex items-center justify-center space-x-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>Cadangan Padanan Terbaik</span>
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest">
                Tilam Yang Paling Sesuai Untuk Anda
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-2">
                Berdasarkan pilihan kegunaan dan saiz anda, berikut adalah produk keluaran kilang Tunas Sinar Jaya yang paling tepat:
              </p>

              <button
                onClick={restartQuiz}
                className="mt-4 inline-flex items-center space-x-1.5 text-xs text-forest hover:text-forest-dark font-semibold border-b border-forest/30 pb-0.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulang Semula Kuis</span>
              </button>
            </div>

            {/* Results Cards */}
            <div className="space-y-6">
              {recommendedProducts.map(({ product, score, reasons }, index) => {
                const sizeVariant = product.variants?.[0] || {
                  id: product.id + '-var',
                  productId: product.id,
                  sizeName: 'Standard',
                  dimensions: 'Standard Kilang',
                  priceSen: 14900,
                  stockQuantity: 10,
                  sku: 'TSJ-STD',
                  isActive: true,
                }
                const matchPercent = Math.min(99, Math.round((score / 100) * 100))

                return (
                  <div
                    key={product.id}
                    className="bg-warmwhite rounded-2xl p-6 sm:p-8 border border-borderLight shadow-card flex flex-col md:flex-row gap-6 items-start"
                  >
                    <div className="relative w-full md:w-56 aspect-[4/3] rounded-xl overflow-hidden bg-cream flex-shrink-0 border border-borderLight">
                      <Image
                        src={product.images[0]?.imageUrl || '/images/products/tilam-toto-queen.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-forest text-warmwhite text-[10px] font-bold rounded">
                        #{index + 1} Pilihan Terbaik
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-gold-dark">
                          {product.material}
                        </span>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-full">
                          {matchPercent}% Keserasian
                        </span>
                      </div>

                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest mt-1">
                        {product.name}
                      </h3>

                      <p className="text-xs text-charcoal-muted mt-1.5 leading-relaxed">
                        {product.shortDescription}
                      </p>

                      <div className="mt-3 pt-3 border-t border-borderLight space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal">
                          Sebab produk ini sesuai untuk anda:
                        </span>
                        {reasons.map((r, i) => (
                          <div key={i} className="flex items-center space-x-1.5 text-xs text-charcoal-muted">
                            <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-3 border-t border-borderLight flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <span className="text-[10px] text-charcoal-muted uppercase block">
                            Saiz Disyorkan: {sizeVariant.sizeName} ({sizeVariant.dimensions})
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
                            <span>Tambah Ke Troli</span>
                          </button>

                          <Link
                            href={`/products/${product.slug}`}
                            className="px-4 py-2.5 bg-cream hover:bg-cream-dark text-charcoal text-xs font-semibold rounded-lg border border-borderLight transition-colors"
                          >
                            Maklumat Penuh &rarr;
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
