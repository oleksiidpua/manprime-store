import Link from 'next/link'
import Script from 'next/script'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getDictionary, locales, type Locale } from '@/lib/i18n'
import { getAllSlugs, getPost } from '@/lib/blog'
import { pageMetadata, SITE_URL } from '@/lib/seo'

type Params = { lang: Locale; slug: string }

export async function generateStaticParams() {
  const all = await getAllSlugs()
  return all.map(({ lang, slug }) => ({ lang, slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const post = await getPost(lang, slug)
  if (!post) {
    return pageMetadata({ lang, path: `/blog/${slug}`, title: 'Not found', description: '', noIndex: true })
  }
  return pageMetadata({
    lang,
    path: `/blog/${slug}`,
    title: post.title,
    description: post.description,
    ogImage: post.cover,
  })
}

const DATE_LOCALES: Record<Locale, string> = {
  uk: 'uk-UA',
  ru: 'ru-RU',
  en: 'en-US',
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { lang, slug } = await params
  const post = await getPost(lang, slug)
  if (!post) notFound()

  const dict = await getDictionary(lang)
  const t = dict.blog

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: lang,
    author: { '@type': 'Organization', name: 'ManPrime' },
    publisher: {
      '@type': 'Organization',
      name: 'ManPrime',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo-original.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/${lang}/blog/${slug}` },
    keywords: post.keywords.join(', '),
    ...(post.cover && {
      image: post.cover.startsWith('http') ? post.cover : `${SITE_URL}${post.cover}`,
    }),
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ManPrime', item: `${SITE_URL}/${lang}` },
      { '@type': 'ListItem', position: 2, name: t.tag, item: `${SITE_URL}/${lang}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/${lang}/blog/${slug}` },
    ],
  }

  return (
    <div className="bg-background min-h-screen">
      <Script
        id="ld-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <Script
        id="ld-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <main className="pt-20 md:pt-28 pb-24">
        <article className="max-w-3xl mx-auto px-5 md:px-8">
          <Link
            href={`/${lang}/blog`}
            className="inline-flex items-center gap-1.5 text-muted hover:text-copper text-[13px] tracking-wide transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
            </svg>
            {t.backToList}
          </Link>

          <header className="mt-6 mb-10 border-b border-border pb-8">
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
            <h1 className="font-serif text-4xl md:text-5xl text-foreground leading-tight tracking-tight mt-4">
              {post.title}
            </h1>
            <p className="text-muted text-base md:text-lg leading-relaxed mt-5">
              {post.description}
            </p>
          </header>

          <div className="prose-article" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

          <aside className="mt-14 rounded-3xl border border-border bg-surface p-8 md:p-10">
            <h2 className="font-serif text-foreground text-2xl md:text-3xl">{t.ctaTitle}</h2>
            <p className="text-muted text-[15px] leading-relaxed mt-3">{t.ctaDescription}</p>
            <Link
              href={`/${lang}/product/forte`}
              className="mt-6 inline-flex items-center gap-2 bg-copper hover:bg-copper-hover text-background font-medium text-sm tracking-wide px-6 py-3 rounded-full transition-colors"
            >
              {t.ctaButton}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </aside>
        </article>
      </main>
    </div>
  )
}
