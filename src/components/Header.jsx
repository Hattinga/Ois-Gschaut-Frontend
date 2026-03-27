import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCurrentUser } from '../contexts/UserContext'
import { API_ROUTES } from '../constants'
import { apiPost } from '../utils/api'

function GuestLoginModal({ onClose }) {
  const { login } = useCurrentUser()
  const [username, setUsername] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim()) return
    setLoading(true)
    setError(null)
    try {
      const { user, token } = await apiPost(API_ROUTES.authGuest, { username: username.trim() })
      login(user, token)
      onClose()
    } catch {
      setError('Could not connect to server. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-lb-surface border border-lb-border rounded-lg p-6 w-full max-w-sm mx-4">
        <h2 className="text-white font-black text-xl mb-1">Set your username</h2>
        <p className="text-lb-muted text-sm mb-5">Choose a username to create lists and post comments.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="input w-full"
            placeholder="e.g. filmfan99"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
            maxLength={50}
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="btn btn-secondary btn-md">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!username.trim() || loading}
              className="btn btn-primary btn-md"
            >
              {loading ? 'Saving…' : 'Continue'}
            </button>
          </div>
        </form>

        <div className="mt-5 pt-4 border-t border-lb-border">
          <p className="text-xs text-lb-muted text-center mb-3">Or sign in with</p>
          <div className="flex gap-2">
            <button
              disabled
              title="Coming soon"
              className="btn btn-secondary btn-md flex-1 opacity-40 cursor-not-allowed"
            >
              Google
            </button>
            <button
              disabled
              title="Coming soon"
              className="btn btn-secondary btn-md flex-1 opacity-40 cursor-not-allowed"
            >
              GitHub
            </button>
          </div>
          <p className="text-xs text-lb-muted text-center mt-2">OAuth coming soon</p>
        </div>
      </div>
    </div>
  )
}

function Header() {
  const { currentUser, logout } = useCurrentUser()
  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 bg-lb-bg border-b border-lb-border">
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center gap-6">

          <Link to="/" className="text-lb-green font-black text-base tracking-tight hover:text-lb-green">
            ois gschaut
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

      {showLogin && <GuestLoginModal onClose={() => setShowLogin(false)} />}
    </>
  )
}

export default Header
