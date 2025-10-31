import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginWithEmail, registerWithEmail, loginWithGoogle, logout as apiLogout, getCurrentUser, getToken } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true
    let timeoutId = null
    
    // Set a timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        console.warn('Auth initialization timed out')
        setLoading(false)
        setInitialized(true)
      }
    }, 5000) // 5 second timeout
    
    const initializeAuth = async () => {
      try {
        // Only try to get current user if we have a token
        const token = getToken()
        if (token) {
          const me = await getCurrentUser()
          if (isMounted) {
            setUser(me)
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        // Don't throw error, just continue without user
      } finally {
        if (isMounted) {
          setLoading(false)
          setInitialized(true)
          if (timeoutId) clearTimeout(timeoutId)
        }
      }
    }
    
    initializeAuth()
    
    return () => {
      isMounted = false
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  async function login(email, password) {
    try {
      const me = await loginWithEmail(email, password)
      setUser(me)
      return me
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  async function signup(email, password, fullName, username, country, currency) {
    try {
      const me = await registerWithEmail({ email, password, fullName, username, country, currency })
      setUser(me)
      return me
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  async function googleLogin() {
    try {
      const me = await loginWithGoogle()
      setUser(me)
      return me
    } catch (error) {
      console.error('Google login error:', error)
      throw error
    }
  }

  async function logout() {
    try {
      await apiLogout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      navigate('/login')
    }
  }

  const value = useMemo(() => ({ 
    user, 
    loading, 
    initialized,
    login, 
    signup, 
    googleLogin, 
    logout 
  }), [user, loading, initialized])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}