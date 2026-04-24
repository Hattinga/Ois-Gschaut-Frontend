import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Pagination from '../components/Pagination'
import { API_ROUTES, UI } from '../constants'

function UserCard({ id, username }) {
  const hue    = [...username].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
  const initials = username.slice(0, 2).toUpperCase()

  return (
    <Link
      to={`/users/${id}`}
      className="group relative block overflow-hidden rounded-xl border border-lb-border/40
                 bg-lb-card transition-all duration-300
                 hover:border-lb-accent/50 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(64,188,244,0.12)]"
    >
      {/* colour bar top accent */}
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, hsl(${hue},55%,45%), hsl(${hue + 60},45%,35%))` }}
      />

      <div className="flex items-center gap-4 p-4">
        {/* Avatar */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-base font-black text-white shrink-0 shadow-lg"
          style={{
            background: `linear-gradient(135deg, hsl(${hue},50%,32%), hsl(${hue + 50},40%,20%))`,
            boxShadow: `0 0 0 2px hsl(${hue},40%,25%)`,
          }}
        >
          {initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate group-hover:text-lb-accent transition-colors">
            {username}
          </p>
          <p className="text-lb-muted text-xs mt-0.5">Member</p>
        </div>

        {/* Arrow */}
        <span className="text-lb-muted/30 group-hover:text-lb-accent/60 transition-colors text-lg leading-none">
          →
        </span>
      </div>
    </Link>
  )
}

export default function Users() {
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [page, setPage]       = useState(1)

  useEffect(() => {
    setLoading(true)
    setPage(1)
    const timer = setTimeout(() => {
      fetch(API_ROUTES.usersSearch(query))
        .then(r => r.json())
        .then(data => { setResults(Array.isArray(data) ? data : []); setLoading(false) })
        .catch(() => { setResults([]); setLoading(false) })
    }, query ? UI.debounceMs : 0)
    return () => clearTimeout(timer)
  }, [query])

  const paged = results?.slice((page - 1) * UI.itemsPerPage, page * UI.itemsPerPage) ?? []

  return (
    <div>
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{
        background: 'linear-gradient(160deg, #1a2535 0%, #14181c 70%)',
      }}>
        {/* subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, #40bcf4 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        <div className="page-container relative py-12">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            <div>
              <p className="section-label text-lb-accent tracking-[0.25em] mb-2">Community</p>
              <h1 className="display text-6xl text-white leading-none">Members</h1>
              <p className="text-lb-muted text-sm mt-2">
                {loading
                  ? 'Loading…'
                  : results != null
                    ? `${results.length} member${results.length !== 1 ? 's' : ''}`
                    : ''}
              </p>
            </div>

            <div className="sm:ml-auto sm:w-72">
              <input
                className="input w-full"
                placeholder="Search by username…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Member grid ─────────────────────────────────────────────── */}
      <div className="page-container py-8">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-[72px] bg-lb-card rounded-xl animate-pulse border border-lb-border/30" />
            ))}
          </div>
        )}

        {!loading && paged.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {paged.map(u => (
                <UserCard key={u.id} id={u.id} username={u.username} />
              ))}
            </div>
            <Pagination total={results.length} page={page} onPageChange={setPage} />
          </>
        )}

        {!loading && results?.length === 0 && (
          <div className="text-center py-24 border border-lb-border/20 rounded-2xl">
            <p className="display text-5xl text-lb-muted/40 mb-3">
              {query ? 'No results' : 'Empty'}
            </p>
            <p className="text-lb-muted text-sm">
              {query ? `No members matching "${query}"` : 'No members yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
