import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET 

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }
  const token = authHeader.substring(7) // Remove 'Bearer ' prefix
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.userId = payload.userId
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export function issueToken(res, userId) {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
  res.setHeader('authorization', `Bearer ${token}`)
  return token;
}

const authMiddleware = { requireAuth, issueToken }
export default authMiddleware