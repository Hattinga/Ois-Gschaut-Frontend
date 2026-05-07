import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import MediaCard from '../components/MediaCard'
import ListCard from '../components/ListCard'
import { useFetch } from '../hooks'
import { API_ROUTES } from '../constants'
import { useCurrentUser } from '../contexts/UserContext'
import { apiPut } from '../utils/api'
import { useToast } from '../contexts/ToastContext'

export default function Profile() {
  const { id } = useParams()
  const { currentUser } = useCurrentUser()
  const { showToast } = useToast()
  const { data: profile, loading, error, refetch } = useFetch(API_ROUTES.userProfile(id))

  const [editingBio, setEditingBio] = useState(false)
  const [bioValue, setBioValue] = useState('')
  const [bioSaving, setBioSaving] = useState(false)

  const isOwnProfile = currentUser?.id === Number(id)

  const startBioEdit = () => {
    setBioValue(profile?.bio ?? '')
    setEditingBio(true)
  }

  const saveBio = async () => {
    setBioSaving(true)
    try {
      await apiPut(API_ROUTES.userById(currentUser.id), {
        username: currentUser.username,
        bio: bioValue.trim(),
      })
      showToast('Bio gespeichert!', 'success')
      setEditingBio(false)
      refetch?.()
    } catch {
      showToast('Fehler beim Speichern.', 'error')
    } finally {
      setBioSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="page-container py-12 animate-pulse space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-lb-card" />
          <div className="space-y-2">
            <div className="h-6 w-40 bg-lb-card rounded" />
            <div className="h-4 w-24 bg-lb-card rounded" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-lb-card rounded" />)}
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="page-container py-24 text-center">
        <p className="text-lb-muted mb-4">Benutzer nicht gefunden.</p>
        <Link to="/" className="btn btn-secondary btn-md">Zur Startseite</Link>
      </div>
    )
  }

  const initials = profile.username.slice(0, 2).toUpperCase()
  const memberSince = new Date(profile.createdAt).toLocaleDateString('de-AT', { month: 'long', year: 'numeric' })

  const seenMedia = new Set()
  const uniqueWatched = (profile.recentWatched ?? []).filter(w => {
    if (seenMedia.has(w.mediaId)) return false
    seenMedia.add(w.mediaId)
    return true
  })

  const genreBreakdown = profile.genreBreakdown ?? []
  const maxGenreCount = genreBreakdown[0]?.count ?? 1

  return (
    <div className="page-container py-8">

      {/* Profile header */}
      <div className="flex items-start gap-5 mb-6">
        <div
          className="w-16 h-16 rounded-full border border-lb-border flex items-center justify-center text-xl font-black text-lb-accent shrink-0"
          style={{ background: 'linear-gradient(135deg, #1a2535 0%, #0d1117 100%)' }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="display text-3xl text-white leading-none">{profile.username}</h1>
          <p className="text-lb-muted text-sm mt-1">Dabei seit {memberSince}</p>

          {/* Bio */}
          {!editingBio && (
            <div className="mt-3 flex items-start gap-3">
              {profile.bio ? (
                <p className="text-lb-muted text-sm leading-relaxed max-w-lg">{profile.bio}</p>
              ) : isOwnProfile ? (
                <p className="text-lb-muted/40 text-sm italic">Noch keine Bio</p>
              ) : null}
              {isOwnProfile && (
                <button
                  onClick={startBioEdit}
                  className="text-xs text-lb-muted hover:text-white transition-colors shrink-0 mt-0.5"
                >
                  {profile.bio ? 'Bearbeiten' : 'Bio hinzufügen'}
                </button>
              )}
            </div>
          )}

          {editingBio && (
            <div className="mt-3 max-w-lg">
              <textarea
                value={bioValue}
                onChange={e => setBioValue(e.target.value)}
                maxLength={500}
                rows={3}
                className="input w-full text-sm resize-none"
                placeholder="Schreib was über dich..."
                autoFocus
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-lb-muted/40">{bioValue.length}/500</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingBio(false)}
                    className="btn btn-ghost btn-sm"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={saveBio}
                    disabled={bioSaving}
                    className="btn btn-primary btn-sm"
                  >
                    {bioSaving ? 'Speichern…' : 'Speichern'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {isOwnProfile && (
          <Link
            to="/settings"
            className="ml-auto text-xs text-lb-muted border border-lb-border px-2 py-1 rounded hover:text-white hover:border-lb-muted transition-colors shrink-0"
          >
            Einstellungen
          </Link>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        <div className="bg-lb-card border border-lb-border rounded-lg px-5 py-4">
          <p className="display text-3xl text-white" style={{ lineHeight: 1 }}>{profile.filmsWatched}</p>
          <p className="text-lb-muted text-xs uppercase tracking-wide mt-1">Filme gesehen</p>
        </div>
        <div className="bg-lb-card border border-lb-border rounded-lg px-5 py-4">
          <p className="display text-3xl text-white" style={{ lineHeight: 1 }}>{profile.episodesWatched ?? 0}</p>
          <p className="text-lb-muted text-xs uppercase tracking-wide mt-1">Episoden gesehen</p>
        </div>
        <div className="bg-lb-card border border-lb-border rounded-lg px-5 py-4">
          <p className="display text-3xl text-white" style={{ lineHeight: 1 }}>{profile.listCount}</p>
          <p className="text-lb-muted text-xs uppercase tracking-wide mt-1">Listen</p>
        </div>
      </div>

      {/* Genre breakdown */}
      {genreBreakdown.length > 0 && (
        <section className="mb-10">
          <h2 className="section-label mb-4">Lieblingsgenres</h2>
          <div className="space-y-2 max-w-md">
            {genreBreakdown.map(({ genre, count }) => (
              <div key={genre} className="flex items-center gap-3">
                <span className="text-lb-muted text-xs w-28 shrink-0 truncate">{genre}</span>
                <div className="flex-1 h-1.5 bg-lb-card rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.round((count / maxGenreCount) * 100)}%`,
                      background: 'linear-gradient(90deg, #00e054 0%, #40bcf4 100%)',
                    }}
                  />
                </div>
                <span className="text-lb-muted/60 text-xs w-4 text-right shrink-0">{count}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent watched */}
      {uniqueWatched.length > 0 && (
        <section className="mb-10">
          <h2 className="section-label mb-4">Zuletzt gesehen</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
            {uniqueWatched.map(w => (
              <MediaCard
                key={w.mediaId}
                id={w.mediaId}
                title={w.title}
                posterUrl={w.posterUrl}
              />
            ))}
          </div>
        </section>
      )}

      <div className="divider" />

      {/* Lists */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="section-label">
            Listen
            <span className="ml-2 font-normal text-lb-muted text-xs normal-case">
              {profile.lists?.length ?? 0}
            </span>
          </h2>
          {isOwnProfile && (
            <Link to="/lists" className="text-xs text-lb-muted hover:text-white transition-colors">
              Verwalten →
            </Link>
          )}
        </div>

        {profile.lists?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {profile.lists.map(list => (
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
        ) : (
          <p className="text-lb-muted text-sm">
            {isOwnProfile ? 'Noch keine Listen erstellt.' : 'Keine öffentlichen Listen.'}
          </p>
        )}
      </section>
    </div>
  )
}
