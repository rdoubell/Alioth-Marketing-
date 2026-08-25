import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Hero from './Hero'

function renderHero() {
  return render(
    <MemoryRouter>
      <Hero />
    </MemoryRouter>
  )
}

describe('Hero', () => {
  it('renders the looping muted background video', () => {
    const { container } = renderHero()
    const video = container.querySelector('video')
    expect(video).not.toBeNull()
    expect(video).toHaveAttribute('src', '/video/hero-loop.mp4')
    expect(video?.autoplay).toBe(true)
    expect(video?.loop).toBe(true)
    expect(video?.muted).toBe(true)
  })

  it('renders the headline', () => {
    renderHero()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/steer/i)
  })

  it('renders primary and secondary CTA buttons linking to contact and solutions', () => {
    renderHero()
    expect(screen.getByRole('link', { name: 'Work With Us' })).toHaveAttribute('href', '/contact')
    expect(screen.getByRole('link', { name: 'Our Solutions' })).toHaveAttribute('href', '/solutions')
  })
})
