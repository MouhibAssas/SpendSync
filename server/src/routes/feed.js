import express from 'express'
import SocialFeed from '../models/SocialFeed.js'
import Comment from '../models/Comment.js'
import { requireAuth } from '../middleware/auth.js'
import { getIO } from '../realtime/socket.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res) => {
	// basic feed: public + friends-only from followed users
	const followingIds = [] // enhance: query user's following
	const items = await SocialFeed.find({
		$or: [
			{ visibility: 'public' },
			{ visibility: 'friends', userId: { $in: followingIds } }
		]
	}).sort({ createdAt: -1 }).limit(100)
	res.json({ items })
})

router.post('/:id/like', requireAuth, async (req, res) => {
	await SocialFeed.updateOne({ _id: req.params.id }, { $addToSet: { likes: req.userId } })
	try { getIO().emit('feed:like', { feedId: req.params.id, userId: req.userId }) } catch {}
	res.json({ ok: true })
})

router.delete('/:id/like', requireAuth, async (req, res) => {
	await SocialFeed.updateOne({ _id: req.params.id }, { $pull: { likes: req.userId } })
	try { getIO().emit('feed:unlike', { feedId: req.params.id, userId: req.userId }) } catch {}
	res.json({ ok: true })
})

router.post('/:id/comments', requireAuth, async (req, res) => {
	const { text } = req.body
	if (!text) return res.status(400).json({ error: 'Text required' })
	const c = await Comment.create({ userId: req.userId, feedId: req.params.id, text })
	try { getIO().emit('feed:comment', { feedId: req.params.id, comment: c }) } catch {}
	res.status(201).json({ comment: c })
})

router.get('/:id/comments', requireAuth, async (req, res) => {
	const comments = await Comment.find({ feedId: req.params.id }).sort({ createdAt: -1 })
	res.json({ comments })
})

export default router

import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import SocialFeed from '../models/SocialFeed.js'
import Comment from '../models/Comment.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res) => {
	// Simplified: public posts and friends-only posts from followed users
	const items = await SocialFeed.find({ $or: [
		{ visibility: 'public' },
		{ visibility: 'friends' }
	]})
	.sort({ createdAt: -1 })
	.limit(50)
	.populate('userId', 'username fullName profilePhoto')
	.populate('expenseId')
	.lean()
	res.json({ items })
})

router.post('/:id/like', requireAuth, async (req, res) => {
	await SocialFeed.updateOne({ _id: req.params.id }, { $addToSet: { likes: req.userId } })
	res.json({ ok: true })
})

router.delete('/:id/like', requireAuth, async (req, res) => {
	await SocialFeed.updateOne({ _id: req.params.id }, { $pull: { likes: req.userId } })
	res.json({ ok: true })
})

router.post('/:id/comments', requireAuth, async (req, res) => {
	const { text } = req.body
	const comment = await Comment.create({ userId: req.userId, feedId: req.params.id, text })
	res.status(201).json({ comment })
})

router.get('/:id/comments', requireAuth, async (req, res) => {
	const items = await Comment.find({ feedId: req.params.id }).sort({ createdAt: -1 }).populate('userId', 'username fullName profilePhoto')
	res.json({ items })
})

export default router


