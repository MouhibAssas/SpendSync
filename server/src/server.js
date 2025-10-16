import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectWithRetry, getDbUri } from './config/db.js'
import { notFound, errorHandler } from './middleware/error.js'
import authRouter from './routes/auth.js'
import purchasesRouter from './routes/purchases.js'
import expensesRouter from './routes/expenses.js'
import usersRouter from './routes/users.js'
import feedRouter from './routes/feed.js'
import uploadsRouter from './routes/uploads.js'
import path from 'path'
import fs from 'fs'
import http from 'http'
import { attachSocket } from './realtime/socket.js'

dotenv.config()

const app = express()
const server = http.createServer(app)
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }))
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use('/api/auth', authRouter)
app.use('/api/purchases', purchasesRouter)
app.use('/api/expenses', expensesRouter)
app.use('/api/users', usersRouter)
app.use('/api/feed', feedRouter)
app.use('/api/uploads', uploadsRouter)

// serve uploaded files
const uploadsDir = path.resolve(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)
app.use('/uploads', express.static(uploadsDir))
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 4000
connectWithRetry({ uri: getDbUri() })
	.then(() => {
		attachSocket(server)
		server.listen(PORT, () => {
			console.log(`Server listening on http://localhost:${PORT}`)
		})
	})
	.catch((err) => {
		console.error('Mongo connection error', err)
		process.exit(1)
	})


