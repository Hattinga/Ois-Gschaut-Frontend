import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../contexts/UserContext'

export default function AuthCallback() {
  const { login } = useCurrentUser()
  const navigate  = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token  = params.get('token')
    const user   = params.get('user')
    const error  = params.get('error')

    if (error || !token || !user) {
      navigate('/?auth_error=1', { replace: true })
      return
    }

    try {
      login(JSON.parse(decodeURIComponent(user)), token)
      navigate('/', { replace: true })
    } catch {
      navigate('/?auth_error=1', { replace: true })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex items-center justify-center bg-lb-bg">
      <p className="text-lb-muted text-sm">Signing you in…</p>
    </div>
  )
}
