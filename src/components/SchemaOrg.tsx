import { SITE_URL, SITE_NAME, CONTACT_EMAIL, CONTACT_PHONE } from '../lib/brand'

export default function SchemaOrg() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.png`,
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Johannesburg',
      addressCountry: 'ZA',
    },
  }

  return <script type="application/ld+json">{JSON.stringify(schema)}</script>
}
