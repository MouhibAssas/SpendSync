import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

const uploadsDir = path.resolve(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, uploadsDir),
	filename: (req, file, cb) => {
		const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
		cb(null, unique + path.extname(file.originalname))
	}
})

function fileFilter(req, file, cb) {
	const allowed = ['image/png', 'image/jpeg', 'image/webp']
	if (!allowed.includes(file.mimetype)) return cb(new Error('Invalid file type'))
	cb(null, true)
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } })

router.post('/image', requireAuth, upload.single('image'), (req, res) => {
	const url = `/uploads/${req.file.filename}`
	res.status(201).json({ url })
})

export default router


