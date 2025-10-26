import mongoose from 'mongoose'

const categories = ['food', 'transport', 'shopping', 'entertainment', 'bills', 'health', 'other']

const expenseSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
	amount: { type: Number, required: true, min: 0 },
	description: { type: String, required: true },
	category: { type: String, enum: categories, required: true },
	isPublic: { type: Boolean, default: false },
	photo: { type: String },
	location: { type: String },
	tags: [{ type: String }],
	likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	createdAt: { type: Date, default: Date.now, required: true },
	resetDate: { type: Date, required: true }
}, { timestamps: true })

export default mongoose.model('Expense', expenseSchema)




