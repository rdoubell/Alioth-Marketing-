import { useState, useEffect, useRef, type ReactNode, type RefObject } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SERVICES, type Service } from './services-data'
import logoMark from '../../assets/brand/A-cream.png'

gsap.registerPlugin(ScrollTrigger)

// One card per service, all pinned in a single shared frame — see
// docs/superpowers/specs for the design. Each card slides up into place once
// scrolled to, then stays put permanently, offset a few pixels lower than
// the one before it, so every earlier card's top edge keeps peeking out
// above the current front card (a fanned card-deck look). The "What We
// Offer" backdrop above is a separate, independently-pinned panel that
// never gets covered by the cards.
//
// This whole scroll-driven treatment is desktop-only (md: and up). On
// mobile it's replaced by a plain, non-animated vertical list of cards —
// see the `md:hidden` block in ServicesSection — so PeekCard skips creating
// its ScrollTrigger below that breakpoint.
const PEEK_OFFSET_PX = 16
const TOP_OFFSET_PX = 176
const HIDDEN_DELTA_PX = 500
const FRAME_HEIGHT = 'min(calc(100vh - 5rem), 46rem)'
const COLLECT_AT = 0.99
const peekEase = gsap.parseEase('power2.out')

function SectionBackground() {
  return (
    <>
      <img
        src="/Alioth%20background%20section%202.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      {/* Continues Hero's own bottom gradient seamlessly into this section,
          instead of the SVG cutting in abruptly. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-green-deep to-transparent"
      />
      {/* Bottom portion of the continuous watermark that starts in Hero —
          see the matching fragment there for the shared height/position math.
          Shifted up by exactly one section's height so image-range
          [100%, 150%] lands in this section's own [0, 50%] window. */}
      <img
        src={logoMark}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 hidden w-auto max-w-none opacity-[0.35] md:block"
        style={{ top: 'calc(-100vh + 5rem)', height: 'calc(150vh - 7.5rem)' }}
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
              ? 'scale-100 border-cream bg-cream opacity-100'
              : 'scale-90 border-cream/25 bg-transparent opacity-60'
          }`}
        >
          <span className={`font-mono text-[10px] md:text-xs ${collected[i] ? 'text-green' : 'text-cream/50'}`}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <span
            className={`font-sans text-[10px] uppercase tracking-wide md:text-xs ${
              collected[i] ? 'text-green' : 'hidden md:inline md:text-cream/40'
            }`}
          >
            {service.name}
          </span>
        </Link>
      ))}
    </div>
  )
}

interface ServiceCardProps {
  service: Service
  index: number
}

function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-[1.75rem] border border-ink/10 bg-cream-soft px-6 py-10 shadow-[0_20px_50px_-15px_rgba(15,20,15,0.35),inset_0_1px_0_rgba(255,255,255,0.6)] md:mx-auto md:w-[85%] md:max-w-4xl md:min-h-[26rem] md:rounded-[2rem] md:px-10 md:py-8 md:shadow-[0_30px_70px_-20px_rgba(15,20,15,0.4),inset_0_1px_0_rgba(255,255,255,0.6)]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-4 -right-3 select-none font-serif text-[7rem] font-black leading-none text-green/20 md:-right-4 md:-top-10 md:bottom-auto md:text-[11rem]"
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="relative z-10">
        <h3 className="font-serif text-4xl text-ink md:text-5xl">{service.name}</h3>
        <p className="mt-4 max-w-xl font-sans text-lg text-ink/70 md:text-xl">{service.description}</p>
      </div>
      <Link
        to={`/solutions#${service.slug}`}
        className="relative z-10 mt-8 inline-block rounded-full bg-green px-7 py-3.5 font-sans text-sm uppercase tracking-wider text-cream transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-bright hover:shadow-lg active:translate-y-0 active:scale-95 md:absolute md:bottom-8 md:right-8 md:mt-0 md:px-9 md:py-4 md:text-base"
      >
        See More
      </Link>
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
        const y = gsap.utils.interpolate(hiddenY, targetY, peekEase(self.progress))
        gsap.set(card, { y: Math.max(y, targetY), force3D: true })
        // Belt-and-braces: derive "collected" straight from the same progress
        // value driving the visible position, not only the onLeave/
        // onEnterBack events below, so the pill can never silently fail to
        // fill in.
        if (self.progress >= COLLECT_AT) onLeave()
        else if (self.progress <= 0.001) onEnterBack()
      },
      onLeave: () => onLeave(),
      onEnterBack: () => onEnterBack(),
    })

    return () => trigger.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  return (
    <div className="absolute inset-x-0 top-0 flex justify-center" style={{ paddingTop: TOP_OFFSET_PX, zIndex: index + 1 }}>
      <div ref={cardRef} className="w-[85%] max-w-4xl will-change-transform" style={{ position: 'relative' }}>
        {children}
      </div>
    </div>
  )
}

export default function ServicesSection() {
  const [collected, setCollected] = useState<boolean[]>(() => SERVICES.map(() => false))
  const markerRefs = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    // Layout (markers, backdrop) needs to settle — and web fonts reflow text
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
    <section className="relative bg-cream">
      {/* Desktop: pinned backdrop + a pinned card-deck frame. */}
      <div className="hidden md:block" data-testid="services-desktop">
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          <div className="sticky top-0 flex h-screen flex-col items-center gap-4 overflow-hidden pt-16 md:top-20 md:h-[calc(100vh-5rem)] md:pt-20">
            <SectionBackground />
            <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
              <h2 className="font-serif text-3xl font-bold uppercase text-cream md:text-5xl">What We Offer</h2>
            </div>
            <TrackerBar collected={collected} />
          </div>
        </div>

        {/* Head-start: gives the backdrop a moment pinned alone before card 1 arrives. */}
        <div aria-hidden="true" className="h-[50vh]" />

        {/* Invisible markers — one per card, stacked in normal flow. Each one
            is purely a scroll-range reference for that card's own trigger;
            the cards themselves render separately, absolutely positioned,
            in the pinned frame below. */}
        <div className="relative">
          {SERVICES.map((service, i) => (
            <div
              key={service.slug}
              ref={(el) => {
                markerRefs.current[i] = el
              }}
              aria-hidden="true"
              style={{ height: FRAME_HEIGHT }}
            />
          ))}

          <div className="absolute inset-0">
            <div className="sticky overflow-hidden" style={{ top: '5rem', height: FRAME_HEIGHT }}>
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

        {/* Trailing spacer: the pinned frame "borrows" its dwell room from
            markers still to come — position:sticky can't hold an element
            past its own containing block's bottom edge. Without this, the
            frame would get squeezed out of its top-20 hold as it nears the
            last marker instead of staying put through it. Matches the
            frame's own height so it gets the same dwell throughout. */}
        <div aria-hidden="true" style={{ height: FRAME_HEIGHT }} />
      </div>

      {/* Mobile: plain scroll, no pinning/scaling — same card look, just a
          normal list, one after another. */}
      <div className="md:hidden" data-testid="services-mobile">
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
