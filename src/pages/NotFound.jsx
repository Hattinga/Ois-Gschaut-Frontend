import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="text-8xl font-black text-lb-border select-none">404</p>
      <h1 className="text-2xl font-bold text-white mt-4 mb-2">Page not found</h1>
      <p className="text-lb-muted text-sm mb-8 max-w-xs">
        This page doesn&apos;t exist or was removed.
      </p>
      <Link to="/" className="btn btn-secondary btn-md">
        Back to home
      </Link>
    </div>
  )
}

export default NotFound
