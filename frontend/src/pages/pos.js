import Alpine from 'alpinejs'
import api from '../js/api/client'

if (!Alpine._datalistPOS) {
  Alpine._datalistPOS = true

  Alpine.data('posPage', () => ({
    search: '',
    results: [],
    cart: [],
    customers: [],
    customerId: '',
    paymentMethod: 'efectivo',
    saving: false,
    paid: false,
    lastInvoice: null,

    async init() {
      try {
        const { data } = await api.get('/customers?per_page=1000')
        this.customers = data.data ?? []
        this.searchProducts()
      } catch (e) { /* ignore */ }
    },

    async searchProducts() {
      const s = this.search.trim()
      if (!s) {
        try {
          const { data } = await api.get('/products?per_page=20&sort=name')
          this.results = data.data ?? []
        } catch (e) { /* ignore */ }
        return
      }
      try {
        const { data } = await api.get('/products', { params: { search: s, per_page: 20 } })
        this.results = data.data ?? []
      } catch (e) { /* ignore */ }
    },

    selectProduct(prod) {
      const existing = this.cart.find(i => i.product_id === prod.id && i.price === Number(prod.price))
      if (existing) {
        existing.quantity++
      } else {
        this.cart.push({
          product_id: prod.id,
          name: prod.name,
          code: prod.code || '',
          price: Number(prod.price),
          quantity: 1,
        })
      }
      this.search = ''
      this.results = []
    },

    updateQty(index, qty) {
      const n = Number(qty)
      if (n <= 0) {
        this.cart.splice(index, 1)
      } else {
        this.cart[index].quantity = n
      }
    },

    removeItem(index) {
      this.cart.splice(index, 1)
    },

    get subtotal() {
      return this.cart.reduce((s, i) => s + i.price * i.quantity, 0)
    },

    get tax() {
      return this.subtotal * 0.18
    },

    get total() {
      return this.subtotal + this.tax
    },

    async checkout() {
      if (!this.cart.length) return
      this.saving = true
      try {
        const { data } = await api.post('/invoices', {
          customer_id: this.customerId || null,
          type: 'factura',
          payment_method: this.paymentMethod,
          date: new Date().toISOString().split('T')[0],
          items: this.cart.map(i => ({
            product_id: i.product_id,
            quantity: i.quantity,
            unit_price: i.price,
          })),
        })
        this.lastInvoice = data.data ?? data
        this.paid = true
        this.cart = []
        this.customerId = ''
        this.search = ''
        this.results = []
      } catch (e) {
        window.opencode.toast(e.response?.data?.message || 'Error al procesar venta', 'error')
      } finally {
        this.saving = false
      }
    },

    newSale() {
      this.paid = false
      this.lastInvoice = null
      this.cart = []
      this.customerId = ''
      this.search = ''
      this.results = []
    },
  }))
}

export default function () {
  return `
<div class="h-[calc(100vh-8rem)] flex flex-col">
  <!-- Top bar: search + customer + payment -->
  <div class="flex items-center gap-3 mb-4 flex-shrink-0">
    <div class="relative flex-1">
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      <input type="text" x-model="search" @input.debounce.300ms="searchProducts" @keydown.enter="searchProducts" placeholder="Buscar por c\u00f3digo, barra o nombre..." class="input-field w-full pl-10 text-lg h-12" autofocus id="pos-search">
    </div>
    <select x-model="customerId" class="input-field w-48">
      <option value="">Consumidor Final</option>
      <template x-for="c in customers" :key="c.id">
        <option :value="c.id" x-text="c.name"></option>
      </template>
    </select>
    <select x-model="paymentMethod" class="input-field w-36">
      <option value="efectivo">Efectivo</option>
      <option value="tarjeta">Tarjeta</option>
      <option value="transferencia">Transferencia</option>
      <option value="credito">Cr\u00e9dito</option>
    </select>
  </div>

  <!-- Main area -->
  <div class="flex-1 flex gap-4 min-h-0">
    <!-- Products -->
    <div class="flex-1 overflow-y-auto">
      <div x-show="!search && !results.length" class="flex items-center justify-center h-full text-slate-400">
        <div class="text-center">
          <svg class="h-16 w-16 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <p class="text-lg">Busca productos por c\u00f3digo o nombre</p>
        </div>
      </div>
      <div x-show="results.length" class="grid grid-cols-2 xl:grid-cols-3 gap-3">
        <template x-for="p in results" :key="p.id">
          <div @click="selectProduct(p)" class="card cursor-pointer hover:border-candace-400 hover:shadow-md transition-all p-3 flex flex-col">
            <div class="flex items-start justify-between mb-1">
              <span class="text-xs font-mono text-slate-400" x-text="p.code || p.barcode || ''"></span>
              <span class="text-xs font-medium" :class="p.stock > 0 ? 'text-emerald-600' : 'text-red-500'" x-text="'Stock: ' + (p.stock || 0)"></span>
            </div>
            <p class="font-semibold text-slate-800 text-sm leading-tight" x-text="p.name"></p>
            <p x-show="p.brand" class="text-xs text-slate-400 mt-0.5" x-text="p.brand"></p>
            <div class="mt-auto pt-2 flex items-center justify-between">
              <span class="text-lg font-bold text-candace-700">$ <span x-text="Number(p.price).toLocaleString('es-CO') + ' COP'"></span></span>
              <button class="flex items-center justify-center w-8 h-8 rounded-full bg-candace-600 text-white hover:bg-candace-700 text-lg font-bold shadow-sm">+</button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Cart sidebar -->
    <div class="w-96 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200">
      <div class="p-4 border-b border-slate-100">
        <h3 class="font-semibold text-slate-800 flex items-center gap-2">
          <svg class="h-5 w-5 text-candace-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>
          Carrito
          <span class="text-sm font-normal text-slate-400" x-text="'(' + cart.length + ' items)'"></span>
        </h3>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-2">
        <template x-for="(item, i) in cart" :key="i">
          <div class="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-800 truncate" x-text="item.name"></p>
              <p class="text-xs text-slate-400" x-text="'$' + Number(item.price).toLocaleString('es-CO') + ' COP'"></p>
            </div>
            <div class="flex items-center gap-1">
              <button @click="updateQty(i, item.quantity - 1)" class="w-7 h-7 flex items-center justify-center rounded bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold text-sm">-</button>
              <input type="number" :value="item.quantity" @input.debounce="updateQty(i, $event.target.value)" class="w-12 text-center input-field text-sm py-1 px-0" min="1" step="1">
              <button @click="updateQty(i, item.quantity + 1)" class="w-7 h-7 flex items-center justify-center rounded bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold text-sm">+</button>
            </div>
            <div class="text-right min-w-[80px]">
              <p class="text-sm font-semibold text-slate-800" x-text="'$' + Number(item.price * item.quantity).toLocaleString('es-CO', { minimumFractionDigits: 2 }) + ' COP'"></p>
            </div>
            <button @click="removeItem(i)" class="text-slate-300 hover:text-red-500 flex-shrink-0">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </template>
        <div x-show="!cart.length" class="flex items-center justify-center h-32 text-slate-400 text-sm">
          Carrito vac\u00edo
        </div>
      </div>

      <div class="border-t border-slate-100 p-4 space-y-3">
        <div class="flex justify-between text-sm">
          <span class="text-slate-500">Subtotal</span>
          <span class="font-medium" x-text="'$' + Number(subtotal).toLocaleString('es-CO', { minimumFractionDigits: 2 }) + ' COP'"></span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-slate-500">ITBIS (18%)</span>
          <span class="font-medium" x-text="'$' + Number(tax).toLocaleString('es-CO', { minimumFractionDigits: 2 }) + ' COP'"></span>
        </div>
        <hr class="border-slate-200">
        <div class="flex justify-between text-lg font-bold">
          <span class="text-slate-800">Total</span>
          <span class="text-candace-700" x-text="'$' + Number(total).toLocaleString('es-CO', { minimumFractionDigits: 2 }) + ' COP'"></span>
        </div>
        <button @click="checkout" class="btn-primary w-full text-base py-3" :disabled="saving || !cart.length">
          <span x-show="saving">
            <svg class="animate-spin h-5 w-5 inline" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          </span>
          <span x-text="saving ? 'Procesando...' : 'Cobrar $' + Number(total).toLocaleString('es-CO', { minimumFractionDigits: 2 }) + ' COP'"></span>
        </button>
      </div>
    </div>
  </div>

  <!-- Payment success modal -->
  <div x-show="paid" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" @click.self="newSale">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
        <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
      </div>
      <h3 class="text-xl font-bold text-slate-800 mb-2">Venta completada</h3>
      <p class="text-slate-500 mb-1">Factura <span class="font-mono font-semibold text-candace-700" x-text="lastInvoice?.number"></span></p>
      <p class="text-slate-400 text-sm mb-6" x-text="new Date().toLocaleString('es-CO')"></p>
      <div class="flex gap-3">
        <button @click="newSale" class="btn-primary flex-1 py-3">Nueva Venta</button>
        <button @click="newSale" class="btn-secondary flex-1 py-3">Cerrar</button>
      </div>
    </div>
  </div>
</div>`
}
