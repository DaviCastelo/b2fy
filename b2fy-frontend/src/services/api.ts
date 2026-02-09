const API_BASE = '/api'

function getToken(): string | null {
  return localStorage.getItem('b2fy_token')
}

function getHeaders(includeAuth = true): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  const token = getToken()
  if (includeAuth && token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }
  return headers
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || res.statusText || 'Erro na requisição')
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  async get<T>(path: string, auth = true): Promise<T> {
    const res = await fetch(API_BASE + path, { headers: getHeaders(auth) })
    return handleResponse<T>(res)
  },
  async post<T>(path: string, body?: unknown, auth = true): Promise<T> {
    const res = await fetch(API_BASE + path, {
      method: 'POST',
      headers: getHeaders(auth),
      body: body ? JSON.stringify(body) : undefined,
    })
    return handleResponse<T>(res)
  },
  async put<T>(path: string, body: unknown, auth = true): Promise<T> {
    const res = await fetch(API_BASE + path, {
      method: 'PUT',
      headers: getHeaders(auth),
      body: JSON.stringify(body),
    })
    return handleResponse<T>(res)
  },
  async patch<T>(path: string, body?: unknown, auth = true): Promise<T> {
    const res = await fetch(API_BASE + path, {
      method: 'PATCH',
      headers: getHeaders(auth),
      body: body != null ? JSON.stringify(body) : undefined,
    })
    return handleResponse<T>(res)
  },
  async delete<T>(path: string, auth = true): Promise<T> {
    const res = await fetch(API_BASE + path, { method: 'DELETE', headers: getHeaders(auth) })
    return handleResponse<T>(res)
  },
}

export function setStoredToken(token: string | null) {
  if (token) localStorage.setItem('b2fy_token', token)
  else localStorage.removeItem('b2fy_token')
}

export function getStoredToken() {
  return getToken()
}
