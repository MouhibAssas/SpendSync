import { Server } from 'socket.io'

let ioRef = null

export function attachSocket(server) {
	ioRef = new Server(server, {
		cors: { origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', methods: ['GET','POST'] }
	})
	ioRef.on('connection', (socket) => {
		// Optional auth handshake can be added here
		socket.on('ping', () => socket.emit('pong'))
	})
	return ioRef
}

export function getIO() {
	if (!ioRef) throw new Error('Socket.io not initialized')
	return ioRef
}


