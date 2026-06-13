import { create } from 'zustand'
import { loginService, validateTokenService } from '../services/authService'

const STORAGE_KEY_TOKEN = 'crivodata_token'
const STORAGE_KEY_USER = 'crivodata_user'

export const useAuthStore = create((set, get) => ({
  // ─── State ───────────────────────────────────────
  user: JSON.parse(localStorage.getItem(STORAGE_KEY_USER) || 'null'),
  token: localStorage.getItem(STORAGE_KEY_TOKEN) || null,
  isAuthenticated: !!localStorage.getItem(STORAGE_KEY_TOKEN),
  isLoading: false,
  error: null,

  // ─── Actions ─────────────────────────────────────

  /**
   * Login with username and password.
   * On success persists token + user to localStorage.
   */
  login: async (username, password) => {
    set({ isLoading: true, error: null })

    try {
      const { user, token } = await loginService(username, password)

      // Persist
      localStorage.setItem(STORAGE_KEY_TOKEN, token)
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user))

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: err.message || 'Erro ao fazer login',
      })
      throw err
    }
  },

  /**
   * Logout — clears state and storage.
   */
  logout: () => {
    localStorage.removeItem(STORAGE_KEY_TOKEN)
    localStorage.removeItem(STORAGE_KEY_USER)

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
  },

  /**
   * Validate stored token on app boot.
   */
  validateSession: async () => {
    const token = localStorage.getItem(STORAGE_KEY_TOKEN)

    if (!token) {
      get().logout()
      return
    }

    try {
      const user = await validateTokenService(token)
      set({ user, token, isAuthenticated: true })
    } catch {
      get().logout()
    }
  },

  /**
   * Clear any auth error.
   */
  clearError: () => set({ error: null }),
}))