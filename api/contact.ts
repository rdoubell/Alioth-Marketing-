import { Resend } from 'resend'

export const config = { runtime: 'edge' }

interface ContactPayload {
  firstName: string
  lastName: string
  email: string
  message: string
  source: 'home' | 'contact-page'
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_NAME_LENGTH = 100
const MAX_MESSAGE_LENGTH = 5000

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export function validateContactPayload(body: unknown): string | null {
  if (typeof body !== 'object' || body === null) {
    return 'a valid request body is required'
  }

  const payload = body as Partial<Record<keyof ContactPayload, unknown>>

  if (!isNonEmptyString(payload.firstName)) return 'firstName is required'
  if (payload.firstName.trim().length > MAX_NAME_LENGTH) {
    return `firstName must be ${MAX_NAME_LENGTH} characters or fewer`
  }

  if (!isNonEmptyString(payload.lastName)) return 'lastName is required'
  if (payload.lastName.trim().length > MAX_NAME_LENGTH) {
    return `lastName must be ${MAX_NAME_LENGTH} characters or fewer`
  }

  if (!isNonEmptyString(payload.email) || !EMAIL_RE.test(payload.email.trim())) {
    return 'a valid email is required'
  }

  if (!isNonEmptyString(payload.message)) return 'message is required'
  if (payload.message.trim().length > MAX_MESSAGE_LENGTH) {
    return `message must be ${MAX_MESSAGE_LENGTH} characters or fewer`
  }

  if (payload.source !== 'home' && payload.source !== 'contact-page') {
    return 'source must be "home" or "contact-page"'
  }

  return null
}

/** Strips CR/LF so untrusted input can't inject extra headers/lines into the email subject. */
function sanitizeForHeader(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim()
}

export default async function handler(request: Request): Promise<Response> {
  try {
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return new Response(JSON.stringify({ error: 'Request body must be valid JSON' }), {
        status: 400,
      })
    }

    const validationError = validateContactPayload(body)
    if (validationError) {
      return new Response(JSON.stringify({ error: validationError }), { status: 400 })
    }

    const payload = body as ContactPayload
    const firstName = sanitizeForHeader(payload.firstName)
    const lastName = sanitizeForHeader(payload.lastName)

    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'Alioth Website <noreply@aliothgroup.co.za>',
      to: 'hello@aliothgroup.co.za',
      replyTo: payload.email,
      subject: `New enquiry from ${firstName} ${lastName} (${payload.source})`,
      text: `From: ${firstName} ${lastName} <${payload.email}>\nSource: ${payload.source}\n\n${payload.message}`,
    })

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Failed to send message' }), { status: 500 })
  }
}
