import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * React Router doesn't reset scroll position on navigation by default, so
 * without this, clicking to a new page (e.g. logo -> Home from a page
 * scrolled deep into its own content) lands still scrolled to wherever the
 * previous page happened to be. Skips the reset when a hash is present so
 * anchor links (e.g. /solutions#web-design-build) can still scroll to their
 * target instead of being forced back to the top.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
