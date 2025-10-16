import { io } from 'socket.io-client'

let socket

export function getSocket() {
	if (!socket) {
		socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000', {
			transports: ['websocket']
		})
	}
	return socket
}

export function onFeedEvents({ onLike, onUnlike, onComment }) {
	const s = getSocket()
	if (onLike) s.on('feed:like', onLike)
	if (onUnlike) s.on('feed:unlike', onUnlike)
	if (onComment) s.on('feed:comment', onComment)
	return () => {
		if (onLike) s.off('feed:like', onLike)
		if (onUnlike) s.off('feed:unlike', onUnlike)
		if (onComment) s.off('feed:comment', onComment)
	}
}


