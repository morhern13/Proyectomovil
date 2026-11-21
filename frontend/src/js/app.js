import Alpine from 'alpinejs'
import api from './api/client'
import { authStore } from './stores/auth'
import { loadPage } from './router'

window.Alpine = Alpine

document.addEventListener('alpine:init', () => {
  Alpine.store('auth', authStore)

  Alpine.data('app', () => ({
    loading: true,
    page: 'dashboard',
    sidebarOpen: true,
    toasts: [],

    get auth() {
      return Alpine.store('auth')
    },

    get pageTitle() {
      const titles = {
        dashboard: 'Panel Principal',
        products: 'Productos',
        categories: 'Categorías',
        customers: 'Clientes',
        suppliers: 'Proveedores',
        invoices: 'Facturación',
        pos: 'Punto de Venta',
        reports: 'Reportes',
        login: 'Iniciar Sesión',
        register: 'Registro',
      }
      return titles[this.page] || 'Candace'
    },

    get navItems() {
      return [
        { id: 'dashboard', label: 'Panel', icon: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>' },
        { id: 'products', label: 'Productos', icon: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>' },
        { id: 'categories', label: 'Categorías', icon: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>' },
        { id: 'customers', label: 'Clientes', icon: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>' },
        { id: 'suppliers', label: 'Proveedores', icon: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>' },
        { id: 'invoices', label: 'Facturación', icon: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>' },
        { id: 'pos', label: 'POS', icon: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>' },
        { id: 'reports', label: 'Reportes', icon: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>' },
      ]
    },

    async init() {
      try {
      await this.auth.check()
    } catch (e) {
      // not authenticated
    }

    if (!this.auth.token) {
      this.page = 'login'
    }

    await this.loadAllPages()
      this.loading = false

      // Hash-based routing
      window.addEventListener('hashchange', () => {
        const hash = window.location.hash.slice(1) || 'dashboard'
        this.navigate(hash)
      })

      // Restore page from hash
      const hash = window.location.hash.slice(1)
      if (hash && this.auth.token) {
        this.page = hash
      }
    },

    async loadAllPages() {
      const pageFiles = [
        'login', 'register', 'dashboard', 'products',
        'categories', 'customers', 'suppliers', 'invoices', 'pos', 'reports',
      ]
      this.pages = {}
      for (const name of pageFiles) {
        this.pages[name] = await loadPage(name)
      }
    },

    navigate(page) {
      this.page = page
      window.location.hash = page
    },

    async logout() {
      try {
        await this.auth.logout()
      } catch (e) { /* ignore */ }
      this.navigate('login')
    },

    toast(message, type = 'info') {
      this.toasts.push({ message, type, show: true })
      setTimeout(() => {
        const t = this.toasts.find(t => t.message === message)
        if (t) t.show = false
      }, 4000)
    },
  }))
})

window.opencode = {
  toast(message, type = 'info') {
    const toasts = Alpine.raw(document.querySelector('#app')?.__x?.$data?.toasts) || []
    if (toasts.push) {
      toasts.push({ message, type, show: true })
      setTimeout(() => {
        const t = toasts.find(t => t.message === message)
        if (t) t.show = false
      }, 4000)
    }
  },
}

Alpine.start()
