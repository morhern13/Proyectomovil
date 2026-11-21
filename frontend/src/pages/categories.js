import Alpine from 'alpinejs'
import api from '../js/api/client'

if (!Alpine._datalistC) {
  Alpine._datalistC = true

  Alpine.data('categoriesPage', () => ({
    categories: [],
    showModal: false,
    editId: null,
    form: { name: '', parent_id: '', description: '' },

    async init() { this.load() },
    async load() {
      try {
        const { data } = await api.get('/categories')
        this.categories = data.data ?? []
      } catch (e) { /* ignore */ }
    },
    openModal(cat) {
      if (cat) {
        this.editId = cat.id
        this.form = { name: cat.name, parent_id: cat.parent_id || '', description: cat.description || '' }
      } else {
        this.editId = null
        this.form = { name: '', parent_id: '', description: '' }
      }
      this.showModal = true
    },
    async save() {
      try {
        if (this.editId) {
          await api.put(`/categories/${this.editId}`, this.form)
        } else {
          await api.post('/categories', this.form)
        }
        this.showModal = false
        window.opencode.toast(this.editId ? 'Categoría actualizada' : 'Categoría creada', 'success')
        this.load()
      } catch (e) {
        window.opencode.toast(e.response?.data?.message || 'Error al guardar', 'error')
      }
    },
    async remove(cat) {
      if (!confirm('Eliminar categoría "' + cat.name + '"?')) return
      try {
        await api.delete(`/categories/${cat.id}`)
        window.opencode.toast('Categoría eliminada', 'success')
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
    <h2 class="text-lg font-semibold text-slate-800">Listado de Categorías</h2>
    <button @click="openModal()" class="btn-primary">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
      Nueva Categoría
    </button>
  </div>

  <div class="card p-0 overflow-hidden">
    <table class="w-full">
      <thead>
        <tr class="bg-slate-50 border-b border-slate-200">
          <th class="table-header">Nombre</th>
          <th class="table-header">Categoría Padre</th>
          <th class="table-header">Productos</th>
          <th class="table-header">Slug</th>
          <th class="table-header text-right">Acciones</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        <template x-for="cat in categories" :key="cat.id">
          <tr class="hover:bg-slate-50">
            <td class="table-cell font-medium" x-text="cat.name"></td>
            <td class="table-cell text-slate-500" x-text="cat.parent?.name || '-'"></td>
            <td class="table-cell" x-text="cat.products_count ?? 0"></td>
            <td class="table-cell text-xs font-mono text-slate-400" x-text="cat.slug"></td>
            <td class="table-cell text-right">
              <button @click="openModal(cat)" class="text-candace-600 hover:text-candace-800 mr-2"><svg class="h-4 w-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
              <button @click="remove(cat)" class="text-red-500 hover:text-red-700"><svg class="h-4 w-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
            </td>
          </tr>
        </template>
        <tr x-show="!categories.length">
          <td colspan="5" class="text-center py-12 text-slate-400">No hay categorías</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div x-show="showModal" class="fixed inset-0 z-40 flex items-center justify-center bg-black/40" @click.self="showModal = false">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
      <div class="flex items-center justify-between p-6 border-b border-slate-200">
        <h3 class="text-lg font-semibold" x-text="editId ? 'Editar Categoría' : 'Nueva Categoría'"></h3>
        <button @click="showModal = false" class="text-slate-400 hover:text-slate-600">&times;</button>
      </div>
      <form @submit.prevent="save()" class="p-6 space-y-4">
        <div>
          <label class="input-label">Nombre *</label>
          <input type="text" x-model="form.name" class="input-field" required>
        </div>
        <div>
          <label class="input-label">Categoría padre</label>
          <select x-model="form.parent_id" class="input-field">
            <option value="">Ninguna (raíz)</option>
            <template x-for="cat in categories" :key="cat.id">
              <option :value="cat.id" x-text="cat.name" :disabled="cat.id === editId"></option>
            </template>
          </select>
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
