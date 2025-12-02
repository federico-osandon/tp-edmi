-- SOLUCIÓN "A PRUEBA DE FALLOS"
-- El problema es que un trigger oculto intenta crear un perfil incompleto y falla
-- porque nuestra tabla es muy estricta. Vamos a relajar la tabla.

-- 1. Hacer que email y role sean opcionales (NULLABLE)
ALTER TABLE public.profiles ALTER COLUMN email DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN role DROP NOT NULL;

-- 2. Eliminar la restricción de check del rol temporalmente (o hacerla más permisiva)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('student', 'instructor') OR role IS NULL);

-- 3. Asegurar que RLS permite inserciones del sistema (si el trigger usa security definer)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
