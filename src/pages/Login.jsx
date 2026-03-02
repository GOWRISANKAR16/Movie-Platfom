import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signin } from '../api/auth'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signin({ username, password })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message === 'Invalid username or password' ? 'Invalid username or password' : 'Sign in failed, try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="app auth-page">
      <header className="nav">
        <div className="nav-left">
          <Link to="/" className="logo-text">MovieFlix</Link>
        </div>
        <div className="nav-right">
          <Link to="/" className="nav-button">Home</Link>
        </div>
      </header>
      <main className="auth-main">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1 className="auth-title">Sign In</h1>
          {error && <p className="auth-error">{error}</p>}
          <label className="auth-label">
            Username
            <input
              type="text"
              className="auth-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </label>
          <label className="auth-label">
            Password
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          <button type="submit" className="btn btn-primary auth-submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
          <p className="auth-footer">
            New to MovieFlix? <Link to="/signup">Sign up</Link>.
          </p>
        </form>
      </main>
    </div>
  )
}
