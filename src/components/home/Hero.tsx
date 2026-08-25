import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/video/hero-loop.mp4"
        poster="/video/hero-poster.jpg"
        preload="metadata"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-32">
        <h1 className="animate-fade-up max-w-3xl font-serif text-5xl font-bold text-cream drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] md:text-7xl">
          Steer by a fixed point
        </h1>
        <p className="animate-fade-up mt-6 max-w-xl font-sans text-lg text-cream/80 [animation-delay:150ms]">
          A full-service marketing studio — strategy, creative, web, campaigns and performance.
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
