import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import MediaCard from '../components/MediaCard'
import { useFetch } from '../hooks'
import { API_ROUTES } from '../constants'

export default function ListDetail() {
  const { id } = useParams()
  const { data: list,     loading: listLoading  } = useFetch(API_ROUTES.lists + `/${id}`)
  const { data: items,    loading: itemsLoading } = useFetch(API_ROUTES.listItems(id))
  const { data: comments, loading: commentsLoading } = useFetch(API_ROUTES.comments(id))
  const [comment, setComment] = useState('')

  const loading = listLoading || itemsLoading

  if (loading && !list) {
    return (
      <div className="page-container py-12 space-y-4 animate-pulse">
        <div className="h-8  bg-lb-card rounded w-64" />
        <div className="h-4  bg-lb-card rounded w-48" />
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mt-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="media-card bg-lb-card" />
          ))}
        </div>
      </div>
    )
  }

  if (!list) {
    return (
      <div className="page-container py-24 text-center">
        <p className="text-lb-muted mb-4">List not found.</p>
        <Link to="/lists" className="btn btn-secondary btn-md">Back to lists</Link>
      </div>
    )
  }

  return (
    <div className="page-container py-8">

      {/* List header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">{list.name}</h1>
            {list.description && (
              <p className="text-lb-muted text-sm mt-2 max-w-2xl leading-relaxed">
                {list.description}
              </p>
            )}
            <div className="flex items-center gap-3 mt-3 text-xs text-lb-muted">
              <span>{(items ?? []).length} film{items?.length !== 1 ? 's' : ''}</span>
              <span>·</span>
              <span
                className={`px-2 py-0.5 rounded border ${list.isPublic
                  ? 'border-lb-green/40 text-lb-green'
                  : 'border-lb-border text-lb-muted'}`}
              >
                {list.isPublic ? 'Public' : 'Private'}
              </span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="btn btn-secondary btn-sm">Edit</button>
            <button className="btn btn-primary btn-sm">+ Add film</button>
          </div>
        </div>
      </div>

      {/* Films grid */}
      {items?.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3">
          {items.map(item => (
            <MediaCard
              key={item.mediaId}
              id={item.mediaId}
              title={item.mediaTitle}
              mediaType={item.mediaType}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-lb-border/40 rounded">
          <p className="text-lb-muted text-sm">This list is empty.</p>
          <button className="btn btn-primary btn-md mt-4">Add a film</button>
        </div>
      )}

      <div className="divider" />

      {/* Comments */}
      <div className="max-w-2xl">
        <h2 className="section-label">Discussion</h2>

        {/* Comment input */}
        <div className="flex gap-3 mb-6">
          <textarea
            className="input flex-1 resize-none"
            rows={2}
            placeholder="Add a comment…"
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <button
            className="btn btn-primary btn-md self-end"
            disabled={!comment.trim()}
          >
            Post
          </button>
        </div>

        {/* Comment list */}
        {commentsLoading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2].map(i => <div key={i} className="h-14 bg-lb-card rounded" />)}
          </div>
        ) : (
          <div className="space-y-4">
            {(comments ?? []).map(c => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-lb-surface flex items-center justify-center text-xs font-bold text-lb-accent shrink-0">
                  {c.username?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-white">{c.username}</span>
                    <span className="text-xs text-lb-muted">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-lb-text mt-0.5 leading-relaxed">{c.content}</p>
                </div>
              </div>
            ))}
            {!commentsLoading && (comments ?? []).length === 0 && (
              <p className="text-lb-muted text-sm">No comments yet. Be the first!</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
