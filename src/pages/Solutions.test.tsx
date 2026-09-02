import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Solutions from './Solutions'
import { SERVICES } from '../components/home/services-data'

function renderSolutions() {
  return render(
    <MemoryRouter>
      <Solutions />
    </MemoryRouter>
  )
}

describe('Solutions', () => {
  it('renders an h1 "Solutions"', () => {
    renderSolutions()
    expect(screen.getByRole('heading', { level: 1, name: 'Solutions' })).toBeInTheDocument()
  })

  it('renders every service as a heading with an anchor matching its slug', () => {
    const { container } = renderSolutions()
    SERVICES.forEach((service) => {
      expect(screen.getByRole('heading', { name: service.name })).toBeInTheDocument()
      expect(container.querySelector(`#${service.slug}`)).toBeInTheDocument()
    })
  })

  it('renders every service description', () => {
    renderSolutions()
    SERVICES.forEach((service) => {
      expect(screen.getByText(service.description)).toBeInTheDocument()
    })
  })

  it('renders a tagline for every service', () => {
    const { container } = renderSolutions()
    SERVICES.forEach((service) => {
      const section = container.querySelector(`#${service.slug}`)
      expect(section?.querySelector('span')?.textContent).toBeTruthy()
    })
  })

  it('links the closing CTA to Contact', () => {
    renderSolutions()
    expect(screen.getByRole('link', { name: 'Work With Us' })).toHaveAttribute('href', '/contact')
  })
})
