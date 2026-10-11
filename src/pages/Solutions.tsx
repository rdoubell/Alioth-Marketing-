import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
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

      {/* Jump bar: seven long sections with one shared structure is a lot to
          scroll blind, so every service is one tap away and stays pinned
          under the navbar. */}
      <nav
        aria-label="Jump to a service"
        className="sticky top-20 z-30 border-y border-ink/10 bg-cream/90 backdrop-blur-sm"
      >
        <ul className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-6 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SERVICES.map((service) => (
            // Auto margins on the first/last chip centre the row when it fits
            // but, unlike justify-center, never clip the first chip off-screen
            // when it overflows and has to scroll.
            <li key={service.slug} className="shrink-0 first:ml-auto last:mr-auto">
              <a
                href={`#${service.slug}`}
                className="block rounded-full border border-green/25 px-4 py-1.5 font-sans text-xs uppercase tracking-wide text-green transition-colors duration-200 hover:bg-green hover:text-cream"
              >
                {service.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto max-w-3xl divide-y divide-ink/10 px-6">
        {SERVICES.map((service) => {
          const detail = SOLUTION_DETAILS[service.slug]
          const Icon = detail.icon
          return (
            <section key={service.slug} id={service.slug} className="scroll-mt-40 py-16">
              <div className="flex items-start gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green/10 text-green">
                  <Icon size={24} strokeWidth={1.75} aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-serif text-3xl text-ink md:text-4xl">{service.name}</h2>
                  <p className="mt-1 font-serif text-xl italic text-green">{detail.tagline}</p>
                </div>
              </div>
              <div className="mt-6 space-y-4 pl-0 md:pl-[4.75rem]">
                {detail.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="max-w-2xl font-sans text-lg text-ink/70">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="mt-8 md:pl-[4.75rem]">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 font-sans text-sm uppercase tracking-wider text-green underline-offset-4 transition-colors hover:text-green-bright hover:underline"
                >
                  Talk to us about {service.name}
                  <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </Link>
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
