import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useFetch } from '../hooks'
import { API_ROUTES } from '../constants'

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

export default function FilmDetail() {
  const { id } = useParams()
  const { data: film, loading, error } = useFetch(API_ROUTES.mediaById(id))

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

  const poster = film.assets?.find(a => a.assetType === 'Poster')?.url
  const year   = film.releaseDate ? new Date(film.releaseDate).getFullYear() : null

  return (
    <div>
      {/* Backdrop gradient */}
      <div
        className="w-full h-48 md:h-64"
        style={{ background: 'linear-gradient(160deg, #1f2a38, #14181c)' }}
      />

      <div className="page-container">
        {/* Poster + meta row */}
        <div className="flex flex-col md:flex-row gap-8 -mt-24 md:-mt-32 relative z-10 pb-8">

          {/* Poster */}
          <div className="w-40 md:w-52 shrink-0" style={{ aspectRatio: '2/3' }}>
            {poster
              ? <img src={poster} alt={film.title} className="w-full h-full object-cover rounded shadow-2xl" />
              : <PosterPlaceholder title={film.title} />
            }
          </div>

          {/* Details */}
          <div className="pt-4 md:pt-32 flex-1">
            <h1 className="text-3xl md:text-4xl font-black text-white">
              {film.title}
              {year && <span className="text-lb-muted font-normal text-2xl ml-3">{year}</span>}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-lb-muted">
              <span className="border border-lb-border px-2 py-0.5 rounded text-xs">
                {film.mediaType}
              </span>
              {film.genre     && <span>{film.genre}</span>}
              {film.runtimeMin && <span>{film.runtimeMin} min</span>}
              {film.status    && <span className="capitalize">{film.status}</span>}
            </div>

            {/* Ratings row */}
            {film.ratings?.length > 0 && (
              <div className="flex gap-5 mt-5">
                {film.ratings.map(r => (
                  <RatingBadge key={r.source} source={r.source} score={r.score} />
                ))}
              </div>
            )}

            {/* Plot */}
            {film.plot && (
              <p className="text-lb-text text-sm leading-relaxed mt-5 max-w-2xl">
                {film.plot}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button className="btn btn-primary btn-md">+ Add to list</button>
              <button className="btn btn-secondary btn-md">Watched</button>
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* Episodes (TV only) */}
        {film.mediaType === 'TV Show' && (
          <EpisodesSection mediaId={id} />
        )}
      </div>
    </div>
  )
}

function EpisodesSection({ mediaId }) {
  const { data, loading } = useFetch(API_ROUTES.episodes(mediaId))
  const episodes = data ?? []

  const seasons = [...new Set(episodes.map(e => e.season))].sort((a, b) => a - b)
  const [activeSeason, setActiveSeason] = useState(seasons[0] ?? 1)

  if (loading) return <div className="h-20 bg-lb-card rounded animate-pulse mb-8" />
  if (!episodes.length) return null

  const visible = episodes.filter(e => e.season === activeSeason)

  return (
    <div className="pb-8">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="section-label mb-0">Episodes</h2>
        <div className="flex gap-2">
          {seasons.map(s => (
            <button
              key={s}
              onClick={() => setActiveSeason(s)}
              className={`btn btn-sm ${activeSeason === s ? 'btn-accent' : 'btn-secondary'}`}
            >
              S{s}
            </button>
          ))}
        </div>
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

