# Alioth Marketing Website Redesign — Design Spec

Date: 2026-08-19
Repo: `rdoubell/Alioth-Marketing-` (local: `~/Desktop/Alioth Website`)
Live: aliothgroup.co.za / www.aliothgroup.co.za (Vercel project `alioth-marketing-`)

## 1. Goal

Replace the current single-file static `index.html` with a clean, short, concise
multi-page site inspired by revx.ai's structural language (floating navbar, bold
display type, minimal button pair, generous whitespace, labeled sections), built
on Alioth's existing brand system.

## 2. Architecture

**Stack:** React + Vite + TypeScript + Tailwind CSS — matching the existing 1INC
Consulting project (`taygan`) pattern: `src/pages`, `src/sections`,
`src/components`, `public/`, `api/` (Vercel serverless functions), `vercel.json`.

**Why not stay static HTML:** the nav requires real distinct pages (About,
Solutions, Blog/Insights) with their own URLs, and a future blog needs per-post
routing. A framework gives shared navbar/footer components, a reusable SEO
component, and room to grow — all present in the 1INC project already.

## 3. Routes

| Route | Purpose |
|---|---|
| `/` | Home — single continuous scroll (see §4) |
| `/about` | Full About page |
| `/solutions` | Full Solutions page, more detail than the Home teaser |
| `/contact` | Full Contact page, more detail than the Home teaser |
| `/blog` | Insights-style post listing |
| `/blog/:slug` | Individual post template |

**Navbar link targets:** About, Solutions, Blog, and the Contact button all
link to their dedicated pages above — not anchor-scroll on Home — mirroring
revx.ai's pattern, even though About/Solutions/Contact each also have teaser
content living organically on the Home page itself.

## 4. Home page (`/`) — section order

1. **Hero**
2. **Intro** — page-breaker, ~1/3 viewport height. Focused on Alioth being
   Johannesburg-based and the mission to grow South African businesses (and
   beyond). Exact copy/layout TBD when we design this section.
3. **Services** — teaser/summary of what's on `/solutions`
4. **Clients showcase** — card grid (not a bare logo marquee): logo + client
   name + one-line outcome per card, 2–3 per row desktop / 1 mobile. Draft
   placeholder cards now (current site's fake case-study lines are a
   reasonable starting point), swap for real client logos/results later.
5. **Contact teaser** — page-breaker, ~1/3 viewport height. Inline compact
   form (not a modal): First Name, Last Name, Email, "How can we help you?"
   (textarea). Submits via the shared form backend (§6).
6. **Footer**

## 5. Navbar & Footer

- **Navbar:** logo (left) · About / Solutions / Blog (nav links) · Contact Us
  button (right, filled). Visual design pending from user — build a
  placeholder now (sticky, using brand tokens) and swap once provided.
- **Footer:** not explicitly specified yet by user; build a standard pattern
  (nav recap, contact details, social icons, copyright, legal links) using
  brand tokens as a placeholder, swap once the footer design is provided.

Hero and button visual treatments are likewise placeholder-now,
swapped-later — see §9.

## 6. Forms & backend

Both the Home Contact teaser and the `/contact` page form submit through a
**Vercel serverless function using Resend** to deliver submissions by email.
Requires a Resend account + API key stored as a Vercel environment variable
(`RESEND_API_KEY`). No third-party form service, no mailto fallback.

Endpoint: `api/contact.ts` (edge or node function, TBD at implementation
time), shared by both forms with a `source` field distinguishing which form
submitted.

## 7. Design tokens (from `Alioth Group/alioth/styles.css` + Brand Guidelines)

```
--black: #0E0D0B
--ink: #15140F
--cream: #F1E9DA
--cream-deep: #E6DAC2
--cream-soft: #F7F2E8
--green: #1B3B2F        (Deep Forest)
--green-bright: #27513F
--green-deep: #0F2A20

--serif: 'Cormorant Garamond', Georgia, serif   (display/primary)
--sans:  'Archivo', system-ui, sans-serif        (body/secondary)
--mono:  'Space Mono', ui-monospace, monospace   (labels)
```

Logo assets already exist: `A-black.png`, `A-cream.png` (and expressive
render) in `Alioth Group/alioth/assets`. Full construction/clearspace/lockup
rules are documented in `Alioth Brand Guidelines.html` — use as the source of
truth for logo usage across navbar, footer, and favicon.

These tokens are locked in — no need to wait on anything further for
color/type/logo.

## 8. Content strategy

- **Services:** draft placeholder descriptions now (current site's 6 services
  as a starting point), swappable later.
- **Clients:** draft placeholder cards now, swap in real logos/results later.
- **About / Solutions / Contact page content:** designed when we build each
  respective page — not blocking the initial scaffold.
- **Blog:** structure and routing only at launch — zero or one placeholder
  post. No seed content required.
- **Contact info:** current site has placeholder phone/email
  (`+27 (0) 00 000 0000`, `hello@alioth.co.za`) — needs real values before
  launch.

## 9. Sequencing

Scaffold the full project now (routing, pages, sections, forms, design
tokens) using **placeholder navbar, hero, footer, and button treatments**
built from the brand tokens + revx-inspired structure. Swap in the user's
real navbar/hero/footer/button designs as a follow-up pass once provided —
this is not a blocking dependency for starting the build.

## 10. Technical infrastructure ("what the site needs to operate")

Modeled directly on the 1INC (`taygan`) project:

- **`public/`**: favicon (derived from the Alioth "A" mark), OG/social share
  image, `robots.txt`, `sitemap.xml`.
- **`SEOMeta` component**: reusable per-page title/description/canonical/OG/
  Twitter tag setter (same pattern as `taygan/src/components/SEOMeta.tsx`).
- **`SchemaOrg` component**: JSON-LD structured data (at minimum
  Organization schema), same pattern as 1INC.
- **`vercel.json`**: SPA rewrites for client-side routing + `/api/*` passthrough
  for the serverless function.
- **`api/contact.ts`**: serverless function handling both forms via Resend.

## 11. Explicitly out of scope for this phase

- GA4 analytics — deferred, add later once live and stable.
- Blog seed content — structure only.
- Individual Solutions sub-pages per service (like revx's Lead
  Generation/Paid Media/etc. sub-pages) — one `/solutions` page only, unless
  requested later.
- Privacy Policy / legal page — not yet discussed; revx has one, current
  Alioth site doesn't. **Open question for the user before launch**, not
  blocking the build.

## 12. Explicit assumptions to flag back to the user

- Navbar/Contact button links to `/contact` page rather than scrolling to the
  Home teaser — confirm or correct.
- Solutions gets exactly one deeper page, not per-service sub-pages.
- Footer content/structure is a placeholder guess pending the user's actual
  footer design.
