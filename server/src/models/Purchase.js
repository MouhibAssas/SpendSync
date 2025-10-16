import mongoose from 'mongoose'

const purchaseSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	title: { type: String, required: true },
	amount: { type: Number, required: true },
	postedAt: { type: Date, default: Date.now }
}, { timestamps: true })

export default mongoose.model('Purchase', purchaseSchema)


