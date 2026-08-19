import { useState } from 'react'
import { Link } from 'react-router-dom'
import { NAV_LINKS, SITE_NAME } from '../lib/brand'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-cream/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-serif text-lg text-cream" onClick={() => setOpen(false)}>
          {SITE_NAME}
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="font-sans text-xs uppercase tracking-wider text-cream/70 hover:text-cream transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="font-sans text-xs uppercase tracking-wider bg-cream text-ink px-5 py-2.5 hover:bg-cream-deep transition-colors"
          >
            Contact Us
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-cream"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open && (
        <div className="md:hidden flex flex-col gap-4 px-6 pb-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setOpen(false)}
              className="font-sans text-sm uppercase tracking-wider text-cream/80"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="font-sans text-sm uppercase tracking-wider bg-cream text-ink px-5 py-3 text-center"
          >
            Contact Us
          </Link>
        </div>
      )}
    </nav>
  )
}
