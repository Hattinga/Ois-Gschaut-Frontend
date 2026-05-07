import { useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import KeyboardShortcutsModal from './KeyboardShortcutsModal'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'

function Layout({ children }) {
  const [showShortcuts, setShowShortcuts] = useState(false)

  useKeyboardShortcuts([
    { key: '?', action: () => setShowShortcuts(s => !s) },
  ])

  return (
    <div className="flex flex-col min-h-screen bg-lb-bg">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      {showShortcuts && <KeyboardShortcutsModal onClose={() => setShowShortcuts(false)} />}
    </div>
  )
}

export default Layout
