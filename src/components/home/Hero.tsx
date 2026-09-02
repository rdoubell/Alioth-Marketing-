import { Link } from 'react-router-dom'
import logoMark from '../../assets/brand/A-cream.png'
import { useTypewriter } from '../../hooks/useTypewriter'

const GROWTH_WORDS = ['revenue', 'presence', 'reach', 'audience', 'brand']

export default function Hero() {
  const growthWord = useTypewriter({ words: GROWTH_WORDS })

  return (
    <section className="relative flex h-screen items-center overflow-hidden md:h-[calc(100vh-5rem)]">
      <video
        className="absolute inset-0 hidden h-full w-full object-cover md:block"
        src="/video/hero-loop.mp4"
        poster="/video/hero-poster.jpg"
        preload="metadata"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <img
        src="/video/hero-poster.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover md:hidden"
      />
      {/* Mobile watermark — top half of one continuous mark that carries on
          into ServicesSection's mobile backdrop (see the matching fragment
          there). Mirrors the desktop two-fragment technique: Hero is a full
          100vh on mobile (no navbar offset, since the mobile nav is fixed
          and out of flow), so no -5rem correction is needed here. */}
      <img
        src={logoMark}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute w-auto max-w-none opacity-[0.35] md:hidden"
        style={{ top: 0, height: '150vh', right: '-507px' }}
      />
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
      <div
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-green/85 via-green/35 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-cream/70 to-transparent"
        aria-hidden="true"
      />
      {/* Desktop watermark — top portion of one continuous mark that carries on
          into ServicesSection's backdrop (see the matching fragment there).
          Both fragments share the same height/position math so the seam
          lines up: this shows image-range [0, 100%-of-section-height].
          Rendered above the dimming overlays (not below) so its color/opacity
          reads the same as the undimmed fragment in ServicesSection. */}
      <img
        src={logoMark}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 hidden w-auto max-w-none opacity-[0.35] md:block"
        style={{ top: 0, height: 'calc(150vh - 7.5rem)' }}
      />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <h1 className="animate-fade-up max-w-3xl font-display text-3xl font-black text-cream drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] md:text-7xl">
          From where you are to
          <br className="md:hidden" /> where you should be.
        </h1>
        <p className="animate-fade-up mt-6 max-w-xl font-sans text-lg text-cream/80 [animation-delay:150ms] md:text-2xl">
          <span className="sr-only">Guiding your business, growing your revenue.</span>
          <span aria-hidden="true">
            Guiding your business,
            <br className="md:hidden" />{' '}
            <span className="font-bold text-cream">
              growing your {growthWord}
              <span className="animate-pulse">|</span>
            </span>
          </span>
        </p>
        <div className="animate-fade-up mt-10 flex flex-wrap gap-4 [animation-delay:300ms]">
          <Link
            to="/contact"
            className="rounded-full bg-cream px-8 py-3.5 font-sans text-xs uppercase tracking-wider text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-cream-deep hover:shadow-lg active:translate-y-0 active:scale-95"
          >
            Work With Us
          </Link>
          <Link
            to="/solutions"
            className="rounded-full border border-cream px-8 py-3.5 font-sans text-xs uppercase tracking-wider text-cream transition-all duration-200 hover:-translate-y-0.5 hover:bg-cream/10 active:translate-y-0 active:scale-95"
          >
            Our Solutions
          </Link>
        </div>
      </div>
    </section>
  )
}
