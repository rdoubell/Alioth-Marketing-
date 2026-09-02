import { Link } from 'react-router-dom'
import SEOMeta from '../components/SEOMeta'
import { SERVICES } from '../components/home/services-data'
import logoMark from '../assets/brand/A-cream.png'

interface TimelineNode {
  title: string
  body: string
}

const TIMELINE: TimelineNode[] = [
  {
    title: 'Nights and weekends',
    body: 'Freelance work alongside full-time jobs across commodity trading, insurance, iGaming, and health & fitness.',
  },
  {
    title: 'One team, full focus',
    body: 'The side hustle became the main focus — no departments, no hand-offs, just the two of us doing the work.',
  },
  {
    title: 'Scaling on purpose',
    body: "About a year in, and growing deliberately — open to any industry ready to build something real.",
  },
]

function Timeline() {
  return (
    <ol className="mt-10 grid gap-8 md:mt-14 md:grid-cols-3 md:gap-6">
      {TIMELINE.map((node, i) => (
        <li key={node.title} className="relative pl-8 md:pl-0 md:pt-8">
          <span
            aria-hidden="true"
            className="absolute left-0 top-1 h-3 w-3 rounded-full border-2 border-green bg-cream md:left-0 md:top-0"
          />
          <span
            aria-hidden="true"
            className="absolute left-[5px] top-4 h-[calc(100%-1rem)] w-px bg-green/20 md:left-0 md:top-3 md:h-px md:w-full"
          />
          <span className="font-mono text-[10px] uppercase tracking-widest text-green/70">
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3 className="mt-1 font-serif text-xl text-ink md:text-2xl">{node.title}</h3>
          <p className="mt-2 font-sans text-base text-ink/70">{node.body}</p>
        </li>
      ))}
    </ol>
  )
}

function DisciplineRow() {
  return (
    <div className="mt-8 flex flex-wrap gap-2 md:mt-10">
      {SERVICES.map((service, i) => (
        <span
          key={service.slug}
          className="flex items-center gap-2 rounded-full border border-green/20 bg-green/5 px-4 py-2"
        >
          <span className="font-mono text-[10px] text-green/60">{String(i + 1).padStart(2, '0')}</span>
          <span className="font-sans text-xs uppercase tracking-wide text-ink/80">{service.name}</span>
        </span>
      ))}
    </div>
  )
}

export default function About() {
  return (
    <>
      <SEOMeta
        title="About"
        description="Why Alioth is called Alioth, how we started, and the kind of businesses we're built for."
        path="/about"
      />

      <section className="mx-auto max-w-3xl px-6 py-24">
        <div className="animate-fade-up">
          <span className="font-mono text-xs uppercase tracking-widest text-green">About</span>
          <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Why we&apos;re called Alioth.</h1>
        </div>

        <p className="animate-fade-up mt-8 font-sans text-lg text-ink/80 [animation-delay:100ms] md:text-xl">
          Alioth is the star sailors and travelers once used to find their way home — a fixed, trusted point in a
          shifting sky. That&apos;s the role we set out to play for the businesses we work with.
        </p>

        <p className="mt-6 font-sans text-lg text-ink/70">
          We started Alioth together, kept noticing the same gap across every industry we touched: real potential
          with no one steady guiding the marketing behind it. Here&apos;s the short version of how that turned into
          what we do now.
        </p>

        <Timeline />

        <h2 className="mt-16 font-serif text-2xl text-ink md:mt-20 md:text-3xl">One team. No hand-offs.</h2>
        <p className="mt-4 font-sans text-lg text-ink/70">
          We work as one team across seven disciplines instead of handing you between departments and account
          managers. When you work with us, you&apos;re talking directly to the people doing the work. And where a
          project calls for more — photography, video, influencer partnerships — we bring in specialists from our
          own network to build a strategy tailored to your business, not a template.
        </p>
        <DisciplineRow />
      </section>

      <section className="relative overflow-hidden bg-green px-6 py-20 text-cream md:py-28">
        <img
          src={logoMark}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -right-16 h-[130%] w-auto max-w-none opacity-[0.08]"
        />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl">Who we&apos;re built for</h2>
          <p className="mt-4 font-sans text-lg text-cream/80">
            We&apos;re not locked into one industry. We&apos;ve worked across commodity trading, insurance, iGaming,
            health &amp; fitness, and personal branding — and we&apos;re actively looking for the next business
            ready to grow with us.
          </p>
          <div className="mt-10">
            <Link
              to="/contact"
              className="inline-block rounded-full bg-cream px-8 py-3.5 font-sans text-xs uppercase tracking-wider text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-cream-deep hover:shadow-lg active:translate-y-0 active:scale-95"
            >
              Work With Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
