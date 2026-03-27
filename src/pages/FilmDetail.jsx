import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useFetch } from '../hooks'
import { API_ROUTES } from '../constants'
import { apiPost, apiDelete } from '../utils/api'
import { useCurrentUser } from '../contexts/UserContext'

// ── Rating badge ──────────────────────────────────────────────────────────────
function RatingBadge({ source, score }) {
  const pct   = Math.round((score / 10) * 100)
  const color = pct >= 70 ? '#00e054' : pct >= 40 ? '#ff8000' : '#e94057'
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white"
        style={{ background: `conic-gradient(${color} ${pct}%, #2c3440 0)` }}
      >
        {score}
      </div>
      <span className="text-[10px] text-lb-muted uppercase tracking-wide">{source}</span>
    </div>
  )
}

function PosterPlaceholder({ title }) {
  const hue = [...(title ?? '')].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
  return (
    <div
      className="w-full h-full flex items-center justify-center rounded"
      style={{ background: `linear-gradient(135deg, hsl(${hue},30%,18%), hsl(${hue + 40},20%,12%))` }}
    >
      <svg className="w-12 h-12 text-lb-muted/30" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3ZM8 7h2v2H8Zm6 0h2v2h-2ZM5 17l3.5-4.5 2.5 3 3.5-4.5L19 17Z" />
      </svg>
    </div>
  )
}

// ── Add to list modal ─────────────────────────────────────────────────────────
function AddToListModal({ mediaId, onClose }) {
  const { currentUser } = useCurrentUser()
  const { data: allLists } = useFetch(API_ROUTES.lists)
  const [adding, setAdding]   = useState(null)
  const [added, setAdded]     = useState(new Set())

  const myLists = (allLists ?? []).filter(l => l.userId === currentUser?.id)

  const handleAdd = async (listId) => {
    setAdding(listId)
    try {
      await apiPost(API_ROUTES.listItems(listId), { mediaId })
      setAdded(prev => new Set([...prev, listId]))
    } catch {
      // 409 = already in list — treat as success
      setAdded(prev => new Set([...prev, listId]))
    } finally {
      setAdding(null)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-lb-surface border border-lb-border rounded-lg p-6 w-full max-w-sm mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-black text-lg">Add to list</h2>
          <button onClick={onClose} className="text-lb-muted hover:text-white text-xl leading-none">×</button>
        </div>

        {myLists.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-lb-muted text-sm mb-4">You have no lists yet.</p>
            <Link to="/lists" onClick={onClose} className="btn btn-primary btn-sm">Create a list</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {myLists.map(list => (
              <div key={list.id} className="flex items-center justify-between gap-3 p-2 rounded bg-lb-card">
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">{list.name}</p>
                  <p className="text-xs text-lb-muted">{list.itemCount} film{list.itemCount !== 1 ? 's' : ''}</p>
                </div>
                <button
                  onClick={() => handleAdd(list.id)}
                  disabled={added.has(list.id) || adding === list.id}
                  className={`btn btn-sm shrink-0 ${added.has(list.id) ? 'btn-secondary opacity-60' : 'btn-accent'}`}
                >
                  {adding === list.id ? '…' : added.has(list.id) ? '✓' : '+ Add'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Episodes section ──────────────────────────────────────────────────────────
function EpisodesSection({ mediaId, watchedSeasons, onToggleWatched }) {
  const [activeSeason, setActiveSeason] = useState(1)
  const [syncing, setSyncing]           = useState(false)
  const [syncError, setSyncError]       = useState(null)
  const [episodes, setEpisodes]         = useState(null) // null = not loaded yet

  // Fetch episodes once
  useEffect(() => {
    fetch(API_ROUTES.episodes(mediaId))
      .then(r => r.json())
      .then(data => setEpisodes(Array.isArray(data) ? data : []))
      .catch(() => setEpisodes([]))
  }, [mediaId])

  // Auto-sync when loaded and empty
  useEffect(() => {
    if (episodes !== null && episodes.length === 0 && !syncing) {
      handleSync()
    }
  }, [episodes]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSync = async () => {
    setSyncing(true)
    setSyncError(null)
    try {
      const resp = await fetch(API_ROUTES.syncEpisodes(mediaId), { method: 'POST' })
      if (!resp.ok) {
        const text = await resp.text()
        setSyncError(text || 'Sync failed — TVMaze may not have this show.')
      } else {
        // Reload episodes after sync
        const updated = await fetch(API_ROUTES.episodes(mediaId)).then(r => r.json())
        setEpisodes(Array.isArray(updated) ? updated : [])
      }
    } catch {
      setSyncError('Network error during sync.')
    } finally {
      setSyncing(false)
    }
  }

  const seasons = episodes ? [...new Set(episodes.map(e => e.season))].sort((a, b) => a - b) : []

  // Set active season to first available when data loads
  useEffect(() => {
    if (seasons.length > 0 && !seasons.includes(activeSeason)) {
      setActiveSeason(seasons[0])
    }
  }, [seasons.length]) // eslint-disable-line react-hooks/exhaustive-deps

  if (episodes === null || syncing) {
    return (
      <div className="pb-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="section-label mb-0">Episodes</h2>
          <span className="text-lb-muted text-xs">{syncing ? 'Syncing from TVMaze…' : 'Loading…'}</span>
        </div>
        <div className="h-20 bg-lb-card rounded animate-pulse" />
      </div>
    )
  }

  if (episodes.length === 0) {
    return (
      <div className="pb-8 text-center py-10 border border-lb-border/40 rounded">
        {syncError
          ? <p className="text-red-400 text-sm">{syncError}</p>
          : <p className="text-lb-muted text-sm">No episodes found.</p>
        }
      </div>
    )
  }

  const visible = episodes.filter(e => e.season === activeSeason)

  return (
    <div className="pb-8">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <h2 className="section-label mb-0">Episodes</h2>
        <div className="flex gap-2 flex-wrap">
          {seasons.map(s => {
            const isWatched = watchedSeasons?.includes(s)
            return (
              <button
                key={s}
                onClick={() => setActiveSeason(s)}
                className={`btn btn-sm relative ${activeSeason === s ? 'btn-accent' : 'btn-secondary'}`}
              >
                S{s}
                {isWatched && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-lb-green text-[8px] flex items-center justify-center text-white font-bold">✓</span>
                )}
              </button>
            )
          })}
        </div>
        {onToggleWatched && (
          <button
            onClick={() => onToggleWatched(activeSeason)}
            className={`btn btn-sm ml-auto ${watchedSeasons?.includes(activeSeason) ? 'btn-accent' : 'btn-secondary'}`}
          >
            {watchedSeasons?.includes(activeSeason) ? `✓ S${activeSeason} watched` : `Mark S${activeSeason} watched`}
          </button>
        )}
      </div>

      <div className="space-y-1">
        {visible.map(ep => (
          <div key={ep.id} className="flex items-baseline gap-3 py-2 border-b border-lb-border/40">
            <span className="text-lb-muted text-xs w-12 shrink-0">E{ep.numberInSeason}</span>
            <span className="text-sm text-lb-text">{ep.title}</span>
            {ep.airDate && (
              <span className="text-lb-muted text-xs ml-auto shrink-0">
                {new Date(ep.airDate).toLocaleDateString()}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FilmDetail() {
  const { id }          = useParams()
  const { currentUser } = useCurrentUser()
  const [showAddToList, setShowAddToList] = useState(false)
  const [watchedSeasons, setWatchedSeasons] = useState(null) // null = not loaded

  const { data: film, loading, error } = useFetch(API_ROUTES.mediaById(id))

  // Load watched status for current user + this media
  useEffect(() => {
    if (!currentUser || !id) return
    fetch(`${API_ROUTES.watched}?userId=${currentUser.id}&mediaId=${id}`)
      .then(r => r.json())
      .then(entries => setWatchedSeasons((entries ?? []).map(e => e.season)))
      .catch(() => setWatchedSeasons([]))
  }, [currentUser, id])

  const handleToggleWatched = async (season) => {
    if (!currentUser) return
    const isWatched = watchedSeasons?.includes(season)
    if (isWatched) {
      await apiDelete(`${API_ROUTES.watched}?userId=${currentUser.id}&mediaId=${id}&season=${season}`)
      setWatchedSeasons(prev => prev.filter(s => s !== season))
    } else {
      await apiPost(API_ROUTES.watched, { userId: currentUser.id, mediaId: Number(id), season })
      setWatchedSeasons(prev => [...(prev ?? []), season])
    }
  }

  if (loading) {
    return (
      <div className="page-container py-12 flex gap-8 animate-pulse">
        <div className="w-48 shrink-0 rounded bg-lb-card" style={{ aspectRatio: '2/3' }} />
        <div className="flex-1 space-y-3 pt-2">
          <div className="h-8 bg-lb-card rounded w-64" />
          <div className="h-4 bg-lb-card rounded w-32" />
          <div className="h-20 bg-lb-card rounded w-full mt-4" />
        </div>
      </div>
    )
  }

  if (error || !film) {
    return (
      <div className="page-container py-24 text-center">
        <p className="text-lb-muted mb-4">Film not found.</p>
        <Link to="/films" className="btn btn-secondary btn-md">Back to films</Link>
      </div>
    )
  }

  const poster   = film.assets?.find(a => a.assetType === 'Poster')?.url
  const backdrop = film.assets?.find(a => a.assetType === 'Backdrop')?.url
  const year     = film.releaseDate ? new Date(film.releaseDate).getFullYear() : null
  const isMovie  = film.mediaType === 'Movie'
  const isWatchedMovie = watchedSeasons?.includes(0)

  return (
    <div>
      {/* Backdrop */}
      <div className="relative w-full h-48 md:h-72 overflow-hidden">
        {backdrop ? (
          <>
            <img src={backdrop} alt="" className="w-full h-full object-cover object-top" loading="eager" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 30%, #14181c)' }} />
          </>
        ) : (
          <div className="w-full h-full" style={{ background: 'linear-gradient(160deg, #1f2a38, #14181c)' }} />
        )}
      </div>

      <div className="page-container">
        {/* Poster + meta */}
        <div className="flex flex-col md:flex-row gap-8 -mt-24 md:-mt-32 relative z-10 pb-8">

          <div className="w-40 md:w-52 shrink-0" style={{ aspectRatio: '2/3' }}>
            {poster
              ? <img src={poster} alt={film.title} className="w-full h-full object-cover rounded shadow-2xl" />
              : <PosterPlaceholder title={film.title} />
            }
          </div>

          <div className="pt-4 md:pt-32 flex-1">
            <h1 className="text-3xl md:text-4xl font-black text-white">
              {film.title}
              {year && <span className="text-lb-muted font-normal text-2xl ml-3">{year}</span>}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-lb-muted">
              <span className="border border-lb-border px-2 py-0.5 rounded text-xs">{film.mediaType}</span>
              {film.genre      && <span>{film.genre}</span>}
              {film.runtimeMin && <span>{film.runtimeMin} min</span>}
              {film.status     && <span className="capitalize">{film.status}</span>}
            </div>

            {film.ratings?.length > 0 && (
              <div className="flex gap-5 mt-5">
                {film.ratings.map(r => (
                  <RatingBadge key={r.source} source={r.source} score={r.score} />
                ))}
              </div>
            )}

            {film.plot && (
              <p className="text-lb-text text-sm leading-relaxed mt-5 max-w-2xl">{film.plot}</p>
            )}

            {/* Actions */}
            {currentUser ? (
              <div className="flex gap-3 mt-6 flex-wrap">
                <button
                  onClick={() => setShowAddToList(true)}
                  className="btn btn-primary btn-md"
                >
                  + Add to list
                </button>
                {isMovie && (
                  <button
                    onClick={() => handleToggleWatched(0)}
                    className={`btn btn-md ${isWatchedMovie ? 'btn-accent' : 'btn-secondary'}`}
                  >
                    {isWatchedMovie ? '✓ Watched' : 'Mark watched'}
                  </button>
                )}
              </div>
            ) : (
              <p className="text-lb-muted text-sm mt-6">
                <span className="text-white">Sign in</span> to add to lists or track what you&apos;ve watched.
              </p>
            )}
          </div>
        </div>

        <div className="divider" />

        {/* Episodes (TV only) */}
        {!isMovie && (
          <EpisodesSection
            mediaId={id}
            watchedSeasons={watchedSeasons}
            onToggleWatched={currentUser ? handleToggleWatched : null}
          />
        )}
      </div>

      {showAddToList && (
        <AddToListModal
          mediaId={Number(id)}
          onClose={() => setShowAddToList(false)}
        />
      )}
    </div>
  )
}
