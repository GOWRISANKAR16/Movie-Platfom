import axios from 'axios'

const API_BASE_URL = 'https://api.themoviedb.org/3'

// For Vitest we allow falling back to a test key
const apiKey =
  (typeof process !== 'undefined' && process.env?.VITE_TMDB_API_KEY) ||
  (typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.VITE_TMDB_API_KEY
    : undefined)

const client = axios.create({
  baseURL: API_BASE_URL,
  params: {
    api_key: apiKey,
    language: 'en-US',
  },
})

async function get(path, params = {}) {
  const response = await client.get(path, { params })
  return response.data
}

export async function fetchHomePageData() {
  if (!apiKey) {
    throw new Error('TMDB API key is missing. Set VITE_TMDB_API_KEY in your .env file.')
  }

  const [
    trending,
    netflixOriginals,
    topRated,
    action,
    comedy,
    horror,
    romance,
  ] = await Promise.all([
    get('/trending/all/week'),
    get('/discover/tv', { with_networks: 213 }),
    get('/movie/top_rated'),
    get('/discover/movie', { with_genres: 28 }),
    get('/discover/movie', { with_genres: 35 }),
    get('/discover/movie', { with_genres: 27 }),
    get('/discover/movie', { with_genres: 10749 }),
  ])

  const hero =
    trending.results?.find((item) => item.backdrop_path) || trending.results?.[0] || null

  const sections = [
    {
      id: 'netflix-originals',
      title: 'Netflix Originals',
      items: netflixOriginals.results ?? [],
    },
    {
      id: 'trending',
      title: 'New this week',
      items: trending.results ?? [],
    },
    {
      id: 'top-rated',
      title: 'Top Rated',
      items: topRated.results ?? [],
    },
    {
      id: 'action',
      title: 'Action',
      items: action.results ?? [],
    },
    {
      id: 'comedy',
      title: 'Comedy',
      items: comedy.results ?? [],
    },
    {
      id: 'horror',
      title: 'Horror',
      items: horror.results ?? [],
    },
    {
      id: 'romance',
      title: 'Romance',
      items: romance.results ?? [],
    },
  ]

  return { hero, sections }
}

