import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import ContactForm from './ContactForm'

/** Fills the name + email steps and advances to the final message step. */
function advanceToMessageStep() {
  fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'Jane' } })
  fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } })
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@example.com' } })
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
}

function fillForm() {
  advanceToMessageStep()
  fireEvent.change(screen.getByLabelText('How can we help you?'), { target: { value: 'Tell me more' } })
}

describe('ContactForm', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('starts on the name step and walks through name, email, then message', () => {
    render(<ContactForm source="home" />)
    expect(screen.getByLabelText('First Name')).toBeInTheDocument()
    expect(screen.queryByLabelText('Email')).not.toBeInTheDocument()

    advanceToMessageStep()
    expect(screen.getByLabelText('How can we help you?')).toBeInTheDocument()
    expect(screen.queryByLabelText('Email')).not.toBeInTheDocument()
  })

  it('personalizes later steps with the first name entered', () => {
    render(<ContactForm source="home" />)
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'Sarah' } })
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Smith' } })
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

    expect(screen.getByText(/Nice to meet you, Sarah!/)).toBeInTheDocument()
  })

  it('lets the user go back a step', () => {
    render(<ContactForm source="home" />)
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'Jane' } })
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } })
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByLabelText('Email')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByLabelText('First Name')).toBeInTheDocument()
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

  it('shows a personalized thank-you message after a successful submission', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) }))

    render(<ContactForm source="contact-page" />)
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    expect(await screen.findByRole('status')).toHaveTextContent(/thanks, jane/i)
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

  it('renders the button with bg-green by default (light tone, used on /contact)', () => {
    render(<ContactForm source="contact-page" />)
    advanceToMessageStep()
    expect(screen.getByRole('button', { name: 'Send' })).toHaveClass('bg-green')
  })

  it('uses cream success text and a cream button on a dark tone', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) }))

    render(<ContactForm source="home" tone="dark" />)
    advanceToMessageStep()
    expect(screen.getByRole('button', { name: 'Send' })).toHaveClass('bg-cream')
    fireEvent.change(screen.getByLabelText('How can we help you?'), { target: { value: 'Tell me more' } })
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    expect(await screen.findByRole('status')).toHaveTextContent(/thanks/i)
  })

  it('uses readable red error text on a dark tone', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: 'a valid email is required' }) })
    )

    render(<ContactForm source="home" tone="dark" />)
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    expect(await screen.findByRole('alert')).toHaveClass('text-red-300')
  })
})
