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
    expect(video).toHaveAttribute('poster', '/video/hero-poster.jpg')
    expect(video?.autoplay).toBe(true)
    expect(video?.loop).toBe(true)
    expect(video?.muted).toBe(true)
  })

  it('renders the headline', () => {
    renderHero()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'From where you are to where you should be.'
    )
  })

  it('renders primary and secondary CTA buttons linking to contact and solutions', () => {
    renderHero()
    expect(screen.getByRole('link', { name: 'Work With Us' })).toHaveAttribute('href', '/contact')
    expect(screen.getByRole('link', { name: 'Our Solutions' })).toHaveAttribute('href', '/solutions')
  })

  it('renders a "What We Offer" teaser band beneath the video, hinting at the next section', () => {
    renderHero()
    expect(screen.getByText('What We Offer')).toBeInTheDocument()
  })

  it('renders the decorative watermark mark as a hidden, non-focusable image', () => {
    const { container } = renderHero()
    const watermark = container.querySelector('img[alt=""]')
    expect(watermark).not.toBeNull()
    expect(watermark).toHaveAttribute('aria-hidden', 'true')
  })

  it('exposes a full, static subhead sentence to screen readers behind the animated one', () => {
    renderHero()
    expect(screen.getByText('Guiding your business, growing your revenue.')).toBeInTheDocument()
  })
})
