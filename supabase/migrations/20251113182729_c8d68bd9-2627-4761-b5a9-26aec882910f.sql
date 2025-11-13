-- Удаляем старую политику, которая требует авторизации
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;

-- Создаем новую политику, которая разрешает вставку всем (включая анонимных пользователей)
CREATE POLICY "Anyone can submit contact messages"
ON public.contact_messages
FOR INSERT
TO public
WITH CHECK (true);

-- Также обновляем RPC функцию, чтобы она всегда возвращала boolean
CREATE OR REPLACE FUNCTION public.check_message_rate_limit(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  message_count integer;
BEGIN
  -- Подсчитываем сообщения от этого email за последний час
  SELECT COUNT(*) INTO message_count
  FROM public.contact_messages
  WHERE email = user_email
    AND created_at > NOW() - INTERVAL '1 hour';
  
  -- Возвращаем true если лимит не превышен (максимум 3 сообщения в час)
  -- Всегда возвращаем boolean, никогда NULL
  RETURN COALESCE(message_count < 3, true);
END;
$$;