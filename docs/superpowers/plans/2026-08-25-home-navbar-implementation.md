# Home Page & Navbar Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Alioth Marketing Solutions Navbar and Home page to match the approved revx.ai-structured redesign spec, and make local/preview builds visible again despite the production maintenance gate.

**Architecture:** React Router v7 SPA, unchanged. New composable pieces: a shared `ContactForm` component consumed by both the Home page's inline contact section and the standalone `/contact` page; a redesigned `Navbar` with a route-aware active-link pill; and three new Home-only section components (`Hero`, `ServicesSection`, `ContactSection`) composed by `src/pages/Home.tsx`. No new dependencies, no backend changes — `api/contact.ts` already accepts the exact payload shape these forms will send.

**Tech Stack:** React 18, TypeScript, React Router DOM 7, Tailwind CSS, Vitest + React Testing Library (existing stack, unchanged).

## Global Constraints

- Brand colors (Tailwind tokens, already in `tailwind.config.js`): `black #0E0D0B`, `ink #15140F`, `cream #F1E9DA`, `cream-deep #E6DAC2`, `cream-soft #F7F2E8`, `green #1B3B2F` (Deep Forest), `green-bright #27513F`, `green-deep #0F2A20`.
- Fonts (already in `tailwind.config.js` / `src/index.css`): `font-serif` = Cormorant Garamond (display/headlines), `font-sans` = Archivo (body/UI), `font-mono` = Space Mono (labels/eyebrows, uppercase, wide tracking).
- Nav links are exactly the existing `NAV_LINKS` in `src/lib/brand.ts`: About (`/about`), Solutions (`/solutions`), Blog (`/blog`). Do not add a separate "Home" link.
- Navbar layout: Contact Us button (left) · pill-shaped nav containing the three links (center) · Alioth logo (right). Pill background is `green`, link text `cream`, and the currently active route gets a `cream` background pill behind its own link (route match via `useLocation().pathname === link.href`, exact match).
- Navbar bar background: this repo's brand guideline and the spec do not define what sits behind the Contact button / pill / logo themselves. To stay legible over both the dark hero video (Home) and the plain cream background (every other page) without inventing new unreviewed colors, the header itself gets a `bg-cream/90 backdrop-blur-sm` backing bar, and the Contact button, logo, and mobile toggle use `ink`-toned styling (the existing site's `bg-black/95` sticky-bar pattern, recolored to sit correctly under the new cream-dominant palette). This is a build-time judgment call, not a spec requirement — flag it for a quick look once it's live locally.
- Logo asset: `src/assets/brand/A-black.png` (already copied from the brand guideline's asset set). Accessible name via `alt`/link text is the existing `SITE_NAME` constant, `"Alioth Marketing Solutions"`.
- Hero background video: `/video/hero-loop.mp4` (already built and committed at `public/video/hero-loop.mp4`), full-bleed, autoplay, muted, loop, `playsInline`.
- Services section: exactly 6 cards — Strategy, Paid Media, Email & Automation, SEO & Content, Design & Creative, Analytics & Reporting — name + one-sentence description each, no icons. Content is draft placeholder, swappable later.
- One shared `ContactForm` component (First Name, Last Name, Email, "How can we help you?" textarea, Send button) used both inline on Home and on `/contact`. Both submit `POST /api/contact` with `{ firstName, lastName, email, message, source: 'home' | 'contact-page' }` — this exact shape is already required/validated by `api/contact.ts` (see `validateContactPayload`).
- Footer is unchanged and out of scope — it already renders globally from `src/AppRoutes.tsx` for every route; no page-level component should render its own footer.
- No mobile-specific direction was given for the navbar; default to a hamburger-triggered dropdown below the `md` breakpoint, matching the existing placeholder Navbar's mobile pattern.
- Run `npm run test` after every task and `npm run build` (which runs `tsc -b` then `vite build`) at the end of the plan to confirm the whole branch type-checks and builds.

---

### Task 1: Stop gating local/preview builds behind maintenance mode

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing consumed by later tasks — this task is independent and can be done first or last.

**Context:** `src/App.tsx` currently hardcodes `const MAINTENANCE_MODE = true`, so even `npm run dev` and any Vercel preview deployment show the "Coming Soon" screen instead of real pages. Only the live production domain (`aliothgroup.co.za` / `www.aliothgroup.co.za`) should be gated — localhost and any Vercel preview URL (`*.vercel.app`) should render normal routing so progress is visible as the rest of this plan lands.

- [ ] **Step 1: Write the failing tests**

Replace the full contents of `src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import App from './App'

describe('App (maintenance mode)', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders the Coming Soon page on the apex production domain', () => {
    vi.stubGlobal('location', { ...window.location, hostname: 'aliothgroup.co.za' })
    render(<App />)
    expect(screen.getByText('Coming Soon...')).toBeInTheDocument()
  })

  it('renders the Coming Soon page on the www production domain', () => {
    vi.stubGlobal('location', { ...window.location, hostname: 'www.aliothgroup.co.za' })
    render(<App />)
    expect(screen.getByText('Coming Soon...')).toBeInTheDocument()
  })

  it('renders normal routing on localhost instead of the Coming Soon page', () => {
    vi.stubGlobal('location', { ...window.location, hostname: 'localhost' })
    render(<App />)
    expect(screen.queryByText('Coming Soon...')).not.toBeInTheDocument()
  })

  it('renders normal routing on a Vercel preview domain instead of the Coming Soon page', () => {
    vi.stubGlobal('location', {
      ...window.location,
      hostname: 'alioth-marketing-git-feature-branch.vercel.app',
    })
    render(<App />)
    expect(screen.queryByText('Coming Soon...')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- App.test.tsx`
Expected: FAIL — the two "normal routing" tests fail because `MAINTENANCE_MODE` is still hardcoded `true`, so `Coming Soon...` renders on every hostname.

- [ ] **Step 3: Implement hostname-based gating**

Replace the full contents of `src/App.tsx`:

```tsx
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import ComingSoon from './components/ComingSoon'

// Only the live production domain is gated behind the Coming Soon screen.
// Localhost and Vercel preview URLs (*.vercel.app) always render normal
// routing so progress is visible while the site is still being built.
const GATED_PRODUCTION_HOSTNAMES = new Set(['aliothgroup.co.za', 'www.aliothgroup.co.za'])

function isGatedProductionDomain(): boolean {
  return GATED_PRODUCTION_HOSTNAMES.has(window.location.hostname)
}

export default function App() {
  if (isGatedProductionDomain()) {
    return <ComingSoon />
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- App.test.tsx`
Expected: PASS — all 4 tests green.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "Gate maintenance mode by hostname instead of a static flag"
```

---

### Task 2: Shared ContactForm component

**Files:**
- Create: `src/components/ContactForm.tsx`
- Create: `src/components/ContactForm.test.tsx`

**Interfaces:**
- Consumes: `POST /api/contact` (existing, at `api/contact.ts`) — request body `{ firstName: string, lastName: string, email: string, message: string, source: 'home' | 'contact-page' }`, response `{ ok: true }` on 200 or `{ error: string }` on 4xx/5xx.
- Produces: `export default function ContactForm({ source }: { source: 'home' | 'contact-page' }): JSX.Element`, and `export type ContactFormSource = 'home' | 'contact-page'`. Fields are reachable via accessible labels: `"First Name"`, `"Last Name"`, `"Email"`, `"How can we help you?"`. Submit button has accessible name `"Send"`. Consumed by Task 6 (`ContactSection`) and Task 8 (`Contact` page).

- [ ] **Step 1: Write the failing tests**

Create `src/components/ContactForm.test.tsx`:

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import ContactForm from './ContactForm'

function fillForm() {
  fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'Jane' } })
  fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } })
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@example.com' } })
  fireEvent.change(screen.getByLabelText('How can we help you?'), {
    target: { value: 'Tell me more' },
  })
}

describe('ContactForm', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('submits the entered values with the given source to /api/contact', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) })
    vi.stubGlobal('fetch', fetchMock)

    render(<ContactForm source="home" />)
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/contact')
    expect(JSON.parse(options.body)).toEqual({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      message: 'Tell me more',
      source: 'home',
    })
  })

  it('shows a thank-you message after a successful submission', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) }))

    render(<ContactForm source="contact-page" />)
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    expect(await screen.findByRole('status')).toHaveTextContent(/thanks/i)
  })

  it('shows the server error message when submission fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: 'a valid email is required' }) })
    )

    render(<ContactForm source="home" />)
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('a valid email is required')
  })

  it('shows a generic error message when the network request throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))

    render(<ContactForm source="home" />)
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/something went wrong/i)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- ContactForm.test.tsx`
Expected: FAIL with "Cannot find module './ContactForm'".

- [ ] **Step 3: Implement ContactForm**

Create `src/components/ContactForm.tsx`:

```tsx
import { useState, type FormEvent } from 'react'

export type ContactFormSource = 'home' | 'contact-page'

interface ContactFormProps {
  source: ContactFormSource
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactForm({ source }: ContactFormProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, message, source }),
      })

      if (!response.ok) {
        const body = (await response.json()) as { error?: string }
        setErrorMessage(body.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setStatus('success')
      setFirstName('')
      setLastName('')
      setEmail('')
      setMessage('')
    } catch {
      setErrorMessage('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p role="status" className="font-sans text-ink">
        Thanks — we&apos;ll be in touch soon.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          aria-label="First Name"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="flex-1 border border-ink/20 bg-cream-soft px-4 py-3 font-sans text-sm"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          aria-label="Last Name"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="flex-1 border border-ink/20 bg-cream-soft px-4 py-3 font-sans text-sm"
        />
      </div>
      <input
        type="email"
        name="email"
        placeholder="Email"
        aria-label="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-ink/20 bg-cream-soft px-4 py-3 font-sans text-sm"
      />
      <textarea
        name="message"
        placeholder="How can we help you?"
        aria-label="How can we help you?"
        required
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="resize-none border border-ink/20 bg-cream-soft px-4 py-3 font-sans text-sm"
      />
      {status === 'error' && (
        <p role="alert" className="font-sans text-sm text-red-700">
          {errorMessage}
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="self-start bg-green px-8 py-3 font-sans text-xs uppercase tracking-wider text-cream transition-colors hover:bg-green-bright disabled:opacity-50"
      >
        {status === 'submitting' ? 'Sending…' : 'Send'}
      </button>
    </form>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- ContactForm.test.tsx`
Expected: PASS — all 4 tests green.

- [ ] **Step 5: Commit**

```bash
git add src/components/ContactForm.tsx src/components/ContactForm.test.tsx
git commit -m "Add shared ContactForm component"
```

---

### Task 3: Redesigned Navbar

**Files:**
- Create: `src/vite-env.d.ts`
- Modify: `src/components/Navbar.tsx`
- Modify: `src/components/Navbar.test.tsx`

**Interfaces:**
- Consumes: `NAV_LINKS`, `SITE_NAME` from `src/lib/brand.ts` (unchanged), logo image at `src/assets/brand/A-black.png` (already present).
- Produces: nothing consumed by later tasks — `Navbar` is rendered globally by `src/AppRoutes.tsx`, which already imports it and needs no changes.

**Context:** TypeScript needs an ambient module declaration to import `.png` files as ES modules (`import logoIcon from '../assets/brand/A-black.png'`); this repo doesn't have a `vite-env.d.ts` yet, so add one first as part of this task, since this is the first component to do an asset import.

- [ ] **Step 1: Add Vite's client type declarations**

Create `src/vite-env.d.ts`:

```ts
/// <reference types="vite/client" />
```

- [ ] **Step 2: Write the failing tests**

Replace the full contents of `src/components/Navbar.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Navbar from './Navbar'

function renderNavbar(initialEntries: string[] = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Navbar />
    </MemoryRouter>
  )
}

describe('Navbar', () => {
  it('renders the logo linking to home', () => {
    renderNavbar()
    const logo = screen.getAllByRole('link', { name: 'Alioth Marketing Solutions' })[0]
    expect(logo).toHaveAttribute('href', '/')
  })

  it('renders About, Solutions, and Blog nav links pointing to their pages', () => {
    renderNavbar()
    expect(screen.getAllByRole('link', { name: 'About' })[0]).toHaveAttribute('href', '/about')
    expect(screen.getAllByRole('link', { name: 'Solutions' })[0]).toHaveAttribute('href', '/solutions')
    expect(screen.getAllByRole('link', { name: 'Blog' })[0]).toHaveAttribute('href', '/blog')
  })

  it('renders a Contact Us button linking to the contact page', () => {
    renderNavbar()
    expect(screen.getAllByRole('link', { name: 'Contact Us' })[0]).toHaveAttribute('href', '/contact')
  })

  it('marks the nav link matching the current route as active via aria-current', () => {
    renderNavbar(['/about'])
    expect(screen.getAllByRole('link', { name: 'About' })[0]).toHaveAttribute('aria-current', 'page')
    expect(screen.getAllByRole('link', { name: 'Solutions' })[0]).not.toHaveAttribute('aria-current')
  })

  it('does not mark any nav link active on an unrelated route', () => {
    renderNavbar(['/'])
    expect(screen.getAllByRole('link', { name: 'About' })[0]).not.toHaveAttribute('aria-current')
    expect(screen.getAllByRole('link', { name: 'Solutions' })[0]).not.toHaveAttribute('aria-current')
    expect(screen.getAllByRole('link', { name: 'Blog' })[0]).not.toHaveAttribute('aria-current')
  })

  it('toggles the mobile menu open and closed', () => {
    renderNavbar()
    const toggle = screen.getByRole('button', { name: 'Toggle menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })
})
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm run test -- Navbar.test.tsx`
Expected: FAIL — the active-route tests fail because the current Navbar has no `aria-current` handling, and the logo test fails because the current Navbar renders text, not an image link.

- [ ] **Step 4: Implement the redesigned Navbar**

Replace the full contents of `src/components/Navbar.tsx`:

```tsx
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV_LINKS, SITE_NAME } from '../lib/brand'
import logoIcon from '../assets/brand/A-black.png'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/90 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="hidden grid-cols-[1fr_auto_1fr] items-center gap-4 md:grid">
          <Link
            to="/contact"
            className="justify-self-start border border-ink px-6 py-3 font-sans text-xs uppercase tracking-wider text-ink transition-colors hover:bg-ink hover:text-cream"
          >
            Contact Us
          </Link>

          <nav aria-label="Primary" className="flex items-center gap-1 justify-self-center rounded-full bg-green px-2 py-2">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.href
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-full px-5 py-2 font-sans text-xs uppercase tracking-wider transition-colors ${
                    active ? 'bg-cream text-ink' : 'text-cream/80 hover:text-cream'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <Link to="/" className="justify-self-end">
            <img src={logoIcon} alt={SITE_NAME} className="h-8 w-auto" />
          </Link>
        </div>

        <div className="flex items-center justify-between md:hidden">
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
        <div className="flex flex-col gap-2 px-6 pb-6 md:hidden">
          {NAV_LINKS.map((link) => {
            const active = location.pathname === link.href
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={`rounded-full px-4 py-2 text-center font-sans text-sm uppercase tracking-wider ${
                  active ? 'bg-cream text-ink' : 'text-ink/70'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="border border-ink px-5 py-3 text-center font-sans text-sm uppercase tracking-wider text-ink"
          >
            Contact Us
          </Link>
        </div>
      )}
    </header>
  )
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm run test -- Navbar.test.tsx`
Expected: PASS — all 6 tests green.

- [ ] **Step 6: Commit**

```bash
git add src/vite-env.d.ts src/components/Navbar.tsx src/components/Navbar.test.tsx
git commit -m "Redesign Navbar with pill nav and active-route indicator"
```

---

### Task 4: Hero section

**Files:**
- Create: `src/components/home/Hero.tsx`
- Create: `src/components/home/Hero.test.tsx`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: `export default function Hero(): JSX.Element`. Consumed by Task 7 (`Home` page).

- [ ] **Step 1: Write the failing tests**

Create `src/components/home/Hero.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Hero from './Hero'

function renderHero() {
  return render(
    <MemoryRouter>
      <Hero />
    </MemoryRouter>
  )
}

describe('Hero', () => {
  it('renders the looping muted background video', () => {
    const { container } = renderHero()
    const video = container.querySelector('video')
    expect(video).not.toBeNull()
    expect(video).toHaveAttribute('src', '/video/hero-loop.mp4')
    expect(video?.autoplay).toBe(true)
    expect(video?.loop).toBe(true)
    expect(video?.muted).toBe(true)
  })

  it('renders the headline', () => {
    renderHero()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/steer/i)
  })

  it('renders primary and secondary CTA buttons linking to contact and solutions', () => {
    renderHero()
    expect(screen.getByRole('link', { name: 'Work With Us' })).toHaveAttribute('href', '/contact')
    expect(screen.getByRole('link', { name: 'Our Solutions' })).toHaveAttribute('href', '/solutions')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- Hero.test.tsx`
Expected: FAIL with "Cannot find module './Hero'".

- [ ] **Step 3: Implement Hero**

Create `src/components/home/Hero.tsx`:

```tsx
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/video/hero-loop.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-32">
        <h1 className="max-w-3xl font-serif text-5xl text-cream md:text-7xl">
          Steer by a fixed point
        </h1>
        <p className="mt-6 max-w-xl font-sans text-lg text-cream/80">
          A full-service marketing studio — strategy, creative, web, campaigns and performance.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to="/contact"
            className="bg-cream px-8 py-3.5 font-sans text-xs uppercase tracking-wider text-ink transition-colors hover:bg-cream-deep"
          >
            Work With Us
          </Link>
          <Link
            to="/solutions"
            className="border border-cream px-8 py-3.5 font-sans text-xs uppercase tracking-wider text-cream transition-colors hover:bg-cream/10"
          >
            Our Solutions
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- Hero.test.tsx`
Expected: PASS — all 3 tests green.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/Hero.tsx src/components/home/Hero.test.tsx
git commit -m "Add Home page Hero section with looping video background"
```

---

### Task 5: Services section

**Files:**
- Create: `src/components/home/ServicesSection.tsx`
- Create: `src/components/home/ServicesSection.test.tsx`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: `export default function ServicesSection(): JSX.Element` and `export const SERVICES: { name: string; description: string }[]`. Consumed by Task 7 (`Home` page).

- [ ] **Step 1: Write the failing tests**

Create `src/components/home/ServicesSection.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ServicesSection, { SERVICES } from './ServicesSection'

describe('ServicesSection', () => {
  it('renders the section label', () => {
    render(<ServicesSection />)
    expect(screen.getByText('What We Offer')).toBeInTheDocument()
  })

  it('exports exactly six services', () => {
    expect(SERVICES).toHaveLength(6)
  })

  it('renders every service as a heading with its description', () => {
    render(<ServicesSection />)
    SERVICES.forEach((service) => {
      expect(screen.getByRole('heading', { name: service.name })).toBeInTheDocument()
      expect(screen.getByText(service.description)).toBeInTheDocument()
    })
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- ServicesSection.test.tsx`
Expected: FAIL with "Cannot find module './ServicesSection'".

- [ ] **Step 3: Implement ServicesSection**

Create `src/components/home/ServicesSection.tsx`:

```tsx
interface Service {
  name: string
  description: string
}

export const SERVICES: Service[] = [
  {
    name: 'Strategy',
    description: 'Brand positioning and growth plans built on real market insight, not guesswork.',
  },
  {
    name: 'Paid Media',
    description: 'Performance campaigns across search and social that turn budget into pipeline.',
  },
  {
    name: 'Email & Automation',
    description: 'Lifecycle flows and campaigns that keep your audience engaged between purchases.',
  },
  {
    name: 'SEO & Content',
    description: 'Organic visibility and content that compounds, built for how South Africans search.',
  },
  {
    name: 'Design & Creative',
    description: 'Visual identity and campaign creative that make your brand impossible to ignore.',
  },
  {
    name: 'Analytics & Reporting',
    description: 'Clear, honest reporting so you always know what is working and what is not.',
  },
]

export default function ServicesSection() {
  return (
    <section className="bg-cream px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <span className="font-mono text-xs uppercase tracking-widest text-green">What We Offer</span>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <div key={service.name} className="border-t border-ink/10 pt-6">
              <h3 className="font-serif text-2xl text-ink">{service.name}</h3>
              <p className="mt-3 font-sans text-sm text-ink/70">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- ServicesSection.test.tsx`
Expected: PASS — all 3 tests green.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/ServicesSection.tsx src/components/home/ServicesSection.test.tsx
git commit -m "Add Home page Services section"
```

---

### Task 6: Contact section (Home)

**Files:**
- Create: `src/components/home/ContactSection.tsx`
- Create: `src/components/home/ContactSection.test.tsx`

**Interfaces:**
- Consumes: `ContactForm` from `../ContactForm` (Task 2) — `<ContactForm source="home" />`.
- Produces: `export default function ContactSection(): JSX.Element`. Consumed by Task 7 (`Home` page).

- [ ] **Step 1: Write the failing test**

Create `src/components/home/ContactSection.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ContactSection from './ContactSection'

describe('ContactSection', () => {
  it('renders the section heading and the shared contact form fields', () => {
    render(<ContactSection />)
    expect(screen.getByRole('heading', { name: 'Start the Conversation' })).toBeInTheDocument()
    expect(screen.getByLabelText('First Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- ContactSection.test.tsx`
Expected: FAIL with "Cannot find module './ContactSection'".

- [ ] **Step 3: Implement ContactSection**

Create `src/components/home/ContactSection.tsx`:

```tsx
import ContactForm from '../ContactForm'

export default function ContactSection() {
  return (
    <section className="bg-green px-6 py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-md">
          <span className="font-mono text-xs uppercase tracking-widest text-cream/70">Get In Touch</span>
          <h2 className="mt-4 font-serif text-4xl text-cream">Start the Conversation</h2>
          <p className="mt-4 font-sans text-cream/70">
            Tell us where your brand is headed — we&apos;ll tell you how to get there faster.
          </p>
        </div>
        <ContactForm source="home" />
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- ContactSection.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/ContactSection.tsx src/components/home/ContactSection.test.tsx
git commit -m "Add Home page Contact section using shared ContactForm"
```

---

### Task 7: Compose the Home page

**Files:**
- Modify: `src/pages/Home.tsx`
- Modify: `src/pages/pages.test.tsx`

**Interfaces:**
- Consumes: `Hero` (Task 4), `ServicesSection` (Task 5), `ContactSection` (Task 6).
- Produces: nothing consumed by later tasks.

**Context:** `Footer` already renders globally in `src/AppRoutes.tsx` for every route — `Home.tsx` must not render its own footer.

- [ ] **Step 1: Update the failing test**

In `src/pages/pages.test.tsx`, replace only the Home test case (leave every other test in the file untouched — `MemoryRouter` is already imported in this file for the `BlogPost` test):

```tsx
  it('Home renders the hero headline', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/steer/i)
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- pages.test.tsx`
Expected: FAIL — `Home` still renders the old placeholder `<h1>Home</h1>`, and rendering it without `MemoryRouter` would also throw once `Home` uses `Link`/section components internally.

- [ ] **Step 3: Compose Home from the new sections**

Replace the full contents of `src/pages/Home.tsx`:

```tsx
import SEOMeta from '../components/SEOMeta'
import Hero from '../components/home/Hero'
import ServicesSection from '../components/home/ServicesSection'
import ContactSection from '../components/home/ContactSection'

export default function Home() {
  return (
    <>
      <SEOMeta
        title="Alioth Marketing Solutions"
        description="South African marketing consultancy helping ambitious brands grow with data-driven strategy, paid media, and creative."
        path="/"
      />
      <Hero />
      <ServicesSection />
      <ContactSection />
    </>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- pages.test.tsx`
Expected: PASS — all page-shell tests green, including the updated Home case.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Home.tsx src/pages/pages.test.tsx
git commit -m "Compose Home page from Hero, Services, and Contact sections"
```

---

### Task 8: Wire ContactForm into the /contact page

**Files:**
- Modify: `src/pages/Contact.tsx`

**Interfaces:**
- Consumes: `ContactForm` from `../components/ContactForm` (Task 2) — `<ContactForm source="contact-page" />`.
- Produces: nothing consumed by later tasks.

**Context:** No changes to `src/pages/pages.test.tsx` are needed for this task — the Contact page keeps its existing `<h1>Contact</h1>` heading, so the existing `pages.test.tsx` Contact assertion (`getByRole('heading', { name: 'Contact' })`) still passes unmodified.

- [ ] **Step 1: Confirm the existing test still describes the target behavior**

Run: `npm run test -- pages.test.tsx`
Expected: PASS (current placeholder `Contact.tsx` already satisfies this test — this step is a sanity check before editing, not a red step).

- [ ] **Step 2: Implement the Contact page**

Replace the full contents of `src/pages/Contact.tsx`:

```tsx
import SEOMeta from '../components/SEOMeta'
import ContactForm from '../components/ContactForm'

export default function Contact() {
  return (
    <>
      <SEOMeta
        title="Contact"
        description="Get in touch with Alioth Marketing Solutions to talk about growing your business."
        path="/contact"
      />
      <section className="mx-auto max-w-3xl px-6 py-24">
        <h1 className="text-center font-serif text-4xl text-ink">Contact</h1>
        <div className="mt-12 flex justify-center">
          <ContactForm source="contact-page" />
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 3: Run tests to verify nothing broke**

Run: `npm run test -- pages.test.tsx`
Expected: PASS — same as Step 1, now backed by the real form.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Contact.tsx
git commit -m "Wire shared ContactForm into the /contact page"
```

---

### Final validation (after all 8 tasks)

- [ ] Run the full test suite: `npm run test` — expect all tests across the project to pass.
- [ ] Run the full build: `npm run build` — expect `tsc -b` to type-check cleanly and `vite build` to succeed.
- [ ] Run the linter: `npm run lint` — expect zero warnings/errors.
- [ ] Start the dev server (`npm run dev`) and visually check `/`, `/about`, `/solutions`, `/contact`, `/blog` in a browser: Coming Soon should NOT appear on localhost; Navbar pill/active-state, Hero video, Services grid, and both ContactForm instances should render and submit correctly.
