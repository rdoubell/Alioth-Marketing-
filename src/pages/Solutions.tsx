import { Link } from 'react-router-dom'
import SEOMeta from '../components/SEOMeta'
import { SERVICES } from '../components/home/services-data'
import { SOLUTION_DETAILS } from './solutions-data'

export default function Solutions() {
  return (
    <>
      <SEOMeta
        title="Marketing Services — Web Design, SEO & Paid Media"
        description="Full-service Johannesburg marketing agency offering web design, strategy, paid media, email automation, SEO & content, design, and analytics."
        path="/solutions"
      />

      <section className="relative overflow-hidden px-6 py-24 text-center">
        {/* Green glow stemming from the sticky navbar's bottom edge — gives
            the heading some depth against the plain cream background. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-green/25 to-transparent blur-3xl md:h-96"
        />
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-5xl font-black text-ink md:text-6xl">Solutions</h1>
          <p className="mt-6 font-sans text-lg text-ink/70">
            A closer look at each of the seven ways we help brands grow.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl divide-y divide-ink/10 px-6">
        {SERVICES.map((service, i) => {
          const detail = SOLUTION_DETAILS[service.slug]
          const Icon = detail.icon
          return (
            <section key={service.slug} id={service.slug} className="scroll-mt-28 py-16">
              <div className="flex items-start gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green/10 text-green">
                  <Icon size={24} strokeWidth={1.75} aria-hidden="true" />
                </div>
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-green/70">
                    {String(i + 1).padStart(2, '0')} — {detail.tagline}
                  </span>
                  <h2 className="mt-2 font-serif text-3xl text-ink md:text-4xl">{service.name}</h2>
                </div>
              </div>
              <div className="mt-6 space-y-4 pl-0 md:pl-[4.75rem]">
                {detail.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="max-w-2xl font-sans text-lg text-ink/70">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          )
        })}
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
