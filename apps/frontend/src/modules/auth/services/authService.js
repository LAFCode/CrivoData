import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
})

/**
 * Login with username and password via real backend API.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{ user: { name: string, role: string, username: string }, token: string }>}
 */
export async function loginService(email, password) {
  const response = await api.post('/auth/login', { email, password })
  const { access_token, refresh_token } = response.data

  return {
    user: { username: email, name: email, role: 'User' },
    token: access_token,
  }
}

/**
 * Validate stored token on app boot.
 * Currently just returns the stored user.
 */
export async function validateTokenService(token) {
  return JSON.parse(localStorage.getItem('crivodata_user'))
}