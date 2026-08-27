import { useScrollReveal } from '../../hooks/useScrollReveal'
import ContactForm from '../ContactForm'

export default function ContactSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>()

  return (
    <section className="bg-green px-6 py-24">
      <div
        ref={ref}
        className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-start lg:justify-between"
      >
        <div className={`reveal max-w-md ${isVisible ? 'reveal-visible' : ''}`}>
          <span className="font-mono text-xs uppercase tracking-widest text-cream/70">Get In Touch</span>
          <h2 className="mt-4 font-serif text-4xl text-cream">Start the Conversation</h2>
          <p className="mt-4 font-sans text-cream/70">
            Tell us where your brand is headed — we&apos;ll tell you how to get there faster.
          </p>
        </div>
        <div
          className={`reveal w-full max-w-xl ${isVisible ? 'reveal-visible' : ''}`}
          style={{ transitionDelay: isVisible ? '150ms' : '0ms' }}
        >
          <ContactForm source="home" tone="dark" />
        </div>
      </div>
    </section>
  )
}
