interface Service {
  name: string
  description: string
}

export const SERVICES: Service[] = [
  {
    name: 'Strategy',
    description: 'Brand positioning and growth plans built on real market insight, not guesswork.',
  },
  {
    name: 'Paid Media',
    description: 'Performance campaigns across search and social that turn budget into pipeline.',
  },
  {
    name: 'Email & Automation',
    description: 'Lifecycle flows and campaigns that keep your audience engaged between purchases.',
  },
  {
    name: 'SEO & Content',
    description: 'Organic visibility and content that compounds, built for how South Africans search.',
  },
  {
    name: 'Design & Creative',
    description: 'Visual identity and campaign creative that make your brand impossible to ignore.',
  },
  {
    name: 'Analytics & Reporting',
    description: 'Clear, honest reporting so you always know what is working and what is not.',
  },
]

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
