import SEOMeta from '../components/SEOMeta'
import Hero from '../components/home/Hero'
import ServicesSection from '../components/home/ServicesSection'
import ContactSection from '../components/home/ContactSection'

export default function Home() {
  return (
    <>
      <SEOMeta
        title="Marketing Agency Johannesburg | Alioth Marketing Solutions"
        description="Johannesburg marketing agency helping South African businesses grow through web design, SEO, paid media, and brand strategy — one team, no hand-offs."
        path="/"
      />
      <Hero />
      <ServicesSection />
      <ContactSection />
    </>
  )
}
