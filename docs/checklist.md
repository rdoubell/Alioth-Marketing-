# Alioth Website — Launch Checklist

Last updated: 2026-08-25 (site is now live — maintenance gate removed)

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

## Design polish (from the taste-skill audit) — still open, none implemented yet

- [ ] **Services grid reads as generic** — 6 equal cards in a uniform 3×2 grid is the most template-feeling part of the site. Worth an asymmetric/zig-zag treatment instead.
- [ ] **Mobile nav toggle is plain text** ("Menu"/"Close") rather than an icon.
- [ ] **No "skip to content" link** — small accessibility gap, cheap to add.

## In progress

- [ ] **Home page entrance experience** — logo splash screen on first load + a transparent, scroll-aware Navbar over the Hero video with a cream gradient scrim. **Design approved via mockup** — not yet spec'd/planned/built.

## Already done this session

- [x] Home page rebuild (Hero, Services, Contact) + Navbar redesign, reviewed and merged
- [x] Hero video compressed 18.7MB → 3.7MB + poster frame added
- [x] Hero headline legibility fix (bold weight + drop-shadow), Services section headline sized up, Navbar logo/Contact Us swapped (your direct requests, not from the taste-skill list)
- [x] Maintenance gate removed entirely — site is live
- [x] All commits pushed to GitHub (`origin/main` at `3a187fe`)
