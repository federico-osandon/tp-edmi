import { defineStore } from 'pinia'
import type { Database } from '../types/database.types'

export const useAuthStore = defineStore('auth', () => {
    const user = useSupabaseUser()
    const supabase = useSupabaseClient<Database>()
    const router = useRouter()

    // Custom user state to include role from profiles table
    const userProfile = ref<any>(null)

    const fetchProfile = async () => {
        if (!user.value) {
            userProfile.value = null
            return
        }
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.value.id)
            .single()

        userProfile.value = data
    }

    // Watch for auth changes to fetch profile
    watch(user, async (newUser) => {
        if (newUser) {
            await fetchProfile()
        } else {
            userProfile.value = null
        }
    }, { immediate: true })

    const signUp = async ({ email, password, role }: any) => {
        // Removed metadata options to avoid triggering potential legacy triggers
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        })
        if (error) throw error

        // Manually insert or update profiles (upsert) to handle cases where a trigger might have already created the row
        if (data.user && data.user.email) {
            const { error: profileError } = await supabase.from('profiles').upsert({
                id: data.user.id,
                email: data.user.email,
                role: role as 'student' | 'instructor'
            }, { onConflict: 'id' })

            if (profileError) {
                console.error('Error updating profile:', profileError)
            }
        }

        router.push('/')
    }

    const signIn = async ({ email, password }: any) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error) throw error
        router.push('/')
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const isAuthenticated = computed(() => !!user.value)
    const isInstructor = computed(() => userProfile.value?.role === 'instructor')
    const isStudent = computed(() => userProfile.value?.role === 'student')

    return {
        user,
        userProfile,
        signUp,
        signIn,
        signOut,
        isAuthenticated,
        isInstructor,
        isStudent
    }
})
