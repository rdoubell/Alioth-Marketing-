import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SchemaOrg from './SchemaOrg'
import { SERVICES } from './home/services-data'

describe('SchemaOrg', () => {
  it('renders a valid ProfessionalService JSON-LD script tag', () => {
    const { container } = render(<SchemaOrg />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()

    const data = JSON.parse(script!.textContent ?? '{}')
    expect(data['@type']).toBe('ProfessionalService')
    expect(data.name).toBe('Alioth Marketing Solutions')
    expect(data.url).toBe('https://www.aliothgroup.co.za')
    expect(data.email).toBe('rohan@aliothgroup.co.za')
    expect(data.telephone).toBe('+27 79 351 1570')
    expect(data.address.addressLocality).toBe('Johannesburg')
    expect(data.address.addressRegion).toBe('Gauteng')
    expect(data.address.addressCountry).toBe('ZA')
  })

  it('lists every service in the offer catalog, matching the Solutions page anchors', () => {
    const { container } = render(<SchemaOrg />)
    const script = container.querySelector('script[type="application/ld+json"]')
    const data = JSON.parse(script!.textContent ?? '{}')

    expect(data.hasOfferCatalog.itemListElement).toHaveLength(SERVICES.length)
    SERVICES.forEach((service, i) => {
      const offer = data.hasOfferCatalog.itemListElement[i]
      expect(offer.itemOffered.name).toBe(service.name)
      expect(offer.itemOffered.url).toBe(`https://www.aliothgroup.co.za/solutions#${service.slug}`)
    })
  })
})
