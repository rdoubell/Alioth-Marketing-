import { describe, it, expect } from 'vitest'
import { SITE_URL, SITE_NAME, CONTACT_EMAIL, CONTACT_PHONE, NAV_LINKS } from './brand'

describe('brand constants', () => {
  it('exposes the live production URL', () => {
    expect(SITE_URL).toBe('https://www.aliothgroup.co.za')
  })

  it('exposes site name and contact details', () => {
    expect(SITE_NAME).toBe('Alioth Marketing Solutions')
    expect(CONTACT_EMAIL).toBe('hello@aliothgroup.co.za')
    expect(CONTACT_PHONE).toBe('+27 (0) 00 000 0000')
  })

  it('defines exactly the three navbar links in order', () => {
    expect(NAV_LINKS).toEqual([
      { label: 'About', href: '/about' },
      { label: 'Solutions', href: '/solutions' },
      { label: 'Blog', href: '/blog' },
    ])
  })
})
