# Alioth Website — Launch Checklist

Last updated: 2026-08-25 (site is live; added a comprehensive per-page design suggestion list below, grounded in current 2026 trend research)

## Content still needed

- [ ] **About page** — currently a placeholder (`<h1>About</h1>` only). Spec calls for headline → mission paragraph → stats row → team blurb → narrative → closing CTA. **Now live on the public site as-is.**
- [ ] **Solutions page** — currently a placeholder. Spec calls for 8 repeating service blocks + closing CTA. **Now live on the public site as-is.**
- [ ] **Blog** — structure/routing only exists (`/blog`, `/blog/:slug`), zero real posts.
- [ ] **Footer design** — still the Foundation-phase placeholder. No real design has been provided yet.
- [ ] **404 page** — currently a bare placeholder, not brand-styled.
- [ ] **Real contact phone number** — `CONTACT_PHONE` in `src/lib/brand.ts` is still `+27 (0) 00 000 0000`.
- [ ] **Privacy Policy / legal page** — open question flagged in the original spec, never resolved. revx.ai (the structural reference) has one; decide if Alioth needs one.

## Pre-launch technical

- [ ] **Verify `RESEND_API_KEY`** is actually set as a Vercel environment variable (needed for the contact form to send email in production — not something I can check from the repo alone).
- [ ] **GA4 / analytics** — explicitly deferred in the original spec, not yet added.
- [x] ~~Decide when to lift the maintenance gate~~ — done. Gate removed entirely (`ComingSoon` component deleted); site is live to real visitors as of commit `3a187fe`, pushed to `origin/main`.

## In progress

- [ ] **Splash screen on first load** — logo on cream, ~1s hold, once per browser session. **Design approved via mockup** — not yet built. (The transparent/scroll-aware Navbar half of this design is now done, see below.)

## Already done this session

- [x] Home page rebuild (Hero, Services, Contact) + Navbar redesign, reviewed and merged
- [x] Hero video compressed 18.7MB → 3.7MB + poster frame added
- [x] Hero headline legibility fix (bold weight + drop-shadow), Services section headline sized up, Navbar logo/Contact Us swapped (your direct requests, not from the taste-skill list)
- [x] Hero entrance animation (headline/subhead/buttons fade-up on load, staggered) + rounded pill CTA buttons with hover-lift/press micro-interaction
- [x] Hero split into 3/4 video + 1/4 cream "What We Offer" teaser band (both fully visible on first load, no scroll needed) — moved the label out of ServicesSection to avoid repeating it
- [x] Maintenance gate removed entirely — site is live
- [x] Hero headline replaced ("From where you are to where you should be." / "Guiding your business, growing your revenue."), no more "steer" language
- [x] Playfair Display Black added for hero-scale headlines only (Cormorant Garamond's ceiling is 700); "What We Offer" moved to Cormorant Garamond now that it's heading-scale
- [x] Site-wide scroll-triggered entrance animations (`useScrollReveal` hook) — Services headline + staggered cards, Contact intro + form
- [x] Navbar: Logo C2 (later switched from C3), "Home" added to nav pill, Contact Us made circular, hover-lift matched across pill nav + Contact Us
- [x] Hero: forest-green gradient wash at the bottom of the video (later deepened), large semi-transparent watermark "A" mark bottom-right (later enlarged)
- [x] Hero subhead: sized up, "growing your ___" now bold with a typewriter word-rotation (revenue/presence/reach/audience/brand) matching revx.ai's pattern
- [x] Micro-interactions matched everywhere (service cards, Contact submit button) + skip-to-content link added
- [x] Navbar transparent-over-hero + scroll hide/reveal built (Home only), animated hamburger↔X, sliding active-link pill
- [x] Mobile Hero fixes: desktop logo lockup on mobile navbar, static poster frame instead of video (no play-button overlay), subhead second line breaks on mobile
- [x] Desktop Navbar transparent-over-hero reverted to the solid cream bar per your feedback — mobile keeps the transparent treatment, desktop is always solid/sticky now
- [x] What We Offer / Services section rebuilt entirely as a GSAP scroll-stacking sequence (see Services section notes below) — new `gsap` dependency added
- [x] All commits pushed to GitHub (`origin/main` at `2ed8d38`)

---

## Design suggestions — per page, per section

Combines the taste-skill audit with current (2026) web design trend research — SaaS/agency landing pages, bento grids, motion design, and About-page patterns specifically. None of this is implemented unless marked done above; it's a menu to work through, not a mandate. Sourced from live research, not just training data — see links at the bottom of this section.

**On "vibe coding":** in current usage this mostly means AI-generated sites built by describing a mood rather than deliberately specifying details — and the well-known critique of that approach is that it converges on generic, "safely average" output. That's exactly what the taste-skill audit exists to counter. So the aim below isn't "chase whatever's viral" — it's applying specific, considered patterns deliberately, the same way a human designer would.

### Global / cross-cutting

- [x] **Font boldness ceiling** — resolved via option (b): Playfair Display Black added as a `font-display` token, reserved for the Hero headline only, layered alongside (not replacing) Cormorant Garamond.
- [x] **Scroll-triggered entrance animation, site-wide.** Done — `useScrollReveal` hook applied to Services (headline + staggered cards) and Contact (intro + form). Hero keeps its load-in animation since it's always in view on first paint.
- [x] **Consistent micro-interactions.** Done — Navbar links/Contact Us, service cards, and the Contact form's submit button all share the same hover-lift + press-down as the Hero buttons now.
- [x] **Color ratio is already on-trend** — reviewed, no change needed, per the note below.
- [x] **Skip-to-content link** — added, first tab-stop on every page, points at a new `<main id="main-content">` landmark.

### Navbar

- [x] **Transparent-over-hero + scroll hide/reveal** — mobile only, on Home. Desktop was tried transparent too but reverted per your feedback — desktop (md+) now always shows the solid cream bar, sticky, never hidden on scroll, on every page including Home. Found and fixed a real bug along the way: the mobile dropdown used the same 90%-opacity background as the resting scrolled state, which let the Hero text ghost through — opening the menu now forces full opacity.
- [x] Hover-lift micro-interaction on nav links and Contact Us button — done (earlier pass).
- [x] **Animated hamburger↔X icon** — done, replaces the old "Menu"/"Close" text toggle.
- [x] **Active-link pill now slides** between routes (measures the active link's position via refs, animates a shared capsule) instead of each link cross-fading its own background.

### Hero

- [x] Done tonight: rounded pill CTAs with hover-lift/press, staggered fade-up entrance for headline/subhead/buttons.
- Consider a subtle parallax on the video (scrolls slightly slower than the content above it) — flagged in current research as effective for video/image hero sections, but needs to stay subtle since it's a background video, not a static image.
- If the headline still reads as needing more presence after tonight's change, next lever is size, not weight (see Global note above).
- Further out: word-by-word or mask-wipe headline reveal instead of a flat fade — a fancier version of tonight's animation, worth trying only once the simple version feels right.

### Services section

- [x] **The single biggest structural opportunity on the page — resolved, replaced the uniform 3×2 grid entirely.** Rebuilt as a GSAP ScrollTrigger scroll-stacking sequence: "What We Offer" pins as a persistent backdrop for the entire 6-card scroll region (with a head-start spacer so it gets a moment alone before card 1 arrives), then each card slides up and pins in turn, scaling down slightly as the next arrives. A tracker bar under the heading fills in as each card is scrolled past. Backdrop is a forest-green vertical gradient (brand tokens, cream text/bar for contrast). Cards are large on desktop (up to 896px wide, anchored below the heading/bar so they don't overlap it) and genuinely full-screen on mobile, with large translucent-green numerals bleeding off the top-left corner. Ends with a "See More" button to /solutions (not a recap grid — that level of depth belongs on the Solutions page itself) before the Contact section. Eased scale animation, respects `prefers-reduced-motion`. Moved the "What We Offer" text out of Hero's bottom band into this backdrop, so it only appears once.
- [x] Scroll-triggered, staggered fade-up per card as the section enters view — superseded by the stacking-scroll rebuild above.
- [x] Card hover lift/shadow — superseded by the stacking-scroll rebuild above.
- [x] Small accent numeral (01–06, Space Mono) per card instead of a generic icon pack — done as part of the rebuild.

### Contact section (Home) + /contact page

- [x] **Rebuilt as a conversational, personalized 3-step form** — name → email → message, each its own mini-form (native validation + Enter-to-continue still work). Later steps and the success message address the person by their first name. Branded focus states (green underline instead of the browser default) — done.
- [x] Submit button now has the same hover-lift treatment as Hero/Services — done.
- [x] Success message now animates in (checkmark badge + personalized "Thanks, {name}" + a reply-time reassurance line) instead of an instant swap — done.

### Footer

- Still the unstyled Foundation-phase placeholder — no design provided yet. When it's designed: current research favors simpler footers (fewer link columns, clear primary paths) over a "link farm," which fits a small agency site well anyway.

### About page (not built yet)

- Structure per the original spec still holds up against current research: headline → mission → **stats/social-proof row** (even modest honest numbers — years operating, campaigns run, client count) → team section with **real photos** (2026 research explicitly flags moving away from stock/generic team imagery) → narrative → closing CTA.
- Consider a timeline treatment for the "how we got here" narrative rather than a plain paragraph block — a common pattern on agency About pages specifically.

### Solutions page (not built yet)

- 8 repeating service blocks per the original spec — apply the same bento-style thinking recommended for the Home Services section: larger tiles for flagship services (Strategy, Paid Media), smaller for supporting ones, rather than a uniform repeating list.
- Scroll-triggered reveal per block, consistent with the rest of the site.

### Blog (not built yet)

- When real posts exist: real, distinct dates per post (not identical timestamps) and real author bylines rather than one generic "Alioth Team" credit on everything.

**Research sources:**
- [Top Web Design Trends for 2026 | Figma](https://www.figma.com/resource-library/web-design-trends/)
- [CSS / JS Animation Trends 2026: Motion & Micro-Interactions](https://webpeak.org/blog/css-js-animation-trends)
- [How Micro-Interactions & Motion Design Improve UX in 2026](https://acodez.in/micro-interactions-motion-design/)
- [Web Design Trends 2026: Colors & Fonts That Convert](https://www.nopanicdesign.com/blog/web-design-trends-2026-colors-fonts/)
- [8 website color trends that'll be everywhere in 2026 — Wix](https://www.wix.com/blog/website-color-trends)
- [10 SaaS Landing Page Trends for 2026 — SaaSFrame](https://www.saasframe.io/blog/10-saas-landing-page-trends-for-2026-with-real-examples)
- [Designing Bento Grids That Actually Work: A 2026 Practical Guide](https://www.saasframe.io/blog/designing-bento-grids-that-actually-work-a-2026-practical-guide)
- [6 Modern Trends for "About Us" Pages](https://www.brilliantdirectories.com/blog/6-modern-trends-for-about-us-pages)
- [The "Vibe Coding" Crisis: Is Web Design Becoming a Commodity?](https://webdesignerdepot.com/the-vibe-coding-crisis-is-web-design-becoming-a-commodity/)
