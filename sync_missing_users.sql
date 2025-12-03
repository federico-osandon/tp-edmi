-- SCRIPT DE SINCRONIZACIÓN (REPARACIÓN)
-- Ejecuta esto para crear los usuarios en public.users que existan en auth.users
-- pero que falten en tu tabla personalizada.

INSERT INTO public.users (user_id, email, role, first_name, last_name)
SELECT 
    id, 
    email, 
    -- Usa el rol de los metadatos, o 'student' por defecto
    COALESCE(raw_user_meta_data->>'role', 'student'), 
    '', 
    ''
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.users);

-- Verificación: Debería mostrar los usuarios recién insertados
SELECT * FROM public.users;
