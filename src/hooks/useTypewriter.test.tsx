import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTypewriter } from './useTypewriter'

function TestTarget({ words }: { words: string[] }) {
  const text = useTypewriter({ words, typingSpeedMs: 10, deletingSpeedMs: 10, pauseMs: 50 })
  return <span>{text || '(empty)'}</span>
}

/** Advances fake timers one tick at a time so each character's effect
 * has a chance to run and schedule the next timeout before the next
 * advance — a single large jump doesn't let React's effects interleave. */
function advanceInSteps(totalMs: number, stepMs: number) {
  for (let elapsed = 0; elapsed < totalMs; elapsed += stepMs) {
    act(() => {
      vi.advanceTimersByTime(stepMs)
    })
  }
}

describe('useTypewriter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    act(() => {
      vi.runOnlyPendingTimers()
    })
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('types out the first word one character at a time', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }))
    render(<TestTarget words={['revenue', 'presence']} />)

    expect(screen.getByText('(empty)')).toBeInTheDocument()

    advanceInSteps(10, 10)
    expect(screen.getByText('r')).toBeInTheDocument()

    advanceInSteps(60, 10)
    expect(screen.getByText('revenue')).toBeInTheDocument()
  })

  it('deletes the word and types the next one after the pause', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }))
    render(<TestTarget words={['revenue', 'presence']} />)

    advanceInSteps(10 * 'revenue'.length, 10)
    expect(screen.getByText('revenue')).toBeInTheDocument()

    advanceInSteps(50 + 10 * 'revenue'.length, 10)
    expect(screen.getByText('(empty)')).toBeInTheDocument()

    advanceInSteps(10 * 'presence'.length, 10)
    expect(screen.getByText('presence')).toBeInTheDocument()
  })

  it('shows the first word immediately, without animating, under prefers-reduced-motion', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
    render(<TestTarget words={['revenue', 'presence']} />)

    expect(screen.getByText('revenue')).toBeInTheDocument()
  })
})
