<script setup lang="ts">
import Button from '~/components/ui/Button.vue'
import Input from '~/components/ui/Input.vue'

const authStore = useAuthStore()
const form = ref({
  email: '',
  password: '',
  role: 'student' as 'student' | 'instructor'
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
      role: form.value.role
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

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Soy un...</label>
      <div class="grid grid-cols-2 gap-4">
        <label 
          class="cursor-pointer border rounded-lg p-3 text-center transition-all"
          :class="[form.role === 'student' ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500' : 'border-gray-200 hover:border-gray-300']"
        >
          <input type="radio" v-model="form.role" value="student" class="sr-only" />
          <span class="font-medium">Estudiante</span>
        </label>
        <label 
          class="cursor-pointer border rounded-lg p-3 text-center transition-all"
          :class="[form.role === 'instructor' ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500' : 'border-gray-200 hover:border-gray-300']"
        >
          <input type="radio" v-model="form.role" value="instructor" class="sr-only" />
          <span class="font-medium">Instructor</span>
        </label>
      </div>
    </div>

    <Button
      type="submit"
      class="w-full"
      :loading="loading"
    >
      Crear Cuenta
    </Button>
  </form>
</template>
