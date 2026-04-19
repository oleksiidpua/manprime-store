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

  const inputClass = 'w-full bg-[#0A0A0A] border border-[#2A2A2A] focus:border-[#C9A84C]/50 text-white px-4 py-3 text-sm outline-none transition-colors'
  const labelClass = 'block text-xs font-semibold text-[#555] uppercase tracking-wider mb-2'

  return (
    <div className="w-full max-w-md">
      <div className="bg-[#111111] border border-[#1E1E1E] p-8">
        <div className="text-center mb-8">
          <span className="text-[#C9A84C] font-heading font-black text-2xl tracking-[0.15em]">MANPRIME</span>
          <h1 className="font-heading font-bold text-white text-lg uppercase tracking-widest mt-2">
            {mode === 'login' ? a.login_title : a.register_title}
          </h1>
        </div>

        <div className="flex border border-[#2A2A2A] mb-8">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
              mode === 'login' ? 'bg-[#A52A2A] text-white' : 'text-[#555] hover:text-[#9CA3AF]'
            }`}
          >
            {a.login_btn}
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
              mode === 'register' ? 'bg-[#A52A2A] text-white' : 'text-[#555] hover:text-[#9CA3AF]'
            }`}
          >
            {a.register_btn}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelClass}>{a.name}</label><input name="name" type="text" required className={inputClass} /></div>
              <div><label className={labelClass}>{a.surname}</label><input name="surname" type="text" required className={inputClass} /></div>
            </div>
          )}
          {mode === 'register' && (
            <div><label className={labelClass}>{a.phone}</label><input name="phone" type="tel" className={inputClass} placeholder="+380" /></div>
          )}
          <div><label className={labelClass}>{a.email}</label><input name="email" type="email" required className={inputClass} /></div>
          <div><label className={labelClass}>{a.password}</label><input name="password" type="password" required minLength={6} className={inputClass} /></div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#A52A2A] hover:bg-[#C03333] disabled:opacity-40 text-white font-heading font-bold py-4 uppercase tracking-widest text-sm transition-colors mt-2"
          >
            {loading ? '...' : mode === 'login' ? a.login_btn : a.register_btn}
          </button>
        </form>
      </div>
    </div>
  )
}
