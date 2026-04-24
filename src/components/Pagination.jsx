import { UI } from '../constants'

export default function Pagination({ total, page, onPageChange }) {
  const totalPages = Math.ceil(total / UI.itemsPerPage)
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="btn btn-secondary btn-sm disabled:opacity-40"
      >
        ← Prev
      </button>
      <span className="text-sm text-lb-muted">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="btn btn-secondary btn-sm disabled:opacity-40"
      >
        Next →
      </button>
    </div>
  )
}
