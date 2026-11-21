import Alpine from 'alpinejs'
import api from '../js/api/client'

if (!Alpine._datalistP) {
  Alpine._datalistP = true

  Alpine.data('productsPage', () => ({
    products: [],
    categories: [],
    meta: { current_page: 1, last_page: 1 },
    search: '',
    filters: { category_id: '', inventory: '' },
    showModal: false,
    editId: null,
    form: { code: '', barcode: '', name: '', category_id: '', brand: '', cost: 0, price: 0, stock: 0, description: '' },

    async init() {
      try {
        const { data } = await api.get('/categories')
        this.categories = data.data ?? []
      } catch (e) { /* ignore */ }
      this.load()
    },
    async load() {
      const params = { page: this.meta.current_page, search: this.search, ...this.filters }
      Object.keys(params).forEach(k => { if (!params[k]) delete params[k] })
      try {
        const { data } = await api.get('/products', { params })
        this.products = data.data ?? []
        this.meta = data.meta ?? { current_page: 1, last_page: 1 }
      } catch (e) { /* ignore */ }
    },
    goPage(page) { this.meta.current_page = page; this.load() },
    openModal(product) {
      if (product) {
        this.editId = product.id
        this.form = {
          code: product.code || '', barcode: product.barcode || '', name: product.name,
          category_id: product.category_id || '', brand: product.brand?.name || product.brand || '',
          cost: product.cost || 0, price: product.price || 0,
          stock: product.stock || 0, description: product.description || '',
        }
      } else {
        this.editId = null
        this.form = { code: '', barcode: '', name: '', category_id: '', brand: '', cost: 0, price: 0, stock: 0, description: '' }
      }
      this.showModal = true
    },
    async save() {
      try {
        if (this.editId) {
          await api.put(`/products/${this.editId}`, this.form)
        } else {
          await api.post('/products', { ...this.form, stock: this.form.stock || 0 })
        }
        this.showModal = false
        window.opencode.toast(this.editId ? 'Producto actualizado' : 'Producto creado', 'success')
        this.load()
      } catch (e) {
        window.opencode.toast(e.response?.data?.message || 'Error al guardar', 'error')
      }
    },
    async remove(product) {
      if (!confirm('Eliminar producto "' + product.name + '"?')) return
      try {
        await api.delete(`/products/${product.id}`)
        window.opencode.toast('Producto eliminado', 'success')
        this.load()
      } catch (e) {
        window.opencode.toast(e.response?.data?.message || 'Error al eliminar', 'error')
      }
    },
  }))
}

export default function () {
  return `
<div>
  <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
    <div class="flex items-center gap-3">
      <input type="text" x-model="search" @input.debounce="load()" placeholder="Buscar productos..." class="input-field w-64">
      <select x-model="filters.category_id" @change="load()" class="input-field w-44">
        <option value="">Todas las categorías</option>
        <template x-for="cat in categories" :key="cat.id">
          <option :value="cat.id" x-text="cat.name"></option>
        </template>
      </select>
      <select x-model="filters.inventory" @change="load()" class="input-field w-36">
        <option value="">Stock</option>
        <option value="low">Stock bajo</option>
        <option value="out">Sin stock</option>
      </select>
    </div>
    <button @click="openModal()" class="btn-primary">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
      Nuevo Producto
    </button>
  </div>

  <div class="card p-0 overflow-hidden">
    <table class="w-full">
      <thead>
        <tr class="bg-slate-50 border-b border-slate-200">
          <th class="table-header">Código</th>
          <th class="table-header">Nombre</th>
          <th class="table-header">Categoría</th>
          <th class="table-header">Precio</th>
          <th class="table-header">Stock</th>
          <th class="table-header text-right">Acciones</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        <template x-for="p in products" :key="p.id">
          <tr class="hover:bg-slate-50">
            <td class="table-cell font-mono text-xs" x-text="p.code || '-'"></td>
            <td class="table-cell font-medium">
              <span x-text="p.name"></span>
              <span x-show="p.brand" class="text-xs text-slate-400 ml-1" x-text="'(' + p.brand + ')'"></span>
            </td>
            <td class="table-cell" x-text="p.category?.name || '-'"></td>
            <td class="table-cell font-medium text-candace-700" x-text="'$' + Number(p.price || 0).toLocaleString('es-CO') + ' COP'"></td>
            <td class="table-cell">
              <span :class="p.stock <= 0 ? 'badge-danger' : p.stock <= 10 ? 'badge-warning' : 'badge-success'" x-text="p.stock || 0"></span>
            </td>
            <td class="table-cell text-right">
              <button @click="openModal(p)" class="text-candace-600 hover:text-candace-800 mr-2" title="Editar">
                <svg class="h-4 w-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              </button>
              <button @click="remove(p)" class="text-red-500 hover:text-red-700" title="Eliminar">
                <svg class="h-4 w-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </td>
          </tr>
        </template>
        <tr x-show="!products.length">
          <td colspan="6" class="text-center py-12 text-slate-400">No se encontraron productos</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div x-show="meta.last_page > 1" class="flex items-center justify-between mt-4">
    <span class="text-sm text-slate-500" x-text="'Página ' + meta.current_page + ' de ' + meta.last_page"></span>
    <div class="flex gap-2">
      <button @click="goPage(meta.current_page - 1)" :disabled="meta.current_page <= 1" class="btn-secondary text-xs py-1.5 px-3">Anterior</button>
      <button @click="goPage(meta.current_page + 1)" :disabled="meta.current_page >= meta.last_page" class="btn-secondary text-xs py-1.5 px-3">Siguiente</button>
    </div>
  </div>

  <div x-show="showModal" class="fixed inset-0 z-40 flex items-center justify-center bg-black/40" @click.self="showModal = false">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between p-6 border-b border-slate-200">
        <h3 class="text-lg font-semibold text-slate-800" x-text="editId ? 'Editar Producto' : 'Nuevo Producto'"></h3>
        <button @click="showModal = false" class="text-slate-400 hover:text-slate-600">&times;</button>
      </div>
      <form @submit.prevent="save()" class="p-6 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="input-label">Código</label>
            <input type="text" x-model="form.code" class="input-field" placeholder="SKU-001">
          </div>
          <div>
            <label class="input-label">Código de barras</label>
            <input type="text" x-model="form.barcode" class="input-field" placeholder="EAN-13">
          </div>
        </div>
        <div>
          <label class="input-label">Nombre *</label>
          <input type="text" x-model="form.name" class="input-field" required>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="input-label">Categoría</label>
            <select x-model="form.category_id" class="input-field">
              <option value="">Sin categoría</option>
              <template x-for="cat in categories" :key="cat.id">
                <option :value="cat.id" x-text="cat.name"></option>
              </template>
            </select>
          </div>
          <div>
            <label class="input-label">Marca</label>
            <input type="text" x-model="form.brand" class="input-field" placeholder="Nike, Adidas...">
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="input-label">Costo</label>
            <input type="number" step="0.01" x-model="form.cost" class="input-field" placeholder="0.00">
          </div>
          <div>
            <label class="input-label">Precio venta *</label>
            <input type="number" step="0.01" x-model="form.price" class="input-field" required placeholder="0.00">
          </div>
          <div>
            <label class="input-label">Stock inicial</label>
            <input type="number" x-model="form.stock" class="input-field" placeholder="0">
          </div>
        </div>
        <div>
          <label class="input-label">Descripción</label>
          <textarea x-model="form.description" class="input-field" rows="2"></textarea>
        </div>
        <div class="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button type="button" @click="showModal = false" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary" x-text="editId ? 'Actualizar' : 'Guardar'"></button>
        </div>
      </form>
    </div>
  </div>
</div>`
}
