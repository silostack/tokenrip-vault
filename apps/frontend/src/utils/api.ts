import axios from 'axios'
import { getSession } from '@/lib/session'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3434'

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
