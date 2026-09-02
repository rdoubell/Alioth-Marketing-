import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * React Router doesn't reset scroll position on navigation by default, so
 * without this, clicking to a new page (e.g. logo -> Home from a page
 * scrolled deep into its own content) lands still scrolled to wherever the
 * previous page happened to be.
 *
 * When a hash is present (e.g. /solutions#web-design-build), scrolls to that
 * element instead of the top. The browser's own native hash-scroll can't be
 * relied on here — in an SPA it only fires once, at initial parse time,
 * before React has rendered the target element into the DOM, so on a fresh
 * load it finds nothing and never retries. Elements that want the sticky
 * navbar accounted for should set scroll-margin-top (scrollIntoView respects
 * it).
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
