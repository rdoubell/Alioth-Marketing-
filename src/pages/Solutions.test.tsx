import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Solutions from './Solutions'
import { SERVICES } from '../components/home/services-data'
import { SOLUTION_DETAILS, SERVICE_FAQS, GENERAL_FAQS } from './solutions-data'

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

  it('has a detail entry (tagline, icon, paragraphs) and two FAQs for every service', () => {
    SERVICES.forEach((service) => {
      const detail = SOLUTION_DETAILS[service.slug]
      expect(detail, `missing SOLUTION_DETAILS entry for ${service.slug}`).toBeDefined()
      expect(detail.tagline.length).toBeGreaterThan(0)
      expect(detail.paragraphs.length).toBeGreaterThan(0)
      expect(SERVICE_FAQS[service.slug], `missing FAQs for ${service.slug}`).toHaveLength(2)
    })
  })

  it('lists every service with a heading and a link to its own page', () => {
    renderSolutions()
    SERVICES.forEach((service) => {
      expect(screen.getByRole('heading', { name: service.name })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: `Explore ${service.name}` })).toHaveAttribute(
        'href',
        `/solutions/${service.slug}`
      )
    })
  })

  it('renders the general FAQ and its FAQPage markup', () => {
    const { container } = renderSolutions()
    GENERAL_FAQS.forEach((faq) => {
      expect(screen.getByText(faq.question)).toBeInTheDocument()
    })
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(JSON.parse(script!.textContent ?? '{}')['@type']).toBe('FAQPage')
  })

  it('links the closing CTA to Contact', () => {
    renderSolutions()
    expect(screen.getByRole('link', { name: 'Work With Us' })).toHaveAttribute('href', '/contact')
  })
})
