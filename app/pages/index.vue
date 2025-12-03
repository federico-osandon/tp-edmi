<script setup lang="ts">
import { BookOpen, Plus, ArrowRight } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()
const isLoading = ref(true)

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  isLoading.value = false
})
</script>

<template>
  <div v-if="!isLoading && authStore.isAuthenticated">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="mt-2 text-gray-600">Welcome back, {{ authStore.user?.email }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Instructor Actions -->
      <template v-if="authStore.isInstructor">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div class="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <BookOpen class="h-6 w-6 text-indigo-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Manage Courses</h3>
          <p class="text-gray-500 mb-4">Create and manage your courses and assignments.</p>
          <NuxtLink to="/courses" class="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium">
            Go to Courses <ArrowRight class="ml-2 h-4 w-4" />
          </NuxtLink>
        </div>
      </template>

      <!-- Student Actions -->
      <template v-if="authStore.isStudent">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <BookOpen class="h-6 w-6 text-green-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">My Courses</h3>
          <p class="text-gray-500 mb-4">View your enrolled courses and pending assignments.</p>
          <NuxtLink to="/courses" class="inline-flex items-center text-green-600 hover:text-green-700 font-medium">
            View Courses <ArrowRight class="ml-2 h-4 w-4" />
          </NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>
