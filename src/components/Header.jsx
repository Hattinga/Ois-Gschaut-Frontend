import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCurrentUser } from '../contexts/UserContext'
import { API_ROUTES } from '../constants'

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

function LoginModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-lb-surface border border-lb-border rounded-xl p-8 w-full max-w-sm mx-4 text-center">
        <div className="mb-6">
          <h2 className="text-white font-black text-xl mb-1">Sign in</h2>
          <p className="text-lb-muted text-sm">Track films, build lists, share with friends.</p>
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

        <button
          onClick={onClose}
          className="mt-6 text-xs text-lb-muted hover:text-lb-text transition-colors"
        >
          Browse without account
        </button>
      </div>
    </div>
  )
}

function Header() {
  const { currentUser, logout } = useCurrentUser()
  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-lb-border/60"
        style={{ background: 'rgba(20,24,28,0.85)', backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-6">

          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" style={{ lineHeight: 1 }}>
            <img
              src="/logo.png"
              alt="Ois Gschaut"
              className="h-8 w-auto"
              style={{ mixBlendMode: 'screen' }}
            />
            <span className="display text-2xl text-lb-green tracking-wider">OIS</span>
            <span className="display text-2xl text-white tracking-wider">GSCHAUT</span>
          </Link>

          <nav className="flex items-center gap-5">
            <NavLink
              to="/films"
              className={({ isActive }) => `nav-link ${isActive ? 'text-white' : ''}`}
            >
              Films
            </NavLink>
            <NavLink
              to="/lists"
              className={({ isActive }) => `nav-link ${isActive ? 'text-white' : ''}`}
            >
              Lists
            </NavLink>
            <NavLink
              to="/users"
              className={({ isActive }) => `nav-link ${isActive ? 'text-white' : ''}`}
            >
              Members
            </NavLink>
          </nav>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                <Link to={`/users/${currentUser.id}`} className="text-white font-semibold text-sm hover:text-lb-accent transition-colors">
                  {currentUser.username}
                </Link>
                <Link to="/settings" className="nav-link text-xs">
                  Settings
                </Link>
                <button onClick={logout} className="nav-link text-xs">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setShowLogin(true)} className="nav-link">
                  Sign in
                </button>
                <button onClick={() => setShowLogin(true)} className="btn btn-primary btn-sm">
                  Get started
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  )
}

export default Header
