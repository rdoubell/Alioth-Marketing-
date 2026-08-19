# Alioth Website Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current single-file static `index.html` with a React + Vite + TypeScript + Tailwind project skeleton — routing, brand design tokens, placeholder Navbar/Footer, SEO/structured-data components, public assets, and a working contact-form serverless backend — that the Home page and secondary pages (built in follow-up plans) will slot into.

**Architecture:** Client-side routed single-page app (React Router) matching the existing `taygan` (1INC) project's stack and folder conventions (`src/components`, `src/pages`, `src/lib`, `public/`, `api/`). Page components are placeholder shells in this plan; their real content is out of scope here and covered by follow-up plans (Home sections, About/Solutions/Contact content, Blog).

**Tech Stack:** React 18, Vite 5, TypeScript 5, Tailwind CSS 3, React Router 7, Vitest + React Testing Library, Resend (transactional email), Vercel (hosting + serverless functions).

## Global Constraints

- Brand colors (from `Alioth Group/alioth/styles.css`): `--black: #0E0D0B`, `--ink: #15140F`, `--cream: #F1E9DA`, `--cream-deep: #E6DAC2`, `--cream-soft: #F7F2E8`, `--green: #1B3B2F`, `--green-bright: #27513F`, `--green-deep: #0F2A20`.
- Brand type: Cormorant Garamond (serif/display), Archivo (sans/body), Space Mono (mono/labels) — loaded via Google Fonts CDN, same URL as the current live site.
- Production URL is `https://www.aliothgroup.co.za` (confirmed live, Vercel project `alioth-marketing-`).
- Navbar links (confirmed in spec §12): About → `/about`, Solutions → `/solutions`, Blog → `/blog`, Contact button → `/contact` (no scroll-anchors).
- Contact email/phone are carried forward from the current live site's placeholder values (`hello@aliothgroup.co.za`, `+27 (0) 00 000 0000`) — real values are an explicit open item before launch (spec §8), not blocking this plan.
- No GA4 analytics in this phase (spec §11).

---

### Task 1: Scaffold the Vite + React + TypeScript project with a working test harness

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `.gitignore`
- Create: `src/test/setup.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`
- Modify: `index.html` (replace the current static site's entry with a Vite entry)
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces: `App` default export (React component) rendered into `#root` by `main.tsx`. Later tasks replace `App`'s body but keep this export name and the `#root` mount contract.

- [ ] **Step 1: Write the failing test**

Create `src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText('Alioth')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Create package.json**

```json
{
  "name": "alioth-marketing-website",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.15.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.2",
    "@testing-library/react": "^15.0.2",
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.1",
    "@typescript-eslint/eslint-plugin": "^7.2.0",
    "@typescript-eslint/parser": "^7.2.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "jsdom": "^24.0.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.2",
    "vitest": "^1.4.0"
  }
}
```

- [ ] **Step 3: Create vite.config.ts with Vitest configuration**

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
```

- [ ] **Step 4: Create src/test/setup.ts**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Create tsconfig.json, tsconfig.app.json, tsconfig.node.json**

`tsconfig.json`:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

`tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src"]
}
```

`tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 6: Create .gitignore**

```
node_modules
dist
.DS_Store
.env
.env.local
.vercel
.env*
```

- [ ] **Step 7: Replace index.html with the Vite entry point**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Alioth Marketing Solutions</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 8: Create src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-cream text-ink font-sans antialiased;
}
```

(The `@tailwind` directives will not resolve until Task 2 adds the Tailwind/PostCSS config — that's expected at this point.)

- [ ] **Step 9: Create src/App.tsx (minimal, to make the test pass)**

```tsx
export default function App() {
  return <h1>Alioth</h1>
}
```

- [ ] **Step 10: Create src/main.tsx**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- [ ] **Step 11: Install dependencies**

Run: `cd "/Users/rohandoubell/Desktop/Alioth Website" && npm install`
Expected: installs without error, creates `node_modules` and `package-lock.json`.

- [ ] **Step 12: Run the test to verify it passes**

Run: `npm test`
Expected: `App > renders without crashing` PASSES.

- [ ] **Step 13: Verify the dev server runs**

Run: `npm run dev` (then stop it with Ctrl+C once confirmed)
Expected: Vite starts and prints a `Local: http://localhost:5173/` URL with no errors.

- [ ] **Step 14: Commit**

```bash
git add package.json package-lock.json vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json .gitignore index.html src/
git commit -m "Scaffold Vite + React + TypeScript project with test harness"
```

---

### Task 2: Configure Tailwind with the Alioth brand design tokens

**Files:**
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Modify: `src/index.css` (add Google Fonts import)
- Test: `src/test/tailwind-config.test.ts`

**Interfaces:**
- Produces: Tailwind color keys `black`, `ink`, `cream`, `cream-deep`, `cream-soft`, `green`, `green-bright`, `green-deep`; font family keys `serif`, `sans`, `mono` — used by every component task from here on (e.g. `bg-cream`, `text-green`, `font-serif`).

- [ ] **Step 1: Write the failing test**

Create `src/test/tailwind-config.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import tailwindConfig from '../../tailwind.config.js'

describe('tailwind design tokens', () => {
  it('defines the Alioth brand color palette', () => {
    const colors = tailwindConfig.theme.extend.colors
    expect(colors.black).toBe('#0E0D0B')
    expect(colors.ink).toBe('#15140F')
    expect(colors.cream).toBe('#F1E9DA')
    expect(colors['cream-deep']).toBe('#E6DAC2')
    expect(colors['cream-soft']).toBe('#F7F2E8')
    expect(colors.green).toBe('#1B3B2F')
    expect(colors['green-bright']).toBe('#27513F')
    expect(colors['green-deep']).toBe('#0F2A20')
  })

  it('defines the Alioth brand type stack', () => {
    const fonts = tailwindConfig.theme.extend.fontFamily
    expect(fonts.serif[0]).toBe('"Cormorant Garamond"')
    expect(fonts.sans[0]).toBe('Archivo')
    expect(fonts.mono[0]).toBe('"Space Mono"')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tailwind-config`
Expected: FAIL — `tailwind.config.js` does not exist.

- [ ] **Step 3: Create tailwind.config.js**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#0E0D0B',
        ink: '#15140F',
        cream: '#F1E9DA',
        'cream-deep': '#E6DAC2',
        'cream-soft': '#F7F2E8',
        green: '#1B3B2F',
        'green-bright': '#27513F',
        'green-deep': '#0F2A20',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Archivo', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 4: Create postcss.config.js**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 5: Add the Google Fonts import to src/index.css**

Replace the file with:

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Archivo:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-cream text-ink font-sans antialiased;
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm test -- tailwind-config`
Expected: both tests PASS.

- [ ] **Step 7: Verify the dev server renders styled output**

Run: `npm run dev`, open `http://localhost:5173/` in a browser.
Expected: cream background (`#F1E9DA`), no Tailwind/PostCSS console errors. Stop the server after confirming.

- [ ] **Step 8: Commit**

```bash
git add tailwind.config.js postcss.config.js src/index.css src/test/tailwind-config.test.ts
git commit -m "Configure Tailwind with Alioth brand design tokens"
```

---

### Task 3: Brand constants (site URL, contact details, nav links)

**Files:**
- Create: `src/lib/brand.ts`
- Test: `src/lib/brand.test.ts`

**Interfaces:**
- Produces: `SITE_URL: string`, `SITE_NAME: string`, `CONTACT_EMAIL: string`, `CONTACT_PHONE: string`, `NAV_LINKS: NavLink[]` where `NavLink = { label: string; href: string }`. Consumed by `SEOMeta`, `SchemaOrg`, `Navbar`, `Footer` (Tasks 4–7).

- [ ] **Step 1: Write the failing test**

Create `src/lib/brand.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- brand`
Expected: FAIL — `src/lib/brand.ts` does not exist.

- [ ] **Step 3: Create src/lib/brand.ts**

```ts
export const SITE_URL = 'https://www.aliothgroup.co.za'
export const SITE_NAME = 'Alioth Marketing Solutions'
export const CONTACT_EMAIL = 'hello@aliothgroup.co.za'
export const CONTACT_PHONE = '+27 (0) 00 000 0000'

export interface NavLink {
  label: string
  href: string
}

export const NAV_LINKS: NavLink[] = [
  { label: 'About', href: '/about' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Blog', href: '/blog' },
]
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- brand`
Expected: all three tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/brand.ts src/lib/brand.test.ts
git commit -m "Add brand constants (site URL, contact details, nav links)"
```

---

### Task 4: SEOMeta component

**Files:**
- Create: `src/components/SEOMeta.tsx`
- Test: `src/components/SEOMeta.test.tsx`

**Interfaces:**
- Consumes: `SITE_URL`, `SITE_NAME` from `src/lib/brand.ts` (Task 3).
- Produces: `SEOMeta` default export, props `{ title: string; description: string; path?: string; ogImage?: string; ogType?: 'website' | 'article' }`. Renders nothing (`null`); side-effects `document.title` and `<head>` meta/link tags. Consumed by every page component from Task 9 onward.

- [ ] **Step 1: Write the failing test**

Create `src/components/SEOMeta.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SEOMeta from './SEOMeta'

describe('SEOMeta', () => {
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- SEOMeta`
Expected: FAIL — `src/components/SEOMeta.tsx` does not exist.

- [ ] **Step 3: Create src/components/SEOMeta.tsx**

```tsx
import { useEffect } from 'react'
import { SITE_URL, SITE_NAME } from '../lib/brand'

interface SEOMetaProps {
  title: string
  description: string
  path?: string
  ogImage?: string
  ogType?: 'website' | 'article'
}

const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.content = content
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

export default function SEOMeta({ title, description, path = '/', ogImage, ogType = 'website' }: SEOMetaProps) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  const url = `${SITE_URL}${path}`
  const image = ogImage ?? DEFAULT_OG_IMAGE

  useEffect(() => {
    document.title = fullTitle

    setMeta('description', description)
    setLink('canonical', url)

    setMeta('og:title', fullTitle, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:url', url, 'property')
    setMeta('og:type', ogType, 'property')
    setMeta('og:image', image, 'property')
    setMeta('og:site_name', SITE_NAME, 'property')

    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', fullTitle)
    setMeta('twitter:description', description)
    setMeta('twitter:image', image)
  }, [fullTitle, description, url, ogType, image])

  return null
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- SEOMeta`
Expected: all four tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/SEOMeta.tsx src/components/SEOMeta.test.tsx
git commit -m "Add SEOMeta component for per-page title/description/OG tags"
```

---

### Task 5: SchemaOrg component (Organization JSON-LD)

**Files:**
- Create: `src/components/SchemaOrg.tsx`
- Test: `src/components/SchemaOrg.test.tsx`

**Interfaces:**
- Consumes: `SITE_URL`, `SITE_NAME`, `CONTACT_EMAIL`, `CONTACT_PHONE` from `src/lib/brand.ts` (Task 3).
- Produces: `SchemaOrg` default export, no props. Rendered once in `AppRoutes` (Task 9).

- [ ] **Step 1: Write the failing test**

Create `src/components/SchemaOrg.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- SchemaOrg`
Expected: FAIL — `src/components/SchemaOrg.tsx` does not exist.

- [ ] **Step 3: Create src/components/SchemaOrg.tsx**

```tsx
import { SITE_URL, SITE_NAME, CONTACT_EMAIL, CONTACT_PHONE } from '../lib/brand'

export default function SchemaOrg() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.png`,
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Johannesburg',
      addressCountry: 'ZA',
    },
  }

  return <script type="application/ld+json">{JSON.stringify(schema)}</script>
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- SchemaOrg`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/SchemaOrg.tsx src/components/SchemaOrg.test.tsx
git commit -m "Add SchemaOrg component for Organization structured data"
```

---

### Task 6: Navbar placeholder component

**Files:**
- Create: `src/components/Navbar.tsx`
- Test: `src/components/Navbar.test.tsx`

**Interfaces:**
- Consumes: `NAV_LINKS`, `SITE_NAME` from `src/lib/brand.ts` (Task 3); `Link` from `react-router-dom`.
- Produces: `Navbar` default export, no props. Consumed by `AppRoutes` (Task 9).

- [ ] **Step 1: Write the failing test**

Create `src/components/Navbar.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Navbar from './Navbar'

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  )
}

describe('Navbar', () => {
  it('renders the logo linking to home', () => {
    renderNavbar()
    const logo = screen.getByRole('link', { name: 'Alioth Marketing Solutions' })
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

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- Navbar`
Expected: FAIL — `src/components/Navbar.tsx` does not exist.

- [ ] **Step 3: Create src/components/Navbar.tsx**

```tsx
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
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- Navbar`
Expected: all four tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Navbar.tsx src/components/Navbar.test.tsx
git commit -m "Add placeholder Navbar component"
```

---

### Task 7: Footer placeholder component

**Files:**
- Create: `src/components/Footer.tsx`
- Test: `src/components/Footer.test.tsx`

**Interfaces:**
- Consumes: `NAV_LINKS`, `SITE_NAME`, `CONTACT_EMAIL`, `CONTACT_PHONE` from `src/lib/brand.ts` (Task 3).
- Produces: `Footer` default export, no props. Consumed by `AppRoutes` (Task 9).

- [ ] **Step 1: Write the failing test**

Create `src/components/Footer.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Footer from './Footer'

describe('Footer', () => {
  it('renders the current year in the copyright line', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    const year = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(`© ${year}`))).toBeInTheDocument()
  })

  it('renders contact email and phone as clickable links', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: 'hello@aliothgroup.co.za' })).toHaveAttribute(
      'href',
      'mailto:hello@aliothgroup.co.za'
    )
    expect(screen.getByRole('link', { name: '+27 (0) 00 000 0000' })).toHaveAttribute(
      'href',
      'tel:+27(0)00000000'
    )
  })

  it('renders nav links including Contact', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- Footer`
Expected: FAIL — `src/components/Footer.tsx` does not exist.

- [ ] **Step 3: Create src/components/Footer.tsx**

```tsx
import { Link } from 'react-router-dom'
import { NAV_LINKS, SITE_NAME, CONTACT_EMAIL, CONTACT_PHONE } from '../lib/brand'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-black text-cream border-t border-cream/10 py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between gap-10">
        <div>
          <p className="font-serif text-lg mb-2">{SITE_NAME}</p>
          <p className="font-sans text-sm text-cream/60 max-w-xs">
            Johannesburg-based marketing consultancy helping South African businesses grow.
          </p>
        </div>

        <nav className="flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} to={link.href} className="font-sans text-sm text-cream/70 hover:text-cream">
              {link.label}
            </Link>
          ))}
          <Link to="/contact" className="font-sans text-sm text-cream/70 hover:text-cream">
            Contact
          </Link>
        </nav>

        <div className="font-sans text-sm text-cream/70 flex flex-col gap-2">
          <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-cream">
            {CONTACT_EMAIL}
          </a>
          <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} className="hover:text-cream">
            {CONTACT_PHONE}
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-cream/10 font-mono text-[10px] uppercase tracking-widest text-cream/40">
        © {year} {SITE_NAME}. All rights reserved.
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- Footer`
Expected: all three tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Footer.tsx src/components/Footer.test.tsx
git commit -m "Add placeholder Footer component"
```

---

### Task 8: Page shell components

**Files:**
- Create: `src/pages/Home.tsx`
- Create: `src/pages/About.tsx`
- Create: `src/pages/Solutions.tsx`
- Create: `src/pages/Contact.tsx`
- Create: `src/pages/Blog.tsx`
- Create: `src/pages/BlogPost.tsx`
- Test: `src/pages/pages.test.tsx`

**Interfaces:**
- Consumes: `SEOMeta` (Task 4).
- Produces: six default-exported page components, each rendering exactly one `<h1>` naming the page — real section content is added by follow-up plans (Home sections, About/Solutions/Contact content, Blog). Consumed by `AppRoutes` (Task 9).

- [ ] **Step 1: Write the failing test**

Create `src/pages/pages.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Home from './Home'
import About from './About'
import Solutions from './Solutions'
import Contact from './Contact'
import Blog from './Blog'
import BlogPost from './BlogPost'

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
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- pages`
Expected: FAIL — none of the page files exist yet.

- [ ] **Step 3: Create src/pages/Home.tsx**

```tsx
import SEOMeta from '../components/SEOMeta'

export default function Home() {
  return (
    <>
      <SEOMeta
        title="Alioth Marketing Solutions"
        description="South African marketing consultancy helping ambitious brands grow with data-driven strategy, paid media, and creative."
        path="/"
      />
      <h1 className="font-serif text-4xl px-6 py-24 text-center">Home</h1>
    </>
  )
}
```

- [ ] **Step 4: Create src/pages/About.tsx**

```tsx
import SEOMeta from '../components/SEOMeta'

export default function About() {
  return (
    <>
      <SEOMeta
        title="About"
        description="Alioth Marketing Solutions is a Johannesburg-based consultancy on a mission to grow South African businesses."
        path="/about"
      />
      <h1 className="font-serif text-4xl px-6 py-24 text-center">About</h1>
    </>
  )
}
```

- [ ] **Step 5: Create src/pages/Solutions.tsx**

```tsx
import SEOMeta from '../components/SEOMeta'

export default function Solutions() {
  return (
    <>
      <SEOMeta
        title="Solutions"
        description="Strategy, paid media, email automation, SEO, design, and analytics — everything Alioth Marketing Solutions offers."
        path="/solutions"
      />
      <h1 className="font-serif text-4xl px-6 py-24 text-center">Solutions</h1>
    </>
  )
}
```

- [ ] **Step 6: Create src/pages/Contact.tsx**

```tsx
import SEOMeta from '../components/SEOMeta'

export default function Contact() {
  return (
    <>
      <SEOMeta
        title="Contact"
        description="Get in touch with Alioth Marketing Solutions to talk about growing your business."
        path="/contact"
      />
      <h1 className="font-serif text-4xl px-6 py-24 text-center">Contact</h1>
    </>
  )
}
```

- [ ] **Step 7: Create src/pages/Blog.tsx**

```tsx
import SEOMeta from '../components/SEOMeta'

export default function Blog() {
  return (
    <>
      <SEOMeta
        title="Insights"
        description="Marketing insights and updates from Alioth Marketing Solutions."
        path="/blog"
      />
      <h1 className="font-serif text-4xl px-6 py-24 text-center">Insights</h1>
    </>
  )
}
```

- [ ] **Step 8: Create src/pages/BlogPost.tsx**

```tsx
import { useParams } from 'react-router-dom'
import SEOMeta from '../components/SEOMeta'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <>
      <SEOMeta
        title={slug ?? 'Post'}
        description="An Alioth Marketing Solutions insights post."
        path={`/blog/${slug ?? ''}`}
        ogType="article"
      />
      <h1 className="font-serif text-4xl px-6 py-24 text-center">Post: {slug}</h1>
    </>
  )
}
```

- [ ] **Step 9: Run the test to verify it passes**

Run: `npm test -- pages`
Expected: all six tests PASS.

- [ ] **Step 10: Commit**

```bash
git add src/pages/
git commit -m "Add placeholder page shells for Home, About, Solutions, Contact, Blog"
```

---

### Task 9: Routing — AppRoutes, App, main.tsx wiring

**Files:**
- Create: `src/AppRoutes.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx` (replaces the Task 1 smoke test with real routing coverage)
- Delete: none

**Interfaces:**
- Consumes: `Navbar` (Task 6), `Footer` (Task 7), `SchemaOrg` (Task 5), all six page components (Task 8).
- Produces: `AppRoutes` default export (no `BrowserRouter` wrapper, so it's testable with `MemoryRouter`); `App` default export wraps `AppRoutes` in `BrowserRouter` for real usage via `main.tsx`.

- [ ] **Step 1: Write the failing test**

Replace `src/App.test.tsx` with `src/AppRoutes.test.tsx`:

```bash
git rm src/App.test.tsx
```

Create `src/AppRoutes.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import AppRoutes from './AppRoutes'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>
  )
}

describe('AppRoutes', () => {
  it('renders Home at /', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument()
  })

  it('renders About at /about', () => {
    renderAt('/about')
    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument()
  })

  it('renders Solutions at /solutions', () => {
    renderAt('/solutions')
    expect(screen.getByRole('heading', { name: 'Solutions' })).toBeInTheDocument()
  })

  it('renders Contact at /contact', () => {
    renderAt('/contact')
    expect(screen.getByRole('heading', { name: 'Contact' })).toBeInTheDocument()
  })

  it('renders Insights at /blog', () => {
    renderAt('/blog')
    expect(screen.getByRole('heading', { name: 'Insights' })).toBeInTheDocument()
  })

  it('renders the post slug at /blog/:slug', () => {
    renderAt('/blog/hello-world')
    expect(screen.getByRole('heading', { name: 'Post: hello-world' })).toBeInTheDocument()
  })

  it('renders Navbar and Footer on every route', () => {
    renderAt('/about')
    expect(screen.getAllByRole('link', { name: 'Alioth Marketing Solutions' })[0]).toHaveAttribute('href', '/')
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- AppRoutes`
Expected: FAIL — `src/AppRoutes.tsx` does not exist.

- [ ] **Step 3: Create src/AppRoutes.tsx**

```tsx
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SchemaOrg from './components/SchemaOrg'
import Home from './pages/Home'
import About from './pages/About'
import Solutions from './pages/Solutions'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'

export default function AppRoutes() {
  return (
    <>
      <SchemaOrg />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
      <Footer />
    </>
  )
}
```

- [ ] **Step 4: Update src/App.tsx**

```tsx
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- AppRoutes`
Expected: all seven tests PASS.

- [ ] **Step 6: Run the full test suite**

Run: `npm test`
Expected: every test file passes, no leftover references to the deleted `App.test.tsx`.

- [ ] **Step 7: Verify all routes work in the browser**

Run: `npm run dev`, then visit `http://localhost:5173/`, `/about`, `/solutions`, `/contact`, `/blog`, `/blog/hello-world`.
Expected: each shows its placeholder heading with the Navbar and Footer present; browser back/forward buttons work; page `<title>` in the browser tab changes per route. Stop the server after confirming.

- [ ] **Step 8: Commit**

```bash
git add src/AppRoutes.tsx src/App.tsx src/AppRoutes.test.tsx
git commit -m "Wire up React Router with Navbar/Footer/SchemaOrg on every route"
```

---

### Task 10: Public assets — favicon, OG image, robots.txt, sitemap.xml

**Files:**
- Create: `public/favicon.png`
- Create: `public/apple-touch-icon.png`
- Create: `public/og-image.png`
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`

**Interfaces:**
- Consumes: `Alioth Group/alioth/assets/A-black.png` and `Alioth Group/alioth/assets/mark-render-dark.png` as source images.
- Produces: files at the paths above, referenced by `index.html` (`/favicon.png`, already wired in Task 1) and `SEOMeta`'s `DEFAULT_OG_IMAGE` (`/og-image.png`, already wired in Task 4).

- [ ] **Step 1: Generate the favicon from the brand mark**

Run (from the repo root):

```bash
sips -c 952 952 "Alioth Group/alioth/assets/A-black.png" --out /tmp/alioth-favicon-square.png
sips -Z 512 /tmp/alioth-favicon-square.png --out public/favicon.png
sips -Z 180 /tmp/alioth-favicon-square.png --out public/apple-touch-icon.png
```

Expected: no errors; `public/favicon.png` and `public/apple-touch-icon.png` created.

- [ ] **Step 2: Verify favicon dimensions**

Run: `file public/favicon.png public/apple-touch-icon.png`
Expected: `favicon.png` reports `512 x 512`, `apple-touch-icon.png` reports `180 x 180`.

- [ ] **Step 3: Generate the OG image from the expressive brand render**

Run:

```bash
sips -Z 1200 "Alioth Group/alioth/assets/mark-render-dark.png" --out /tmp/alioth-og-wide.png
sips -c 630 1200 /tmp/alioth-og-wide.png --out public/og-image.png
```

Expected: no errors; `public/og-image.png` created.

- [ ] **Step 4: Verify OG image dimensions**

Run: `file public/og-image.png`
Expected: reports `1200 x 630`.

- [ ] **Step 5: Create public/robots.txt**

```
User-agent: *
Allow: /

Sitemap: https://www.aliothgroup.co.za/sitemap.xml
```

- [ ] **Step 6: Create public/sitemap.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.aliothgroup.co.za/</loc></url>
  <url><loc>https://www.aliothgroup.co.za/about</loc></url>
  <url><loc>https://www.aliothgroup.co.za/solutions</loc></url>
  <url><loc>https://www.aliothgroup.co.za/contact</loc></url>
  <url><loc>https://www.aliothgroup.co.za/blog</loc></url>
</urlset>
```

- [ ] **Step 7: Verify the favicon shows up in the browser**

Run: `npm run dev`, open `http://localhost:5173/` and check the browser tab icon.
Expected: the Alioth "A" mark appears as the tab favicon (may require a hard refresh). Stop the server after confirming.

- [ ] **Step 8: Commit**

```bash
git add public/favicon.png public/apple-touch-icon.png public/og-image.png public/robots.txt public/sitemap.xml
git commit -m "Add favicon, OG image, robots.txt, and sitemap.xml"
```

---

### Task 11: Vercel SPA routing config

**Files:**
- Create: `vercel.json`

**Interfaces:**
- None — deploy-time configuration only, consumed by Vercel's build system.

- [ ] **Step 1: Create vercel.json**

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures deep-linked routes (e.g. a visitor loading `aliothgroup.co.za/about` directly, not via client-side navigation) get served `index.html` so React Router can take over, while `/api/*` requests still reach the serverless functions in Task 12.

- [ ] **Step 2: Verify it's valid JSON**

Run: `node -e "JSON.parse(require('fs').readFileSync('vercel.json', 'utf8')); console.log('valid')"`
Expected: prints `valid`.

- [ ] **Step 3: Verify the production build still succeeds**

Run: `npm run build`
Expected: completes with no errors, produces a `dist/` folder.

- [ ] **Step 4: Commit**

```bash
git add vercel.json
git commit -m "Add Vercel SPA rewrite rules for client-side routing"
```

---

### Task 12: Contact form serverless function (Resend)

**Files:**
- Create: `api/contact.ts`
- Test: `api/contact.test.ts`
- Modify: `package.json` (add `resend` dependency)

**Interfaces:**
- Produces: `validateContactPayload(body: Partial<ContactPayload>): string | null` (pure function, exported for direct testing) and a default-exported `handler(request: Request): Promise<Response>` matching Vercel's Edge Function signature. Consumed by the Home Contact teaser form and the `/contact` page form in follow-up plans — both POST JSON matching `ContactPayload` to `/api/contact`.

- [ ] **Step 1: Add the resend dependency**

Run: `npm install resend`
Expected: adds `resend` to `package.json` `dependencies` and installs successfully.

- [ ] **Step 2: Write the failing tests**

Create `api/contact.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import handler, { validateContactPayload } from './contact'

const sendMock = vi.fn()

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: sendMock },
  })),
}))

function makeRequest(body: unknown, method = 'POST') {
  return new Request('https://www.aliothgroup.co.za/api/contact', {
    method,
    body: JSON.stringify(body),
  })
}

describe('validateContactPayload', () => {
  it('requires firstName', () => {
    expect(
      validateContactPayload({ lastName: 'Doe', email: 'a@b.com', message: 'hi', source: 'home' })
    ).toBe('firstName is required')
  })

  it('requires lastName', () => {
    expect(
      validateContactPayload({ firstName: 'A', email: 'a@b.com', message: 'hi', source: 'home' })
    ).toBe('lastName is required')
  })

  it('requires a valid email', () => {
    expect(
      validateContactPayload({ firstName: 'A', lastName: 'B', email: 'not-an-email', message: 'hi', source: 'home' })
    ).toBe('a valid email is required')
  })

  it('requires a message', () => {
    expect(
      validateContactPayload({ firstName: 'A', lastName: 'B', email: 'a@b.com', message: '', source: 'home' })
    ).toBe('message is required')
  })

  it('requires source to be home or contact-page', () => {
    expect(
      validateContactPayload({
        firstName: 'A',
        lastName: 'B',
        email: 'a@b.com',
        message: 'hi',
        // @ts-expect-error testing invalid input
        source: 'nowhere',
      })
    ).toBe('source must be "home" or "contact-page"')
  })

  it('returns null for a fully valid payload', () => {
    expect(
      validateContactPayload({ firstName: 'A', lastName: 'B', email: 'a@b.com', message: 'hi', source: 'home' })
    ).toBeNull()
  })
})

describe('contact handler', () => {
  beforeEach(() => {
    sendMock.mockReset()
    process.env.RESEND_API_KEY = 'test-key'
  })

  it('rejects non-POST requests with 405', async () => {
    const res = await handler(makeRequest({}, 'GET'))
    expect(res.status).toBe(405)
  })

  it('rejects an invalid payload with 400', async () => {
    const res = await handler(makeRequest({ firstName: 'A' }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('lastName is required')
  })

  it('sends an email and returns 200 for a valid payload', async () => {
    sendMock.mockResolvedValueOnce({ data: { id: '123' }, error: null })

    const res = await handler(
      makeRequest({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        message: 'Need help with paid media.',
        source: 'home',
      })
    )

    expect(res.status).toBe(200)
    expect(sendMock).toHaveBeenCalledOnce()
    expect(sendMock.mock.calls[0][0]).toMatchObject({
      to: 'hello@aliothgroup.co.za',
      replyTo: 'jane@example.com',
    })
  })

  it('returns 500 if Resend fails to send', async () => {
    sendMock.mockRejectedValueOnce(new Error('network error'))

    const res = await handler(
      makeRequest({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        message: 'Need help.',
        source: 'contact-page',
      })
    )

    expect(res.status).toBe(500)
  })
})
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npm test -- contact`
Expected: FAIL — `api/contact.ts` does not exist.

- [ ] **Step 4: Create api/contact.ts**

```ts
import { Resend } from 'resend'

export const config = { runtime: 'edge' }

interface ContactPayload {
  firstName: string
  lastName: string
  email: string
  message: string
  source: 'home' | 'contact-page'
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContactPayload(body: Partial<ContactPayload>): string | null {
  if (!body.firstName?.trim()) return 'firstName is required'
  if (!body.lastName?.trim()) return 'lastName is required'
  if (!body.email?.trim() || !EMAIL_RE.test(body.email)) return 'a valid email is required'
  if (!body.message?.trim()) return 'message is required'
  if (body.source !== 'home' && body.source !== 'contact-page') {
    return 'source must be "home" or "contact-page"'
  }
  return null
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  const body = (await request.json()) as Partial<ContactPayload>
  const validationError = validateContactPayload(body)
  if (validationError) {
    return new Response(JSON.stringify({ error: validationError }), { status: 400 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    await resend.emails.send({
      from: 'Alioth Website <noreply@aliothgroup.co.za>',
      to: 'hello@aliothgroup.co.za',
      replyTo: body.email,
      subject: `New enquiry from ${body.firstName} ${body.lastName} (${body.source})`,
      text: `From: ${body.firstName} ${body.lastName} <${body.email}>\nSource: ${body.source}\n\n${body.message}`,
    })
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to send message' }), { status: 500 })
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test -- contact`
Expected: all 11 tests PASS.

- [ ] **Step 6: Run the full test suite**

Run: `npm test`
Expected: every test file across the project passes.

- [ ] **Step 7: Commit**

```bash
git add api/contact.ts api/contact.test.ts package.json package-lock.json
git commit -m "Add contact form serverless function with Resend"
```

---

### Task 13: Environment variable documentation

**Files:**
- Create: `.env.local.example`

**Interfaces:**
- None — documents the `RESEND_API_KEY` environment variable consumed by `api/contact.ts` (Task 12).

- [ ] **Step 1: Create .env.local.example**

```
RESEND_API_KEY=
```

- [ ] **Step 2: Create your actual .env.local (not committed — .gitignore already excludes it)**

Sign up at resend.com (free tier), create an API key, then run:

```bash
echo "RESEND_API_KEY=your-actual-key-here" > .env.local
```

- [ ] **Step 3: Add the same variable to Vercel**

In the Vercel dashboard, open the `alioth-marketing-` project → **Settings → Environment Variables** → add `RESEND_API_KEY` with the same value, scoped to Production (and Preview if you want form testing on preview deploys).

- [ ] **Step 4: Commit the example file**

```bash
git add .env.local.example
git commit -m "Document RESEND_API_KEY environment variable"
```

---

### Task 14: Final integration check

**Files:** none (verification only)

- [ ] **Step 1: Clean install**

Run: `rm -rf node_modules && npm install`
Expected: installs cleanly with no errors.

- [ ] **Step 2: Run the full test suite**

Run: `npm test`
Expected: every test file passes (App routing, Navbar, Footer, SEOMeta, SchemaOrg, brand constants, tailwind config, page shells, contact handler).

- [ ] **Step 3: Run the production build**

Run: `npm run build`
Expected: completes with no TypeScript or build errors, produces `dist/index.html` and bundled assets.

- [ ] **Step 4: Manually verify the dev server**

Run: `npm run dev`, visit every route (`/`, `/about`, `/solutions`, `/contact`, `/blog`, `/blog/test-post`) in a browser.
Expected: each renders its placeholder heading, Navbar and Footer appear on all of them, mobile menu toggles correctly at a narrow viewport, favicon shows in the tab. Stop the server after confirming.

- [ ] **Step 5: Push and confirm the Vercel deployment**

```bash
git push origin main
```

Then check the `alioth-marketing-` project's Deployments tab in the Vercel dashboard for a successful build, and visit `https://www.aliothgroup.co.za/about` directly (not via in-app navigation) to confirm the `vercel.json` rewrite serves the SPA correctly for a deep link.
