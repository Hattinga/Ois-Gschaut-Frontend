/**
 * API Base Configuration
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const apiConfig = {
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
}

/**
 * Generic API call function
 */
export async function apiCall(endpoint, options = {}) {
    const response = await fetch(endpoint, {
        headers: apiConfig.headers,
        ...options,
    })

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`)
    }

    if (response.status === 204) return null

    return response.json()
}

/**
 * GET request
 */
export function apiGet(endpoint) {
    return apiCall(endpoint, { method: 'GET' })
}

/**
 * POST request
 */
export function apiPost(endpoint, data) {
    return apiCall(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

/**
 * PUT request
 */
export function apiPut(endpoint, data) {
    return apiCall(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
}

/**
 * DELETE request
 */
export function apiDelete(endpoint) {
    return apiCall(endpoint, { method: 'DELETE' })
}
