import { defineStore } from 'pinia'

export const useDataStore = defineStore('data', () => {
    const supabase = useSupabase()

    const courses = ref<any[]>([])
    const assignments = ref<any[]>([])
    const submissions = ref<any[]>([])

    // Courses
    const fetchCourses = async () => {
        const { data } = await supabase.from('courses').select()
        courses.value = data || []
    }

    const createCourse = async (course: any) => {
        const { data, error } = await supabase.from('courses').insert(course)
        if (error) throw error
        if (data) courses.value.push(data[0])
    }

    const deleteCourse = async (id: string) => {
        await supabase.from('courses').delete().eq('id', id)
        courses.value = courses.value.filter(c => c.id !== id)
    }

    // Assignments
    const fetchAssignments = async (courseId: string) => {
        const { data } = await supabase.from('assignments').select()
        // Mock filtering in memory since our mock DB is simple
        assignments.value = (data || []).filter((a: any) => a.course_id === courseId)
    }

    const createAssignment = async (assignment: any) => {
        const { data, error } = await supabase.from('assignments').insert(assignment)
        if (error) throw error
        if (data) assignments.value.push(data[0])
    }

    // Submissions
    const fetchSubmissions = async (assignmentId: string) => {
        const { data } = await supabase.from('submissions').select()
        submissions.value = (data || []).filter((s: any) => s.assignment_id === assignmentId)
    }

    const submitAssignment = async (submission: any, file: File) => {
        // 1. Upload file
        const { data: fileData, error: fileError } = await supabase.storage.from('submissions').upload(`${Date.now()}_${file.name}`, file)
        if (fileError) throw fileError

        // 2. Get URL
        const { data: urlData } = supabase.storage.from('submissions').getPublicUrl(fileData.path)

        // 3. Save submission record
        const { data, error } = await supabase.from('submissions').insert({
            ...submission,
            file_url: urlData.publicUrl,
            file_name: file.name,
            submitted_at: new Date().toISOString()
        })
        if (error) throw error
        if (data) submissions.value.push(data[0])
    }

    return {
        courses,
        assignments,
        submissions,
        fetchCourses,
        createCourse,
        deleteCourse,
        fetchAssignments,
        createAssignment,
        fetchSubmissions,
        submitAssignment
    }
})
