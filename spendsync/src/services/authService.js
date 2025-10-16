import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api' })
const TOKEN_KEY = 'auth_token'

// Load token on startup
const saved = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null
if (saved) api.defaults.headers['x-auth-token'] = saved

function applyTokenFromResponse(res) {
	const token = res?.headers?.['x-auth-token']
	if (token) {
		api.defaults.headers['x-auth-token'] = token
		localStorage.setItem(TOKEN_KEY, token)
	}
}

export async function loginWithEmail(email, password) {
	const res = await api.post('/auth/login', { email, password })
	applyTokenFromResponse(res)
	return res.data.user
}

export async function registerWithEmail(payload) {
	const res = await api.post('/auth/register', payload)
	applyTokenFromResponse(res)
	return res.data.user
}

export async function loginWithGoogle() {
	const res = await api.get('/auth/google/mock')
	applyTokenFromResponse(res)
	return res.data.user
}

export async function getCurrentUser() {
	const res = await api.get('/auth/me')
	applyTokenFromResponse(res)
	return res.data.user
}

export async function logout() {
	localStorage.removeItem(TOKEN_KEY)
	delete api.defaults.headers['x-auth-token']
	await api.post('/auth/logout')
}


