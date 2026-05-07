import { Link } from 'react-router-dom'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-lb-border/40 mt-16 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 hover:opacity-75 transition-opacity"
            style={{ lineHeight: 1 }}
          >
            <img
              src="/logo.png"
              alt="Ois Gschaut"
              style={{ height: '28px', width: 'auto', mixBlendMode: 'screen' }}
            />
            <span className="display text-xl text-lb-green tracking-wider">OIS</span>
            <span className="display text-xl text-white tracking-wider">GSCHAUT</span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-6">
            {[
              { to: '/films',    label: 'Filme' },
              { to: '/lists',    label: 'Listen' },
              { to: '/users',    label: 'Mitglieder' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-xs font-bold tracking-widest uppercase text-lb-muted hover:text-white transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-lb-muted/50 text-xs">
            &copy; {year} Ois Gschaut &mdash; 4th class DBI
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
