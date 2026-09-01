import { useState, useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SERVICES } from './services-data'
import logoMark from '../../assets/brand/A-cream.png'

gsap.registerPlugin(ScrollTrigger)

// One layer per service — see docs/superpowers/specs for the design. The
// "What We Offer" backdrop is a separate, non-scaling sticky panel that
// stays pinned behind the whole stack, not one of these layers, so it
// never gets covered/replaced like a card would. A blank head-start spacer
// (see ServicesSection) gives the backdrop a moment alone before card 1
// arrives, instead of both landing at once.
const LAYER_COUNT = SERVICES.length
const SCALE_STEP = 0.05
const scaleEase = gsap.parseEase('power2.out')

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
        className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-green-deep/90 to-transparent"
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

interface StackLayerProps {
  index: number
  /** Progress (0-1) at which this layer's pill should turn cream. Every card
   * but the last waits until it's fully scrolled past (matches the next
   * card visibly taking over). The last card has nothing after it to signal
   * "done" the same way, so it turns cream partway through its own view
   * instead — see ServicesSection. */
  collectAt: number
  onLeave: () => void
  onEnterBack: () => void
  children: ReactNode
}

function StackLayer({ index, collectAt, onLeave, onEnterBack, children }: StackLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const card = cardRef.current
    if (!container || !card) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const targetScale = 1 - (LAYER_COUNT - index) * SCALE_STEP
    gsap.set(card, { scale: 1, transformOrigin: 'center top', force3D: true })

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top center',
      end: 'bottom center',
      scrub: 0.8,
      onUpdate: (self) => {
        const scale = gsap.utils.interpolate(1, targetScale, scaleEase(self.progress))
        gsap.set(card, { scale: Math.max(scale, targetScale), force3D: true })
        // Belt-and-braces: derive "collected" straight from the same progress
        // value driving the visible scale, not only the onLeave/onEnterBack
        // events below, so the pill can never silently fail to fill in.
        if (self.progress >= collectAt) onLeave()
        else if (self.progress <= 0.001) onEnterBack()
      },
      onLeave: () => onLeave(),
      onEnterBack: () => onEnterBack(),
    })

    return () => trigger.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, collectAt])

  return (
    <div
      ref={containerRef}
      className="sticky top-0 flex h-screen items-center justify-center md:top-20 md:h-[calc(100vh-5rem)] md:items-start md:pt-56"
      style={{ zIndex: index + 1 }}
    >
      <div ref={cardRef} className="h-full w-full will-change-transform md:h-auto" style={{ position: 'relative' }}>
        {children}
      </div>
    </div>
  )
}

export default function ServicesSection() {
  const [collected, setCollected] = useState<boolean[]>(() => SERVICES.map(() => false))

  useEffect(() => {
    // Each StackLayer creates its own trigger in its own effect, so the very
    // first one can be measured before its later siblings (and the spacer)
    // have contributed their height — and web fonts reflow text after that
    // too. Refresh once layout has actually settled, and again once fonts
    // are ready, so cached trigger positions aren't stale.
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

      {SERVICES.map((service, i) => (
        <StackLayer
          key={service.name}
          index={i}
          collectAt={i === SERVICES.length - 1 ? 0.5 : 0.999}
          onLeave={() => setCardCollected(i, true)}
          onEnterBack={() => setCardCollected(i, false)}
        >
          <div className="relative h-full w-full overflow-hidden flex flex-col justify-center bg-cream-soft px-8 py-16 md:mx-auto md:h-auto md:min-h-[18rem] md:w-[85%] md:max-w-4xl md:rounded-[2rem] md:border md:border-ink/10 md:px-10 md:py-8 md:shadow-[0_30px_70px_-20px_rgba(15,20,15,0.4),inset_0_1px_0_rgba(255,255,255,0.6)]">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-3 -top-6 select-none font-serif text-[7rem] font-black leading-none text-green/20 md:-left-4 md:-top-10 md:text-[11rem]"
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="relative z-10">
              <h3 className="font-serif text-4xl text-ink md:text-5xl">{service.name}</h3>
              <p className="mt-4 max-w-xl font-sans text-lg text-ink/70 md:text-xl">{service.description}</p>
            </div>
            <Link
              to={`/solutions#${service.slug}`}
              className="absolute bottom-6 right-6 z-10 rounded-full bg-green px-7 py-3.5 font-sans text-sm uppercase tracking-wider text-cream transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-bright hover:shadow-lg active:translate-y-0 active:scale-95 md:bottom-8 md:right-8 md:px-9 md:py-4 md:text-base"
            >
              See More
            </Link>
          </div>
        </StackLayer>
      ))}
    </section>
  )
}
