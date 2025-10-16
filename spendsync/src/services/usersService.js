import api from './api'

export async function searchUsers(q) {
	const { data } = await api.get('/users/search', { params: { q } })
	return data.items
}

export async function getUser(id) {
	const { data } = await api.get(`/users/${id}`)
	return data.user
}

export async function followUser(id) {
	await api.post(`/users/${id}/follow`)
}

export async function unfollowUser(id) {
	await api.delete(`/users/${id}/follow`)
}

export async function getFollowers(id) {
	const { data } = await api.get(`/users/${id}/followers`)
	return data.items
}

export async function getFollowing(id) {
	const { data } = await api.get(`/users/${id}/following`)
	return data.items
}


