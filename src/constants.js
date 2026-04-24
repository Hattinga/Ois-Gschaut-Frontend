export const APP_NAME    = import.meta.env.VITE_APP_NAME    ?? 'Ois Gschaut'
export const API_URL     = import.meta.env.VITE_API_URL     ?? 'http://localhost:5000'
export const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT ?? 'development'

export const IS_DEVELOPMENT = ENVIRONMENT === 'development'
export const IS_PRODUCTION  = ENVIRONMENT === 'production'

export const API_ROUTES = {
  users:           `${API_URL}/api/users`,
  usersSearch:     q => `${API_URL}/api/users?search=${encodeURIComponent(q)}`,
  userById:        id => `${API_URL}/api/users/${id}`,
  userProfile:     id => `${API_URL}/api/users/${id}/profile`,
  authGuest:       `${API_URL}/api/auth/guest`,
  authGoogle:      `${API_URL}/api/auth/google`,
  authGitHub:      `${API_URL}/api/auth/github`,
  lists:           `${API_URL}/api/lists`,
  myLists:         `${API_URL}/api/lists/mine`,
  listById:        id => `${API_URL}/api/lists/${id}`,
  media:           `${API_URL}/api/media`,
  importMedia:     `${API_URL}/api/media/import`,
  mediaTrending:   `${API_URL}/api/media/trending`,
  mediaSearch:     q => `${API_URL}/api/media/search?q=${encodeURIComponent(q)}`,
  mediaById:       id => `${API_URL}/api/media/${id}`,
  episodes:        id => `${API_URL}/api/media/${id}/episodes`,
  syncEpisodes:    id => `${API_URL}/api/media/${id}/sync-episodes`,
  listItems:       id => `${API_URL}/api/lists/${id}/items`,
  collaborators:      id => `${API_URL}/api/lists/${id}/collaborators`,
  collaboratorById:   (listId, userId) => `${API_URL}/api/lists/${listId}/collaborators/${userId}`,
  comments:        id => `${API_URL}/api/lists/${id}/comments`,
  watched:         `${API_URL}/api/watched`,
  watchedEpisodes: `${API_URL}/api/watched/episodes`,
  watchlist:       `${API_URL}/api/watchlist`,
  watchlistToggle: `${API_URL}/api/watchlist/toggle`,
}

export const UI = {
  debounceMs:    300,
  toastDuration: 3000,
  itemsPerPage:  20,
}
