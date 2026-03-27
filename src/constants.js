export const APP_NAME    = import.meta.env.VITE_APP_NAME    ?? 'Ois Gschaut'
export const API_URL     = import.meta.env.VITE_API_URL     ?? 'http://localhost:5000'
export const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT ?? 'development'

export const IS_DEVELOPMENT = ENVIRONMENT === 'development'
export const IS_PRODUCTION  = ENVIRONMENT === 'production'

export const API_ROUTES = {
  users:        '/api/users',
  lists:        '/api/lists',
  media:        '/api/media',
  listItems:    id => `/api/lists/${id}/items`,
  collaborators: id => `/api/lists/${id}/collaborators`,
  comments:     id => `/api/lists/${id}/comments`,
  mediaById:    id => `/api/media/${id}`,
  episodes:     id => `/api/media/${id}/episodes`,
}

export const UI = {
  debounceMs:    300,
  toastDuration: 3000,
  itemsPerPage:  20,
}
