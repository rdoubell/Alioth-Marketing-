import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import ComingSoon from './components/ComingSoon'

// Temporary site-wide gate while Home/About/Solutions/Contact content is
// still being built. Flip to false to restore normal routing.
const MAINTENANCE_MODE = true

export default function App() {
  if (MAINTENANCE_MODE) {
    return <ComingSoon />
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
