import { Link } from 'react-router-dom'
import SEOMeta from '../components/SEOMeta'

export default function NotFound() {
  return (
    <>
      <SEOMeta
        title="Page Not Found"
        description="The page you're looking for doesn't exist or may have moved."
        path="/404"
        noindex
      />
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-green/25 to-transparent blur-3xl md:h-96"
        />
        <span
          aria-hidden="true"
          className="font-serif text-[6rem] font-black leading-none text-green/15 md:text-[9rem]"
        >
          404
        </span>
        <h1 className="mt-2 font-display text-4xl font-black text-ink md:text-5xl">Page Not Found</h1>
        <p className="mt-4 max-w-md font-sans text-lg text-ink/70">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block rounded-full bg-green px-8 py-3.5 font-sans text-xs uppercase tracking-wider text-cream transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-bright hover:shadow-lg active:translate-y-0 active:scale-95"
        >
          Back to Home
        </Link>
      </section>
    </>
  )
}
