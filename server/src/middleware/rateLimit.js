// Simple in-memory rate limiter (replace with Redis in production)
const buckets = new Map()

export function rateLimit({ windowMs = 60_000, max = 60 } = {}) {
	return (req, res, next) => {
		const key = req.ip
		const now = Date.now()
		let b = buckets.get(key)
		if (!b) {
			b = { count: 0, reset: now + windowMs }
			buckets.set(key, b)
		}
		if (now > b.reset) {
			b.count = 0
			b.reset = now + windowMs
		}
		b.count += 1
		if (b.count > max) return res.status(429).json({ error: 'Too many requests' })
		next()
	}
}


