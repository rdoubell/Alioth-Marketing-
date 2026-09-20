import { render, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import SplashScreen from './SplashScreen'

describe('SplashScreen', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    act(() => {
      vi.runOnlyPendingTimers()
    })
    vi.useRealTimers()
    vi.unstubAllGlobals()
    sessionStorage.clear()
  })

  it('shows the icon overlay on first mount', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }))
    const { container } = render(<SplashScreen />)
    expect(container.querySelector('img')).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('opacity-100')
  })

  it('fades out and marks the session as seen after the hold', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }))
    const { container } = render(<SplashScreen />)

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(container.firstChild).toHaveClass('opacity-0')

    act(() => {
      vi.advanceTimersByTime(400)
    })
    expect(container).toBeEmptyDOMElement()
    expect(sessionStorage.getItem('alioth-splash-seen')).toBe('1')
  })

  it('does not render again once the session has already seen it', () => {
    sessionStorage.setItem('alioth-splash-seen', '1')
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }))
    const { container } = render(<SplashScreen />)
    expect(container).toBeEmptyDOMElement()
  })

  it('skips entirely and marks itself seen when prefers-reduced-motion is set', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
    const { container } = render(<SplashScreen />)
    expect(container).toBeEmptyDOMElement()
    expect(sessionStorage.getItem('alioth-splash-seen')).toBe('1')
  })
})
