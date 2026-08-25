import SEOMeta from '../components/SEOMeta'
import Hero from '../components/home/Hero'
import ServicesSection from '../components/home/ServicesSection'
import ContactSection from '../components/home/ContactSection'

export default function Home() {
  return (
    <>
      <SEOMeta
        title="Alioth Marketing Solutions"
        description="South African marketing consultancy helping ambitious brands grow with data-driven strategy, paid media, and creative."
        path="/"
      />
      <Hero />
      <ServicesSection />
      <ContactSection />
    </>
  )
}
