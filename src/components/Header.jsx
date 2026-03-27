import { Link, NavLink } from 'react-router-dom'

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-lb-bg border-b border-lb-border">
      <div className="max-w-6xl mx-auto px-4 h-12 flex items-center gap-6">

        {/* Logo */}
        <Link to="/" className="text-lb-green font-black text-base tracking-tight hover:text-lb-green">
          ois gschaut
        </Link>

        {/* Primary nav */}
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

        {/* Right side */}
        <div className="flex items-center gap-4">
          <button className="nav-link">Sign in</button>
          <Link
            to="/register"
            className="btn btn-primary btn-sm"
          >
            Create account
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
