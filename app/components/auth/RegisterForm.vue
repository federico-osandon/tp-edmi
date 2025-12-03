<script setup lang="ts">
import Button from '~/components/ui/Button.vue'
import Input from '~/components/ui/Input.vue'

const authStore = useAuthStore()
const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  password: ''
})
const error = ref('')
const loading = ref(false)

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  try {
    await authStore.signUp({
      email: form.value.email,
      password: form.value.password,
      first_name: form.value.first_name,
      last_name: form.value.last_name
    })
  } catch (e: any) {
    error.value = e.message || 'Ocurrió un error al registrarse'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleRegister" class="space-y-6">
    <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
      <span class="block w-1.5 h-1.5 bg-red-600 rounded-full"></span>
      {{ error }}
    </div>

    <div class="grid grid-cols-2 gap-4">
      <Input
        v-model="form.first_name"
        label="Nombre"
        type="text"
        required
        placeholder="Juan"
      />
      <Input
        v-model="form.last_name"
        label="Apellido"
        type="text"
        required
        placeholder="Pérez"
      />
    </div>

    <Input
      v-model="form.email"
      label="Correo Electrónico"
      type="email"
      required
      placeholder="tu@ejemplo.com"
    />

    <Input
      v-model="form.password"
      label="Contraseña"
      type="password"
      required
      placeholder="••••••••"
    />

    <!-- Role selection removed: Default is student -->

    <Button
      type="submit"
      class="w-full"
      :loading="loading"
    >
      Crear Cuenta
    </Button>
  </form>
</template>
