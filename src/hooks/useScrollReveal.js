import { useCallback, useRef } from 'react'

export function useScrollReveal({ threshold = 0.15, once = true } = {}) {
  const observerRef = useRef(null)

  const ref = useCallback((el) => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        if (once) observer.unobserve(entry.target)
      } else if (!once) {
        entry.target.classList.remove('visible')
      }
    }, { threshold })

    observer.observe(el)
    observerRef.current = observer
  }, [threshold, once])

  return ref
}
