import axios from 'axios'

const api = axios.create({
  baseURL: 'https://v2.cbi.mdtapps.id/api',
})

// sebelum request, tambahkan token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
