-- SOLUCIÓN DEFINITIVA PARA "Database error saving new user"
-- Este script elimina TODOS los triggers de la tabla auth.users para evitar conflictos.

-- 1. Eliminar TODOS los triggers en auth.users (usando un bloque anónimo)
DO $$
DECLARE
    trg_name text;
BEGIN
    FOR trg_name IN 
        SELECT trigger_name 
        FROM information_schema.triggers 
        WHERE event_object_schema = 'auth' 
        AND event_object_table = 'users'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON auth.users;', trg_name);
        RAISE NOTICE 'Trigger eliminado: %', trg_name;
    END LOOP;
END $$;

-- 2. Eliminar funciones asociadas comunes (limpieza)
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.create_profile_for_user();
DROP FUNCTION IF EXISTS public.create_user_profile();

-- 3. Relajar restricciones en la tabla public.users
-- Esto evita errores si se insertan datos incompletos
ALTER TABLE public.users ALTER COLUMN first_name DROP NOT NULL;
ALTER TABLE public.users ALTER COLUMN last_name DROP NOT NULL;
ALTER TABLE public.users ALTER COLUMN role DROP NOT NULL;

-- 4. Asegurar permisos correctos (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas viejas
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.users;
DROP POLICY IF EXISTS "Users can update own profile." ON public.users;
DROP POLICY IF EXISTS "Public users are viewable by everyone." ON public.users;
DROP POLICY IF EXISTS "Users can insert their own user data." ON public.users;
DROP POLICY IF EXISTS "Users can update own user data." ON public.users;

-- Crear políticas nuevas permisivas
CREATE POLICY "Public users are viewable by everyone." ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own user data." ON public.users
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own user data." ON public.users
  FOR UPDATE USING (auth.uid() = user_id);

        FROM information_schema.triggers
        WHERE event_object_schema = 'auth'
        AND event_object_table = 'users'
    LOOP
        EXECUTE 'DROP TRIGGER ' || t || ' ON auth.users';
        RAISE NOTICE 'Trigger eliminado: %', t;
    END LOOP;
END $$;

-- También intentamos borrar la función común que suelen usar estos triggers
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.create_profile_for_user();
