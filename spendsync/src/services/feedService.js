import api from './api'

export async function getFeed() {
	const { data } = await api.get('/feed')
	return data.items
}

export async function likeFeed(id) {
	await api.post(`/feed/${id}/like`)
}

export async function unlikeFeed(id) {
	await api.delete(`/feed/${id}/like`)
}

export async function addComment(feedId, text) {
	const { data } = await api.post(`/feed/${feedId}/comments`, { text })
	return data.comment
}

export async function getComments(feedId) {
	const { data } = await api.get(`/feed/${feedId}/comments`)
	return data.comments
}


