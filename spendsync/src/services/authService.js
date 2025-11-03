import api from './api'

const TOKEN_KEY = 'auth_token'

// SSR-safe token management
const isClient = typeof window !== 'undefined'

export const getToken = () => {
  if (!isClient) return null
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch (error) {
    console.warn('Failed to get token from localStorage:', error)
    return null
  }
}

export const setToken = (token) => {
  if (!isClient || !token) return

  try {
    localStorage.setItem(TOKEN_KEY, token)
    // Update axios default headers - use consistent header name
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } catch (error) {
    console.warn('Failed to save token to localStorage:', error)
  }
}

// 🔹 Restore token immediately when this file loads
const token = getToken()
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  console.log('✅ Token restored from localStorage')
}


export const removeToken = () => {
  if (!isClient) return

  try {
    localStorage.removeItem(TOKEN_KEY)
    delete api.defaults.headers.common['Authorization']
  } catch (error) {
    console.warn('Failed to remove token from localStorage:', error)
  }
}

// Initialize token from localStorage on app startup


// Request interceptor to ensure token is always attached to requests
api.interceptors.request.use(
  (config) => {
    // Always get fresh token from localStorage
    const token = getToken()
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid/expired, remove it - TEMPORARILY DISABLED FOR TESTING
      // removeToken()
      // Redirect to login page - TEMPORARILY DISABLED FOR TESTING
      // if (isClient) {
      //   window.location.href = '/login'
      // }
      console.log('401 error in authService - redirect disabled for testing')
    }
    return Promise.reject(error)
  }
)

export async function loginWithEmail(email, password) {
  try {
    const res = await api.post('/auth/login', { email, password })
    const { token, user } = res.data

    if (token) {
      setToken(token)
      console.log('💾 Token saved to localStorage:', token)

    }

    return { user , token } 
  } 
  catch (error) {
    // Don't save token on login failure
    throw error
  }
}

export async function registerWithEmail({ email, password, fullName, username, country, currency }) {
  try {
    const res = await api.post('/auth/register', {
      email,
      password,
      fullName,
      username,
      country,
      currency
    })
    const { token, user } = res.data

    if (token) {
      setToken(token)
    }

    return user
  } catch (error) {
    // Don't save token on registration failure
    throw error
  }
}

export async function loginWithGoogle() {
  try {
    const res = await api.get('/auth/google/mock')
    const { token, user } = res.data

    if (token) {
      setToken(token)
    }

    return user
  } catch (error) {
    throw error
  }
}

export async function getCurrentUser() {
  const res = await api.get('/auth/me')
  return res.data.user
}

export async function logout() {
  // Remove token first (optimistic update)
  removeToken()

  try {
    // Call logout endpoint (fire and forget)
    await api.post('/auth/logout')
  } catch (error) {
    // Ignore logout API errors - user is already logged out locally
    console.warn('Logout API call failed:', error)
  }
}

// Utility function to check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken()
}