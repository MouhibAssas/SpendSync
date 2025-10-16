import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { issueToken, requireAuth } from '../middleware/auth.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

router.post('/register', async (req, res) => {
	const { email, password, fullName, username, country, currency } = req.body
	try {
		const exists = await User.findOne({ $or: [{ email }, { username }] })
		if (exists) return res.status(400).json({ error: 'Email already in use' })
		const passwordHash = await User.hashPassword(password)
		const user = await User.create({ email, fullName, username, country, currency, passwordHash, provider: 'local' })
		issueToken(res, user._id)
		res.json({ user: { id: user._id, email: user.email, name: user.fullName } })
	} catch (e) {
		res.status(500).json({ error: 'Registration failed' })
	}
})

router.post('/login', async (req, res) => {
	const { email, password } = req.body
	try {
		const user = await User.findOne({ email })
		if (!user) return res.status(401).json({ error: 'Invalid credentials' })
		const ok = await user.comparePassword(password)
		if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
		issueToken(res, user._id)
		res.json({ user: { id: user._id, email: user.email, name: user.fullName } })
	} catch (e) {
		res.status(500).json({ error: 'Login failed' })
	}
})

router.get('/google/mock', async (req, res) => {
	// mock oauth for local dev
	let user = await User.findOne({ email: 'demo@spendsync.dev' })
	if (!user) user = await User.create({ email: 'demo@spendsync.dev', fullName: 'Demo User', username: 'demo_user', country: 'US', currency: 'USD', passwordHash: await User.hashPassword('demo'), provider: 'google' })
	issueToken(res, user._id)
	res.json({ user: { id: user._id, email: user.email, name: user.fullName } })
})

router.get('/me', async (req, res) => {
	const token = req.headers['x-auth-token']
	if (!token) return res.status(401).json({ error: 'No token' })
	try {
		const payload = jwt.verify(token, JWT_SECRET)
		const user = await User.findById(payload.sub)
		if (!user) return res.status(401).json({ error: 'Invalid token' })
		res.json({ user: { id: user._id, email: user.email, name: user.fullName } })
	} catch {
		res.status(401).json({ error: 'Invalid token' })
	}
})

router.post('/logout', (req, res) => {
	res.json({ ok: true })
})

router.put('/profile', requireAuth, async (req, res) => {
	const update = req.body || {}
	const user = await User.findByIdAndUpdate(req.userId, update, { new: true })
	res.json({ user: { id: user._id, email: user.email, name: user.fullName, profilePhoto: user.profilePhoto, bio: user.bio } })
})

export default router


