import { useState, useEffect } from 'react'
import ListCard from '../components/ListCard'
import Pagination from '../components/Pagination'
import { useFetch, useScrollReveal } from '../hooks'
import { API_ROUTES, UI } from '../constants'
import { apiPost } from '../utils/api'
import { useCurrentUser } from '../contexts/UserContext'
import { useToast } from '../contexts/ToastContext'

function CreateListModal({ onClose, onCreated }) {
  const [name, setName]         = useState('')
  const [desc, setDesc]         = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError(null)
    try {
      const list = await apiPost(API_ROUTES.lists, {
        name: name.trim(),
        description: desc.trim() || null,
        isPublic,
      })
      onCreated(list)
      onClose()
    } catch {
      setError('Failed to create list. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-lb-surface border border-lb-border rounded-xl p-6 w-full max-w-md mx-4">
        <h2 className="display text-3xl text-white mb-5">Neue Liste</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-lb-muted uppercase tracking-widest mb-1.5 block">Name</label>
            <input
              className="input w-full"
              placeholder="z.B. Beste Filme 2024"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={100}
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs text-lb-muted uppercase tracking-widest mb-1.5 block">Beschreibung (optional)</label>
            <textarea
              className="input w-full resize-none"
              rows={3}
              placeholder="Worum geht's in dieser Liste?"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              maxLength={1000}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={e => setIsPublic(e.target.checked)}
              className="accent-lb-accent"
            />
            <span className="text-sm text-lb-text">Liste öffentlich machen</span>
          </label>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-3 justify-end pt-1">
            <button type="button" onClick={onClose} className="btn btn-secondary btn-md">Abbrechen</button>
            <button type="submit" disabled={!name.trim() || loading} className="btn btn-primary btn-md">
              {loading ? 'Erstelle…' : 'Liste erstellen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Lists() {
  const { currentUser } = useCurrentUser()
  const { showToast }   = useToast()
  const [search, setSearch]         = useState('')
  const [page, setPage]             = useState(1)
  const [showCreate, setShowCreate] = useState(false)
  const [localLists, setLocalLists] = useState(null)

  const { data, loading, error } = useFetch(API_ROUTES.lists)

  useEffect(() => {
    if (data && localLists === null) setLocalLists(data)
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  const lists    = localLists ?? data ?? []
  const filtered = lists.filter(l => l.name.toLowerCase().includes(search.toLowerCase()))
  const paged    = filtered.slice((page - 1) * UI.itemsPerPage, page * UI.itemsPerPage)

  const handleCreated = (newList) => {
    setLocalLists(prev => [...(prev ?? data ?? []), newList])
    showToast(`Liste "${newList.name}" erstellt`)
  }

  const gridRef = useScrollReveal()

  return (
    <div>
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a2535 0%, #14181c 70%)' }}
      >
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, #40bcf4 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        {/* Ghost logo watermark */}
        <div
          className="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none"
          aria-hidden="true"
        >
          <img
            src="/logo.png"
            alt=""
            style={{
              height: '200px',
              width: 'auto',
              opacity: 0.04,
              mixBlendMode: 'screen',
              filter: 'saturate(0)',
              transform: 'translateX(20%)',
            }}
          />
        </div>

        <div className="page-container relative py-12">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            <div>
              <p className="section-label text-lb-accent tracking-[0.25em] mb-2">Kuratiert</p>
              <h1 className="display text-6xl text-white leading-none">Listen</h1>
              <p className="text-lb-muted text-sm mt-2">
                {loading
                  ? 'Lade…'
                  : `${filtered.length} Liste${filtered.length !== 1 ? 'n' : ''}`}
              </p>
            </div>

            <div className="sm:ml-auto flex items-center gap-3">
              <input
                className="input w-full sm:w-64"
                placeholder="Listen suchen…"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
              />
              <button
                onClick={() => currentUser ? setShowCreate(true) : null}
                className={`btn btn-primary btn-md shrink-0 ${!currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={!currentUser ? 'Einloggen um eine Liste zu erstellen' : undefined}
              >
                + Neu
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="page-container py-8">
        {!currentUser && (
          <p className="text-lb-muted text-sm mb-6 bg-lb-card border border-lb-border/40 rounded-lg px-4 py-3">
            <span className="text-white">Einloggen</span> (oben rechts) um Listen zu erstellen und verwalten.
          </p>
        )}

        {error && (
          <p className="text-red-400 text-sm mb-6 bg-red-900/20 border border-red-800 rounded-lg px-4 py-3">
            Listen konnten nicht geladen werden — läuft das Backend?
          </p>
        )}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-lb-card rounded-xl animate-pulse h-40 border border-lb-border/20" />
            ))}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <>
            <div
              ref={gridRef}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 scroll-reveal reveal-up"
            >
              {paged.map(list => (
                <ListCard
                  key={list.id}
                  id={list.id}
                  name={list.name}
                  description={list.description}
                  itemCount={list.itemCount}
                  coverPosters={list.coverPosters ?? []}
                />
              ))}
            </div>
            <Pagination total={filtered.length} page={page} onPageChange={setPage} />
          </>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-24 border border-lb-border/20 rounded-2xl">
            <div
              className="display text-lb-muted/20 mb-3 select-none"
              style={{ fontSize: 'clamp(4rem, 12vw, 8rem)', lineHeight: 1 }}
            >
              LEER
            </div>
            <p className="text-lb-muted text-sm">
              {search ? `Keine Listen für "${search}"` : 'Noch keine Listen. Erstell die erste!'}
            </p>
          </div>
        )}
      </div>

      {showCreate && (
        <CreateListModal
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  )
}
