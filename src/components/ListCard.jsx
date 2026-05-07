import { Link } from 'react-router-dom'

function ListCard({ id, name, description, ownerUsername, itemCount = 0, coverPosters = [] }) {
  const validPosters = coverPosters.filter(Boolean)
  const cols  = Math.max(1, Math.min(validPosters.length, 4))
  const slots = validPosters.length > 0
    ? [...validPosters, null, null, null, null].slice(0, cols)
    : [null]

  return (
    <Link
      to={`/lists/${id}`}
      className="block rounded-xl overflow-hidden border border-lb-border/30 group
                 hover:border-lb-accent/40 hover:-translate-y-1
                 hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]
                 transition-all duration-300"
      style={{ background: 'linear-gradient(180deg, #1d2730 0%, #161d25 100%)' }}
    >
      {/* ── Poster strip ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ height: '148px' }}>
        <div
          className="grid h-full"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {slots.map((url, i) => (
            <div
              key={i}
              className="h-full transition-transform duration-700 group-hover:scale-[1.04]"
              style={
                url
                  ? { backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                  : { background: `linear-gradient(135deg, hsl(${(i + 1) * 60},18%,14%), hsl(${(i + 1) * 60 + 35},13%,10%))` }
              }
            />
          ))}
        </div>

        {/* Bottom fade so text sits above posters cleanly */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(22,29,37,0.97) 0%, rgba(22,29,37,0.45) 45%, transparent 80%)',
          }}
        />

        {/* Film-count badge */}
        {itemCount > 0 && (
          <div
            className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded"
            style={{
              background: 'rgba(10,14,18,0.88)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(64,188,244,0.22)',
              color: '#40bcf4',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.1em',
            }}
          >
            {itemCount}
          </div>
        )}
      </div>

      {/* ── Text ─────────────────────────────────────────────────── */}
      <div className="px-4 pt-3 pb-4">
        <h3
          className="display text-white leading-none group-hover:text-lb-accent transition-colors line-clamp-1"
          style={{ fontSize: '1.35rem', letterSpacing: '0.02em' }}
        >
          {name}
        </h3>

        {description && (
          <p className="text-[11px] text-lb-muted/80 mt-1.5 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {ownerUsername && (
          <p className="text-[10px] text-lb-muted/45 mt-2 tracking-widest uppercase">
            {ownerUsername}
          </p>
        )}
      </div>
    </Link>
  )
}

export default ListCard
