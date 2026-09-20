import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import AppRoutes from './AppRoutes'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>
  )
}

describe('AppRoutes', () => {
  it('renders Home at /', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/where you should be/i)
  })

  it('renders About at /about', () => {
    renderAt('/about')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/why we.re called alioth/i)
  })

  it('renders Solutions at /solutions', () => {
    renderAt('/solutions')
    expect(screen.getByRole('heading', { name: 'Solutions' })).toBeInTheDocument()
  })

  it('renders Contact at /contact', () => {
    renderAt('/contact')
    expect(screen.getByRole('heading', { name: 'Contact' })).toBeInTheDocument()
  })

  it('renders Navbar and Footer on every route', () => {
    renderAt('/about')
    expect(screen.getAllByRole('link', { name: 'Alioth Marketing Solutions' })[0]).toHaveAttribute('href', '/')
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument()
  })

  it('renders the draft Privacy Policy at /privacy, noindexed and not linked from the Footer', () => {
    renderAt('/privacy')
    expect(screen.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeInTheDocument()
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex, nofollow')
    expect(screen.queryByRole('link', { name: 'Privacy Policy' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /privacy/i })).not.toBeInTheDocument()
  })

  it('renders NotFound for an unmatched path', () => {
    renderAt('/servicez')
    expect(screen.getByRole('heading', { name: 'Page Not Found' })).toBeInTheDocument()
  })

  it('renders a skip-to-content link pointing at the main landmark', () => {
    renderAt('/about')
    const skipLink = screen.getByRole('link', { name: 'Skip to content' })
    expect(skipLink).toHaveAttribute('href', '#main-content')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
  })
})
