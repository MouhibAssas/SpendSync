import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginWithEmail, registerWithEmail, loginWithGoogle, logout as apiLogout, getCurrentUser } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)
	const navigate = useNavigate()

	useEffect(() => {
		(async () => {
			try {
				const me = await getCurrentUser()
				setUser(me)
			} catch {
			setLoading(false)
	}})()
	}, [])

	async function login(email, password) {
		const me = await loginWithEmail(email, password)
		setUser(me)
		return me
	}

	async function signup(email, password, fullName, username, country, currency) {
		const me = await registerWithEmail({ email, password, fullName, username, country, currency })
		setUser(me)
		return me
	}

	async function googleLogin() {
		const me = await loginWithGoogle()
		setUser(me)
		return me
	}

	async function logout() {
		await apiLogout()
		setUser(null)
		navigate('/')
	}

	const value = useMemo(() => ({ user, loading, login, signup, googleLogin, logout }), [user, loading])

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}


