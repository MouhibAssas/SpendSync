import mongoose from 'mongoose'

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/spendsync'

export function getDbUri() {
	const env = process.env.NODE_ENV || 'development'
	if (env === 'production') return process.env.MONGO_URI || DEFAULT_URI
	return process.env.MONGO_URI_DEV || process.env.MONGO_URI || DEFAULT_URI
}

export async function connectWithRetry({ uri, maxRetries = 5, baseDelayMs = 500 } = {}) {
	const mongoUri = uri || getDbUri()
	let attempt = 0
	for (;;) {
		try {
			await mongoose.connect(mongoUri)
			return mongoose.connection
		} catch (err) {
			attempt += 1
			if (attempt > maxRetries) {
				throw err
			}
			const delay = baseDelayMs * Math.pow(2, attempt - 1)
			await new Promise(r => setTimeout(r, delay))
		}
	}
}


