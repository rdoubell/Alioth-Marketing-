# Alioth Website — Launch Checklist

Last updated: 2026-08-25

## Content still needed

- [ ] **About page** — currently a placeholder (`<h1>About</h1>` only). Spec calls for headline → mission paragraph → stats row → team blurb → narrative → closing CTA.
- [ ] **Solutions page** — currently a placeholder. Spec calls for 8 repeating service blocks + closing CTA.
- [ ] **Blog** — structure/routing only exists (`/blog`, `/blog/:slug`), zero real posts. Decide seed content before launch, or leave empty with a "coming soon" state.
- [ ] **Footer design** — still the Foundation-phase placeholder. No real design has been provided yet.
- [ ] **404 page** — currently a bare placeholder, not brand-styled.
- [ ] **Real contact phone number** — `CONTACT_PHONE` in `src/lib/brand.ts` is still `+27 (0) 00 000 0000`.
- [ ] **Privacy Policy / legal page** — open question flagged in the original spec, never resolved. revx.ai (the structural reference) has one; decide if Alioth needs one before launch.

## Pre-launch technical

- [ ] **Push local commits to GitHub** — `main` has unpushed local commits from this session's work.
- [ ] **Verify `RESEND_API_KEY`** is actually set as a Vercel environment variable (needed for the contact form to send email in production — not something I can check from the repo alone).
- [ ] **GA4 / analytics** — explicitly deferred in the original spec, not yet added.
- [ ] **Decide when to lift the maintenance gate** — `src/App.tsx` currently gates only the production hostnames (`aliothgroup.co.za` / `www.aliothgroup.co.za`); local and Vercel previews already bypass it. Flip happens whenever the above items are ready.

## Design polish (from the taste-skill audit)

- [ ] **Services grid reads as generic** — 6 equal cards in a uniform 3×2 grid is the most template-feeling part of the site. Worth an asymmetric/zig-zag treatment instead.
- [ ] **Mobile nav toggle is plain text** ("Menu"/"Close") rather than an icon — a deliberate choice is fine, but worth a second look rather than leaving it as a default.
- [ ] **No "skip to content" link** — small accessibility gap, cheap to add.

## In progress

- [ ] **Home page entrance experience** — logo splash screen on first load + a transparent, scroll-aware Navbar over the Hero video with a cream gradient scrim. Currently being designed (see chat / upcoming spec in `docs/superpowers/specs/`).

## Already done this session

- [x] Home page rebuild (Hero, Services, Contact) + Navbar redesign, reviewed and merged
- [x] Hero video compressed 18.7MB → 3.7MB + poster frame added
- [x] Maintenance mode fixed to only gate production, not local/previews
- [x] Hero headline legibility fix (bold weight + drop-shadow), Services section headline sized up, Navbar logo/Contact Us swapped
