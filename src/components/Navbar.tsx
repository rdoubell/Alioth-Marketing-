import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV_LINKS, SITE_NAME } from '../lib/brand'
import logoIcon from '../assets/brand/A-black.png'
import LogoC3 from './LogoC3'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/90 backdrop-blur-sm">
      <div className="mx-auto flex h-20 max-w-6xl items-center px-6">
        <div className="hidden w-full grid-cols-[1fr_auto_1fr] items-center gap-4 md:grid">
          <span className="justify-self-start">
            <LogoC3 />
          </span>

          <nav aria-label="Primary" className="flex items-center gap-1 justify-self-center rounded-full bg-green px-2 py-2">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.href
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-full px-5 py-2 font-sans text-xs uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${
                    active ? 'bg-cream text-ink' : 'text-cream/80 hover:text-cream'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <Link
            to="/contact"
            className="justify-self-end rounded-full border border-ink px-6 py-3 font-sans text-xs uppercase tracking-wider text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-ink hover:text-cream hover:shadow-lg active:translate-y-0 active:scale-95"
          >
            Contact Us
          </Link>
        </div>

        <div className="flex w-full items-center justify-between md:hidden">
          <Link to="/" onClick={() => setOpen(false)}>
            <img src={logoIcon} alt={SITE_NAME} className="h-8 w-auto" />
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="text-ink"
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Primary" className="flex flex-col gap-2 px-6 pb-6 md:hidden">
          {NAV_LINKS.map((link) => {
            const active = location.pathname === link.href
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={`rounded-full px-4 py-2 text-center font-sans text-sm uppercase tracking-wider ${
                  active ? 'bg-green text-cream' : 'text-ink/70'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="rounded-full border border-ink px-5 py-3 text-center font-sans text-sm uppercase tracking-wider text-ink"
          >
            Contact Us
          </Link>
        </nav>
      )}
    </header>
  )
}
