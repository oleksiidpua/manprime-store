import { prisma } from '@/lib/db'

export interface PublicReview {
  id: string
  authorName: string
  rating: number
  text: string
  city: string | null
  createdAt: Date
}

export interface ReviewsData {
  reviews: PublicReview[]
  total: number
  averageRating: number
}

export async function loadApprovedReviews(limit = 30): Promise<ReviewsData> {
  const [reviews, stats] = await Promise.all([
    prisma.review
      .findMany({
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          id: true,
          authorName: true,
          rating: true,
          text: true,
          city: true,
          createdAt: true,
        },
      })
      .catch(() => [] as PublicReview[]),
    prisma.review
      .aggregate({
        where: { status: 'APPROVED' },
        _count: { _all: true },
        _avg: { rating: true },
      })
      .catch(() => ({ _count: { _all: 0 }, _avg: { rating: null as number | null } })),
  ])

  const total = stats._count._all
  const averageRating = stats._avg.rating ? Number(stats._avg.rating.toFixed(2)) : 0

  return { reviews, total, averageRating }
}
