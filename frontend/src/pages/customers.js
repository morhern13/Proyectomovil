import Alpine from 'alpinejs'
import api from '../js/api/client'

if (!Alpine._datalistCu) {
  Alpine._datalistCu = true

  Alpine.data('customersPage', () => ({
    customers: [],
    meta: { current_page: 1, last_page: 1 },
    search: '',
    showModal: false,
    editId: null,
    form: { name: '', document: '', phone: '', email: '', address: '' },

    async init() { this.load() },
    async load() {
      const params = { page: this.meta.current_page }
      if (this.search) params.search = this.search
      try {
        const { data } = await api.get('/customers', { params })
        this.customers = data.data ?? []
        this.meta = data.meta ?? { current_page: 1, last_page: 1 }
      } catch (e) { /* ignore */ }
    },
    goPage(page) { this.meta.current_page = page; this.load() },
    openModal(c) {
      if (c) {
        this.editId = c.id
        this.form = { name: c.name, document: c.document || '', phone: c.phone || '', email: c.email || '', address: c.address || '' }
      } else {
        this.editId = null
        this.form = { name: '', document: '', phone: '', email: '', address: '' }
      }
      this.showModal = true
    },
    async save() {
      try {
        if (this.editId) {
          await api.put(`/customers/${this.editId}`, this.form)
        } else {
          await api.post('/customers', this.form)
        }
        this.showModal = false
        window.opencode.toast(this.editId ? 'Cliente actualizado' : 'Cliente creado', 'success')
        this.load()
      } catch (e) {
        window.opencode.toast(e.response?.data?.message || 'Error al guardar', 'error')
      }
    },
    async remove(c) {
      if (!confirm('Eliminar cliente "' + c.name + '"?')) return
      try {
        await api.delete(`/customers/${c.id}`)
        window.opencode.toast('Cliente eliminado', 'success')
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
  <div class="flex items-center justify-between mb-6">
    <input type="text" x-model="search" @input.debounce="load()" placeholder="Buscar clientes..." class="input-field w-64">
    <button @click="openModal()" class="btn-primary">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
      Nuevo Cliente
    </button>
  </div>

  <div class="card p-0 overflow-hidden">
    <table class="w-full">
      <thead>
        <tr class="bg-slate-50 border-b border-slate-200">
          <th class="table-header">Nombre</th>
          <th class="table-header">Documento</th>
          <th class="table-header">Teléfono</th>
          <th class="table-header">Correo</th>
          <th class="table-header text-right">Acciones</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        <template x-for="c in customers" :key="c.id">
          <tr class="hover:bg-slate-50">
            <td class="table-cell font-medium" x-text="c.name"></td>
            <td class="table-cell text-sm" x-text="c.document || '-'"></td>
            <td class="table-cell" x-text="c.phone || '-'"></td>
            <td class="table-cell text-slate-500" x-text="c.email || '-'"></td>
            <td class="table-cell text-right">
              <button @click="openModal(c)" class="text-candace-600 hover:text-candace-800 mr-2"><svg class="h-4 w-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
              <button @click="remove(c)" class="text-red-500 hover:text-red-700"><svg class="h-4 w-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
            </td>
          </tr>
        </template>
        <tr x-show="!customers.length">
          <td colspan="5" class="text-center py-12 text-slate-400">No hay clientes registrados</td>
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
    <div class="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
      <div class="flex items-center justify-between p-6 border-b border-slate-200">
        <h3 class="text-lg font-semibold" x-text="editId ? 'Editar Cliente' : 'Nuevo Cliente'"></h3>
        <button @click="showModal = false" class="text-slate-400 hover:text-slate-600">&times;</button>
      </div>
      <form @submit.prevent="save()" class="p-6 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="input-label">Nombre *</label>
            <input type="text" x-model="form.name" class="input-field" required>
          </div>
          <div>
            <label class="input-label">Documento</label>
            <input type="text" x-model="form.document" class="input-field" placeholder="000-0000000-0">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="input-label">Teléfono</label>
            <input type="text" x-model="form.phone" class="input-field" placeholder="809-000-0000">
          </div>
          <div>
            <label class="input-label">Correo electrónico</label>
            <input type="email" x-model="form.email" class="input-field" placeholder="cliente@ejemplo.com">
          </div>
        </div>
        <div>
          <label class="input-label">Dirección</label>
          <textarea x-model="form.address" class="input-field" rows="2"></textarea>
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
