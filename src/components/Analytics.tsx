import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../lib/analytics'

export default function Analytics() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    trackPageView(pathname + search)
  }, [pathname, search])

  return null
}
