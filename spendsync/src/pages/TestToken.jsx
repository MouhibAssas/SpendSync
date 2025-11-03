import React, { useState, useEffect } from 'react'
import { loginWithEmail, getToken, setToken, getCurrentUser } from '../services/authService'

function TestToken() {
  const [token, setTokenState] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Check current token on mount
    const currentToken = getToken()
    setTokenState(currentToken || '')
    setMessage(`Initial token check: ${currentToken ? 'Token found' : 'No token'}`)
  }, [])

  const handleLogin = async () => {
    setLoading(true)
    try {
      const result = await loginWithEmail('test@example.com', '12345678')
      setUser(result)
      const newToken = getToken()
      setTokenState(newToken || '')
      setMessage(`Login successful. Token: ${newToken ? 'Set' : 'Not set'}`)
    } catch (error) {
      setMessage(`Login failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckToken = () => {
    const currentToken = getToken()
    setTokenState(currentToken || '')
    setMessage(`Current token: ${currentToken ? 'Present' : 'Missing'}`)
  }

  const handleGetMe = async () => {
    setLoading(true)
    try {
      const result = await getCurrentUser()
      setUser(result)
      setMessage('/auth/me successful')
    } catch (error) {
      setMessage(`/auth/me failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Token Persistence Test</h1>

      <div className="space-y-4 mb-8">
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Current Token Status</h2>
          <p>Token: {token ? `${token.substring(0, 20)}...` : 'None'}</p>
          <p>User: {user ? user.fullName : 'None'}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <p className="text-yellow-400">{message}</p>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded mr-4"
        >
          {loading ? 'Loading...' : 'Login'}
        </button>

        <button
          onClick={handleCheckToken}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded mr-4"
        >
          Check Token
        </button>

        <button
          onClick={handleGetMe}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded mr-4"
        >
          Test /auth/me
        </button>

        <button
          onClick={handleRefresh}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
        >
          Refresh Page
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Test Steps:</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-300">
          <li>Click "Login" to authenticate</li>
          <li>Verify token is stored in localStorage</li>
          <li>Click "Refresh Page" to simulate browser refresh</li>
          <li>Check if token persists after refresh</li>
          <li>Test "/auth/me" endpoint</li>
        </ol>
      </div>
    </div>
  )
}

export default TestToken