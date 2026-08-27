import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import LogoC3 from './LogoC3'

describe('LogoC3', () => {
  it('links to home with the site name as its accessible name', () => {
    render(
      <MemoryRouter>
        <LogoC3 />
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: 'Alioth Marketing Solutions' })).toHaveAttribute('href', '/')
  })

  it('renders the Marketing / Group lockup text', () => {
    render(
      <MemoryRouter>
        <LogoC3 />
      </MemoryRouter>
    )
    expect(screen.getByText('Marketing')).toBeInTheDocument()
    expect(screen.getByText('Group')).toBeInTheDocument()
  })
})
