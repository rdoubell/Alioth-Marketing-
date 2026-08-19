import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Navbar from './Navbar'

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  )
}

describe('Navbar', () => {
  it('renders the logo linking to home', () => {
    renderNavbar()
    const logo = screen.getByRole('link', { name: 'Alioth Marketing Solutions' })
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
