import Alpine from 'alpinejs'

if (!Alpine._datalistR) {
  Alpine._datalistR = true

  Alpine.data('registerForm', () => ({
    form: {
      company_name: '', rnc: '', phone: '', address: '',
      name: '', email: '', password: '', password_confirmation: '',
    },
    loading: false,
    error: '',

    async submit() {
      this.loading = true
      this.error = ''
      try {
        await Alpine.store('auth').register(this.form)
        this.form = { company_name: '', rnc: '', phone: '', address: '', name: '', email: '', password: '', password_confirmation: '' }
        window.location.hash = 'dashboard'
      } catch (e) {
        const errors = e.response?.data?.errors || e.response?.data || {}
        const messages = Object.values(errors).flat().filter(value => typeof value === 'string')
        this.error = messages.join('. ') || e.response?.data?.message || 'Error al registrar'
      } finally {
        this.loading = false
      }
    },
  }))
}

export default function () {
  return `
<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-candace-900 via-candace-800 to-candace-700 px-4 py-8">
  <div class="w-full max-w-lg">
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-500 mb-4">
        <span class="text-3xl font-bold text-candace-900">C</span>
      </div>
      <h1 class="text-3xl font-bold text-white">Candace</h1>
      <p class="text-candace-200 mt-1">Crear nueva empresa</p>
    </div>

    <div class="bg-white rounded-2xl shadow-xl p-8">
      <h2 class="text-xl font-semibold text-slate-800 mb-6">Registro de Empresa</h2>

      <form @submit.prevent="submit">
        <div class="space-y-4">
          <div>
            <label class="input-label">Nombre de la empresa</label>
            <input type="text" x-model="form.company_name" class="input-field" placeholder="Mi Empresa SRL" required>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="input-label">RNC / NIT</label>
              <input type="text" x-model="form.rnc" class="input-field" placeholder="000-00000-0">
            </div>
            <div>
              <label class="input-label">Teléfono</label>
              <input type="text" x-model="form.phone" class="input-field" placeholder="809-000-0000">
            </div>
          </div>
          <div>
            <label class="input-label">Dirección</label>
            <input type="text" x-model="form.address" class="input-field" placeholder="Calle Principal #123">
          </div>
          <hr class="border-slate-200">
          <div>
            <label class="input-label">Tu nombre completo</label>
            <input type="text" x-model="form.name" class="input-field" placeholder="Juan Pérez" required>
          </div>
          <div>
            <label class="input-label">Correo electrónico</label>
            <input type="email" x-model="form.email" class="input-field" placeholder="admin@ejemplo.com" required>
          </div>
          <div>
            <label class="input-label">Contraseña</label>
            <input type="password" x-model="form.password" class="input-field" placeholder="Mínimo 8 caracteres" required>
          </div>
          <div>
            <label class="input-label">Confirmar contraseña</label>
            <input type="password" x-model="form.password_confirmation" class="input-field" placeholder="Repite la contraseña" required>
          </div>
        </div>

        <div x-show="error" x-text="error" class="mt-3 text-sm text-red-600"></div>

        <button type="submit" class="btn-primary w-full mt-6" :disabled="loading">
          <span x-show="loading">
            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          </span>
          <span x-text="loading ? 'Registrando...' : 'Crear Empresa'"></span>
        </button>
      </form>

      <p class="text-center text-sm text-slate-500 mt-6">
        ¿Ya tienes cuenta?
        <a href="#" @click.prevent="navigate('login')" class="text-candace-600 hover:text-candace-700 font-medium">Inicia sesión</a>
      </p>
    </div>
  </div>
</div>`
}
