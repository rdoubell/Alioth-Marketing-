import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Home from './Home'
import About from './About'
import Solutions from './Solutions'
import Contact from './Contact'
import NotFound from './NotFound'

describe('page shells', () => {
  it('Home renders the hero headline', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/where you should be/i)
  })

  it('About renders the "Why we\'re called Alioth" headline', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/why we.re called alioth/i)
  })

  it('About links to Contact with a Work With Us CTA', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: 'Work With Us' })).toHaveAttribute('href', '/contact')
  })

  it('Solutions renders an h1 "Solutions"', () => {
    render(
      <MemoryRouter>
        <Solutions />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Solutions' })).toBeInTheDocument()
  })

  it('Contact renders an h1 "Contact"', () => {
    render(<Contact />)
    expect(screen.getByRole('heading', { name: 'Contact' })).toBeInTheDocument()
  })

  it('NotFound renders an h1 "Page Not Found" with a way back to Home', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'Page Not Found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to Home' })).toHaveAttribute('href', '/')
  })
})
