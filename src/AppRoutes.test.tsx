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
    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument()
  })

  it('renders Solutions at /solutions', () => {
    renderAt('/solutions')
    expect(screen.getByRole('heading', { name: 'Solutions' })).toBeInTheDocument()
  })

  it('renders Contact at /contact', () => {
    renderAt('/contact')
    expect(screen.getByRole('heading', { name: 'Contact' })).toBeInTheDocument()
  })

  it('renders Insights at /blog', () => {
    renderAt('/blog')
    expect(screen.getByRole('heading', { name: 'Insights' })).toBeInTheDocument()
  })

  it('renders the post slug at /blog/:slug', () => {
    renderAt('/blog/hello-world')
    expect(screen.getByRole('heading', { name: 'Post: hello-world' })).toBeInTheDocument()
  })

  it('renders Navbar and Footer on every route', () => {
    renderAt('/about')
    expect(screen.getAllByRole('link', { name: 'Alioth Marketing Solutions' })[0]).toHaveAttribute('href', '/')
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument()
  })

  it('renders NotFound for an unmatched path', () => {
    renderAt('/servicez')
    expect(screen.getByRole('heading', { name: 'Page Not Found' })).toBeInTheDocument()
  })
})
