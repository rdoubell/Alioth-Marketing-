export const SITE_URL = 'https://www.aliothgroup.co.za'
export const SITE_NAME = 'Alioth Marketing Solutions'
export const CONTACT_EMAIL = 'rohan@aliothgroup.co.za'
export const CONTACT_PHONE = '+27 79 351 1570'

export interface NavLink {
  label: string
  href: string
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Solutions', href: '/solutions' },
]
