'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Locale } from '@/lib/i18n'

interface FloatingCallButtonProps {
  lang: Locale
}

const dict: Record<Locale, {
  buttonLabel: string
  modalTitle: string
  modalSub: string
  nameLabel: string
  namePlaceholder: string
  phoneLabel: string
  preferredLabel: string
  notePlaceholder: string
  submit: string
  submitting: string
  success: string
  successSub: string
  errorGeneric: string
  errorName: string
  errorPhone: string
  preferredOptions: string[]
  close: string
}> = {
  uk: {
    buttonLabel: 'Передзвонити',
    modalTitle: 'Залиште заявку',
    modalSub: 'Ми зателефонуємо вам протягом 15 хвилин у робочий час.',
    nameLabel: 'Імʼя',
    namePlaceholder: 'Іван',
    phoneLabel: 'Телефон',
    preferredLabel: 'Коли зручно',
    notePlaceholder: 'Коментар (необовʼязково)',
    submit: 'Замовити дзвінок',
    submitting: 'Відправляємо…',
    success: 'Дякуємо!',
    successSub: 'Ми зателефонуємо вам найближчим часом.',
    errorGeneric: 'Щось пішло не так. Спробуйте ще раз або напишіть нам у Telegram.',
    errorName: 'Введіть ваше імʼя',
    errorPhone: 'Введіть коректний номер телефону',
    preferredOptions: ['Якнайшвидше', 'Найближчим часом', 'Сьогодні ввечері', 'Завтра вранці'],
    close: 'Закрити',
  },
  ru: {
    buttonLabel: 'Перезвонить',
    modalTitle: 'Оставьте заявку',
    modalSub: 'Мы перезвоним вам в течение 15 минут в рабочее время.',
    nameLabel: 'Имя',
    namePlaceholder: 'Иван',
    phoneLabel: 'Телефон',
    preferredLabel: 'Когда удобно',
    notePlaceholder: 'Комментарий (необязательно)',
    submit: 'Заказать звонок',
    submitting: 'Отправляем…',
    success: 'Спасибо!',
    successSub: 'Мы перезвоним вам в ближайшее время.',
    errorGeneric: 'Что-то пошло не так. Попробуйте ещё раз или напишите нам в Telegram.',
    errorName: 'Введите ваше имя',
    errorPhone: 'Введите корректный номер телефона',
    preferredOptions: ['Как можно скорее', 'В ближайшее время', 'Сегодня вечером', 'Завтра утром'],
    close: 'Закрыть',
  },
  en: {
    buttonLabel: 'Call me',
    modalTitle: 'Request a callback',
    modalSub: 'We will call you within 15 minutes during business hours.',
    nameLabel: 'Name',
    namePlaceholder: 'John',
    phoneLabel: 'Phone',
    preferredLabel: 'When suits you',
    notePlaceholder: 'Comment (optional)',
    submit: 'Request a call',
    submitting: 'Sending…',
    success: 'Thank you!',
    successSub: 'We will call you back shortly.',
    errorGeneric: 'Something went wrong. Please try again or reach us on Telegram.',
    errorName: 'Please enter your name',
    errorPhone: 'Please enter a valid phone number',
    preferredOptions: ['As soon as possible', 'Anytime soon', 'This evening', 'Tomorrow morning'],
    close: 'Close',
  },
}

export default function FloatingCallButton({ lang }: FloatingCallButtonProps) {
  const t = dict[lang]
  const [open, setOpen] = useState(false)
  const [openedAt, setOpenedAt] = useState(0)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [preferred, setPreferred] = useState(t.preferredOptions[0])
  const [note, setNote] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

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
        setNote('')
        setPreferred(t.preferredOptions[0])
      }
      setState('idle')
      setErrorMsg(null)
    }, 250)
  }, [state, t.preferredOptions])

  // Click-through guard: ignore backdrop clicks for 300ms after open
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target !== e.currentTarget) return
      if (Date.now() - openedAt < 300) return
      close()
    },
    [openedAt, close]
  )

  // ESC to close + lock body scroll while modal open
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
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
      const res = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, preferred, note }),
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
      {/* Floating button */}
      <motion.button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          openModal()
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="fixed bottom-5 right-5 md:bottom-7 md:right-7 z-40 flex items-center gap-2 bg-copper hover:bg-copper-hover text-background font-medium text-sm tracking-wide px-5 py-3.5 rounded-full shadow-[0_10px_40px_rgba(212,165,98,0.5)]"
        aria-label={t.buttonLabel}
      >
        <PhoneIcon className="w-4 h-4" />
        <span className="hidden sm:inline">{t.buttonLabel}</span>
      </motion.button>

      {/* Modal */}
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
              className="relative w-full md:max-w-md bg-surface border border-border rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Close */}
              <button
                type="button"
                onClick={close}
                aria-label={t.close}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-foreground hover:bg-background/40 transition-colors"
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

                    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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
                          {t.preferredLabel}
                        </label>
                        <select
                          value={preferred}
                          onChange={(e) => setPreferred(e.target.value)}
                          className="w-full bg-background border border-border focus:border-copper rounded-xl px-4 py-3 text-foreground text-sm transition-colors outline-none"
                        >
                          {t.preferredOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>

                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder={t.notePlaceholder}
                        rows={2}
                        maxLength={400}
                        className="w-full bg-background border border-border focus:border-copper rounded-xl px-4 py-3 text-foreground placeholder:text-muted-2 text-sm transition-colors outline-none resize-none"
                      />

                      {errorMsg && (
                        <p className="text-[13px] text-red-400" role="alert">{errorMsg}</p>
                      )}

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

function PhoneIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.5a1 1 0 011 .8L9 7.5a1 1 0 01-.3 1L7 10c1.2 2.4 3.6 4.8 6 6l1.5-1.7a1 1 0 011-.3l3.7 1.5a1 1 0 01.8 1V19a2 2 0 01-2 2h-1C9.8 21 3 14.2 3 6V5z" />
    </svg>
  )
}
