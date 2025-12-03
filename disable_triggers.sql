-- DESACTIVAR TRIGGERS (INTENTO 2)
-- Ejecuta esto en el Editor SQL de Supabase para desactivar cualquier trigger en la tabla de usuarios.

ALTER TABLE auth.users DISABLE TRIGGER ALL;

-- Asegurar tabla profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT,
  role TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
CREATE POLICY "Enable insert for authenticated users only" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
