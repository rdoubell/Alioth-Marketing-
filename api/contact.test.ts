import { describe, it, expect, vi, beforeEach } from 'vitest'
import handler, { validateContactPayload } from './contact'

const sendMock = vi.fn()

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: sendMock },
  })),
}))

function makeRequest(body: unknown, method = 'POST') {
  const init: RequestInit = { method }
  // The Fetch spec forbids a body on GET/HEAD requests (Request throws
  // "Request with GET/HEAD method cannot have body"), so omit it for those.
  if (method !== 'GET' && method !== 'HEAD') {
    init.body = JSON.stringify(body)
  }
  return new Request('https://www.aliothgroup.co.za/api/contact', init)
}

describe('validateContactPayload', () => {
  it('requires firstName', () => {
    expect(
      validateContactPayload({ lastName: 'Doe', email: 'a@b.com', message: 'hi', source: 'home' })
    ).toBe('firstName is required')
  })

  it('requires lastName', () => {
    expect(
      validateContactPayload({ firstName: 'A', email: 'a@b.com', message: 'hi', source: 'home' })
    ).toBe('lastName is required')
  })

  it('requires a valid email', () => {
    expect(
      validateContactPayload({ firstName: 'A', lastName: 'B', email: 'not-an-email', message: 'hi', source: 'home' })
    ).toBe('a valid email is required')
  })

  it('requires a message', () => {
    expect(
      validateContactPayload({ firstName: 'A', lastName: 'B', email: 'a@b.com', message: '', source: 'home' })
    ).toBe('message is required')
  })

  it('requires source to be home or contact-page', () => {
    expect(
      validateContactPayload({
        firstName: 'A',
        lastName: 'B',
        email: 'a@b.com',
        message: 'hi',
        // @ts-expect-error testing invalid input
        source: 'nowhere',
      })
    ).toBe('source must be "home" or "contact-page"')
  })

  it('returns null for a fully valid payload', () => {
    expect(
      validateContactPayload({ firstName: 'A', lastName: 'B', email: 'a@b.com', message: 'hi', source: 'home' })
    ).toBeNull()
  })
})

describe('contact handler', () => {
  beforeEach(() => {
    sendMock.mockReset()
    process.env.RESEND_API_KEY = 'test-key'
  })

  it('rejects non-POST requests with 405', async () => {
    const res = await handler(makeRequest({}, 'GET'))
    expect(res.status).toBe(405)
  })

  it('rejects an invalid payload with 400', async () => {
    const res = await handler(makeRequest({ firstName: 'A' }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('lastName is required')
  })

  it('sends an email and returns 200 for a valid payload', async () => {
    sendMock.mockResolvedValueOnce({ data: { id: '123' }, error: null })

    const res = await handler(
      makeRequest({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        message: 'Need help with paid media.',
        source: 'home',
      })
    )

    expect(res.status).toBe(200)
    expect(sendMock).toHaveBeenCalledOnce()
    expect(sendMock.mock.calls[0][0]).toMatchObject({
      to: 'hello@aliothgroup.co.za',
      replyTo: 'jane@example.com',
    })
  })

  it('returns 500 if Resend fails to send', async () => {
    sendMock.mockRejectedValueOnce(new Error('network error'))

    const res = await handler(
      makeRequest({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        message: 'Need help.',
        source: 'contact-page',
      })
    )

    expect(res.status).toBe(500)
  })
})
