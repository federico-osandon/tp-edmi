-- Eliminar políticas existentes para empezar limpio
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Allow public read access" ON users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON users;

-- Permitir que cada usuario lea su propio perfil
CREATE POLICY "Users can read own profile"
ON users
FOR SELECT
USING (auth.uid() = user_id);
