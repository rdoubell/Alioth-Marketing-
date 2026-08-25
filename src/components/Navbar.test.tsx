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
})
