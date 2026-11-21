import Alpine from 'alpinejs'

if (!Alpine._datalist) {
  Alpine._datalist = true

  Alpine.data('loginForm', () => ({
    form: { email: '', password: '' },
    loading: false,
    error: '',

    async submit() {
      this.loading = true
      this.error = ''
      try {
        await Alpine.store('auth').login(this.form.email, this.form.password)
        this.form = { email: '', password: '' }
        window.location.hash = 'dashboard'
      } catch (e) {
        this.error = e.response?.data?.email?.[0] || e.response?.data?.detail || e.response?.data?.message || 'Error al iniciar sesión'
      } finally {
        this.loading = false
      }
    },
  }))
}

export default function () {
  return `
<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-candace-900 via-candace-800 to-candace-700 px-4">
  <div class="w-full max-w-md">
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-500 mb-4">
        <span class="text-3xl font-bold text-candace-900">C</span>
      </div>
      <h1 class="text-3xl font-bold text-white">Candace</h1>
      <p class="text-candace-200 mt-1">Sistema de Gestión Comercial</p>
    </div>

    <div class="bg-white rounded-2xl shadow-xl p-8">
      <h2 class="text-xl font-semibold text-slate-800 mb-6">Iniciar Sesión</h2>

      <form @submit.prevent="submit">
        <div class="space-y-4">
          <div>
            <label class="input-label">Correo electrónico</label>
            <input type="email" x-model="form.email" class="input-field" placeholder="admin@ejemplo.com" required>
          </div>
          <div>
            <label class="input-label">Contraseña</label>
            <input type="password" x-model="form.password" class="input-field" placeholder="••••••••" required>
          </div>
        </div>

        <div x-show="error" x-text="error" class="mt-3 text-sm text-red-600"></div>

        <button type="submit" class="btn-primary w-full mt-6" :disabled="loading">
          <span x-show="loading">
            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          </span>
          <span x-text="loading ? 'Ingresando...' : 'Ingresar'"></span>
        </button>
      </form>

      <p class="text-center text-sm text-slate-500 mt-6">
        ¿No tienes cuenta?
        <a href="#" @click.prevent="navigate('register')" class="text-candace-600 hover:text-candace-700 font-medium">Regístrate</a>
      </p>
    </div>
  </div>
</div>`
}
