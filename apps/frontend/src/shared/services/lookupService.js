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

export const lookupService = {
  listWorkflowStatuses() {
    return api.get('/lookups/workflow-statuses')
  },

  listWorkflowTypes() {
    return api.get('/lookups/workflow-types')
  },

  listRecurrenceTypes() {
    return api.get('/lookups/recurrence-types')
  },

  listExecutionTypes() {
    return api.get('/lookups/execution-types')
  },

  listTimezones() {
    return api.get('/lookups/timezones')
  },
}

export default lookupService
