import { createContext, useContext, useState, useCallback } from 'react'
import { UI } from '../constants'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), UI.toastDuration)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium shadow-xl pointer-events-auto
              animate-[fadeInUp_0.15s_ease-out]
              ${t.type === 'error'
                ? 'bg-red-950 border border-red-800 text-red-200'
                : 'bg-lb-surface border border-lb-border text-white'
              }`}
          >
            {t.type === 'success' && <span className="text-lb-green mr-2">✓</span>}
            {t.type === 'error'   && <span className="text-red-400 mr-2">✕</span>}
            {message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
