import { render, screen, within } from '@testing-library/react'
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

// The component renders two parallel trees — a desktop scroll-stacking
// version and a plain mobile list — switched by CSS (not conditional
// rendering), so both exist in the DOM at once in tests. Scope assertions
// to one tree (desktop, arbitrarily) so duplicate content doesn't trip up
// getByRole's single-match requirement.
function desktopTree() {
  return within(screen.getByTestId('services-desktop'))
}

describe('ServicesSection', () => {
  it('renders the section headline in both the desktop and mobile trees', () => {
    renderServicesSection()
    expect(screen.getAllByRole('heading', { level: 2, name: 'What We Offer' })).toHaveLength(2)
  })

  it('exports exactly seven services, each with a unique slug', () => {
    expect(SERVICES).toHaveLength(7)
    const slugs = new Set(SERVICES.map((s) => s.slug))
    expect(slugs.size).toBe(7)
  })

  it('renders every service as a heading with its description', () => {
    renderServicesSection()
    const desktop = desktopTree()
    SERVICES.forEach((service) => {
      expect(desktop.getByRole('heading', { name: service.name })).toBeInTheDocument()
      expect(desktop.getByText(service.description)).toBeInTheDocument()
    })
  })

  it('gives every card its own "See More" link to its Solutions page anchor', () => {
    renderServicesSection()
    const seeMoreLinks = desktopTree().getAllByRole('link', { name: 'See More' })
    expect(seeMoreLinks).toHaveLength(7)
    SERVICES.forEach((service, i) => {
      expect(seeMoreLinks[i]).toHaveAttribute('href', `/solutions#${service.slug}`)
    })
  })

  it('links every tracker pill to its Solutions page anchor', () => {
    renderServicesSection()
    const desktop = desktopTree()
    SERVICES.forEach((service) => {
      expect(desktop.getByRole('link', { name: new RegExp(service.name) })).toHaveAttribute(
        'href',
        `/solutions#${service.slug}`
      )
    })
  })
})
