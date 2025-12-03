-- SOLUCIÓN PARA "EMAIL INVALID" (Posible conflicto de datos huérfanos)
-- Si borraste el usuario de Auth pero quedó en public.users, el registro fallará.
-- Este script limpia los datos huérfanos y mejora el trigger.

-- 1. Limpiar usuarios huérfanos (Están en tu tabla 'users' pero NO en 'auth.users')
-- ¡CUIDADO! Esto borrará datos de usuarios que ya no existen en el sistema de login.
DELETE FROM public.users
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- 2. Mejorar el Trigger para evitar errores si el usuario ya existe
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (user_id, email, role, first_name, last_name)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'role', 'student'), 
    '', 
    ''
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    role = EXCLUDED.role;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Asegurar que el trigger esté activo
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
