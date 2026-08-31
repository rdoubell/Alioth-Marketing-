export interface Service {
  name: string
  slug: string
  description: string
}

export const SERVICES: Service[] = [
  {
    name: 'Strategy',
    slug: 'strategy',
    description: 'Brand positioning and growth plans built on real market insight, not guesswork.',
  },
  {
    name: 'Paid Media',
    slug: 'paid-media',
    description: 'Performance campaigns across search and social that turn budget into pipeline.',
  },
  {
    name: 'Email & Automation',
    slug: 'email-automation',
    description: 'Lifecycle flows and campaigns that keep your audience engaged between purchases.',
  },
  {
    name: 'SEO & Content',
    slug: 'seo-content',
    description: 'Organic visibility and content that compounds, built for how South Africans search.',
  },
  {
    name: 'Design & Creative',
    slug: 'design-creative',
    description: 'Visual identity and campaign creative that make your brand impossible to ignore.',
  },
  {
    name: 'Analytics & Reporting',
    slug: 'analytics-reporting',
    description: 'Clear, honest reporting so you always know what is working and what is not.',
  },
]
