import axios from 'axios'
import { getSession } from '@/lib/session'
import { API_URL } from '@/config'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getSession()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
