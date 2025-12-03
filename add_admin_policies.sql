-- Permitir que los superadmins vean todos los usuarios
DROP POLICY IF EXISTS "Superadmins can view all users" ON public.users;
CREATE POLICY "Superadmins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE user_id = auth.uid() AND role = 'superadmin'
    )
  );
