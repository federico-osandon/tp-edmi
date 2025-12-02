-- !!! EJECUTAR ESTO EN EL EDITOR SQL DE SUPABASE !!!

-- 1. ELIMINAR TRIGGERS CONFLICTIVOS (CRÍTICO)
-- Este es el paso más importante. El error "Database error saving new user" ocurre
-- porque un trigger antiguo intenta insertar datos en 'profiles' con un formato incorrecto.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Asegurar que la tabla profiles existe y tiene la estructura correcta
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT CHECK (role IN ('student', 'instructor')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Habilitar seguridad (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Recrear políticas de seguridad (para evitar duplicados si ya existen)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
