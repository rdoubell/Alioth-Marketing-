import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import ServiceDetail from './ServiceDetail'
import { SERVICES } from '../components/home/services-data'
import { SOLUTION_DETAILS, SERVICE_FAQS } from './solutions-data'

function renderService(slug: string) {
  return render(
    <MemoryRouter initialEntries={[`/solutions/${slug}`]}>
      <Routes>
        <Route path="/solutions/:slug" element={<ServiceDetail />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ServiceDetail', () => {
  it.each(SERVICES.map((s) => [s.slug, s.name]))('renders the full page for %s', (slug, name) => {
    const { container } = renderService(slug)
    expect(screen.getByRole('heading', { level: 1, name })).toBeInTheDocument()
    SOLUTION_DETAILS[slug].paragraphs.forEach((p) => {
      expect(container.textContent).toContain(p)
    })
    SERVICE_FAQS[slug].forEach((faq) => {
      expect(screen.getByText(faq.question)).toBeInTheDocument()
    })
    expect(document.title).toContain(`${name} Services in Johannesburg`)
  })

  it('emits Service and FAQPage structured data', () => {
    const { container } = renderService('paid-media')
    const types = [...container.querySelectorAll('script[type="application/ld+json"]')].map(
      (el) => JSON.parse(el.textContent ?? '{}')['@type']
    )
    expect(types).toEqual(expect.arrayContaining(['Service', 'FAQPage']))
  })

  it('links to the six other services and to Contact', () => {
    renderService('strategy')
    expect(screen.getAllByRole('link', { name: /^(?!Strategy$).*/ }).length).toBeGreaterThan(6)
    expect(screen.getByRole('link', { name: 'Work With Us' })).toHaveAttribute('href', '/contact')
    expect(screen.getByRole('link', { name: 'All solutions' })).toHaveAttribute('href', '/solutions')
  })

  it('renders NotFound for an unknown slug', () => {
    renderService('nope')
    expect(screen.getByRole('heading', { name: 'Page Not Found' })).toBeInTheDocument()
  })
})
