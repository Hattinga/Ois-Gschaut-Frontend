import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCurrentUser } from '../contexts/UserContext'
import { API_ROUTES } from '../constants'
import { apiPut, apiDelete } from '../utils/api'

export default function AccountSettings() {
  const { currentUser, updateUser, logout } = useCurrentUser()
  const navigate = useNavigate()

  const [username, setUsername]         = useState(currentUser?.username ?? '')
  const [saving, setSaving]             = useState(false)
  const [saveError, setSaveError]       = useState(null)
  const [saveSuccess, setSaveSuccess]   = useState(false)

  const [confirmDelete, setConfirmDelete] = useState('')
  const [deleting, setDeleting]           = useState(false)
  const [deleteError, setDeleteError]     = useState(null)

  if (!currentUser) {
    return (
      <div className="page-container py-24 text-center">
        <p className="text-lb-muted mb-4">You must be signed in to access settings.</p>
        <Link to="/" className="btn btn-secondary btn-md">Go home</Link>
      </div>
    )
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!username.trim() || username.trim() === currentUser.username) return
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)
    try {
      const updated = await apiPut(API_ROUTES.userById(currentUser.id), { username: username.trim() })
      updateUser(updated)
      setSaveSuccess(true)
    } catch (err) {
      setSaveError(err.message.includes('409') || err.message.toLowerCase().includes('conflict')
        ? 'That username is already taken.'
        : 'Failed to update username.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (confirmDelete !== currentUser.username) return
    setDeleting(true)
    setDeleteError(null)
    try {
      await apiDelete(API_ROUTES.userById(currentUser.id))
      logout()
      navigate('/')
    } catch {
      setDeleteError('Failed to delete account. Please try again.')
      setDeleting(false)
    }
  }

  return (
    <div className="page-container py-10 max-w-lg">
      <h1 className="text-2xl font-black text-white mb-8">Account Settings</h1>

      {/* Change username */}
      <section className="bg-lb-surface border border-lb-border rounded-lg p-6 mb-6">
        <h2 className="text-base font-bold text-white mb-4">Username</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs text-lb-muted uppercase tracking-wide mb-1 block">New username</label>
            <input
              className="input w-full"
              value={username}
              onChange={e => { setUsername(e.target.value); setSaveSuccess(false); setSaveError(null) }}
              maxLength={50}
              autoComplete="off"
            />
          </div>
          {saveError   && <p className="text-red-400 text-xs">{saveError}</p>}
          {saveSuccess && <p className="text-lb-green text-xs">Username updated successfully.</p>}
          <button
            type="submit"
            disabled={!username.trim() || username.trim() === currentUser.username || saving}
            className="btn btn-primary btn-md"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </section>

      {/* Connected account */}
      <section className="bg-lb-surface border border-lb-border rounded-lg p-6 mb-6">
        <h2 className="text-base font-bold text-white mb-1">Connected account</h2>
        {currentUser.oauthProvider ? (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-lb-green text-sm">✓</span>
            <span className="text-sm text-lb-text capitalize">{currentUser.oauthProvider}</span>
            <span className="text-xs text-lb-muted">— signed in via OAuth</span>
          </div>
        ) : (
          <p className="text-xs text-lb-muted mt-2">No OAuth provider linked to this account.</p>
        )}
      </section>

      {/* Danger zone */}
      <section className="bg-lb-surface border border-red-900/60 rounded-lg p-6">
        <h2 className="text-base font-bold text-red-400 mb-1">Danger zone</h2>
        <p className="text-xs text-lb-muted mb-4">
          Deleting your account removes all your lists, comments, and watch history. This cannot be undone.
        </p>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-lb-muted mb-1 block">
              Type <span className="text-white font-mono">{currentUser.username}</span> to confirm
            </label>
            <input
              className="input w-full"
              placeholder={currentUser.username}
              value={confirmDelete}
              onChange={e => { setConfirmDelete(e.target.value); setDeleteError(null) }}
            />
          </div>
          {deleteError && <p className="text-red-400 text-xs">{deleteError}</p>}
          <button
            onClick={handleDelete}
            disabled={confirmDelete !== currentUser.username || deleting}
            className="btn btn-md text-red-400 border border-red-900 hover:bg-red-900/30 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {deleting ? 'Deleting…' : 'Delete account'}
          </button>
        </div>
      </section>
    </div>
  )
}
