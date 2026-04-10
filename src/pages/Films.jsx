import { useState, useEffect } from 'react'
import MediaCard from '../components/MediaCard'
import { API_ROUTES, UI } from '../constants'
import { apiPost } from '../utils/api'

const TYPES = ['All', 'Movie', 'TV Show']

function TmdbResultRow({ result, isImported, isImporting, onImport }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded bg-lb-card border border-lb-border/50 hover:border-lb-border transition-colors">
      <div className="w-10 shrink-0 rounded overflow-hidden" style={{ aspectRatio: '2/3' }}>
        {result.posterUrl
          ? <img src={result.posterUrl} alt={result.title} className="w-full h-full object-cover" loading="lazy" />
          : <div className="w-full h-full bg-lb-surface" />
        }
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{result.title}</p>
        <p className="text-xs text-lb-muted">
          {result.releaseDate ? result.releaseDate.slice(0, 4) : '—'}
          <span className="mx-1.5">·</span>
          {result.mediaType}
          {result.voteAverage > 0 && (
            <>
              <span className="mx-1.5">·</span>
              <span className="text-lb-green">★ {result.voteAverage.toFixed(1)}</span>
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

export default function Films() {
  const [query, setQuery]           = useState('')
  const [typeFilter, setTypeFilter] = useState('All')

  // TMDB search results (when query is non-empty)
  const [tmdbResults, setTmdbResults] = useState([])
  const [searching, setSearching]     = useState(false)

  // Trending (shown when query is empty)
  const [trending, setTrending]           = useState([])
  const [trendingLoading, setTrendingLoading] = useState(true)

  // Local library
  const [library, setLibrary]             = useState([])
  const [libraryLoading, setLibraryLoading] = useState(true)
  const [libraryError, setLibraryError]   = useState(null)

  // Track imported items: seed with tmdbIds already in library
  const [imported, setImported] = useState(new Set())
  const [importing, setImporting] = useState(null)

  // Fetch library + trending on mount
  useEffect(() => {
    fetch(API_ROUTES.media)
      .then(r => r.json())
      .then(data => {
        const items = Array.isArray(data) ? data : []
        setLibrary(items)
        setLibraryLoading(false)
        // Pre-mark items already in library as imported
        setImported(new Set(items.map(f => f.tmdbId).filter(Boolean)))
      })
      .catch(err => { setLibraryError(err); setLibraryLoading(false) })

    fetch(API_ROUTES.mediaTrending)
      .then(r => r.json())
      .then(data => { setTrending(Array.isArray(data) ? data : []); setTrendingLoading(false) })
      .catch(() => setTrendingLoading(false))
  }, [])

  // Debounced TMDB search
  useEffect(() => {
    if (!query.trim()) {
      setTmdbResults([])
      setSearching(false)
      return
    }
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

  const applyTypeFilter = (items) =>
    typeFilter === 'All' ? items : items.filter(r => r.mediaType === typeFilter)

  const filteredLibrary  = library.filter(f => {
    const matchesType = typeFilter === 'All' || f.mediaType === typeFilter
    const matchesText = !query.trim() || f.title.toLowerCase().includes(query.toLowerCase())
    return matchesType && matchesText
  })
  const filteredTrending = applyTypeFilter(trending)
  const filteredSearch   = applyTypeFilter(tmdbResults)

  const isSearching = query.trim().length > 0

  return (
    <div className="page-container py-8">

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-black text-white shrink-0">Films</h1>

        <div className="flex-1 sm:max-w-xs sm:ml-auto">
          <input
            className="input w-full"
            placeholder="Search TMDB…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          {TYPES.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`btn btn-sm ${typeFilter === t ? 'btn-accent' : 'btn-secondary'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Search results OR Trending */}
      <div className="mb-10">
        {isSearching ? (
          <>
            <p className="section-label mb-4">
              {searching ? 'Searching…' : `Results for "${query}"`}
            </p>
            {searching ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-14 bg-lb-card rounded animate-pulse" />
                ))}
              </div>
            ) : filteredSearch.length > 0 ? (
              <div className="space-y-2">
                {filteredSearch.map(r => (
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
          </>
        ) : (
          <>
            <p className="section-label mb-4">Trending this week</p>
            {trendingLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-14 bg-lb-card rounded animate-pulse" />
                ))}
              </div>
            ) : filteredTrending.length > 0 ? (
              <div className="space-y-2">
                {filteredTrending.map(r => (
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
              <p className="text-lb-muted text-sm">Could not load trending — is the backend running?</p>
            )}
          </>
        )}
      </div>

      {/* Library */}
      <div>
        <p className="section-label mb-4">
          Your library
          {!libraryLoading && (
            <span className="ml-2 text-lb-muted font-normal text-xs normal-case">
              {filteredLibrary.length} title{filteredLibrary.length !== 1 ? 's' : ''}
            </span>
          )}
        </p>

        {libraryError && (
          <p className="text-red-400 text-sm mb-6 bg-red-900/20 border border-red-800 rounded px-4 py-3">
            Could not load library — is the backend running on port 5000?
          </p>
        )}

        {libraryLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="media-card animate-pulse bg-lb-card" />
            ))}
          </div>
        ) : filteredLibrary.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3">
            {filteredLibrary.map(film => (
              <MediaCard
                key={film.id}
                id={film.id}
                title={film.title}
                year={film.releaseDate ? new Date(film.releaseDate).getFullYear() : undefined}
                posterUrl={film.assets?.find(a => a.assetType === 'Poster')?.url}
                score={film.ratings?.[0]?.score}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-lb-border/30 rounded">
            <p className="text-lb-muted text-sm">
              {typeFilter !== 'All'
                ? `No ${typeFilter}s in your library yet.`
                : 'Your library is empty — add something from the trending list above.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
