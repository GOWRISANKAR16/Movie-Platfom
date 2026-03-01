import './App.css'
import { useEffect, useState } from 'react'
import { fetchHomePageData } from './tmdb/api'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original'

function App() {
  const [sections, setSections] = useState([])
  const [hero, setHero] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      try {
        const data = await fetchHomePageData()
        if (!isMounted) return
        setSections(data.sections)
        setHero(data.hero)
      } catch (err) {
        if (!isMounted) return
        setError(err.message || 'Failed to load movies')
      } finally {
        if (isMounted) setLoading(false)
      }
    })()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="app">
      <header className="nav">
        <div className="nav-left">
          <span className="logo-text">MovieFlix</span>
        </div>
        <div className="nav-right">
          <a href="https://movie-platfom.vercel.app/login.html" className="nav-button">Sign In</a>
        </div>
      </header>

      {hero && (
        <main
          className="hero"
          style={{
            backgroundImage: hero.backdrop_path
              ? `url(${IMAGE_BASE_URL}${hero.backdrop_path})`
              : 'url(/src/assets/hero-money-heist.png)',
          }}
        >
          <div className="hero-overlay" />
          <div className="hero-content">
            <h1 className="hero-title">{hero.title || hero.name}</h1>
            {hero.vote_average ? (
              <div className="hero-meta">
                <span className="hero-rating">
                  IMDb {hero.vote_average.toFixed(1)}
                </span>
                {hero.vote_count ? (
                  <span className="hero-votes">
                    {hero.vote_count.toLocaleString()} ratings
                  </span>
                ) : null}
              </div>
            ) : null}
            <p className="hero-overview">{hero.overview}</p>
            <div className="hero-actions">
              <button className="btn btn-primary">Play</button>
              <button className="btn btn-secondary">Watch Trailer</button>
            </div>
          </div>
        </main>
      )}

      <section className="content">
        {loading && <p className="status-text">Loading movies...</p>}
        {error && !loading && <p className="status-text error">{error}</p>}
        {!loading &&
          !error &&
          sections.map((section) => (
            <div key={section.id} className="row">
              <h2 className="row-title">{section.title}</h2>
              <div className="row-posters">
                {section.items.map((item) => (
                  <article key={item.id} className="poster-card">
                    {item.poster_path ? (
                      <img
                        src={`${IMAGE_BASE_URL}${item.poster_path}`}
                        alt={item.title || item.name}
                        className="poster-image"
                        loading="lazy"
                      />
                    ) : (
                      <div className="poster-placeholder">
                        {item.title || item.name}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          ))}
      </section>
    </div>
  )
}

export default App
