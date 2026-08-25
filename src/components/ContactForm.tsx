import { useState, type FormEvent } from 'react'

export type ContactFormSource = 'home' | 'contact-page'

interface ContactFormProps {
  source: ContactFormSource
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactForm({ source }: ContactFormProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, message, source }),
      })

      if (!response.ok) {
        const body = (await response.json()) as { error?: string }
        setErrorMessage(body.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setStatus('success')
      setFirstName('')
      setLastName('')
      setEmail('')
      setMessage('')
    } catch {
      setErrorMessage('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p role="status" className="font-sans text-ink">
        Thanks — we&apos;ll be in touch soon.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          aria-label="First Name"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="flex-1 border border-ink/20 bg-cream-soft px-4 py-3 font-sans text-sm"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          aria-label="Last Name"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="flex-1 border border-ink/20 bg-cream-soft px-4 py-3 font-sans text-sm"
        />
      </div>
      <input
        type="email"
        name="email"
        placeholder="Email"
        aria-label="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-ink/20 bg-cream-soft px-4 py-3 font-sans text-sm"
      />
      <textarea
        name="message"
        placeholder="How can we help you?"
        aria-label="How can we help you?"
        required
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="resize-none border border-ink/20 bg-cream-soft px-4 py-3 font-sans text-sm"
      />
      {status === 'error' && (
        <p role="alert" className="font-sans text-sm text-red-700">
          {errorMessage}
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="self-start bg-green px-8 py-3 font-sans text-xs uppercase tracking-wider text-cream transition-colors hover:bg-green-bright disabled:opacity-50"
      >
        {status === 'submitting' ? 'Sending…' : 'Send'}
      </button>
    </form>
  )
}
