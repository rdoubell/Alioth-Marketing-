import JsonLd from './JsonLd'
import type { Faq } from '../pages/solutions-data'

interface FaqSectionProps {
  heading: string
  faqs: Faq[]
}

// Native <details> keeps this accessible and script-free. The FAQPage markup
// mirrors the visible questions exactly, which is what Google requires for it
// to be eligible as a rich result.
export default function FaqSection({ heading, faqs }: FaqSectionProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <JsonLd data={schema} />
      <h2 className="font-serif text-3xl text-ink md:text-4xl">{heading}</h2>
      <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
        {faqs.map((faq) => (
          <details key={faq.question} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-serif text-xl text-ink marker:content-none [&::-webkit-details-marker]:hidden">
              {faq.question}
              <span
                aria-hidden="true"
                className="shrink-0 font-sans text-2xl text-green transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 max-w-2xl font-sans text-lg text-ink/70">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
