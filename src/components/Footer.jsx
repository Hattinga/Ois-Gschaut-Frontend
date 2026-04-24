function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-lb-border mt-16 py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-lb-muted text-xs">
          &copy; {year} Ois Gschaut
        </p>
        <span className="text-lb-muted text-xs">A 4th class DBI school project</span>
      </div>
    </footer>
  )
}

export default Footer
