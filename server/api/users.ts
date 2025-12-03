import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)

  console.log('=== DEBUG usuarios endpoint ===')
  
  // Obtener el usuario desde supabase.auth.getUser() en lugar de serverSupabaseUser
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  console.log('Usuario recuperado:', user)
  console.log('User ID:', user?.id)
  console.log('User email:', user?.email)
  console.log('Error de auth:', authError)

  // 1. Verificar que el usuario esté autenticado
  if (!user || authError) {
    console.log('❌ No hay usuario autenticado')
    throw createError({
      statusCode: 401,
      statusMessage: 'No autorizado'
    })
  }

  console.log('✅ Usuario autenticado')

  // 2. Verificar que el usuario sea superadmin
  const { data: userProfile, error: profileError } = await supabase
    .from('users')
    .select('role')
    .eq('user_id', user.id)
    .single()

  console.log('Perfil de usuario:', userProfile)
  console.log('Error de perfil:', profileError)

  if (profileError || !userProfile || userProfile.role !== 'superadmin') {
    console.log('❌ Usuario no es superadmin o no se encontró perfil')
    throw createError({
      statusCode: 403,
      statusMessage: 'No tienes permisos para ver esta información'
    })
  }

  console.log('✅ Usuario es superadmin')

  // 3. Obtener todos los usuarios
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  console.log('Usuarios obtenidos:', users?.length)
  console.log('Error al obtener usuarios:', error)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error obteniendo usuarios: ' + error.message
    })
  }

  return users
})
