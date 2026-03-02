import 'dotenv/config'
import axios from 'axios'

const baseURL = process.env.VITE_API_URL || process.env.API_URL

if (!baseURL) {
  console.error('Backend URL is missing. Set VITE_API_URL in your .env file (e.g. VITE_API_URL=http://localhost:3000).')
  process.exit(1)
}

const client = axios.create({
  baseURL: baseURL.replace(/\/$/, ''),
  timeout: 5000,
  validateStatus: () => true,
})

async function main() {
  try {
    const res = await client.get('/me')
    if (res.status === 200) {
      console.log('Backend is connected. GET /me returned 200 (user session present).')
      process.exit(0)
    }
    if (res.status === 401) {
      console.log('Backend is connected. GET /me returned 401 (no auth cookie) – auth API is reachable.')
      process.exit(0)
    }
    console.warn(`Backend responded with status ${res.status}. URL: ${baseURL}`)
    process.exit(0)
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      console.error(`Backend not reachable at ${baseURL}. Is the server running? (ECONNREFUSED)`)
    } else if (err.code === 'ENOTFOUND') {
      console.error(`Backend host not found: ${baseURL}. Check VITE_API_URL.`)
    } else if (err.code === 'ETIMEDOUT' || err.message?.includes('timeout')) {
      console.error(`Backend timed out at ${baseURL}. Server may be down or slow.`)
    } else {
      console.error('Error checking backend:', err.message)
    }
    process.exit(1)
  }
}

main()
