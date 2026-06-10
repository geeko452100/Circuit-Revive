import { apiRequest } from '../lib/apiClient'

export async function shipOrderWithTracking(orderId, { trackingNumber, carrier = 'ups' }) {
  return apiRequest(`/tracking/${orderId}/ship`, {
    method: 'POST',
    body: { trackingNumber, carrier },
    auth: true,
  })
}

export async function refreshOrderTracking(orderId) {
  return apiRequest(`/tracking/${orderId}/refresh`, {
    method: 'POST',
    auth: true,
  })
}

export function getCarrierTrackingUrl(carrier, trackingNumber) {
  const number = encodeURIComponent(trackingNumber.trim())

  switch (carrier) {
    case 'ups':
      return `https://www.ups.com/track?tracknum=${number}`
    case 'usps':
      return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${number}`
    case 'fedex':
      return `https://www.fedex.com/fedextrack/?trknbr=${number}`
    default:
      return null
  }
}

export function formatTrackingTimestamp(value) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleString()
}
