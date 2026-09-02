import { useEffect, useState } from 'react'

const TOP_THRESHOLD_PX = 80

interface NavbarScrollState {
  /** True while scrolled within TOP_THRESHOLD_PX of the top of the page. */
  atTop: boolean
}

/**
 * Tracks whether the page is scrolled near the top, for Home's
 * transparent-over-hero navbar treatment. Only listens while `active` is
 * true (the caller passes whether this is the one page that uses this
 * treatment) — otherwise always reports the resting state.
 */
export function useNavbarScrollState(active: boolean): NavbarScrollState {
  const [atTop, setAtTop] = useState(true)

  useEffect(() => {
    if (!active) {
      setAtTop(true)
      return
    }

    function handleScroll() {
      setAtTop(window.scrollY < TOP_THRESHOLD_PX)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [active])

  return { atTop }
}
