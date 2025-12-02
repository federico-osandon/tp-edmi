export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    role: 'student' | 'instructor'
                    created_at: string
                }
                Insert: {
                    id: string
                    email: string
                    role: 'student' | 'instructor'
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    role?: 'student' | 'instructor'
                    created_at?: string
                }
            }
            courses: {
                Row: {
                    id: string
                    name: string
                    code: string
                    description: string | null
                    instructor_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    code: string
                    description?: string | null
                    instructor_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    code?: string
                    description?: string | null
                    instructor_id?: string
                    created_at?: string
                }
            }
            assignments: {
                Row: {
                    id: string
                    course_id: string
                    title: string
                    description: string | null
                    due_date: string | null
                    points: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    course_id: string
                    title: string
                    description?: string | null
                    due_date?: string | null
                    points?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    course_id?: string
                    title?: string
                    description?: string | null
                    due_date?: string | null
                    points?: number | null
                    created_at?: string
                }
            }
            submissions: {
                Row: {
                    id: string
                    assignment_id: string
                    student_id: string
                    file_url: string | null
                    file_name: string | null
                    submitted_at: string
                }
                Insert: {
                    id?: string
                    assignment_id: string
                    student_id: string
                    file_url?: string | null
                    file_name?: string | null
                    submitted_at?: string
                }
                Update: {
                    id?: string
                    assignment_id?: string
                    student_id?: string
                    file_url?: string | null
                    file_name?: string | null
                    submitted_at?: string
                }
            }
        }
    }
}
