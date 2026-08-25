import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import ComingSoon from './components/ComingSoon'

// Only the live production domain is gated behind the Coming Soon screen.
// Localhost and Vercel preview URLs (*.vercel.app) always render normal
// routing so progress is visible while the site is still being built.
const GATED_PRODUCTION_HOSTNAMES = new Set(['aliothgroup.co.za', 'www.aliothgroup.co.za'])

function isGatedProductionDomain(): boolean {
  return GATED_PRODUCTION_HOSTNAMES.has(window.location.hostname)
}

export default function App() {
  if (isGatedProductionDomain()) {
    return <ComingSoon />
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
