import { useMemo, useState } from 'react'
import { AuthContext } from './AuthContextDefinition'

const tokenStorageKey = 'restaurantapp.auth.token'
const apiUrl = 'http://localhost:5148/api'

function isTokenValid(token) {
  if (!token) return false

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return !payload.exp || payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

function getTokenClaims(token) {
  if (!token) return null

  try {
    const encodedPayload = token.split('.')[1]
    const payload = encodedPayload.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

function getStoredToken() {
  const token = localStorage.getItem(tokenStorageKey)

  if (isTokenValid(token)) return token

  localStorage.removeItem(tokenStorageKey)
  return null
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken)
  const user = getTokenClaims(token)

  const value = useMemo(() => {
    function logout() {
      localStorage.removeItem(tokenStorageKey)
      setToken(null)
    }

    async function login(username, password) {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        throw new Error(response.status === 401 ? 'Usuario o contraseña incorrectos.' : 'No se pudo iniciar sesión.')
      }

      const data = await response.json()
      localStorage.setItem(tokenStorageKey, data.token)
      setToken(data.token)
    }

    async function authFetch(url, options = {}) {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401) logout()

      return response
    }

    return { token, user, isAuthenticated: Boolean(token), login, logout, authFetch }
  }, [token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
