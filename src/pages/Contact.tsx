import SEOMeta from '../components/SEOMeta'
import ContactForm from '../components/ContactForm'
import { CONTACT_EMAIL, CONTACT_PHONE } from '../lib/brand'

export default function Contact() {
  return (
    <>
      <SEOMeta
        title="Contact"
        description="Get in touch with Alioth Marketing Solutions — a Johannesburg marketing agency ready to help your South African business grow. Call, email, or send a message."
        path="/contact"
      />
      <section className="relative overflow-hidden px-6 py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-green/25 to-transparent blur-3xl md:h-96"
        />
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-5xl font-black text-ink md:text-6xl">Contact</h1>
          <p className="mt-6 font-sans text-lg text-ink/70">
            Tell us where your brand is headed using the form below, or reach us directly on{' '}
            <a
              href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`}
              className="text-green underline underline-offset-4 hover:text-green-bright"
            >
              {CONTACT_PHONE}
            </a>{' '}
            or{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-green underline underline-offset-4 hover:text-green-bright"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </div>
        <div className="mx-auto mt-12 flex max-w-3xl justify-center">
          <ContactForm source="contact-page" />
        </div>
      </section>
    </>
  )
}
