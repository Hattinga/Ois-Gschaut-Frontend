import { useState } from 'react'
import ListCard from '../components/ListCard'
import { useFetch } from '../hooks'
import { API_ROUTES } from '../constants'

export default function Lists() {
  const [search, setSearch] = useState('')

  const { data, loading, error } = useFetch(API_ROUTES.lists)
  const lists = data ?? []

  const filtered = lists.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-container py-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Lists</h1>
          <p className="text-lb-muted text-sm mt-0.5">
            {loading ? 'Loading…' : `${filtered.length} list${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        <div className="flex-1 sm:max-w-xs sm:ml-auto">
          <input
            className="input w-full"
            placeholder="Search lists…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <button className="btn btn-primary btn-md shrink-0">+ New list</button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-sm mb-6 bg-red-900/20 border border-red-800 rounded px-4 py-3">
          Could not load lists — is the backend running?
        </p>
      )}

      {/* Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-lb-card rounded animate-pulse h-40" />
          ))}
        </div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map(list => (
            <ListCard
              key={list.id}
              id={list.id}
              name={list.name}
              description={list.description}
              itemCount={list.itemCount ?? 0}
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-24">
          <p className="text-lb-muted text-sm">
            {search ? `No lists matching "${search}"` : 'No lists yet. Create the first one!'}
          </p>
        </div>
      )}
    </div>
  )
}
