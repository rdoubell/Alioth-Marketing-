import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import LogoC2 from './LogoC2'

describe('LogoC2', () => {
  it('links to home with the site name as its accessible name', () => {
    render(
      <MemoryRouter>
        <LogoC2 />
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: 'Alioth Marketing Solutions' })).toHaveAttribute('href', '/')
  })

  it('renders the Alioth wordmark and Marketing / Group lockup text, with no icon image', () => {
    render(
      <MemoryRouter>
        <LogoC2 />
      </MemoryRouter>
    )
    expect(screen.getByText('Alioth')).toBeInTheDocument()
    expect(screen.getByText('Marketing')).toBeInTheDocument()
    expect(screen.getByText('Group')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('defaults to ink tone, and switches to cream when requested', () => {
    const { rerender } = render(
      <MemoryRouter>
        <LogoC2 />
      </MemoryRouter>
    )
    expect(screen.getByText('Alioth')).toHaveClass('text-ink')

    rerender(
      <MemoryRouter>
        <LogoC2 tone="cream" />
      </MemoryRouter>
    )
    expect(screen.getByText('Alioth')).toHaveClass('text-cream')
  })
})
