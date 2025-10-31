import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api' })
const TOKEN_KEY = 'auth_token'

// attach token
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// simple retry for network errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config
    if (!config || config.__retry) throw error
    if (error.code === 'ERR_NETWORK' || !error.response) {
      config.__retry = true
      await new Promise((r) => setTimeout(r, 300))
      return api(config)
    }
    
    // Handle 401 errors
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      window.location.href = '/login'
    }
    
    const message = error.response?.data?.error || 'Request failed'
    toast.error(message)
    throw error
  }
)

export default api