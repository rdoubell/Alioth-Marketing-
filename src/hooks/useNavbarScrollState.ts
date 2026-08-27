import { useEffect, useRef, useState } from 'react'

const HIDE_THRESHOLD_PX = 80

interface NavbarScrollState {
  /** True while scrolled within HIDE_THRESHOLD_PX of the top of the page. */
  atTop: boolean
  /** True once the user has scrolled down past the threshold and is still scrolling down. */
  hidden: boolean
}

/**
 * Tracks scroll position/direction for the hide-on-scroll-down,
 * reveal-on-scroll-up navbar behavior. Only listens while `active` is
 * true (the caller passes whether this is the one page that uses this
 * behavior) — otherwise always reports the resting state.
 */
export function useNavbarScrollState(active: boolean): NavbarScrollState {
  const [atTop, setAtTop] = useState(true)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    if (!active) {
      setAtTop(true)
      setHidden(false)
      return
    }

    function handleScroll() {
      const scrollY = window.scrollY
      setAtTop(scrollY < HIDE_THRESHOLD_PX)

      if (scrollY > lastScrollY.current && scrollY > HIDE_THRESHOLD_PX) {
        setHidden(true)
      } else if (scrollY < lastScrollY.current) {
        setHidden(false)
      }
      lastScrollY.current = scrollY
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [active])

  return { atTop, hidden }
}
