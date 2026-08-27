import { Link } from 'react-router-dom'
import { SITE_NAME } from '../lib/brand'

/**
 * Lockup C2 from the brand guidelines: "Alioth | Marketing / Group",
 * fully typeset in Cormorant Garamond, no icon.
 */
export default function LogoC2() {
  return (
    <Link to="/" aria-label={SITE_NAME} className="flex items-center gap-3">
      <span className="font-serif text-3xl font-semibold uppercase tracking-wide text-ink">Alioth</span>
      <span className="h-8 w-px bg-ink/20" aria-hidden="true" />
      <span className="flex flex-col font-serif text-xs font-semibold uppercase leading-tight tracking-wide text-ink">
        <span>Marketing</span>
        <span>Group</span>
      </span>
    </Link>
  )
}
