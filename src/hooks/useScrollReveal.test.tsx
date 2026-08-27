import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { useScrollReveal } from './useScrollReveal'

function TestTarget() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>()
  return <div ref={ref}>{isVisible ? 'visible' : 'hidden'}</div>
}

describe('useScrollReveal', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('starts hidden and becomes visible once the element intersects', () => {
    let capturedCallback: IntersectionObserverCallback | undefined
    class ControllableObserver {
      constructor(callback: IntersectionObserverCallback) {
        capturedCallback = callback
      }
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords(): IntersectionObserverEntry[] {
        return []
      }
    }
    vi.stubGlobal('IntersectionObserver', ControllableObserver)
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }))

    render(<TestTarget />)
    expect(screen.getByText('hidden')).toBeInTheDocument()

    act(() => {
      capturedCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
    })

    expect(screen.getByText('visible')).toBeInTheDocument()
  })

  it('does not reveal on a non-intersecting callback', () => {
    let capturedCallback: IntersectionObserverCallback | undefined
    class ControllableObserver {
      constructor(callback: IntersectionObserverCallback) {
        capturedCallback = callback
      }
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords(): IntersectionObserverEntry[] {
        return []
      }
    }
    vi.stubGlobal('IntersectionObserver', ControllableObserver)
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }))

    render(<TestTarget />)

    act(() => {
      capturedCallback?.(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
    })

    expect(screen.getByText('hidden')).toBeInTheDocument()
  })

  it('is immediately visible when prefers-reduced-motion is set, without observing', () => {
    let observed = false
    class NeverObservingObserver {
      observe() {
        observed = true
      }
      unobserve() {}
      disconnect() {}
      takeRecords(): IntersectionObserverEntry[] {
        return []
      }
    }
    vi.stubGlobal('IntersectionObserver', NeverObservingObserver)
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))

    render(<TestTarget />)

    expect(screen.getByText('visible')).toBeInTheDocument()
    expect(observed).toBe(false)
  })
})
