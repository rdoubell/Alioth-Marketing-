import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SERVICES } from './services-data'

gsap.registerPlugin(ScrollTrigger)

// One layer per service — see docs/superpowers/specs for the design. The
// "What We Offer" backdrop is a separate, non-scaling sticky panel that
// stays pinned behind the whole stack (see ServicesSection below), not one
// of these layers, so it never gets covered/replaced like a card would.
const LAYER_COUNT = SERVICES.length
const SCALE_STEP = 0.05
const scaleEase = gsap.parseEase('power2.out')

function LivingGradient() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden bg-cream">
      <div
        className="living-gradient-blob absolute bottom-[-25%] left-1/2 h-[95%] w-[150%] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(247,242,232,0.95) 0%, rgba(39,81,63,0.85) 32%, rgba(27,59,47,0.92) 62%, rgba(15,42,32,0) 100%)',
        }}
      />
    </div>
  )
}

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
    })

    return () => trigger.kill()
  }, [index])

  return (
    <div
      ref={containerRef}
      className="sticky top-0 flex h-screen items-center justify-center md:top-20 md:h-[calc(100vh-5rem)]"
      style={{ zIndex: index + 1 }}
    >
      <div ref={cardRef} className="h-full w-full will-change-transform md:h-auto" style={{ position: 'relative' }}>
        {children}
      </div>
    </div>
  )
}

export default function ServicesSection() {
  return (
    <section className="relative bg-cream">
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden md:top-20 md:h-[calc(100vh-5rem)]">
          <LivingGradient />
          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
            <span className="font-serif text-3xl font-bold uppercase text-green md:text-5xl">What We Offer</span>
            <h2 className="mt-4 font-serif text-xl text-ink/70 md:text-2xl">One team, six disciplines, no hand-offs</h2>
          </div>
        </div>
      </div>

      {SERVICES.map((service, i) => (
        <StackLayer key={service.name} index={i}>
          <div className="flex h-full w-full flex-col justify-center bg-cream-soft px-8 py-16 md:mx-auto md:h-auto md:min-h-[32rem] md:w-[85%] md:max-w-4xl md:rounded-[2rem] md:border md:border-ink/10 md:px-16 md:py-20 md:shadow-[0_30px_70px_-20px_rgba(15,20,15,0.4),inset_0_1px_0_rgba(255,255,255,0.6)]">
            <span className="font-mono text-sm tracking-wider text-green">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="mt-4 font-serif text-4xl text-ink md:text-6xl">{service.name}</h3>
            <p className="mt-6 max-w-xl font-sans text-lg text-ink/70 md:text-xl">{service.description}</p>
          </div>
        </StackLayer>
      ))}
    </section>
  )
}
