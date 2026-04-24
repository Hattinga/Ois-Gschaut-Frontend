import { Link } from 'react-router-dom'
import MediaCard from '../components/MediaCard'
import ListCard from '../components/ListCard'
import { useFetch } from '../hooks'
import { API_ROUTES } from '../constants'

const FEATURES = [
  {
    num: '01',
    title: 'FILMTAGEBUCH\nFÜHREN',
    body: 'Track jeden Film den\'d je g\'schaut hast — oder fang einfach heut an.',
  },
  {
    num: '02',
    title: 'LISTEN\nKURATIEREN',
    body: 'Erstell und teil thematische Watchlists. Arbeit mit Freind\'n zusammen.',
  },
  {
    num: '03',
    title: 'TRACKEN &\nDISKUTIERN',
    body: 'Diskutier Filme und Serien mit der Community in Listen-Kommentaren.',
  },
]

const TICKER_ITEMS = [
  'Wos hast scho g\'schaut?',
  'Dein Filmtagebuch',
  'Jetzt mitmachen',
  'Kostenlos dabei sein',
  'Alles g\'schaut?',
  'Listen erstellen',
  'Gschaun & g\'redt',
  'A Gschicht za jedem Film',
]

function FilmHoles({ count = 20 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: '16px',
            height: '9px',
            borderRadius: '2px',
            background: 'rgba(0,0,0,0.75)',
            border: '1px solid rgba(255,255,255,0.05)',
            margin: '0 auto',
          }}
        />
      ))}
    </>
  )
}

function PosterMosaic({ posters }) {
  if (!posters.length) return null

  // Tile posters to fill a 6-column grid
  const tiled = []
  while (tiled.length < 18) {
    for (const p of posters) {
      tiled.push(p)
      if (tiled.length >= 18) break
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute grid gap-0.5"
        style={{
          gridTemplateColumns: 'repeat(6, 1fr)',
          top: '-8%',
          height: '116%',
          left: 0,
          right: 0,
        }}
      >
        {tiled.slice(0, 18).map((url, i) => (
          <img
            key={i}
            src={url}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.28) saturate(0.45)' }}
            loading="eager"
          />
        ))}
      </div>

      {/* Gradient overlay — heavy left, lighter centre */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, rgba(6,10,14,0.98) 0%, rgba(14,18,22,0.9) 40%, rgba(18,24,30,0.84) 65%, rgba(14,18,22,0.96) 100%)',
        }}
      />
    </div>
  )
}

export default function Home() {
  const { data: mediaData, loading: mediaLoading } = useFetch(API_ROUTES.media)
  const { data: listsData, loading: listsLoading } = useFetch(API_ROUTES.lists)

  const recentFilms = (mediaData ?? []).slice(0, 6)
  const recentLists = (listsData ?? []).slice(0, 3)
  const totalFilms  = (mediaData ?? []).length
  const totalLists  = (listsData ?? []).length

  const posterUrls = (mediaData ?? [])
    .map(f => f.assets?.find(a => a.assetType === 'Poster')?.url)
    .filter(Boolean)

  // Duplicate ticker items for seamless loop
  const tickerItems = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          minHeight: '100vh',
          clipPath: 'polygon(0 0, 100% 0, 100% 93%, 0 100%)',
        }}
      >
        {/* Base gradient */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, #060a0e 0%, #19283a 50%, #14181c 100%)' }}
        />

        {/* Poster mosaic from real API data */}
        <PosterMosaic posters={posterUrls} />

        {/* Film strip perforations — left */}
        <div className="absolute left-0 top-0 bottom-0 w-7 hidden sm:flex flex-col justify-around py-3 z-10 opacity-50">
          <FilmHoles count={24} />
        </div>

        {/* Film strip perforations — right */}
        <div className="absolute right-0 top-0 bottom-0 w-7 hidden sm:flex flex-col justify-around py-3 z-10 opacity-50">
          <FilmHoles count={24} />
        </div>

        {/* Horizontal scan lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(180deg, transparent 0px, transparent 3px, rgba(255,255,255,0.018) 3px, rgba(255,255,255,0.018) 4px)',
            opacity: 1,
          }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 110% 80% at 50% 45%, transparent 20%, rgba(0,0,0,0.72) 100%)',
          }}
        />

        {/* Hero content */}
        <div
          className="page-container relative flex flex-col items-center justify-center text-center"
          style={{ minHeight: '100vh', paddingTop: '6rem', paddingBottom: '12rem' }}
        >
          {/* Label */}
          <p
            className="section-label text-lb-accent tracking-[0.4em] mb-8 hero-animate"
            style={{ animationDelay: '0ms' }}
          >
            Dein Filmtagebuch
          </p>

          {/* Main display type */}
          <div className="hero-animate" style={{ animationDelay: '80ms' }}>
            <div
              className="display text-white leading-none select-none"
              style={{
                fontSize: 'clamp(5.5rem, 19vw, 15rem)',
                lineHeight: 0.84,
                letterSpacing: '-0.01em',
              }}
            >
              OIS
            </div>
            <div
              className="display leading-none select-none glow-pulse"
              style={{
                fontSize: 'clamp(4.5rem, 16vw, 13rem)',
                lineHeight: 0.84,
                letterSpacing: '-0.01em',
                color: '#00e054',
                textShadow: '0 0 60px rgba(0,224,84,0.22), 0 0 120px rgba(0,224,84,0.09)',
              }}
            >
              GSCHAUT
            </div>
          </div>

          {/* Tagline */}
          <p
            className="text-lb-muted max-w-xs mx-auto mt-8 mb-10 leading-relaxed hero-animate"
            style={{ fontSize: '0.95rem', animationDelay: '200ms' }}
          >
            Speicher jeden Film den&apos;d g&apos;schaut hast.
            Bau Listen mit deine Freind.
            Entdeck wos nächstes kommt.
          </p>

          {/* CTA buttons */}
          <div
            className="flex items-center justify-center gap-3 hero-animate"
            style={{ animationDelay: '280ms' }}
          >
            <Link to="/films" className="btn btn-primary btn-lg">Loslegen</Link>
            <Link to="/films" className="btn btn-secondary btn-lg">Filme entdecken</Link>
          </div>

          {/* Live stats row */}
          {!mediaLoading && (
            <div
              className="flex items-center gap-8 mt-14 hero-animate"
              style={{ animationDelay: '380ms' }}
            >
              <div className="text-center">
                <div className="display text-4xl text-white" style={{ lineHeight: 1 }}>
                  {totalFilms}
                </div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-lb-muted mt-1">
                  Filme
                </div>
              </div>
              <div className="w-px h-12 bg-lb-border/30" />
              <div className="text-center">
                <div className="display text-4xl text-white" style={{ lineHeight: 1 }}>
                  {totalLists}
                </div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-lb-muted mt-1">
                  Listen
                </div>
              </div>
              <div className="w-px h-12 bg-lb-border/30" />
              <div className="text-center">
                <div
                  className="display text-4xl"
                  style={{ lineHeight: 1, color: '#40bcf4' }}
                >
                  ∞
                </div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-lb-muted mt-1">
                  Möglichkeiten
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Ticker strip ─────────────────────────────────────────────── */}
      <div
        className="overflow-hidden border-b border-lb-border/20"
        style={{ background: 'rgba(20,24,28,0.9)', backdropFilter: 'blur(8px)', marginTop: '-1px' }}
      >
        <div className="ticker-track items-center gap-0 py-3">
          {tickerItems.map((phrase, i) => (
            <span key={i} className="flex items-center gap-0">
              <span
                className="px-6"
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(160,170,180,0.6)',
                  whiteSpace: 'nowrap',
                }}
              >
                {phrase}
              </span>
              <span style={{ color: 'rgba(64,188,244,0.4)', fontSize: '14px' }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Feature trio — editorial numbered cards ───────────────────── */}
      <section className="page-container py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:divide-x divide-lb-border/20">
          {FEATURES.map(({ num, title, body }) => (
            <div
              key={num}
              className="py-10 md:py-0 md:px-10 first:md:pl-0 last:md:pr-0 border-t border-lb-border/20 md:border-t-0"
            >
              <div
                className="display mb-2"
                style={{ fontSize: '3.5rem', lineHeight: 1, color: '#40bcf4', opacity: 0.2 }}
              >
                {num}
              </div>
              <div className="h-px bg-lb-border/25 mb-5" />
              <h3
                className="display text-white mb-4"
                style={{ fontSize: '1.6rem', lineHeight: 1.1, whiteSpace: 'pre-line' }}
              >
                {title}
              </h3>
              <p className="text-lb-muted text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ── Gerade angesagt (recent films) ───────────────────────────── */}
      <section className="page-container py-8">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="shelf-label">Gerade angesagt</h2>
          <Link to="/films" className="text-xs text-lb-muted hover:text-white transition-colors">
            Mehr Filme →
          </Link>
        </div>

        {mediaLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 md:gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="media-card animate-pulse bg-lb-card" />
            ))}
          </div>
        ) : recentFilms.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 md:gap-3">
            {recentFilms.map(film => (
              <MediaCard
                key={film.id}
                id={film.id}
                title={film.title}
                year={film.releaseDate ? new Date(film.releaseDate).getFullYear() : undefined}
                posterUrl={film.assets?.find(a => a.assetType === 'Poster')?.url}
                score={film.ratings?.[0]?.score}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-lb-muted text-sm mb-3">Noch koa Film.</p>
            <Link to="/films" className="btn btn-accent btn-sm">Filme entdecken →</Link>
          </div>
        )}
      </section>

      <div className="divider" />

      {/* ── Beliebte Listen ──────────────────────────────────────────── */}
      <section className="page-container py-8">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="shelf-label">Beliebte Listen</h2>
          <Link to="/lists" className="text-xs text-lb-muted hover:text-white transition-colors">
            Mehr Listen →
          </Link>
        </div>

        {listsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-lb-card rounded animate-pulse" />
            ))}
          </div>
        ) : recentLists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recentLists.map(list => (
              <ListCard
                key={list.id}
                id={list.id}
                name={list.name}
                description={list.description}
                itemCount={list.itemCount ?? 0}
                coverPosters={list.coverPosters ?? []}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-lb-muted text-sm mb-3">Noch koa Liste.</p>
            <Link to="/lists" className="btn btn-accent btn-sm">Liste erstellen →</Link>
          </div>
        )}
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section
        className="mt-16 py-24 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #14181c 0%, #1a2535 55%, #14181c 100%)' }}
      >
        {/* Dot grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(64,188,244,0.12) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(14,18,22,0.8) 100%)',
          }}
        />

        <div className="page-container relative">
          <p className="section-label text-lb-accent tracking-[0.35em] mb-3">Werde a Teil</p>
          <h2
            className="display text-white mb-4"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', lineHeight: 1.05 }}
          >
            Starte heut dein<br />Filmtagebuch.
          </h2>
          <p className="text-lb-muted text-sm mb-8">
            Kostenlos mitmachen. Keine Kreditkarte nötig.
          </p>
          <Link to="/films" className="btn btn-accent btn-lg">
            Kostenlos mitmachen
          </Link>
        </div>
      </section>
    </>
  )
}
