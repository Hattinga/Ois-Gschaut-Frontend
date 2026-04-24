import { useState, useEffect, useRef } from 'react'
import MediaCard from '../components/MediaCard'
import { API_ROUTES, UI } from '../constants'
import { apiPost } from '../utils/api'

// ── TMDB search result row ────────────────────────────────────────────────────
function TmdbResultRow({ result, isImported, isImporting, onImport }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-lb-card border border-lb-border/50 hover:border-lb-border transition-all group">
      <div className="w-12 shrink-0 rounded overflow-hidden shadow-lg" style={{ aspectRatio: '2/3' }}>
        {result.posterUrl
          ? <img src={result.posterUrl} alt={result.title} className="w-full h-full object-cover" loading="lazy" />
          : <div className="w-full h-full bg-lb-surface" />
        }
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate group-hover:text-lb-accent transition-colors">
          {result.title}
        </p>
        <p className="text-xs text-lb-muted mt-0.5">
          {result.releaseDate ? result.releaseDate.slice(0, 4) : '—'}
          <span className="mx-1.5 opacity-50">·</span>
          {result.mediaType}
          {result.voteAverage > 0 && (
            <>
              <span className="mx-1.5 opacity-50">·</span>
              <span className="text-lb-green font-medium">★ {result.voteAverage.toFixed(1)}</span>
            </>
          )}
        </p>
      </div>

      <button
        onClick={onImport}
        disabled={isImported || isImporting}
        className={`btn btn-sm shrink-0 ${isImported ? 'btn-secondary opacity-60' : 'btn-accent'}`}
      >
        {isImporting ? '…' : isImported ? '✓ Added' : '+ Add'}
      </button>
    </div>
  )
}

// ── Horizontal shelf row (Netflix-style) ─────────────────────────────────────
function ShelfRow({ title, items, loading, emptyMsg }) {
  const ref = useRef(null)

  const scroll = (dir) => {
    const el = ref.current
    if (!el) return
    const itemWidth = el.querySelector('.shelf-item')?.offsetWidth ?? 160
    el.scrollBy({ left: dir * (itemWidth * 3 + 24), behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="mb-10">
        <div className="h-5 w-40 bg-lb-card rounded animate-pulse mb-4" />
        <div className="flex gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="shelf-item media-card animate-pulse bg-lb-card" />
          ))}
        </div>
      </div>
    )
  }

  if (!items?.length) {
    return emptyMsg ? (
      <div className="mb-10">
        <p className="shelf-label mb-4">{title}</p>
        <p className="text-lb-muted text-sm">{emptyMsg}</p>
      </div>
    ) : null
  }

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="shelf-label">{title}</h2>
        <span className="text-xs text-lb-muted">{items.length} title{items.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="relative group/shelf">
        <button
          onClick={() => scroll(-1)}
          className="shelf-btn left-0 -translate-x-1/2"
          style={{ top: '50%', transform: 'translate(-50%, -50%)' }}
          aria-label="Scroll left"
        >
          ‹
        </button>

        <div ref={ref} className="shelf-scroll">
          {items.map(film => (
            <div key={film.id} className="shelf-item">
              <MediaCard
                id={film.id}
                title={film.title}
                year={film.releaseDate ? new Date(film.releaseDate).getFullYear() : undefined}
                posterUrl={film.assets?.find(a => a.assetType === 'Poster')?.url}
                score={film.ratings?.[0]?.score}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll(1)}
          className="shelf-btn right-0 translate-x-1/2"
          style={{ top: '50%', transform: 'translate(50%, -50%)' }}
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>
    </div>
  )
}

// ── TMDB shelf row (for trending — different data shape) ──────────────────────
function TmdbShelfRow({ title, items, loading, imported, importing, onImport }) {
  const ref = useRef(null)

  const scroll = (dir) => {
    const el = ref.current
    if (!el) return
    const itemWidth = el.querySelector('.shelf-item')?.offsetWidth ?? 160
    el.scrollBy({ left: dir * (itemWidth * 3 + 24), behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="mb-10">
        <div className="h-5 w-40 bg-lb-card rounded animate-pulse mb-4" />
        <div className="flex gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="shelf-item media-card animate-pulse bg-lb-card" />
          ))}
        </div>
      </div>
    )
  }

  if (!items?.length) return null

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="shelf-label">{title}</h2>
        <span className="text-xs text-lb-muted opacity-60">from TMDB</span>
      </div>

      <div className="relative group/shelf">
        <button
          onClick={() => scroll(-1)}
          className="shelf-btn"
          style={{ top: '50%', left: 0, transform: 'translate(-50%, -50%)' }}
          aria-label="Scroll left"
        >
          ‹
        </button>

        <div ref={ref} className="shelf-scroll">
          {items.map(r => (
            <div key={r.tmdbId} className="shelf-item relative group/card">
              {/* poster */}
              <div className="media-card">
                {r.posterUrl
                  ? <img src={r.posterUrl} alt={r.title} loading="lazy" className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-lb-surface flex items-center justify-center">
                    <span className="text-lb-muted/30 text-xs text-center px-2">{r.title}</span>
                  </div>
                }
                {/* hover overlay with import button */}
                <div className="media-card-overlay opacity-0 group-hover/card:opacity-100">
                  <p className="text-white text-xs font-semibold leading-tight line-clamp-2 mb-1">{r.title}</p>
                  {r.releaseDate && <p className="text-lb-muted text-[10px]">{r.releaseDate.slice(0,4)}</p>}
                  <button
                    onClick={() => onImport(r.tmdbId, r.mediaType)}
                    disabled={imported.has(r.tmdbId) || importing === r.tmdbId}
                    className={`btn btn-sm mt-2 w-full ${imported.has(r.tmdbId) ? 'btn-secondary opacity-60' : 'btn-accent'}`}
                  >
                    {importing === r.tmdbId ? '…' : imported.has(r.tmdbId) ? '✓' : '+ Add'}
                  </button>
                </div>

                {r.voteAverage > 0 && (
                  <span
                    className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black text-white z-10"
                    style={{
                      background: `conic-gradient(${r.voteAverage >= 7 ? '#00e054' : r.voteAverage >= 4 ? '#ff8000' : '#e94057'} ${Math.round(r.voteAverage * 10)}%, #2c3440 0)`,
                      boxShadow: '0 0 0 2px #14181c',
                    }}
                  >
                    {r.voteAverage.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll(1)}
          className="shelf-btn"
          style={{ top: '50%', right: 0, transform: 'translate(50%, -50%)' }}
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Films() {
  const [query, setQuery]           = useState('')
  const [tmdbResults, setTmdbResults] = useState([])
  const [searching, setSearching]   = useState(false)
  const [trending, setTrending]     = useState([])
  const [trendingLoading, setTrendingLoading] = useState(true)
  const [library, setLibrary]       = useState([])
  const [libraryLoading, setLibraryLoading] = useState(true)
  const [libraryError, setLibraryError] = useState(null)
  const [imported, setImported]     = useState(new Set())
  const [importing, setImporting]   = useState(null)

  useEffect(() => {
    fetch(API_ROUTES.media)
      .then(r => r.json())
      .then(data => {
        const items = Array.isArray(data) ? data : []
        setLibrary(items)
        setLibraryLoading(false)
        setImported(new Set(items.map(f => f.tmdbId).filter(Boolean)))
      })
      .catch(err => { setLibraryError(err); setLibraryLoading(false) })

    fetch(API_ROUTES.mediaTrending)
      .then(r => r.json())
      .then(data => { setTrending(Array.isArray(data) ? data : []); setTrendingLoading(false) })
      .catch(() => setTrendingLoading(false))
  }, [])

  useEffect(() => {
    if (!query.trim()) { setTmdbResults([]); setSearching(false); return }
    setSearching(true)
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(API_ROUTES.mediaSearch(query))
        const json = await res.json()
        setTmdbResults(Array.isArray(json) ? json : [])
      } catch {
        setTmdbResults([])
      } finally {
        setSearching(false)
      }
    }, UI.debounceMs)
    return () => clearTimeout(timer)
  }, [query])

  const handleImport = async (tmdbId, mediaType) => {
    setImporting(tmdbId)
    try {
      const film = await apiPost(API_ROUTES.importMedia, {
        tmdbId,
        type: mediaType === 'Movie' ? 'movie' : 'tv',
      })
      setImported(prev => new Set([...prev, tmdbId]))
      setLibrary(prev => [film, ...prev.filter(f => f.id !== film.id)])
    } finally {
      setImporting(null)
    }
  }

  // Derive shelf rows from library
  const movies   = library.filter(f => f.mediaType === 'Movie')
  const shows    = library.filter(f => f.mediaType === 'TV Show')
  const genres   = [...new Set(library.map(f => f.genre).filter(Boolean))].sort()
  const isSearching = query.trim().length > 0

  return (
    <div className="py-8">
      {/* ── Search bar ──────────────────────────────────────────────── */}
      <div className="page-container mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div>
            <h1 className="display text-5xl text-white">Browse</h1>
            <p className="text-lb-muted text-sm mt-1">
              {libraryLoading ? 'Loading…' : `${library.length} title${library.length !== 1 ? 's' : ''} in your library`}
            </p>
          </div>

          <div className="sm:ml-auto sm:w-72">
            <input
              className="input w-full"
              placeholder="Search TMDB to add films…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {libraryError && (
        <div className="page-container mb-6">
          <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded px-4 py-3">
            Could not load library — is the backend running on port 5000?
          </p>
        </div>
      )}

      {/* ── Search mode ─────────────────────────────────────────────── */}
      {isSearching ? (
        <div className="page-container">
          <p className="section-label mb-4">
            {searching ? 'Searching TMDB…' : `Results for "${query}"`}
          </p>
          {searching ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-lb-card rounded-lg animate-pulse" />
              ))}
            </div>
          ) : tmdbResults.length > 0 ? (
            <div className="space-y-2">
              {tmdbResults.map(r => (
                <TmdbResultRow
                  key={r.tmdbId}
                  result={r}
                  isImported={imported.has(r.tmdbId)}
                  isImporting={importing === r.tmdbId}
                  onImport={() => handleImport(r.tmdbId, r.mediaType)}
                />
              ))}
            </div>
          ) : (
            <p className="text-lb-muted text-sm">No results found on TMDB.</p>
          )}
        </div>
      ) : (
        /* ── Shelf mode ─────────────────────────────────────────────── */
        <div className="page-container">
          <TmdbShelfRow
            title="Trending this week"
            items={trending}
            loading={trendingLoading}
            imported={imported}
            importing={importing}
            onImport={handleImport}
          />

          {(movies.length > 0 || libraryLoading) && (
            <ShelfRow
              title="Movies"
              items={movies}
              loading={libraryLoading}
            />
          )}

          {(shows.length > 0 || libraryLoading) && (
            <ShelfRow
              title="TV Shows"
              items={shows}
              loading={libraryLoading}
            />
          )}

          {genres.map(genre => {
            const items = library.filter(f => f.genre === genre)
            if (items.length < 3) return null
            return (
              <ShelfRow
                key={genre}
                title={genre}
                items={items}
              />
            )
          })}

          {!libraryLoading && library.length === 0 && (
            <div className="text-center py-24 border border-lb-border/30 rounded-xl">
              <p className="display text-4xl text-lb-muted mb-2">Empty</p>
              <p className="text-lb-muted text-sm">Search for a film above to add it to your library.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
