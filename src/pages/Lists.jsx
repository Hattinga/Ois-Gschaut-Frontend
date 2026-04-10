import { useState, useEffect } from 'react'
import ListCard from '../components/ListCard'
import { useFetch } from '../hooks'
import { API_ROUTES } from '../constants'
import { apiPost } from '../utils/api'
import { useCurrentUser } from '../contexts/UserContext'
import { useToast } from '../contexts/ToastContext'

function CreateListModal({ onClose, onCreated }) {
  const { currentUser } = useCurrentUser()
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
      <div className="bg-lb-surface border border-lb-border rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-white font-black text-xl mb-5">New list</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-lb-muted uppercase tracking-wide mb-1 block">Name</label>
            <input
              className="input w-full"
              placeholder="e.g. Best of 2024"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={100}
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs text-lb-muted uppercase tracking-wide mb-1 block">Description (optional)</label>
            <textarea
              className="input w-full resize-none"
              rows={3}
              placeholder="What's this list about?"
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
            <span className="text-sm text-lb-text">Make this list public</span>
          </label>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-3 justify-end pt-1">
            <button type="button" onClick={onClose} className="btn btn-secondary btn-md">Cancel</button>
            <button type="submit" disabled={!name.trim() || loading} className="btn btn-primary btn-md">
              {loading ? 'Creating…' : 'Create list'}
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
  const [showCreate, setShowCreate] = useState(false)
  const [localLists, setLocalLists] = useState(null)

  const { data, loading, error } = useFetch(API_ROUTES.lists)

  // Seed local state once server data arrives
  useEffect(() => {
    if (data && localLists === null) setLocalLists(data)
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  const lists = localLists ?? data ?? []

  const filtered = lists.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreated = (newList) => {
    setLocalLists(prev => [...(prev ?? data ?? []), newList])
    showToast(`List "${newList.name}" created`)
  }

  return (
    <div className="page-container py-8">

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Lists</h1>
          <p className="text-lb-muted text-sm mt-0.5">
            {loading ? 'Loading…' : `${filtered.length} list${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        <div className="flex-1 sm:max-w-xs sm:ml-auto">
          <input
            className="input w-full"
            placeholder="Search lists…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={() => currentUser ? setShowCreate(true) : null}
          className={`btn btn-primary btn-md shrink-0 ${!currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={!currentUser ? 'Sign in to create a list' : undefined}
        >
          + New list
        </button>
      </div>

      {!currentUser && (
        <p className="text-lb-muted text-sm mb-6 bg-lb-card border border-lb-border rounded px-4 py-3">
          <span className="text-white">Sign in</span> (top right) to create and manage lists.
        </p>
      )}

      {error && (
        <p className="text-red-400 text-sm mb-6 bg-red-900/20 border border-red-800 rounded px-4 py-3">
          Could not load lists — is the backend running?
        </p>
      )}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-lb-card rounded animate-pulse h-40" />
          ))}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map(list => (
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
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-24">
          <p className="text-lb-muted text-sm">
            {search ? `No lists matching "${search}"` : 'No lists yet. Create the first one!'}
          </p>
        </div>
      )}

      {showCreate && (
        <CreateListModal
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  )
}
