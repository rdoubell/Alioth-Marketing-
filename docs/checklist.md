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

- [ ] **Home page entrance experience** — logo splash screen on first load + a transparent, scroll-aware Navbar over the Hero video with a cream gradient scrim. **Design approved via mockup** — not yet spec'd/planned/built.

## Already done this session

- [x] Home page rebuild (Hero, Services, Contact) + Navbar redesign, reviewed and merged
- [x] Hero video compressed 18.7MB → 3.7MB + poster frame added
- [x] Hero headline legibility fix (bold weight + drop-shadow), Services section headline sized up, Navbar logo/Contact Us swapped (your direct requests, not from the taste-skill list)
- [x] Hero entrance animation (headline/subhead/buttons fade-up on load, staggered) + rounded pill CTA buttons with hover-lift/press micro-interaction
- [x] Hero split into 3/4 video + 1/4 cream "What We Offer" teaser band (both fully visible on first load, no scroll needed) — moved the label out of ServicesSection to avoid repeating it
- [x] Maintenance gate removed entirely — site is live
- [x] All commits pushed to GitHub (`origin/main` at `93e0fd2`)

---

## Design suggestions — per page, per section

Combines the taste-skill audit with current (2026) web design trend research — SaaS/agency landing pages, bento grids, motion design, and About-page patterns specifically. None of this is implemented unless marked done above; it's a menu to work through, not a mandate. Sourced from live research, not just training data — see links at the bottom of this section.

**On "vibe coding":** in current usage this mostly means AI-generated sites built by describing a mood rather than deliberately specifying details — and the well-known critique of that approach is that it converges on generic, "safely average" output. That's exactly what the taste-skill audit exists to counter. So the aim below isn't "chase whatever's viral" — it's applying specific, considered patterns deliberately, the same way a human designer would.

### Global / cross-cutting

- **Font boldness has a ceiling.** Cormorant Garamond on Google Fonts tops out at weight 700 — already applied to the Hero headline tonight. There is no heavier cut of this specific typeface available. If it still needs to feel bolder than that, the real levers are: (a) push size further at desktop (`md:text-7xl` → `lg:text-8xl`), (b) bring in a heavier *display* serif reserved only for hero-scale headline moments (e.g. Fraunces Black, Playfair Display Black) layered alongside Cormorant Garamond rather than replacing it everywhere, or (c) accept 700 as the ceiling and lean on size/shadow/animation instead, as done tonight. This is a real brand-system decision — flagging it rather than silently picking one.
- **Scroll-triggered entrance animation, site-wide.** Tonight's Hero fade-up only fires once on load. 2026 trend research is consistent: sections should gently fade/slide into view *as the user scrolls to them* (IntersectionObserver-based), not just on initial page load — this is now treated as a baseline expectation, not a flourish, as long as it stays subtle.
- **Consistent micro-interactions.** Hero buttons now have a hover-lift + press-down. Extend the same feel to Navbar links, service cards, and the Contact form's submit button, so the whole site reads as one considered system instead of one animated corner.
- **Color ratio is already on-trend** — the brand's cream-dominant palette matches 2026's move toward "unbleached neutrals over pure white," and Deep Forest green used sparingly matches the trend toward strategic (not dominant) accent color. No change recommended here.
- **No "skip to content" link anywhere on the site** — small, cheap accessibility fix carried over from the earlier taste-skill audit, still not done.

### Navbar

- **Transparent-over-hero + scroll hide/reveal** — already designed and approved via mockup; next thing to actually build.
- Extend the hover-lift micro-interaction to the nav links and Contact Us button.
- **Mobile toggle is still plain text** ("Menu"/"Close") — swap for an animated hamburger↔X icon, standard and expected on mobile nav today.
- Active-link cream pill could transition smoothly between links on route change instead of snapping instantly — nice-to-have.

### Hero

- [x] Done tonight: rounded pill CTAs with hover-lift/press, staggered fade-up entrance for headline/subhead/buttons.
- Consider a subtle parallax on the video (scrolls slightly slower than the content above it) — flagged in current research as effective for video/image hero sections, but needs to stay subtle since it's a background video, not a static image.
- If the headline still reads as needing more presence after tonight's change, next lever is size, not weight (see Global note above).
- Further out: word-by-word or mask-wipe headline reveal instead of a flat fade — a fancier version of tonight's animation, worth trying only once the simple version feels right.

### Services section

- **The single biggest structural opportunity on the page.** Replace the uniform 3×2 grid with a **bento-style layout** — the dominant 2026 pattern for feature/service grids (research puts bento-style layouts on ~67% of top SaaS homepages currently): one or two services featured in larger tiles, the rest smaller, asymmetric but balanced — instead of 6 identical boxes.
- Add scroll-triggered, staggered fade-up per card as the section enters view.
- Card hover is currently just a border-color change — add the same lift/shadow treatment as the Hero buttons. Consider a small accent numeral (01–06, Space Mono) per card instead of a generic icon pack, which the taste-skill audit specifically flags as a common tell.

### Contact section (Home) + /contact page

- Inputs currently rely on the browser's default focus ring — a branded focus state (green ring/outline) would feel more deliberate.
- Submit button should get the same hover-lift treatment as Hero/Services.
- The success message currently replaces the form instantly — animating that swap in would match the "guide and confirm" purpose motion is expected to serve in 2026 (subtle, functional, not decorative).

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
