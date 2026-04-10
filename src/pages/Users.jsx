import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_ROUTES, UI } from '../constants'

function UserCard({ id, username }) {
  const initials = username.slice(0, 2).toUpperCase()
  const hue = [...username].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
  return (
    <Link
      to={`/users/${id}`}
      className="flex items-center gap-3 p-3 bg-lb-card border border-lb-border/50 rounded-lg hover:bg-lb-surface hover:border-lb-border transition-colors group"
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0"
        style={{ background: `linear-gradient(135deg, hsl(${hue},40%,30%), hsl(${hue + 40},30%,20%))` }}
      >
        {initials}
      </div>
      <span className="text-sm font-semibold text-white group-hover:text-lb-accent transition-colors">
        {username}
      </span>
    </Link>
  )
}

export default function Users() {
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      fetch(API_ROUTES.usersSearch(query))
        .then(r => r.json())
        .then(data => { setResults(Array.isArray(data) ? data : []); setLoading(false) })
        .catch(() => { setResults([]); setLoading(false) })
    }, query ? UI.debounceMs : 0)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="page-container py-8">

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Members</h1>
          <p className="text-lb-muted text-sm mt-0.5">
            {loading ? 'Loading…' : results ? `${results.length} member${results.length !== 1 ? 's' : ''}` : ''}
          </p>
        </div>
        <div className="flex-1 sm:max-w-xs sm:ml-auto">
          <input
            className="input w-full"
            placeholder="Search members…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 bg-lb-card rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {!loading && results?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {results.map(u => (
            <UserCard key={u.id} id={u.id} username={u.username} />
          ))}
        </div>
      )}

      {!loading && results?.length === 0 && (
        <div className="text-center py-24">
          <p className="text-lb-muted text-sm">
            {query ? `No members matching "${query}"` : 'No members yet.'}
          </p>
        </div>
      )}
    </div>
  )
}
