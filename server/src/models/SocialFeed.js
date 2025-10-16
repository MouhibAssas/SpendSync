import mongoose from 'mongoose'

const visibilityEnum = ['public', 'friends', 'private']

const commentSubSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	text: { type: String, required: true },
	createdAt: { type: Date, default: Date.now, required: true }
}, { _id: true })

const socialFeedSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
	expenseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expense', required: true },
	likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	comments: [commentSubSchema],
	visibility: { type: String, enum: visibilityEnum, required: true },
	createdAt: { type: Date, default: Date.now, required: true }
}, { timestamps: true })

export default mongoose.model('SocialFeed', socialFeedSchema)

import mongoose from 'mongoose'

const visibilityEnum = ['public', 'friends', 'private']

const commentSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	text: { type: String, required: true },
	createdAt: { type: Date, default: Date.now, required: true }
}, { _id: true })

const socialFeedSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
	expenseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expense', required: true },
	likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	comments: [commentSchema],
	visibility: { type: String, enum: visibilityEnum, required: true },
	createdAt: { type: Date, default: Date.now, required: true }
}, { timestamps: true })

export default mongoose.model('SocialFeed', socialFeedSchema)


