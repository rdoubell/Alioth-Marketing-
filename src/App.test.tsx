import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App (maintenance mode)', () => {
  it('renders the Coming Soon page instead of normal routing while MAINTENANCE_MODE is on', () => {
    render(<App />)
    expect(screen.getByText('Coming Soon...')).toBeInTheDocument()
  })

  it('does not render the site Navbar while in maintenance mode', () => {
    render(<App />)
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })
})
