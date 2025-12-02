import { defineStore } from 'pinia'
import type { Database } from '../types/database.types'

export const useDataStore = defineStore('data', () => {
    const supabase = useSupabaseClient<Database>()

    const courses = ref<any[]>([])
    const assignments = ref<any[]>([])
    const submissions = ref<any[]>([])

    // Courses
    const fetchCourses = async () => {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        courses.value = data || []
    }

    const createCourse = async (course: any) => {
        const { data, error } = await supabase
            .from('courses')
            .insert(course)
            .select()
            .single()

        if (error) throw error
        if (data) courses.value.unshift(data)
    }

    const deleteCourse = async (id: string) => {
        const { error } = await supabase
            .from('courses')
            .delete()
            .eq('id', id)

        if (error) throw error
        courses.value = courses.value.filter(c => c.id !== id)
    }

    // Assignments
    const fetchAssignments = async (courseId: string) => {
        const { data, error } = await supabase
            .from('assignments')
            .select('*')
            .eq('course_id', courseId)
            .order('due_date', { ascending: true })

        if (error) throw error
        assignments.value = data || []
    }

    const createAssignment = async (assignment: any) => {
        const { data, error } = await supabase
            .from('assignments')
            .insert(assignment)
            .select()
            .single()

        if (error) throw error
        if (data) assignments.value.push(data)
    }

    // Submissions
    const fetchSubmissions = async (assignmentId: string) => {
        const { data, error } = await supabase
            .from('submissions')
            .select(`
        *,
        profiles:student_id (email)
      `)
            .eq('assignment_id', assignmentId)
            .order('submitted_at', { ascending: false })

        if (error) throw error
        // Map profile email to student_name for UI compatibility
        submissions.value = (data || []).map((s: any) => ({
            ...s,
            student_name: s.profiles?.email
        }))
    }

    const submitAssignment = async (submission: any, file: File) => {
        // 1. Upload file
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${submission.assignment_id}/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('submissions')
            .upload(filePath, file)

        if (uploadError) throw uploadError

        // 2. Get URL
        const { data: urlData } = supabase.storage
            .from('submissions')
            .getPublicUrl(filePath)

        // 3. Save submission record
        const { data, error } = await supabase
            .from('submissions')
            .insert({
                assignment_id: submission.assignment_id,
                student_id: submission.student_id,
                file_url: urlData.publicUrl,
                file_name: file.name
            })
            .select()
            .single()

        if (error) throw error
        if (data) submissions.value.unshift({
            ...data,
            student_name: submission.student_name
        })
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
