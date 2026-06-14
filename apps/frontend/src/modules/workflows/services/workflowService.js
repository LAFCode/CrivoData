import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('crivodata_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('crivodata_token')
      localStorage.removeItem('crivodata_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const workflowService = {
  list() {
    return api.get('/workflows/')
  },

  get(id) {
    return api.get(`/workflows/${id}`)
  },

  create(data) {
    return api.post('/workflows/', data)
  },

  update(id, data) {
    return api.put(`/workflows/${id}`, data)
  },

  delete(id) {
    return api.delete(`/workflows/${id}`)
  },
}

export default workflowService