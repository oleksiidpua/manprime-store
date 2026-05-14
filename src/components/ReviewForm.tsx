'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { Locale } from '@/lib/i18n'

interface ReviewFormProps {
  lang: Locale
}

const dict: Record<Locale, {
  trigger: string
  title: string
  sub: string
  nameLabel: string
  namePlaceholder: string
  cityLabel: string
  cityPlaceholder: string
  ratingLabel: string
  textLabel: string
  textPlaceholder: string
  submit: string
  submitting: string
  success: string
  successSub: string
  errorGeneric: string
  errorName: string
  errorRating: string
  errorText: string
  close: string
}> = {
  uk: {
    trigger: 'Залишити відгук',
    title: 'Поділіться враженням',
    sub: 'Ваш відгук пройде швидку модерацію та зʼявиться на сайті протягом кількох годин.',
    nameLabel: 'Ваше імʼя',
    namePlaceholder: 'Андрій',
    cityLabel: 'Місто (необовʼязково)',
    cityPlaceholder: 'Київ',
    ratingLabel: 'Ваша оцінка',
    textLabel: 'Відгук',
    textPlaceholder: 'Розкажіть про ваш досвід — що сподобалось, який ефект, як швидко прийшла посилка…',
    submit: 'Надіслати відгук',
    submitting: 'Відправляємо…',
    success: 'Дякуємо за відгук!',
    successSub: 'Ваш відгук успішно надіслано. Ми покажемо його на сайті після короткої перевірки.',
    errorGeneric: 'Щось пішло не так. Спробуйте ще раз.',
    errorName: 'Введіть ваше імʼя (мінімум 2 символи)',
    errorRating: 'Будь ласка, оцініть від 1 до 5 зірок',
    errorText: 'Відгук занадто короткий (мінімум 20 символів)',
    close: 'Закрити',
  },
  ru: {
    trigger: 'Оставить отзыв',
    title: 'Поделитесь впечатлением',
    sub: 'Ваш отзыв пройдёт быструю модерацию и появится на сайте в течение нескольких часов.',
    nameLabel: 'Ваше имя',
    namePlaceholder: 'Андрей',
    cityLabel: 'Город (необязательно)',
    cityPlaceholder: 'Киев',
    ratingLabel: 'Ваша оценка',
    textLabel: 'Отзыв',
    textPlaceholder: 'Расскажите о вашем опыте — что понравилось, какой эффект, как быстро пришла посылка…',
    submit: 'Отправить отзыв',
    submitting: 'Отправляем…',
    success: 'Спасибо за отзыв!',
    successSub: 'Ваш отзыв успешно отправлен. Мы покажем его на сайте после короткой проверки.',
    errorGeneric: 'Что-то пошло не так. Попробуйте ещё раз.',
    errorName: 'Введите ваше имя (минимум 2 символа)',
    errorRating: 'Пожалуйста, оцените от 1 до 5 звёзд',
    errorText: 'Отзыв слишком короткий (минимум 20 символов)',
    close: 'Закрыть',
  },
  en: {
    trigger: 'Leave a review',
    title: 'Share your experience',
    sub: 'Your review will go through a quick moderation and appear on the site within a few hours.',
    nameLabel: 'Your name',
    namePlaceholder: 'John',
    cityLabel: 'City (optional)',
    cityPlaceholder: 'Kyiv',
    ratingLabel: 'Your rating',
    textLabel: 'Review',
    textPlaceholder: 'Tell us about your experience — what you liked, what effect you noticed, how fast the delivery was…',
    submit: 'Submit review',
    submitting: 'Sending…',
    success: 'Thank you for your review!',
    successSub: 'Your review has been submitted. We will publish it after a short check.',
    errorGeneric: 'Something went wrong. Please try again.',
    errorName: 'Please enter your name (minimum 2 characters)',
    errorRating: 'Please rate from 1 to 5 stars',
    errorText: 'Review is too short (minimum 20 characters)',
    close: 'Close',
  },
}

export default function ReviewForm({ lang }: ReviewFormProps) {
  const t = dict[lang]
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [openedAt, setOpenedAt] = useState(0)

  const [authorName, setAuthorName] = useState('')
  const [city, setCity] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [text, setText] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => setMounted(true), [])

  const openModal = useCallback(() => {
    setOpen(true)
    setOpenedAt(Date.now())
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    setTimeout(() => {
      if (state === 'success') {
        setAuthorName('')
        setCity('')
        setRating(0)
        setText('')
      }
      setState('idle')
      setErrorMsg(null)
    }, 250)
  }, [state])

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

    if (authorName.trim().length < 2) {
      setErrorMsg(t.errorName)
      return
    }
    if (rating < 1 || rating > 5) {
      setErrorMsg(t.errorRating)
      return
    }
    if (text.trim().length < 20) {
      setErrorMsg(t.errorText)
      return
    }

    setState('sending')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorName, rating, text, city }),
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

  const stars = [1, 2, 3, 4, 5]

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="inline-flex items-center gap-2 border border-border hover:border-copper text-foreground hover:text-copper font-medium text-sm tracking-wide px-6 py-3 rounded-full transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
        {t.trigger}
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-100 flex items-end md:items-center justify-center bg-black/85 backdrop-blur-md p-0 md:p-5"
                onClick={handleBackdropClick}
              >
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 30, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full md:max-w-lg bg-surface border border-border rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] overflow-y-auto"
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
                      <div className="text-center py-4">
                        <div className="w-14 h-14 rounded-full bg-copper/15 border border-copper/40 flex items-center justify-center mx-auto mb-5">
                          <svg className="w-7 h-7 text-copper" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="font-serif text-2xl text-foreground">{t.success}</h3>
                        <p className="text-muted text-sm leading-relaxed mt-2">{t.successSub}</p>
                        <button
                          type="button"
                          onClick={close}
                          className="mt-6 inline-flex items-center justify-center gap-2 border border-border hover:border-copper text-foreground hover:text-copper font-medium text-sm tracking-wide px-6 py-3 rounded-full transition-colors"
                        >
                          {t.close}
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-serif text-2xl md:text-3xl text-foreground">{t.title}</h3>
                        <p className="text-muted text-sm leading-relaxed mt-2">{t.sub}</p>

                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                          <div>
                            <label className="block text-muted-2 text-[11px] tracking-[0.2em] uppercase mb-2">
                              {t.ratingLabel}
                            </label>
                            <div className="flex gap-1.5">
                              {stars.map((n) => {
                                const filled = hoverRating ? n <= hoverRating : n <= rating
                                return (
                                  <button
                                    key={n}
                                    type="button"
                                    onClick={() => setRating(n)}
                                    onMouseEnter={() => setHoverRating(n)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    aria-label={`${n}/5`}
                                    className="p-1 transition-transform hover:scale-110"
                                  >
                                    <svg
                                      className={`w-8 h-8 transition-colors ${
                                        filled ? 'text-copper' : 'text-border'
                                      }`}
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                  </button>
                                )
                              })}
                            </div>
                          </div>

                          <div>
                            <label className="block text-muted-2 text-[11px] tracking-[0.2em] uppercase mb-2">
                              {t.nameLabel}
                            </label>
                            <input
                              type="text"
                              value={authorName}
                              onChange={(e) => setAuthorName(e.target.value)}
                              placeholder={t.namePlaceholder}
                              required
                              maxLength={80}
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

                          <div>
                            <label className="block text-muted-2 text-[11px] tracking-[0.2em] uppercase mb-2">
                              {t.textLabel}
                            </label>
                            <textarea
                              value={text}
                              onChange={(e) => setText(e.target.value)}
                              placeholder={t.textPlaceholder}
                              required
                              rows={5}
                              maxLength={2000}
                              className="w-full bg-background border border-border focus:border-copper rounded-xl px-4 py-3 text-foreground placeholder:text-muted-2 text-sm transition-colors outline-none resize-none"
                            />
                            <div className="text-muted-2 text-[10px] tracking-wide mt-1.5 text-right">
                              {text.length} / 2000
                            </div>
                          </div>

                          {errorMsg && (
                            <p className="text-[13px] text-red-400" role="alert">
                              {errorMsg}
                            </p>
                          )}

                          <button
                            type="submit"
                            disabled={state === 'sending'}
                            className="w-full bg-copper hover:bg-copper-hover disabled:opacity-60 text-background font-medium text-sm tracking-wide py-3.5 rounded-full transition-colors"
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
          </AnimatePresence>,
          document.body
        )}
    </>
  )
}
