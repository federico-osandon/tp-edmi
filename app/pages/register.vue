<script setup lang="ts">
const authStore = useAuthStore()
const form = ref({
  email: '',
  password: '',
  role: 'student'
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
      options: {
        data: {
          role: form.value.role
        }
      }
    })
  } catch (e: any) {
    error.value = e.message || 'An error occurred'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center">
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p class="text-gray-500">Join as a student or instructor</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
          <span class="block w-1.5 h-1.5 bg-red-600 rounded-full"></span>
          {{ error }}
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            v-model="form.email"
            type="email" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            v-model="form.password"
            type="password" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
          <div class="grid grid-cols-2 gap-4">
            <label 
              class="cursor-pointer border rounded-lg p-3 text-center transition-all"
              :class="[form.role === 'student' ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500' : 'border-gray-200 hover:border-gray-300']"
            >
              <input type="radio" v-model="form.role" value="student" class="sr-only" />
              <span class="font-medium">Student</span>
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

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
        >
          <span v-if="loading">Creating Account...</span>
          <span v-else>Create Account</span>
        </button>

        <div class="text-center text-sm text-gray-500">
          Already have an account? 
          <NuxtLink to="/login" class="text-indigo-600 hover:text-indigo-500 font-medium">Log in</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>
