import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Footer from './Footer'

describe('Footer', () => {
  it('renders the current year in the copyright line', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    const year = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(`© ${year}`))).toBeInTheDocument()
  })

  it('renders contact email and phone as clickable links', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: 'hello@aliothgroup.co.za' })).toHaveAttribute(
      'href',
      'mailto:hello@aliothgroup.co.za'
    )
    expect(screen.getByRole('link', { name: '+27 (0) 00 000 0000' })).toHaveAttribute(
      'href',
      'tel:+27(0)000000000'
    )
  })

  it('renders nav links including Contact', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact')
  })
})
