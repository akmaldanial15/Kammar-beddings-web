'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BookOpen, Clock } from 'lucide-react'
import { BlogPost } from '@/types'
import { formatDateMY } from '@/lib/utils/format'

interface JournalSectionProps {
  articles: BlogPost[]
}

export function JournalSection({ articles }: JournalSectionProps) {
  if (articles.length === 0) return null

  return (
    <section className="py-16 sm:py-24 bg-cream-light border-t border-borderLight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gold-dark flex items-center space-x-1.5 mb-2">
              <BookOpen className="w-3.5 h-3.5 text-gold" />
              <span>Sleep Science Journal</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest">
              Clinical Insights for Deeper Rest
            </h2>
            <p className="text-sm sm:text-base text-charcoal-muted mt-2 max-w-xl">
              Evidence-based guides on ergonomic spinal alignment, thermal dissipation, and non-toxic bedroom environments.
            </p>
          </div>

          <Link
            href="/blog"
            className="mt-4 md:mt-0 text-xs font-bold text-forest hover:text-gold-dark uppercase tracking-wider flex items-center space-x-1"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.slice(0, 3).map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="group bg-warmwhite rounded-2xl border border-borderLight overflow-hidden shadow-card flex flex-col justify-between hover:border-gold transition-all"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-cream">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-[11px] text-charcoal-muted mb-2">
                    <span className="text-gold-dark font-semibold">
                      {article.tags[0] || 'Sleep Science'}
                    </span>
                    <span>&bull;</span>
                    <span>{formatDateMY(article.publishedAt)}</span>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-bold text-charcoal group-hover:text-forest transition-colors leading-snug line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xs text-charcoal-muted line-clamp-3 mt-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-borderLight flex items-center justify-between text-xs">
                  <span className="text-charcoal-muted italic">{article.author}</span>
                  <span className="font-bold text-forest group-hover:text-gold-dark flex items-center space-x-1">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
