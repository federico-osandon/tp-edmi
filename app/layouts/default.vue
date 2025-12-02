<script setup lang="ts">
import { LogOut, BookOpen, GraduationCap, Menu, X } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()
const isMenuOpen = ref(false)

const handleLogout = async () => {
  await authStore.signOut()
  isMenuOpen.value = false
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-900">
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <NuxtLink to="/" class="flex-shrink-0 flex items-center gap-2">
              <div class="bg-indigo-600 p-1.5 rounded-lg">
                <GraduationCap class="h-6 w-6 text-white" />
              </div>
              <span class="font-bold text-xl tracking-tight text-gray-900">UniManager</span>
            </NuxtLink>
            <div class="hidden sm:ml-8 sm:flex sm:space-x-8">
              <NuxtLink 
                to="/" 
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                :class="[$route.path === '/' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']"
              >
                Dashboard
              </NuxtLink>
              <NuxtLink 
                v-if="authStore.isAuthenticated"
                to="/courses" 
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                :class="[$route.path.startsWith('/courses') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']"
              >
                Courses
              </NuxtLink>
            </div>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <template v-if="authStore.isAuthenticated">
              <div class="flex items-center gap-4">
                <div class="flex flex-col items-end">
                  <span class="text-sm font-medium text-gray-900">{{ authStore.user?.email }}</span>
                  <span class="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-0.5 rounded-full">{{ authStore.userProfile?.role }}</span>
                </div>
                <button 
                  @click="handleLogout"
                  class="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  title="Sign out"
                >
                  <LogOut class="h-5 w-5" />
                </button>
              </div>
            </template>
            <template v-else>
              <div class="flex gap-4">
                <NuxtLink to="/login" class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">Log in</NuxtLink>
                <NuxtLink to="/register" class="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Sign up</NuxtLink>
              </div>
            </template>
          </div>
          
          <!-- Mobile menu button -->
          <div class="-mr-2 flex items-center sm:hidden">
            <button 
              @click="toggleMenu"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span class="sr-only">Open main menu</span>
              <Menu v-if="!isMenuOpen" class="block h-6 w-6" />
              <X v-else class="block h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-show="isMenuOpen" class="sm:hidden bg-white border-b border-gray-200">
        <div class="pt-2 pb-3 space-y-1">
          <NuxtLink 
            to="/" 
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            :class="[$route.path === '/' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700']"
            @click="isMenuOpen = false"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink 
            v-if="authStore.isAuthenticated"
            to="/courses" 
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            :class="[$route.path.startsWith('/courses') ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700']"
            @click="isMenuOpen = false"
          >
            Courses
          </NuxtLink>
        </div>
        <div class="pt-4 pb-4 border-t border-gray-200">
          <template v-if="authStore.isAuthenticated">
            <div class="flex items-center px-4">
              <div class="flex-shrink-0">
                <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                  {{ authStore.user?.email?.[0].toUpperCase() }}
                </div>
              </div>
              <div class="ml-3">
                <div class="text-base font-medium text-gray-800">{{ authStore.user?.email }}</div>
                <div class="text-sm font-medium text-gray-500 capitalize">{{ authStore.userProfile?.role }}</div>
              </div>
            </div>
            <div class="mt-3 space-y-1">
              <button 
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          </template>
          <template v-else>
            <div class="mt-3 space-y-1 px-4">
              <NuxtLink 
                to="/login" 
                class="block w-full text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 shadow-sm mb-2"
                @click="isMenuOpen = false"
              >
                Log in
              </NuxtLink>
              <NuxtLink 
                to="/register" 
                class="block w-full text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                @click="isMenuOpen = false"
              >
                Sign up
              </NuxtLink>
            </div>
          </template>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>
