/**
 * Application Constants
 */

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Ois Gschaut'
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
export const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || 'development'

export const IS_DEVELOPMENT = ENVIRONMENT === 'development'
export const IS_PRODUCTION = ENVIRONMENT === 'production'

/**
 * API Routes
 */
export const API_ROUTES = {
    USERS: '/api/users',
    POSTS: '/api/posts',
    COMMENTS: '/api/comments',
}

/**
 * UI Constants
 */
export const DEBOUNCE_DELAY = 300
export const TOAST_DURATION = 3000
export const ITEMS_PER_PAGE = 10
