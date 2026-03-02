import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import * as tmdb from './tmdb/api'

vi.mock('./tmdb/api')

const mockData = {
  hero: {
    id: 1,
    title: 'Money Heist',
    overview: 'A group of robbers plan the biggest heist in history.',
    backdrop_path: '/hero.jpg',
    vote_average: 8.8,
    vote_count: 1000,
  },
  sections: [
    {
      id: 'trending',
      title: 'Trending Now',
      items: [
        { id: 1, title: 'Money Heist', poster_path: '/poster.jpg' },
        { id: 2, title: 'Another Movie', poster_path: '/poster2.jpg' },
      ],
    },
  ],
}

tmdb.fetchHomePageData.mockResolvedValue(mockData)

describe('App', () => {
  it('renders home with hero title and row title', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    const heroTitle = await screen.findByText(/Money Heist/i)
    const rowTitle = await screen.findByText(/Trending Now/i)

    expect(heroTitle).toBeInTheDocument()
    expect(rowTitle).toBeInTheDocument()
  })
})

