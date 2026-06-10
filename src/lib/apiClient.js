import { getSupabase } from './supabase'

const API_BASE = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '')

async function getAuthHeaders() {
  const supabase = getSupabase()
  if (!supabase) return {}

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.access_token) return {}
  return { Authorization: `Bearer ${session.access_token}` }
}

export async function apiRequest(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {
    Accept: 'application/json',
    ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
  }

  if (auth) {
    Object.assign(headers, await getAuthHeaders())
  }

  let response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    return {
      data: null,
      error: new Error(err.message || 'Failed to reach API server'),
    }
  }

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    return {
      data: null,
      error: new Error(payload.error || response.statusText || 'Request failed'),
    }
  }

  return { data: payload.data ?? null, error: null }
}
