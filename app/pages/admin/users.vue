<script setup lang="ts">
import { Users, AlertCircle, Loader2 } from 'lucide-vue-next'
import { adminApi } from '~/api/admin'
import type { Database } from '~/types/database.types'

type Profile = Database['public']['Tables']['users']['Row']

definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const router = useRouter()

// Redirect if not superadmin
if (authStore.userProfile?.role !== 'superadmin') {
  router.push('/')
}

const users = ref<Profile[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const loadUsers = async () => {
  try {
    loading.value = true
    error.value = null
    users.value = await adminApi.getUsers()
  } catch (e: any) {
    error.value = e.message || 'Error loading users'
    console.error('Error loading users:', e)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getRoleBadgeClass = (role: string) => {
  const classes = {
    superadmin: 'bg-purple-100 text-purple-800 border-purple-200',
    admin: 'bg-red-100 text-red-800 border-red-200',
    instructor: 'bg-blue-100 text-blue-800 border-blue-200',
    student: 'bg-green-100 text-green-800 border-green-200'
  }
  return classes[role as keyof typeof classes] || 'bg-gray-100 text-gray-800 border-gray-200'
}

onMounted(() => {
  loadUsers()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="bg-indigo-600 p-2 rounded-lg">
          <Users class="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
          <p class="text-sm text-gray-500">View and manage all users in the system</p>
        </div>
      </div>
      <div class="text-sm text-gray-500">
        Total users: <span class="font-semibold text-gray-900">{{ users.length }}</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <Loader2 class="h-8 w-8 text-indigo-600 animate-spin mx-auto mb-2" />
        <p class="text-sm text-gray-500">Loading users...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-start gap-3">
        <AlertCircle class="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 class="text-sm font-medium text-red-800">Error loading users</h3>
          <p class="text-sm text-red-700 mt-1">{{ error }}</p>
          <button 
            @click="loadUsers"
            class="mt-3 text-sm font-medium text-red-600 hover:text-red-700 underline"
          >
            Try again
          </button>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div v-else class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.user_id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span class="text-indigo-600 font-semibold text-sm">
                      {{ (user.first_name?.[0] ?? user.email[0]).toUpperCase() }}
                    </span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : 'No name' }}
                    </div>
                    <div class="text-sm text-gray-500">ID: {{ user.user_id.slice(0, 8) }}...</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border capitalize"
                  :class="getRoleBadgeClass(user.role)"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="users.length === 0" class="text-center py-12">
        <Users class="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 class="text-sm font-medium text-gray-900 mb-1">No users found</h3>
        <p class="text-sm text-gray-500">There are no users in the system yet.</p>
      </div>
    </div>
  </div>
</template>
