import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import MediaCard from '../components/MediaCard'
import { useFetch } from '../hooks'
import { API_ROUTES, UI } from '../constants'
import { apiPost, apiPut, apiDelete } from '../utils/api'
import { useCurrentUser } from '../contexts/UserContext'

// ── Add Film Modal ────────────────────────────────────────────────────────────
function AddFilmModal({ listId, onClose, onAdded }) {
  const [query, setQuery]         = useState('')
  const [results, setResults]     = useState([])
  const [searching, setSearching] = useState(false)
  const [adding, setAdding]       = useState(null)
  const [added, setAdded]         = useState(new Set())

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    setSearching(true)
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`${API_ROUTES.media}?search=${encodeURIComponent(query)}`)
        const json = await res.json()
        setResults(Array.isArray(json) ? json : [])
      } catch {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, UI.debounceMs)
    return () => clearTimeout(t)
  }, [query])

  const handleAdd = async (mediaId) => {
    setAdding(mediaId)
    try {
      await apiPost(API_ROUTES.listItems(listId), { mediaId })
      setAdded(prev => new Set([...prev, mediaId]))
      onAdded()
    } catch {
      setAdded(prev => new Set([...prev, mediaId]))
    } finally {
      setAdding(null)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-lb-surface border border-lb-border rounded-lg p-6 w-full max-w-lg mx-4 flex flex-col" style={{ maxHeight: '80vh' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-black text-lg">Add film to list</h2>
          <button onClick={onClose} className="text-lb-muted hover:text-white text-xl leading-none">×</button>
        </div>

        <input
          className="input w-full mb-4 shrink-0"
          placeholder="Search your library…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />

        <div className="overflow-y-auto flex-1 space-y-2 pr-1">
          {searching && Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 bg-lb-card rounded animate-pulse" />
          ))}

          {!searching && results.map(film => (
            <div key={film.id} className="flex items-center gap-3 p-2 rounded bg-lb-card hover:bg-lb-border/30 transition-colors">
              <div className="w-8 shrink-0 rounded overflow-hidden" style={{ aspectRatio: '2/3' }}>
                {film.assets?.find(a => a.assetType === 'Poster')?.url
                  ? <img src={film.assets.find(a => a.assetType === 'Poster').url} alt={film.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-lb-surface" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{film.title}</p>
                <p className="text-xs text-lb-muted">
                  {film.releaseDate ? new Date(film.releaseDate).getFullYear() : '—'}
                  <span className="mx-1">·</span>{film.mediaType}
                </p>
              </div>
              <button
                onClick={() => handleAdd(film.id)}
                disabled={added.has(film.id) || adding === film.id}
                className={`btn btn-sm shrink-0 ${added.has(film.id) ? 'btn-secondary opacity-60' : 'btn-accent'}`}
              >
                {adding === film.id ? '…' : added.has(film.id) ? '✓' : '+ Add'}
              </button>
            </div>
          ))}

          {!searching && query.trim() && results.length === 0 && (
            <p className="text-lb-muted text-sm text-center py-4">
              No results. <Link to="/films" onClick={onClose} className="text-lb-accent hover:underline">Import films</Link> first.
            </p>
          )}
          {!query.trim() && (
            <p className="text-lb-muted text-sm text-center py-4">Type to search your imported library.</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Edit List Modal ───────────────────────────────────────────────────────────
function EditListModal({ list, onClose, onSaved }) {
  const [name, setName]         = useState(list.name)
  const [desc, setDesc]         = useState(list.description ?? '')
  const [isPublic, setIsPublic] = useState(list.isPublic)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError(null)
    try {
      const updated = await apiPut(API_ROUTES.listById(list.id), {
        name: name.trim(),
        description: desc.trim() || null,
        isPublic,
      })
      onSaved(updated)
      onClose()
    } catch {
      setError('Failed to save changes.')
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
        <h2 className="text-white font-black text-xl mb-5">Edit list</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-lb-muted uppercase tracking-wide mb-1 block">Name</label>
            <input
              className="input w-full"
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
              {loading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ListDetail() {
  const { id }          = useParams()
  const { currentUser } = useCurrentUser()
  const navigate        = useNavigate()

  const [showAddFilm, setShowAddFilm]   = useState(false)
  const [showEdit, setShowEdit]         = useState(false)
  const [comment, setComment]           = useState('')
  const [posting, setPosting]           = useState(false)
  const [localComments, setLocalComments] = useState(null)
  const [itemsVersion, setItemsVersion]   = useState(0)
  const [localList, setLocalList]         = useState(null)
  const [localItems, setLocalItems]       = useState(null)

  const { data: fetchedList, loading: listLoading } = useFetch(API_ROUTES.listById(id))
  const { data: fetchedItems, loading: itemsLoading } = useFetch(
    `${API_ROUTES.listItems(id)}?v=${itemsVersion}`
  )
  const { data: fetchedComments, loading: commentsLoading } = useFetch(API_ROUTES.comments(id))

  const list     = localList  ?? fetchedList
  const filmList = localItems ?? fetchedItems ?? []
  const comments = localComments ?? fetchedComments ?? []

  // Sync fetched items into local state once loaded
  useEffect(() => {
    if (fetchedItems && localItems === null) setLocalItems(fetchedItems)
  }, [fetchedItems]) // eslint-disable-line react-hooks/exhaustive-deps

  const isOwner = currentUser && list && currentUser.id === list.userId

  const handlePostComment = async () => {
    if (!comment.trim() || !currentUser) return
    setPosting(true)
    try {
      const newComment = await apiPost(API_ROUTES.comments(id), {
        content: comment.trim(),
      })
      setLocalComments([...(fetchedComments ?? []), newComment])
      setComment('')
    } finally {
      setPosting(false)
    }
  }

  const handleRemoveItem = async (mediaId) => {
    setLocalItems(prev => (prev ?? fetchedItems ?? []).filter(i => i.mediaId !== mediaId))
    try {
      await apiDelete(`${API_ROUTES.listItems(id)}/${mediaId}`)
      setItemsVersion(v => v + 1)
    } catch {
      setLocalItems(null) // revert to server state on error
    }
  }

  const handleSaved = (updated) => {
    setLocalList(updated)
  }

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${list.name}"? This cannot be undone.`)) return
    await apiDelete(API_ROUTES.listById(id))
    navigate('/lists')
  }

  if (listLoading && !list) {
    return (
      <div className="page-container py-12 space-y-4 animate-pulse">
        <div className="h-8 bg-lb-card rounded w-64" />
        <div className="h-4 bg-lb-card rounded w-48" />
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mt-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="media-card bg-lb-card" />
          ))}
        </div>
      </div>
    )
  }

  if (!list) {
    return (
      <div className="page-container py-24 text-center">
        <p className="text-lb-muted mb-4">List not found.</p>
        <Link to="/lists" className="btn btn-secondary btn-md">Back to lists</Link>
      </div>
    )
  }

  return (
    <div className="page-container py-8">

      {/* List header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">{list.name}</h1>
            {list.description && (
              <p className="text-lb-muted text-sm mt-2 max-w-2xl leading-relaxed">{list.description}</p>
            )}
            <div className="flex items-center gap-3 mt-3 text-xs text-lb-muted">
              <span>{filmList.length} film{filmList.length !== 1 ? 's' : ''}</span>
              <span>·</span>
              <span className={`px-2 py-0.5 rounded border ${list.isPublic
                ? 'border-lb-green/40 text-lb-green'
                : 'border-lb-border text-lb-muted'}`}
              >
                {list.isPublic ? 'Public' : 'Private'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isOwner && (
              <>
                <button onClick={() => setShowEdit(true)} className="btn btn-secondary btn-sm">
                  Edit
                </button>
                <button onClick={handleDelete} className="btn btn-sm text-red-400 border border-red-900 hover:bg-red-900/30">
                  Delete
                </button>
              </>
            )}
            {isOwner && (
              <button onClick={() => setShowAddFilm(true)} className="btn btn-primary btn-sm">
                + Add film
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Films grid */}
      {itemsLoading && localItems === null ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="media-card animate-pulse bg-lb-card" />
          ))}
        </div>
      ) : filmList.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3">
          {filmList.map(item => (
            <div key={item.mediaId} className="relative group">
              <MediaCard id={item.mediaId} title={item.mediaTitle} posterUrl={item.posterUrl} />
              {isOwner && (
                <button
                  onClick={() => handleRemoveItem(item.mediaId)}
                  className="absolute top-1 left-1 w-5 h-5 rounded-full bg-black/70 text-white text-xs hidden group-hover:flex items-center justify-center hover:bg-red-600 transition-colors z-20"
                  title="Remove from list"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-lb-border/40 rounded">
          <p className="text-lb-muted text-sm mb-4">This list is empty.</p>
          {isOwner
            ? <button onClick={() => setShowAddFilm(true)} className="btn btn-primary btn-md">Add a film</button>
            : <p className="text-lb-muted text-xs">Sign in as the owner to add films.</p>
          }
        </div>
      )}

      <div className="divider" />

      {/* Comments */}
      <div className="max-w-2xl">
        <h2 className="section-label">Discussion</h2>

        {currentUser ? (
          <div className="flex gap-3 mb-6">
            <textarea
              className="input flex-1 resize-none"
              rows={2}
              placeholder="Add a comment…"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <button
              onClick={handlePostComment}
              className="btn btn-primary btn-md self-end"
              disabled={!comment.trim() || posting}
            >
              {posting ? '…' : 'Post'}
            </button>
          </div>
        ) : (
          <p className="text-lb-muted text-sm mb-6">
            Sign in to join the discussion.
          </p>
        )}

        {commentsLoading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2].map(i => <div key={i} className="h-14 bg-lb-card rounded" />)}
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map(c => (
              <div key={c.id} className="flex gap-3">
                <Link
                  to={`/users/${c.userId}`}
                  className="w-8 h-8 rounded-full bg-lb-surface flex items-center justify-center text-xs font-bold text-lb-accent shrink-0 hover:ring-1 hover:ring-lb-accent transition-all"
                >
                  {c.username?.[0]?.toUpperCase() ?? '?'}
                </Link>
                <div>
                  <div className="flex items-baseline gap-2">
                    <Link to={`/users/${c.userId}`} className="text-sm font-semibold text-white hover:text-lb-accent transition-colors">
                      {c.username}
                    </Link>
                    <span className="text-xs text-lb-muted">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-lb-text mt-0.5 leading-relaxed">{c.content}</p>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-lb-muted text-sm">No comments yet. Be the first!</p>
            )}
          </div>
        )}
      </div>

      {showAddFilm && (
        <AddFilmModal
          listId={id}
          onClose={() => setShowAddFilm(false)}
          onAdded={() => {
            setItemsVersion(v => v + 1)
            setLocalItems(null)
          }}
        />
      )}
      {showEdit && (
        <EditListModal
          list={list}
          onClose={() => setShowEdit(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
