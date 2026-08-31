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

  it('exports exactly six services, each with a unique slug', () => {
    expect(SERVICES).toHaveLength(6)
    const slugs = new Set(SERVICES.map((s) => s.slug))
    expect(slugs.size).toBe(6)
  })

  it('renders every service as a heading with its description', () => {
    renderServicesSection()
    SERVICES.forEach((service) => {
      expect(screen.getByRole('heading', { name: service.name })).toBeInTheDocument()
      expect(screen.getByText(service.description)).toBeInTheDocument()
    })
  })

  it('gives every card its own "See More" link to its Solutions page anchor', () => {
    renderServicesSection()
    const seeMoreLinks = screen.getAllByRole('link', { name: 'See More' })
    expect(seeMoreLinks).toHaveLength(6)
    SERVICES.forEach((service, i) => {
      expect(seeMoreLinks[i]).toHaveAttribute('href', `/solutions#${service.slug}`)
    })
  })

  it('links every tracker pill to its Solutions page anchor', () => {
    renderServicesSection()
    SERVICES.forEach((service) => {
      expect(screen.getByRole('link', { name: new RegExp(service.name) })).toHaveAttribute(
        'href',
        `/solutions#${service.slug}`
      )
    })
  })
})
