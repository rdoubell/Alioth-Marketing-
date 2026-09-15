import { SITE_URL, SITE_NAME, CONTACT_EMAIL, CONTACT_PHONE } from '../lib/brand'
import { SERVICES } from './home/services-data'

// ProfessionalService (a LocalBusiness subtype) instead of plain Organization
// — it's the correct schema.org type for a local agency wanting to compete
// for "marketing agency Johannesburg"-type searches and show up correctly in
// Google's local/Maps results, and it inherits every Organization field
// (name, url, logo, email) so nothing is lost by switching. hasOfferCatalog
// mirrors the Solutions page 1:1 (built from the same SERVICES source, not
// duplicated by hand) so Google can associate this business with each
// specific service it offers, not just the brand name.
export default function SchemaOrg() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.png`,
    image: `${SITE_URL}/og-image.png`,
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Johannesburg',
      addressRegion: 'Gauteng',
      addressCountry: 'ZA',
    },
    areaServed: {
      '@type': 'Country',
      name: 'South Africa',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Marketing Services',
      itemListElement: SERVICES.map((service, i) => ({
        '@type': 'Offer',
        position: i + 1,
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          url: `${SITE_URL}/solutions#${service.slug}`,
        },
      })),
    },
  }

  return <script type="application/ld+json">{JSON.stringify(schema)}</script>
}
