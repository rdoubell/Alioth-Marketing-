import { useScrollReveal } from '../../hooks/useScrollReveal'

interface Step {
  title: string
  body: string
}

// The order matters here (each step feeds the next), so the numerals earn
// their place. Copy restates commitments made elsewhere on the site: the
// in-person, listen-first approach, the written roadmap, and one team with
// no hand-offs.
const STEPS: Step[] = [
  {
    title: 'We listen first',
    body: 'A conversation, in person where we can, to understand your business, your customers and your goals before we propose anything.',
  },
  {
    title: 'You get a clear plan',
    body: 'A written roadmap: what to do first, what to measure, and what success looks like in real numbers.',
  },
  {
    title: 'We build and run it',
    body: 'The same team that planned it designs, launches and manages it. No hand-offs, and plain-language updates along the way.',
  },
]

export default function HowWeWork() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>()

  return (
    <section className="bg-cream px-6 py-20 md:py-28">
      <div ref={ref} className="mx-auto max-w-6xl">
        <h2
          className={`reveal max-w-2xl font-display text-4xl font-black text-ink md:text-5xl ${
            isVisible ? 'reveal-visible' : ''
          }`}
        >
          How we work
        </h2>
        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className={`reveal ${isVisible ? 'reveal-visible' : ''}`}
              style={{ transitionDelay: isVisible ? `${150 + i * 120}ms` : '0ms' }}
            >
              <span aria-hidden="true" className="font-serif text-6xl font-black leading-none text-green/25">
                {i + 1}
              </span>
              <h3 className="mt-4 font-serif text-2xl text-ink md:text-3xl">{step.title}</h3>
              <p className="mt-3 font-sans text-lg text-ink/70">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
