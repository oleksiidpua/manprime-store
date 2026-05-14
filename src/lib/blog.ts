import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { marked } from 'marked'
import type { Locale } from '@/lib/i18n'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')
const LOCALES = ['uk', 'ru', 'en'] as const satisfies readonly Locale[]

export type BlogPostMeta = {
  slug: string
  title: string
  description: string
  date: string
  keywords: string[]
  readingTime: string
  cover?: string
}

export type BlogPost = BlogPostMeta & {
  contentHtml: string
}

async function readPostFile(locale: Locale, slug: string) {
  const filePath = path.join(BLOG_DIR, locale, `${slug}.md`)
  const raw = await fs.readFile(filePath, 'utf8')
  return matter(raw)
}

function toMeta(slug: string, data: Record<string, unknown>): BlogPostMeta {
  return {
    slug,
    title: String(data.title ?? ''),
    description: String(data.description ?? ''),
    date: String(data.date ?? ''),
    keywords: Array.isArray(data.keywords) ? (data.keywords as string[]) : [],
    readingTime: String(data.readingTime ?? ''),
    cover: data.cover ? String(data.cover) : undefined,
  }
}

export async function getAllPosts(locale: Locale): Promise<BlogPostMeta[]> {
  const dir = path.join(BLOG_DIR, locale)
  let files: string[]
  try {
    files = await fs.readdir(dir)
  } catch {
    return []
  }

  const posts = await Promise.all(
    files
      .filter((f) => f.endsWith('.md'))
      .map(async (f) => {
        const slug = f.replace(/\.md$/, '')
        const { data } = await readPostFile(locale, slug)
        return toMeta(slug, data)
      })
  )

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPost(locale: Locale, slug: string): Promise<BlogPost | null> {
  try {
    const { data, content } = await readPostFile(locale, slug)
    const contentHtml = await marked.parse(content, { gfm: true })
    return { ...toMeta(slug, data), contentHtml }
  } catch {
    return null
  }
}

export async function getAllSlugs(): Promise<{ lang: Locale; slug: string }[]> {
  const result: { lang: Locale; slug: string }[] = []
  for (const locale of LOCALES) {
    const dir = path.join(BLOG_DIR, locale)
    try {
      const files = await fs.readdir(dir)
      for (const f of files) {
        if (f.endsWith('.md')) {
          result.push({ lang: locale, slug: f.replace(/\.md$/, '') })
        }
      }
    } catch {
      // locale folder may not exist yet
    }
  }
  return result
}

export async function getUniqueSlugs(): Promise<string[]> {
  const all = await getAllSlugs()
  return [...new Set(all.map((p) => p.slug))]
}
