import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  // 1. Verificar que el usuario esté autenticado
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No autorizado'
    })
  }

  // 2. Verificar que el usuario sea superadmin
  const { data: userProfile } = await supabase
    .from('users')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!userProfile || userProfile.role !== 'superadmin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'No tienes permisos para ver esta información'
    })
  }

  // 3. Obtener todos los usuarios
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return users
})
