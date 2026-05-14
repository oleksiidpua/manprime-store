import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary, locales, type Locale } from '@/lib/i18n'
import { getAllPosts } from '@/lib/blog'
import { pageMetadata } from '@/lib/seo'

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang)
  return pageMetadata({
    lang,
    path: '/blog',
    title: dict.blog.indexTitle,
    description: dict.blog.indexDescription,
  })
}

const DATE_LOCALES: Record<Locale, string> = {
  uk: 'uk-UA',
  ru: 'ru-RU',
  en: 'en-US',
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const t = dict.blog
  const posts = await getAllPosts(lang)

  return (
    <div className="bg-background min-h-screen">
      <main className="pt-20 md:pt-28 pb-24">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-copper text-[11px] tracking-[0.35em] uppercase font-medium">
              {t.tag}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mt-4 leading-tight">
              {t.indexTitle}
            </h1>
            <p className="text-muted text-base md:text-lg leading-relaxed mt-5">
              {t.indexDescription}
            </p>
          </div>

          {posts.length === 0 ? (
            <p className="text-center text-muted">{t.empty}</p>
          ) : (
            <ul className="grid gap-5">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/${lang}/blog/${post.slug}`}
                    className="group block rounded-2xl border border-border bg-surface hover:border-copper/40 transition-colors p-6 md:p-8"
                  >
                    <div className="flex items-center gap-3 text-[12px] tracking-wide text-muted-2">
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString(DATE_LOCALES[lang], {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                      {post.readingTime && (
                        <>
                          <span>·</span>
                          <span>{post.readingTime}</span>
                        </>
                      )}
                    </div>
                    <h2 className="font-serif text-foreground text-2xl md:text-3xl leading-tight mt-3 group-hover:text-copper transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted text-[15px] leading-relaxed mt-3">
                      {post.description}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-copper text-[13px] font-medium tracking-wide mt-5">
                      {t.readMore}
                      <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}
