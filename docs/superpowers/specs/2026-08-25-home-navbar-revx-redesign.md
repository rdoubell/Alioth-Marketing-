# Home Page & Navbar Redesign — revx.ai-Inspired

Date: 2026-08-25
Amends: `docs/superpowers/specs/2026-08-19-alioth-website-redesign-design.md` §4 (Home page
section order) and §5 (Navbar). All other sections of that spec (design tokens, routing,
forms backend, technical infrastructure) are unchanged and still apply.

## 1. Goal

Restructure the Home page and design a real Navbar, using revx.ai's actual site structure
as a direct template — same section rhythm, same page-to-page pattern — reskinned with
Alioth's own brand tokens (colors, type) rather than revx's.

## 2. Reference site analysis (revx.ai, full site)

Extracted directly from the live site (2026-08-25):

**Home** (`/`) — 3 sections + footer, no separate Clients or Intro section:
1. Hero — display headline with a typed/highlighted word, subhead, two buttons
   (filled + outline)
2. "What We Offer" — 6 service cards (label + eyebrow-style category not used;
   just name + one-sentence description per card)
3. "Start the Conversation" — full contact form (First Name, Last Name, Email,
   message textarea, Send button) — same form as their standalone `/contact` page
4. Footer

**About** — headline → mission paragraph → stats row (4 big numbers) → team
blurb → narrative paragraph → closing CTA.

**Solutions** — heading → 8 repeating blocks (short italic tagline + service
name in caps + paragraph) → closing CTA.

**Contact** — minimal: heading + the identical contact form used on Home.

## 3. Updated Home page (`/`) section order

Supersedes the original spec's §4. New order:

1. **Hero** — full-bleed background video (the boomerang-looped drone valley
   footage already built at `public/video/hero-loop.mp4`, 48s seamless loop),
   headline + subhead + two buttons over it, in Alioth's serif/sans type and
   cream/green palette (not revx's orange/white).
2. **Services** — 6 service cards, matching revx's "What We Offer" card
   pattern (name + one-sentence description, no icons required — revx doesn't
   use icons here either). Content: draft placeholders from the current
   site's 6 services (Strategy, Paid Media, Email & Automation, SEO &
   Content, Design & Creative, Analytics & Reporting), per the original
   spec's content-readiness decision.
3. **Contact** — the full contact form component (see §4 below), not a
   lighter teaser.
4. **Footer**

Dropped from Home: the Intro block and the Clients showcase (see §5, §6).

## 4. Contact form — single shared component

One `ContactForm` component (First Name, Last Name, Email, "How can we help
you?" textarea, Send button) is used in both places:
- Inline on the Home page's Contact section
- On the standalone `/contact` page

Both submit to the same `/api/contact` backend already built (Task 12 of the
Foundation plan), using the existing `source: 'home' | 'contact-page'` field
to distinguish which page it was submitted from.

## 5. Intro copy — relocated

The "Johannesburg-based, mission to grow South African businesses" copy
(originally planned as a Home page Intro section) moves into the About page's
mission section instead, matching revx's About page having a dedicated
mission paragraph. No separate Intro section exists on Home anymore.

## 6. Clients showcase — dropped for now

No clients/logos section is being built on any page currently in scope.
revx.ai has no equivalent section anywhere on their site. Revisit once real
client logos/results exist — could become its own section on Solutions, or a
dedicated page, decided later.

## 7. Navbar — new design

Replaces the Foundation plan's placeholder Navbar entirely. Layout, left to
right across the full width:

- **Left**: "Contact Us" button
- **Center**: a pill-shaped navigation bar containing the nav links (About,
  Solutions, Blog — same three as `NAV_LINKS` in `src/lib/brand.ts`,
  unchanged), laid out horizontally inside the pill
- **Right**: the Alioth logo

**Pill styling**: background is the primary brand green, `--green` /
`#1B3B2F` (Deep Forest). Nav link text in cream. When a nav link corresponds
to the currently active route (not just on hover), a smaller white pill
appears behind/around that link inside the green pill — a route-aware active
indicator, not a hover-only effect. Determined via React Router's location,
comparing the current pathname against each link's `href`.

**Mobile**: no mobile-specific direction was given. Default to collapsing to
a standard hamburger-triggered menu below a reasonable breakpoint (matching
the Foundation plan's existing placeholder Navbar's mobile pattern), since a
three-part full-width layout (button + pill + logo) won't fit on narrow
screens. Revisit if the client wants a different mobile treatment once they
see it.

## 8. Footer

Still pending a design from the user, per the original spec. The current
Foundation-phase placeholder Footer stays as-is for now — not part of this
pass.

## 9. Explicit assumptions to confirm

- Nav pill contains exactly the existing 3 `NAV_LINKS` (About, Solutions,
  Blog) — no separate "Home" link added, since the logo (linking to `/`)
  already serves that purpose.
- Hero background video is the already-built `public/video/hero-loop.mp4` —
  no new footage/generation needed for this pass.
- Services section content is placeholder (6 services from the current
  live-site copy), swappable later — consistent with the original spec's
  content-readiness decision, not a new decision here.
