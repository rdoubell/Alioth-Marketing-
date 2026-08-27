import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SERVICES } from './services-data'

gsap.registerPlugin(ScrollTrigger)

// Heading backdrop (index 0) + one layer per service, each stacking on top
// of the last as the user scrolls — see docs/superpowers/specs for the design.
const LAYER_COUNT = SERVICES.length + 1
const SCALE_STEP = 0.05

interface StackLayerProps {
  index: number
  children: ReactNode
}

function StackLayer({ index, children }: StackLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const card = cardRef.current
    if (!container || !card) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const targetScale = 1 - (LAYER_COUNT - index) * SCALE_STEP
    gsap.set(card, { scale: 1, transformOrigin: 'center top' })

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
      onUpdate: (self) => {
        const scale = gsap.utils.interpolate(1, targetScale, self.progress)
        gsap.set(card, { scale: Math.max(scale, targetScale), transformOrigin: 'center top' })
      },
    })

    return () => trigger.kill()
  }, [index])

  return (
    <div
      ref={containerRef}
      className="sticky top-0 flex h-screen items-center justify-center md:top-20 md:h-[calc(100vh-5rem)]"
      style={{ zIndex: index + 1 }}
    >
      <div ref={cardRef} className="w-full" style={{ position: 'relative', top: `${index * 14}px` }}>
        {children}
      </div>
    </div>
  )
}

export default function ServicesSection() {
  return (
    <section className="relative bg-cream">
      <StackLayer index={0}>
        <div className="mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-green">What We Offer</span>
          <h2 className="mt-4 font-serif text-4xl font-semibold text-ink md:text-5xl">
            One team, six disciplines, no hand-offs
          </h2>
        </div>
      </StackLayer>

      {SERVICES.map((service, i) => (
        <StackLayer key={service.name} index={i + 1}>
          <div className="mx-auto w-[88%] max-w-xl rounded-3xl border border-ink/10 bg-cream-soft px-8 py-10 shadow-[0_25px_60px_-20px_rgba(15,20,15,0.35),inset_0_1px_0_rgba(255,255,255,0.6)] sm:w-[70%] sm:px-12 sm:py-14">
            <span className="font-mono text-xs tracking-wider text-green">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="mt-3 font-serif text-3xl text-ink md:text-4xl">{service.name}</h3>
            <p className="mt-4 font-sans text-base text-ink/70">{service.description}</p>
          </div>
        </StackLayer>
      ))}
    </section>
  )
}
