import { useParams } from 'react-router-dom'
import SEOMeta from '../components/SEOMeta'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <>
      <SEOMeta
        title={slug ?? 'Post'}
        description="An Alioth Marketing Solutions insights post."
        path={`/blog/${slug ?? ''}`}
        ogType="article"
      />
      <h1 className="font-serif text-4xl px-6 py-24 text-center">Post: {slug}</h1>
    </>
  )
}
