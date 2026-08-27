import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Navbar from './Navbar'

function renderNavbar(initialEntries: string[] = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Navbar />
    </MemoryRouter>
  )
}

describe('Navbar', () => {
  it('renders the logo linking to home', () => {
    renderNavbar()
    const logo = screen.getAllByRole('link', { name: 'Alioth Marketing Solutions' })[0]
    expect(logo).toHaveAttribute('href', '/')
  })

  it('renders About, Solutions, and Blog nav links pointing to their pages', () => {
    renderNavbar()
    expect(screen.getAllByRole('link', { name: 'About' })[0]).toHaveAttribute('href', '/about')
    expect(screen.getAllByRole('link', { name: 'Solutions' })[0]).toHaveAttribute('href', '/solutions')
    expect(screen.getAllByRole('link', { name: 'Blog' })[0]).toHaveAttribute('href', '/blog')
  })

  it('renders a Contact Us button linking to the contact page', () => {
    renderNavbar()
    expect(screen.getAllByRole('link', { name: 'Contact Us' })[0]).toHaveAttribute('href', '/contact')
  })

  it('marks the nav link matching the current route as active via aria-current', () => {
    renderNavbar(['/about'])
    expect(screen.getAllByRole('link', { name: 'About' })[0]).toHaveAttribute('aria-current', 'page')
    expect(screen.getAllByRole('link', { name: 'Solutions' })[0]).not.toHaveAttribute('aria-current')
  })

  it('does not mark any nav link active on an unrelated route', () => {
    renderNavbar(['/'])
    expect(screen.getAllByRole('link', { name: 'About' })[0]).not.toHaveAttribute('aria-current')
    expect(screen.getAllByRole('link', { name: 'Solutions' })[0]).not.toHaveAttribute('aria-current')
    expect(screen.getAllByRole('link', { name: 'Blog' })[0]).not.toHaveAttribute('aria-current')
  })

  it('toggles the mobile menu open and closed', () => {
    renderNavbar()
    const toggle = screen.getByRole('button', { name: 'Toggle menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('highlights the active mobile link with bg-green instead of cream-on-cream', () => {
    renderNavbar(['/about'])
    const toggle = screen.getByRole('button', { name: 'Toggle menu' })
    fireEvent.click(toggle)

    const activeLink = screen.getAllByRole('link', { name: 'About' }).find((link) =>
      link.className.includes('text-center')
    )
    expect(activeLink).toHaveClass('bg-green')
    expect(activeLink).not.toHaveClass('bg-cream')
  })

  it('is transparent and floats over the hero at the top of Home', () => {
    const { container } = renderNavbar(['/'])
    const header = container.querySelector('header')
    expect(header).toHaveClass('bg-transparent')
    expect(header).toHaveClass('fixed')
    expect(header).not.toHaveClass('bg-cream/90')
  })

  it('is always solid and sticky on every other page, regardless of scroll', () => {
    const { container } = renderNavbar(['/about'])
    const header = container.querySelector('header')
    expect(header).toHaveClass('bg-cream/90')
    expect(header).toHaveClass('sticky')
    expect(header).not.toHaveClass('fixed')
    expect(header).not.toHaveClass('bg-transparent')
  })

  it('forces a fully opaque background when the mobile menu is open on Home, so hero content cannot bleed through', () => {
    const { container } = renderNavbar(['/'])
    const toggle = screen.getByRole('button', { name: 'Toggle menu' })
    fireEvent.click(toggle)

    const header = container.querySelector('header')
    expect(header).toHaveClass('bg-cream')
    expect(header).not.toHaveClass('bg-cream/90')
    expect(header).not.toHaveClass('bg-transparent')
  })

  it('switches the Contact Us button to cream-on-transparent styling when transparent', () => {
    renderNavbar(['/'])
    const contactLink = screen.getAllByRole('link', { name: 'Contact Us' })[0]
    expect(contactLink).toHaveClass('border-cream')
    expect(contactLink).toHaveClass('text-cream')
  })

  it('animates the mobile toggle bars into an X when opened', () => {
    renderNavbar()
    const toggle = screen.getByRole('button', { name: 'Toggle menu' })
    const bars = toggle.querySelectorAll('span')
    expect(bars[0]).not.toHaveClass('rotate-45')

    fireEvent.click(toggle)
    expect(bars[0]).toHaveClass('rotate-45')
    expect(bars[1]).toHaveClass('opacity-0')
    expect(bars[2]).toHaveClass('-rotate-45')
  })

  it('renders a sliding active-pill indicator behind the matched desktop link', () => {
    const { container } = renderNavbar(['/about'])
    const pill = container.querySelector('nav[aria-label="Primary"] span[aria-hidden="true"]')
    expect(pill).not.toBeNull()
  })

  it('renders no active-pill indicator when the route matches no nav link', () => {
    const { container } = renderNavbar(['/contact'])
    const pill = container.querySelector('nav[aria-label="Primary"] span[aria-hidden="true"]')
    expect(pill).toBeNull()
  })
})
