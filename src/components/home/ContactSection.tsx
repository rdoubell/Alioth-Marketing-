import ContactForm from '../ContactForm'

export default function ContactSection() {
  return (
    <section className="bg-green px-6 py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-md">
          <span className="font-mono text-xs uppercase tracking-widest text-cream/70">Get In Touch</span>
          <h2 className="mt-4 font-serif text-4xl text-cream">Start the Conversation</h2>
          <p className="mt-4 font-sans text-cream/70">
            Tell us where your brand is headed — we&apos;ll tell you how to get there faster.
          </p>
        </div>
        <ContactForm source="home" tone="dark" />
      </div>
    </section>
  )
}
