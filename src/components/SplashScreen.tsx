import { useEffect, useState } from 'react'
import logoMark from '../assets/brand/A-green.png'

const SESSION_KEY = 'alioth-splash-seen'
const HOLD_MS = 1000
const FADE_MS = 400

function hasSeenSplash(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    // Storage blocked (private-mode edge cases) — treat as "seen" so the
    // splash fails quiet rather than reappearing on every navigation.
    return true
  }
}

function markSplashSeen() {
  try {
    sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    // Nothing to do if storage is blocked — see hasSeenSplash above.
  }
}

// Rendered once at the app root (see App.tsx), not per-route, so it only
// ever runs through its hold/fade cycle once per browser session — icon
// only, on cream, per the approved design in docs/checklist.md.
export default function SplashScreen() {
  const [phase, setPhase] = useState<'hidden' | 'visible' | 'fading'>('hidden')

  useEffect(() => {
    if (hasSeenSplash()) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      markSplashSeen()
      return
    }

    setPhase('visible')
    const holdTimer = setTimeout(() => setPhase('fading'), HOLD_MS)
    const removeTimer = setTimeout(() => {
      markSplashSeen()
      setPhase('hidden')
    }, HOLD_MS + FADE_MS)

    return () => {
      clearTimeout(holdTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (phase === 'hidden') return null

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-cream transition-opacity duration-[400ms] ease-out ${
        phase === 'fading' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <img src={logoMark} alt="" className="w-20 md:w-28" />
    </div>
  )
}
