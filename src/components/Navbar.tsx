import { useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV_LINKS } from '../lib/brand'
import LogoC2 from './LogoC2'
import { useNavbarScrollState } from '../hooks/useNavbarScrollState'

interface PillRect {
  left: number
  top: number
  width: number
  height: number
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { atTop } = useNavbarScrollState(isHome)
  // Transparent-over-hero only applies at the very top of Home, and never
  // while the mobile menu is open (it needs a readable backing regardless).
  // Mobile only — desktop (md+) always shows the solid cream bar, see the
  // `md:` overrides on the header below.
  const isTransparent = isHome && atTop && !open

  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const [pillRect, setPillRect] = useState<PillRect | null>(null)

  useLayoutEffect(() => {
    function measurePill() {
      const activeIndex = NAV_LINKS.findIndex((link) => link.href === location.pathname)
      const activeEl = linkRefs.current[activeIndex]
      setPillRect(
        activeEl
          ? {
              left: activeEl.offsetLeft,
              top: activeEl.offsetTop,
              width: activeEl.offsetWidth,
              height: activeEl.offsetHeight,
            }
          : null
      )
    }

    measurePill()
    // The pill is measured off each link's rendered width, but web fonts can
    // still be swapping in at mount time — re-measure once they've settled
    // (and on resize) so the pill doesn't stay sized to a fallback font.
    document.fonts?.ready?.then(measurePill)
    window.addEventListener('resize', measurePill)
    return () => window.removeEventListener('resize', measurePill)
  }, [location.pathname])

  return (
    <header
      className={`inset-x-0 top-0 z-50 transition-all duration-300 md:sticky md:border-b md:border-ink/10 md:backdrop-blur-sm md:bg-cream/90 ${isHome ? 'fixed' : 'sticky'} ${
        isTransparent
          ? 'bg-transparent'
          : `border-b border-ink/10 backdrop-blur-sm ${open ? 'bg-cream' : 'bg-cream/90'}`
      }`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center px-6">
        <div className="hidden w-full grid-cols-[1fr_auto_1fr] items-center gap-4 md:grid">
          <span className="justify-self-start">
            <LogoC2 tone="ink" />
          </span>

          <nav
            aria-label="Primary"
            className="relative flex items-center gap-1 justify-self-center rounded-full bg-green px-2 py-2"
          >
            {pillRect && (
              <span
                aria-hidden="true"
                className="absolute rounded-full bg-cream transition-all duration-300 ease-out"
                style={{
                  left: pillRect.left,
                  top: pillRect.top,
                  width: pillRect.width,
                  height: pillRect.height,
                }}
              />
            )}
            {NAV_LINKS.map((link, index) => {
              const active = location.pathname === link.href
              return (
                <Link
                  key={link.href}
                  ref={(el) => {
                    linkRefs.current[index] = el
                  }}
                  to={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative z-10 rounded-full px-5 py-2 font-sans text-xs uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${
                    active ? 'text-ink' : 'text-cream/80 hover:text-cream'
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
          <span onClick={() => setOpen(false)}>
            <LogoC2 tone={isTransparent ? 'cream' : 'ink'} />
          </span>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`relative h-6 w-6 shrink-0 ${isTransparent ? 'text-cream' : 'text-ink'}`}
          >
            <span
              className={`absolute left-0 top-[3px] block h-0.5 w-6 bg-current transition-transform duration-300 ${
                open ? 'translate-y-2 rotate-45' : ''
              }`}
            />
            <span
              className={`absolute left-0 top-[11px] block h-0.5 w-6 bg-current transition-opacity duration-300 ${
                open ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`absolute left-0 top-[19px] block h-0.5 w-6 bg-current transition-transform duration-300 ${
                open ? '-translate-y-2 -rotate-45' : ''
              }`}
            />
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
