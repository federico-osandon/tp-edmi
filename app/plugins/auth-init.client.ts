export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  const supabase = useSupabaseClient()

  // Escuchar cambios de autenticación
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('🔐 Auth state changed:', event, session?.user?.id)
    
    if (session?.user) {
      // Usuario autenticado, cargar perfil pasando el ID directamente
      await authStore.fetchProfile(session.user.id)
    } else {
      // Usuario no autenticado
      authStore.userProfile = null
    }
  })

  // Cargar perfil inicial si ya hay sesión
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {
    console.log('✅ Initial session found, loading profile')
    await authStore.fetchProfile(session.user.id)
  }
})
