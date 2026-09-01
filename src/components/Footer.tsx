import { Link } from 'react-router-dom'
import { NAV_LINKS, SITE_NAME, CONTACT_EMAIL, CONTACT_PHONE } from '../lib/brand'
import LogoC2 from './LogoC2'
import logoMark from '../assets/brand/A-cream.png'

function FooterLink({ to, children }: { to: string; children: string }) {
  return (
    <Link
      to={to}
      className="group relative w-fit font-sans text-sm text-cream/70 transition-colors duration-200 hover:text-cream"
    >
      {children}
      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-cream transition-all duration-300 group-hover:w-full" />
    </Link>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-cream/10 bg-black px-6 py-20 text-cream">
      <img
        src={logoMark}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-24 h-[140%] w-auto max-w-none opacity-[0.05]"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <LogoC2 tone="cream" />
          <p className="mt-5 max-w-xs font-sans text-sm text-cream/60">
            Johannesburg-based marketing consultancy helping South African businesses grow.
          </p>
        </div>

        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-cream/40">Navigate</span>
          <nav className="mt-4 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <FooterLink key={link.href} to={link.href}>
                {link.label}
              </FooterLink>
            ))}
            <FooterLink to="/contact">Contact</FooterLink>
          </nav>
        </div>

        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-cream/40">Get In Touch</span>
          <div className="mt-4 flex flex-col gap-3 font-sans text-sm text-cream/70">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="group relative w-fit transition-colors duration-200 hover:text-cream"
            >
              {CONTACT_EMAIL}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-cream transition-all duration-300 group-hover:w-full" />
            </a>
            <a
              href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`}
              className="group relative w-fit transition-colors duration-200 hover:text-cream"
            >
              {CONTACT_PHONE}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-cream transition-all duration-300 group-hover:w-full" />
            </a>
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-16 max-w-6xl border-t border-cream/10 pt-6 font-mono text-[10px] uppercase tracking-widest text-cream/40">
        © {year} {SITE_NAME}. All rights reserved.
      </div>
    </footer>
  )
}
