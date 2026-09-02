import { Link } from 'react-router-dom'
import { SITE_NAME } from '../lib/brand'

interface LogoC2Props {
  tone?: 'ink' | 'cream'
}

/**
 * Lockup C2 from the brand guidelines: "Alioth | Marketing / Group",
 * fully typeset in Cormorant Garamond, no icon.
 */
export default function LogoC2({ tone = 'ink' }: LogoC2Props) {
  const textColor = tone === 'cream' ? 'text-cream' : 'text-ink'
  const dividerColor = tone === 'cream' ? 'bg-cream/30' : 'bg-ink/20'

  return (
    <Link
      to="/"
      aria-label={SITE_NAME}
      className="flex items-center gap-3"
      onClick={() => {
        // Clicking the logo while already on "/" doesn't trigger a route
        // change, so ScrollToTop's navigation-based reset never fires —
        // scroll to the top explicitly so the logo always lands on Hero.
        if (window.location.pathname === '/') window.scrollTo(0, 0)
      }}
    >
      <span className={`font-serif text-3xl font-semibold uppercase tracking-wide ${textColor}`}>Alioth</span>
      <span className={`h-8 w-px ${dividerColor}`} aria-hidden="true" />
      <span
        className={`flex flex-col font-serif text-xs font-semibold uppercase leading-tight tracking-wide ${textColor}`}
      >
        <span>Marketing</span>
        <span>Group</span>
      </span>
    </Link>
  )
}
