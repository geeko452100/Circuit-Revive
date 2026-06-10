import { apiRequest } from '../lib/apiClient'

export async function createOrder({ items, subtotal, shippingAddress }) {
  return apiRequest('/orders', {
    method: 'POST',
    body: { items, subtotal, shippingAddress },
    auth: true,
  })
}

export async function fetchUserOrders() {
  return apiRequest('/orders', { auth: true })
}
