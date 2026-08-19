import { render } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import SEOMeta from './SEOMeta'

describe('SEOMeta', () => {
  afterEach(() => {
    document.head.innerHTML = ''
    document.title = ''
  })
  it('sets the document title with the site name suffix', () => {
    render(<SEOMeta title="Solutions" description="What we offer." path="/solutions" />)
    expect(document.title).toBe('Solutions | Alioth Marketing Solutions')
  })

  it('does not double up the site name if already present', () => {
    render(<SEOMeta title="Alioth Marketing Solutions" description="Home." path="/" />)
    expect(document.title).toBe('Alioth Marketing Solutions')
  })

  it('sets description and canonical link', () => {
    render(<SEOMeta title="About" description="Who we are." path="/about" />)
    const desc = document.querySelector('meta[name="description"]')
    const canonical = document.querySelector('link[rel="canonical"]')
    expect(desc?.getAttribute('content')).toBe('Who we are.')
    expect(canonical?.getAttribute('href')).toBe('https://www.aliothgroup.co.za/about')
  })

  it('sets Open Graph tags with a default image when none provided', () => {
    render(<SEOMeta title="Blog" description="Insights." path="/blog" />)
    const ogImage = document.querySelector('meta[property="og:image"]')
    const ogType = document.querySelector('meta[property="og:type"]')
    expect(ogImage?.getAttribute('content')).toBe('https://www.aliothgroup.co.za/og-image.png')
    expect(ogType?.getAttribute('content')).toBe('website')
  })
})
