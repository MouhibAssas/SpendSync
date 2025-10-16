import express from 'express'
import jwt from 'jsonwebtoken'
import Purchase from '../models/Purchase.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

function requireUser(req, res, next) {
	const token = req.headers['x-auth-token']
	if (!token) return res.status(401).json({ error: 'No token' })
	try {
		const payload = jwt.verify(token, JWT_SECRET)
		req.userId = payload.sub
		next()
	} catch {
		return res.status(401).json({ error: 'Invalid token' })
	}
}

router.get('/', requireUser, async (req, res) => {
	const { rangeStart, rangeEnd } = req.query
	const query = { userId: req.userId }
	if (rangeStart || rangeEnd) {
		query.postedAt = {}
		if (rangeStart) query.postedAt.$gte = new Date(rangeStart)
		if (rangeEnd) query.postedAt.$lte = new Date(rangeEnd)
	}
	const items = await Purchase.find(query).sort({ postedAt: -1 }).lean()
	res.json({ items })
})

router.post('/', requireUser, async (req, res) => {
	const { title, amount } = req.body
	if (!title || typeof amount !== 'number') return res.status(400).json({ error: 'Invalid payload' })
	const item = await Purchase.create({ userId: req.userId, title, amount })
	res.status(201).json({ item })
})

export default router


