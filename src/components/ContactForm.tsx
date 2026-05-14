'use client'

import { useState } from 'react'
import type { Locale } from '@/lib/i18n'
import { fbTrack } from '@/lib/analytics'

interface ContactFormProps {
  lang: Locale
}

const dict: Record<Locale, {
  title: string
  nameLabel: string
  namePlaceholder: string
  emailLabel: string
  emailPlaceholder: string
  messageLabel: string
  messagePlaceholder: string
  submit: string
  submitting: string
  success: string
  successSub: string
  again: string
  errorGeneric: string
  errorName: string
  errorEmail: string
  errorMessage: string
}> = {
  uk: {
    title: 'Надіслати повідомлення',
    nameLabel: 'Ваше імʼя',
    namePlaceholder: 'Іван',
    emailLabel: 'Ваш Email',
    emailPlaceholder: 'you@example.com',
    messageLabel: 'Повідомлення',
    messagePlaceholder: 'Опишіть ваше питання…',
    submit: 'Надіслати',
    submitting: 'Відправляємо…',
    success: 'Дякуємо!',
    successSub: 'Ваше повідомлення отримано. Ми відповімо найближчим часом.',
    again: 'Надіслати ще',
    errorGeneric: 'Щось пішло не так. Спробуйте ще раз або напишіть нам у Telegram.',
    errorName: 'Введіть ваше імʼя (мінімум 2 символи)',
    errorEmail: 'Введіть коректний email',
    errorMessage: 'Повідомлення занадто коротке (мінімум 5 символів)',
  },
  ru: {
    title: 'Отправить сообщение',
    nameLabel: 'Ваше имя',
    namePlaceholder: 'Иван',
    emailLabel: 'Ваш Email',
    emailPlaceholder: 'you@example.com',
    messageLabel: 'Сообщение',
    messagePlaceholder: 'Опишите ваш вопрос…',
    submit: 'Отправить',
    submitting: 'Отправляем…',
    success: 'Спасибо!',
    successSub: 'Ваше сообщение получено. Мы ответим в ближайшее время.',
    again: 'Отправить ещё',
    errorGeneric: 'Что-то пошло не так. Попробуйте ещё раз или напишите нам в Telegram.',
    errorName: 'Введите ваше имя (минимум 2 символа)',
    errorEmail: 'Введите корректный email',
    errorMessage: 'Сообщение слишком короткое (минимум 5 символов)',
  },
  en: {
    title: 'Send a message',
    nameLabel: 'Your name',
    namePlaceholder: 'John',
    emailLabel: 'Your email',
    emailPlaceholder: 'you@example.com',
    messageLabel: 'Message',
    messagePlaceholder: 'Describe your question…',
    submit: 'Send',
    submitting: 'Sending…',
    success: 'Thank you!',
    successSub: 'Your message has been received. We will reply shortly.',
    again: 'Send another',
    errorGeneric: 'Something went wrong. Please try again or reach us on Telegram.',
    errorName: 'Please enter your name (minimum 2 characters)',
    errorEmail: 'Please enter a valid email',
    errorMessage: 'Message is too short (minimum 5 characters)',
  },
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ContactForm({ lang }: ContactFormProps) {
  const t = dict[lang]
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMsg(null)

    if (name.trim().length < 2) {
      setErrorMsg(t.errorName)
      return
    }
    if (!EMAIL_RE.test(email.trim())) {
      setErrorMsg(t.errorEmail)
      return
    }
    if (message.trim().length < 5) {
      setErrorMsg(t.errorMessage)
      return
    }

    setState('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) {
        setErrorMsg(t.errorGeneric)
        setState('error')
        return
      }
      fbTrack('Contact')
      setState('success')
    } catch {
      setErrorMsg(t.errorGeneric)
      setState('error')
    }
  }

  function reset() {
    setName('')
    setEmail('')
    setMessage('')
    setState('idle')
    setErrorMsg(null)
  }

  if (state === 'success') {
    return (
      <div className="bg-surface border border-border rounded-2xl p-8 md:p-10 text-center">
        <div className="w-14 h-14 rounded-full bg-copper/15 border border-copper/40 flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-copper" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif text-foreground text-2xl">{t.success}</h3>
        <p className="text-muted text-sm leading-relaxed mt-2">{t.successSub}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex items-center justify-center gap-2 border border-border hover:border-copper text-foreground hover:text-copper font-medium text-sm tracking-wide px-6 py-3 rounded-full transition-colors"
        >
          {t.again}
        </button>
      </div>
    )
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-7 md:p-8">
      <h2 className="font-serif text-foreground text-2xl mb-6">{t.title}</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-muted-2 text-[11px] tracking-[0.2em] uppercase mb-2">{t.nameLabel}</label>
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
          <label className="block text-muted-2 text-[11px] tracking-[0.2em] uppercase mb-2">{t.emailLabel}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder}
            required
            maxLength={120}
            className="w-full bg-background border border-border focus:border-copper rounded-xl px-4 py-3 text-foreground placeholder:text-muted-2 text-sm transition-colors outline-none"
          />
        </div>

        <div>
          <label className="block text-muted-2 text-[11px] tracking-[0.2em] uppercase mb-2">{t.messageLabel}</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t.messagePlaceholder}
            required
            rows={5}
            maxLength={2000}
            className="w-full bg-background border border-border focus:border-copper rounded-xl px-4 py-3 text-foreground placeholder:text-muted-2 text-sm transition-colors outline-none resize-none"
          />
        </div>

        {errorMsg && <p className="text-[13px] text-red-400" role="alert">{errorMsg}</p>}

        <button
          type="submit"
          disabled={state === 'sending'}
          className="w-full bg-copper hover:bg-copper-hover disabled:opacity-60 text-background font-medium text-sm tracking-wide py-3.5 rounded-full transition-colors"
        >
          {state === 'sending' ? t.submitting : t.submit}
        </button>
      </form>
    </div>
  )
}
