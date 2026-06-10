import { apiRequest } from '../lib/apiClient'

export async function fetchSavedBuilds() {
  return apiRequest('/saved-builds', { auth: true })
}

export async function saveBuild({ productId, name, selections }) {
  return apiRequest('/saved-builds', {
    method: 'POST',
    body: { productId, name, selections },
    auth: true,
  })
}

export async function deleteSavedBuild(id) {
  const { error } = await apiRequest(`/saved-builds/${id}`, { method: 'DELETE', auth: true })
  return { error }
}
