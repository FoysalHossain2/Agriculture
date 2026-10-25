import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true,          // send/receive HTTP-only cookies
  headers: { 'Content-Type': 'application/json' },
})

// ── Request Interceptor ───────────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// ── Response Interceptor ──────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export default api
