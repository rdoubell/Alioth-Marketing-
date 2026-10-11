import { describe, it, expect } from 'vitest'
import { trackPageView } from './analytics'

describe('analytics', () => {
  it('does nothing — no script, no gtag — when no measurement ID is configured', () => {
    trackPageView('/')
    expect(document.querySelector('script[src*="googletagmanager"]')).toBeNull()
    expect(window.gtag).toBeUndefined()
  })
})
