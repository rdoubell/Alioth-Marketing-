import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import ContactForm from '../ContactForm'

gsap.registerPlugin(ScrollTrigger)

export default function ContactSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    if (!window.matchMedia('(min-width: 768px)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Desktop only, matching the card deck above it: once the last service
    // card has locked into place, this section slides up from below and
    // covers the settled stack, rather than the default plain scroll-past
    // reveal. Standard "sticky reveal" GSAP pattern — start/end use the
    // section's own natural (pre-sticky) document position, which is what
    // makes it read as sliding up specifically as this section enters view.
    gsap.set(section, { y: '100%' })

    const trigger = ScrollTrigger.create({
      trigger: section,
      // Starts earlier than 'top bottom' (while Contact is still a good way
      // below the viewport) so its slide-up overlaps the tail end of the
      // card deck releasing, instead of a plain gap first and only then an
      // animation. 'top top' as the end (a full viewport of scroll) also
      // left a long stretch where Contact was barely visible yet — both
      // compressed together into one snappier, more overlapped transition.
      start: 'top 200%',
      end: 'top 66%',
      scrub: 0.8,
      onUpdate: (self) => {
        gsap.set(section, { y: `${100 - self.progress * 100}%`, force3D: true })
      },
    })

    return () => trigger.kill()
  }, [])

  return (
    <section ref={sectionRef} className="relative z-40 bg-green px-6 py-24 md:sticky md:top-20">
      <div
        ref={ref}
        className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-start lg:justify-between"
      >
        <div className={`reveal max-w-md ${isVisible ? 'reveal-visible' : ''}`}>
          <span className="font-mono text-xs uppercase tracking-widest text-cream/70">Get In Touch</span>
          <h2 className="mt-4 font-serif text-4xl text-cream">Start the Conversation</h2>
          <p className="mt-4 font-sans text-cream/70">
            Tell us where your brand is headed — we&apos;ll tell you how to get there faster.
          </p>
        </div>
        <div
          className={`reveal w-full max-w-xl ${isVisible ? 'reveal-visible' : ''}`}
          style={{ transitionDelay: isVisible ? '150ms' : '0ms' }}
        >
          <ContactForm source="home" tone="dark" />
        </div>
      </div>
    </section>
  )
}
