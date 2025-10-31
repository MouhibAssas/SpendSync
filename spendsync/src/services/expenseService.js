import api from './api'

export async function getExpenses(params = {}) {
  const { data } = await api.get('/expenses', { params })
  return data.data || []
}

export async function addExpense(expenseData) {
  const { data } = await api.post('/expenses', expenseData)
  return data.data
}

export async function updateExpense(id, updateData) {
  const { data } = await api.put(`/expenses/${id}`, updateData)
  return data.data
}

export async function deleteExpense(id) {
  await api.delete(`/expenses/${id}`)
}

export async function likeExpense(id) {
  const { data } = await api.post(`/expenses/${id}/like`)
  return data.data
}

export async function addComment(expenseId, text) {
  const { data } = await api.post(`/expenses/${expenseId}/comments`, { text })
  return data.data
}

export async function getComments(expenseId) {
  const { data } = await api.get(`/expenses/${expenseId}/comments`)
  return data.data || []
}