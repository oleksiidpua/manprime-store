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

  const inputClass = 'w-full bg-[#0d1120] border border-[#2a3347] focus:border-[#c9a84c]/50 text-[#e8eaf0] px-4 py-3 text-sm outline-none transition-colors rounded-sm'
  const labelClass = 'block text-xs font-semibold text-[#8b9ab0] uppercase tracking-wider mb-2'

  return (
    <div className="w-full max-w-md">
      <div className="bg-[#1c2333] border border-[#2a3347] p-8 rounded-sm">
        <div className="text-center mb-8">
          <span className="text-[#c9a84c] font-heading text-3xl tracking-[0.15em]">MANPRIME</span>
          <h1 className="font-semibold text-[#e8eaf0] text-lg uppercase tracking-widest mt-2">
            {mode === 'login' ? a.login_title : a.register_title}
          </h1>
        </div>

        <div className="flex border border-[#2a3347] mb-8 rounded-sm overflow-hidden">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
              mode === 'login' ? 'bg-[#b5622a] text-[#e8eaf0]' : 'text-[#8b9ab0] hover:text-[#e8eaf0]'
            }`}
          >
            {a.login_btn}
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
              mode === 'register' ? 'bg-[#b5622a] text-[#e8eaf0]' : 'text-[#8b9ab0] hover:text-[#e8eaf0]'
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
            className="w-full bg-[#b5622a] hover:bg-[#cc7033] disabled:opacity-40 text-[#e8eaf0] font-semibold py-4 uppercase tracking-widest text-sm transition-colors mt-2 rounded-sm"
          >
            {loading ? '...' : mode === 'login' ? a.login_btn : a.register_btn}
          </button>
        </form>
      </div>
    </div>
  )
}
