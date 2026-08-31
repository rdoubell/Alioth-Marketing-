import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import ServicesSection from './ServicesSection'
import { SERVICES } from './services-data'

function renderServicesSection() {
  return render(
    <MemoryRouter>
      <ServicesSection />
    </MemoryRouter>
  )
}

describe('ServicesSection', () => {
  it('renders the section headline', () => {
    renderServicesSection()
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('exports exactly six services', () => {
    expect(SERVICES).toHaveLength(6)
  })

  it('renders every service as a heading with its description', () => {
    renderServicesSection()
    SERVICES.forEach((service) => {
      expect(screen.getByRole('heading', { name: service.name })).toBeInTheDocument()
      expect(screen.getByText(service.description)).toBeInTheDocument()
    })
  })

  it('renders a "See More" link pointing to the Solutions page', () => {
    renderServicesSection()
    expect(screen.getByRole('link', { name: 'See More' })).toHaveAttribute('href', '/solutions')
  })
})
