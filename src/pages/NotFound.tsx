import SEOMeta from '../components/SEOMeta'

export default function NotFound() {
  return (
    <>
      <SEOMeta
        title="Page Not Found"
        description="The page you're looking for doesn't exist or may have moved."
        path="/404"
        noindex
      />
      <h1 className="font-serif text-4xl px-6 py-24 text-center">Page Not Found</h1>
    </>
  )
}
