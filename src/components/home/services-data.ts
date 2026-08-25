export interface Service {
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
