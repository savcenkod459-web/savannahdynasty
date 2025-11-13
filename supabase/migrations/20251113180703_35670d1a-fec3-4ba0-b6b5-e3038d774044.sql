-- Исправляем функцию проверки rate limit чтобы работала для всех пользователей
-- Добавляем SECURITY DEFINER чтобы функция выполнялась с правами владельца
DROP FUNCTION IF EXISTS public.check_message_rate_limit(text);

CREATE OR REPLACE FUNCTION public.check_message_rate_limit(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
  RETURN message_count < 3;
END;
$$;

-- Включаем realtime для таблицы contact_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_messages;