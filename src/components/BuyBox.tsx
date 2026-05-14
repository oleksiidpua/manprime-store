'use client'

import { useState } from 'react'
import Image from 'next/image'
import OrderButton from '@/components/OrderButton'
import type { Locale } from '@/lib/i18n'

export interface BuyVariant {
  id: string
  slug: string
  productName: string
  variantLabel: string
  variantSub: string
  badge?: string
  price: number
  oldPrice: number
  image: string
}

interface BuyBoxProps {
  lang: Locale
  variants: BuyVariant[]
  oldPriceLabel: string
  uahLabel: string
  inStockLabel?: string
  variant?: 'full' | 'compact'
}

export default function BuyBox({
  lang,
  variants,
  oldPriceLabel,
  uahLabel,
  inStockLabel,
  variant = 'full',
}: BuyBoxProps) {
  const [selectedId, setSelectedId] = useState(variants[1]?.id ?? variants[0].id)
  const selected = variants.find((v) => v.id === selectedId) ?? variants[0]

  return (
    <div className="w-full">
      {/* Variant cards */}
      <div className={`grid ${variants.length === 2 ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
        {variants.map((v) => {
          const isSelected = v.id === selectedId
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => setSelectedId(v.id)}
              aria-pressed={isSelected}
              className={`relative text-left rounded-2xl p-3 md:p-4 border transition-all ${
                isSelected
                  ? 'border-copper bg-copper/5 shadow-[0_0_0_1px_var(--copper)]'
                  : 'border-border bg-surface hover:border-copper/40'
              }`}
            >
              {v.badge && (
                <span className="absolute -top-2 left-3 text-[9px] font-bold tracking-[0.18em] uppercase px-2 py-0.5 rounded-full bg-copper text-background">
                  {v.badge}
                </span>
              )}
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-lg bg-background/50 flex items-center justify-center overflow-hidden">
                  <Image
                    src={v.image}
                    alt={v.variantLabel}
                    width={64}
                    height={64}
                    className="object-contain max-w-full max-h-full"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-foreground text-[15px] md:text-base leading-tight">
                    {v.variantLabel}
                  </p>
                  <p className="text-muted-2 text-[11px] tracking-wide mt-0.5">{v.variantSub}</p>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-copper font-serif text-lg leading-none">
                      {v.price}
                    </span>
                    <span className="text-muted line-through text-[12px]">{v.oldPrice}</span>
                    <span className="text-muted-2 text-[10px]">{uahLabel}</span>
                  </div>
                </div>
                <span
                  aria-hidden
                  className={`shrink-0 w-4 h-4 rounded-full border-2 transition-colors ${
                    isSelected ? 'border-copper bg-copper' : 'border-border'
                  }`}
                />
              </div>
            </button>
          )
        })}
      </div>

      {/* Selected price + CTA */}
      {variant === 'full' ? (
        <div className="mt-7 flex flex-col gap-5">
          <div className="flex items-end gap-5">
            <div>
              <div className="text-muted-2 text-[10px] tracking-[0.25em] uppercase mb-1">
                {oldPriceLabel}
              </div>
              <div className="text-muted line-through text-lg">
                {selected.oldPrice} {uahLabel}
              </div>
            </div>
            <div>
              <div className="text-copper text-[10px] tracking-[0.25em] uppercase mb-1">UAH</div>
              <div className="text-copper font-serif text-5xl md:text-6xl leading-none">
                {selected.price}
              </div>
            </div>
            {inStockLabel && (
              <div className="ml-auto flex items-center gap-2 text-[#4ade80] text-[11px] tracking-wider uppercase pb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                {inStockLabel}
              </div>
            )}
          </div>

          <div className="max-w-md">
            <OrderButton
              lang={lang}
              product={{
                id: selected.id,
                slug: selected.slug,
                name: `${selected.productName} — ${selected.variantLabel}`,
                price: selected.price,
              }}
            />
          </div>
        </div>
      ) : (
        <div className="mt-5 flex flex-col items-center gap-4">
          <div className="flex items-end gap-3">
            <span className="text-muted line-through text-lg">{selected.oldPrice}</span>
            <span className="text-copper font-serif text-5xl md:text-6xl leading-none">
              {selected.price}
            </span>
            <span className="text-muted text-base pb-2">{uahLabel}</span>
          </div>
          <div className="w-full max-w-sm">
            <OrderButton
              lang={lang}
              product={{
                id: selected.id,
                slug: selected.slug,
                name: `${selected.productName} — ${selected.variantLabel}`,
                price: selected.price,
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
