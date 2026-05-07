import { useState } from 'react'
import { Link } from 'react-router-dom'
import MediaCard from '../components/MediaCard'
import { API_ROUTES } from '../constants'
import { apiPost } from '../utils/api'
import { useCurrentUser } from '../contexts/UserContext'
import { useToast } from '../contexts/ToastContext'
import { useFetch } from '../hooks'

function RandomPickButton({ films, disabled }) {
  const [picked, setPicked] = useState(null)

  if (disabled || films.length === 0) return null

  const pick = () => {
    const film = films[Math.floor(Math.random() * films.length)]
    setPicked(film)
  }

  return (
    <>
      <button
        onClick={pick}
        className="btn btn-secondary btn-sm flex items-center gap-1.5"
        title="Zufälliger Film aus Watchlist"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
        </svg>
        Zufälliger Film
      </button>

      {picked && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={e => e.target === e.currentTarget && setPicked(null)}
        >
          <div className="bg-lb-surface border border-lb-border rounded-xl p-8 w-full max-w-xs mx-4 text-center">
            <p className="section-label text-lb-accent tracking-widest mb-4">Heute Abend schaust</p>
            <div className="mx-auto mb-5 rounded overflow-hidden shadow-2xl" style={{ width: 140, aspectRatio: '2/3' }}>
              {picked.assets?.find(a => a.assetType === 'Poster')?.url
                ? <img src={picked.assets.find(a => a.assetType === 'Poster').url} alt={picked.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-lb-card flex items-center justify-center p-2"><span className="text-lb-muted/40 text-xs">{picked.title}</span></div>
              }
            </div>
            <p className="text-white font-black text-lg mb-1">{picked.title}</p>
            <p className="text-lb-muted text-xs mb-6">
              {picked.releaseDate ? new Date(picked.releaseDate).getFullYear() : ''}
              {picked.genre ? ` · ${picked.genre}` : ''}
            </p>
            <div className="flex gap-2">
              <Link to={`/films/${picked.id}`} className="btn btn-primary btn-md flex-1">
                Zum Film
              </Link>
              <button onClick={pick} className="btn btn-secondary btn-md flex-1">
                Nochmal!
              </button>
            </div>
            <button onClick={() => setPicked(null)} className="mt-4 text-xs text-lb-muted hover:text-white transition-colors">
              Schließen
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default function Watchlist() {
  const { currentUser } = useCurrentUser()
  const { showToast } = useToast()
  const { data: rawData, loading, error } = useFetch(
    currentUser ? API_ROUTES.watchlistFull : null
  )
  const [localFilms, setLocalFilms] = useState(null)

  const films = localFilms ?? (Array.isArray(rawData) ? rawData : [])

  const handleRemove = async (mediaId) => {
    try {
      await apiPost(API_ROUTES.watchlistToggle, { mediaId })
      setLocalFilms(prev => (prev ?? films).filter(f => f.id !== mediaId))
      showToast('Aus Watchlist entfernt', 'success')
    } catch {
      showToast('Fehler beim Entfernen', 'error')
    }
  }

  if (!currentUser) {
    return (
      <div className="page-container py-24 text-center">
        <p className="display text-5xl text-lb-muted/30 mb-4">Watchlist</p>
        <p className="text-lb-muted text-sm mb-6">Einloggen um Watchlist zu sehen.</p>
        <Link to="/" className="btn btn-primary btn-md">Zur Startseite</Link>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #1a2535 0%, #14181c 70%)' }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, #40bcf4 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        <div className="page-container relative py-12">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            <div>
              <p className="section-label text-lb-accent tracking-[0.25em] mb-2">Meine Liste</p>
              <h1 className="display text-6xl text-white leading-none">Watchlist</h1>
              <p className="text-lb-muted text-sm mt-2">
                {loading ? 'Lädt…' : `${films.length} Film${films.length !== 1 ? 'e' : ''} gespeichert`}
              </p>
            </div>
            <div className="sm:ml-auto">
              <RandomPickButton films={films} disabled={loading} />
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-8">
        {loading && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="media-card animate-pulse bg-lb-card" />
            ))}
          </div>
        )}

        {error && (
          <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded px-4 py-3">
            Watchlist konnte nicht geladen werden.
          </p>
        )}

        {!loading && films.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3">
            {films.map(film => (
              <div key={film.id} className="relative group">
                <MediaCard
                  id={film.id}
                  title={film.title}
                  year={film.releaseDate ? new Date(film.releaseDate).getFullYear() : undefined}
                  posterUrl={film.assets?.find(a => a.assetType === 'Poster')?.url}
                  score={film.ratings?.[0]?.score}
                />
                <button
                  onClick={() => handleRemove(film.id)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white text-xs hidden group-hover:flex items-center justify-center hover:bg-red-600 transition-colors z-20"
                  title="Aus Watchlist entfernen"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && films.length === 0 && (
          <div className="text-center py-24 border border-lb-border/20 rounded-2xl">
            <p className="display text-5xl text-lb-muted/40 mb-3">Leer</p>
            <p className="text-lb-muted text-sm mb-6">
              Noch nix gespeichert. Film öffnen → Watchlist-Button klicken.
            </p>
            <Link to="/films" className="btn btn-accent btn-md">Filme entdecken</Link>
          </div>
        )}
      </div>
    </div>
  )
}
