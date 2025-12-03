import { defineStore } from 'pinia'
import type { Database } from '../types/database.types'

export const useAuthStore = defineStore('auth', () => {
    const user = useSupabaseUser()
    const supabase = useSupabaseClient<Database>()
    const router = useRouter()

    // Custom user state to include role from users table
    const userProfile = ref<any>(null)
    const isLoadingProfile = ref(false)

    const fetchProfile = async (userId?: string) => {
        const id = userId || user.value?.id
        
        if (!id) {
            console.log('⚠️ No user ID available yet')
            userProfile.value = null
            return
        }
        
        if (isLoadingProfile.value) {
            console.log('⏳ Already loading profile, skipping...')
            return
        }

        isLoadingProfile.value = true
        console.log('🔍 Fetching profile for user:', id)
        
        try {
            console.log('⏰ Starting query...')
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('user_id', id)
                .single()

            console.log('⏰ Query completed')
            console.log('📦 Profile data:', data)
            console.log('❌ Profile error:', error)
            
            if (data) {
                userProfile.value = data
                console.log('✅ Profile loaded successfully:', data.role)
            } else {
                console.log('⚠️ No profile data returned')
            }
        } catch (err) {
            console.error('💥 Exception in fetchProfile:', err)
        } finally {
            isLoadingProfile.value = false
            console.log('🏁 fetchProfile finished')
        }
    }

    // Watch for auth changes to fetch profile
    watch(user, async (newUser, oldUser) => {
        console.log('👤 User changed from:', oldUser?.id, 'to:', newUser?.id)
        if (newUser?.id && newUser.id !== oldUser?.id) {
            await fetchProfile()
        } else if (!newUser) {
            userProfile.value = null
        }
    })

    // Cargar perfil al inicializar si ya hay usuario
    if (process.client && user.value?.id) {
        fetchProfile()
    }

    const signUp = async ({ email, password, first_name, last_name }: any) => {
        // 1. Registrar en Supabase Auth (guardamos nombre completo en metadata)
        const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
                data: {
                    full_name: `${first_name} ${last_name}`.trim()
                }
            }
        })
        if (error) throw error

        // 2. Guardar en tabla profiles (nombres separados)
        if (data.user && data.user.email) {
            const { error: profileError } = await supabase.from('profiles').upsert({
                id: data.user.id,
                email: data.user.email,
                first_name,
                last_name,
                role: 'student' // Por defecto
            }, { onConflict: 'id' })

            if (profileError) {
                console.error('Error updating profile:', profileError)
            }
        }

        // Ya no necesitamos insertar manualmente en 'users' porque el Trigger lo hace automáticamente.
        // Esto evita el error de RLS cuando el usuario aún no ha confirmado su email.

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
        fetchProfile,
        signUp,
        signIn,
        signOut,
        isAuthenticated,
        isInstructor,
        isStudent
    }
})
