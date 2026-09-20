import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SchemaOrg from './components/SchemaOrg'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import About from './pages/About'
import Solutions from './pages/Solutions'
import Contact from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'
import NotFound from './pages/NotFound'

export default function AppRoutes() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-cream focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:text-ink focus:shadow-lg"
      >
        Skip to content
      </a>
      <SchemaOrg />
      <ScrollToTop />
      <Navbar />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/contact" element={<Contact />} />
          {/* Draft — see the note in PrivacyPolicy.tsx. Reachable by direct
              URL for review, deliberately not linked from Navbar/Footer. */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
