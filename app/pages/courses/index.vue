<script setup lang="ts">
import { Plus, Trash2, Book, Calendar } from 'lucide-vue-next'

const authStore = useAuthStore()
const dataStore = useDataStore()
const router = useRouter()

const showCreateModal = ref(false)
const newCourse = ref({
  name: '',
  code: '',
  description: ''
})

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  await dataStore.fetchCourses()
})

const handleCreateCourse = async () => {
  try {
    await dataStore.createCourse({
      ...newCourse.value,
      instructor_id: authStore.user.id
    })
    showCreateModal.value = false
    newCourse.value = { name: '', code: '', description: '' }
  } catch (e) {
    console.error(e)
  }
}

const handleDeleteCourse = async (id: string) => {
  if (confirm('Are you sure you want to delete this course?')) {
    await dataStore.deleteCourse(id)
  }
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Courses</h1>
        <p class="mt-2 text-gray-600">
          {{ authStore.isInstructor ? 'Manage your courses' : 'Available courses' }}
        </p>
      </div>
      <button 
        v-if="authStore.isInstructor"
        @click="showCreateModal = true"
        class="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2 transition-colors shadow-sm"
      >
        <Plus class="h-5 w-5" />
        New Course
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="course in dataStore.courses" 
        :key="course.id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
      >
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <div class="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
              {{ course.code }}
            </div>
            <button 
              v-if="authStore.isInstructor"
              @click.stop="handleDeleteCourse(course.id)"
              class="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
            >
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
            <NuxtLink :to="`/courses/${course.id}`">
              {{ course.name }}
            </NuxtLink>
          </h3>
          <p class="text-gray-500 text-sm line-clamp-2 mb-4">{{ course.description }}</p>
          
          <div class="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div class="flex items-center text-gray-400 text-sm">
              <Calendar class="h-4 w-4 mr-1.5" />
              <span>{{ new Date(course.created_at).toLocaleDateString() }}</span>
            </div>
            <NuxtLink 
              :to="`/courses/${course.id}`"
              class="text-indigo-600 font-medium text-sm hover:text-indigo-700"
            >
              View Details
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Course Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 class="text-lg font-semibold text-gray-900">Create New Course</h3>
          <button @click="showCreateModal = false" class="text-gray-400 hover:text-gray-500">
            <span class="sr-only">Close</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="handleCreateCourse" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
            <input 
              v-model="newCourse.name"
              type="text" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Introduction to Computer Science"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
            <input 
              v-model="newCourse.code"
              type="text" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="CS101"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              v-model="newCourse.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Course description..."
            ></textarea>
          </div>
          <div class="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              @click="showCreateModal = false"
              class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm"
            >
              Create Course
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
