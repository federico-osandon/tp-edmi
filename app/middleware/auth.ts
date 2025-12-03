export default defineNuxtRouteMiddleware(async (to) => {
    const supabase = useSupabaseClient()

    // Get session from server-side (more reliable than useSupabaseUser)
    const { data: { session } } = await supabase.auth.getSession()

    // If user is not logged in and trying to access a protected route
    if (!session && to.path !== '/login' && to.path !== '/register') {
        return navigateTo('/login', { replace: true })
    }

    // If user is logged in and trying to access login/register
    if (session && (to.path === '/login' || to.path === '/register')) {
        return navigateTo('/', { replace: true })
    }
})
