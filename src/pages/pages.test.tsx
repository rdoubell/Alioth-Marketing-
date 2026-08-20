import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Home from './Home'
import About from './About'
import Solutions from './Solutions'
import Contact from './Contact'
import Blog from './Blog'
import BlogPost from './BlogPost'
import NotFound from './NotFound'

describe('page shells', () => {
  it('Home renders an h1 "Home"', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument()
  })

  it('About renders an h1 "About"', () => {
    render(<About />)
    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument()
  })

  it('Solutions renders an h1 "Solutions"', () => {
    render(<Solutions />)
    expect(screen.getByRole('heading', { name: 'Solutions' })).toBeInTheDocument()
  })

  it('Contact renders an h1 "Contact"', () => {
    render(<Contact />)
    expect(screen.getByRole('heading', { name: 'Contact' })).toBeInTheDocument()
  })

  it('Blog renders an h1 "Insights"', () => {
    render(<Blog />)
    expect(screen.getByRole('heading', { name: 'Insights' })).toBeInTheDocument()
  })

  it('BlogPost renders the slug from the URL', () => {
    render(
      <MemoryRouter initialEntries={['/blog/hello-world']}>
        <Routes>
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'Post: hello-world' })).toBeInTheDocument()
  })

  it('NotFound renders an h1 "Page Not Found"', () => {
    render(<NotFound />)
    expect(screen.getByRole('heading', { name: 'Page Not Found' })).toBeInTheDocument()
  })
})
