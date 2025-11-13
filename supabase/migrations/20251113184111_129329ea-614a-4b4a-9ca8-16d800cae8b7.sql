-- Удаляем политику, которая разрешает всем отправлять сообщения
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;

-- Создаем новую политику, которая требует авторизации
CREATE POLICY "Only authenticated users can submit contact messages"
ON public.contact_messages
FOR INSERT
TO authenticated
WITH CHECK (true);