import { SERVICES } from './services-data'

export default function ServicesSection() {
  return (
    <section className="bg-cream px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <span className="font-mono text-xs uppercase tracking-widest text-green">What We Offer</span>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <div key={service.name} className="border-t border-ink/10 pt-6">
              <h3 className="font-serif text-2xl text-ink">{service.name}</h3>
              <p className="mt-3 font-sans text-sm text-ink/70">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
