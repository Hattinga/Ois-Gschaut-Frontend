import { useEffect } from 'react'

const IGNORED_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

/**
 * Register global keyboard shortcuts.
 * shortcuts: Array<{ key: string, action: () => void, description?: string }>
 * Shortcuts are ignored when user is typing in an input.
 */
export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    if (!shortcuts?.length) return

    const handler = (e) => {
      if (IGNORED_TAGS.has(e.target.tagName)) return
      if (e.ctrlKey || e.metaKey || e.altKey) return

      const match = shortcuts.find(s => s.key === e.key)
      if (match) {
        e.preventDefault()
        match.action()
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [shortcuts])
}
