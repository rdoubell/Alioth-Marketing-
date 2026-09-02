import { render } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ScrollToTop from './ScrollToTop'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ScrollToTop />
      <Routes>
        <Route path="*" element={<div id="target">Target</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ScrollToTop', () => {
  beforeEach(() => {
    vi.mocked(window.scrollTo).mockClear()
    vi.mocked(Element.prototype.scrollIntoView).mockClear()
  })

  it('scrolls to the top when navigating without a hash', () => {
    renderAt('/about')
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled()
  })

  it('scrolls the matching element into view when a hash is present', () => {
    renderAt('/solutions#target')
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled()
    expect(window.scrollTo).not.toHaveBeenCalled()
  })

  it('does nothing when the hash matches no element', () => {
    renderAt('/solutions#missing')
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled()
    expect(window.scrollTo).not.toHaveBeenCalled()
  })
})
