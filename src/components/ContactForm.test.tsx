import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import ContactForm from './ContactForm'

function fillForm() {
  fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'Jane' } })
  fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } })
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@example.com' } })
  fireEvent.change(screen.getByLabelText('How can we help you?'), {
    target: { value: 'Tell me more' },
  })
}

describe('ContactForm', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('submits the entered values with the given source to /api/contact', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) })
    vi.stubGlobal('fetch', fetchMock)

    render(<ContactForm source="home" />)
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/contact')
    expect(JSON.parse(options.body)).toEqual({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      message: 'Tell me more',
      source: 'home',
    })
  })

  it('shows a thank-you message after a successful submission', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) }))

    render(<ContactForm source="contact-page" />)
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    expect(await screen.findByRole('status')).toHaveTextContent(/thanks/i)
  })

  it('shows the server error message when submission fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: 'a valid email is required' }) })
    )

    render(<ContactForm source="home" />)
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('a valid email is required')
  })

  it('shows a generic error message when the network request throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))

    render(<ContactForm source="home" />)
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/something went wrong/i)
  })
})
