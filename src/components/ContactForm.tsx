import { useState, type FormEvent } from 'react'

export type ContactFormSource = 'home' | 'contact-page'
export type ContactFormTone = 'light' | 'dark'

interface ContactFormProps {
  source: ContactFormSource
  tone?: ContactFormTone
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

const STEP_COUNT = 3

const inputClass = (tone: ContactFormTone) =>
  `w-full rounded-xl bg-cream px-4 py-3.5 font-serif text-xl text-ink caret-ink outline-none placeholder:text-ink/40 transition-shadow duration-200 focus:ring-2 focus:ring-green-bright md:text-2xl ${
    tone === 'light' ? 'border border-ink/15' : ''
  }`

const primaryButtonClass = (tone: ContactFormTone) =>
  `self-start rounded-xl px-8 py-3.5 font-sans text-xs uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none ${
    tone === 'dark' ? 'bg-cream text-ink hover:bg-cream-deep' : 'bg-green text-cream hover:bg-green-bright'
  }`

const backButtonClass = (tone: ContactFormTone) =>
  `rounded-xl px-6 py-3.5 font-sans text-xs uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${
    tone === 'dark' ? 'bg-cream/70 text-ink hover:bg-cream' : 'border border-ink/20 text-ink hover:bg-ink/5'
  }`

export default function ContactForm({ source, tone = 'light' }: ContactFormProps) {
  const [step, setStep] = useState(0)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function submitInquiry() {
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
    } catch {
      setErrorMessage('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  function handleStepSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (step < STEP_COUNT - 1) {
      setStep((s) => s + 1)
      return
    }
    submitInquiry()
  }

  const mutedText = tone === 'dark' ? 'text-cream/60' : 'text-ink/50'
  const headingText = tone === 'dark' ? 'text-cream' : 'text-ink'

  if (status === 'success') {
    return (
      <div role="status" className={`flex items-center gap-4 ${headingText}`}>
        <span
          aria-hidden="true"
          className={`animate-fade-up flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
            tone === 'dark' ? 'bg-cream text-green' : 'bg-green text-cream'
          }`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <p className={`font-sans ${headingText}`}>
          Thanks, {firstName} — we&apos;ll be in touch soon.
          <br />
          <span className={mutedText}>We typically reply within 1 business day.</span>
        </p>
      </div>
    )
  }

  return (
    <div className="flex w-full max-w-xl flex-col gap-8">
      <div className="flex items-center gap-2" aria-hidden="true">
        {Array.from({ length: STEP_COUNT }).map((_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i <= step ? (tone === 'dark' ? 'bg-cream' : 'bg-green') : tone === 'dark' ? 'bg-cream/20' : 'bg-ink/10'
            }`}
          />
        ))}
      </div>
      <p role="status" className="sr-only">
        Step {step + 1} of {STEP_COUNT}
      </p>

      {step === 0 && (
        <form key="step-0" onSubmit={handleStepSubmit} className="animate-fade-up flex flex-col gap-6">
          <h3 className={`font-serif text-2xl md:text-3xl ${headingText}`}>First, what should we call you?</h3>
          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              aria-label="First Name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={inputClass(tone)}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              aria-label="Last Name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={inputClass(tone)}
            />
          </div>
          <button type="submit" className={primaryButtonClass(tone)}>
            Continue
          </button>
        </form>
      )}

      {step === 1 && (
        <form key="step-1" onSubmit={handleStepSubmit} className="animate-fade-up flex flex-col gap-6">
          <h3 className={`font-serif text-2xl md:text-3xl ${headingText}`}>
            Nice to meet you, {firstName}! What&apos;s the best email to reach you at?
          </h3>
          <input
            type="email"
            name="email"
            placeholder="Email"
            aria-label="Email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass(tone)}
          />
          <div className="flex items-center gap-4">
            <button type="submit" className={primaryButtonClass(tone)}>
              Continue
            </button>
            <button type="button" onClick={() => setStep(0)} className={backButtonClass(tone)}>
              Back
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form key="step-2" onSubmit={handleStepSubmit} className="animate-fade-up flex flex-col gap-6">
          <h3 className={`font-serif text-2xl md:text-3xl ${headingText}`}>
            Perfect. How can we help you, {firstName}?
          </h3>
          <textarea
            name="message"
            placeholder="Tell us a bit about what you need"
            aria-label="How can we help you?"
            required
            autoFocus
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${inputClass(tone)} resize-none text-lg md:text-xl`}
          />
          {status === 'error' && (
            <p role="alert" className={`font-sans text-sm ${tone === 'dark' ? 'text-red-300' : 'text-red-700'}`}>
              {errorMessage}
            </p>
          )}
          <div className="flex items-center gap-4">
            <button type="submit" disabled={status === 'submitting'} className={primaryButtonClass(tone)}>
              {status === 'submitting' ? 'Sending…' : 'Send'}
            </button>
            <button type="button" onClick={() => setStep(1)} className={backButtonClass(tone)}>
              Back
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
