// app/api/admin.ts
// Servicio para interactuar con los endpoints de administración

export const adminApi = {
  // Inicializar superadmin
  async setupAdmin() {
    return await $fetch('/api/setup-admin')
  },

  // Obtener lista de usuarios (requiere autenticación de admin)
  async getUsers() {
    return await $fetch('/api/users')
  }
}
