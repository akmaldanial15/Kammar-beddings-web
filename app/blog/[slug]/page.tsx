import React from 'react'
import { getBlogPostBySlug, getBlogPosts } from '@/lib/db'
import { formatKLDate } from '@/lib/utils/format'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, User, Share2 } from 'lucide-react'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug)
  if (!post) return { title: 'Article Not Found | KAMAAR Beddings' }

  return {
    title: `${post.title} | KAMAAR Beddings Journal`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getBlogPostBySlug(params.slug)
  if (!post) {
    notFound()
  }

  const allPosts = await getBlogPosts()
  const related = allPosts.filter((p) => p.id !== post.id).slice(0, 2)

  return (
    <article className="bg-cream min-h-screen py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        <Link
          href="/blog"
          className="inline-flex items-center space-x-2 text-xs font-bold text-secondary hover:text-forest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journal</span>
        </Link>

        {/* Title & Metadata */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span
                key={t}
                className="px-3 py-1 bg-forest/10 text-forest text-xs font-bold rounded-full uppercase tracking-wider"
              >
                {t}
              </span>
            ))}
          </div>

          <h1 className="font-serif text-3xl md:text-5xl font-bold text-forest-dark leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center space-x-4 text-xs text-secondary border-y border-borderLight py-3">
            <span className="flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-gold" />
              <span>{post.author}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-gold" />
              <span>{formatKLDate(post.publishedAt)}</span>
            </span>
          </div>
        </div>

        {/* Featured Cover */}
        <div className="rounded-3xl overflow-hidden border border-borderLight shadow-md">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-[360px] md:h-[480px] object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="bg-warmwhite p-8 md:p-12 rounded-3xl border border-borderLight shadow-sm space-y-6 text-charcoal leading-relaxed text-sm md:text-base whitespace-pre-line font-sans">
          {post.content}
        </div>

        {/* Author Bio Box */}
        <div className="p-6 bg-forest-dark text-warmwhite rounded-2xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gold text-forest-dark flex items-center justify-center font-bold text-lg font-serif">
            L
          </div>
          <div>
            <h4 className="font-serif font-bold text-warmwhite">{post.author}</h4>
            <p className="text-xs text-warmwhite/80 mt-0.5">
              KAMAAR Sleep Ergonomics & Biomaterial Research Lab, Petaling Jaya, Malaysia.
            </p>
          </div>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="pt-8 border-t border-borderLight space-y-6">
            <h3 className="font-serif text-2xl font-bold text-forest-dark">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="bg-warmwhite p-5 rounded-2xl border border-borderLight hover:border-forest transition-colors space-y-2 block"
                >
                  <span className="text-[10px] text-gold font-bold uppercase tracking-wider block">
                    {r.tags[0]}
                  </span>
                  <h4 className="font-serif font-bold text-forest-dark text-base hover:text-forest line-clamp-2">
                    {r.title}
                  </h4>
                  <p className="text-xs text-secondary line-clamp-2">{r.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
