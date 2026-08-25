import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ServicesSection from './ServicesSection'
import { SERVICES } from './services-data'

describe('ServicesSection', () => {
  it('renders the section label', () => {
    render(<ServicesSection />)
    expect(screen.getByText('What We Offer')).toBeInTheDocument()
  })

  it('exports exactly six services', () => {
    expect(SERVICES).toHaveLength(6)
  })

  it('renders every service as a heading with its description', () => {
    render(<ServicesSection />)
    SERVICES.forEach((service) => {
      expect(screen.getByRole('heading', { name: service.name })).toBeInTheDocument()
      expect(screen.getByText(service.description)).toBeInTheDocument()
    })
  })
})
