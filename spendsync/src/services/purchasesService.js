import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api' })

export async function listPurchases({ rangeStart, rangeEnd } = {}) {
	const { data } = await api.get('/purchases', { params: { rangeStart, rangeEnd } })
	return data.items || []
}

export async function addPurchase(payload) {
	const { data } = await api.post('/purchases', payload)
	return data.item
}


