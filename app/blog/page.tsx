import React from 'react'
import { getBlogPosts } from '@/lib/db'
import { formatKLDate } from '@/lib/utils/format'
import Link from 'next/link'
import { Clock, ArrowRight, BookOpen } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jurnal & Panduan Penjagaan Tekstil | KAMAAR Beddings Malaysia',
  description:
    'Petua penjagaan tilam toto, keistimewaan kekabu asli tradisi, dan panduan memilih tilam asrama daripada Tunas Sinar Jaya Enterprise.',
}

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="bg-cream min-h-screen py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            Panduan & Artikel Kilang
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-forest-dark">
            Jurnal & Panduan Tekstil KAMAAR
          </h1>
          <p className="text-sm md:text-base text-secondary">
            Perkongsian ilmu daripada pengeluar tilam dan tekstil Tunas Sinar Jaya Enterprise mengenai penjagaan tilam toto, kekabu asli tradisi dan kelengkapan tidur keluarga.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-warmwhite rounded-3xl border border-borderLight overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex gap-1">
                    {post.tags.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 bg-forest-dark/80 backdrop-blur-md text-gold text-[10px] font-bold rounded-full uppercase tracking-wider"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-3">
                  <div className="flex items-center space-x-2 text-[11px] text-secondary">
                    <Clock className="w-3.5 h-3.5 text-gold" />
                    <span>{formatKLDate(post.publishedAt)}</span>
                    <span>•</span>
                    <span>5 min read</span>
                  </div>

                  <h2 className="font-serif text-xl font-bold text-forest-dark line-clamp-2 hover:text-forest transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  <p className="text-xs text-secondary leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 md:p-8 pt-0">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center space-x-2 text-xs font-bold text-forest hover:text-forest-dark transition-colors"
                >
                  <span>Read Full Essay</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gold" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
