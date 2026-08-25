import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/video/hero-loop.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-32">
        <h1 className="max-w-3xl font-serif text-5xl text-cream md:text-7xl">
          Steer by a fixed point
        </h1>
        <p className="mt-6 max-w-xl font-sans text-lg text-cream/80">
          A full-service marketing studio — strategy, creative, web, campaigns and performance.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to="/contact"
            className="bg-cream px-8 py-3.5 font-sans text-xs uppercase tracking-wider text-ink transition-colors hover:bg-cream-deep"
          >
            Work With Us
          </Link>
          <Link
            to="/solutions"
            className="border border-cream px-8 py-3.5 font-sans text-xs uppercase tracking-wider text-cream transition-colors hover:bg-cream/10"
          >
            Our Solutions
          </Link>
        </div>
      </div>
    </section>
  )
}
