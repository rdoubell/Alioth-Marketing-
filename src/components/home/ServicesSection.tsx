import { useState, useEffect, useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { SERVICES } from './services-data'

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

function GrainTexture() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-cream opacity-[0.05]"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  )
}

interface TrackerBarProps {
  collected: boolean[]
}

function TrackerBar({ collected }: TrackerBarProps) {
  return (
    <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 px-6">
      {SERVICES.map((service, i) => (
        <div
          key={service.name}
          className={`flex items-center gap-2 rounded-full border px-3 py-1.5 transition-all duration-500 ease-out md:px-4 md:py-2 ${
            collected[i]
              ? 'scale-100 border-green bg-green opacity-100'
              : 'scale-90 border-ink/15 bg-transparent opacity-50'
          }`}
        >
          <span className={`font-mono text-[10px] md:text-xs ${collected[i] ? 'text-cream' : 'text-ink/40'}`}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <span
            className={`font-sans text-[10px] uppercase tracking-wide md:text-xs ${
              collected[i] ? 'text-cream' : 'hidden md:inline md:text-ink/30'
            }`}
          >
            {service.name}
          </span>
        </div>
      ))}
    </div>
  )
}

interface StackLayerProps {
  index: number
  onLeave: () => void
  onEnterBack: () => void
  children: ReactNode
}

function StackLayer({ index, onLeave, onEnterBack, children }: StackLayerProps) {
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
      },
      onLeave: () => onLeave(),
      onEnterBack: () => onEnterBack(),
    })

    return () => trigger.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  return (
    <div
      ref={containerRef}
      className="sticky top-0 flex h-screen items-center justify-center md:top-20 md:h-[calc(100vh-5rem)] md:items-start md:pt-80"
      style={{ zIndex: index + 1 }}
    >
      <div ref={cardRef} className="h-full w-full will-change-transform md:h-auto" style={{ position: 'relative' }}>
        {children}
      </div>
    </div>
  )
}

function RecapPanel() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>()

  return (
    <section className="relative z-10 bg-cream px-6 py-24">
      <div ref={ref} className="mx-auto max-w-5xl">
        <h3
          className={`reveal text-center font-serif text-3xl text-ink md:text-4xl ${isVisible ? 'reveal-visible' : ''}`}
        >
          Six disciplines. One team.
        </h3>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <div
              key={service.name}
              className={`reveal rounded-2xl border border-ink/10 bg-cream-soft p-6 transition-all duration-200 hover:-translate-y-1 hover:border-green hover:shadow-lg ${isVisible ? 'reveal-visible' : ''}`}
              style={{ transitionDelay: isVisible ? `${100 + i * 80}ms` : '0ms' }}
            >
              <span className="font-mono text-xs text-green">{String(i + 1).padStart(2, '0')}</span>
              <h4 className="mt-2 font-serif text-xl text-ink">{service.name}</h4>
              <p className="mt-2 font-sans text-sm text-ink/70">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
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
    <>
      <section className="relative bg-cream">
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          <div className="sticky top-0 flex h-screen flex-col items-center gap-6 overflow-hidden pt-24 md:top-20 md:h-[calc(100vh-5rem)] md:pt-28">
            <GrainTexture />
            <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
              <span className="font-serif text-3xl font-bold uppercase text-green md:text-5xl">What We Offer</span>
              <h2 className="mt-4 font-serif text-xl text-ink/70 md:text-2xl">One team, six disciplines, no hand-offs</h2>
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
            onLeave={() => setCardCollected(i, true)}
            onEnterBack={() => setCardCollected(i, false)}
          >
            <div className="relative h-full w-full overflow-hidden flex flex-col justify-center bg-cream-soft px-8 py-16 md:mx-auto md:h-auto md:min-h-[32rem] md:w-[85%] md:max-w-4xl md:rounded-[2rem] md:border md:border-ink/10 md:px-16 md:py-20 md:shadow-[0_30px_70px_-20px_rgba(15,20,15,0.4),inset_0_1px_0_rgba(255,255,255,0.6)]">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -left-3 -top-6 select-none font-serif text-[7rem] font-black leading-none text-green/20 md:-left-4 md:-top-10 md:text-[11rem]"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="relative z-10">
                <h3 className="font-serif text-4xl text-ink md:text-6xl">{service.name}</h3>
                <p className="mt-6 max-w-xl font-sans text-lg text-ink/70 md:text-xl">{service.description}</p>
              </div>
            </div>
          </StackLayer>
        ))}
      </section>

      <RecapPanel />
    </>
  )
}
