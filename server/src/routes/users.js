import express from 'express'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/search', requireAuth, async (req, res) => {
	const q = (req.query.q || '').trim()
	if (!q) return res.json({ items: [] })
	const items = await User.find({ $or: [
		{ username: new RegExp(q, 'i') },
		{ fullName: new RegExp(q, 'i') }
	] }).select('username fullName profilePhoto')
	res.json({ items })
})

router.get('/:id', requireAuth, async (req, res) => {
	const user = await User.findById(req.params.id).select('-passwordHash')
	if (!user) return res.status(404).json({ error: 'Not found' })
	res.json({ user })
})

router.post('/:id/follow', requireAuth, async (req, res) => {
	const target = await User.findById(req.params.id)
	if (!target) return res.status(404).json({ error: 'Not found' })
	await User.updateOne({ _id: req.userId }, { $addToSet: { following: target._id } })
	await User.updateOne({ _id: target._id }, { $addToSet: { followers: req.userId } })
	res.json({ ok: true })
})

router.delete('/:id/follow', requireAuth, async (req, res) => {
	const target = await User.findById(req.params.id)
	if (!target) return res.status(404).json({ error: 'Not found' })
	await User.updateOne({ _id: req.userId }, { $pull: { following: target._id } })
	await User.updateOne({ _id: target._id }, { $pull: { followers: req.userId } })
	res.json({ ok: true })
})

router.get('/:id/friends', requireAuth, async (req, res) => {
	const user = await User.findById(req.params.id).populate('friends', 'username fullName profilePhoto')
	if (!user) return res.status(404).json({ error: 'Not found' })
	res.json({ items: user.friends })
})

router.get('/:id/followers', requireAuth, async (req, res) => {
	const user = await User.findById(req.params.id).populate('followers', 'username fullName profilePhoto')
	if (!user) return res.status(404).json({ error: 'Not found' })
	res.json({ items: user.followers })
})

router.get('/:id/following', requireAuth, async (req, res) => {
	const user = await User.findById(req.params.id).populate('following', 'username fullName profilePhoto')
	if (!user) return res.status(404).json({ error: 'Not found' })
	res.json({ items: user.following })
})

export default router

import express from 'express'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/search', requireAuth, async (req, res) => {
	const q = (req.query.q || '').trim()
	if (!q) return res.json({ items: [] })
	const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
	const items = await User.find({ $or: [{ username: regex }, { fullName: regex }] }).select('username fullName profilePhoto').limit(20)
	res.json({ items })
})

router.get('/:id', requireAuth, async (req, res) => {
	const user = await User.findById(req.params.id).select('-passwordHash')
	if (!user) return res.status(404).json({ error: 'User not found' })
	res.json({ user })
})

router.post('/:id/follow', requireAuth, async (req, res) => {
	const targetId = req.params.id
	if (String(targetId) === String(req.userId)) return res.status(400).json({ error: 'Cannot follow yourself' })
	await User.updateOne({ _id: req.userId, following: { $ne: targetId } }, { $push: { following: targetId } })
	await User.updateOne({ _id: targetId, followers: { $ne: req.userId } }, { $push: { followers: req.userId } })
	res.json({ ok: true })
})

router.delete('/:id/follow', requireAuth, async (req, res) => {
	const targetId = req.params.id
	await User.updateOne({ _id: req.userId }, { $pull: { following: targetId } })
	await User.updateOne({ _id: targetId }, { $pull: { followers: req.userId } })
	res.json({ ok: true })
})

router.get('/:id/friends', requireAuth, async (req, res) => {
	const user = await User.findById(req.params.id).select('friends').populate('friends', 'username fullName profilePhoto')
	res.json({ items: user?.friends || [] })
})

router.get('/:id/followers', requireAuth, async (req, res) => {
	const user = await User.findById(req.params.id).select('followers').populate('followers', 'username fullName profilePhoto')
	res.json({ items: user?.followers || [] })
})

router.get('/:id/following', requireAuth, async (req, res) => {
	const user = await User.findById(req.params.id).select('following').populate('following', 'username fullName profilePhoto')
	res.json({ items: user?.following || [] })
})

export default router


