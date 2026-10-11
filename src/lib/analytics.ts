// Google Analytics 4, loaded only when VITE_GA_MEASUREMENT_ID is set at build
// time (e.g. G-XXXXXXXXXX in Vercel's environment variables). With no ID —
// the case today — nothing is injected and no tracking happens. Visitors who
// send a Do Not Track signal are never tracked either.
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

let loaded = false

function trackingAllowed(): boolean {
  return Boolean(MEASUREMENT_ID) && navigator.doNotTrack !== '1'
}

function load() {
  if (loaded) return
  loaded = true
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args)
  }
  window.gtag('js', new Date())
  // Page views are sent manually per route change (see trackPageView) because
  // this is a single-page app — the browser never does a full page load.
  window.gtag('config', MEASUREMENT_ID, { send_page_view: false })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(script)
}

export function trackPageView(path: string) {
  if (!trackingAllowed()) return
  load()
  window.gtag?.('event', 'page_view', { page_path: path, page_location: window.location.href })
}
