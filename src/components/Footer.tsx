import { Link } from 'react-router-dom'
import { NAV_LINKS, SITE_NAME, CONTACT_EMAIL, CONTACT_PHONE } from '../lib/brand'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-black text-cream border-t border-cream/10 py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between gap-10">
        <div>
          <p className="font-serif text-lg mb-2">{SITE_NAME}</p>
          <p className="font-sans text-sm text-cream/60 max-w-xs">
            Johannesburg-based marketing consultancy helping South African businesses grow.
          </p>
        </div>

        <nav className="flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} to={link.href} className="font-sans text-sm text-cream/70 hover:text-cream">
              {link.label}
            </Link>
          ))}
          <Link to="/contact" className="font-sans text-sm text-cream/70 hover:text-cream">
            Contact
          </Link>
        </nav>

        <div className="font-sans text-sm text-cream/70 flex flex-col gap-2">
          <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-cream">
            {CONTACT_EMAIL}
          </a>
          <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} className="hover:text-cream">
            {CONTACT_PHONE}
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-cream/10 font-mono text-[10px] uppercase tracking-widest text-cream/40">
        © {year} {SITE_NAME}. All rights reserved.
      </div>
    </footer>
  )
}
