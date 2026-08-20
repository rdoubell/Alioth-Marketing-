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

export function validateContactPayload(body: Partial<ContactPayload>): string | null {
  if (!body.firstName?.trim()) return 'firstName is required'
  if (!body.lastName?.trim()) return 'lastName is required'
  if (!body.email?.trim() || !EMAIL_RE.test(body.email)) return 'a valid email is required'
  if (!body.message?.trim()) return 'message is required'
  if (body.source !== 'home' && body.source !== 'contact-page') {
    return 'source must be "home" or "contact-page"'
  }
  return null
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  const body = (await request.json()) as Partial<ContactPayload>
  const validationError = validateContactPayload(body)
  if (validationError) {
    return new Response(JSON.stringify({ error: validationError }), { status: 400 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    await resend.emails.send({
      from: 'Alioth Website <noreply@aliothgroup.co.za>',
      to: 'hello@aliothgroup.co.za',
      replyTo: body.email,
      subject: `New enquiry from ${body.firstName} ${body.lastName} (${body.source})`,
      text: `From: ${body.firstName} ${body.lastName} <${body.email}>\nSource: ${body.source}\n\n${body.message}`,
    })
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to send message' }), { status: 500 })
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
