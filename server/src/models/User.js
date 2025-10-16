import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const usernameRegex = /^[a-zA-Z0-9_]+$/

const privacyDefaults = {
	showEmail: false,
	showFollowers: true,
	showExpensesTo: 'friends' // 'public' | 'friends' | 'private'
}

const userSchema = new mongoose.Schema({
	username: { type: String, unique: true, required: true, match: usernameRegex, index: true },
	fullName: { type: String, required: true },
	email: { type: String, unique: true, required: true, lowercase: true, trim: true },
	passwordHash: { type: String, required: true },
	country: { type: String, required: true },
	currency: { type: String, default: 'USD' },
	profilePhoto: { type: String },
	bio: { type: String },
	friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	privacySettings: { type: Object, default: privacyDefaults },
	provider: { type: String, default: 'local' }
}, { timestamps: true })

userSchema.methods.comparePassword = function (password) {
	if (!this.passwordHash) return false
	return bcrypt.compare(password, this.passwordHash)
}

userSchema.statics.hashPassword = function (password) {
	return bcrypt.hash(password, 10)
}

export default mongoose.model('User', userSchema)


