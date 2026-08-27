export const SITE_URL = 'https://www.aliothgroup.co.za'
export const SITE_NAME = 'Alioth Marketing Solutions'
export const CONTACT_EMAIL = 'hello@aliothgroup.co.za'
export const CONTACT_PHONE = '+27 (0) 00 000 0000'

export interface NavLink {
  label: string
  href: string
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Blog', href: '/blog' },
]
