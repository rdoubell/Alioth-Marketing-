import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import App from './App'

describe('App (maintenance mode)', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders the Coming Soon page on the apex production domain', () => {
    vi.stubGlobal('location', { ...window.location, hostname: 'aliothgroup.co.za' })
    render(<App />)
    expect(screen.getByText('Coming Soon...')).toBeInTheDocument()
  })

  it('renders the Coming Soon page on the www production domain', () => {
    vi.stubGlobal('location', { ...window.location, hostname: 'www.aliothgroup.co.za' })
    render(<App />)
    expect(screen.getByText('Coming Soon...')).toBeInTheDocument()
  })

  it('renders normal routing on localhost instead of the Coming Soon page', () => {
    vi.stubGlobal('location', { ...window.location, hostname: 'localhost' })
    render(<App />)
    expect(screen.queryByText('Coming Soon...')).not.toBeInTheDocument()
  })

  it('renders normal routing on a Vercel preview domain instead of the Coming Soon page', () => {
    vi.stubGlobal('location', {
      ...window.location,
      hostname: 'alioth-marketing-git-feature-branch.vercel.app',
    })
    render(<App />)
    expect(screen.queryByText('Coming Soon...')).not.toBeInTheDocument()
  })
})
