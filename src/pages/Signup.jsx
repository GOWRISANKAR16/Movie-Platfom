import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../api/auth'

export default function Signup() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signup({ username, email, phone, password })
      navigate('/login', { replace: true })
    } catch (err) {
      const msg = err.message || 'Sign up failed'
      setError(msg === 'Failed to fetch' ? 'Network error. Check that the backend is running and CORS allows this origin.' : msg)
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
          <Link to="/login" className="nav-button">Sign In</Link>
        </div>
      </header>
      <main className="auth-main">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1 className="auth-title">Sign Up</h1>
          {error && <p className="auth-error">{error}</p>}
          <label className="auth-label">
            Username
            <input type="text" className="auth-input" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
          </label>
          <label className="auth-label">
            Email
            <input type="email" className="auth-input" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </label>
          <label className="auth-label">
            Phone <span className="auth-optional">(optional)</span>
            <input type="tel" className="auth-input" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
          </label>
          <label className="auth-label">
            Password
            <input type="password" className="auth-input" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
          </label>
          <button type="submit" className="btn btn-primary auth-submit" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Sign Up'}
          </button>
          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>.
          </p>
        </form>
      </main>
    </div>
  )
}
