import { describe, it, expect } from 'vitest'
import tailwindConfig from '../../tailwind.config.js'

describe('tailwind design tokens', () => {
  it('defines the Alioth brand color palette', () => {
    const colors = tailwindConfig.theme.extend.colors
    expect(colors.black).toBe('#0E0D0B')
    expect(colors.ink).toBe('#15140F')
    expect(colors.cream).toBe('#F1E9DA')
    expect(colors['cream-deep']).toBe('#E6DAC2')
    expect(colors['cream-soft']).toBe('#F7F2E8')
    expect(colors.green).toBe('#1B3B2F')
    expect(colors['green-bright']).toBe('#27513F')
    expect(colors['green-deep']).toBe('#0F2A20')
  })

  it('defines the Alioth brand type stack', () => {
    const fonts = tailwindConfig.theme.extend.fontFamily
    expect(fonts.serif[0]).toBe('"Cormorant Garamond"')
    expect(fonts.sans[0]).toBe('Archivo')
    expect(fonts.mono[0]).toBe('"Space Mono"')
    expect(fonts.display[0]).toBe('"Playfair Display"')
  })
})
