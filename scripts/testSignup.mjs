/**
 * Run this to see what the backend returns for signup.
 * Usage: node scripts/testSignup.mjs
 * Ensure .env has VITE_API_URL and the backend is running.
 */
import 'dotenv/config'

const BASE_URL = (process.env.VITE_API_URL || process.env.API_URL || '').replace(/\/$/, '')
if (!BASE_URL) {
  console.error('Set VITE_API_URL in .env')
  process.exit(1)
}

const url = `${BASE_URL}/signup`
const body = {
  username: 'testuser' + Date.now(),
  email: `test${Date.now()}@example.com`,
  password: 'testpass123',
}

console.log('POST', url)
console.log('Body:', JSON.stringify(body, null, 2))

const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
  credentials: 'include',
})

const text = await res.text()
let data = text
try {
  data = JSON.parse(text)
} catch {}

console.log('Status:', res.status)
console.log('Response:', typeof data === 'object' ? JSON.stringify(data, null, 2) : data)

if (res.status === 201) {
  console.log('\nSignup succeeded. Backend is working.')
  process.exit(0)
}

console.log('\nSignup failed. Use the status and response above to fix the frontend or backend.')
process.exit(1)
