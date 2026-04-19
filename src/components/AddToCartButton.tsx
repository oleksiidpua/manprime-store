'use client'

import { useState } from 'react'
import { addToCart } from '@/lib/cart'
import type { Product } from '@prisma/client'
import type ukDict from '@/dictionaries/uk.json'
import type { Locale } from '@/lib/i18n'

type Dict = typeof ukDict

export default function AddToCartButton({
  product,
  nameKey,
  dict,
  lang,
}: {
  product: Product
  nameKey: 'nameUk' | 'nameRu' | 'nameEn'
  dict: Dict
  lang: Locale
}) {
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product[nameKey],
      price: product.price,
      imageUrl: product.imageUrl,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleAdd}
      className="flex-1 border border-[#1a365d] hover:bg-[#1a365d] text-[#1a365d] hover:text-white font-heading py-4 uppercase tracking-widest text-sm transition-all"
    >
      {added
        ? (lang === 'uk' ? '✓ Додано!' : lang === 'ru' ? '✓ Добавлено!' : '✓ Added!')
        : dict.products.add_to_cart
      }
    </button>
  )
}
