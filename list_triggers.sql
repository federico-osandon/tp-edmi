-- Ejecuta esto para ver qué triggers existen realmente en tu tabla auth.users
SELECT 
    trigger_name,
    action_statement
FROM 
    information_schema.triggers 
WHERE 
    event_object_schema = 'auth' 
    AND event_object_table = 'users';
