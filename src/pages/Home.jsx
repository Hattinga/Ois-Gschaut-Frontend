import { Link } from 'react-router-dom'
import MediaCard from '../components/MediaCard'
import ListCard from '../components/ListCard'
import { useFetch } from '../hooks'
import { API_ROUTES } from '../constants'

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125v-3.375c0-1.243 1.007-2.25 2.25-2.25h1.5M8.25 19.5h5.25M8.25 9H6.375A2.625 2.625 0 0 0 3.75 11.625V13.5m16.5 6h-1.5m1.5 0A1.125 1.125 0 0 0 21 18.375V17.25m0 1.125v-3.375c0-1.243-1.007-2.25-2.25-2.25h-1.5M15.75 9h1.875a2.625 2.625 0 0 1 2.625 2.625V13.5M12 3.75v8.25m0 0-3-3m3 3 3-3" />
      </svg>
    ),
    title: 'Keep a diary',
    body: 'Track every film you have ever watched — or just start from today.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
    ),
    title: 'Curate lists',
    body: 'Build and share themed watchlists. Collaborate with friends.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    ),
    title: 'Rate & review',
    body: 'Share your ratings and opinions with the community.',
  },
]

export default function Home() {
  const { data: mediaData, loading: mediaLoading } = useFetch(API_ROUTES.media)
  const { data: listsData, loading: listsLoading } = useFetch(API_ROUTES.lists)

  const recentFilms = (mediaData ?? []).slice(0, 6)
  const recentLists = (listsData ?? []).slice(0, 3)

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        className="relative py-20 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1f2a38 0%, #14181c 60%)' }}
      >
        {/* faint film-strip accent */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, #40bcf4 0px, #40bcf4 1px, transparent 1px, transparent 80px)',
          }}
        />

        <div className="page-container relative text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-white">
            Track films you&apos;ve watched.
          </h1>
          <p className="text-lb-muted text-lg md:text-xl max-w-xl mx-auto mb-8">
            Save those you want to see. Share lists with friends.
            <br />
            <span className="text-white font-semibold">Ois Gschaut</span> ist dein Filmtagebuch.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/films" className="btn btn-primary btn-lg">
              Get started — it&apos;s free
            </Link>
            <Link to="/films" className="btn btn-secondary btn-lg">
              Browse films
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section className="page-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map(({ icon, title, body }) => (
            <div key={title} className="flex flex-col gap-3">
              <div className="text-lb-accent">{icon}</div>
              <h3 className="text-white font-bold text-base">{title}</h3>
              <p className="text-lb-muted text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ── Recent films ─────────────────────────────────────────────── */}
      <section className="page-container py-8">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="section-label">Popular this week</h2>
          <Link to="/films" className="text-xs text-lb-muted hover:text-white transition-colors">
            More films →
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
            <p className="text-lb-muted text-sm mb-3">No films yet.</p>
            <Link to="/films" className="btn btn-accent btn-sm">Discover films →</Link>
          </div>
        )}
      </section>

      <div className="divider" />

      {/* ── Recent lists ─────────────────────────────────────────────── */}
      <section className="page-container py-8">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="section-label">Popular lists</h2>
          <Link to="/lists" className="text-xs text-lb-muted hover:text-white transition-colors">
            More lists →
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
            <p className="text-lb-muted text-sm mb-3">No lists yet.</p>
            <Link to="/lists" className="btn btn-accent btn-sm">Create a list →</Link>
          </div>
        )}
      </section>

      {/* ── CTA footer banner ────────────────────────────────────────── */}
      <section
        className="mt-16 py-16 text-center"
        style={{ background: 'linear-gradient(180deg, #14181c 0%, #1f2a38 100%)' }}
      >
        <p className="text-lb-muted text-sm mb-3 tracking-widest uppercase">Join the community</p>
        <h2 className="text-3xl font-black text-white mb-6">Start your film diary today.</h2>
        <Link to="/films" className="btn btn-accent btn-lg">
          Create a free account
        </Link>
      </section>
    </>
  )
}
