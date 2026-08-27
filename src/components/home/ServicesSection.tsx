import { useScrollReveal } from '../../hooks/useScrollReveal'
import { SERVICES } from './services-data'

export default function ServicesSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>()

  return (
    <section className="bg-cream px-6 py-24">
      <div ref={ref} className="mx-auto max-w-6xl">
        <h2
          className={`reveal max-w-2xl font-serif text-4xl font-semibold text-ink md:text-5xl ${isVisible ? 'reveal-visible' : ''}`}
        >
          One team, six disciplines, no hand-offs
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => (
            <div
              key={service.name}
              className={`reveal border-t border-ink/10 pt-6 transition-colors hover:border-green ${isVisible ? 'reveal-visible' : ''}`}
              style={{ transitionDelay: isVisible ? `${100 + index * 80}ms` : '0ms' }}
            >
              <h3 className="font-serif text-2xl text-ink">{service.name}</h3>
              <p className="mt-3 font-sans text-sm text-ink/70">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
