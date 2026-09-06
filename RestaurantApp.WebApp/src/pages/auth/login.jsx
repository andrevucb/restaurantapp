import logoImage from '../../assets/logo.png'
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../../contexts/useAuth'

function Login() {
  const { isAuthenticated, login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const redirectPath = location.state?.from?.pathname || '/dashboard'

  if (isAuthenticated) return <Navigate to={redirectPath} replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login(username, password)
      navigate(redirectPath, { replace: true })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return(
    <>
      <header className="login-header">
        <img src={logoImage} alt="Logo de la aplicación" className="login-header__logo" />
      </header>

      <main className="login-container">
          <form className="login-form" onSubmit={handleSubmit}>
              <div className="form__input">
                  <label htmlFor="username">Usuario:</label>
                  <input type="text" id="username" name="username" autoComplete="username" autoFocus required value={username} onChange={(event) => setUsername(event.target.value)} />
              </div>
              <div className="form__input">
                  <label htmlFor="password">Contraseña:</label>
                  <input type="password" id="password" name="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
              </div>
              {error && <p role="alert">{error}</p>}
              <button className="form__submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
          </form>
      </main>
    </>
  );
}

export default Login