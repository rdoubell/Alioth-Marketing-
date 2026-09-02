import '@testing-library/jest-dom'
import { vi } from 'vitest'

// jsdom has no IntersectionObserver. Default mock fires "intersecting" as
// soon as an element is observed, so components using useScrollReveal render
// their revealed state in tests without every test needing its own mock.
// Tests exercising the hook's actual triggering behavior override this
// locally with a controllable mock.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds: ReadonlyArray<number> = []
  private callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }

  observe(target: Element) {
    this.callback([{ isIntersecting: true, target } as IntersectionObserverEntry], this)
  }

  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)

// jsdom also has no matchMedia. Default mock reports no reduced-motion
// preference, so components take the normal (observer-driven) reveal path
// in tests. Tests exercising the reduced-motion path override this locally.
vi.stubGlobal(
  'matchMedia',
  vi.fn().mockReturnValue({ matches: false, addEventListener: () => {}, removeEventListener: () => {} })
)

// jsdom doesn't implement window.scrollTo (logs "Not implemented" and no-ops
// otherwise) — stub it so ScrollToTop and similar navigation-driven scroll
// resets don't spam test output.
vi.stubGlobal('scrollTo', vi.fn())

// jsdom also doesn't implement Element.scrollIntoView, used by ScrollToTop
// for hash-anchor navigation.
Element.prototype.scrollIntoView = vi.fn()
