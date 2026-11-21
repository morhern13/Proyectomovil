import Alpine from 'alpinejs'
import api from '../js/api/client'

if (!Alpine._datalistI) {
  Alpine._datalistI = true

  Alpine.data('invoicesPage', () => ({
    tab: 'list',
    invoices: [],
    meta: { current_page: 1, last_page: 1 },
    search: '',
    detail: null,
    form: { customer_id: '', type: 'factura', payment_method: 'efectivo', items: [] },
    selectedProductId: '',
    itemQuantity: 1,
    saving: false,
    customers: [],
    products: [],

    async init() { this.load(); await this.initForm() },
    async load() {
      const params = { page: this.meta.current_page }
      if (this.search) params.search = this.search
      try {
        const { data } = await api.get('/invoices', { params })
        this.invoices = data.data ?? []
        this.meta = data.meta ?? { current_page: 1, last_page: 1 }
      } catch (e) { /* ignore */ }
    },
    goPage(page) { this.meta.current_page = page; this.load() },
    viewDetail(inv) { this.detail = inv },
    async remove(inv) {
      if (!confirm('Anular factura ' + inv.number + '?')) return
      try {
        await api.delete(`/invoices/${inv.id}`)
        window.opencode.toast('Factura anulada', 'success')
        this.load()
      } catch (e) {
        window.opencode.toast(e.response?.data?.message || 'Error al anular', 'error')
      }
    },
    async initForm() {
      this.form.items = []
      try {
        const [cRes, pRes] = await Promise.all([
          api.get('/customers?per_page=1000'),
          api.get('/products?per_page=1000'),
        ])
        this.customers = cRes.data.data ?? []
        this.products = pRes.data.data ?? []
      } catch (e) { /* ignore */ }
    },
    get subtotal() {
      return this.form.items.reduce((s, i) => s + (Number(i.price) * Number(i.quantity)), 0)
    },
    get tax() {
      return this.subtotal * 0.18
    },
    get total() {
      return this.subtotal + this.tax
    },
    addItem() {
      if (!this.selectedProductId) return
      const prod = this.products.find(p => p.id == this.selectedProductId)
      if (!prod) return
      const qty = Number(this.itemQuantity) || 1
      const existing = this.form.items.find(i => i.product_id == prod.id)
      if (existing) {
        existing.quantity += qty
      } else {
        this.form.items.push({
          product_id: prod.id,
          name: prod.name,
          price: Number(prod.price),
          quantity: qty,
        })
      }
      this.selectedProductId = ''
      this.itemQuantity = 1
    },
    async saveInvoice() {
      if (!this.form.items.length) return
      this.saving = true
      try {
        await api.post('/invoices', {
          customer_id: this.form.customer_id || null,
          type: this.form.type,
          payment_method: this.form.payment_method,
          date: new Date().toISOString().split('T')[0],
          items: this.form.items.map(i => ({ product_id: i.product_id, quantity: i.quantity, unit_price: i.price })),
        })
        window.opencode.toast('Factura emitida exitosamente', 'success')
        this.form = { customer_id: '', type: 'factura', payment_method: 'efectivo', items: [] }
        this.tab = 'list'
        this.load()
      } catch (e) {
        window.opencode.toast(e.response?.data?.message || 'Error al emitir factura', 'error')
      } finally {
        this.saving = false
      }
    },
  }))
}

export default function () {
  return `
<div>
  <div class="flex items-center gap-4 mb-6">
    <button @click="tab = 'list'" :class="tab === 'list' ? 'bg-candace-600 text-white' : 'bg-white text-slate-600 border border-slate-300'" class="px-4 py-2 rounded-lg text-sm font-medium transition-all">Facturas</button>
    <button @click="tab = 'new'" :class="tab === 'new' ? 'bg-candace-600 text-white' : 'bg-white text-slate-600 border border-slate-300'" class="px-4 py-2 rounded-lg text-sm font-medium transition-all">
      <svg class="h-4 w-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
      Nueva Factura
    </button>
  </div>

  <div x-show="tab === 'list'">
    <input type="text" x-model="search" @input.debounce="load()" placeholder="Buscar factura por n\u00famero o cliente..." class="input-field w-64 mb-4">
    <div class="card p-0 overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-200">
            <th class="table-header">N\u00famero</th>
            <th class="table-header">Cliente</th>
            <th class="table-header">Fecha</th>
            <th class="table-header">Tipo</th>
            <th class="table-header text-right">Total</th>
            <th class="table-header">Estado</th>
            <th class="table-header text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <template x-for="inv in invoices" :key="inv.id">
            <tr class="hover:bg-slate-50 cursor-pointer" @click="viewDetail(inv)">
              <td class="table-cell font-mono font-medium text-xs" x-text="inv.number"></td>
              <td class="table-cell font-medium" x-text="inv.customer?.name || 'Consumidor Final'"></td>
              <td class="table-cell text-sm" x-text="new Date(inv.created_at).toLocaleDateString('es-CO')"></td>
              <td class="table-cell">
                <span class="badge-info" x-text="inv.type === 'factura' ? 'Factura' : inv.type"></span>
              </td>
              <td class="table-cell text-right font-semibold" x-text="'$' + Number(inv.total).toLocaleString('es-CO', { minimumFractionDigits: 2 }) + ' COP'"></td>
              <td class="table-cell">
                <span :class="inv.status === 'paid' || inv.status === 'pagada' ? 'badge-success' : inv.status === 'pending' || inv.status === 'pendiente' ? 'badge-warning' : inv.status === 'cancelled' || inv.status === 'anulada' ? 'badge-danger' : 'badge-info'" x-text="inv.status === 'paid' || inv.status === 'pagada' ? 'Pagada' : inv.status === 'pending' || inv.status === 'pendiente' ? 'Pendiente' : inv.status === 'cancelled' || inv.status === 'anulada' ? 'Anulada' : 'Borrador'"></span>
              </td>
              <td class="table-cell text-right">
                <button @click.stop="remove(inv)" class="text-red-500 hover:text-red-700"><svg class="h-4 w-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
              </td>
            </tr>
          </template>
          <tr x-show="!invoices.length">
            <td colspan="7" class="text-center py-12 text-slate-400">No hay facturas</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div x-show="meta.last_page > 1" class="flex items-center justify-between mt-4">
      <span class="text-sm text-slate-500" x-text="'P\u00e1gina ' + meta.current_page + ' de ' + meta.last_page"></span>
      <div class="flex gap-2">
        <button @click="goPage(meta.current_page - 1)" :disabled="meta.current_page <= 1" class="btn-secondary text-xs py-1.5 px-3">Anterior</button>
        <button @click="goPage(meta.current_page + 1)" :disabled="meta.current_page >= meta.last_page" class="btn-secondary text-xs py-1.5 px-3">Siguiente</button>
      </div>
    </div>
  </div>

  <div x-show="tab === 'new'">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-4">
        <div class="card">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">Datos de la Factura</h3>
          <div class="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label class="input-label">Cliente</label>
              <select x-model="form.customer_id" class="input-field">
                <option value="">Consumidor Final</option>
                <template x-for="c in customers" :key="c.id">
                  <option :value="c.id" x-text="c.name + (c.document ? ' - ' + c.document : '')"></option>
                </template>
              </select>
            </div>
            <div>
              <label class="input-label">Tipo Documento</label>
              <select x-model="form.type" class="input-field">
                <option value="factura">Factura</option>
                <option value="recibo">Recibo</option>
                <option value="ticket">Ticket</option>
                <option value="devolucion">Devoluci\u00f3n</option>
              </select>
            </div>
            <div>
              <label class="input-label">Tipo de Pago</label>
              <select x-model="form.payment_method" class="input-field">
                <option value="efectivo">Contado (Efectivo)</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="credito">Cr\u00e9dito</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>
          </div>
          <div>
            <label class="input-label">Agregar Producto</label>
            <div class="flex gap-2">
              <select x-model="selectedProductId" class="input-field flex-1">
                <option value="">Seleccionar producto...</option>
                <template x-for="p in products" :key="p.id">
                  <option :value="p.id" x-text="(p.code || '') + ' ' + p.name + ' - $' + Number(p.price).toLocaleString('es-CO') + ' COP' + ' (Stock: ' + p.stock + ')'"></option>
                </template>
              </select>
              <input type="number" x-model="itemQuantity" class="input-field w-20 text-center" placeholder="Cant" min="1">
              <button @click="addItem()" class="btn-primary" :disabled="!selectedProductId">+</button>
            </div>
          </div>
        </div>

        <div class="card p-0 overflow-hidden">
          <table class="w-full">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200">
                <th class="table-header">Producto</th>
                <th class="table-header text-right">Precio</th>
                <th class="table-header text-center">Cant</th>
                <th class="table-header text-right">Subtotal</th>
                <th class="table-header w-12"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <template x-for="(item, i) in form.items" :key="i">
                <tr>
                  <td class="table-cell font-medium" x-text="item.name"></td>
                  <td class="table-cell text-right" x-text="'$' + Number(item.price).toLocaleString('es-CO') + ' COP'"></td>
                  <td class="table-cell">
                    <input type="number" x-model="item.quantity" class="input-field w-16 text-center mx-auto" min="1">
                  </td>
                  <td class="table-cell text-right font-medium" x-text="'$' + Number(item.price * item.quantity).toLocaleString('es-CO', { minimumFractionDigits: 2 }) + ' COP'"></td>
                  <td class="table-cell">
                    <button @click="form.items.splice(i, 1)" class="text-red-500 hover:text-red-700"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
                  </td>
                </tr>
              </template>
              <tr x-show="!form.items.length">
                <td colspan="5" class="text-center py-8 text-slate-400">Agrega productos a la factura</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="space-y-4">
        <div class="card">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">Resumen</h3>
          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Subtotal</span>
              <span class="font-medium" x-text="'$' + Number(subtotal).toLocaleString('es-CO', { minimumFractionDigits: 2 }) + ' COP'"></span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">ITBIS (18%)</span>
              <span class="font-medium" x-text="'$' + Number(tax).toLocaleString('es-CO', { minimumFractionDigits: 2 }) + ' COP'"></span>
            </div>
            <hr class="border-slate-200">
            <div class="flex justify-between text-base font-bold">
              <span class="text-slate-800">Total</span>
              <span class="text-candace-700" x-text="'$' + Number(total).toLocaleString('es-CO', { minimumFractionDigits: 2 }) + ' COP'"></span>
            </div>
          </div>
          <button @click="saveInvoice()" class="btn-primary w-full mt-6" :disabled="saving || !form.items.length">
            <span x-show="saving">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            </span>
            <span x-text="saving ? 'Guardando...' : 'Emitir Factura'"></span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div x-show="detail" class="fixed inset-0 z-40 flex items-center justify-center bg-black/40" @click.self="detail = null">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between p-6 border-b border-slate-200">
        <div>
          <h3 class="text-lg font-semibold">Factura <span class="font-mono" x-text="detail?.number"></span></h3>
          <p class="text-sm text-slate-500" x-text="detail ? new Date(detail.created_at).toLocaleDateString('es-CO', { dateStyle: 'full' }) : ''"></p>
        </div>
        <button @click="detail = null" class="text-slate-400 hover:text-slate-600">&times;</button>
      </div>
      <div class="p-6 space-y-4">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-slate-500">Cliente:</span>
            <p class="font-medium" x-text="detail?.customer?.name || 'Consumidor Final'"></p>
          </div>
          <div class="text-right">
            <span class="text-slate-500">Estado:</span>
            <span :class="detail?.status === 'paid' || detail?.status === 'pagada' ? 'badge-success' : 'badge-warning'" class="inline-block ml-2" x-text="detail?.status === 'paid' || detail?.status === 'pagada' ? 'Pagada' : detail?.status === 'pending' || detail?.status === 'pendiente' ? 'Pendiente' : detail?.status"></span>
          </div>
        </div>
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-slate-50"><th class="table-header">Producto</th><th class="table-header text-right">Precio</th><th class="table-header text-center">Cant</th><th class="table-header text-right">Subtotal</th></tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <template x-for="item in detail?.items || []" :key="item.id">
              <tr>
                <td class="table-cell" x-text="item.product?.name || item.name"></td>
                <td class="table-cell text-right" x-text="'$' + Number(item.price).toLocaleString('es-CO') + ' COP'"></td>
                <td class="table-cell text-center" x-text="item.quantity"></td>
                <td class="table-cell text-right font-medium" x-text="'$' + Number(item.subtotal).toLocaleString('es-CO', { minimumFractionDigits: 2 }) + ' COP'"></td>
              </tr>
            </template>
          </tbody>
        </table>
        <div class="text-right space-y-1 text-sm">
          <div class="flex justify-end gap-8"><span class="text-slate-500">Subtotal:</span><span class="font-medium" x-text="'$' + Number(detail?.subtotal || 0).toLocaleString('es-CO', { minimumFractionDigits: 2 }) + ' COP'"></span></div>
          <div class="flex justify-end gap-8"><span class="text-slate-500">ITBIS:</span><span class="font-medium" x-text="'$' + Number(detail?.tax || 0).toLocaleString('es-CO', { minimumFractionDigits: 2 }) + ' COP'"></span></div>
          <div class="flex justify-end gap-8 text-base font-bold"><span class="text-slate-800">Total:</span><span class="text-candace-700" x-text="'$' + Number(detail?.total || 0).toLocaleString('es-CO', { minimumFractionDigits: 2 }) + ' COP'"></span></div>
        </div>
      </div>
    </div>
  </div>
</div>`
}
