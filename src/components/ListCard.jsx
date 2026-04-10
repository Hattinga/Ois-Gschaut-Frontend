import { Link } from 'react-router-dom'

function PosterStrip({ urls = [] }) {
  const filled = [...urls, null, null, null, null].slice(0, 4)
  return (
    <div className="grid grid-cols-4 gap-0.5 rounded overflow-hidden" style={{ aspectRatio: '4/1.5' }}>
      {filled.map((url, i) => (
        <div
          key={i}
          className="bg-lb-card"
          style={
            url
              ? { backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : { background: `linear-gradient(135deg, hsl(${i * 55},25%,15%), hsl(${i * 55 + 30},20%,10%))` }
          }
        />
      ))}
    </div>
  )
}

function ListCard({ id, name, description, ownerUsername, itemCount = 0, coverPosters = [] }) {
  return (
    <Link
      to={`/lists/${id}`}
      className="block bg-lb-card rounded overflow-hidden hover:bg-lb-surface transition-colors group"
    >
      <PosterStrip urls={coverPosters} />

      <div className="p-3">
        <h3 className="text-sm font-semibold text-white group-hover:text-lb-accent transition-colors line-clamp-1">
          {name}
        </h3>
        {description && (
          <p className="text-xs text-lb-muted mt-1 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2 text-[10px] text-lb-muted">
          {ownerUsername && <span>{ownerUsername}</span>}
          {ownerUsername && itemCount > 0 && <span>·</span>}
          {itemCount > 0 && <span>{itemCount} film{itemCount !== 1 ? 's' : ''}</span>}
        </div>
      </div>
    </Link>
  )
}

export default ListCard
