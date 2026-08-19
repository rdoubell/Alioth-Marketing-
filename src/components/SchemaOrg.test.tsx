import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SchemaOrg from './SchemaOrg'

describe('SchemaOrg', () => {
  it('renders a valid Organization JSON-LD script tag', () => {
    const { container } = render(<SchemaOrg />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()

    const data = JSON.parse(script!.textContent ?? '{}')
    expect(data['@type']).toBe('Organization')
    expect(data.name).toBe('Alioth Marketing Solutions')
    expect(data.url).toBe('https://www.aliothgroup.co.za')
    expect(data.email).toBe('hello@aliothgroup.co.za')
    expect(data.address.addressLocality).toBe('Johannesburg')
    expect(data.address.addressCountry).toBe('ZA')
  })
})
