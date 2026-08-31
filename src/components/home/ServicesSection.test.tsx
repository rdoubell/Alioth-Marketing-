import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ServicesSection from './ServicesSection'
import { SERVICES } from './services-data'

describe('ServicesSection', () => {
  it('renders the section headline', () => {
    render(<ServicesSection />)
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('exports exactly six services', () => {
    expect(SERVICES).toHaveLength(6)
  })

  it('renders every service as a heading with its description, once in the stack and once in the recap', () => {
    render(<ServicesSection />)
    SERVICES.forEach((service) => {
      expect(screen.getAllByRole('heading', { name: service.name })).toHaveLength(2)
      expect(screen.getAllByText(service.description)).toHaveLength(2)
    })
  })
})
