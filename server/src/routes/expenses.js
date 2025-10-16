import express from 'express'
import Expense from '../models/Expense.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res) => {
	const { page = 1, limit = 20 } = req.query
	const skip = (Number(page) - 1) * Number(limit)
	const [items, total] = await Promise.all([
		Expense.find({ userId: req.userId }).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
		Expense.countDocuments({ userId: req.userId })
	])
	res.json({ items, total, page: Number(page), limit: Number(limit) })
})

router.post('/', requireAuth, async (req, res) => {
	const { amount, description, category, isPublic, photo, location, tags } = req.body
	if (amount == null || !description || !category) return res.status(400).json({ error: 'Missing fields' })
	const resetDate = new Date(Date.now() + 24*3600*1000)
	const item = await Expense.create({ userId: req.userId, amount, description, category, isPublic, photo, location, tags, resetDate })
	res.status(201).json({ item })
})

router.get('/stats', requireAuth, async (req, res) => {
	const agg = await Expense.aggregate([
		{ $match: { userId: new (await import('mongoose')).default.Types.ObjectId(req.userId) } },
		{ $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
		{ $sort: { total: -1 } }
	])
	res.json({ byCategory: agg })
})

router.get('/:id', requireAuth, async (req, res) => {
	const item = await Expense.findOne({ _id: req.params.id, userId: req.userId })
	if (!item) return res.status(404).json({ error: 'Not found' })
	res.json({ item })
})

router.put('/:id', requireAuth, async (req, res) => {
	const item = await Expense.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, req.body, { new: true })
	if (!item) return res.status(404).json({ error: 'Not found' })
	res.json({ item })
})

router.delete('/:id', requireAuth, async (req, res) => {
	const result = await Expense.deleteOne({ _id: req.params.id, userId: req.userId })
	if (!result.deletedCount) return res.status(404).json({ error: 'Not found' })
	res.json({ ok: true })
})

export default router

import express from 'express'
import Expense from '../models/Expense.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res) => {
	const page = Number(req.query.page || 1)
	const pageSize = Math.min(Number(req.query.pageSize || 20), 100)
	const skip = (page - 1) * pageSize
	const query = { userId: req.userId }
	const [items, total] = await Promise.all([
		Expense.find(query).sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean(),
		Expense.countDocuments(query)
	])
	res.json({ items, page, pageSize, total })
})

router.post('/', requireAuth, async (req, res) => {
	const { amount, description, category, isPublic, photo, location, tags } = req.body
	const resetDate = new Date(Date.now() + 24*3600*1000)
	const item = await Expense.create({ userId: req.userId, amount, description, category, isPublic, photo, location, tags, resetDate })
	res.status(201).json({ item })
})

router.get('/stats', requireAuth, async (req, res) => {
	const byCategory = await Expense.aggregate([
		{ $match: { userId: new (await import('mongoose')).default.Types.ObjectId(req.userId) } },
		{ $group: { _id: '$category', total: { $sum: '$amount' } } }
	])
	res.json({ byCategory })
})

router.get('/:id', requireAuth, async (req, res) => {
	const item = await Expense.findOne({ _id: req.params.id, userId: req.userId })
	if (!item) return res.status(404).json({ error: 'Not found' })
	res.json({ item })
})

router.put('/:id', requireAuth, async (req, res) => {
	const update = req.body
	const item = await Expense.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, update, { new: true })
	if (!item) return res.status(404).json({ error: 'Not found' })
	res.json({ item })
})

router.delete('/:id', requireAuth, async (req, res) => {
	await Expense.deleteOne({ _id: req.params.id, userId: req.userId })
	res.json({ ok: true })
})

export default router


