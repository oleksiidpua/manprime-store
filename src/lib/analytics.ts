// Client-side analytics helpers. No-op on the server or before the pixel loads.

type FbqMethod = 'init' | 'track' | 'trackCustom' | 'consent'
type FbqEventParams = Record<string, unknown>
type FbqFn = (method: FbqMethod, event: string, params?: FbqEventParams) => void

declare global {
  interface Window {
    fbq?: FbqFn
  }
}

/**
 * Fire a standard Meta Pixel event (Lead, Contact, Purchase, ViewContent, etc).
 * Safe to call from anywhere: silently no-ops when the pixel is not loaded.
 */
export function fbTrack(event: string, params?: FbqEventParams): void {
  if (typeof window === 'undefined') return
  const fbq = window.fbq
  if (typeof fbq !== 'function') return
  if (params) {
    fbq('track', event, params)
  } else {
    fbq('track', event)
  }
}
