export const GLOBAL_SHORTCUTS = [
  { key: '/', description: 'Suche fokussieren (Filme-Seite)' },
  { key: 'w', description: 'Watchlist an/aus (Film-Detailseite)' },
  { key: 'l', description: '"Zur Liste hinzufügen" öffnen (Film-Detailseite)' },
  { key: '?', description: 'Tastenkürzel anzeigen' },
]

export default function KeyboardShortcutsModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-lb-surface border border-lb-border rounded-xl p-8 w-full max-w-sm mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-black text-lg">Tastenkürzel</h2>
          <button onClick={onClose} className="text-lb-muted hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          {GLOBAL_SHORTCUTS.map(({ key, description }) => (
            <div key={key} className="flex items-center gap-4">
              <kbd
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded border border-lb-border bg-lb-card text-white text-sm font-mono font-bold"
              >
                {key === '/' ? '/' : key}
              </kbd>
              <span className="text-lb-muted text-sm">{description}</span>
            </div>
          ))}
        </div>

        <p className="text-lb-muted/40 text-xs mt-6 text-center">
          Kürzel deaktiviert wenn Textfeld aktiv
        </p>
      </div>
    </div>
  )
}
