import { useState, useEffect, useRef, type ReactNode, type RefObject } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SERVICES, type Service } from './services-data'

gsap.registerPlugin(ScrollTrigger)

// One card per service, all pinned in a single shared panel alongside the
// "What We Offer" heading and tracker pills — see docs/superpowers/specs for
// the design. Each card slides up into place once scrolled to, then stays
// put permanently, offset a few pixels lower than the one before it, so
// every earlier card's top edge keeps peeking out above the current front
// card (a fanned card-deck look).
//
// The heading/pills and the card area used to be two separately-pinned
// panels kept in sync with a hand-measured pixel offset — which drifted out
// of sync on real screens and let cards climb up over the pills. They're now
// one flex column: the card area is a normal flex child that starts exactly
// where the pills end, in document flow, so overlap isn't possible
// regardless of screen size or how tall the pills row renders.
//
// This whole scroll-driven treatment is desktop-only (md: and up). On
// mobile it's replaced by a plain, non-animated vertical list of cards —
// see the `md:hidden` block in ServicesSection — so PeekCard skips creating
// its ScrollTrigger below that breakpoint.
const PEEK_OFFSET_PX = 14
const HIDDEN_DELTA_PX = 500
const PANEL_HEIGHT = 'min(calc(100vh - 5rem), 48rem)'
// Sized to just barely outlast the last card's own reveal, not a full extra
// panel's worth — a bigger value here just reads as a dead gap of plain
// cream before Contact appears.
const TRAILING_HEIGHT_PX = 100
// Compared against the *eased* value, not raw scroll progress — power2.out
// is already ~99% of the way to its target well before raw progress hits 1,
// so gating on raw progress alone fires noticeably late relative to when the
// card visually stops moving.
const COLLECT_AT_EASED = 0.97
const peekEase = gsap.parseEase('power2.out')

const DIAGONAL_LINES_MASK = 'radial-gradient(ellipse 75% 70% at 50% 55%, #000 25%, transparent 78%)'

// Solid deep green (the same colour Hero's bottom gradient ends on, so the
// two sections join with no visible seam) with three quiet layers on top:
// the supplied light-shaft SVG turned down so it reads as depth rather than
// grey wash, hairlines on the angle of the logo's strokes that fade out
// toward the edges, and a soft glow behind the card deck so the cream cards
// have something to lift off. The logo watermark no longer continues in
// here — it stays inside Hero and fades out before Hero's bottom edge.
function SectionBackground() {
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-green-deep" />
      <img
        src="/Alioth%20background%20section%202.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.28]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(112deg, rgba(241,233,218,0.06) 0, rgba(241,233,218,0.06) 1px, transparent 1px, transparent 46px)',
          maskImage: DIAGONAL_LINES_MASK,
          WebkitMaskImage: DIAGONAL_LINES_MASK,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(ellipse 55% 45% at 50% 64%, rgba(39,81,63,0.7), transparent 72%)',
        }}
      />
      {/* Dissolves the panel's lit lower half into the section's flat green so
          the panel's bottom edge (a few px short of the viewport on tall
          screens) doesn't show as a hard line. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-green-deep to-transparent"
      />
    </>
  )
}

interface TrackerBarProps {
  collected: boolean[]
}

function TrackerBar({ collected }: TrackerBarProps) {
  return (
    <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 px-6">
      {SERVICES.map((service, i) => (
        <Link
          key={service.name}
          to={`/solutions#${service.slug}`}
          className={`flex items-center gap-2 rounded-full border px-3 py-1.5 transition-all duration-500 ease-out md:px-4 md:py-2 ${
            collected[i]
              ? 'scale-100 border-cream bg-cream'
              : 'scale-95 border-cream/40 bg-transparent'
          }`}
        >
          <span className={`font-mono text-[10px] md:text-xs ${collected[i] ? 'text-green' : 'text-cream/75'}`}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <span
            className={`font-sans text-[10px] uppercase tracking-wide md:text-xs ${
              collected[i] ? 'text-green' : 'hidden md:inline md:text-cream/75'
            }`}
          >
            {service.name}
          </span>
        </Link>
      ))}
    </div>
  )
}

// Splits on **bold** markers in the teaser copy (see services-data.ts) and
// renders those spans bold — gives the teaser a scannable hook instead of a
// flat line of text, without needing a markdown dependency for one pattern.
function TeaserText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-ink">
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </>
  )
}

interface ServiceCardProps {
  service: Service
  index: number
}

function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-[1.75rem] border border-ink/10 bg-cream-soft px-6 py-10 shadow-[0_20px_50px_-15px_rgba(15,20,15,0.35),inset_0_1px_0_rgba(255,255,255,0.6)] md:mx-auto md:w-[85%] md:max-w-4xl md:min-h-[16rem] md:rounded-[2rem] md:px-12 md:py-9 md:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.6)]">
      {/* Mobile: bleeds off the bottom-right corner. Desktop: sits whole,
          vertically centred in the empty right half of the card, so it
          reads as a deliberate numeral instead of a clipped one. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-4 -right-3 select-none font-serif text-[7rem] font-black leading-none text-green/20 md:bottom-auto md:right-12 md:top-1/2 md:-translate-y-1/2 md:text-[9rem] md:text-green/[0.14]"
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="relative z-10 md:max-w-lg">
        <h3 className="font-serif text-4xl text-ink md:text-5xl">{service.name}</h3>
        <p className="mt-4 font-sans text-lg text-ink/70 md:text-xl">
          <TeaserText text={service.description} />
        </p>
        <Link
          to={`/solutions#${service.slug}`}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-green px-7 py-3.5 font-sans text-sm uppercase tracking-wider text-cream transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-bright hover:shadow-lg active:translate-y-0 active:scale-95 md:mt-6 md:px-8 md:py-3.5"
        >
          See More
          <ArrowUpRight size={18} strokeWidth={2} aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}

interface PeekCardProps {
  index: number
  markerRefs: RefObject<Array<HTMLDivElement | null>>
  onLeave: () => void
  onEnterBack: () => void
  children: ReactNode
}

function PeekCard({ index, markerRefs, onLeave, onEnterBack, children }: PeekCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Read the marker live, inside the effect (which runs after commit),
    // rather than from a value captured during render — markerRefs.current[
    // index] isn't populated by the marker's own ref callback until commit,
    // so a value read at render time would still be null.
    const marker = markerRefs.current?.[index]
    const card = cardRef.current
    if (!marker || !card) return
    if (!window.matchMedia('(min-width: 768px)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const targetY = index * PEEK_OFFSET_PX
    const hiddenY = targetY + HIDDEN_DELTA_PX
    gsap.set(card, { y: hiddenY, force3D: true })

    const trigger = ScrollTrigger.create({
      trigger: marker,
      start: 'top center',
      end: 'bottom center',
      scrub: 0.8,
      onUpdate: (self) => {
        const eased = peekEase(self.progress)
        const y = gsap.utils.interpolate(hiddenY, targetY, eased)
        gsap.set(card, { y: Math.max(y, targetY), force3D: true })
        // Belt-and-braces: derive "collected" straight from the same eased
        // value driving the visible position, not only the onLeave/
        // onEnterBack events below, so the pill can never silently fail to
        // fill in — and so it can't lag behind the card's own motion either.
        if (eased >= COLLECT_AT_EASED) onLeave()
        else if (self.progress <= 0.001) onEnterBack()
      },
      onLeave: () => onLeave(),
      onEnterBack: () => onEnterBack(),
    })

    return () => trigger.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  // top-9: a small, fixed breathing gap below wherever the pills actually
  // end — not a guess at the pills' own height, since this div's own top:0
  // already starts right after them in document flow (see the "flex-1"
  // wrapper in ServicesSection).
  return (
    <div className="absolute inset-x-0 top-9 flex justify-center" style={{ zIndex: index + 1 }}>
      <div ref={cardRef} className="w-[85%] max-w-4xl will-change-transform" style={{ position: 'relative' }}>
        {children}
      </div>
    </div>
  )
}

export default function ServicesSection() {
  const [collected, setCollected] = useState<boolean[]>(() => SERVICES.map(() => false))
  const markerRefs = useRef<Array<HTMLDivElement | null>>([])
  // With reduced motion the scroll-driven deck never animates, which used to
  // leave all seven desktop cards piled in one spot (only the last readable)
  // and every pill unfilled. Those visitors get the plain list instead.
  const [reduceMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    // Layout (markers, panel) needs to settle — and web fonts reflow text
    // after that too — before trigger positions can be trusted. Refresh once
    // layout has actually settled, and again once fonts are ready, so
    // cached trigger positions aren't stale.
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh())
    document.fonts?.ready?.then(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(raf)
  }, [])

  function setCardCollected(index: number, value: boolean) {
    setCollected((prev) => {
      if (prev[index] === value) return prev
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  return (
    <section className={`relative bg-cream ${reduceMotion ? '' : 'md:bg-green-deep'}`}>
      {/* Desktop: one pinned panel holding the heading, the tracker pills,
          and the card deck below them — in that document-flow order, so the
          cards can never render above the pills. The section itself is the
          same deep green as the panel on desktop, so the stretch after the
          panel releases never flashes cream before Contact slides up. */}
      {!reduceMotion && (
      <div className="hidden md:block" data-testid="services-desktop">
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          <div
            className="sticky flex flex-col items-center overflow-hidden pt-16 md:top-20 md:pt-20"
            style={{ height: PANEL_HEIGHT }}
          >
            <SectionBackground />
            <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
              <h2 className="font-serif text-3xl font-bold uppercase text-cream md:text-5xl">What We Offer</h2>
            </div>
            <div className="relative z-10 mt-4">
              <TrackerBar collected={collected} />
            </div>

            {/* Card deck zone: a normal flex child, so its own top edge is
                guaranteed to start right after the pills above — cards are
                positioned relative to THIS, not to the whole panel. */}
            <div className="relative z-10 w-full flex-1">
              {SERVICES.map((service, i) => (
                <PeekCard
                  key={service.name}
                  index={i}
                  markerRefs={markerRefs}
                  onLeave={() => setCardCollected(i, true)}
                  onEnterBack={() => setCardCollected(i, false)}
                >
                  <ServiceCard service={service} index={i} />
                </PeekCard>
              ))}
            </div>
          </div>
        </div>

        {/* Head-start: gives the panel a moment pinned alone before card 1 arrives. */}
        <div aria-hidden="true" className="h-[50vh]" />

        {/* Invisible markers — one per card, stacked in normal flow. Each one
            is purely a scroll-range reference for that card's own trigger;
            the cards themselves render inside the pinned panel above. */}
        {SERVICES.map((service, i) => (
          <div
            key={service.slug}
            ref={(el) => {
              markerRefs.current[i] = el
            }}
            aria-hidden="true"
            style={{ height: PANEL_HEIGHT }}
          />
        ))}

        {/* Trailing spacer: the pinned panel "borrows" its dwell room from
            markers still to come — position:sticky can't hold an element
            past its own containing block's bottom edge. Without this, the
            panel would get squeezed out of its top-20 hold before the last
            card finishes settling. */}
        <div aria-hidden="true" style={{ height: TRAILING_HEIGHT_PX }} />
      </div>
      )}

      {/* Mobile: plain scroll, no pinning/scaling — same card look, just a
          normal list, one after another. Also the fallback at every width
          for reduced-motion visitors. */}
      <div className={reduceMotion ? '' : 'md:hidden'} data-testid="services-mobile">
        <div className="relative overflow-hidden bg-green-deep px-6 pb-56 pt-16">
          <img
            src="/Alioth%20background%20section%202.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-green-deep to-transparent"
          />
          <div className="relative z-10 text-center">
            <h2 className="font-serif text-3xl font-bold uppercase text-cream">What We Offer</h2>
          </div>
        </div>
        <div className="-mt-44 flex flex-col gap-4 px-4 pb-8">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.name} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
