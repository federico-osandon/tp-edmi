-- EMERGENCY RESET
-- Ejecuta esto para borrar la tabla profiles y CUALQUIER trigger/función que dependa de ella.
-- Esto eliminará los triggers conflictivos por fuerza bruta.

-- 1. Borrar tabla y dependencias (incluyendo triggers que usen funciones ligadas)
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Borrar funciones comunes de triggers (con CASCADE para borrar los triggers)
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.create_profile_for_user() CASCADE;

-- 3. Recrear la tabla profiles (versión permisiva)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT,
  role TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Habilitar seguridad
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Recrear políticas
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
