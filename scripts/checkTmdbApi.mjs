import 'dotenv/config'
import axios from 'axios'

const apiKey = process.env.VITE_TMDB_API_KEY || process.env.TMDB_API_KEY

if (!apiKey) {
  console.error('TMDB API key is missing. Set VITE_TMDB_API_KEY in your .env file.')
  process.exit(1)
}

const client = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: apiKey,
  },
})

async function main() {
  try {
    const response = await client.get('/movie/popular', { params: { page: 1 } })
    if (response.status === 200 && Array.isArray(response.data?.results)) {
      console.log(`TMDB API is working. Received ${response.data.results.length} movies.`)
      process.exit(0)
    } else {
      console.error('TMDB API returned an unexpected response shape.')
      process.exit(1)
    }
  } catch (error) {
    console.error('Error calling TMDB API:', error.response?.status, error.message)
    process.exit(1)
  }
}

main()

