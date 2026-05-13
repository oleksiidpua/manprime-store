'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Locale } from '@/lib/i18n'

interface ProductSummary {
  id: string
  slug: string
  name: string
  price: number
}

interface OrderButtonProps {
  lang: Locale
  product: ProductSummary
}

const dict: Record<Locale, {
  buttonLabel: string
  modalTitle: string
  modalSub: string
  productLabel: string
  quantityLabel: string
  totalLabel: string
  uah: string
  nameLabel: string
  namePlaceholder: string
  phoneLabel: string
  cityLabel: string
  cityPlaceholder: string
  notePlaceholder: string
  submit: string
  submitting: string
  success: string
  successSub: string
  errorGeneric: string
  errorName: string
  errorPhone: string
  close: string
}> = {
  uk: {
    buttonLabel: 'Замовити',
    modalTitle: 'Оформлення замовлення',
    modalSub: 'Залиште контакти — наш менеджер зателефонує для підтвердження та узгодження доставки.',
    productLabel: 'Товар',
    quantityLabel: 'Кількість',
    totalLabel: 'Разом',
    uah: 'грн',
    nameLabel: 'Імʼя',
    namePlaceholder: 'Іван',
    phoneLabel: 'Телефон',
    cityLabel: 'Місто',
    cityPlaceholder: 'Київ',
    notePlaceholder: 'Коментар до замовлення (необовʼязково)',
    submit: 'Підтвердити замовлення',
    submitting: 'Відправляємо…',
    success: 'Замовлення прийнято!',
    successSub: 'Ми зателефонуємо вам протягом 15 хвилин для підтвердження.',
    errorGeneric: 'Щось пішло не так. Спробуйте ще раз або напишіть нам у Telegram.',
    errorName: 'Введіть ваше імʼя',
    errorPhone: 'Введіть коректний номер телефону',
    close: 'Закрити',
  },
  ru: {
    buttonLabel: 'Заказать',
    modalTitle: 'Оформление заказа',
    modalSub: 'Оставьте контакты — менеджер перезвонит для подтверждения и согласования доставки.',
    productLabel: 'Товар',
    quantityLabel: 'Количество',
    totalLabel: 'Итого',
    uah: 'грн',
    nameLabel: 'Имя',
    namePlaceholder: 'Иван',
    phoneLabel: 'Телефон',
    cityLabel: 'Город',
    cityPlaceholder: 'Киев',
    notePlaceholder: 'Комментарий к заказу (необязательно)',
    submit: 'Подтвердить заказ',
    submitting: 'Отправляем…',
    success: 'Заказ принят!',
    successSub: 'Мы перезвоним вам в течение 15 минут для подтверждения.',
    errorGeneric: 'Что-то пошло не так. Попробуйте ещё раз или напишите нам в Telegram.',
    errorName: 'Введите ваше имя',
    errorPhone: 'Введите корректный номер телефона',
    close: 'Закрыть',
  },
  en: {
    buttonLabel: 'Order',
    modalTitle: 'Place an order',
    modalSub: 'Leave your contacts — our manager will call to confirm and arrange delivery.',
    productLabel: 'Product',
    quantityLabel: 'Quantity',
    totalLabel: 'Total',
    uah: 'UAH',
    nameLabel: 'Name',
    namePlaceholder: 'John',
    phoneLabel: 'Phone',
    cityLabel: 'City',
    cityPlaceholder: 'Kyiv',
    notePlaceholder: 'Order comment (optional)',
    submit: 'Confirm order',
    submitting: 'Sending…',
    success: 'Order received!',
    successSub: 'We will call you within 15 minutes to confirm.',
    errorGeneric: 'Something went wrong. Please try again or reach us on Telegram.',
    errorName: 'Please enter your name',
    errorPhone: 'Please enter a valid phone number',
    close: 'Close',
  },
}

export default function OrderButton({ lang, product }: OrderButtonProps) {
  const t = dict[lang]
  const [open, setOpen] = useState(false)
  const [openedAt, setOpenedAt] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [note, setNote] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const total = product.price * quantity

  const openModal = useCallback(() => {
    setOpen(true)
    setOpenedAt(Date.now())
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    setTimeout(() => {
      if (state === 'success') {
        setName('')
        setPhone('')
        setCity('')
        setNote('')
        setQuantity(1)
      }
      setState('idle')
      setErrorMsg(null)
    }, 250)
  }, [state])

  // Click-through guard: ignore backdrop clicks for 300ms after open
  // (mobile touchend → click can land on backdrop right after it mounts)
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target !== e.currentTarget) return
      if (Date.now() - openedAt < 300) return
      close()
    },
    [openedAt, close]
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, close])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMsg(null)

    if (name.trim().length < 2) {
      setErrorMsg(t.errorName)
      return
    }
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 9) {
      setErrorMsg(t.errorPhone)
      return
    }

    setState('sending')
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productSlug: product.slug,
          productName: product.name,
          quantity,
          unitPrice: product.price,
          name,
          phone,
          city,
          note,
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) {
        setErrorMsg(t.errorGeneric)
        setState('error')
        return
      }
      setState('success')
    } catch {
      setErrorMsg(t.errorGeneric)
      setState('error')
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          openModal()
        }}
        className="flex-1 inline-flex items-center justify-center gap-2 bg-copper hover:bg-copper-hover text-background font-semibold py-3.5 px-6 uppercase tracking-widest text-sm transition-colors rounded-full shadow-[0_8px_30px_rgba(212,165,98,0.3)]"
      >
        {t.buttonLabel}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm p-0 md:p-5"
            onClick={handleBackdropClick}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full md:max-w-md bg-surface border border-border rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={close}
                aria-label={t.close}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-foreground hover:bg-background/40 transition-colors z-10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="px-6 md:px-8 pt-8 pb-7">
                {state === 'success' ? (
                  <SuccessState title={t.success} sub={t.successSub} onClose={close} closeLabel={t.close} />
                ) : (
                  <>
                    <h3 className="font-serif text-2xl md:text-3xl text-foreground">{t.modalTitle}</h3>
                    <p className="text-muted text-sm leading-relaxed mt-2">{t.modalSub}</p>

                    <div className="mt-5 p-4 bg-background/40 border border-border rounded-xl">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-muted-2 text-[10px] tracking-[0.2em] uppercase mb-1">{t.productLabel}</p>
                          <p className="font-serif text-foreground text-lg leading-tight">{product.name}</p>
                          <p className="text-muted text-xs mt-1">{product.price} {t.uah} × {quantity}</p>
                        </div>
                        <QuantityStepper value={quantity} onChange={setQuantity} label={t.quantityLabel} />
                      </div>
                      <div className="flex items-baseline justify-between mt-4 pt-3 border-t border-border/60">
                        <span className="text-muted-2 text-[11px] tracking-[0.2em] uppercase">{t.totalLabel}</span>
                        <span className="font-serif text-copper text-2xl">{total} <span className="text-sm text-muted">{t.uah}</span></span>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
                      <div>
                        <label className="block text-muted-2 text-[11px] tracking-[0.2em] uppercase mb-2">
                          {t.nameLabel}
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t.namePlaceholder}
                          required
                          maxLength={80}
                          className="w-full bg-background border border-border focus:border-copper rounded-xl px-4 py-3 text-foreground placeholder:text-muted-2 text-sm transition-colors outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-muted-2 text-[11px] tracking-[0.2em] uppercase mb-2">
                          {t.phoneLabel}
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+38 098 123 45 67"
                          required
                          className="w-full bg-background border border-border focus:border-copper rounded-xl px-4 py-3 text-foreground placeholder:text-muted-2 text-sm transition-colors outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-muted-2 text-[11px] tracking-[0.2em] uppercase mb-2">
                          {t.cityLabel}
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder={t.cityPlaceholder}
                          maxLength={80}
                          className="w-full bg-background border border-border focus:border-copper rounded-xl px-4 py-3 text-foreground placeholder:text-muted-2 text-sm transition-colors outline-none"
                        />
                      </div>

                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder={t.notePlaceholder}
                        rows={2}
                        maxLength={400}
                        className="w-full bg-background border border-border focus:border-copper rounded-xl px-4 py-3 text-foreground placeholder:text-muted-2 text-sm transition-colors outline-none resize-none"
                      />

                      {errorMsg && <p className="text-[13px] text-red-400" role="alert">{errorMsg}</p>}

                      <button
                        type="submit"
                        disabled={state === 'sending'}
                        className="mt-2 inline-flex items-center justify-center gap-2 bg-copper hover:bg-copper-hover disabled:opacity-60 text-background font-medium text-sm tracking-wide px-6 py-4 rounded-full transition-colors"
                      >
                        {state === 'sending' ? t.submitting : t.submit}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function QuantityStepper({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className="flex flex-col items-end gap-1.5">
      <span className="text-muted-2 text-[10px] tracking-[0.2em] uppercase">{label}</span>
      <div className="flex items-center border border-border rounded-full overflow-hidden">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, value - 1))}
          disabled={value <= 1}
          className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-background/40 disabled:opacity-30 transition-colors"
          aria-label="−"
        >
          −
        </button>
        <span className="w-8 text-center font-medium text-foreground">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(99, value + 1))}
          className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-background/40 transition-colors"
          aria-label="+"
        >
          +
        </button>
      </div>
    </div>
  )
}

function SuccessState({ title, sub, onClose, closeLabel }: { title: string; sub: string; onClose: () => void; closeLabel: string }) {
  return (
    <div className="text-center py-4">
      <div className="w-14 h-14 rounded-full bg-copper/15 border border-copper/40 flex items-center justify-center mx-auto mb-5">
        <svg className="w-7 h-7 text-copper" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="font-serif text-2xl text-foreground">{title}</h3>
      <p className="text-muted text-sm leading-relaxed mt-2">{sub}</p>
      <button
        type="button"
        onClick={onClose}
        className="mt-6 inline-flex items-center justify-center gap-2 border border-border hover:border-copper text-foreground hover:text-copper font-medium text-sm tracking-wide px-6 py-3 rounded-full transition-colors"
      >
        {closeLabel}
      </button>
    </div>
  )
}
