import { forwardRef, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import MediaCard from '../components/MediaCard'
import ListCard from '../components/ListCard'
import { useFetch, useScrollReveal } from '../hooks'
import { API_ROUTES } from '../constants'
import { useCurrentUser } from '../contexts/UserContext'

// ── Constants ────────────────────────────────────────────────────
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

// ── Helpers ──────────────────────────────────────────────────────
function easeOutCubic(t) {
  const c = Math.max(0, Math.min(1, t))
  return 1 - Math.pow(1 - c, 3)
}

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

// ── PosterCard (used in scroll hero) ─────────────────────────────
const PosterCard = forwardRef(function PosterCard({ url, staticStyle }, ref) {
  return (
    <div
      ref={ref}
      className="absolute rounded-lg overflow-hidden"
      style={{
        aspectRatio: '2 / 3',
        boxShadow: '0 28px 72px rgba(0,0,0,0.72), 0 0 0 1px rgba(255,255,255,0.07)',
        willChange: 'transform',
        ...staticStyle,
      }}
    >
      {url ? (
        <img src={url} alt="" className="w-full h-full object-cover" loading="eager" />
      ) : (
        <div
          className="w-full h-full"
          style={{ background: 'linear-gradient(135deg, #1e2b3a 0%, #141b24 100%)' }}
        />
      )}
    </div>
  )
})

// ── Scroll Hero (desktop ≥ 1024px) ───────────────────────────────
// Sentinel div (200 vh) drives scroll progress. Hero is position:fixed
// so it overlays the page while sentinel scrolls beneath it, then fades
// out as sentinel exits the viewport — zero dead space after hero.
function ScrollHero({ posterUrls, totalFilms, totalLists, mediaLoading }) {
  const sentinelRef  = useRef(null)
  const heroRef      = useRef(null)
  const p0Ref        = useRef(null)   // outer-left poster
  const p1Ref        = useRef(null)   // outer-right poster
  const p2Ref        = useRef(null)   // inner-left poster
  const p3Ref        = useRef(null)   // inner-right poster
  const taglineRef   = useRef(null)
  const statsRef     = useRef(null)
  const hintRef      = useRef(null)

  const posters = [...posterUrls, null, null, null, null].slice(0, 4)

  useEffect(() => {
    const handle = () => {
      const sentinel = sentinelRef.current
      const hero     = heroRef.current
      if (!sentinel || !hero) return

      const rect     = sentinel.getBoundingClientRect()
      const vh       = window.innerHeight
      // progress 0→1 as sentinel top scrolls from 0 to -vh
      const progress = Math.max(0, Math.min(1, -rect.top / vh))
      // fade hero out as sentinel bottom approaches viewport top
      const fadeOut  = Math.max(0, Math.min(1, 1 - rect.bottom / vh))

      hero.style.opacity      = String(1 - fadeOut)
      hero.style.pointerEvents = fadeOut > 0.9 ? 'none' : 'auto'

      // Outer pair arrives first; inner pair starts 0.07 into scroll
      const pO = easeOutCubic(progress / 0.55)
      const pI = easeOutCubic(Math.max(0, progress - 0.07) / 0.55)

      if (p0Ref.current)
        p0Ref.current.style.transform =
          `translateX(${(1 - pO) * -120}vw) rotate(${(1 - pO) * -7}deg)`
      if (p1Ref.current)
        p1Ref.current.style.transform =
          `translateX(${(1 - pO) * 120}vw) rotate(${(1 - pO) * 7}deg)`
      if (p2Ref.current)
        p2Ref.current.style.transform =
          `translateX(${(1 - pI) * -130}vw) rotate(${(1 - pI) * -4}deg)`
      if (p3Ref.current)
        p3Ref.current.style.transform =
          `translateX(${(1 - pI) * 130}vw) rotate(${(1 - pI) * 4}deg)`

      // Tagline + CTA fade in after posters arrive (progress 0.35 → 0.70)
      if (taglineRef.current)
        taglineRef.current.style.opacity =
          String(Math.min(1, Math.max(0, (progress - 0.35) / 0.35)))

      // Stats fade in slightly later (progress 0.55 → 0.80)
      if (statsRef.current)
        statsRef.current.style.opacity =
          String(Math.min(1, Math.max(0, (progress - 0.55) / 0.25)))

      // Scroll hint fades out as soon as scrolling starts
      if (hintRef.current)
        hintRef.current.style.opacity = String(1 - Math.min(1, progress / 0.07))
    }

    window.addEventListener('scroll', handle, { passive: true })
    handle()
    return () => window.removeEventListener('scroll', handle)
  }, []) // refs are stable — no deps needed

  return (
    <>
      {/* Sentinel: 200 vh of scroll space, no visual content */}
      <div ref={sentinelRef} style={{ height: '200vh' }} />

      {/* Fixed hero: overlays page while sentinel scrolls, then fades out */}
      <div
        ref={heroRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '100vh',
          zIndex: 20,
          overflow: 'hidden',
        }}
      >
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, #060a0e 0%, #19283a 50%, #14181c 100%)' }}
        />

        {/* Scan lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(180deg, transparent 0px, transparent 3px, rgba(255,255,255,0.014) 3px, rgba(255,255,255,0.014) 4px)',
          }}
        />

        {/* Film strip perforations */}
        <div className="absolute left-0 top-0 bottom-0 w-7 flex flex-col justify-around py-3 z-10 opacity-35">
          <FilmHoles count={24} />
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-7 flex flex-col justify-around py-3 z-10 opacity-35">
          <FilmHoles count={24} />
        </div>

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 110% 80% at 50% 45%, transparent 18%, rgba(0,0,0,0.68) 100%)',
          }}
        />

        {/* ── Poster cards ──────────────────────────────────────── */}

        {/* P0 — outer left, starts off-screen left */}
        <PosterCard
          ref={p0Ref}
          url={posters[0]}
          staticStyle={{ left: '2%', top: '14%', width: '164px' }}
        />

        {/* P1 — outer right, starts off-screen right */}
        <PosterCard
          ref={p1Ref}
          url={posters[2]}
          staticStyle={{ right: '2%', top: '14%', width: '164px' }}
        />

        {/* P2 — inner left, slightly below + inward */}
        <PosterCard
          ref={p2Ref}
          url={posters[1]}
          staticStyle={{ left: '18%', top: '50%', width: '140px', zIndex: 2 }}
        />

        {/* P3 — inner right, slightly below + inward */}
        <PosterCard
          ref={p3Ref}
          url={posters[3]}
          staticStyle={{ right: '18%', top: '50%', width: '140px', zIndex: 2 }}
        />

        {/* ── Center content ────────────────────────────────────── */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center"
          style={{ paddingTop: '2.5rem', zIndex: 4 }}
        >
          {/* Logo mark */}
          <img
            src="/logo.png"
            alt=""
            aria-hidden="true"
            style={{
              height: 'clamp(50px, 6.5vw, 84px)',
              width: 'auto',
              mixBlendMode: 'screen',
              filter: 'drop-shadow(0 0 28px rgba(0,224,84,0.3))',
              opacity: 0.88,
              marginBottom: '1.25rem',
            }}
          />

          <p
            className="section-label text-lb-accent tracking-[0.4em] mb-5"
            style={{ fontSize: '10px' }}
          >
            Dein Filmtagebuch
          </p>

          {/* Main wordmark */}
          <div>
            <div
              className="display text-white select-none"
              style={{ fontSize: 'clamp(5rem, 16vw, 13rem)', lineHeight: 0.84, letterSpacing: '-0.01em' }}
            >
              OIS
            </div>
            <div
              className="display select-none glow-pulse"
              style={{
                fontSize: 'clamp(4rem, 14vw, 11rem)',
                lineHeight: 0.84,
                letterSpacing: '-0.01em',
                color: '#00e054',
                textShadow: '0 0 60px rgba(0,224,84,0.22), 0 0 120px rgba(0,224,84,0.09)',
              }}
            >
              GSCHAUT
            </div>
          </div>

          {/* Tagline + CTA — fades in as posters arrive */}
          <div ref={taglineRef} style={{ opacity: 0 }}>
            <p
              className="text-lb-muted max-w-xs mx-auto mt-6 mb-8 leading-relaxed"
              style={{ fontSize: '0.88rem' }}
            >
              Speicher jeden Film den&apos;d g&apos;schaut hast.
              Bau Listen mit deine Freind.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link to="/films" className="btn btn-primary btn-lg">Loslegen</Link>
              <Link to="/films" className="btn btn-secondary btn-lg">Entdecken</Link>
            </div>
          </div>

          {/* Stats — fades in even later */}
          {!mediaLoading && (
            <div ref={statsRef} className="flex items-center gap-8 mt-9" style={{ opacity: 0 }}>
              <div className="text-center">
                <div className="display text-3xl text-white" style={{ lineHeight: 1 }}>{totalFilms}</div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-lb-muted mt-1">Filme</div>
              </div>
              <div className="w-px h-10 bg-lb-border/30" />
              <div className="text-center">
                <div className="display text-3xl text-white" style={{ lineHeight: 1 }}>{totalLists}</div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-lb-muted mt-1">Listen</div>
              </div>
              <div className="w-px h-10 bg-lb-border/30" />
              <div className="text-center">
                <div className="display text-3xl" style={{ lineHeight: 1, color: '#40bcf4' }}>∞</div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-lb-muted mt-1">Möglichkeiten</div>
              </div>
            </div>
          )}
        </div>

        {/* Scroll hint */}
        <div
          ref={hintRef}
          className="absolute bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          style={{ zIndex: 5 }}
        >
          <span
            style={{
              fontSize: '9px',
              letterSpacing: '0.32em',
              color: 'rgba(139,163,176,0.45)',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            Scroll
          </span>
          <svg
            className="scroll-bounce w-4 h-4"
            fill="none"
            stroke="rgba(139,163,176,0.4)"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </>
  )
}

// ── Static Hero (mobile < 1024px) ────────────────────────────────
function PosterMosaic({ posters }) {
  if (!posters.length) return null
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
            style={{ filter: 'brightness(0.26) saturate(0.4)' }}
            loading="eager"
          />
        ))}
      </div>
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

function StaticHero({ posterUrls, totalFilms, totalLists, mediaLoading }) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        minHeight: '100vh',
        clipPath: 'polygon(0 0, 100% 0, 100% 93%, 0 100%)',
      }}
    >
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(160deg, #060a0e 0%, #19283a 50%, #14181c 100%)' }}
      />
      <PosterMosaic posters={posterUrls} />

      <div className="absolute left-0 top-0 bottom-0 w-7 hidden sm:flex flex-col justify-around py-3 z-10 opacity-50">
        <FilmHoles count={24} />
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-7 hidden sm:flex flex-col justify-around py-3 z-10 opacity-50">
        <FilmHoles count={24} />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(180deg, transparent 0px, transparent 3px, rgba(255,255,255,0.018) 3px, rgba(255,255,255,0.018) 4px)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 110% 80% at 50% 45%, transparent 20%, rgba(0,0,0,0.72) 100%)',
        }}
      />

      <div
        className="page-container relative flex flex-col items-center justify-center text-center"
        style={{ minHeight: '100vh', paddingTop: '6rem', paddingBottom: '12rem' }}
      >
        <div className="hero-animate mb-6" style={{ animationDelay: '0ms' }}>
          <img
            src="/logo.png"
            alt=""
            aria-hidden="true"
            style={{
              height: 'clamp(54px, 8vw, 80px)',
              width: 'auto',
              mixBlendMode: 'screen',
              filter: 'drop-shadow(0 0 24px rgba(0,224,84,0.28))',
              opacity: 0.88,
            }}
          />
        </div>

        <p
          className="section-label text-lb-accent tracking-[0.4em] mb-8 hero-animate"
          style={{ animationDelay: '60ms' }}
        >
          Dein Filmtagebuch
        </p>

        <div className="hero-animate" style={{ animationDelay: '120ms' }}>
          <div
            className="display text-white leading-none select-none"
            style={{ fontSize: 'clamp(5.5rem, 19vw, 15rem)', lineHeight: 0.84, letterSpacing: '-0.01em' }}
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

        <p
          className="text-lb-muted max-w-xs mx-auto mt-8 mb-10 leading-relaxed hero-animate"
          style={{ fontSize: '0.95rem', animationDelay: '220ms' }}
        >
          Speicher jeden Film den&apos;d g&apos;schaut hast.
          Bau Listen mit deine Freind.
          Entdeck wos nächstes kommt.
        </p>

        <div
          className="flex items-center justify-center gap-3 hero-animate"
          style={{ animationDelay: '300ms' }}
        >
          <Link to="/films" className="btn btn-primary btn-lg">Loslegen</Link>
          <Link to="/films" className="btn btn-secondary btn-lg">Filme entdecken</Link>
        </div>

        {!mediaLoading && (
          <div
            className="flex items-center gap-8 mt-14 hero-animate"
            style={{ animationDelay: '400ms' }}
          >
            <div className="text-center">
              <div className="display text-4xl text-white" style={{ lineHeight: 1 }}>{totalFilms}</div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-lb-muted mt-1">Filme</div>
            </div>
            <div className="w-px h-12 bg-lb-border/30" />
            <div className="text-center">
              <div className="display text-4xl text-white" style={{ lineHeight: 1 }}>{totalLists}</div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-lb-muted mt-1">Listen</div>
            </div>
            <div className="w-px h-12 bg-lb-border/30" />
            <div className="text-center">
              <div className="display text-4xl" style={{ lineHeight: 1, color: '#40bcf4' }}>∞</div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-lb-muted mt-1">Möglichkeiten</div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// ── Dashboard (logged in) ────────────────────────────────────────
function DashboardView({ currentUser }) {
  const { data: profile, loading: profileLoading } = useFetch(API_ROUTES.userProfile(currentUser.id))
  const { data: watchlistData, loading: watchlistLoading } = useFetch(API_ROUTES.watchlistFull)

  const watchlistFilms = (watchlistData ?? []).slice(0, 8)
  const seenMedia      = new Set()
  const recentWatched  = (profile?.recentWatched ?? [])
    .filter(w => { if (seenMedia.has(w.mediaId)) return false; seenMedia.add(w.mediaId); return true })
    .slice(0, 8)
  const myLists = (profile?.lists ?? []).slice(0, 3)

  return (
    <div
      className="border-b border-lb-border/30"
      style={{ background: 'linear-gradient(180deg, #0d1117 0%, #14181c 100%)' }}
    >
      <div className="page-container py-10">
        <div className="mb-8">
          <p className="section-label text-lb-accent tracking-widest mb-1">Willkommen zurück</p>
          <h1 className="display text-5xl text-white leading-none">{currentUser.username}</h1>
        </div>

        {!profileLoading && profile && (
          <div className="flex gap-6 mb-10">
            {[
              { value: profile.filmsWatched, label: 'Gesehen' },
              { value: profile.listCount,    label: 'Listen' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="display text-3xl text-white" style={{ lineHeight: 1 }}>{value}</div>
                <div className="text-[10px] tracking-widest uppercase text-lb-muted mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        )}

        {(watchlistLoading || watchlistFilms.length > 0) && (
          <div className="mb-8">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="shelf-label">Deine Watchlist</h2>
              <Link to="/watchlist" className="text-xs text-lb-muted hover:text-white transition-colors">Alle →</Link>
            </div>
            {watchlistLoading ? (
              <div className="flex gap-3">
                {Array.from({ length: 6 }).map((_, i) => <div key={i} className="media-card animate-pulse bg-lb-card shelf-item" />)}
              </div>
            ) : (
              <div className="shelf-scroll">
                {watchlistFilms.map(film => (
                  <div key={film.id} className="shelf-item">
                    <MediaCard
                      id={film.id} title={film.title}
                      year={film.releaseDate ? new Date(film.releaseDate).getFullYear() : undefined}
                      posterUrl={film.assets?.find(a => a.assetType === 'Poster')?.url}
                      score={film.ratings?.[0]?.score}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {recentWatched.length > 0 && (
          <div className="mb-8">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="shelf-label">Zuletzt angesehen</h2>
              <Link to={`/users/${currentUser.id}`} className="text-xs text-lb-muted hover:text-white transition-colors">Profil →</Link>
            </div>
            <div className="shelf-scroll">
              {recentWatched.map(w => (
                <div key={w.mediaId} className="shelf-item">
                  <MediaCard id={w.mediaId} title={w.title} posterUrl={w.posterUrl} />
                </div>
              ))}
            </div>
          </div>
        )}

        {myLists.length > 0 && (
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="shelf-label">Deine Listen</h2>
              <Link to="/lists" className="text-xs text-lb-muted hover:text-white transition-colors">Alle →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {myLists.map(list => (
                <ListCard
                  key={list.id} id={list.id} name={list.name}
                  description={list.description}
                  itemCount={list.itemCount ?? 0}
                  coverPosters={list.coverPosters ?? []}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Home ─────────────────────────────────────────────────────────
export default function Home() {
  const { currentUser } = useCurrentUser()
  const { data: mediaData, loading: mediaLoading } = useFetch(API_ROUTES.media)
  const { data: listsData, loading: listsLoading } = useFetch(API_ROUTES.lists)

  const recentFilms = (mediaData ?? []).slice(0, 6)
  const recentLists = (listsData ?? []).slice(0, 3)
  const totalFilms  = (mediaData ?? []).length
  const totalLists  = (listsData ?? []).length
  const posterUrls  = (mediaData ?? [])
    .map(f => f.assets?.find(a => a.assetType === 'Poster')?.url)
    .filter(Boolean)

  const tickerItems = [...TICKER_ITEMS, ...TICKER_ITEMS]

  const featureRef = useScrollReveal()
  const filmsRef   = useScrollReveal()
  const listsRef   = useScrollReveal()
  const ctaRef     = useScrollReveal()

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      {currentUser ? (
        <DashboardView currentUser={currentUser} />
      ) : (
        <>
          {/* Desktop: scroll-driven poster fly-in */}
          <div className="hidden lg:block">
            <ScrollHero
              posterUrls={posterUrls}
              totalFilms={totalFilms}
              totalLists={totalLists}
              mediaLoading={mediaLoading}
            />
          </div>
          {/* Mobile: static mosaic hero */}
          <div className="lg:hidden">
            <StaticHero
              posterUrls={posterUrls}
              totalFilms={totalFilms}
              totalLists={totalLists}
              mediaLoading={mediaLoading}
            />
          </div>
        </>
      )}

      {/* ── Ticker ───────────────────────────────────────────────── */}
      <div
        className="overflow-hidden border-b border-lb-border/20"
        style={{ background: 'rgba(20,24,28,0.9)', backdropFilter: 'blur(8px)' }}
      >
        <div className="ticker-track items-center py-3">
          {tickerItems.map((phrase, i) => (
            <span key={i} className="flex items-center">
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

      {/* ── Feature trio ─────────────────────────────────────────── */}
      <section ref={featureRef} className="page-container py-20 scroll-reveal reveal-up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:divide-x divide-lb-border/20">
          {FEATURES.map(({ num, title, body }) => (
            <div
              key={num}
              className="py-10 md:py-0 md:px-10 first:md:pl-0 last:md:pr-0
                         border-t border-lb-border/20 md:border-t-0"
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

      {/* ── Trending films ───────────────────────────────────────── */}
      <section ref={filmsRef} className="page-container py-8 scroll-reveal reveal-up">
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

      {/* ── Beliebte Listen ──────────────────────────────────────── */}
      <section ref={listsRef} className="page-container py-8 scroll-reveal reveal-up">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="shelf-label">Beliebte Listen</h2>
          <Link to="/lists" className="text-xs text-lb-muted hover:text-white transition-colors">
            Mehr Listen →
          </Link>
        </div>

        {listsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-lb-card rounded-xl animate-pulse border border-lb-border/20" />
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

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section
        ref={ctaRef}
        className="mt-16 py-24 text-center relative overflow-hidden scroll-reveal reveal-scale"
        style={{ background: 'linear-gradient(160deg, #14181c 0%, #1a2535 55%, #14181c 100%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(64,188,244,0.12) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <img
            src="/logo.png"
            alt=""
            style={{
              height: '320px',
              width: 'auto',
              opacity: 0.035,
              mixBlendMode: 'screen',
              filter: 'saturate(0)',
            }}
          />
        </div>
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
