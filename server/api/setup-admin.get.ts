import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient(event)
    
    const email = 'admin@edmi.com'
    const password = 'Admin123456!' // ¡Cambiar después de iniciar sesión!

    try {
        // 1. Verificar si ya existe un superadmin
        const { data: existingSuperadmin, error: checkError } = await supabase
            .from('users')
            .select('user_id, email')
            .eq('role', 'superadmin')
            .maybeSingle()

        if (existingSuperadmin) {
            return {
                success: false,
                message: 'Ya existe un superadmin en el sistema',
                email: existingSuperadmin.email
            }
        }

        // 2. Registrar usuario normalmente (como en el signup del frontend)
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    role: 'superadmin'
                }
            }
        })

        if (authError) {
            return {
                success: false,
                message: 'Error al crear usuario: ' + authError.message
            }
        }

        if (!authData?.user) {
            return {
                success: false,
                message: 'No se pudo crear el usuario'
            }
        }

        // 3. El trigger automáticamente debería crear el usuario en la tabla 'users'
        // Esperamos un poco para asegurarnos de que el trigger se ejecutó
        await new Promise(resolve => setTimeout(resolve, 1500))

        // 4. Verificar que se creó con el rol correcto
        const { data: verifyUser } = await supabase
            .from('users')
            .select('user_id, email, role')
            .eq('user_id', authData.user.id)
            .single()

        return {
            success: true,
            message: 'Superadmin creado exitosamente',
            user: verifyUser,
            credentials: { 
                email, 
                password
            },
            warning: 'Este endpoint solo funciona una vez. Cambia la contraseña después de iniciar sesión.'
        }

    } catch (error: any) {
        return {
            success: false,
            message: 'Error: ' + (error.message || 'Error desconocido')
        }
    }
})
