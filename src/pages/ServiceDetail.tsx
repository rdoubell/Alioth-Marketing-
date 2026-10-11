import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import SEOMeta from '../components/SEOMeta'
import JsonLd from '../components/JsonLd'
import FaqSection from '../components/FaqSection'
import { SERVICES, plainDescription } from '../components/home/services-data'
import { SITE_NAME, SITE_URL } from '../lib/brand'
import { SOLUTION_DETAILS, SERVICE_FAQS } from './solutions-data'
import NotFound from './NotFound'

export default function ServiceDetail() {
  const { slug } = useParams()
  const index = SERVICES.findIndex((s) => s.slug === slug)
  if (index === -1) return <NotFound />

  const service = SERVICES[index]
  const detail = SOLUTION_DETAILS[service.slug]
  const faqs = SERVICE_FAQS[service.slug] ?? []
  const Icon = detail.icon
  const others = SERVICES.filter((s) => s.slug !== service.slug)
  const path = `/solutions/${service.slug}`

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: plainDescription(service),
    url: `${SITE_URL}${path}`,
    provider: { '@type': 'ProfessionalService', name: SITE_NAME, url: SITE_URL },
    areaServed: { '@type': 'Country', name: 'South Africa' },
  }

  return (
    <>
      <SEOMeta
        title={`${service.name} Services in Johannesburg`}
        description={`${plainDescription(service)} Delivered by Alioth, a Johannesburg marketing agency.`}
        path={path}
      />
      <JsonLd data={serviceSchema} />

      <section className="relative overflow-hidden px-6 pb-16 pt-12 text-center md:pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-green/25 to-transparent blur-3xl md:h-96"
        />
        <div className="mx-auto max-w-3xl">
          <Link
            to="/solutions"
            className="inline-flex items-center gap-2 font-sans text-sm text-green underline-offset-4 hover:underline"
          >
            <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
            All solutions
          </Link>
          <div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-green/10 text-green">
            <Icon size={28} strokeWidth={1.75} aria-hidden="true" />
          </div>
          <h1 className="mt-6 font-display text-5xl font-black text-ink md:text-6xl">{service.name}</h1>
          <p className="mt-4 font-serif text-2xl italic text-green">{detail.tagline}</p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl space-y-5 px-6 pb-8">
        {detail.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="font-sans text-lg text-ink/80 md:text-xl">
            {paragraph}
          </p>
        ))}
      </article>

      {faqs.length > 0 && <FaqSection heading={`${service.name}: common questions`} faqs={faqs} />}

      <nav aria-label="Other solutions" className="mx-auto max-w-3xl px-6 pb-20">
        <h2 className="font-serif text-2xl text-ink">Other ways we help</h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {others.map((s) => (
            <li key={s.slug}>
              <Link
                to={`/solutions/${s.slug}`}
                className="block rounded-full border border-green/25 px-4 py-1.5 font-sans text-xs uppercase tracking-wide text-green transition-colors duration-200 hover:bg-green hover:text-cream"
              >
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section className="bg-green px-6 py-20 text-center text-cream">
        <h2 className="font-serif text-2xl md:text-3xl">Talk to us about {service.name}</h2>
        <p className="mt-4 font-sans text-cream/80">
          Tell us where your brand is headed — we&apos;ll tell you how to get there.
        </p>
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
