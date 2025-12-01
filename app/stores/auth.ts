import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<any>(null)
    const supabase = useSupabase()
    const router = useRouter()

    const fetchUser = async () => {
        const { data } = await supabase.auth.getUser()
        user.value = data.user
    }

    const signUp = async (credentials: any) => {
        const { data, error } = await supabase.auth.signUp(credentials)
        if (error) throw error
        user.value = data.user
        router.push('/')
    }

    const signIn = async (credentials: any) => {
        const { data, error } = await supabase.auth.signInWithPassword(credentials)
        if (error) throw error
        user.value = data.user
        router.push('/')
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        user.value = null
        router.push('/login')
    }

    const isAuthenticated = computed(() => !!user.value)
    const isInstructor = computed(() => user.value?.role === 'instructor')
    const isStudent = computed(() => user.value?.role === 'student')

    return {
        user,
        fetchUser,
        signUp,
        signIn,
        signOut,
        isAuthenticated,
        isInstructor,
        isStudent
    }
})
