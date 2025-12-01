<script setup lang="ts">
import { Plus, Upload, FileText, Calendar, ChevronDown, ChevronUp, User, Download } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const dataStore = useDataStore()

const courseId = route.params.id as string
const course = computed(() => dataStore.courses.find(c => c.id === courseId))
const assignments = computed(() => dataStore.assignments)

const showCreateAssignmentModal = ref(false)
const newAssignment = ref({
  title: '',
  description: '',
  due_date: '',
  points: 100
})

const selectedAssignmentId = ref<string | null>(null)
const submissionFile = ref<File | null>(null)
const isSubmitting = ref(false)

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  if (!dataStore.courses.length) {
    await dataStore.fetchCourses()
  }
  await dataStore.fetchAssignments(courseId)
})

// Instructor: Create Assignment
const handleCreateAssignment = async () => {
  try {
    await dataStore.createAssignment({
      ...newAssignment.value,
      course_id: courseId
    })
    showCreateAssignmentModal.value = false
    newAssignment.value = { title: '', description: '', due_date: '', points: 100 }
  } catch (e) {
    console.error(e)
  }
}

// Student: Submit Assignment
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    submissionFile.value = target.files[0]
  }
}

const handleSubmit = async (assignmentId: string) => {
  if (!submissionFile.value) return
  
  isSubmitting.value = true
  try {
    await dataStore.submitAssignment({
      assignment_id: assignmentId,
      student_id: authStore.user.id,
      student_name: authStore.user.email // Simple way to show name
    }, submissionFile.value)
    
    // Refresh submissions if we are viewing them (though this is student view)
    // Ideally show success message
    submissionFile.value = null
    alert('Assignment submitted successfully!')
  } catch (e) {
    console.error(e)
    alert('Failed to submit assignment')
  } finally {
    isSubmitting.value = false
  }
}

// Instructor: View Submissions
const expandedAssignmentId = ref<string | null>(null)

const toggleAssignment = async (assignmentId: string) => {
  if (expandedAssignmentId.value === assignmentId) {
    expandedAssignmentId.value = null
  } else {
    expandedAssignmentId.value = assignmentId
    if (authStore.isInstructor) {
      await dataStore.fetchSubmissions(assignmentId)
    }
  }
}

const getSubmissionsForAssignment = (assignmentId: string) => {
  return dataStore.submissions.filter(s => s.assignment_id === assignmentId)
}
</script>

<template>
  <div v-if="course">
    <div class="mb-8 border-b border-gray-200 pb-8">
      <div class="flex justify-between items-start">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-3xl font-bold text-gray-900">{{ course.name }}</h1>
            <span class="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide">
              {{ course.code }}
            </span>
          </div>
          <p class="text-gray-600 max-w-2xl">{{ course.description }}</p>
        </div>
        <button 
          v-if="authStore.isInstructor"
          @click="showCreateAssignmentModal = true"
          class="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus class="h-5 w-5" />
          New Assignment
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
        <FileText class="h-5 w-5 text-gray-500" />
        Assignments
      </h2>

      <div v-if="assignments.length === 0" class="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <p class="text-gray-500">No assignments created yet.</p>
      </div>

      <div 
        v-for="assignment in assignments" 
        :key="assignment.id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div 
          class="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
          @click="toggleAssignment(assignment.id)"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ assignment.title }}</h3>
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <span class="flex items-center gap-1">
                  <Calendar class="h-4 w-4" />
                  Due: {{ new Date(assignment.due_date).toLocaleDateString() }}
                </span>
                <span class="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600">
                  {{ assignment.points }} Points
                </span>
              </div>
            </div>
            <component 
              :is="expandedAssignmentId === assignment.id ? ChevronUp : ChevronDown" 
              class="h-5 w-5 text-gray-400"
            />
          </div>
        </div>

        <div v-if="expandedAssignmentId === assignment.id" class="border-t border-gray-100 bg-gray-50 p-6">
          <p class="text-gray-700 mb-6 whitespace-pre-wrap">{{ assignment.description }}</p>

          <!-- Student View: Submit -->
          <div v-if="authStore.isStudent" class="bg-white p-6 rounded-lg border border-gray-200">
            <h4 class="font-medium text-gray-900 mb-4">Submit Assignment</h4>
            <div class="flex items-start gap-4">
              <div class="flex-1">
                <input 
                  type="file" 
                  @change="handleFileChange"
                  class="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100
                  "
                />
              </div>
              <button 
                @click="handleSubmit(assignment.id)"
                :disabled="!submissionFile || isSubmitting"
                class="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                <Upload class="h-4 w-4" />
                {{ isSubmitting ? 'Uploading...' : 'Submit' }}
              </button>
            </div>
          </div>

          <!-- Instructor View: Submissions List -->
          <div v-if="authStore.isInstructor">
            <h4 class="font-medium text-gray-900 mb-4">Student Submissions</h4>
            <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
                    <th scope="col" class="relative px-6 py-3">
                      <span class="sr-only">Download</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="submission in getSubmissionsForAssignment(assignment.id)" :key="submission.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <User class="h-4 w-4 text-gray-500" />
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ submission.student_name }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ submission.file_name }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500">{{ new Date(submission.submitted_at).toLocaleString() }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a :href="submission.file_url" target="_blank" class="text-indigo-600 hover:text-indigo-900 flex items-center justify-end gap-1">
                        <Download class="h-4 w-4" />
                        Download
                      </a>
                    </td>
                  </tr>
                  <tr v-if="getSubmissionsForAssignment(assignment.id).length === 0">
                    <td colspan="4" class="px-6 py-8 text-center text-sm text-gray-500">
                      No submissions yet.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Assignment Modal -->
    <div v-if="showCreateAssignmentModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 class="text-lg font-semibold text-gray-900">Create New Assignment</h3>
          <button @click="showCreateAssignmentModal = false" class="text-gray-400 hover:text-gray-500">
            <span class="sr-only">Close</span>
            <X class="h-6 w-6" />
          </button>
        </div>
        <form @submit.prevent="handleCreateAssignment" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              v-model="newAssignment.title"
              type="text" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Midterm Project"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              v-model="newAssignment.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Assignment details..."
            ></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input 
                v-model="newAssignment.due_date"
                type="date" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Points</label>
              <input 
                v-model="newAssignment.points"
                type="number" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div class="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              @click="showCreateAssignmentModal = false"
              class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm"
            >
              Create Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-12">
    <p class="text-gray-500">Course not found.</p>
    <NuxtLink to="/courses" class="text-indigo-600 hover:text-indigo-700 font-medium mt-2 inline-block">
      Back to Courses
    </NuxtLink>
  </div>
</template>
