<script setup lang="ts">
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
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p class="text-gray-500">Sign in to access your dashboard</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
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

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
        >
          <span v-if="loading">Signing in...</span>
          <span v-else>Sign In</span>
        </button>

        <div class="text-center text-sm text-gray-500">
          Don't have an account? 
          <NuxtLink to="/register" class="text-indigo-600 hover:text-indigo-500 font-medium">Sign up</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>
