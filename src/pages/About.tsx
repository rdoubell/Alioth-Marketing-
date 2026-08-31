import { Link } from 'react-router-dom'
import SEOMeta from '../components/SEOMeta'

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
          We started Alioth together, working full-time in industries as different as commodity trading, insurance,
          iGaming, and health &amp; fitness — and helping professionals build their personal brands on the side.
          Across every industry, we kept noticing the same gap: real potential with no one steady guiding the
          marketing behind it. Alioth began as a side hustle built to close that gap. It&apos;s since grown into
          something we&apos;re scaling on purpose.
        </p>

        <h2 className="mt-14 font-serif text-2xl text-ink md:text-3xl">One team. No hand-offs.</h2>
        <p className="mt-4 font-sans text-lg text-ink/70">
          We work as one team across six disciplines — strategy, paid media, email, SEO, design, and analytics —
          instead of handing you between departments and account managers. When you work with us, you&apos;re
          talking directly to the people doing the work. And where a project calls for more — photography, video,
          influencer partnerships — we bring in specialists from our own network to build a strategy tailored to
          your business, not a template.
        </p>

        <h2 className="mt-14 font-serif text-2xl text-ink md:text-3xl">Who we&apos;re built for</h2>
        <p className="mt-4 font-sans text-lg text-ink/70">
          We&apos;re not locked into one industry. We&apos;ve worked across commodity trading, insurance, iGaming,
          health &amp; fitness, and personal branding — and we&apos;re actively looking for the next business ready
          to grow with us.
        </p>

        <div className="mt-14">
          <Link
            to="/contact"
            className="inline-block rounded-full bg-green px-8 py-3.5 font-sans text-xs uppercase tracking-wider text-cream transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-bright hover:shadow-lg active:translate-y-0 active:scale-95"
          >
            Work With Us
          </Link>
        </div>
      </section>
    </>
  )
}
