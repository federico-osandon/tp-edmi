-- LIMPIAR Y RECREAR TODAS LAS POLÍTICAS DE LA TABLA USERS

-- 1. Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Public users are viewable by everyone." ON public.users;
DROP POLICY IF EXISTS "Users can insert their own user data." ON public.users;
DROP POLICY IF EXISTS "Users can update own user data." ON public.users;
DROP POLICY IF EXISTS "Superadmins can view all users" ON public.users;

-- 2. Asegurar que RLS esté habilitado
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. Crear políticas nuevas y claras

-- Política 1: Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = user_id);

-- Política 2: Los superadmins pueden ver TODOS los perfiles
CREATE POLICY "Superadmins can view all profiles" ON public.users
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.users WHERE role = 'superadmin'
    )
  );

-- Política 3: Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = user_id);

-- Política 4: Sistema puede insertar nuevos usuarios (para el trigger)
CREATE POLICY "Allow system insert" ON public.users
  FOR INSERT WITH CHECK (true);

-- 4. Verificar que las políticas se crearon correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'users';
