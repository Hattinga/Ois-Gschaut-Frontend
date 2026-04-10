import { useParams, Link } from 'react-router-dom'
import MediaCard from '../components/MediaCard'
import ListCard from '../components/ListCard'
import { useFetch } from '../hooks'
import { API_ROUTES } from '../constants'
import { useCurrentUser } from '../contexts/UserContext'

export default function Profile() {
  const { id } = useParams()
  const { currentUser } = useCurrentUser()
  const { data: profile, loading, error } = useFetch(API_ROUTES.userProfile(id))

  const isOwnProfile = currentUser?.id === Number(id)

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
        <p className="text-lb-muted mb-4">User not found.</p>
        <Link to="/" className="btn btn-secondary btn-md">Go home</Link>
      </div>
    )
  }

  const initials = profile.username.slice(0, 2).toUpperCase()
  const memberSince = new Date(profile.createdAt).toLocaleDateString('en', { month: 'long', year: 'numeric' })

  // Deduplicate recent watched by mediaId for display
  const seenMedia = new Set()
  const uniqueWatched = (profile.recentWatched ?? []).filter(w => {
    if (seenMedia.has(w.mediaId)) return false
    seenMedia.add(w.mediaId)
    return true
  })

  return (
    <div className="page-container py-8">

      {/* Profile header */}
      <div className="flex items-center gap-5 mb-8">
        <div className="w-16 h-16 rounded-full bg-lb-surface border border-lb-border flex items-center justify-center text-xl font-black text-lb-accent shrink-0">
          {initials}
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">{profile.username}</h1>
          <p className="text-lb-muted text-sm">Member since {memberSince}</p>
        </div>
        {isOwnProfile && (
          <span className="ml-auto text-xs text-lb-muted border border-lb-border px-2 py-1 rounded">
            Your profile
          </span>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-lb-card border border-lb-border rounded-lg px-5 py-4">
          <p className="text-2xl font-black text-white">{profile.filmsWatched}</p>
          <p className="text-lb-muted text-xs uppercase tracking-wide mt-0.5">Films watched</p>
        </div>
        <div className="bg-lb-card border border-lb-border rounded-lg px-5 py-4">
          <p className="text-2xl font-black text-white">{profile.listCount}</p>
          <p className="text-lb-muted text-xs uppercase tracking-wide mt-0.5">Lists</p>
        </div>
      </div>

      {/* Recent watched */}
      {uniqueWatched.length > 0 && (
        <section className="mb-10">
          <h2 className="section-label mb-4">Recently watched</h2>
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
            Lists
            <span className="ml-2 font-normal text-lb-muted text-xs normal-case">
              {profile.lists?.length ?? 0}
            </span>
          </h2>
          {isOwnProfile && (
            <Link to="/lists" className="text-xs text-lb-muted hover:text-white transition-colors">
              Manage lists →
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
            {isOwnProfile ? 'You haven\'t created any lists yet.' : 'No public lists yet.'}
          </p>
        )}
      </section>
    </div>
  )
}
