import { render, screen, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useNavbarScrollState } from './useNavbarScrollState'

function TestTarget({ active }: { active: boolean }) {
  const { atTop, hidden } = useNavbarScrollState(active)
  return (
    <span>
      atTop:{String(atTop)} hidden:{String(hidden)}
    </span>
  )
}

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { value, writable: true, configurable: true })
}

function fireScroll() {
  act(() => {
    window.dispatchEvent(new Event('scroll'))
  })
}

describe('useNavbarScrollState', () => {
  it('starts at the top, not hidden', () => {
    render(<TestTarget active={true} />)
    expect(screen.getByText('atTop:true hidden:false')).toBeInTheDocument()
  })

  it('hides once scrolled down past the threshold', () => {
    render(<TestTarget active={true} />)

    setScrollY(200)
    fireScroll()

    expect(screen.getByText('atTop:false hidden:true')).toBeInTheDocument()
  })

  it('reveals again as soon as the user scrolls up, even slightly', () => {
    render(<TestTarget active={true} />)

    setScrollY(200)
    fireScroll()
    expect(screen.getByText('atTop:false hidden:true')).toBeInTheDocument()

    setScrollY(190)
    fireScroll()

    expect(screen.getByText('atTop:false hidden:false')).toBeInTheDocument()
  })

  it('reports atTop again once scrolled back near the top', () => {
    render(<TestTarget active={true} />)

    setScrollY(200)
    fireScroll()
    setScrollY(10)
    fireScroll()

    expect(screen.getByText('atTop:true hidden:false')).toBeInTheDocument()
  })

  it('stays at the resting state and ignores scroll when inactive', () => {
    render(<TestTarget active={false} />)

    setScrollY(500)
    fireScroll()

    expect(screen.getByText('atTop:true hidden:false')).toBeInTheDocument()
  })
})
