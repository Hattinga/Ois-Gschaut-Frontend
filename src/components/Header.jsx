import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCurrentUser } from '../contexts/UserContext'
import { API_ROUTES } from '../constants'
import { apiPost } from '../utils/api'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

// ── Feature 2: Guest Login + OAuth modal ──────────────────────────────────────
function LoginModal({ onClose }) {
  const { login } = useCurrentUser()
  const [guestName, setGuestName]       = useState('')
  const [guestLoading, setGuestLoading] = useState(false)
  const [guestError, setGuestError]     = useState('')

  const handleGuest = async (e) => {
    e.preventDefault()
    if (!guestName.trim()) return
    setGuestLoading(true)
    setGuestError('')
    try {
      const data = await apiPost(API_ROUTES.authGuest, { username: guestName.trim() })
      login(data.user, data.token)
      onClose()
    } catch {
      setGuestError('Name bereits vergeben oder ungültig.')
    } finally {
      setGuestLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-lb-surface border border-lb-border rounded-xl p-8 w-full max-w-sm mx-4 text-center">
        <div className="mb-6">
          <h2 className="text-white font-black text-xl mb-1">Einloggen</h2>
          <p className="text-lb-muted text-sm">Filme tracken, Listen bauen, teilen.</p>
        </div>

        <div className="space-y-3">
          <a
            href={API_ROUTES.authGoogle}
            className="btn btn-secondary btn-md w-full flex items-center justify-center gap-3"
          >
            <GoogleIcon />
            Continue with Google
          </a>
          <a
            href={API_ROUTES.authGitHub}
            className="btn btn-secondary btn-md w-full flex items-center justify-center gap-3"
          >
            <GitHubIcon />
            Continue with GitHub
          </a>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-lb-border/40" />
          <span className="text-[11px] text-lb-muted/50 tracking-widest uppercase">oder</span>
          <div className="flex-1 h-px bg-lb-border/40" />
        </div>

        {/* Guest login */}
        <form onSubmit={handleGuest} className="space-y-2">
          <input
            className="input w-full text-center"
            placeholder="Gastname wählen…"
            value={guestName}
            onChange={e => setGuestName(e.target.value)}
            maxLength={30}
            autoComplete="off"
          />
          {guestError && <p className="text-red-400 text-xs">{guestError}</p>}
          <button
            type="submit"
            disabled={!guestName.trim() || guestLoading}
            className="btn btn-ghost btn-md w-full border border-lb-border/40 hover:border-lb-accent/40"
          >
            {guestLoading ? '…' : 'Als Gast einloggen'}
          </button>
        </form>

        <button
          onClick={onClose}
          className="mt-5 text-xs text-lb-muted hover:text-lb-text transition-colors"
        >
          Ohne Konto stöbern
        </button>
      </div>
    </div>
  )
}

// ── Feature 3: Mobile slide-out drawer ────────────────────────────────────────
function MobileDrawer({ open, onClose, currentUser, logout, onShowLogin }) {
  const location = useLocation()

  // Close drawer on route change
  useEffect(() => {
    onClose()
  }, [location.pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 w-64 flex flex-col"
        style={{
          background: '#14181c',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-lb-border/30">
          <span className="display text-lg text-lb-green tracking-wider">OIS</span>
          <button
            onClick={onClose}
            className="text-lb-muted hover:text-white transition-colors p-1"
            aria-label="Menü schließen"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 px-3 pt-4">
          {[
            { to: '/films', label: 'Filme' },
            { to: '/lists', label: 'Listen' },
            { to: '/users', label: 'Mitglieder' },
            ...(currentUser ? [{ to: '/watchlist', label: 'Watchlist' }] : []),
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded text-sm font-semibold transition-colors ${isActive ? 'text-white bg-lb-card' : 'text-lb-muted hover:text-white hover:bg-lb-card/50'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Auth section at bottom */}
        <div className="mt-auto px-5 py-6 border-t border-lb-border/30">
          {currentUser ? (
            <div className="space-y-3">
              <Link
                to={`/users/${currentUser.id}`}
                className="block text-sm font-semibold text-white hover:text-lb-accent transition-colors"
              >
                {currentUser.username}
              </Link>
              <Link to="/settings" className="block text-xs text-lb-muted hover:text-white transition-colors">
                Einstellungen
              </Link>
              <button onClick={logout} className="block text-xs text-lb-muted hover:text-white transition-colors">
                Abmelden
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => { onClose(); onShowLogin() }}
                className="btn btn-primary btn-md w-full"
              >
                Einloggen
              </button>
              <button
                onClick={() => { onClose(); onShowLogin() }}
                className="btn btn-ghost btn-md w-full text-lb-muted"
              >
                Stöbern
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function Header() {
  const { currentUser, logout } = useCurrentUser()
  const [showLogin, setShowLogin]       = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <header
        className="sticky top-0 z-40 border-b border-lb-border/60"
        style={{ background: 'rgba(20,24,28,0.85)', backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-6">

          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0"
            style={{ lineHeight: 1 }}
          >
            <img
              src="/logo.png"
              alt="Ois Gschaut"
              className="h-8 w-auto"
              style={{ mixBlendMode: 'screen' }}
            />
            <span className="display text-2xl text-lb-green tracking-wider">OIS</span>
            <span className="display text-2xl text-white tracking-wider">GSCHAUT</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5">
            <NavLink to="/films" className={({ isActive }) => `nav-link ${isActive ? 'text-white' : ''}`}>
              Filme
            </NavLink>
            <NavLink to="/lists" className={({ isActive }) => `nav-link ${isActive ? 'text-white' : ''}`}>
              Listen
            </NavLink>
            <NavLink to="/users" className={({ isActive }) => `nav-link ${isActive ? 'text-white' : ''}`}>
              Mitglieder
            </NavLink>
            {currentUser && (
              <NavLink to="/watchlist" className={({ isActive }) => `nav-link ${isActive ? 'text-white' : ''}`}>
                Watchlist
              </NavLink>
            )}
          </nav>

          <div className="flex-1" />

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <>
                <Link
                  to={`/users/${currentUser.id}`}
                  className="text-white font-semibold text-sm hover:text-lb-accent transition-colors"
                >
                  {currentUser.username}
                </Link>
                <Link to="/settings" className="nav-link text-xs">
                  Einstellungen
                </Link>
                <button onClick={logout} className="nav-link text-xs">
                  Abmelden
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setShowLogin(true)} className="nav-link">
                  Einloggen
                </button>
                <button onClick={() => setShowLogin(true)} className="btn btn-primary btn-sm">
                  Loslegen
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-lb-muted hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Menü öffnen"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        currentUser={currentUser}
        logout={logout}
        onShowLogin={() => setShowLogin(true)}
      />

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  )
}

export default Header
