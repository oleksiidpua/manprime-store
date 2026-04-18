import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import AdminClient from '@/components/AdminClient'

async function getAdminUser() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  if (!userId) return null
  const user = await prisma.user.findUnique({ where: { id: userId } }).catch(() => null)
  return user?.role === 'ADMIN' ? user : null
}

export default async function AdminPage() {
  const user = await getAdminUser()
  if (!user) redirect('/uk/auth')

  const [products, orders] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: 'asc' } }).catch(() => []),
    prisma.order.findMany({
      include: { items: { include: { product: true } }, shipment: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }).catch(() => []),
  ])

  return <AdminClient products={products} orders={orders} />
}
