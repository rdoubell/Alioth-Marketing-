import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import handler, { validateContactPayload } from './contact'

const sendMock = vi.fn()

// Mirrors the real `resend` package: its constructor throws synchronously
// when no API key is available (see node_modules/resend), which is exactly
// the untrusted-config failure mode we need the handler to survive.
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation((apiKey?: string) => {
    if (!apiKey) {
      throw new Error('Missing API key. Pass it to the constructor `new Resend("re_123")`')
    }
    return { emails: { send: sendMock } }
  }),
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

function makeRawRequest(rawBody: string, method = 'POST') {
  return new Request('https://www.aliothgroup.co.za/api/contact', { method, body: rawBody })
}

const validPayload = {
  firstName: 'A',
  lastName: 'B',
  email: 'a@b.com',
  message: 'hi',
  source: 'home',
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
        source: 'nowhere',
      })
    ).toBe('source must be "home" or "contact-page"')
  })

  it('returns null for a fully valid payload', () => {
    expect(validateContactPayload(validPayload)).toBeNull()
  })

  it('rejects a null body without throwing', () => {
    expect(validateContactPayload(null)).toBe('a valid request body is required')
  })

  it('rejects a non-object body without throwing', () => {
    expect(validateContactPayload('just a string')).toBe('a valid request body is required')
  })

  it('rejects a non-string firstName without throwing', () => {
    expect(validateContactPayload({ ...validPayload, firstName: 5 })).toBe('firstName is required')
  })

  it('rejects a non-string lastName without throwing', () => {
    expect(validateContactPayload({ ...validPayload, lastName: 5 })).toBe('lastName is required')
  })

  it('rejects a non-string email without throwing', () => {
    expect(validateContactPayload({ ...validPayload, email: 12345 })).toBe('a valid email is required')
  })

  it('rejects a non-string message without throwing', () => {
    expect(validateContactPayload({ ...validPayload, message: { nested: true } })).toBe(
      'message is required'
    )
  })

  it('rejects a firstName over 100 characters', () => {
    expect(validateContactPayload({ ...validPayload, firstName: 'a'.repeat(101) })).toBe(
      'firstName must be 100 characters or fewer'
    )
  })

  it('rejects a lastName over 100 characters', () => {
    expect(validateContactPayload({ ...validPayload, lastName: 'a'.repeat(101) })).toBe(
      'lastName must be 100 characters or fewer'
    )
  })

  it('rejects a message over 5000 characters', () => {
    expect(validateContactPayload({ ...validPayload, message: 'a'.repeat(5001) })).toBe(
      'message must be 5000 characters or fewer'
    )
  })

  it('accepts a firstName/lastName/message at the exact limits', () => {
    expect(
      validateContactPayload({
        ...validPayload,
        firstName: 'a'.repeat(100),
        lastName: 'a'.repeat(100),
        message: 'a'.repeat(5000),
      })
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

  it('rejects malformed JSON with 400 instead of throwing', async () => {
    const res = await handler(makeRawRequest('{not valid json'))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Request body must be valid JSON')
  })

  it('rejects a payload with a non-string field with a clean 400', async () => {
    const res = await handler(makeRequest({ ...validPayload, firstName: 5 }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('firstName is required')
  })

  it('rejects an oversized message with 400', async () => {
    const res = await handler(makeRequest({ ...validPayload, message: 'a'.repeat(5001) }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('message must be 5000 characters or fewer')
  })

  it('strips newlines from firstName/lastName before building the subject', async () => {
    sendMock.mockResolvedValueOnce({ data: { id: '123' }, error: null })

    await handler(
      makeRequest({
        ...validPayload,
        firstName: 'Jane\r\nBcc: attacker@example.com',
        lastName: 'Doe',
      })
    )

    expect(sendMock).toHaveBeenCalledOnce()
    const sentSubject = sendMock.mock.calls[0][0].subject as string
    expect(sentSubject).not.toMatch(/[\r\n]/)
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

  it('returns 500 and logs the error if Resend fails to send', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const sendError = new Error('network error')
    sendMock.mockRejectedValueOnce(sendError)

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
    expect(consoleErrorSpy).toHaveBeenCalledWith(sendError)
    consoleErrorSpy.mockRestore()
  })

  describe('when RESEND_API_KEY is missing', () => {
    const originalKey = process.env.RESEND_API_KEY

    afterEach(() => {
      process.env.RESEND_API_KEY = originalKey
    })

    it('returns 500 via the catch path instead of throwing unhandled', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      delete process.env.RESEND_API_KEY

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
      expect(consoleErrorSpy).toHaveBeenCalledOnce()
      consoleErrorSpy.mockRestore()
    })
  })
})
