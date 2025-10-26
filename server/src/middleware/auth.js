import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

export function requireAuth(req, res, next) {
	const token = req.headers['x-auth-token']
	if (!token) return res.status(401).json({ error: 'No token' })
	try {
		const payload = jwt.verify(token, JWT_SECRET)
		req.userId = payload.sub
		next()
	} catch {
		return res.status(401).json({ error: 'Invalid token' })
	}
}

export function issueToken(res, userId) {
	const token = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' })
	res.setHeader('x-auth-token', token)
}

const authMiddleware = { requireAuth, issueToken }
export default authMiddleware
