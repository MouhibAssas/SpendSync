import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	feedId: { type: mongoose.Schema.Types.ObjectId, ref: 'SocialFeed', required: true, index: true },
	text: { type: String, required: true },
	createdAt: { type: Date, default: Date.now, required: true }
}, { timestamps: true })

export default mongoose.model('Comment', commentSchema)

import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	feedId: { type: mongoose.Schema.Types.ObjectId, ref: 'SocialFeed', required: true, index: true },
	text: { type: String, required: true },
	createdAt: { type: Date, default: Date.now, required: true }
}, { timestamps: true })

export default mongoose.model('Comment', commentSchema)


