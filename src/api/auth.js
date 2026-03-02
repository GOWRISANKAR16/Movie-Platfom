const BASE_URL =
  typeof import.meta !== 'undefined' && import.meta.env
    ? (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
    : ''

function request(path, options = {}) {
  if (!BASE_URL) {
    throw new Error('VITE_API_URL is not set. Add it to your .env file.')
  }
  const url = `${BASE_URL}/${path.replace(/^\//, '')}`
  return fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    credentials: 'include',
  })
}

export async function signup({ username, email, phone, password }) {
  const body = { username, email, password }
  if (phone != null && phone !== '') body.phone = phone
  const res = await request('signup', { method: 'POST', body: JSON.stringify(body) })
  if (res.status === 201) return res.json().catch(() => ({}))
  if (res.status === 409) {
    throw new Error('Username or email already in use. Try signing in or use a different email.')
  }
  let data = {}
  try {
    data = await res.json()
  } catch {
    const text = await res.text()
    if (text) data = { message: text.length > 200 ? text.slice(0, 200) + '…' : text }
  }
  const rawMessage =
    data?.error ||
    data?.message ||
    data?.detail ||
    (Array.isArray(data?.errors) ? data.errors.map((e) => e.message || e.msg || e).join('. ') : null) ||
    null
  if (res.status >= 500) {
    const isDbError = rawMessage && /database|ssl|DB_|connection/i.test(rawMessage)
    throw new Error(
      isDbError
        ? 'Registration is temporarily unavailable due to a server configuration issue. Please try again later.'
        : 'Registration failed. The server may be temporarily unavailable—please try again in a moment.'
    )
  }
  throw new Error(rawMessage || `Registration failed (${res.status})`)
}

export async function signin({ username, password }) {
  const res = await request('signin', { method: 'POST', body: JSON.stringify({ username, password }) })
  if (res.ok) return res.json().catch(() => ({}))
  if (res.status === 401) throw new Error('Invalid username or password')
  throw new Error('Sign in failed, try again.')
}

export async function getCurrentUser() {
  const res = await request('me', { method: 'GET' })
  if (res.ok) return res.json()
  if (res.status === 401) throw new Error('Unauthorized')
  const data = await res.json().catch(() => ({}))
  throw new Error(data?.error || data?.message || 'Request failed')
}
