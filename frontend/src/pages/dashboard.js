import Alpine from 'alpinejs'
import api from '../js/api/client'

if (!Alpine._datalistD) {
  Alpine._datalistD = true
  Alpine.data('dashboardPage', () => ({
    stats: { products_count: 0, customers_count: 0, month_sales: 0, low_stock_count: 0, pending_invoices: 0 },
    fmt(n) {
      return '$' + Number(n).toLocaleString('es-CO', { minimumFractionDigits: 2 }) + ' COP'
    },
    async init() { await this.refresh() },
    async refresh() {
      try {
        const { data } = await api.get('/dashboard/stats')
        this.stats = data.data ?? data
      } catch (e) { /* ignore */ }
    },
  }))
}

export default function () {
  return `
<div>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
    <div class="stat-card">
      <p class="text-sm text-slate-500 font-medium">Productos</p>
      <p class="text-2xl font-bold text-slate-800 mt-1" x-text="stats.products_count"></p>
    </div>
    <div class="stat-card">
      <p class="text-sm text-slate-500 font-medium">Clientes</p>
      <p class="text-2xl font-bold text-slate-800 mt-1" x-text="stats.customers_count"></p>
    </div>
    <div class="stat-card">
      <p class="text-sm text-slate-500 font-medium">Facturas</p>
      <p class="text-2xl font-bold text-slate-800 mt-1" x-text="stats.pending_invoices"></p>
    </div>
    <div class="stat-card">
      <p class="text-sm text-slate-500 font-medium">Ingresos</p>
      <p class="text-2xl font-bold text-candace-700 mt-1" x-text="fmt(stats.month_sales)"></p>
    </div>
    <div class="stat-card bg-gold-50 border-gold-200">
      <p class="text-sm text-gold-700 font-medium">Stock Bajo</p>
      <p class="text-2xl font-bold text-gold-800 mt-1" x-text="stats.low_stock_count"></p>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="card">
      <h3 class="text-lg font-semibold text-slate-800 mb-4">Acciones Rápidas</h3>
      <div class="grid grid-cols-2 gap-3">
        <a href="#" @click.prevent="navigate('products')" class="flex items-center gap-3 rounded-lg border border-slate-200 p-4 hover:border-candace-300 hover:bg-candace-50 transition-all">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-candace-100 text-candace-600"><svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg></div>
          <span class="text-sm font-medium text-slate-700">Productos</span>
        </a>
        <a href="#" @click.prevent="navigate('customers')" class="flex items-center gap-3 rounded-lg border border-slate-200 p-4 hover:border-candace-300 hover:bg-candace-50 transition-all">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600"><svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>
          <span class="text-sm font-medium text-slate-700">Clientes</span>
        </a>
        <a href="#" @click.prevent="navigate('invoices')" class="flex items-center gap-3 rounded-lg border border-slate-200 p-4 hover:border-candace-300 hover:bg-candace-50 transition-all">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-100 text-gold-600"><svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></div>
          <span class="text-sm font-medium text-slate-700">Facturar</span>
        </a>
        <a href="#" @click.prevent="navigate('suppliers')" class="flex items-center gap-3 rounded-lg border border-slate-200 p-4 hover:border-candace-300 hover:bg-candace-50 transition-all">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600"><svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg></div>
          <span class="text-sm font-medium text-slate-700">Proveedores</span>
        </a>
      </div>
    </div>

    <div class="card">
      <h3 class="text-lg font-semibold text-slate-800 mb-4">Resumen Rápido</h3>
      <div class="space-y-4">
        <div class="flex items-center justify-between py-2 border-b border-slate-100">
          <span class="text-sm text-slate-600">Total productos en catálogo</span>
          <span class="text-sm font-semibold" x-text="stats.products"></span>
        </div>
        <div class="flex items-center justify-between py-2 border-b border-slate-100">
          <span class="text-sm text-slate-600">Clientes registrados</span>
          <span class="text-sm font-semibold" x-text="stats.customers"></span>
        </div>
        <div class="flex items-center justify-between py-2 border-b border-slate-100">
          <span class="text-sm text-slate-600">Facturas emitidas</span>
          <span class="text-sm font-semibold" x-text="stats.invoices"></span>
        </div>
        <div class="flex items-center justify-between py-2">
          <span class="text-sm font-medium text-slate-700">Ingresos totales</span>
          <span class="text-sm font-bold text-candace-700" x-text="fmt(stats.revenue)"></span>
        </div>
      </div>
    </div>
  </div>
</div>`
}
