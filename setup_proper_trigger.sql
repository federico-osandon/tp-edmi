-- SOLUCIÓN FINAL: TRIGGER CORRECTO
-- Este script configura un trigger seguro que crea el perfil automáticamente
-- cuando un usuario se registra, evitando problemas de permisos (RLS).

-- 1. Limpieza previa (por si acaso)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Función del Trigger (Maneja la creación del usuario en public.users)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (user_id, email, role, first_name, last_name)
  VALUES (
    new.id, 
    new.email, 
    -- Intenta obtener el rol de los metadatos, si no existe usa 'student'
    COALESCE(new.raw_user_meta_data->>'role', 'student'), 
    '', 
    ''
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; -- Importante: SECURITY DEFINER da permisos de admin al trigger

-- 3. Crear el Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Asegurar permisos de lectura/escritura para el usuario dueño
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = user_id);
  
DROP POLICY IF EXISTS "Public users are viewable by everyone." ON public.users;
CREATE POLICY "Public users are viewable by everyone." ON public.users
  FOR SELECT USING (true);
