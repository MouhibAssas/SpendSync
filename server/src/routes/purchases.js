import express from 'express'
import Purchase from '../models/Purchase.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res) => {
	try {
		const { rangeStart, rangeEnd } = req.query
		const query = { userId: req.userId }
		if (rangeStart || rangeEnd) {
			query.postedAt = {}
			if (rangeStart) query.postedAt.$gte = new Date(rangeStart)
			if (rangeEnd) query.postedAt.$lte = new Date(rangeEnd)
		}
		const items = await Purchase.find(query).sort({ postedAt: -1 }).lean()
		res.json({
			success: true,
			data: items
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Failed to fetch purchases'
		})
	}
})

router.post('/', requireAuth, async (req, res) => {
	try {
		const { title, amount } = req.body
		if (!title || typeof amount !== 'number') {
			return res.status(400).json({
				success: false,
				message: 'Invalid payload'
			})
		}
		const item = await Purchase.create({ userId: req.userId, title, amount })
		res.status(201).json({
			success: true,
			data: item
		})
	} catch (error) {
		res.status(400).json({
			success: false,
			message: 'Failed to create purchase'
		})
	}
})

export default router


