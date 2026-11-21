import api from '../api/client'

export const authStore = {
  token: localStorage.getItem('auth_token') || null,
  user: null,
  loading: false,

  async check() {
    if (!this.token) return
    try {
      const { data } = await api.get('/auth/me')
      this.user = data.user ?? data.data
    } catch (e) {
      this.token = null
      this.user = null
      localStorage.removeItem('auth_token')
    }
  },

  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    this.token = data.token
    this.user = data.user
    localStorage.setItem('auth_token', this.token)
    return data
  },

  async register(form) {
    const { data } = await api.post('/auth/register', form)
    this.token = data.token
    this.user = data.user
    localStorage.setItem('auth_token', this.token)
    return data
  },

  async logout() {
    try {
      await api.post('/auth/logout')
    } catch (e) { /* ignore */ }
    this.token = null
    this.user = null
    localStorage.removeItem('auth_token')
  },
}
