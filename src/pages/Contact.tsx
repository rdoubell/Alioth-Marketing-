import SEOMeta from '../components/SEOMeta'
import ContactForm from '../components/ContactForm'

export default function Contact() {
  return (
    <>
      <SEOMeta
        title="Contact"
        description="Get in touch with Alioth Marketing Solutions — a Johannesburg marketing agency ready to help your South African business grow. Call, email, or send a message."
        path="/contact"
      />
      <section className="mx-auto max-w-3xl px-6 py-24">
        <h1 className="text-center font-serif text-4xl text-ink">Contact</h1>
        <div className="mt-12 flex justify-center">
          <ContactForm source="contact-page" />
        </div>
      </section>
    </>
  )
}
