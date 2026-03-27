import { useState, useMemo } from 'react'
import MediaCard from '../components/MediaCard'
import { useFetch } from '../hooks'
import { API_ROUTES } from '../constants'

const TYPES = ['All', 'Movie', 'TV Show']

export default function Films() {
  const [search, setSearch]     = useState('')
  const [typeFilter, setFilter] = useState('All')

  const { data, loading, error } = useFetch(API_ROUTES.media)
  const films = data ?? []

  const filtered = useMemo(() => {
    return films.filter(f => {
      const matchesSearch = f.title.toLowerCase().includes(search.toLowerCase())
      const matchesType   = typeFilter === 'All' || f.mediaType === typeFilter
      return matchesSearch && matchesType
    })
  }, [films, search, typeFilter])

  return (
    <div className="page-container py-8">

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Films</h1>
          <p className="text-lb-muted text-sm mt-0.5">
            {loading ? 'Loading…' : `${filtered.length} title${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        <div className="flex-1 sm:max-w-xs sm:ml-auto">
          <input
            className="input w-full"
            placeholder="Search titles…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Type filter pills */}
        <div className="flex gap-2">
          {TYPES.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`btn btn-sm ${typeFilter === t ? 'btn-accent' : 'btn-secondary'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-sm mb-6 bg-red-900/20 border border-red-800 rounded px-4 py-3">
          Could not load films — is the backend running?
        </p>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="media-card animate-pulse bg-lb-card" />
          ))}
        </div>
      )}

      {/* Film grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3">
          {filtered.map(film => (
            <MediaCard
              key={film.id}
              id={film.id}
              title={film.title}
              year={film.releaseDate ? new Date(film.releaseDate).getFullYear() : undefined}
              posterUrl={film.assets?.find(a => a.assetType === 'Poster')?.url}
              score={film.ratings?.[0]?.score}
              mediaType={film.mediaType}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-24">
          <p className="text-lb-muted text-sm">
            {search ? `No results for "${search}"` : 'No films yet.'}
          </p>
        </div>
      )}
    </div>
  )
}
