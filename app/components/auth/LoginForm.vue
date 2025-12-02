<script setup lang="ts">
import Button from '~/components/ui/Button.vue'
import Input from '~/components/ui/Input.vue'

const authStore = useAuthStore()
const form = ref({
  email: '',
  password: ''
})
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    await authStore.signIn(form.value)
  } catch (e: any) {
    error.value = e.message || 'Ocurrió un error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleLogin" class="space-y-6">
    <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
      <span class="block w-1.5 h-1.5 bg-red-600 rounded-full"></span>
      {{ error }}
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

    <Button
      type="submit"
      class="w-full"
      :loading="loading"
    >
      Iniciar Sesión
    </Button>
  </form>
</template>
