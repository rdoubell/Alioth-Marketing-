import { useEffect, useState } from 'react'

interface UseTypewriterOptions {
  words: string[]
  typingSpeedMs?: number
  deletingSpeedMs?: number
  pauseMs?: number
}

/**
 * Cycles through a list of words with a type-then-delete effect, looping
 * forever. Skips the animation (and just shows the first word) when the
 * user prefers reduced motion.
 */
export function useTypewriter({
  words,
  typingSpeedMs = 80,
  deletingSpeedMs = 40,
  pauseMs = 1500,
}: UseTypewriterOptions): string {
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (words.length === 0) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(words[0])
      return
    }

    const currentWord = words[wordIndex % words.length]

    if (!isDeleting && text === currentWord) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseMs)
      return () => clearTimeout(timeout)
    }

    if (isDeleting && text === '') {
      setIsDeleting(false)
      setWordIndex((i) => (i + 1) % words.length)
      return
    }

    const nextText = isDeleting
      ? currentWord.slice(0, text.length - 1)
      : currentWord.slice(0, text.length + 1)
    const timeout = setTimeout(
      () => setText(nextText),
      isDeleting ? deletingSpeedMs : typingSpeedMs
    )
    return () => clearTimeout(timeout)
  }, [text, isDeleting, wordIndex, words, typingSpeedMs, deletingSpeedMs, pauseMs])

  return text
}
