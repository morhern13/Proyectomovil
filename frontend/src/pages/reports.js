import Alpine from 'alpinejs'
import api from '../js/api/client'

if (!Alpine._datalistR) {
  Alpine._datalistR = true

  Alpine.data('reportsPage', () => ({
    tab: 'sales',
    loading: false,
    fmt(n) {
      return '$' + Number(n).toLocaleString('es-CO', { minimumFractionDigits: 2 }) + ' COP'
    },
    fmtDate(d) {
      return new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
    },
    // Sales
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
    salesData: null,
    // Inventory
    inventoryData: null,

    async init() {
      await this.loadSales()
      await this.loadInventory()
    },

    async loadSales() {
      this.loading = true
      try {
        const { data } = await api.get('/reports/sales', { params: { from: this.from, to: this.to } })
        this.salesData = data
      } catch (e) {
        window.opencode.toast('Error al cargar reporte de ventas', 'error')
      } finally {
        this.loading = false
      }
    },

    async loadInventory() {
      try {
        const { data } = await api.get('/reports/inventory')
        this.inventoryData = data
      } catch (e) {
        window.opencode.toast('Error al cargar reporte de inventario', 'error')
      }
    },

    get paymentLabel() {
      return { efectivo: 'Efectivo', tarjeta: 'Tarjeta', transferencia: 'Transferencia', credito: 'Crédito' }
    },
  }))
}

export default function () {
  return `
<div x-data="{ tab: 'sales' }">
  <!-- Tabs -->
  <div class="flex gap-1 mb-6 bg-slate-100 rounded-lg p-1 w-fit">
    <button @click="tab = 'sales'"
      :class="tab === 'sales' ? 'bg-white shadow-sm text-candace-700 font-medium' : 'text-slate-500 hover:text-slate-700'"
      class="px-5 py-2 rounded-md text-sm transition-all">Ventas</button>
    <button @click="tab = 'inventory'"
      :class="tab === 'inventory' ? 'bg-white shadow-sm text-candace-700 font-medium' : 'text-slate-500 hover:text-slate-700'"
      class="px-5 py-2 rounded-md text-sm transition-all">Inventario</button>
  </div>

  <!-- Sales Report -->
  <div x-show="tab === 'sales'">
    <!-- Filters -->
    <div class="flex items-center gap-3 mb-6">
      <div>
        <label class="block text-xs text-slate-500 mb-1">Desde</label>
        <input type="date" x-model="from" class="input-field text-sm">
      </div>
      <div>
        <label class="block text-xs text-slate-500 mb-1">Hasta</label>
        <input type="date" x-model="to" class="input-field text-sm">
      </div>
      <div class="pt-5">
        <button @click="loadSales" class="btn-primary text-sm px-4 py-2" :disabled="loading">
          <span x-show="loading"><svg class="animate-spin h-4 w-4 inline" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg></span>
          <span x-show="!loading">Filtrar</span>
        </button>
      </div>
    </div>

    <template x-if="salesData">
      <div>
        <!-- Summary cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="stat-card">
            <p class="text-sm text-slate-500">Facturas</p>
            <p class="text-2xl font-bold text-slate-800 mt-1" x-text="salesData.totals?.total_invoices"></p>
          </div>
          <div class="stat-card">
            <p class="text-sm text-slate-500">Ingresos</p>
            <p class="text-2xl font-bold text-candace-700 mt-1" x-text="fmt(salesData.totals?.total_revenue)"></p>
          </div>
          <div class="stat-card">
            <p class="text-sm text-slate-500">Subtotal</p>
            <p class="text-2xl font-bold text-slate-800 mt-1" x-text="fmt(salesData.totals?.total_subtotal)"></p>
          </div>
          <div class="stat-card">
            <p class="text-sm text-slate-500">ITBIS</p>
            <p class="text-2xl font-bold text-gold-600 mt-1" x-text="fmt(salesData.totals?.total_tax)"></p>
          </div>
        </div>

        <!-- Payment methods -->
        <div class="card mb-6">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">Por Método de Pago</h3>
          <div class="overflow-x-auto">
            <table class="table-minimal">
              <thead>
                <tr>
                  <th class="table-header">Método</th>
                  <th class="table-header text-right">Cantidad</th>
                  <th class="table-header text-right">Total</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <template x-for="pm in salesData.by_payment || []" :key="pm.payment_method">
                  <tr>
                    <td class="table-cell capitalize" x-text="paymentLabel[pm.payment_method] || pm.payment_method"></td>
                    <td class="table-cell text-right" x-text="pm.count"></td>
                    <td class="table-cell text-right font-medium" x-text="fmt(pm.total)"></td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Sales by period chart (simple table) -->
        <div class="card mb-6">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">Ventas por Día</h3>
          <div class="overflow-x-auto max-h-64 overflow-y-auto">
            <table class="table-minimal">
              <thead class="sticky top-0 bg-white">
                <tr>
                  <th class="table-header">Fecha</th>
                  <th class="table-header text-right">Facturas</th>
                  <th class="table-header text-right">Total</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <template x-for="s in salesData.sales_by_period || []" :key="s.period">
                  <tr>
                    <td class="table-cell" x-text="fmtDate(s.period)"></td>
                    <td class="table-cell text-right" x-text="s.count"></td>
                    <td class="table-cell text-right font-medium" x-text="fmt(s.total)"></td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Top products -->
        <div class="card">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">Productos Más Vendidos</h3>
          <div class="overflow-x-auto">
            <table class="table-minimal">
              <thead>
                <tr>
                  <th class="table-header">#</th>
                  <th class="table-header">Producto</th>
                  <th class="table-header text-right">Cantidad</th>
                  <th class="table-header text-right">Total</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <template x-for="(p, i) in salesData.top_products || []" :key="p.product_id">
                  <tr>
                    <td class="table-cell text-slate-400" x-text="i + 1"></td>
                    <td class="table-cell">
                      <span class="font-medium" x-text="p.product?.name || '—'"></span>
                      <span x-show="p.product?.code" class="text-xs text-slate-400 ml-1" x-text="'(' + p.product.code + ')'"></span>
                    </td>
                    <td class="table-cell text-right" x-text="Number(p.total_qty).toLocaleString('es-CO')"></td>
                    <td class="table-cell text-right font-medium" x-text="fmt(p.total)"></td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>

    <div x-show="!salesData && !loading" class="text-center py-12 text-slate-400">
      Selecciona un rango de fechas y presiona Filtrar
    </div>
  </div>

  <!-- Inventory Report -->
  <div x-show="tab === 'inventory'">
    <template x-if="inventoryData">
      <div>
        <!-- Summary cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="stat-card">
            <p class="text-sm text-slate-500">Productos</p>
            <p class="text-2xl font-bold text-slate-800 mt-1" x-text="inventoryData.summary?.total_products"></p>
          </div>
          <div class="stat-card">
            <p class="text-sm text-slate-500">Unidades en Stock</p>
            <p class="text-2xl font-bold text-slate-800 mt-1" x-text="Number(inventoryData.summary?.total_stock_items || 0).toLocaleString('es-CO')"></p>
          </div>
          <div class="stat-card">
            <p class="text-sm text-slate-500">Valor Inventario</p>
            <p class="text-2xl font-bold text-candace-700 mt-1" x-text="fmt(inventoryData.summary?.total_inventory_value)"></p>
          </div>
          <div class="stat-card bg-red-50 border-red-200">
            <p class="text-sm text-red-600 font-medium">Stock Bajo</p>
            <p class="text-2xl font-bold text-red-700 mt-1" x-text="inventoryData.summary?.low_stock_count"></p>
          </div>
        </div>

        <!-- By Category -->
        <div class="card mb-6">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">Inventario por Categoría</h3>
          <div class="overflow-x-auto">
            <table class="table-minimal">
              <thead>
                <tr>
                  <th class="table-header">Categoría</th>
                  <th class="table-header text-right">Productos</th>
                  <th class="table-header text-right">Unidades</th>
                  <th class="table-header text-right">Valor</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <template x-for="cat in inventoryData.by_category || []" :key="cat.category">
                  <tr>
                    <td class="table-cell font-medium" x-text="cat.category"></td>
                    <td class="table-cell text-right" x-text="cat.count"></td>
                    <td class="table-cell text-right" x-text="Number(cat.stock).toLocaleString('es-CO')"></td>
                    <td class="table-cell text-right font-medium" x-text="fmt(cat.value)"></td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Low Stock -->
        <div class="card" x-show="(inventoryData.low_stock || []).length">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">Productos con Stock Bajo</h3>
          <div class="overflow-x-auto max-h-80 overflow-y-auto">
            <table class="table-minimal">
              <thead class="sticky top-0 bg-white">
                <tr>
                  <th class="table-header">Producto</th>
                  <th class="table-header text-right">Stock Actual</th>
                  <th class="table-header text-right">Stock Mínimo</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <template x-for="p in inventoryData.low_stock || []" :key="p.id">
                  <tr>
                    <td class="table-cell">
                      <span class="font-medium" x-text="p.name"></span>
                      <span x-show="p.code" class="text-xs text-slate-400 ml-1" x-text="'(' + p.code + ')'"></span>
                    </td>
                    <td class="table-cell text-right text-red-600 font-medium" x-text="Number(p.stock).toLocaleString('es-CO')"></td>
                    <td class="table-cell text-right" x-text="Number(p.stock_min).toLocaleString('es-CO')"></td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>

    <div x-show="!inventoryData" class="text-center py-12 text-slate-400">
      <svg class="h-12 w-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
      <p>Cargando inventario...</p>
    </div>
  </div>
</div>`
}
