import { Link } from 'react-router-dom'
import { SITE_NAME } from '../lib/brand'
import logoIcon from '../assets/brand/A-black.png'

/**
 * Lockup C3 from the brand guidelines: the icon-as-"A" Alioth wordmark,
 * a vertical divider, and "Marketing / Group" stacked alongside it.
 */
export default function LogoC3() {
  return (
    <Link to="/" aria-label={SITE_NAME} className="flex items-center gap-3">
      <span className="inline-flex items-baseline font-serif text-4xl font-semibold uppercase tracking-wide text-ink">
        <img src={logoIcon} alt="" className="mr-1 h-[0.654em] w-auto" />
        lioth
      </span>
      <span className="h-8 w-px bg-ink/20" aria-hidden="true" />
      <span className="flex flex-col font-serif text-xs font-semibold uppercase leading-tight tracking-wide text-ink">
        <span>Marketing</span>
        <span>Group</span>
      </span>
    </Link>
  )
}
