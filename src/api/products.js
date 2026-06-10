import { apiRequest } from '../lib/apiClient'

export async function fetchProducts({ includeInactive = false } = {}) {
  const query = includeInactive ? '?includeInactive=true' : ''
  return apiRequest(`/products${query}`)
}

export async function fetchProductById(id) {
  return apiRequest(`/products/${id}`)
}

export async function upsertProduct(product) {
  return apiRequest('/products', { method: 'POST', body: product, auth: true })
}

export async function deleteProduct(id) {
  const { error } = await apiRequest(`/products/${id}`, { method: 'DELETE', auth: true })
  return { error }
}

export async function updateOrderStatus(orderId, status) {
  return apiRequest(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: { status },
    auth: true,
  })
}

export async function fetchAllOrders() {
  return apiRequest('/orders/admin/all', { auth: true })
}
