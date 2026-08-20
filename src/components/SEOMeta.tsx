import { useEffect } from 'react'
import { SITE_URL, SITE_NAME } from '../lib/brand'

interface SEOMetaProps {
  title: string
  description: string
  path?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  noindex?: boolean
}

const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.content = content
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

export default function SEOMeta({
  title,
  description,
  path = '/',
  ogImage,
  ogType = 'website',
  noindex = false,
}: SEOMetaProps) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  const url = `${SITE_URL}${path}`
  const image = ogImage ?? DEFAULT_OG_IMAGE
  const robotsContent = noindex ? 'noindex, nofollow' : 'index, follow'

  useEffect(() => {
    document.title = fullTitle

    setMeta('description', description)
    setMeta('robots', robotsContent)
    setLink('canonical', url)

    setMeta('og:title', fullTitle, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:url', url, 'property')
    setMeta('og:type', ogType, 'property')
    setMeta('og:image', image, 'property')
    setMeta('og:site_name', SITE_NAME, 'property')

    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', fullTitle)
    setMeta('twitter:description', description)
    setMeta('twitter:image', image)
  }, [fullTitle, description, url, ogType, image, robotsContent])

  return null
}
