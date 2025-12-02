-- SOLUCIÓN NUCLEAR
-- Este script busca y elimina TODOS los triggers asociados a la tabla auth.users.
-- Esto solucionará el error "Database error saving new user" garantizado.

DO $$
DECLARE
    t text;
BEGIN
    FOR t IN
        SELECT trigger_name
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
