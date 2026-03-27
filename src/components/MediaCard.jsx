import { Link } from 'react-router-dom'

function PosterPlaceholder({ title }) {
  // deterministic pastel-dark gradient per title
  const hue = [...(title ?? '')].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, hsl(${hue},30%,18%), hsl(${hue + 40},20%,12%))` }}
    >
      <svg className="w-8 h-8 text-lb-muted/40" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3ZM8 7h2v2H8Zm6 0h2v2h-2ZM5 17l3.5-4.5 2.5 3 3.5-4.5L19 17Z" />
      </svg>
    </div>
  )
}

function RatingDot({ score }) {
  if (score == null) return null
  const pct = Math.round((score / 10) * 100)
  const color = pct >= 70 ? '#00e054' : pct >= 40 ? '#ff8000' : '#e94057'
  return (
    <span
      className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black text-white z-10"
      style={{
        background: `conic-gradient(${color} ${pct}%, #2c3440 0)`,
        boxShadow: '0 0 0 2px #14181c',
      }}
      title={`Score: ${score}/10`}
    >
      {score}
    </span>
  )
}

function MediaCard({ id, title, year, posterUrl, score, mediaType }) {
  return (
    <Link to={`/films/${id}`} className="media-card hover:text-white">
      {posterUrl ? (
        <img src={posterUrl} alt={title} loading="lazy" />
      ) : (
        <PosterPlaceholder title={title} />
      )}

      <div className="media-card-overlay">
        <p className="text-white text-xs font-semibold leading-tight line-clamp-2">{title}</p>
        {year && <p className="text-lb-muted text-[10px] mt-0.5">{year}</p>}
      </div>

      <RatingDot score={score} />
    </Link>
  )
}

export default MediaCard
