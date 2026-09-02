import { Link } from 'react-router-dom'
import SEOMeta from '../components/SEOMeta'
import { SERVICES } from '../components/home/services-data'

export default function Solutions() {
  return (
    <>
      <SEOMeta
        title="Solutions"
        description="Web design, strategy, paid media, email automation, SEO, design, and analytics — everything Alioth Marketing Solutions offers."
        path="/solutions"
      />

      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <span className="font-mono text-xs uppercase tracking-widest text-green">Solutions</span>
        <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Solutions</h1>
        <p className="mt-6 font-sans text-lg text-ink/70">
          A closer look at each of the seven ways we help brands grow.
        </p>
      </section>

      <div className="mx-auto max-w-3xl divide-y divide-ink/10 px-6">
        {SERVICES.map((service) => (
          <section key={service.slug} id={service.slug} className="scroll-mt-28 py-16">
            <span className="font-mono text-xs uppercase tracking-widest text-green/70">
              [Placeholder tagline]
            </span>
            <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">{service.name}</h2>
            <p className="mt-4 max-w-2xl font-sans text-lg text-ink/70">{service.description}</p>
          </section>
        ))}
      </div>

      <section className="bg-green px-6 py-20 text-center text-cream">
        <h2 className="font-serif text-2xl md:text-3xl">Not sure where to start?</h2>
        <p className="mt-4 font-sans text-cream/80">Tell us where your brand is headed — we&apos;ll tell you how to get there.</p>
        <div className="mt-8">
          <Link
            to="/contact"
            className="inline-block rounded-full bg-cream px-8 py-3.5 font-sans text-xs uppercase tracking-wider text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-cream-deep hover:shadow-lg active:translate-y-0 active:scale-95"
          >
            Work With Us
          </Link>
        </div>
      </section>
    </>
  )
}
