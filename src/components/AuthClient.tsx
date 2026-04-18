'use client'

import { useState } from 'react'
import type ukDict from '@/dictionaries/uk.json'
import type { Locale } from '@/lib/i18n'

type Dict = typeof ukDict

export default function AuthClient({ dict, lang }: { dict: Dict; lang: Locale }) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const a = dict.auth

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const form = new FormData(e.currentTarget)
    const data = Object.fromEntries(form)

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error')
      window.location.href = `/${lang}/account`
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-3xl shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="text-accent font-heading font-bold text-3xl">Man</span>
            <span className="font-heading font-bold text-3xl">Prime</span>
          </div>
          <h1 className="font-heading text-2xl font-bold">
            {mode === 'login' ? a.login_title : a.register_title}
          </h1>
        </div>

        <div className="flex bg-cream rounded-full p-1 mb-8">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${mode === 'login' ? 'bg-accent text-white' : 'text-muted hover:text-foreground'}`}
          >
            {a.login_btn}
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${mode === 'register' ? 'bg-accent text-white' : 'text-muted hover:text-foreground'}`}
          >
            {a.register_btn}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">{a.name}</label>
                <input name="name" type="text" required className="w-full border border-border rounded-xl px-4 py-3 bg-cream focus:outline-none focus:border-accent transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{a.surname}</label>
                <input name="surname" type="text" required className="w-full border border-border rounded-xl px-4 py-3 bg-cream focus:outline-none focus:border-accent transition-colors" />
              </div>
            </div>
          )}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium mb-1">{a.phone}</label>
              <input name="phone" type="tel" className="w-full border border-border rounded-xl px-4 py-3 bg-cream focus:outline-none focus:border-accent transition-colors" placeholder="+380" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">{a.email}</label>
            <input name="email" type="email" required className="w-full border border-border rounded-xl px-4 py-3 bg-cream focus:outline-none focus:border-accent transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{a.password}</label>
            <input name="password" type="password" required minLength={6} className="w-full border border-border rounded-xl px-4 py-3 bg-cream focus:outline-none focus:border-accent transition-colors" />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-semibold py-3 rounded-full transition-colors mt-2"
          >
            {loading ? '...' : mode === 'login' ? a.login_btn : a.register_btn}
          </button>
        </form>
      </div>
    </div>
  )
}
