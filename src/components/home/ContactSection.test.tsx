import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ContactSection from './ContactSection'

describe('ContactSection', () => {
  it('renders the section heading and the shared contact form fields', () => {
    render(<ContactSection />)
    expect(screen.getByRole('heading', { name: 'Start the Conversation' })).toBeInTheDocument()
    expect(screen.getByLabelText('First Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument()
  })

  it('renders the contact form with the dark tone so it is readable on the green background', () => {
    render(<ContactSection />)
    expect(screen.getByRole('button', { name: 'Send' })).toHaveClass('bg-cream')
  })
})
