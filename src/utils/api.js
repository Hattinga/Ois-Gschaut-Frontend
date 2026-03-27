const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const apiConfig = {
  baseURL: API_URL,
}

function authHeaders() {
  const token = localStorage.getItem('og_token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function apiCall(endpoint, options = {}) {
  const response = await fetch(endpoint, {
    headers: authHeaders(),
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  if (response.status === 204) return null

  return response.json()
}

export function apiGet(endpoint) {
  return apiCall(endpoint, { method: 'GET' })
}

export function apiPost(endpoint, data) {
  return apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function apiPut(endpoint, data) {
  return apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function apiDelete(endpoint) {
  return apiCall(endpoint, { method: 'DELETE' })
}
