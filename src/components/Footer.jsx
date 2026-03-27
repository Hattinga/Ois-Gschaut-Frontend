function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-lb-border mt-16 py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-lb-muted text-xs">
          &copy; {year} Ois Gschaut
        </p>
        <nav className="flex gap-6">
          {['About', 'Contact', 'Privacy', 'Terms'].map(label => (
            <a
              key={label}
              href="#"
              className="text-xs text-lb-muted hover:text-white transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}

export default Footer
